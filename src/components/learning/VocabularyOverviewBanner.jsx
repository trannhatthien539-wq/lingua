import { BookOpen, Download, FileUp, Flame, Sparkles, Trash2 } from "lucide-react";
import ModuleHeroIllustration from "../ui/ModuleHeroIllustration";

const percentOf = (value, total) => (total ? Math.round((value / total) * 100) : 0);

export default function VocabularyOverviewBanner({
  libraryStats,
  streak,
  onStudy,
  onOpenTheme,
  onImport,
  onExport,
  onTrash,
}) {
  const total = libraryStats.total || 0;
  const mastered = libraryStats.mastered || 0;
  const learning = libraryStats.learning || 0;
  const newCards = libraryStats.newCards || 0;
  const streakDays = streak?.currentStreak || 0;
  const masteredPercent = percentOf(mastered, total);

  return (
    <section
      className="relative overflow-hidden rounded-3xl p-6 text-white backdrop-blur-2xl transition-all duration-300 sm:min-h-[252px] sm:p-8"
      style={{
        background: `radial-gradient(ellipse at 85% 15%, rgba(14,165,233,0.22) 0%, transparent 58%), radial-gradient(ellipse at 15% 85%, rgba(16,185,129,0.16) 0%, transparent 52%), linear-gradient(145deg, #0F172A 0%, #111827 50%, #0B0F17 100%)`,
        border: "1px solid rgba(14,165,233,0.28)",
        boxShadow: "0 20px 50px -15px rgba(14,165,233,0.2), inset 0 1px 1px 0 rgba(255,255,255,0.12)",
      }}
    >
      {/* Aurora Ambient Glow Orbs */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-sky-500/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-emerald-500/15 blur-3xl" />
      <ModuleHeroIllustration variant="vocabulary" />

      <div className="relative z-10 grid gap-4 sm:gap-6 lg:grid-cols-[minmax(0,1fr)_250px] lg:items-center">
        <div className="min-w-0">
          <div className="flex items-center gap-3.5 sm:gap-4">
            <div
              className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-white/30 backdrop-blur-xl sm:h-14 sm:w-14"
              style={{
                background: "linear-gradient(135deg, #0EA5E9, #0284C7)",
                boxShadow: "0 8px 24px -4px rgba(14,165,233,0.5), inset 0 1px 1px 0 rgba(255,255,255,0.45)",
              }}
            >
              <BookOpen size={24} strokeWidth={2.2} />
            </div>
            <div className="min-w-0">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-sky-400/30 bg-sky-500/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] text-sky-400 sm:text-xs">
                <span className="h-1.5 w-1.5 rounded-full bg-sky-400 shadow-[0_0_6px_#38BDF8]" />
                Tổng quan kho từ vựng
              </div>
              <h2 className="mt-1 line-clamp-2 font-display text-xl font-black leading-tight tracking-tight sm:mt-1 sm:text-3xl">
                {mastered}/{total} từ đã thuộc
              </h2>
            </div>
          </div>

          <div className="mt-4 max-w-2xl sm:mt-6">
            <div className="mb-2 flex items-center justify-between gap-2 text-xs font-semibold text-slate-300">
              <span>Tiến độ ghi nhớ</span>
              <span className="font-mono font-bold text-sky-400">{masteredPercent}% hoàn thành</span>
            </div>
            <div
              className="flex h-2.5 overflow-hidden rounded-full bg-white/10 backdrop-blur-sm sm:h-3"
              role="progressbar"
              aria-label="Tiến độ từ đã học"
              aria-valuemin="0"
              aria-valuemax="100"
              aria-valuenow={masteredPercent}
            >
              <span
                className="h-full bg-gradient-to-r from-sky-400 to-emerald-400 shadow-[0_0_12px_rgba(56,189,248,0.6)] transition-all duration-500"
                style={{ width: `${masteredPercent}%` }}
              />
              <span
                className="h-full bg-amber-400 transition-all duration-500"
                style={{ width: `${percentOf(learning, total)}%` }}
              />
              <span
                className="h-full bg-rose-400/80 transition-all duration-500"
                style={{ width: `${percentOf(newCards, total)}%` }}
              />
            </div>
            <div className="mt-2.5 grid grid-cols-3 gap-1 text-[10px] font-semibold text-slate-300 sm:flex sm:flex-wrap sm:gap-x-4 sm:text-xs">
              <span className="inline-flex min-w-0 items-center gap-1.5">
                <i className="h-2 w-2 shrink-0 rounded-full bg-emerald-400 shadow-[0_0_6px_#34D399]" />
                <span className="truncate">Đã thuộc {mastered}</span>
              </span>
              <span className="inline-flex min-w-0 items-center gap-1.5">
                <i className="h-2 w-2 shrink-0 rounded-full bg-amber-400" />
                <span className="truncate">Đang học {learning}</span>
              </span>
              <span className="inline-flex min-w-0 items-center gap-1.5">
                <i className="h-2 w-2 shrink-0 rounded-full bg-rose-400/80" />
                <span className="truncate">Chưa học {newCards}</span>
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 sm:flex sm:flex-row sm:items-center sm:gap-3 lg:flex-col lg:items-end">
          <div className="inline-flex min-w-0 items-center justify-center gap-1.5 truncate rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-md sm:justify-start sm:px-4 sm:text-sm">
            <Flame size={15} className="shrink-0 text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.6)]" fill="currentColor" />
            {streakDays} ngày liên tiếp
          </div>
          <button
            type="button"
            onClick={onStudy}
            disabled={!total}
            className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-400 to-emerald-400 px-5 text-xs font-bold text-slate-950 shadow-[0_0_20px_rgba(14,165,233,0.35)] transition-all hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
          >
            <Sparkles size={16} />Học ngay
          </button>
        </div>
      </div>

      <div className="relative z-10 mt-5 grid grid-cols-4 gap-2 border-t border-white/10 pt-4 sm:flex sm:flex-wrap sm:gap-2.5 sm:pt-5">
        <button
          type="button"
          onClick={onOpenTheme}
          className="inline-flex min-h-[46px] min-w-0 flex-col items-center justify-center gap-1 rounded-xl border border-white/10 bg-white/[0.04] px-2 text-center text-[10px] font-bold text-white backdrop-blur-xl transition-all hover:border-sky-400/30 hover:bg-white/[0.08] sm:min-h-10 sm:flex-row sm:gap-2 sm:px-4 sm:text-xs"
        >
          <BookOpen size={15} className="shrink-0 text-sky-400" />
          <span className="sm:hidden">Chủ đề</span>
          <span className="hidden sm:inline">Bộ theo chủ đề</span>
        </button>
        <button
          type="button"
          onClick={onImport}
          className="inline-flex min-h-[46px] min-w-0 flex-col items-center justify-center gap-1 rounded-xl border border-white/10 bg-white/[0.04] px-2 text-[10px] font-bold text-white backdrop-blur-xl transition-all hover:border-sky-400/30 hover:bg-white/[0.08] sm:min-h-10 sm:flex-row sm:gap-2 sm:px-4 sm:text-xs"
        >
          <FileUp size={15} className="shrink-0 text-indigo-400" />Nhập
        </button>
        <button
          type="button"
          onClick={onExport}
          className="inline-flex min-h-[46px] min-w-0 flex-col items-center justify-center gap-1 rounded-xl border border-white/10 bg-white/[0.04] px-2 text-[10px] font-bold text-white backdrop-blur-xl transition-all hover:border-sky-400/30 hover:bg-white/[0.08] sm:min-h-10 sm:flex-row sm:gap-2 sm:px-4 sm:text-xs"
        >
          <Download size={15} className="shrink-0 text-teal-400" />Xuất
        </button>
        <button
          type="button"
          onClick={onTrash}
          className="inline-flex min-h-[46px] min-w-0 flex-col items-center justify-center gap-1 rounded-xl border border-white/10 bg-white/[0.04] px-2 text-[10px] font-bold text-white backdrop-blur-xl transition-all hover:border-rose-400/30 hover:bg-white/[0.08] sm:min-h-10 sm:flex-row sm:gap-2 sm:px-4 sm:text-xs"
        >
          <Trash2 size={15} className="shrink-0 text-rose-400" />Thùng rác
        </button>
      </div>
    </section>
  );
}
