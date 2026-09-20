/**
 * Tra từ miễn phí, không cần API key:
 * - api.dictionaryapi.dev  → IPA, ví dụ, audio, định nghĩa tiếng Anh
 * - MyMemory               → dịch nghĩa sang tiếng Việt
 * Dùng làm phương án dự phòng khi người dùng chưa lưu API key AI (hoặc AI báo lỗi).
 */
const DICTIONARY_ENDPOINT = "https://api.dictionaryapi.dev/api/v2/entries/en";
const TRANSLATE_ENDPOINT = "https://api.mymemory.translated.net/get";
const REQUEST_TIMEOUT = 9000;

export const normalizeLookupTerm = (word = "") => String(word).trim().replace(/\s+/g, " ");

const requestJson = async (url) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);
  try {
    const response = await fetch(url, { signal: controller.signal, headers: { Accept: "application/json" } });
    if (!response.ok) {
      throw new Error(
        response.status === 404
          ? "Không tìm thấy từ này trong từ điển miễn phí."
          : `Từ điển trả về lỗi ${response.status}. Vui lòng thử lại.`,
      );
    }
    return await response.json();
  } catch (error) {
    if (error?.name === "AbortError") {
      throw new Error("Tra từ quá lâu. Kiểm tra mạng rồi thử lại nhé.", { cause: error });
    }
    throw error;
  } finally {
    clearTimeout(timer);
  }
};

const firstFilled = (values) => values.find((value) => Boolean(value && String(value).trim())) || "";

export async function lookupEnglishWord(word) {
  const term = normalizeLookupTerm(word).toLowerCase();
  if (!term) throw new Error("Hãy nhập từ cần tra.");
  const payload = await requestJson(`${DICTIONARY_ENDPOINT}/${encodeURIComponent(term)}`);
  const entry = Array.isArray(payload) ? payload[0] : null;
  if (!entry) throw new Error("Không tìm thấy từ này trong từ điển miễn phí.");
  const meanings = entry.meanings || [];
  return {
    word: entry.word || term,
    ipa: firstFilled([entry.phonetic, ...(entry.phonetics || []).map((item) => item.text)]),
    audioUrl: firstFilled((entry.phonetics || []).map((item) => item.audio)),
    partOfSpeech: meanings[0]?.partOfSpeech || "",
    definition:
      firstFilled(meanings.flatMap((meaning) => (meaning.definitions || []).map((item) => item.definition))) || "",
    example: firstFilled(meanings.flatMap((meaning) => (meaning.definitions || []).map((item) => item.example))),
  };
}

export async function translateToVietnamese(text) {
  const value = normalizeLookupTerm(text);
  if (!value) return "";
  // MyMemory giới hạn ~500 ký tự cho mỗi truy vấn ẩn danh.
  const url = `${TRANSLATE_ENDPOINT}?q=${encodeURIComponent(value.slice(0, 450))}&langpair=en|vi`;
  const payload = await requestJson(url);
  const translated = payload?.responseData?.translatedText || "";
  if (!translated || /MYMEMORY WARNING/i.test(translated)) {
    throw new Error("Dịch vụ dịch đang bận. Vui lòng thử lại sau ít phút.");
  }
  return translated.trim();
}

/** Kết quả tra từ đầy đủ để đưa thẳng vào thẻ từ vựng. */
export async function lookupWordOffline(word) {
  const dictionary = await lookupEnglishWord(word);
  const meaning = await translateToVietnamese(dictionary.definition || dictionary.word).catch(() => "");
  return {
    word: dictionary.word,
    ipa: dictionary.ipa,
    meaning: meaning || dictionary.definition,
    definition: dictionary.definition,
    example: dictionary.example,
    audioUrl: dictionary.audioUrl,
    source: meaning ? "dictionary" : "dictionary-english",
  };
}
