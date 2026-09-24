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
    <section className="relative min-h-[252px] overflow-hidden rounded-2xl bg-[#2f6b4f] p-5 text-white shadow-soft sm:p-7">
      <ModuleHeroIllustration variant="vocabulary" />

      <div className="relative z-10 grid gap-6 lg:grid-cols-[minmax(0,1fr)_240px] lg:items-center">
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-[#1cb0f6] shadow-lg shadow-black/10"><BookOpen size={27} strokeWidth={2.2} /></div>
            <div className="min-w-0"><p className="text-xs font-bold uppercase tracking-[0.12em] text-white/65">Tổng quan học tập</p><h2 className="mt-1 font-display text-2xl font-bold tracking-tight sm:text-3xl">{mastered}/{total} từ đã học</h2></div>
          </div>
          <div className="mt-6 max-w-2xl">
            <div className="mb-2 flex items-center justify-between gap-3 text-xs font-semibold text-white/75"><span>Tiến độ ghi nhớ</span><span>{masteredPercent}% hoàn thành</span></div>
            <div className="flex h-3 overflow-hidden rounded-full bg-white/20" role="progressbar" aria-label="Tiến độ từ đã học" aria-valuemin="0" aria-valuemax="100" aria-valuenow={masteredPercent}><span className="h-full bg-[#8ce99a] transition-all" style={{ width: `${masteredPercent}%` }} /><span className="h-full bg-[#ffd166] transition-all" style={{ width: `${percentOf(learning, total)}%` }} /><span className="h-full bg-[#f4a261] transition-all" style={{ width: `${percentOf(newCards, total)}%` }} /></div>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] font-semibold text-white/70"><span className="inline-flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-[#8ce99a]" />Đã thuộc {mastered}</span><span className="inline-flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-[#ffd166]" />Đang học {learning}</span><span className="inline-flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-[#f4a261]" />Chưa học {newCards}</span></div>
          </div>
        </div>
        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center lg:flex-col lg:items-end">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/10 px-3.5 py-2 text-sm font-bold text-white/90"><Flame size={17} className="text-[#ffd166]" fill="currentColor" />🔥 {streakDays} ngày liên tiếp</div>
          <button type="button" onClick={onStudy} disabled={!total} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-bold text-[#2f6b4f] shadow-lg shadow-black/10 transition hover:-translate-y-0.5 hover:bg-[#f4fff5] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"><Sparkles size={17} />Học ngay 📚</button>
          <div className="hidden items-center gap-2 text-xs font-semibold text-white/65 lg:flex"><GraduationCap size={15} />Mỗi từ là một bước tiến</div>
        </div>
      </div>

      <div className="relative z-10 mt-6 flex flex-wrap gap-2 border-t border-white/15 pt-4">
        <button type="button" onClick={onOpenTheme} className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3.5 text-xs font-bold text-white transition hover:bg-white/20"><BookOpen size={15} />Bộ theo chủ đề</button>
        <button type="button" onClick={onImport} className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3.5 text-xs font-bold text-white transition hover:bg-white/20"><FileUp size={15} />Nhập</button>
        <button type="button" onClick={onExport} className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3.5 text-xs font-bold text-white transition hover:bg-white/20"><Download size={15} />Xuất</button>
        <button type="button" onClick={onTrash} className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3.5 text-xs font-bold text-white transition hover:bg-white/20"><Trash2 size={15} />Thùng rác</button>
      </div>
    </section>
  );
}
