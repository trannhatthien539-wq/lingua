import { BookOpen, CheckCircle2, GraduationCap, PlayCircle } from "lucide-react";

export default function GrammarLessonCard({ lesson, result, index, onOpen }) {
  const passed = Boolean(result?.passed);
  const questionCount = lesson.questions?.length || 0;
  const score = result?.total ? Math.round((result.best / result.total) * 100) : 0;
  const coverTone = index % 3 === 0
    ? "from-purple-500/15 via-indigo-500/5 to-transparent text-purple-600 dark:text-purple-400"
    : index % 3 === 1
    ? "from-blue-500/15 via-cyan-500/5 to-transparent text-blue-600 dark:text-blue-400"
    : "from-amber-500/15 via-orange-500/5 to-transparent text-amber-600 dark:text-amber-400";

  return (
    <article className="panel group flex h-full flex-col overflow-hidden p-0 border border-slate-200/80 bg-white/70 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-purple-400/50 hover:shadow-[0_16px_36px_-10px_rgba(147,51,234,0.18)] dark:border-white/[0.08] dark:bg-[#111827]/70 dark:hover:border-purple-500/40 dark:hover:shadow-[0_16px_36px_-10px_rgba(0,0,0,0.5)]">
      <button type="button" onClick={() => onOpen(lesson.id)} className="relative block aspect-[16/9] w-full overflow-hidden text-left" aria-label={`Mở bài ${lesson.title}`}>
        <div className={`flex h-full w-full flex-col items-center justify-center bg-gradient-to-br ${coverTone}`}>
          <span className="grid h-14 w-14 place-items-center rounded-2xl border border-white/20 bg-white/70 shadow-md backdrop-blur-md dark:bg-white/10"><GraduationCap size={28} strokeWidth={1.8} /></span>
          <span className="mt-2.5 max-w-[85%] truncate text-[11px] font-bold uppercase tracking-wider opacity-80">{lesson.level || "Grammar"}</span>
        </div>
        <span className="absolute right-3 top-3 rounded-full border border-white/10 bg-slate-900/70 px-2.5 py-1 text-[11px] font-mono font-bold text-white backdrop-blur-md">{questionCount} câu</span>
        <span className="absolute bottom-3 left-3 inline-flex max-w-[80%] items-center gap-1.5 rounded-full border border-white/20 bg-white/80 px-2.5 py-1 text-xs font-bold text-slate-900 shadow-sm backdrop-blur-md dark:bg-slate-900/80 dark:text-white"><BookOpen size={12} className="text-purple-500" />{lesson.en}</span>
      </button>
      <div className="relative flex flex-1 flex-col p-4 sm:p-5">
        <p className="eyebrow text-purple-600/80 dark:text-purple-400/80">Bài {lesson.order} · {lesson.level}</p>
        <h3 className="relative mt-1 line-clamp-2 font-display text-lg font-bold text-slate-900 dark:text-white">{lesson.title}</h3>
        <p className="relative mt-0.5 text-xs text-slate-400 dark:text-slate-500">{lesson.en}</p>
        <p className="relative mt-2.5 line-clamp-2 text-xs leading-5 text-slate-600 dark:text-slate-300">{lesson.summary}</p>
        <div className="relative mt-4 flex flex-wrap gap-1.5">
          <span className="chip border border-slate-200/80 bg-slate-100/70 text-slate-700 dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-300">{questionCount} câu hỏi</span>
          {passed ? (
            <span className="chip border border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"><CheckCircle2 size={12} className="mr-1" />Đạt {result.best}/{result.total}</span>
          ) : (
            <span className="chip border border-slate-200/80 bg-slate-100/70 text-slate-500 dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-400">Chưa học</span>
          )}
        </div>
        <div className="relative mt-auto pt-5">
          <div className="mb-2 flex items-center justify-between gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span>{passed ? "Đã hoàn thành" : "Chưa hoàn thành"}</span>
            <span className="font-mono text-purple-600 dark:text-purple-400">{score}% hoàn thành</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10" role="progressbar" aria-label={`Tiến độ bài ${lesson.title}`} aria-valuemin="0" aria-valuemax="100" aria-valuenow={score}>
            <div className="h-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 shadow-[0_0_8px_rgba(168,85,247,0.5)] transition-all duration-500" style={{ width: `${score}%` }} />
          </div>
          <button type="button" onClick={() => onOpen(lesson.id)} className={`mt-4 w-full ${passed ? "btn-secondary" : "btn-primary"} px-4 text-xs font-bold`}>
            {passed ? <><CheckCircle2 size={15} />Ôn lại</> : <><PlayCircle size={15} />Học bài</>}
          </button>
        </div>
      </div>
    </article>
  );
}
