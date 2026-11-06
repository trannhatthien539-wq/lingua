import { memo, useState } from "react";
import { CheckCircle2, GraduationCap, PlayCircle } from "lucide-react";
import { getGrammarCover } from "../../data/lessonCovers";

export default memo(function GrammarLessonCard({ lesson, result, index, onOpen }) {
  const [imgFailed, setImgFailed] = useState(false);
  const passed = Boolean(result?.passed);
  const questionCount = lesson.questions?.length || 0;
  const score = result?.total ? Math.round((result.best / result.total) * 100) : 0;
  const coverImage = !imgFailed ? (lesson.coverImage || getGrammarCover(lesson.id, index)) : null;
  const coverTone = index % 3 === 0
    ? "from-purple-500/15 via-indigo-500/5 to-transparent text-purple-600 dark:text-purple-400"
    : index % 3 === 1
    ? "from-blue-500/15 via-cyan-500/5 to-transparent text-blue-600 dark:text-blue-400"
    : "from-amber-500/15 via-orange-500/5 to-transparent text-amber-600 dark:text-amber-400";

  return (
    <article className="panel group flex h-full flex-col overflow-hidden p-0 border border-slate-200/80 bg-white/70 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-purple-400/50 hover:shadow-[0_16px_36px_-10px_rgba(147,51,234,0.18)] dark:border-white/[0.08] dark:bg-[#111827]/70 dark:hover:border-purple-500/40 dark:hover:shadow-[0_16px_36px_-10px_rgba(0,0,0,0.5)]">
      <button type="button" onClick={() => onOpen(lesson.id)} className="relative block aspect-[24/9] w-full overflow-hidden text-left" aria-label={`Mở bài ${lesson.title}`}>
        {coverImage ? (
          <img
            src={coverImage}
            alt={lesson.title}
            loading="lazy"
            decoding="async"
            onError={() => setImgFailed(true)}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className={`flex h-full w-full flex-col items-center justify-center bg-gradient-to-br ${coverTone}`}>
            <span className="grid h-12 w-12 place-items-center rounded-2xl border border-white/20 bg-white/70 shadow-md backdrop-blur-md dark:bg-white/10"><GraduationCap size={25} strokeWidth={1.8} /></span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent pointer-events-none" />
        <span className="absolute bottom-2.5 left-3 rounded-full border border-white/20 bg-slate-900/80 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm backdrop-blur-md">
          Bài {lesson.order} · {lesson.level}
        </span>
        <span className="absolute right-3 top-3 rounded-full border border-white/20 bg-slate-900/80 px-2.5 py-1 text-[11px] font-mono font-bold text-white shadow-sm backdrop-blur-md">
          {questionCount} câu
        </span>
      </button>
      <div className="relative flex flex-1 flex-col p-4">
        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Chuyên đề {lesson.order}</p>
        <h3 className="relative mt-1 line-clamp-2 font-display text-base font-bold text-slate-900 dark:text-white">{lesson.title}</h3>
        <p className="relative mt-0.5 text-xs text-slate-400 dark:text-slate-500">{lesson.en}</p>
        <p className="relative mt-2 line-clamp-2 text-xs leading-5 text-slate-600 dark:text-slate-300">{lesson.summary}</p>
        <div className="relative mt-auto pt-4">
          <div className="mb-1.5 flex items-center justify-between gap-2 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
            <span>{passed ? `Đạt ${result.best}/${result.total}` : "Chưa học"}</span>
            <span className="font-mono text-purple-600 dark:text-purple-400">{score}%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10" role="progressbar" aria-label={`Tiến độ bài ${lesson.title}`} aria-valuemin="0" aria-valuemax="100" aria-valuenow={score}>
            <div className="h-full rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-500" style={{ width: `${score}%` }} />
          </div>
          <button type="button" onClick={() => onOpen(lesson.id)} className={`mt-3 w-full ${passed ? "btn-secondary" : "btn-primary"} h-9 min-h-0 px-4 text-xs font-bold`}>
            {passed ? <><CheckCircle2 size={14} />Ôn lại</> : <><PlayCircle size={14} />Học bài</>}
          </button>
        </div>
      </div>
    </article>
  );
});
