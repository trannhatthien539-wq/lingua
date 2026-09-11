const OPENVERSE_ENDPOINT = "https://api.openverse.org/v1/images/";

const isAllowedImageUrl = (value = "") => /^https:\/\/api\.openverse\.org\/v1\/images\/[\w-]+\/thumb\//i.test(value) || /^data:image\/[a-z0-9.+-]+;base64,/i.test(value);

export const isSafeImageSource = (value = "") => isAllowedImageUrl(value);

export async function findVocabularyImage(word, signal) {
  const query = encodeURIComponent(String(word || "").trim());
  if (!query) return "";
  const response = await fetch(`${OPENVERSE_ENDPOINT}?q=${query}&category=illustration&license=pdm,cc0,by&filter_dead=true&page_size=5`, { signal });
  if (!response.ok) throw new Error(`Openverse image search failed: ${response.status}`);
  const payload = await response.json();
  const result = payload.results?.find((item) => isAllowedImageUrl(item.thumbnail)) || payload.results?.find((item) => isAllowedImageUrl(item.url));
  return result?.thumbnail || result?.url || "";
}

export async function findVocabularyImageSafely(word) {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 5000);
  try {
    return await findVocabularyImage(word, controller.signal);
  } catch {
    return "";
  } finally {
    window.clearTimeout(timeout);
  }
}