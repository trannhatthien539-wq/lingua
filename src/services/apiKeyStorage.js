export const PROVIDER_STORAGE = "lingua-ai-provider";

export const getApiKeyStorageKey = (user) =>
  user ? `lingua_key_${user.uid}` : "lingua_guest_api_key";

export const readApiKey = (user) =>
  user ? localStorage.getItem(getApiKeyStorageKey(user)) || "" : "";
