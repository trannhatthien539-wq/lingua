const FIELD_SEPARATOR = "\x1f";
let sqlPromise;
let zipPromise;

const report = (onProgress, percent, message) => onProgress?.({ percent, message });

/**
 * jszip (≈0,1 MB) và sql.js (≈0,5 MB JS + 0,6 MB wasm) chỉ được **tải khi người dùng thật sự
 * nhập file Anki** — trước đây import tĩnh nên chúng nằm trong gói của tab Từ vựng dù rất ít dùng.
 */
const loadJsZip = () => {
  zipPromise = zipPromise || import("jszip").then((module) => module.default);
  return zipPromise;
};

const loadSql = () => {
  if (!sqlPromise) {
    sqlPromise = Promise.all([
      import("sql.js"),
      import("sql.js/dist/sql-wasm.wasm?url"),
    ]).then(([module, wasm]) => module.default({ locateFile: () => wasm.default }));
  }
  return sqlPromise;
};

const stripHtml = (value = "") => {
  const documentFragment = new DOMParser().parseFromString(value.replace(/<br\s*\/?>(\r?\n)?/gi, "\n"), "text/html");
  return documentFragment.body.textContent || "";
};

const findZipFile = (zip, name) => zip.file(name) || zip.file(new RegExp(`(^|/)${name}$`, "i"))[0];

const isCodeField = (value) => /^[A-Z0-9]+(?:[_-][A-Z0-9]+)+$/i.test(value) || /^\d+[A-Z0-9_]+$/i.test(value);
const isIpaField = (value) => /^\s*\/[^/]+\/\s*$/.test(value) || /\[[a-zəɪɔːʌɒθðŋɜː]+\]/i.test(value);
const isAudioField = (value) => /\[sound:[^\]]+\]/i.test(value) || /\.(mp3|wav|ogg|m4a)(\s|$)/i.test(value);
const isEnglishField = (value) => /^[A-Za-z][A-Za-z'’\-]*(?:\s+[A-Za-z][A-Za-z'’\-]*){0,7}$/.test(value) && !isCodeField(value);

const classifyFields = (rawFields, sortField) => {
  const fields = rawFields.map((field) => stripHtml(field).replace(/\[sound:[^\]]+\]/gi, "").replace(/\s+/g, " ").trim()).filter(Boolean);
  const usable = fields.filter((field) => !isCodeField(field) && !isAudioField(field));
  const ipa = usable.find(isIpaField) || "";
  const sorted = stripHtml(sortField || "").replace(/\s+/g, " ").trim();
  const sortedWord = !isCodeField(sorted) && !isAudioField(sorted) && !isIpaField(sorted) ? sorted : "";
  const word = sortedWord || usable.find((field) => field !== ipa && isEnglishField(field)) || usable.find((field) => field !== ipa) || "Từ chưa có tên";
  const remaining = usable.filter((field) => field !== word && field !== ipa);
  const meaning = remaining.find((field) => /[À-ỹ]/.test(field)) || remaining[0] || "Chưa có nghĩa";
  const example = remaining.find((field) => field !== meaning && field.length > 25) || "";
  return { word, ipa, meaning, example };
};

async function getSqlModule() {
  return loadSql();
}

export async function parseAnkiFile(file, onProgress) {
  if (!file?.name?.toLowerCase().endsWith(".apkg")) throw new Error("Vui lòng chọn file Anki .apkg.");
  report(onProgress, 5, "Đang đọc file Anki...");
  const JSZip = await loadJsZip();
  const zip = await JSZip.loadAsync(file);
  report(onProgress, 20, "Đã đọc gói Anki, bỏ qua media để tối ưu bộ nhớ...");

  const collectionEntry = findZipFile(zip, "collection.anki21") || findZipFile(zip, "collection.anki2");
  if (!collectionEntry) throw new Error("Không tìm thấy collection.anki2 hoặc collection.anki21 trong file Anki.");
  report(onProgress, 40, "Đang đọc collection Anki...");
  const database = new Uint8Array(await collectionEntry.async("arraybuffer"));
  const SQL = await getSqlModule();
  const db = new SQL.Database(database);
  const rows = db.exec("SELECT flds, sfld FROM notes")[0]?.values || [];
  const cards = rows.map(([flds, sortField], index) => {
    const fields = String(flds || "").split(FIELD_SEPARATOR);
    const { word, ipa, meaning, example } = classifyFields(fields, sortField);
    return {
      id: `anki-${Date.now()}-${index}`,
      word,
      ipa,
      meaning,
      example,
      imageUrl: "",
      audioUrl: "",
      needAiImage: true,
      source: "anki",
      level: "B1",
      status: "new",
      reviewDate: null,
    };
  }).filter((card) => card.word);
  db.close();
  report(onProgress, 100, `Đã tìm thấy ${cards.length} thẻ.`);
  return {
    title: file.name.replace(/\.apkg$/i, ""),
    cards,
    media: {},
    mediaCount: 0,
    imageCount: 0,
    audioCount: 0,
  };
}
