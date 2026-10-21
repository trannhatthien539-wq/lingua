import { useEffect } from "react";
import { Check, RotateCcw, X } from "lucide-react";
import { celebrateStudyCompletion } from "../../utils/studyFeedback";

export default function StudySummary({ title, score, total, duration, mistakes = [], onReplay, onChangeMode, onClose }) {
  useEffect(() => { celebrateStudyCompletion(); }, []);
  return (
    <div className="fixed inset-0 z-[90] overflow-y-auto bg-mist p-5 text-ink dark:bg-dark1 dark:text-white sm:p-10">
      <div className="mx-auto flex min-h-full max-w-xl items-center justify-center">
        <section className="panel w-full p-8 text-center">
          <button onClick={onClose} className="icon-btn absolute right-6 top-6" aria-label="Đóng"><X size={18} /></button>
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full border border-emerald-500/30 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"><Check size={30} /></div>
          <p className="eyebrow mt-5">Hoàn thành phiên</p>
          <h2 className="mt-2 font-display text-3xl font-bold">Hoàn thành {title}</h2>
          <div className="mt-8 grid grid-cols-3 gap-3"><div className="rounded-xl bg-mist p-4 dark:bg-white/[0.04]"><p className="font-display text-2xl font-bold">{score}/{total}</p><p className="text-xs text-ink/45 dark:text-white/45">Điểm</p></div><div className="rounded-xl border border-indigo-500/30 bg-indigo-500/15 p-4 text-indigo-600 dark:text-indigo-400"><p className="font-display text-2xl font-bold">{total ? Math.round((score / total) * 100) : 0}%</p><p className="text-xs font-semibold text-indigo-600/80 dark:text-indigo-300/80">Chính xác</p></div><div className="rounded-xl bg-mist p-4 dark:bg-white/[0.04]"><p className="font-display text-2xl font-bold">{duration}</p><p className="text-xs text-ink/45 dark:text-white/45">Thời gian</p></div></div>
          {mistakes.length > 0 && <div className="mt-6 text-left"><p className="text-xs font-bold uppercase tracking-wider text-ink/45 dark:text-white/45">Cần ôn lại</p><div className="mt-2 flex flex-wrap gap-2">{mistakes.slice(0, 8).map((word) => <span key={word} className="rounded-full bg-red-500/10 px-3 py-1.5 text-xs font-bold text-red-600 dark:text-red-300">{word}</span>)}</div></div>}
          <div className="mt-7 grid gap-2 sm:grid-cols-2"><button onClick={onReplay} className="btn-secondary py-3 text-sm font-bold"><RotateCcw size={16} />Học lại chế độ này</button><button onClick={onChangeMode} className="btn-primary py-3 text-sm font-bold">Đổi chế độ khác</button></div>
        </section>
      </div>
    </div>
  );
}
