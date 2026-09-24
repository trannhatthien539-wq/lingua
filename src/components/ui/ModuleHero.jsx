import { Sparkles } from "lucide-react";
import ModuleHeroIllustration from "./ModuleHeroIllustration";

/** Hero dùng chung cho các trang module, giữ cùng nhịp giao diện với Trang chủ. */
export default function ModuleHero({ icon: Icon, eyebrow, title, description, accent = "#58cc02", deep = "#3f9c02", stats = [], progress, progressLabel, action, onAction, actionDisabled = false, children, className = "", compact = true, illustration = "skills" }) {
  return (
    <section className={`relative overflow-hidden rounded-2xl text-white shadow-soft ${compact ? "p-4 sm:p-5" : "min-h-[220px] p-5 sm:p-7"} ${className}`} style={{ background: `linear-gradient(135deg, ${accent}, ${deep})` }}>
      <ModuleHeroIllustration variant={illustration} />
      <div className={`relative z-10 grid gap-6 ${compact ? "lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center" : "lg:grid-cols-[minmax(0,1fr)_260px] lg:items-center"}`}>
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            {Icon && <span className={`grid shrink-0 place-items-center bg-white/20 shadow-lg shadow-black/10 ${compact ? "h-12 w-12 rounded-xl" : "h-14 w-14 rounded-2xl"}`}><Icon size={compact ? 24 : 28} /></span>}
            <div className="min-w-0"><p className="text-xs font-bold uppercase tracking-[0.12em] text-white/70">{eyebrow}</p><h2 className={`mt-1 font-display font-bold tracking-tight ${compact ? "text-xl sm:text-2xl" : "text-2xl sm:text-3xl"}`}>{title}</h2></div>
          </div>
          {description && <p className={`max-w-2xl leading-6 text-white/80 ${compact ? "mt-2 text-xs" : "mt-3 text-sm"}`}>{description}</p>}
          {progress !== undefined && <div className={`max-w-xl ${compact ? "mt-3" : "mt-5"}`}><div className="mb-2 flex items-center justify-between gap-3 text-xs font-semibold text-white/80"><span>{progressLabel || "Tiến độ"}</span><span>{progress}%</span></div><div className={`overflow-hidden rounded-full bg-black/20 ${compact ? "h-2" : "h-3"}`} role="progressbar" aria-label={progressLabel || "Tiến độ"} aria-valuemin="0" aria-valuemax="100" aria-valuenow={progress}><div className="h-full rounded-full bg-white transition-all" style={{ width: `${progress}%` }} /></div></div>}
        </div>
        <div className={`flex items-start gap-3 ${compact ? "flex-wrap items-center justify-end gap-2" : "flex-col items-start gap-3 sm:flex-row sm:items-center lg:flex-col lg:items-end"}`}>
          {stats.map((stat) => <div key={stat.label} className={`rounded-2xl border border-white/20 bg-black/10 ${compact ? "min-w-0 px-2.5 py-2" : "min-w-[118px] px-3 py-2.5"}`}><p className="text-[11px] font-semibold text-white/70">{stat.label}</p><p className={`mt-1 font-display font-bold ${compact ? "text-base" : "text-lg"}`}>{stat.value}</p>{stat.note && <p className="text-[10px] text-white/60">{stat.note}</p>}</div>)}
          {action && <button type="button" onClick={onAction} disabled={actionDisabled} className={`inline-flex items-center justify-center gap-2 rounded-xl bg-white font-bold shadow-lg shadow-black/10 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 ${compact ? "min-h-11 px-4 text-xs" : "min-h-12 px-5 text-sm"}`} style={{ color: deep }}><Sparkles size={compact ? 15 : 17} />{action}</button>}
        </div>
      </div>
      {children && <div className={`relative z-10 border-t border-white/15 ${compact ? "mt-3 pt-3" : "mt-5 pt-4"}`}>{children}</div>}
    </section>
  );
}
