const OPENVERSE_ENDPOINT = "https://api.openverse.org/v1/images/";

const isAllowedImageUrl = (value = "") => /^https:\/\/api\.openverse\.org\/v1\/images\/[\w-]+\/thumb\//i.test(value) || /^data:image\/[a-z0-9.+-]+;base64,/i.test(value);

export const isSafeImageSource = (value = "") => isAllowedImageUrl(value);

export async function findVocabularyImage(word, context = "", signal) {
  const query = encodeURIComponent(`${String(word || "").trim()} ${String(context || "").trim()}`.trim());
  if (!query) return "";
  for (const category of ["illustration", "photograph"]) {
    const response = await fetch(`${OPENVERSE_ENDPOINT}?q=${query}&category=${category}&license=pdm,cc0,by&filter_dead=true&page_size=5`, { signal });
    if (!response.ok) continue;
    const payload = await response.json();
    const result = payload.results?.find((item) => isAllowedImageUrl(item.thumbnail)) || payload.results?.find((item) => isAllowedImageUrl(item.url));
    if (result?.thumbnail || result?.url) return result.thumbnail || result.url;
  }
  return "";
}

export async function findVocabularyImageSafely(word, context = "") {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 5000);
  try {
    return await findVocabularyImage(word, context, controller.signal);
  } catch {
    return "";
  } finally {
    window.clearTimeout(timeout);
  }
}