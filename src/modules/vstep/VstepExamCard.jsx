import { BookOpen, GraduationCap, LoaderCircle, PlayCircle } from "lucide-react";
import { bandFor } from "../../data/vstep/bands";

const LEVEL_STYLES = {
  B1: {
    cover: "from-emerald-500/15 via-emerald-500/5 to-transparent text-emerald-600 dark:text-emerald-400",
    accent: "text-emerald-600 dark:text-emerald-400",
    bar: "from-emerald-400 to-teal-500",
  },
  B2: {
    cover: "from-sky-500/15 via-cyan-500/5 to-transparent text-sky-600 dark:text-sky-400",
    accent: "text-sky-600 dark:text-sky-400",
    bar: "from-sky-400 to-cyan-500",
  },
  C1: {
    cover: "from-rose-500/15 via-pink-500/5 to-transparent text-rose-600 dark:text-rose-400",
    accent: "text-rose-600 dark:text-rose-400",
    bar: "from-rose-400 to-pink-500",
  },
};

export default function VstepExamCard({ exam, best, last, loading, onOpen }) {
  const theme = LEVEL_STYLES[exam.level] || LEVEL_STYLES.B1;
  const score = best?.average ? Math.max(0, Math.min(100, Math.round(best.average * 10))) : 0;

  return (
    <article className="panel group flex h-full flex-col overflow-hidden p-0 border border-slate-200/80 bg-white/70 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_16px_36px_-10px_rgba(20,212,244,0.18)] dark:border-white/[0.08] dark:bg-[#111827]/70 dark:hover:shadow-[0_16px_36px_-10px_rgba(0,0,0,0.5)]">
      <button
        type="button"
        onClick={() => onOpen(exam.id, "exam")}
        disabled={loading}
        className="relative block aspect-[16/9] w-full overflow-hidden text-left disabled:cursor-wait"
        aria-label={`Mở đề ${exam.title}`}
      >
        <div className={`flex h-full w-full flex-col items-center justify-center bg-gradient-to-br ${theme.cover}`}>
          <span className="grid h-14 w-14 place-items-center rounded-2xl border border-white/20 bg-white/70 shadow-md backdrop-blur-md dark:bg-white/10">
            <GraduationCap size={28} strokeWidth={1.8} />
          </span>
          <span className="mt-2.5 max-w-[85%] truncate text-[11px] font-bold uppercase tracking-wider opacity-80">
            VSTEP · {exam.level}
          </span>
        </div>
        <span className="absolute right-3 top-3 rounded-full border border-white/10 bg-slate-900/70 px-2.5 py-1 text-[11px] font-mono font-bold text-white backdrop-blur-md">
          {exam.level}
        </span>
        <span className="absolute bottom-3 left-3 inline-flex max-w-[85%] items-center gap-1.5 rounded-full border border-white/20 bg-white/80 px-2.5 py-1 text-xs font-bold text-slate-900 shadow-sm backdrop-blur-md dark:bg-slate-900/80 dark:text-white">
          <GraduationCap size={12} className={theme.accent} />
          <span className="truncate">{exam.tags.join(" · ")}</span>
        </span>
      </button>

      <div className="relative flex flex-1 flex-col p-4 sm:p-5">
        <p className={`eyebrow ${theme.accent}`}>Đề thi thử · {exam.level}</p>
        <h3 className="mt-1 line-clamp-2 font-display text-lg font-bold text-slate-900 dark:text-white">
          {exam.title}
        </h3>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {[
            `${exam.counts?.listening || 35} Nghe`,
            `${exam.counts?.reading || 40} Đọc`,
            "2 Viết",
            "3 Nói",
            "172′",
          ].map((item) => (
            <span key={item} className="chip border border-slate-200/80 bg-slate-100/70 text-slate-700 dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-300">
              {item}
            </span>
          ))}
        </div>

        <div className="mt-auto pt-5">
          <div className="mb-2 flex items-center justify-between gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span>{last ? `Lần gần nhất: ${new Date(last.at).toLocaleDateString("vi-VN")}` : "Chưa có lần thi nào"}</span>
            {best ? (
              <span className={`font-mono ${theme.accent}`}>{bandFor(best.average).label} · {best.average}/10</span>
            ) : (
              <span className="chip border border-slate-200/80 bg-slate-100/70 text-slate-500 dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-400">Mới</span>
            )}
          </div>
          <div
            className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10"
            role="progressbar"
            aria-label={`Điểm cao nhất của ${exam.title}`}
            aria-valuemin="0"
            aria-valuemax="100"
            aria-valuenow={score}
          >
            <div className={`h-full rounded-full bg-gradient-to-r ${theme.bar} transition-all duration-500`} style={{ width: `${score}%` }} />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => onOpen(exam.id, "exam")}
              disabled={loading}
              className="btn-primary flex-1 px-3 text-xs disabled:cursor-wait sm:flex-none"
            >
              {loading ? <LoaderCircle size={15} className="animate-spin" /> : <PlayCircle size={15} />}
              Thi thật
            </button>
            <button
              type="button"
              onClick={() => onOpen(exam.id, "practice")}
              disabled={loading}
              className="btn-secondary flex-1 px-3 text-xs disabled:cursor-wait sm:flex-none"
            >
              <BookOpen size={15} />
              Luyện kỹ năng
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
