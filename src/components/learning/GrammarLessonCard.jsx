import { BookOpen, CheckCircle2, GraduationCap, PlayCircle } from "lucide-react";

export default function GrammarLessonCard({ lesson, result, index, onOpen }) {
  const passed = Boolean(result?.passed);
  const questionCount = lesson.questions?.length || 0;
  const score = result?.total ? Math.round((result.best / result.total) * 100) : 0;
  const coverTone = index % 3 === 0 ? "from-[#f1e8ff] via-[#fbf8ff] to-[#e7dfff] text-[#7252b7]" : index % 3 === 1 ? "from-[#e5f5ff] via-[#f4fbff] to-[#dceef8] text-[#2176a4]" : "from-[#fff0dc] via-[#fff8ed] to-[#fce3c5] text-[#b56a1a]";

  return (
    <article className="panel group flex h-full flex-col overflow-hidden p-0 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <button type="button" onClick={() => onOpen(lesson.id)} className="relative block aspect-[16/9] w-full overflow-hidden text-left" aria-label={`Mở bài ${lesson.title}`}>
        <div className={`flex h-full w-full flex-col items-center justify-center bg-gradient-to-br ${coverTone}`}><span className="grid h-16 w-16 place-items-center rounded-2xl bg-white/70 shadow-sm"><GraduationCap size={33} strokeWidth={1.7} /></span><span className="mt-3 max-w-[85%] truncate text-xs font-bold uppercase tracking-[0.12em] opacity-75">{lesson.level || "Grammar"}</span></div>
        <span className="absolute right-3 top-3 rounded-full bg-ink/65 px-2.5 py-1 text-xs font-bold text-white backdrop-blur-sm">{questionCount} câu</span>
        <span className="absolute bottom-3 left-3 inline-flex max-w-[80%] items-center gap-1.5 rounded-full bg-white/85 px-2.5 py-1 text-xs font-bold text-ink shadow-sm backdrop-blur-sm"><BookOpen size={13} />{lesson.en}</span>
      </button>
      <div className="relative flex flex-1 flex-col p-4 sm:p-5">
        <GraduationCap className="pointer-events-none absolute -bottom-3 -right-3 h-24 w-24 rotate-[-12deg] text-[#ce82ff]/15" strokeWidth={1.2} aria-hidden="true" />
        <p className="eyebrow relative">Bài {lesson.order} · {lesson.level}</p>
        <h3 className="relative mt-1 line-clamp-2 font-display text-lg font-bold leading-6">{lesson.title}</h3>
        <p className="relative mt-1 text-xs text-ink/55 dark:text-white/55">{lesson.en}</p>
        <p className="relative mt-3 line-clamp-2 text-sm leading-6 text-ink/70 dark:text-white/70">{lesson.summary}</p>
        <div className="relative mt-4 flex flex-wrap gap-1.5"><span className="chip bg-ink/[0.06] text-ink/70 dark:bg-white/10 dark:text-white/70">{questionCount} câu hỏi</span>{passed ? <span className="chip bg-okbg text-ok dark:bg-okdark dark:text-okfgdark"><CheckCircle2 size={12} className="mr-1" />Đạt {result.best}/{result.total}</span> : <span className="chip bg-ink/[0.06] text-ink/60 dark:bg-white/10 dark:text-white/60">Chưa học</span>}</div>
        <div className="relative mt-auto pt-5">
          <div className="mb-2 flex items-center justify-between gap-2 text-xs font-semibold text-ink/60 dark:text-white/60"><span>{passed ? "Đã hoàn thành" : "Chưa bắt đầu"}</span><span>{score}% complete</span></div>
          <div className="h-2 overflow-hidden rounded-full bg-ink/10 dark:bg-white/15" role="progressbar" aria-label={`Tiến độ bài ${lesson.title}`} aria-valuemin="0" aria-valuemax="100" aria-valuenow={score}><div className="h-full rounded-full bg-[#ce82ff] transition-all" style={{ width: `${score}%` }} /></div>
          <button type="button" onClick={() => onOpen(lesson.id)} className={`mt-4 w-full ${passed ? "btn-secondary" : "btn-primary"} px-4`}>{passed ? <><CheckCircle2 size={16} />Ôn lại</> : <><PlayCircle size={16} />Học bài</>}</button>
        </div>
      </div>
    </article>
  );
}
