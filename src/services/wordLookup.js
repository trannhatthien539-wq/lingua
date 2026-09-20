/**
 * Tra từ nhanh khi người dùng bấm vào một từ trong bài đọc / transcript.
 *
 * - Kết quả được lưu đệm trong localStorage (`lingua-word-cache`) để lần sau hiện ngay,
 *   tránh gọi lại API từ điển miễn phí quá nhiều lần.
 * - `lookupWordCached` không bao giờ throw: lỗi mạng trả về kết quả rỗng kèm cờ `error`.
 */
import { lookupWordOffline, normalizeLookupTerm } from "./dictionaryService";

const CACHE_KEY = "lingua-word-cache";
const MAX_ENTRIES = 400;

const readCache = () => {
  try {
    const raw = JSON.parse(localStorage.getItem(CACHE_KEY) || "{}");
    return raw && typeof raw === "object" ? raw : {};
  } catch {
    return {};
  }
};

const writeCache = (cache) => {
  try {
    const entries = Object.entries(cache);
    const trimmed = entries.length > MAX_ENTRIES ? Object.fromEntries(entries.slice(-MAX_ENTRIES)) : cache;
    localStorage.setItem(CACHE_KEY, JSON.stringify(trimmed));
  } catch {
    // Hết dung lượng thì bỏ qua, lần sau tra lại.
  }
};

const memory = new Map();

export const normalizeLookupWord = (word) =>
  normalizeLookupTerm(word)
    .toLowerCase()
    .replace(/^[^a-z]+|[^a-z']+$/g, "");

/** Số từ đã lưu đệm (dùng để hiển thị trong phần cài đặt). */
export const lookupCacheSize = () => Object.keys(readCache()).length;

export const clearLookupCache = () => {
  memory.clear();
  try {
    localStorage.removeItem(CACHE_KEY);
  } catch {
    // bỏ qua
  }
};

/** Lấy kết quả đã lưu đệm (không gọi mạng). */
export const getCachedWord = (word) => {
  const key = normalizeLookupWord(word);
  if (!key) return null;
  if (memory.has(key)) return memory.get(key);
  const found = readCache()[key] || null;
  if (found) memory.set(key, found);
  return found;
};

const remember = (entry) => {
  memory.set(entry.word, entry);
  const cache = readCache();
  cache[entry.word] = entry;
  writeCache(cache);
  return entry;
};

/**
 * Tra một từ: dùng đệm trước, nếu chưa có thì gọi từ điển miễn phí + dịch sang tiếng Việt.
 * Trả về `{ word, ipa, meaning, definition, example, cached, error? }`.
 */
export const lookupWordCached = async (word) => {
  const key = normalizeLookupWord(word);
  if (!key) return { word: "", ipa: "", meaning: "", definition: "", example: "", error: "empty" };

  const cached = getCachedWord(key);
  if (cached) return { ...cached, cached: true };

  try {
    const result = await lookupWordOffline(key);
    return remember({
      word: result.word || key,
      ipa: result.ipa || "",
      meaning: result.meaning || "",
      definition: result.definition || "",
      example: result.example || "",
      synonyms: Array.isArray(result.synonyms) ? result.synonyms.slice(0, 4) : [],
      at: new Date().toISOString(),
    });
  } catch (error) {
    return {
      word: key,
      ipa: "",
      meaning: "",
      definition: "",
      example: "",
      cached: false,
      error: error?.message || "lookup-failed",
    };
  }
};

/**
 * Tạo (nếu cần) bộ thẻ dùng chung cho từ tra nhanh, rồi thêm thẻ vào bộ đó.
 * Trả về `{ deck, created }`.
 */
export const DEFAULT_LOOKUP_DECK = "Từ vựng tra nhanh";

export const cardFromLookup = (entry, deckId) => ({
  deckId,
  word: entry.word,
  ipa: entry.ipa || "",
  meaning: entry.meaning || entry.definition || "",
  example: entry.example || "",
  level: entry.level || "B1",
  status: "new",
  nextReviewDate: new Date().toISOString().slice(0, 10),
});
