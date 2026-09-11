export const PROVIDER_STORAGE = "lingua-ai-provider";
export const GUEST_API_KEY_STORAGE = "lingua_api_key_guest";

export const getApiKeyStorageKey = (user) =>
  user ? `lingua_api_key_${user.uid}` : GUEST_API_KEY_STORAGE;

export const readApiKey = (user) =>
  localStorage.getItem(getApiKeyStorageKey(user)) || "";

export const readApiKeyForUser = (user) => {
  if (!user) return readApiKey(null);
  const userKey = readApiKey(user);
  if (userKey) return userKey;
  const guestKey = readApiKey(null);
  if (!guestKey) return "";
  localStorage.setItem(getApiKeyStorageKey(user), guestKey);
  localStorage.removeItem(GUEST_API_KEY_STORAGE);
  return guestKey;
};
