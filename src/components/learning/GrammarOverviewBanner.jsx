import { ClipboardCheck, GraduationCap, PenLine, PlayCircle, Trophy } from "lucide-react";
import ModuleHeroIllustration from "../ui/ModuleHeroIllustration";

/** Hero tổng quan cho trang Ngữ pháp, đồng nhất với hero của Trang chủ/Từ vựng. */
export default function GrammarOverviewBanner({ completedCount, total, percent, nextLesson, mistakesCount, onStart, onExam }) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-indigo-500/25 bg-gradient-to-br from-[#110D26] via-[#1E1446] to-[#0D0922] p-6 text-white shadow-[0_20px_60px_-15px_rgba(147,51,234,0.2)] backdrop-blur-2xl sm:min-h-[252px] sm:p-8">
      {/* Glow orb */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-purple-500/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-indigo-500/15 blur-3xl" />
      <ModuleHeroIllustration variant="grammar" />

      <div className="relative z-10 grid gap-4 sm:gap-6 lg:grid-cols-[minmax(0,1fr)_250px] lg:items-center">
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl border border-white/20 bg-gradient-to-br from-purple-500 to-indigo-600 shadow-[0_4px_16px_rgba(147,51,234,0.35)] sm:h-14 sm:w-14"><GraduationCap size={24} strokeWidth={2.1} /></div>
            <div className="min-w-0"><p className="text-[10px] font-bold uppercase tracking-[0.14em] text-purple-300/80 sm:text-xs">Chương trình ngữ pháp Cambridge</p><h2 className="mt-0.5 line-clamp-2 font-display text-xl font-black leading-tight tracking-tight sm:mt-1 sm:text-3xl">{completedCount}/{total} bài đã hoàn thành</h2></div>
          </div>
          <div className="mt-4 max-w-2xl sm:mt-6">
            <div className="mb-2 flex items-center justify-between gap-2 text-xs font-semibold text-slate-300"><span>Hành trình chinh phục</span><span className="font-mono font-bold text-purple-300">{percent}% hoàn thành</span></div>
            <div className="h-2.5 overflow-hidden rounded-full bg-white/10 backdrop-blur-sm sm:h-3" role="progressbar" aria-label="Tiến độ ngữ pháp" aria-valuemin="0" aria-valuemax="100" aria-valuenow={percent}><div className="h-full rounded-full bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 shadow-[0_0_12px_rgba(168,85,247,0.6)] transition-all duration-500" style={{ width: `${percent}%` }} /></div>
            <div className="mt-2.5 grid grid-cols-2 gap-x-2 gap-y-1 text-[10px] font-semibold text-slate-300 sm:flex sm:flex-wrap sm:gap-4 sm:text-xs"><span className="inline-flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-purple-400 shadow-[0_0_6px_#C084FC]" />Đã đạt {completedCount}</span><span className="inline-flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-white/30" />Còn lại {Math.max(0, total - completedCount)}</span><span className="col-span-2 inline-flex min-w-0 items-center gap-1.5 sm:col-auto"><PenLine size={13} className="shrink-0 text-indigo-300" /><span className="truncate">Bài tiếp theo: {nextLesson?.title || 'Đã hoàn thành'}</span></span></div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-row sm:items-center sm:gap-3 lg:flex-col lg:items-end">
          <div className="col-span-2 inline-flex min-w-0 items-center justify-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-center text-xs font-bold text-white backdrop-blur-md sm:col-auto sm:justify-start sm:px-4 sm:text-sm"><Trophy size={15} className="shrink-0 text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.6)]" />{mistakesCount ? `${mistakesCount} câu cần ôn` : 'Sẵn sàng chinh phục'}</div>
          <button type="button" onClick={onStart} disabled={!nextLesson} className="inline-flex min-h-[46px] w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 px-5 text-xs font-bold text-white shadow-[0_0_20px_rgba(147,51,234,0.35)] transition-all hover:scale-[1.02] hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"><PlayCircle size={17} />{completedCount ? 'Tiếp tục học' : 'Bắt đầu học'}</button>
          <button type="button" onClick={onExam} className="inline-flex min-h-[46px] w-full items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 text-xs font-bold text-white backdrop-blur-md transition-all hover:bg-white/20 sm:text-sm"><ClipboardCheck size={16} />Thi tổng hợp</button>
        </div>
      </div>
    </section>
  );
}
