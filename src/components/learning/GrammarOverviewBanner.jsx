import { BookOpen, ClipboardCheck, GraduationCap, PenLine, PlayCircle, Sparkles, Trophy } from "lucide-react";
import ModuleHeroIllustration from "../ui/ModuleHeroIllustration";

/** Hero tổng quan cho trang Ngữ pháp, đồng nhất với hero của Trang chủ/Từ vựng. */
export default function GrammarOverviewBanner({ completedCount, total, percent, nextLesson, mistakesCount, onStart, onExam }) {
  return (
    <section className="relative min-h-[252px] overflow-hidden rounded-2xl bg-gradient-to-br from-[#6b55c9] via-[#5b48b4] to-[#3f347e] p-5 text-white shadow-soft sm:p-7">
      <ModuleHeroIllustration variant="grammar" />

      <div className="relative z-10 grid gap-6 lg:grid-cols-[minmax(0,1fr)_250px] lg:items-center">
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-[#ce82ff] shadow-lg shadow-black/10"><GraduationCap size={28} strokeWidth={2.1} /></div>
            <div className="min-w-0"><p className="text-xs font-bold uppercase tracking-[0.12em] text-white/70">Tổng quan ngữ pháp</p><h2 className="mt-1 font-display text-2xl font-bold tracking-tight sm:text-3xl">{completedCount}/{total} bài đã hoàn thành</h2></div>
          </div>
          <div className="mt-6 max-w-2xl">
            <div className="mb-2 flex items-center justify-between gap-3 text-xs font-semibold text-white/80"><span>Hành trình chinh phục</span><span>{percent}% hoàn thành</span></div>
            <div className="h-3 overflow-hidden rounded-full bg-white/20" role="progressbar" aria-label="Tiến độ ngữ pháp" aria-valuemin="0" aria-valuemax="100" aria-valuenow={percent}><div className="h-full rounded-full bg-[#d9b8ff] transition-all" style={{ width: `${percent}%` }} /></div>
            <div className="mt-2 flex flex-wrap gap-3 text-[11px] font-semibold text-white/70"><span className="inline-flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-[#d9b8ff]" />Đã đạt {completedCount}</span><span className="inline-flex items-center gap-1.5"><i className="h-2 w-2 rounded-full bg-white/35" />Còn lại {Math.max(0, total - completedCount)}</span><span className="inline-flex items-center gap-1.5"><PenLine size={12} />Bài tiếp theo: {nextLesson?.title || 'Đã hoàn thành'}</span></div>
          </div>
        </div>
        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center lg:flex-col lg:items-end">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/10 px-3.5 py-2 text-sm font-bold text-white/90"><Trophy size={16} className="text-[#ffd166]" />{mistakesCount ? `${mistakesCount} câu cần ôn` : 'Sẵn sàng chinh phục'}</div>
          <button type="button" onClick={onStart} disabled={!nextLesson} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-bold text-[#51429b] shadow-lg shadow-black/10 transition hover:-translate-y-0.5 hover:bg-[#faf7ff] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"><PlayCircle size={17} />{completedCount ? 'Tiếp tục học' : 'Bắt đầu học'}</button>
          <button type="button" onClick={onExam} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/30 px-4 text-xs font-bold text-white transition hover:bg-white/10"><ClipboardCheck size={15} />Thi tổng hợp</button>
        </div>
      </div>

      <div className="relative z-10 mt-6 flex flex-wrap items-center gap-2 border-t border-white/15 pt-4 text-xs font-semibold text-white/75"><BookOpen size={15} />30 bài từ thì cơ bản đến C1<span className="text-white/35">·</span><Sparkles size={14} />Học theo cấu trúc, luyện đều và ghi nhớ lâu dài</div>
    </section>
  );
}
