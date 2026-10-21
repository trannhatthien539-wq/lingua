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
          <article key={item.id} className="panel group flex h-full flex-col overflow-hidden p-0 border border-slate-200/80 bg-white/70 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_16px_36px_-10px_rgba(20,212,244,0.18)] dark:border-white/[0.08] dark:bg-[#111827]/70 dark:hover:shadow-[0_16px_36px_-10px_rgba(0,0,0,0.5)]">
            <button type="button" onClick={() => onOpen(item.id)} className="relative block aspect-[16/9] w-full overflow-hidden text-left" aria-label={`Mở bài ${item.title}`}>
              <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-transparent">
                <span className="grid h-14 w-14 place-items-center rounded-2xl border border-white/20 bg-white/70 shadow-md backdrop-blur-md dark:bg-white/10" style={{ color }}><NavIcon icon={icon} color={color} size="lg" /></span>
                <span className="mt-2.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">{item.tag || item.level || "Bài học"}</span>
              </div>
              <span className="absolute right-3 top-3 rounded-full border border-white/10 bg-slate-900/70 px-2.5 py-1 text-[11px] font-mono font-bold text-white backdrop-blur-md">#{item.index}</span>
              <span className="absolute bottom-3 left-3 inline-flex max-w-[82%] items-center gap-1.5 rounded-full border border-white/20 bg-white/80 px-2.5 py-1 text-xs font-bold text-slate-900 shadow-sm backdrop-blur-md dark:bg-slate-900/80 dark:text-white"><BookOpen size={12} style={{ color }} />{item.title}</span>
            </button>
            <div className="relative flex flex-1 flex-col p-4 sm:p-5">
              <p className="eyebrow" style={{ color }}>Bài {item.index}{item.level ? ` · ${item.level}` : ""}</p>
              <h3 className="relative mt-1 line-clamp-2 font-display text-lg font-bold text-slate-900 dark:text-white">{item.title}</h3>
              {item.meta && <p className="relative mt-1 flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500"><Clock3 size={12} />{item.meta}</p>}
              {item.summary && <p className="relative mt-2.5 line-clamp-2 text-xs leading-5 text-slate-600 dark:text-slate-300">{item.summary}</p>}
              <div className="relative mt-4 flex flex-wrap gap-1.5">
                <span className="chip border border-slate-200/80 bg-slate-100/70 text-slate-700 dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-300">{item.tag || "Bài luyện"}</span>
                <span className={`chip ${completed ? "border border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" : "border border-slate-200/80 bg-slate-100/70 text-slate-500 dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-400"}`}>
                  {completed ? <><Check size={12} className="mr-1" />Đã làm</> : item.chip || "Chưa làm"}
                </span>
              </div>
              <div className="relative mt-auto pt-5">
                <div className="mb-2 flex items-center justify-between gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  <span>{completed ? `${result.best}/${result.total} điểm` : "Chưa hoàn thành"}</span>
                  <span className="font-mono" style={{ color }}>{score}% hoàn thành</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10">
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${score}%`, backgroundColor: color }} />
                </div>
                <button type="button" onClick={() => onOpen(item.id)} className={`mt-4 w-full ${completed ? "btn-secondary" : "btn-primary"} px-4 text-xs font-bold`}>
                  <PlayCircle size={15} />{completed ? "Làm lại" : actionLabel}
                </button>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}