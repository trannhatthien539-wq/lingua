import { Sparkles } from "lucide-react";
import ModuleHeroIllustration from "./ModuleHeroIllustration";

/** 
 * ModuleHero: Chuẩn mực thiết kế Apple & Linear Pro Dark Aurora Glass.
 * Nền Obsidian kính mờ vũ trụ kết hợp quầng sáng Aurora đa sắc tinh tế.
 */
export default function ModuleHero({
  icon: Icon,
  eyebrow,
  title,
  description,
  accent = "#6366F1",
  deep = "#4338CA",
  stats = [],
  progress,
  progressLabel,
  action,
  onAction,
  actionDisabled = false,
  children,
  className = "",
  compact = true,
  illustration = "skills",
}) {
  const mobileStatsColumns =
    stats.length >= 3 ? "grid-cols-3" : stats.length === 2 ? "grid-cols-2" : "grid-cols-1";

  return (
    <section
      className={`relative overflow-hidden rounded-3xl text-white backdrop-blur-2xl transition-all duration-300 ${
        compact ? "p-4 sm:p-6" : "p-5 sm:p-7 lg:min-h-[220px] lg:p-8"
      } ${className}`}
      style={{
        background: `radial-gradient(ellipse at 85% 15%, ${accent}2b 0%, transparent 58%), radial-gradient(ellipse at 15% 85%, ${deep}1a 0%, transparent 52%), linear-gradient(145deg, #0F172A 0%, #111827 50%, #0B0F17 100%)`,
        border: `1px solid ${accent}38`,
        boxShadow: `0 20px 50px -15px ${accent}25, inset 0 1px 1px 0 rgba(255,255,255,0.12)`,
      }}
    >
      {/* Aurora Ambient Glow Orbs */}
      <div
        className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full blur-3xl"
        style={{ backgroundColor: `${accent}22` }}
      />
      <div
        className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full blur-3xl"
        style={{ backgroundColor: `${deep}18` }}
      />

      <ModuleHeroIllustration variant={illustration} />

      <div
        className={`relative z-10 grid gap-3 sm:gap-6 ${
          compact
            ? "lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center"
            : "lg:grid-cols-[minmax(0,1fr)_260px] lg:items-center"
        }`}
      >
        <div className="min-w-0">
          <div className="flex items-center gap-3 sm:gap-4">
            {Icon && (
              <span
                className={`grid shrink-0 place-items-center rounded-2xl border backdrop-blur-xl ${
                  compact ? "h-11 w-11 sm:h-12 sm:w-12" : "h-12 w-12 sm:h-14 sm:w-14"
                }`}
                style={{
                  background: `linear-gradient(135deg, ${accent}, ${deep})`,
                  borderColor: "rgba(255,255,255,0.35)",
                  boxShadow: `0 8px 24px -4px ${accent}60, inset 0 1px 1px 0 rgba(255,255,255,0.45)`,
                }}
              >
                <Icon size={compact ? 22 : 26} strokeWidth={2.2} />
              </span>
            )}
            <div className="min-w-0">
              {eyebrow && (
                <div
                  className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] sm:text-xs"
                  style={{
                    backgroundColor: `${accent}18`,
                    border: `1px solid ${accent}35`,
                    color: accent,
                  }}
                >
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: accent, boxShadow: `0 0 6px ${accent}` }}
                  />
                  {eyebrow}
                </div>
              )}
              <h2
                className={`mt-1 line-clamp-2 font-display font-black leading-tight tracking-tight ${
                  compact ? "text-xl sm:text-2xl" : "text-2xl sm:text-3xl"
                }`}
              >
                {title}
              </h2>
            </div>
          </div>

          {description && (
            <p
              className={`mt-2.5 line-clamp-2 text-xs leading-relaxed text-slate-300/90 sm:line-clamp-none sm:text-sm sm:leading-6 ${
                compact ? "max-w-2xl" : "max-w-3xl"
              }`}
            >
              {description}
            </p>
          )}

          {progress !== undefined && (
            <div className="mt-3.5 max-w-xl sm:mt-5">
              <div className="mb-1.5 flex items-center justify-between gap-2 text-xs font-semibold text-slate-300">
                <span className="min-w-0 truncate">{progressLabel || "Tiến độ"}</span>
                <span className="shrink-0 font-mono font-bold" style={{ color: accent }}>
                  {progress}%
                </span>
              </div>
              <div
                className={`overflow-hidden rounded-full bg-white/10 backdrop-blur-sm ${
                  compact ? "h-2" : "h-2.5 lg:h-3"
                }`}
                role="progressbar"
                aria-label={progressLabel || "Tiến độ"}
                aria-valuemin="0"
                aria-valuemax="100"
                aria-valuenow={progress}
              >
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${progress}%`,
                    background: `linear-gradient(90deg, ${accent}, ${deep})`,
                    boxShadow: `0 0 12px ${accent}80`,
                  }}
                />
              </div>
            </div>
          )}
        </div>

        <div
          className={`${
            compact
              ? `grid w-full gap-2 ${mobileStatsColumns} sm:flex sm:flex-wrap sm:items-center sm:justify-end sm:gap-2.5 lg:w-auto`
              : "flex flex-col items-stretch gap-2.5 sm:flex-row sm:items-center lg:flex-col lg:items-end"
          }`}
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              className={`min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] text-center backdrop-blur-xl transition-all duration-200 hover:border-white/20 sm:text-left ${
                compact
                  ? "px-3 py-2 sm:min-w-[104px] sm:px-3.5 sm:py-2.5"
                  : "min-w-[120px] px-3.5 py-3"
              }`}
            >
              <p className="truncate text-[10px] font-bold uppercase tracking-wider text-slate-400 sm:text-[11px]">
                {stat.label}
              </p>
              <p
                className={`mt-0.5 break-words font-display font-bold tabular-nums text-white ${
                  compact ? "text-sm sm:mt-1 sm:text-base" : "text-lg"
                }`}
              >
                {stat.value}
              </p>
              {stat.note && (
                <p className="hidden text-[10px] text-slate-400 sm:block">{stat.note}</p>
              )}
            </div>
          ))}

          {action && (
            <button
              type="button"
              onClick={onAction}
              disabled={actionDisabled}
              className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-gradient-to-r from-white to-slate-100 font-bold text-slate-950 shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 ${
                compact
                  ? `col-span-full min-h-11 w-full px-4 text-xs sm:col-auto sm:w-auto sm:px-5 ${
                      action.length > 20 ? "sm:text-sm" : ""
                    }`
                  : "min-h-12 px-6 text-sm"
              }`}
              style={{
                boxShadow: `0 4px 20px ${accent}40`,
              }}
            >
              <Sparkles size={compact ? 15 : 17} style={{ color: deep }} />
              {action}
            </button>
          )}
        </div>
      </div>

      {children && (
        <div
          className={`relative z-10 border-t border-white/10 ${
            compact ? "mt-3 pt-3" : "mt-4 pt-4 sm:mt-5"
          }`}
        >
          {children}
        </div>
      )}
    </section>
  );
}
