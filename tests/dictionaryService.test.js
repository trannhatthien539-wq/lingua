import test from "node:test";
import assert from "node:assert/strict";
import { lookupEnglishWord, lookupWordOffline, translateToVietnamese } from "../src/services/dictionaryService.js";

const withMockFetch = async (handler, run) => {
  const original = globalThis.fetch;
  globalThis.fetch = handler;
  try {
    return await run();
  } finally {
    globalThis.fetch = original;
  }
};

const jsonResponse = (payload, ok = true, status = 200) => ({
  ok,
  status,
  json: async () => payload,
});

const DICTIONARY_PAYLOAD = [
  {
    word: "resilient",
    phonetic: "/rɪˈzɪliənt/",
    phonetics: [{ text: "/rɪˈzɪliənt/", audio: "https://audio.example/resilient.mp3" }],
    meanings: [
      {
        partOfSpeech: "adjective",
        definitions: [{ definition: "able to recover quickly", example: "She is resilient after setbacks." }],
      },
    ],
  },
];

test("lookupEnglishWord lấy IPA, audio, định nghĩa và ví dụ", async () => {
  const result = await withMockFetch(
    async (url) => {
      assert.match(url, /api\.dictionaryapi\.dev\/api\/v2\/entries\/en\/resilient/);
      return jsonResponse(DICTIONARY_PAYLOAD);
    },
    () => lookupEnglishWord("  Resilient "),
  );
  assert.equal(result.word, "resilient");
  assert.equal(result.ipa, "/rɪˈzɪliənt/");
  assert.equal(result.audioUrl, "https://audio.example/resilient.mp3");
  assert.equal(result.definition, "able to recover quickly");
  assert.equal(result.example, "She is resilient after setbacks.");
  assert.equal(result.partOfSpeech, "adjective");
});

test("từ không tồn tại (404) trả về thông báo tiếng Việt", async () => {
  await assert.rejects(
    () => withMockFetch(async () => jsonResponse({}, false, 404), () => lookupEnglishWord("zzzz")),
    /Không tìm thấy từ này trong từ điển miễn phí/,
  );
});

test("translateToVietnamese trả về câu dịch", async () => {
  const translated = await withMockFetch(
    async (url) => {
      assert.match(url, /mymemory\.translatednet|mymemory\.translated\.net|langpair=en\|vi/);
      return jsonResponse({ responseData: { translatedText: "có khả năng phục hồi nhanh" } });
    },
    () => translateToVietnamese("able to recover quickly"),
  );
  assert.equal(translated, "có khả năng phục hồi nhanh");
});

test("cảnh báo của MyMemory bị coi là lỗi thay vì nghĩa", async () => {
  await assert.rejects(
    () => withMockFetch(async () => jsonResponse({ responseData: { translatedText: "MYMEMORY WARNING: quota" } }), () => translateToVietnamese("hello")),
    /Dịch vụ dịch đang bận/,
  );
});

test("lookupWordOffline ghép từ điển + bản dịch, và vẫn dùng được khi dịch lỗi", async () => {
  const calls = [];
  const result = await withMockFetch(
    async (url) => {
      calls.push(url);
      if (String(url).includes("mymemory")) return jsonResponse({}, false, 429);
      return jsonResponse(DICTIONARY_PAYLOAD);
    },
    () => lookupWordOffline("resilient"),
  );
  assert.equal(calls.length, 2);
  assert.equal(result.word, "resilient");
  assert.equal(result.source, "dictionary-english");
  // Không dịch được thì fallback về định nghĩa tiếng Anh, không được rỗng.
  assert.equal(result.meaning, "able to recover quickly");
});

test("lookupWordOffline trả nghĩa tiếng Việt khi dịch thành công", async () => {
  const result = await withMockFetch(
    async (url) => (String(url).includes("mymemory")
      ? jsonResponse({ responseData: { translatedText: "kiên cường" } })
      : jsonResponse(DICTIONARY_PAYLOAD)),
    () => lookupWordOffline("resilient"),
  );
  assert.equal(result.meaning, "kiên cường");
  assert.equal(result.source, "dictionary");
});
