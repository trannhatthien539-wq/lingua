import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db, onAuthStateChanged } from "./firebase";
import { utf8ByteLength } from "../utils/utf8";
import { markSynced, reportSyncError, trackPendingWrite } from "./syncStatus";
import {
  cancelAllDocQueues,
  createOwnerPinnedQueue,
  flushAllDocQueues,
} from "./userDocQueue";

/**
 * Lưu trạng thái của từng module (kế hoạch học, mindmap, bản nháp ngữ pháp, nhắc học,
 * lịch sử học tập) theo tài khoản, kèm bản sao trên thiết bị để dùng được khi ngoại tuyến.
 *
 * Cấu trúc cloud: collection `user_state`, doc `<uid>__<key>` -> { userId, key, payload, updatedAt }
 * Cấu trúc local:  localStorage `lingua-user-state-<owner>__<key>` -> { payload, updatedAt }
 *
 * Mọi hook cùng đọc/ghi một tài liệu sẽ dùng chung một store trong bộ nhớ
 * (`getUserDocStore`) để không còn cảnh mỗi hook giữ một bản state lệch nhau.
 */
const COLLECTION = "user_state";
const MAX_PAYLOAD_BYTES = 900_000;

const owner = (uid) => uid || "guest";
const localKey = (key, uid) => `lingua-user-state-${owner(uid)}__${key}`;
export const userDocId = (key, uid) => `${owner(uid)}__${key}`;

const normalizePayload = (payload) => JSON.parse(JSON.stringify(payload ?? null));

export const readLocalUserDoc = (key, uid) => {
  try {
    const stored = JSON.parse(localStorage.getItem(localKey(key, uid)));
    return stored && typeof stored === "object" && "payload" in stored ? stored : null;
  } catch {
    return null;
  }
};

const writeLocalUserDoc = (key, envelope, uid) => {
  try {
    localStorage.setItem(localKey(key, uid), JSON.stringify(envelope));
    return true;
  } catch {
    return false;
  }
};

const updatedAtOf = (envelope) => Number(envelope?.updatedAt) || 0;

/* ------------------------------------------------------------------ *
 * Store dùng chung cho UI
 * ------------------------------------------------------------------ */

const docStores = new Map();

const createDocStore = () => {
  let snapshot = { value: undefined, ready: false, updatedAt: 0 };
  const listeners = new Set();
  const emit = () => listeners.forEach((listener) => listener());

  return {
    subscribe: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    getSnapshot: () => snapshot,
    setValue: (value, { ready = true, updatedAt = Date.now() } = {}) => {
      if (snapshot.value === value && snapshot.ready === ready && snapshot.updatedAt === updatedAt) return;
      snapshot = { value, ready, updatedAt };
      emit();
    },
    markReady: () => {
      if (snapshot.ready) return;
      snapshot = { ...snapshot, ready: true };
      emit();
    },
  };
};

/** Store UI theo key + chủ sở hữu; mọi hook cùng key sẽ nhận đúng một nguồn dữ liệu. */
export const getUserDocStore = (key, uid) => {
  const id = userDocId(key, uid);
  if (!docStores.has(id)) docStores.set(id, createDocStore());
  return docStores.get(id);
};

/* ------------------------------------------------------------------ *
 * Chủ sở hữu đang hoạt động (để hook đổi store khi đăng nhập/đăng xuất)
 * ------------------------------------------------------------------ */

let activeOwnerUid = auth.currentUser?.uid || null;
const ownerListeners = new Set();

onAuthStateChanged(auth, (user) => {
  const uid = user?.uid || null;
  if (uid === activeOwnerUid) return;
  activeOwnerUid = uid;
  ownerListeners.forEach((listener) => listener());
});

export const getUserDocOwner = () => activeOwnerUid;

export const subscribeUserDocOwner = (listener) => {
  ownerListeners.add(listener);
  return () => ownerListeners.delete(listener);
};

/* ------------------------------------------------------------------ *
 * Tải / ghi tài liệu
 * ------------------------------------------------------------------ */

