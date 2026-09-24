import { BookOpen, ClipboardCheck, GraduationCap, PenLine, PlayCircle, Sparkles, Trophy } from "lucide-react";
import ModuleHeroIllustration from "../ui/ModuleHeroIllustration";

/** Hero tổng quan cho trang Ngữ pháp, đồng nhất với hero của Trang chủ/Từ vựng. */
export default function GrammarOverviewBanner({ completedCount, total, percent, nextLesson, mistakesCount, onStart, onExam }) {
  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#6b55c9] via-[#5b48b4] to-[#3f347e] p-4 text-white shadow-soft sm:min-h-[252px] sm:p-7">
      <ModuleHeroIllustration variant="grammar" />

      <div className="relative z-10 grid gap-3 sm:gap-6 lg:grid-cols-[minmax(0,1fr)_250px] lg:items-center">
        <div className="min-w-0">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#ce82ff] shadow-lg shadow-black/10 sm:h-14 sm:w-14 sm:rounded-2xl"><GraduationCap size={23} strokeWidth={2.1} /></div>
            <div className="min-w-0"><p className="text-[10px] font-bold uppercase tracking-[0.1em] text-white/70 sm:text-xs sm:tracking-[0.12em]">Tổng quan ngữ pháp</p><h2 className="mt-0.5 line-clamp-2 font-display text-lg font-bold leading-tight tracking-tight sm:mt-1 sm:text-3xl">{completedCount}/{total} bài đã hoàn thành</h2></div>
          </div>
          <div className="mt-3 max-w-2xl sm:mt-6">
            <div className="mb-1.5 flex items-center justify-between gap-2 text-[10px] font-semibold text-white/80 sm:mb-2 sm:text-xs"><span>Hành trình chinh phục</span><span className="shrink-0">{percent}% hoàn thành</span></div>
            <div className="h-2 overflow-hidden rounded-full bg-white/20 sm:h-3" role="progressbar" aria-label="Tiến độ ngữ pháp" aria-valuemin="0" aria-valuemax="100" aria-valuenow={percent}><div className="h-full rounded-full bg-[#d9b8ff] transition-all" style={{ width: `${percent}%` }} /></div>
            <div className="mt-2 grid grid-cols-2 gap-x-2 gap-y-1 text-[9px] font-semibold text-white/70 sm:flex sm:flex-wrap sm:gap-3 sm:text-[11px]"><span className="inline-flex items-center gap-1"><i className="h-1.5 w-1.5 rounded-full bg-[#d9b8ff] sm:h-2 sm:w-2" />Đã đạt {completedCount}</span><span className="inline-flex items-center gap-1"><i className="h-1.5 w-1.5 rounded-full bg-white/35 sm:h-2 sm:w-2" />Còn lại {Math.max(0, total - completedCount)}</span><span className="col-span-2 inline-flex min-w-0 items-center gap-1 sm:col-auto"><PenLine size={11} className="shrink-0" /><span className="truncate">Bài tiếp theo: {nextLesson?.title || 'Đã hoàn thành'}</span></span></div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-row sm:items-center sm:gap-3 lg:flex-col lg:items-end">
          <div className="col-span-2 inline-flex min-w-0 items-center justify-center gap-1.5 rounded-full border border-white/20 bg-black/10 px-2.5 py-2 text-center text-[11px] font-bold text-white/90 sm:col-auto sm:justify-start sm:px-3.5 sm:text-sm"><Trophy size={15} className="shrink-0 text-[#ffd166]" />{mistakesCount ? `${mistakesCount} câu cần ôn` : 'Sẵn sàng chinh phục'}</div>
          <button type="button" onClick={onStart} disabled={!nextLesson} className="inline-flex min-h-11 w-full items-center justify-center gap-1.5 rounded-xl bg-white px-2 text-xs font-bold text-[#51429b] shadow-lg shadow-black/10 transition hover:-translate-y-0.5 hover:bg-[#faf7ff] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 sm:min-h-12 sm:w-auto sm:gap-2 sm:px-5 sm:text-sm"><PlayCircle size={16} />{completedCount ? 'Tiếp tục học' : 'Bắt đầu học'}</button>
          <button type="button" onClick={onExam} className="inline-flex min-h-11 w-full items-center justify-center gap-1.5 rounded-xl border border-white/30 px-2 text-xs font-bold text-white transition hover:bg-white/10 sm:min-h-11 sm:w-auto sm:px-4"><ClipboardCheck size={15} />Thi tổng hợp</button>
        </div>
      </div>

      <div className="relative z-10 mt-4 hidden items-center gap-2 border-t border-white/15 pt-4 text-xs font-semibold text-white/75 sm:flex"><BookOpen size={15} />30 bài từ thì cơ bản đến C1<span className="text-white/35">·</span><Sparkles size={14} />Học theo cấu trúc, luyện đều và ghi nhớ lâu dài</div>
    </section>
  );
}
