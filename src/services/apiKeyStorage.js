export const PROVIDER_STORAGE = "lingua-ai-provider";
export const GUEST_API_KEY_STORAGE = "lingua_api_key_guest";

const rememberKey = (user) => `${getApiKeyStorageKey(user)}__remember`;

const getStorage = (name) => {
  try {
    if (typeof window !== "undefined" && window[name]) return window[name];
    if (globalThis[name]) return globalThis[name];
  } catch {
    // Trình duyệt chặn storage (chế độ riêng tư / chính sách doanh nghiệp).
  }
  return null;
};

const read = (storage, key) => storage?.getItem(key) || "";

export const getApiKeyStorageKey = (user) =>
  user ? `lingua_api_key_${user.uid}` : GUEST_API_KEY_STORAGE;

/**
 * Key mặc định chỉ sống trong phiên tab hiện tại (sessionStorage).
 * Người dùng có thể chủ động chọn ghi nhớ trên thiết bị; khi đó mới dùng localStorage.
 */
export const isApiKeyRemembered = (user) => read(getStorage("localStorage"), rememberKey(user)) === "1";

export const readApiKey = (user) => {
  const storageKey = getApiKeyStorageKey(user);
  return read(getStorage("sessionStorage"), storageKey) || read(getStorage("localStorage"), storageKey);
};

/**
 * Bản cũ lưu mọi key trong localStorage mà không có cờ ghi nhớ. Chuyển sang
 * sessionStorage để mặc định mới an toàn hơn; người dùng có thể tick ghi nhớ lại.
 */
const migrateLegacyKey = (user) => {
  const local = getStorage("localStorage");
  const session = getStorage("sessionStorage");
  const storageKey = getApiKeyStorageKey(user);
  if (!local || !session) return;
  if (local.getItem(rememberKey(user)) === "1") return;
  const legacy = local.getItem(storageKey);
  if (!legacy) return;
  if (!session.getItem(storageKey)) session.setItem(storageKey, legacy);
  local.removeItem(storageKey);
};

export const readApiKeyForUser = (user) => {
  if (!user) {
    migrateLegacyKey(null);
    return readApiKey(null);
  }

  migrateLegacyKey(user);
  const userKey = readApiKey(user);
  if (userKey) return userKey;

  // Khách vừa đăng nhập: mang key đang dùng sang tài khoản, giữ đúng lựa chọn ghi nhớ.
  const guestRemembered = isApiKeyRemembered(null);
  migrateLegacyKey(null);
  const guestKey = readApiKey(null);
  if (!guestKey) return "";
  writeApiKey(user, guestKey, { remember: guestRemembered });
  clearApiKey(null);
  return guestKey;
};

export const writeApiKey = (user, value, { remember = false } = {}) => {
  const storageKey = getApiKeyStorageKey(user);
  const session = getStorage("sessionStorage");
  const local = getStorage("localStorage");
  const next = String(value || "").trim();

  if (!next) {
    clearApiKey(user);
    return;
  }

  if (remember) {
    local?.setItem(storageKey, next);
    local?.setItem(rememberKey(user), "1");
    session?.removeItem(storageKey);
  } else {
    session?.setItem(storageKey, next);
    local?.removeItem(storageKey);
    local?.removeItem(rememberKey(user));
  }
};

export const clearApiKey = (user) => {
  const storageKey = getApiKeyStorageKey(user);
  getStorage("sessionStorage")?.removeItem(storageKey);
  getStorage("localStorage")?.removeItem(storageKey);
  getStorage("localStorage")?.removeItem(rememberKey(user));
};
