import { BookOpen, Download, FileUp, Flame, GraduationCap, Sparkles, Trash2 } from "lucide-react";
import ModuleHeroIllustration from "../ui/ModuleHeroIllustration";

const percentOf = (value, total) => (total ? Math.round((value / total) * 100) : 0);

export default function VocabularyOverviewBanner({ libraryStats, streak, onStudy, onOpenTheme, onImport, onExport, onTrash }) {
  const total = libraryStats.total || 0;
  const mastered = libraryStats.mastered || 0;
  const learning = libraryStats.learning || 0;
  const newCards = libraryStats.newCards || 0;
  const streakDays = streak?.currentStreak || 0;
  const masteredPercent = percentOf(mastered, total);

  return (
    <section className="relative overflow-hidden rounded-2xl bg-[#2f6b4f] p-4 text-white shadow-soft sm:min-h-[252px] sm:p-7">
      <ModuleHeroIllustration variant="vocabulary" />

      <div className="relative z-10 grid gap-3 sm:gap-6 lg:grid-cols-[minmax(0,1fr)_240px] lg:items-center">
        <div className="min-w-0">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#1cb0f6] shadow-lg shadow-black/10 sm:h-14 sm:w-14 sm:rounded-2xl"><BookOpen size={23} strokeWidth={2.2} /></div>
            <div className="min-w-0"><p className="text-[10px] font-bold uppercase tracking-[0.1em] text-white/65 sm:text-xs sm:tracking-[0.12em]">Tổng quan học tập</p><h2 className="mt-0.5 line-clamp-2 font-display text-lg font-bold leading-tight tracking-tight sm:mt-1 sm:text-3xl">{mastered}/{total} từ đã học</h2></div>
          </div>
          <div className="mt-3 max-w-2xl sm:mt-6">
            <div className="mb-1.5 flex items-center justify-between gap-2 text-[10px] font-semibold text-white/75 sm:mb-2 sm:text-xs"><span>Tiến độ ghi nhớ</span><span className="shrink-0">{masteredPercent}% hoàn thành</span></div>
            <div className="flex h-2 overflow-hidden rounded-full bg-white/20 sm:h-3" role="progressbar" aria-label="Tiến độ từ đã học" aria-valuemin="0" aria-valuemax="100" aria-valuenow={masteredPercent}><span className="h-full bg-[#8ce99a] transition-all" style={{ width: `${masteredPercent}%` }} /><span className="h-full bg-[#ffd166] transition-all" style={{ width: `${percentOf(learning, total)}%` }} /><span className="h-full bg-[#f4a261] transition-all" style={{ width: `${percentOf(newCards, total)}%` }} /></div>
            <div className="mt-2 grid grid-cols-3 gap-1 text-[9px] font-semibold text-white/70 sm:mt-2 sm:flex sm:flex-wrap sm:gap-x-4 sm:text-[11px]"><span className="inline-flex min-w-0 items-center gap-1"><i className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#8ce99a] sm:h-2 sm:w-2" /><span className="truncate">Đã thuộc {mastered}</span></span><span className="inline-flex min-w-0 items-center gap-1"><i className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#ffd166] sm:h-2 sm:w-2" /><span className="truncate">Đang học {learning}</span></span><span className="inline-flex min-w-0 items-center gap-1"><i className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#f4a261] sm:h-2 sm:w-2" /><span className="truncate">Chưa học {newCards}</span></span></div>
          </div>
        </div>
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 sm:flex sm:flex-row sm:items-center sm:gap-3 lg:flex-col lg:items-end">
          <div className="inline-flex min-w-0 items-center justify-center gap-1.5 truncate rounded-full border border-white/20 bg-black/10 px-2.5 py-2 text-[11px] font-bold text-white/90 sm:justify-start sm:px-3.5 sm:text-sm"><Flame size={15} className="shrink-0 text-[#ffd166]" fill="currentColor" />{streakDays} ngày liên tiếp</div>
          <button type="button" onClick={onStudy} disabled={!total} className="inline-flex min-h-11 w-full items-center justify-center gap-1.5 rounded-xl bg-white px-3 text-xs font-bold text-[#2f6b4f] shadow-lg shadow-black/10 transition hover:-translate-y-0.5 hover:bg-[#f4fff5] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 sm:min-h-12 sm:w-auto sm:gap-2 sm:px-5 sm:text-sm"><Sparkles size={16} />Học ngay 📚</button>
          <div className="hidden items-center gap-2 text-xs font-semibold text-white/65 lg:flex"><GraduationCap size={15} />Mỗi từ là một bước tiến</div>
        </div>
      </div>

      <div className="relative z-10 mt-4 grid grid-cols-4 gap-1.5 border-t border-white/15 pt-3 sm:mt-6 sm:flex sm:flex-wrap sm:gap-2 sm:pt-4">
        <button type="button" onClick={onOpenTheme} className="inline-flex min-h-[54px] min-w-0 flex-col items-center justify-center gap-1 rounded-xl border border-white/15 bg-white/10 px-1 text-center text-[9px] font-bold leading-3 text-white transition hover:bg-white/20 sm:min-h-10 sm:flex-row sm:gap-2 sm:px-3.5 sm:text-xs"><BookOpen size={15} className="shrink-0" /><span className="sm:hidden">Chủ đề</span><span className="hidden sm:inline">Bộ theo chủ đề</span></button>
        <button type="button" onClick={onImport} className="inline-flex min-h-[54px] min-w-0 flex-col items-center justify-center gap-1 rounded-xl border border-white/15 bg-white/10 px-1 text-[9px] font-bold leading-3 text-white transition hover:bg-white/20 sm:min-h-10 sm:flex-row sm:gap-2 sm:px-3.5 sm:text-xs"><FileUp size={15} className="shrink-0" />Nhập</button>
        <button type="button" onClick={onExport} className="inline-flex min-h-[54px] min-w-0 flex-col items-center justify-center gap-1 rounded-xl border border-white/15 bg-white/10 px-1 text-[9px] font-bold leading-3 text-white transition hover:bg-white/20 sm:min-h-10 sm:flex-row sm:gap-2 sm:px-3.5 sm:text-xs"><Download size={15} className="shrink-0" />Xuất</button>
        <button type="button" onClick={onTrash} className="inline-flex min-h-[54px] min-w-0 flex-col items-center justify-center gap-1 rounded-xl border border-white/15 bg-white/10 px-1 text-[9px] font-bold leading-3 text-white transition hover:bg-white/20 sm:min-h-10 sm:flex-row sm:gap-2 sm:px-3.5 sm:text-xs"><Trash2 size={15} className="shrink-0" />Thùng rác</button>
      </div>
    </section>
  );
}
