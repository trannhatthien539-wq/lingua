import { useEffect } from "react";
import { BookOpen, Brain, Headphones, Keyboard, Sparkles, X } from "lucide-react";
import Dialog from "../ui/Dialog";

const modes = [
  { id: "flashcard", icon: BookOpen, title: "Flashcard SRS", text: "Lật thẻ và lên lịch ôn tập 1, 3 hoặc 5 ngày." },
  { id: "quiz", icon: Brain, title: "Trắc nghiệm", text: "Chọn nghĩa đúng để luyện phản xạ nhận diện từ." },
  { id: "speller", icon: Headphones, title: "Spelling & Dictation", text: "Nghe phát âm và gõ lại từ thật chính xác." },
  { id: "matching", icon: Keyboard, title: "Speed Matching", text: "Nối từ với nghĩa trong thời gian ngắn nhất." },
];

export default function StudyHubModal({ deck, cards, onSelect, onClose }) {
  const total = Array.isArray(cards) ? cards.length : 0;
  const mastered = Array.isArray(cards) ? cards.filter((card) => card.status === "mastered").length : 0;
  const progress = total ? Math.round((mastered / total) * 100) : 0;
  const [primary, ...secondary] = modes;

  // Phím 1–4 chọn nhanh chế độ học, khớp với số thứ tự hiển thị trên từng lựa chọn.
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.ctrlKey || event.metaKey || event.altKey) return;
      const tag = event.target?.tagName;
      if (event.target?.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(tag)) return;
      if (!/^[1-4]$/.test(event.key)) return;
      event.preventDefault();
      onSelect?.(modes[Number(event.key) - 1].id);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onSelect]);

  return (
    <Dialog
      onClose={onClose}
      ariaLabelledBy="studyhub-title"
      className="panel w-full max-w-xl p-5 sm:p-6"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="eyebrow">Bắt đầu học · {deck?.title}</p>
          <h2 id="studyhub-title" className="mt-1 font-display text-2xl font-bold">
            Bạn muốn học thế nào?
          </h2>
          <p className="mt-2 text-sm text-ink/55 dark:text-white/55">
            {total} thẻ · {progress}% đã thuộc
          </p>
        </div>
        <button type="button" onClick={onClose} className="icon-btn" aria-label="Đóng hộp chọn chế độ học">
          <X size={18} />
        </button>
      </div>

      <button
        type="button"
        onClick={() => onSelect(primary.id)}
        style={{ background: "linear-gradient(135deg, rgb(var(--accent)), rgb(var(--accent-2)))" }}
        className="mt-6 flex w-full items-center gap-4 rounded-2xl p-5 text-left text-white shadow-md transition hover:-translate-y-0.5 hover:brightness-105 active:translate-y-0"
      >
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-white/20 text-white backdrop-blur-md">
          <Sparkles size={21} aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-2 text-lg font-bold text-white">
            {primary.title}
            <kbd className="rounded bg-black/25 px-1.5 py-0.5 font-mono text-[10px] font-bold text-white/80">1</kbd>
          </p>
          <p className="mt-1 text-sm text-white/85">{primary.text}</p>
        </div>
        <span className="hidden text-sm font-bold text-white sm:inline">Bắt đầu</span>
      </button>

      <div className="mt-5 border-t border-ink/10 pt-4 dark:border-white/10">
        <p className="text-xs font-bold text-ink/50 dark:text-white/50">Hoặc chọn cách luyện khác</p>
        <div className="mt-2 divide-y divide-ink/10 dark:divide-white/10">
          {secondary.map(({ id, icon: Icon, title, text }, position) => (
            <button
              key={id}
              type="button"
              onClick={() => onSelect(id)}
              className="flex min-h-[48px] w-full items-center gap-3 rounded-lg py-3 text-left transition hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              <Icon size={18} className="shrink-0 text-indigo-500" aria-hidden="true" />
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-bold">{title}</span>
                <span className="block truncate text-xs text-ink/55 dark:text-white/55">{text}</span>
              </span>
              <kbd className="shrink-0 rounded bg-ink/[0.06] px-1.5 py-0.5 font-mono text-[10px] font-bold text-ink/50 dark:bg-white/10 dark:text-white/50">
                {position + 2}
              </kbd>
            </button>
          ))}
        </div>
      </div>
    </Dialog>
  );
}