let authSettlePromise = null;

/**
 * Firebase khôi phục phiên đăng nhập KHÔNG đồng bộ: ngay sau khi mở app `auth.currentUser`
 * còn `null` dù người dùng đã đăng nhập. Nếu đọc/ghi ngay lúc đó thì sẽ dùng nhầm bản của
 * khách (mất dữ liệu và UI hiện giá trị mặc định) — đây chính là lỗi "giờ nhắc bị reset".
 *
 * Chờ 1 nhịp `onAuthStateChanged` (tối đa `timeout`) rồi mới xác định chủ sở hữu.
 */
export const whenAuthSettled = (timeout = 4000) => {
  if (auth.currentUser) return Promise.resolve(auth.currentUser);
  if (!authSettlePromise) {
    authSettlePromise = new Promise((resolve) => {
      const timer = setTimeout(() => resolve(auth.currentUser), timeout);
      const unsubscribe = onAuthStateChanged(auth, () => {
        clearTimeout(timer);
        unsubscribe();
        resolve(auth.currentUser);
      });
    });
  }
  return authSettlePromise;
};

const currentUser = async () => auth.currentUser || (await whenAuthSettled());

/** Đọc nhanh bản trên thiết bị của chủ sở hữu hiện tại (không chờ mạng). */
export const readCachedUserDoc = (key) => readLocalUserDoc(key, activeOwnerUid)?.payload ?? null;

const envelopeCache = new Map();
const loadingDocs = new Map();

const cacheEnvelope = (key, uid, envelope) => {
  envelopeCache.set(userDocId(key, uid), envelope);
  return envelope;
};

const pushEnvelopeToRemote = (key, uid, envelope) =>
  trackPendingWrite(async () => {
    await setDoc(doc(db, COLLECTION, userDocId(key, uid)), {
      userId: uid,
      key,
      payload: envelope.payload ?? {},
      updatedAt: updatedAtOf(envelope),
    });
    return envelope;
  });

export const loadUserDoc = async (key, { force = false } = {}) => {
  const user = await currentUser();
  const uid = user?.uid || null;
  const id = userDocId(key, uid);

  if (!force && envelopeCache.has(id)) return envelopeCache.get(id);
  if (loadingDocs.has(id)) return loadingDocs.get(id);

  const task = (async () => {
    const local = readLocalUserDoc(key, uid);
    if (!user) return cacheEnvelope(key, uid, local);

    let snapshot;
    try {
      snapshot = await getDoc(doc(db, COLLECTION, id));
    } catch (error) {
      // Ngoại tuyến: vẫn dùng được bản local thay vì làm hỏng cả màn hình.
      if (local) return cacheEnvelope(key, uid, local);
      throw error;
    }

    const remote = snapshot.exists() ? snapshot.data() : null;
    const localTime = updatedAtOf(local);
    const remoteTime = updatedAtOf(remote);

    // Không có bản cloud hoặc bản local mới hơn (sửa lúc ngoại tuyến, vừa nâng cấp…):
    // chủ động đẩy chính bản local đó lên, giữ nguyên timestamp để lần sau vẫn so sánh đúng.
    if (local && (!remote || localTime > remoteTime)) {
      try {
        await pushEnvelopeToRemote(key, user.uid, local);
      } catch (error) {
        reportSyncError(error?.message);
      }
      return cacheEnvelope(key, uid, local);
    }

    if (!remote || !remoteTime) return cacheEnvelope(key, uid, local);

    const envelope = { payload: remote.payload ?? null, updatedAt: remoteTime };
    writeLocalUserDoc(key, envelope, uid);
    return cacheEnvelope(key, uid, envelope);
  })().finally(() => {
    loadingDocs.delete(id);
  });

  loadingDocs.set(id, task);
  return task;
};

