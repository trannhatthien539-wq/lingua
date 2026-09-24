import { BookOpen, Check, Clock3, PlayCircle } from "lucide-react";
import NavIcon from "../ui/NavIcon";

/** Danh sách bài học dạng card dọc, dùng chung cho Nghe/Đọc/Nói/Viết. */
export default function SkillLessonList({ icon, color = "#14d4f4", actionLabel = "Học bài", items, onOpen }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => {
        const result = item.result;
        const score = result?.total ? Math.round((result.best / result.total) * 100) : 0;
        const completed = Boolean(result);
        return (
          <article key={item.id} className="panel group flex h-full flex-col overflow-hidden p-0 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg" style={{ borderBottom: `4px solid ${color}` }}>
            <button type="button" onClick={() => onOpen(item.id)} className="relative block aspect-[16/9] w-full overflow-hidden text-left" aria-label={`Mở bài ${item.title}`}>
              <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-white/90 to-slate-100 dark:from-dark3 dark:to-dark2"><span className="grid h-16 w-16 place-items-center rounded-2xl bg-white/75 shadow-sm" style={{ color }}><NavIcon icon={icon} color={color} size="lg" /></span><span className="mt-3 text-xs font-bold uppercase tracking-[0.12em] text-ink/45 dark:text-white/45">{item.tag || item.level || "Bài học"}</span></div>
              <span className="absolute right-3 top-3 rounded-full bg-ink/65 px-2.5 py-1 text-xs font-bold text-white backdrop-blur-sm">{item.index}</span>
              <span className="absolute bottom-3 left-3 inline-flex max-w-[82%] items-center gap-1.5 rounded-full bg-white/85 px-2.5 py-1 text-xs font-bold text-ink shadow-sm backdrop-blur-sm"><BookOpen size={13} />{item.title}</span>
            </button>
            <div className="relative flex flex-1 flex-col p-4 sm:p-5">
              <BookOpen className="pointer-events-none absolute -bottom-3 -right-3 h-24 w-24 rotate-[-12deg] text-sage/10" strokeWidth={1.2} aria-hidden="true" />
              <p className="eyebrow relative">Bài {item.index}{item.level ? ` · ${item.level}` : ""}</p>
              <h3 className="relative mt-1 line-clamp-2 font-display text-lg font-bold leading-6">{item.title}</h3>
              {item.meta && <p className="relative mt-1 flex items-center gap-1.5 text-xs text-ink/55 dark:text-white/55"><Clock3 size={12} />{item.meta}</p>}
              {item.summary && <p className="relative mt-3 line-clamp-2 text-sm leading-6 text-ink/70 dark:text-white/70">{item.summary}</p>}
              <div className="relative mt-4 flex flex-wrap gap-1.5"><span className="chip bg-ink/[0.06] text-ink/70 dark:bg-white/10 dark:text-white/70">{item.tag || "Bài luyện"}</span><span className={`chip ${completed ? "bg-okbg text-ok dark:bg-okdark dark:text-okfgdark" : "bg-ink/[0.06] text-ink/60 dark:bg-white/10 dark:text-white/60"}`}>{completed ? <><Check size={12} className="mr-1" />Đã làm</> : item.chip || "Chưa làm"}</span></div>
              <div className="relative mt-auto pt-5"><div className="mb-2 flex items-center justify-between gap-2 text-xs font-semibold text-ink/60 dark:text-white/60"><span>{completed ? `${result.best}/${result.total} điểm` : "Chưa bắt đầu"}</span><span>{score}% complete</span></div><div className="h-2 overflow-hidden rounded-full bg-ink/10 dark:bg-white/15"><div className="h-full rounded-full transition-all" style={{ width: `${score}%`, backgroundColor: color }} /></div><button type="button" onClick={() => onOpen(item.id)} className={`mt-4 w-full ${completed ? "btn-secondary" : "btn-primary"} px-4`}><PlayCircle size={16} />{completed ? "Làm lại" : actionLabel}</button></div>
            </div>
          </article>
        );
      })}
    </div>
  );
}