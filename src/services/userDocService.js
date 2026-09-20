import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "./firebase";
import { markSynced, trackPendingWrite } from "./syncStatus";

/**
 * Lưu trạng thái của từng module (kế hoạch học, mindmap, bản nháp ngữ pháp, nhắc học,
 * lịch sử học tập) theo tài khoản, kèm bản sao trên thiết bị để dùng được khi ngoại tuyến.
 *
 * Cấu trúc cloud: collection `user_state`, doc `<uid>__<key>` -> { userId, key, payload, updatedAt }
 * Cấu trúc local:  localStorage `lingua-user-state-<owner>__<key>` -> { payload, updatedAt }
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
  } catch {
    // Bỏ qua khi localStorage đầy hoặc bị chặn.
  }
};

const updatedAtOf = (envelope) => Number(envelope?.updatedAt) || 0;

export const loadUserDoc = async (key) => {
  const user = auth.currentUser;
  const local = readLocalUserDoc(key, user?.uid);
  if (!user) return local;

  const snapshot = await getDoc(doc(db, COLLECTION, userDocId(key, user.uid)));
  const remote = snapshot.exists() ? snapshot.data() : null;
  if (!remote || !updatedAtOf(remote)) return local;

  // Bản trên máy mới hơn (ví dụ vừa sửa lúc ngoại tuyến) thì giữ lại và đẩy lên sau.
  if (updatedAtOf(local) > updatedAtOf(remote)) return local;

  const envelope = { payload: remote.payload ?? null, updatedAt: updatedAtOf(remote) };
  writeLocalUserDoc(key, envelope, user.uid);
  return envelope;
};

export const saveUserDoc = async (key, payload) => {
  const user = auth.currentUser;
  const normalized = normalizePayload(payload);
  const serialized = JSON.stringify(normalized);
  if (serialized.length > MAX_PAYLOAD_BYTES) {
    throw new Error("Dữ liệu quá lớn để đồng bộ đám mây. Hãy giảm bớt nội dung hoặc xuất file sao lưu.");
  }
  const envelope = { payload: normalized, updatedAt: Date.now() };
  writeLocalUserDoc(key, envelope, user?.uid);
  if (!user) return envelope;

  return trackPendingWrite(async () => {
    await setDoc(doc(db, COLLECTION, userDocId(key, user.uid)), {
      userId: user.uid,
      key,
      payload: normalized ?? {},
      updatedAt: envelope.updatedAt,
    });
    return envelope;
  });
};

/** Đẩy dữ liệu khách đang có trên thiết bị lên tài khoản vừa đăng nhập (nếu tài khoản chưa có). */
export const syncGuestUserDocs = async (keys = []) => {
  const user = auth.currentUser;
  if (!user) return [];
  const synced = [];
  for (const key of keys) {
    const guestDoc = readLocalUserDoc(key, null);
    if (!guestDoc?.payload) continue;
    const remote = await getDoc(doc(db, COLLECTION, userDocId(key, user.uid)));
    if (remote.exists() && updatedAtOf(remote.data()) >= updatedAtOf(guestDoc)) continue;
    await saveUserDoc(key, guestDoc.payload);
    localStorage.removeItem(localKey(key, null));
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
};

/**
 * Ghi có debounce: giữ bản trên thiết bị ngay, đẩy lên đám mây sau khi người dùng ngừng thao tác.
 */
export const createDebouncedSync = (key, delay = 900) => {
  let timer = null;
  let pending;

  const flush = async () => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    if (pending === undefined) return null;
    const payload = pending;
    pending = undefined;
    return saveUserDoc(key, payload);
  };

  const schedule = (payload) => {
    pending = payload;
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      flush().catch(() => {
        // Lỗi đã được ghi nhận vào trạng thái đồng bộ, bản trên thiết bị vẫn còn.
      });
    }, delay);
  };

  const flushOnHide = () => {
    if (typeof document === "undefined") return;
    if (document.visibilityState === "hidden") flush().catch(() => {});
  };

  if (typeof window !== "undefined") {
    document.addEventListener("visibilitychange", flushOnHide);
    window.addEventListener("pagehide", () => {
      flush().catch(() => {});
    });
  }

  return { key, schedule, flush };
};