export const saveUserDoc = async (key, payload, options = {}) => {
  const hasPinnedOwner = Object.prototype.hasOwnProperty.call(options, "uid");
  const uid = hasPinnedOwner ? (options.uid ?? null) : (await currentUser())?.uid || null;
  const normalized = normalizePayload(payload);
  const serialized = JSON.stringify(normalized);
  if (utf8ByteLength(serialized) > MAX_PAYLOAD_BYTES) {
    throw new Error("Dữ liệu quá lớn để đồng bộ đám mây. Hãy giảm bớt nội dung hoặc xuất file sao lưu.");
  }

  const envelope = {
    payload: normalized,
    updatedAt: Number(options.updatedAt) || Date.now(),
  };
  if (!writeLocalUserDoc(key, envelope, uid)) {
    throw new Error("Không thể lưu dữ liệu trên thiết bị. Bộ nhớ trình duyệt có thể đã đầy hoặc bị chặn.");
  }
  cacheEnvelope(key, uid, envelope);
  if (!uid) return envelope;

  return pushEnvelopeToRemote(key, uid, envelope);
};

/** Đẩy dữ liệu khách đang có trên thiết bị lên tài khoản vừa đăng nhập (nếu tài khoản chưa có). */
export const syncGuestUserDocs = async (keys = []) => {
  const user = await currentUser();
  if (!user) return [];
  const synced = [];
  for (const key of keys) {
    const guestDoc = readLocalUserDoc(key, null);
    if (!guestDoc?.payload) continue;
    const remote = await getDoc(doc(db, COLLECTION, userDocId(key, user.uid)));
    if (remote.exists() && updatedAtOf(remote.data()) >= updatedAtOf(guestDoc)) continue;
    await saveUserDoc(key, guestDoc.payload, { uid: user.uid, updatedAt: updatedAtOf(guestDoc) });
    localStorage.removeItem(localKey(key, null));
    envelopeCache.delete(userDocId(key, null));
    synced.push(key);
  }
  if (synced.length) markSynced();
  return synced;
};

export const userDocKeys = {
  planner: "planner",
  mindmap: "mindmap",
  grammar: "grammar",
  writing: "writing",
  skills: "skills",
  reminder: "reminder",
  history: "history",
  goal: "goal",
  vstep: "vstep",
  /** Sổ câu sai dùng chung cho Nghe / Đọc / VSTEP. */
  mistakes: "mistakes",
};

/**
 * Ghi có debounce: giữ bản trên thiết bị sau khi hết debounce, đẩy lên đám mây cùng lúc.
 * `owner` được khóa tại thời điểm `schedule`, không đọc lại lúc flush.
 */
export const createDebouncedSync = (key, delay = 900) => {
  const queue = createOwnerPinnedQueue({
    key,
    delay,
    ownerOf: () => auth.currentUser?.uid || null,
    save: (payload, ownerUid, updatedAt) =>
      saveUserDoc(key, payload, { uid: ownerUid, updatedAt }),
  });

  let attached = false;

  const flushOnHide = () => {
    if (typeof document === "undefined") return;
    if (document.visibilityState === "hidden") queue.flush().catch(() => {});
  };
  const flushOnPageHide = () => {
    queue.flush().catch(() => {});
  };

  const attach = () => {
    if (attached || typeof window === "undefined") return;
    document.addEventListener("visibilitychange", flushOnHide);
    window.addEventListener("pagehide", flushOnPageHide);
    attached = true;
  };

  const dispose = () => {
    if (attached) {
      document.removeEventListener("visibilitychange", flushOnHide);
      window.removeEventListener("pagehide", flushOnPageHide);
      attached = false;
    }
    // Giữ hành vi cũ: rời trang khi còn thay đổi chưa ghi thì flush nốt.
    queue.flush().catch(() => {});
    queue.dispose();
  };

  return {
    key,
    attach,
    schedule: queue.schedule,
    flush: queue.flush,
    cancel: queue.cancel,
    dispose,
  };
};

/** Flush toàn bộ hàng đợi (gọi và await trước khi signOut). */
export const flushAllUserDocs = () => flushAllDocQueues();

/** Hủy mọi lệnh đang chờ (gọi sau khi đã đổi tài khoản). */
export const cancelAllUserDocs = () => cancelAllDocQueues();
