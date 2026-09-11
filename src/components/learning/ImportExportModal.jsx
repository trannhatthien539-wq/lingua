import { useRef, useState } from "react";
import { Download, FileUp, LoaderCircle, X } from "lucide-react";
import { parseAnkiFile } from "../../utils/ankiParser";
import { sanitizeCard } from "../../utils/sanitizeCard";

const escapeCsv = (value = "") => `"${String(value).replace(/"/g, '""')}"`;
const csvRows = (cards) => [
  ["Word", "IPA", "Meaning", "Example", "ImageURL", "AudioURL"],
  ...cards.map((card) => [card.word, card.ipa, card.meaning, card.example, card.imageUrl, card.audioUrl]),
];

const download = (content, filename, type) => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

const parseCsv = (text) => {
  const lines = text.split(/\r?\n/).filter(Boolean);
  const start = /word\s*,?\s*ipa/i.test(lines[0]) ? 1 : 0;
  return lines.slice(start).map((line) => {
    const values = line.split(/\t|,(?=(?:[^"]*"[^"]*")*[^"]*$)/).map((value) => value.trim().replace(/^"|"$/g, ""));
    return { word: values[0] || "", ipa: values[1] || "", meaning: values[2] || "", example: values[3] || "", imageUrl: values[4] || "", audioUrl: values[5] || "", status: "new", level: "B1" };
  }).filter((card) => card.word);
};

const parsePlainText = (text) => text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean).map((line) => {
  const parts = line.includes(" : ") ? line.split(" : ").map((part) => part.trim()) : line.split(/\s+-\s+/).map((part) => part.trim());
  return { word: parts[0] || "", ipa: parts.length > 2 ? parts[1] : "", meaning: parts.length > 2 ? parts[2] : parts[1] || "", example: parts.length > 3 ? parts.slice(3).join(" : ") : "", status: "new", level: "B1" };
}).filter((card) => card.word);

export default function ImportExportModal({ mode, onClose, currentDeck, decks, cards, onImport }) {
  const [importMode, setImportMode] = useState("text");
  const [text, setText] = useState("");
  const [preview, setPreview] = useState([]);
  const [title, setTitle] = useState("");
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const fileRef = useRef(null);

  const exportCurrent = (format) => {
    const rows = csvRows(cards.filter((card) => card.deckId === currentDeck?.id));
    if (format === "csv") download(rows.map((row) => row.map(escapeCsv).join(",")).join("\n"), `${currentDeck?.title || "lingua-deck"}.csv`, "text/csv;charset=utf-8");
    else download(JSON.stringify({ deck: currentDeck, cards: rows.slice(1).map((row) => Object.fromEntries(rows[0].map((key, index) => [key.toLowerCase(), row[index]]))) }, null, 2), `${currentDeck?.title || "lingua-deck"}.json`, "application/json");
  };

  const exportAll = () => download(JSON.stringify({ decks, cards }, null, 2), "lingua-library.json", "application/json");

  const loadText = (value) => {
    setText(value);
    setPreview(importMode === "text" ? parsePlainText(value) : parseCsv(value));
  };

  const handleFile = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setBusy(true); setMessage(""); setProgress(5);
    try {
      if (file.name.toLowerCase().endsWith(".apkg")) {
        const result = await parseAnkiFile(file, ({ percent, message: nextMessage }) => { setProgress(percent); setMessage(nextMessage); });
        setTitle(result.title); setPreview(result.cards.map(sanitizeCard)); setMessage(`${result.cards.length} thẻ. Ảnh minh họa sẽ tải theo URL khi học; âm thanh dùng Web Speech API.`); setImportMode("file");
      } else {
        const value = await file.text();
        const isJson = file.name.toLowerCase().endsWith(".json");
        const parsed = isJson ? JSON.parse(value) : parseCsv(value);
        const importedCards = Array.isArray(parsed) ? parsed : parsed.cards || [];
        setPreview(importedCards.filter((card) => card.word).map((card) => sanitizeCard({ ...card, status: card.status || "new", level: card.level || "B1" })));
        setTitle(parsed.deck?.title || file.name.replace(/\.(csv|json)$/i, "")); setImportMode("file"); setProgress(100); setMessage("Đã đọc file, hãy kiểm tra bản xem trước.");
      }
    } catch (error) { setMessage(error.message || "Không thể đọc file."); setPreview([]); }
    finally { setBusy(false); event.target.value = ""; }
  };

  const saveImport = async () => {
    if (!preview.length || !title.trim()) return;
    setBusy(true); setMessage("Đang lưu vào bộ thẻ...");
    try { await onImport(title.trim(), preview); onClose(); }
    catch (error) { setMessage(error.message || "Không thể lưu dữ liệu."); }
    finally { setBusy(false); }
  };

  if (mode === "export") return <div className="fixed inset-0 z-[90] grid place-items-center bg-ink/40 p-4 backdrop-blur-sm"><section className="panel w-full max-w-md p-6"><div className="flex items-start justify-between"><div><p className="eyebrow">Export data</p><h2 className="mt-1 font-display text-xl font-bold">Xuất dữ liệu</h2></div><button onClick={onClose} aria-label="Đóng"><X size={18} /></button></div><div className="mt-6 space-y-3"><button onClick={() => exportCurrent("csv")} className="flex w-full items-center gap-3 rounded-xl border border-ink/10 p-4 text-left text-sm font-bold dark:border-white/10"><Download size={17} />Bộ hiện tại (.csv Anki)</button><button onClick={() => exportCurrent("json")} className="flex w-full items-center gap-3 rounded-xl border border-ink/10 p-4 text-left text-sm font-bold dark:border-white/10"><Download size={17} />Bộ hiện tại (.json)</button><button onClick={exportAll} className="flex w-full items-center gap-3 rounded-xl bg-ink p-4 text-left text-sm font-bold text-white dark:bg-lime dark:text-ink"><Download size={17} />Toàn bộ thư viện (.json)</button></div></section></div>;

  return <div className="fixed inset-0 z-[90] overflow-y-auto bg-ink/40 p-4 backdrop-blur-sm"><section className="panel mx-auto mt-8 w-full max-w-3xl p-6"><div className="flex items-start justify-between"><div><p className="eyebrow">Import data</p><h2 className="mt-1 font-display text-xl font-bold">Nhập nhanh từ vựng</h2></div><button onClick={onClose} aria-label="Đóng"><X size={18} /></button></div><div className="mt-6 flex gap-1 rounded-xl bg-ink/[0.06] p-1 dark:bg-white/10"><button onClick={() => setImportMode("text")} className={`flex-1 rounded-lg px-3 py-2 text-xs font-bold ${importMode === "text" ? "bg-white shadow-sm dark:bg-[#29332f]" : "text-ink/50 dark:text-white/50"}`}>Dán văn bản</button><button onClick={() => setImportMode("file")} className={`flex-1 rounded-lg px-3 py-2 text-xs font-bold ${importMode === "file" ? "bg-white shadow-sm dark:bg-[#29332f]" : "text-ink/50 dark:text-white/50"}`}>CSV / JSON / Anki</button></div>{importMode === "text" ? <textarea value={text} onChange={(event) => loadText(event.target.value)} className="mt-5 min-h-32 w-full rounded-xl border border-ink/10 bg-transparent p-3 text-sm outline-none dark:border-white/10" placeholder={'serendipity - sự tình cờ\nhello : /həˈləʊ/ : xin chào : Hello everyone!'} /> : <div className="mt-5 rounded-xl border border-dashed border-ink/20 p-6 text-center dark:border-white/20"><input ref={fileRef} type="file" accept=".csv,.json,.apkg" onChange={handleFile} className="hidden" /><button onClick={() => fileRef.current?.click()} disabled={busy} className="mx-auto flex items-center gap-2 rounded-xl bg-ink px-4 py-3 text-sm font-bold text-white dark:bg-lime dark:text-ink"><FileUp size={17} />Chọn file</button><p className="mt-3 text-xs text-ink/45 dark:text-white/45">Hỗ trợ CSV, JSON và Anki .apkg</p></div>}<div className="mt-5 flex gap-2"><input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Tên bộ thẻ mới" className="flex-1 rounded-xl border border-ink/10 bg-transparent px-3 py-3 text-sm dark:border-white/10" /></div>{busy && <div className="mt-4"><div className="flex items-center gap-2 text-xs text-ink/50 dark:text-white/50"><LoaderCircle size={14} className="animate-spin" />{message || "Đang xử lý..."}</div><div className="mt-2 h-2 overflow-hidden rounded-full bg-ink/10 dark:bg-white/10"><div className="h-full rounded-full bg-sage transition-all" style={{ width: `${progress}%` }} /></div></div>}{!busy && message && <p className="mt-4 text-xs text-sage">{message}</p>}<div className="mt-5 overflow-hidden rounded-xl border border-ink/10 dark:border-white/10"><div className="border-b border-ink/10 px-4 py-3 text-sm font-bold dark:border-white/10">Xem trước ({preview.length} thẻ)</div><div className="max-h-64 overflow-auto">{preview.slice(0, 100).map((card, index) => <div key={`${card.word}-${index}`} className="grid grid-cols-[48px_1fr_1fr] items-center gap-3 border-b border-ink/[0.06] px-4 py-3 text-xs dark:border-white/[0.06]"><img src={card.imageUrl} alt="" className="h-10 w-12 rounded-md bg-mist object-cover" loading="lazy" /><div><strong className="block">{card.word}</strong><span className="text-ink/45 dark:text-white/45">{card.ipa || "Chưa có IPA"}</span></div><span>{card.meaning || "Chưa có nghĩa"}</span></div>)}</div></div><button disabled={busy || !preview.length || !title.trim()} onClick={saveImport} className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-ink py-3 text-sm font-bold text-white disabled:opacity-40 dark:bg-lime dark:text-ink">{busy ? "Đang lưu..." : `Lưu ${preview.length} thẻ vào bộ`}</button></section></div>;
}
