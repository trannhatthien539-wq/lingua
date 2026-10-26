import { X } from "lucide-react";
import Dialog from "./ui/Dialog";

const SHORTCUTS = [
  { keys: ["Ctrl", "K"], detail: "Mở tìm kiếm toàn cục (từ vựng, ngữ pháp, bài học)" },
  { keys: ["?"], detail: "Mở bảng phím tắt này" },
  { keys: ["Esc"], detail: "Đóng hộp thoại đang mở" },
  { keys: ["Space"], detail: "Lật thẻ flashcard" },
  { keys: ["1", "2", "3"], detail: "Đánh giá thẻ: chưa nhớ · nhớ vừa · đã thuộc" },
  { keys: ["←", "Z"], detail: "Quay lại thẻ trước" },
  { keys: ["→", "Vuốt trái"], detail: "Sang thẻ kế tiếp" },
  { keys: ["Enter"], detail: "Câu tiếp theo khi làm trắc nghiệm / luyện câu" },
];

export default function ShortcutsHelpModal({ onClose }) {
  return (
    <Dialog onClose={onClose} ariaLabelledBy="shortcuts-title" className="panel w-full max-w-md p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="eyebrow">Trợ giúp</p>
          <h2 id="shortcuts-title" className="mt-1 font-display text-xl font-bold text-slate-900 dark:text-white">Phím tắt</h2>
        </div>
        <button onClick={onClose} className="icon-btn -mr-2" aria-label="Đóng bảng phím tắt"><X size={18} /></button>
      </div>
      <ul className="mt-4 space-y-1.5">
        {SHORTCUTS.map((item) => (
          <li key={item.detail} className="flex items-center gap-3 rounded-xl px-1 py-2">
            <span className="flex shrink-0 items-center gap-1">
              {item.keys.map((key) => (
                <kbd key={key} className="rounded-lg border border-slate-200/80 bg-slate-100/80 px-2 py-1 font-mono text-xs font-bold text-slate-700 shadow-xs dark:border-white/15 dark:bg-white/10 dark:text-slate-200">{key}</kbd>
              ))}
            </span>
            <span className="min-w-0 flex-1 text-sm font-medium text-slate-700 dark:text-slate-300">{item.detail}</span>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">Phím tắt học thẻ chỉ hoạt động khi đang trong phiên flashcard.</p>
    </Dialog>
  );
}
