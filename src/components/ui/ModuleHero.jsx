import { Sparkles } from "lucide-react";
import ModuleHeroIllustration from "./ModuleHeroIllustration";

/** Hero dùng chung cho các trang module, giữ cùng nhịp giao diện với Trang chủ. */
export default function ModuleHero({ icon: Icon, eyebrow, title, description, accent = "#58cc02", deep = "#3f9c02", stats = [], progress, progressLabel, action, onAction, actionDisabled = false, children, className = "", compact = true, illustration = "skills" }) {
  const mobileStatsColumns = stats.length >= 3 ? "grid-cols-3" : stats.length === 2 ? "grid-cols-2" : "grid-cols-1";

  return (
    <section className={`relative overflow-hidden rounded-2xl text-white shadow-soft ${compact ? "p-3.5 sm:p-5" : "p-4 sm:p-5 lg:min-h-[220px] lg:p-7"} ${className}`} style={{ background: `linear-gradient(135deg, ${accent}, ${deep})` }}>
      <ModuleHeroIllustration variant={illustration} />
      <div className={`relative z-10 grid gap-3 sm:gap-6 ${compact ? "lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center" : "lg:grid-cols-[minmax(0,1fr)_260px] lg:items-center"}`}>
        <div className="min-w-0">
          <div className="flex items-center gap-2.5 sm:gap-3">
            {Icon && <span className={`grid shrink-0 place-items-center bg-white/20 shadow-lg shadow-black/10 ${compact ? "h-10 w-10 rounded-xl sm:h-12 sm:w-12" : "h-12 w-12 rounded-2xl sm:h-14 sm:w-14"}`}><Icon size={compact ? 21 : 26} /></span>}
            <div className="min-w-0">
              <p className="truncate text-[10px] font-bold uppercase tracking-[0.1em] text-white/70 sm:text-xs">{eyebrow}</p>
              <h2 className={`mt-0.5 line-clamp-2 font-display font-bold leading-tight tracking-tight ${compact ? "text-lg sm:text-2xl" : "text-xl sm:text-3xl"}`}>{title}</h2>
            </div>
          </div>
          {description && <p className={`mt-2 line-clamp-2 text-[11px] leading-4 text-white/80 sm:line-clamp-none sm:mt-3 sm:text-sm sm:leading-6 ${compact ? "max-w-2xl" : "max-w-2xl"}`}>{description}</p>}
          {progress !== undefined && <div className="mt-3 max-w-xl sm:mt-5"><div className="mb-1.5 flex items-center justify-between gap-2 text-[10px] font-semibold text-white/80 sm:mb-2 sm:text-xs"><span className="min-w-0 truncate">{progressLabel || "Tiến độ"}</span><span className="shrink-0 font-bold">{progress}%</span></div><div className={`overflow-hidden rounded-full bg-black/20 ${compact ? "h-2" : "h-2.5 lg:h-3"}`} role="progressbar" aria-label={progressLabel || "Tiến độ"} aria-valuemin="0" aria-valuemax="100" aria-valuenow={progress}><div className="h-full rounded-full bg-white transition-all" style={{ width: `${progress}%` }} /></div></div>}
        </div>
        <div className={`${compact ? `grid w-full gap-2 ${mobileStatsColumns} sm:flex sm:flex-wrap sm:items-center sm:justify-end sm:gap-2 lg:w-auto` : "flex flex-col items-stretch gap-2 sm:flex-row sm:items-center lg:flex-col lg:items-end"}`}>
          {stats.map((stat) => <div key={stat.label} className={`min-w-0 overflow-hidden rounded-xl border border-white/20 bg-black/10 text-center sm:rounded-2xl sm:text-left ${compact ? "px-2 py-2 sm:min-w-[104px] sm:px-3 sm:py-2.5" : "min-w-[118px] px-3 py-2.5"}`}><p className="truncate text-[9px] font-semibold text-white/70 sm:text-[11px]">{stat.label}</p><p className={`mt-0.5 break-words font-display font-bold tabular-nums ${compact ? "text-sm sm:mt-1 sm:text-base" : "text-lg"}`}>{stat.value}</p>{stat.note && <p className="hidden text-[10px] text-white/60 sm:block">{stat.note}</p>}</div>)}
          {action && <button type="button" onClick={onAction} disabled={actionDisabled} className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-white font-bold shadow-lg shadow-black/10 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 ${compact ? `col-span-full min-h-11 w-full px-3 text-xs sm:col-auto sm:w-auto sm:px-4 ${action.length > 20 ? "sm:text-sm" : ""}` : "min-h-12 px-5 text-sm"}`} style={{ color: deep }}><Sparkles size={compact ? 15 : 17} />{action}</button>}
        </div>
      </div>
      {children && <div className={`relative z-10 border-t border-white/15 ${compact ? "mt-3 pt-3" : "mt-4 pt-4 sm:mt-5"}`}>{children}</div>}
    </section>
  );
}
