/**
 * Bộ nhớ đệm cục bộ (IndexedDB) cho Thư viện Từ vựng.
 *
 * Lợi ích:
 * - Tải 4.000 - 12.000 từ trong ~20-40ms (thay vì 10-20 giây qua mạng Firestore).
 * - Hoạt động cả ở chế độ Khách (Guest) và Đã đăng nhập (Firebase).
 * - Không bị giới hạn dung lượng 5MB của localStorage.
 * - Lưu vết các phiên nạp bộ thẻ lớn để phục hồi nếu người dùng lỡ tải lại trang.
 */

const DB_NAME = "lingua_vocabulary_db";
const DB_VERSION = 1;
const STORE_NAME = "user_libraries";
const PENDING_IMPORT_KEY = "lingua_pending_deck_import";

const isBrowser = typeof window !== "undefined" && typeof indexedDB !== "undefined";

let dbPromise = null;

const getDb = () => {
  if (!isBrowser) return Promise.resolve(null);
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve) => {
    try {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: "userId" });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = (err) => {
        console.warn("Không thể mở IndexedDB cho từ vựng, chuyển sang fallback:", err);
        resolve(null);
      };
    } catch {
      resolve(null);
    }
  });

  return dbPromise;
};

/** Đọc thư viện từ vựng đã lưu trong IndexedDB theo userId (hoặc 'guest'). */
export async function loadCachedLibrary(userId = "guest") {
  if (!isBrowser) return null;
  const db = await getDb();
  if (!db) return null;

  return new Promise((resolve) => {
    try {
      const transaction = db.transaction([STORE_NAME], "readonly");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(userId);
      request.onsuccess = () => {
        const data = request.result;
        if (data && Array.isArray(data.decks) && Array.isArray(data.cards)) {
          resolve({ decks: data.decks, cards: data.cards, updatedAt: data.updatedAt || 0 });
        } else {
          resolve(null);
        }
      };
      request.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

/** Lưu thư viện từ vựng vào IndexedDB theo userId (bảo toàn decks/cards nếu chỉ truyền 1 trong 2). */
export async function saveCachedLibrary(userId = "guest", { decks, cards } = {}) {
  if (!isBrowser) return;
  const db = await getDb();
  if (!db) return;

  return new Promise((resolve) => {
    try {
      const transaction = db.transaction([STORE_NAME], "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const getReq = store.get(userId);
      getReq.onsuccess = () => {
        const existing = getReq.result || {};
        const safeDecks = Array.isArray(decks) && decks.length > 0 ? decks : (existing.decks || []);
        const safeCards = Array.isArray(cards) && cards.length > 0 ? cards : (existing.cards || []);
        store.put({
          userId,
          decks: safeDecks,
          cards: safeCards,
          updatedAt: Date.now(),
        });
      };
      transaction.oncomplete = () => resolve(true);
      transaction.onerror = () => resolve(false);
    } catch {
      resolve(false);
    }
  });
}

/** Xoá bộ đệm của một user (dùng khi đăng xuất hoặc xoá dữ liệu khách). */
export async function clearCachedLibrary(userId = "guest") {
  if (!isBrowser) return;
  const db = await getDb();
  if (!db) return;

  return new Promise((resolve) => {
    try {
      const transaction = db.transaction([STORE_NAME], "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      store.delete(userId);
      transaction.oncomplete = () => resolve(true);
      transaction.onerror = () => resolve(false);
    } catch {
      resolve(false);
    }
  });
}

// --- Theo dõi tác vụ nạp bộ thẻ dở dang (để phục hồi khi F5) -----------------

export function getPendingDeckImport() {
  if (!isBrowser) return null;
  try {
    const raw = localStorage.getItem(PENDING_IMPORT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function savePendingDeckImport(importInfo) {
  if (!isBrowser) return;
  try {
    localStorage.setItem(PENDING_IMPORT_KEY, JSON.stringify({
      ...importInfo,
      timestamp: Date.now(),
    }));
  } catch {}
}

export function updatePendingDeckImportProgress(completed) {
  if (!isBrowser) return;
  try {
    const current = getPendingDeckImport();
    if (current) {
      localStorage.setItem(PENDING_IMPORT_KEY, JSON.stringify({
        ...current,
        completed,
        updatedAt: Date.now(),
      }));
    }
  } catch {}
}

export function clearPendingDeckImport() {
  if (!isBrowser) return;
  try {
    localStorage.removeItem(PENDING_IMPORT_KEY);
  } catch {}
}
