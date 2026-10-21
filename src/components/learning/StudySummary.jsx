import { useEffect } from "react";
import { Check, RotateCcw, X } from "lucide-react";
import Dialog from "../ui/Dialog";
import { celebrateStudyCompletion } from "../../utils/studyFeedback";

export default function StudySummary({ title, score, total, duration, mistakes = [], onReplay, onChangeMode, onClose }) {
  useEffect(() => {
    celebrateStudyCompletion();
  }, []);

  const accuracy = total ? Math.round((score / total) * 100) : 0;

  return (
    <Dialog
      onClose={onClose}
      ariaLabelledBy="study-summary-title"
      closeOnBackdrop={false}
      overlayClassName="fixed inset-0 z-[90] grid place-items-center overflow-y-auto bg-mist p-5 text-ink dark:bg-dark1 dark:text-white sm:p-10"
      className="panel relative w-full max-w-xl p-8 text-center"
    >
      <button
        type="button"
        onClick={onClose}
        className="icon-btn absolute right-4 top-4"
        aria-label="Đóng kết quả phiên học"
      >
        <X size={18} />
      </button>

      <div className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-emerald-500/30 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
        <Check size={30} aria-hidden="true" />
      </div>
      <p className="eyebrow mt-5">Hoàn thành phiên</p>
      <h2 id="study-summary-title" className="mt-2 font-display text-3xl font-bold">
        Hoàn thành {title}
      </h2>

      <div className="mt-8 grid grid-cols-3 gap-3" aria-live="polite">
        <div className="rounded-xl bg-mist p-4 dark:bg-white/[0.04]">
          <p className="font-display text-2xl font-bold">
            {score}/{total}
          </p>
          <p className="text-xs text-ink/50 dark:text-white/50">Điểm</p>
        </div>
        <div className="rounded-xl border border-indigo-500/30 bg-indigo-500/15 p-4 text-indigo-600 dark:text-indigo-400">
          <p className="font-display text-2xl font-bold">{accuracy}%</p>
          <p className="text-xs font-semibold text-indigo-600/80 dark:text-indigo-300/80">Chính xác</p>
        </div>
        <div className="rounded-xl bg-mist p-4 dark:bg-white/[0.04]">
          <p className="font-display text-2xl font-bold">{duration}</p>
          <p className="text-xs text-ink/50 dark:text-white/50">Thời gian</p>
        </div>
      </div>

      {mistakes.length > 0 && (
        <div className="mt-6 text-left">
          <p className="text-xs font-bold uppercase tracking-wider text-ink/50 dark:text-white/50">Cần ôn lại</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {mistakes.slice(0, 8).map((word, index) => (
              <span
                key={`${word}-${index}`}
                className="rounded-full bg-red-500/10 px-3 py-1.5 text-xs font-bold text-red-600 dark:text-red-300"
              >
                {word}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mt-7 grid gap-2 sm:grid-cols-2">
        <button type="button" onClick={onReplay} className="btn-secondary py-3 text-sm font-bold">
          <RotateCcw size={16} aria-hidden="true" />
          Học lại chế độ này
        </button>
        <button type="button" onClick={onChangeMode} className="btn-primary py-3 text-sm font-bold">
          Đổi chế độ khác
        </button>
      </div>
    </Dialog>
  );
}
