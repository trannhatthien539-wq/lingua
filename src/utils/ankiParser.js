import JSZip from "jszip";
import initSqlJs from "sql.js";
import sqlWasmUrl from "sql.js/dist/sql-wasm.wasm?url";

const FIELD_SEPARATOR = "\x1f";
let sqlPromise;

const report = (onProgress, percent, message) => onProgress?.({ percent, message });

const stripHtml = (value = "") => {
  const documentFragment = new DOMParser().parseFromString(value.replace(/<br\s*\/?>(\r?\n)?/gi, "\n"), "text/html");
  return documentFragment.body.textContent || "";
};

const firstMeaningfulField = (fields, index, fallback = "") => stripHtml(fields[index] || fallback).replace(/\s+/g, " ").trim();

const parseMediaManifest = async (zip) => {
  const mediaFile = zip.file("media");
  if (!mediaFile) return {};
  try {
    const raw = await mediaFile.async("string");
    return JSON.parse(raw) || {};
  } catch {
    return {};
  }
};

const mediaLookup = (media, filename = "") => {
  const cleanName = decodeURIComponent(filename).replace(/^\.\//, "");
  return media[filename] || media[cleanName] || media[cleanName.split("/").pop()];
};

const findZipFile = (zip, name) => zip.file(name) || zip.file(new RegExp(`(^|/)${name}$`, "i"))[0];

async function getSqlModule() {
  if (!sqlPromise) {
    sqlPromise = initSqlJs({ locateFile: () => sqlWasmUrl });
  }
  return sqlPromise;
}

export async function parseAnkiFile(file, onProgress) {
  if (!file?.name?.toLowerCase().endsWith(".apkg")) throw new Error("Vui lòng chọn file Anki .apkg.");
  report(onProgress, 5, "Đang đọc file Anki...");
  const zip = await JSZip.loadAsync(file);
  const manifest = await parseMediaManifest(zip);
  const mediaEntries = Object.entries(manifest);
  const media = {};
  let processedMedia = 0;
  for (const [archiveName, originalName] of mediaEntries) {
    const entry = zip.file(archiveName);
    if (entry) {
      const blob = await entry.async("blob");
      media[originalName] = {
        name: originalName,
        type: blob.type || "application/octet-stream",
        url: URL.createObjectURL(blob),
        size: blob.size,
      };
    }
    processedMedia += 1;
    report(onProgress, 10 + Math.round((processedMedia / Math.max(mediaEntries.length, 1)) * 25), `Đang trích xuất media ${processedMedia}/${mediaEntries.length}...`);
  }

  const collectionEntry = findZipFile(zip, "collection.anki21") || findZipFile(zip, "collection.anki2");
  if (!collectionEntry) throw new Error("Không tìm thấy collection.anki2 hoặc collection.anki21 trong file Anki.");
  report(onProgress, 40, "Đang đọc collection Anki...");
  const database = new Uint8Array(await collectionEntry.async("arraybuffer"));
  const SQL = await getSqlModule();
  const db = new SQL.Database(database);
  const rows = db.exec("SELECT flds, sfld FROM notes")[0]?.values || [];
  const cards = rows.map(([flds, sortField], index) => {
    const fields = String(flds || "").split(FIELD_SEPARATOR);
    const frontHtml = fields[0] || String(sortField || "");
    const backHtml = fields[1] || fields[0] || "";
    const imageMatch = frontHtml.match(/<img[^>]+src=["']?([^"' >]+)/i) || backHtml.match(/<img[^>]+src=["']?([^"' >]+)/i);
    const soundMatch = `${frontHtml} ${backHtml}`.match(/\[sound:([^\]]+)\]/i);
    const word = firstMeaningfulField(fields, 0, sortField);
    const meaning = firstMeaningfulField(fields, 1, "Chưa có nghĩa");
    const example = firstMeaningfulField(fields, 2, "");
    const image = imageMatch ? mediaLookup(media, imageMatch[1]) : null;
    const audio = soundMatch ? mediaLookup(media, soundMatch[1]) : null;
    return {
      id: `anki-${Date.now()}-${index}`,
      word,
      ipa: "",
      meaning,
      example,
      imageUrl: image?.url || "",
      audioUrl: audio?.url || "",
      needAiImage: !image,
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
    media,
    mediaCount: Object.keys(media).length,
    imageCount: Object.values(media).filter((item) => item.type.startsWith("image/")).length,
    audioCount: Object.values(media).filter((item) => item.type.startsWith("audio/")).length,
  };
}
