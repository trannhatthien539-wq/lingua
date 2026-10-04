import { BookOpen, CheckCircle2, Clock3, Eye, Sparkles } from "lucide-react";
import SafeImage from "../ui/SafeImage";

const COVER_TONES = [
  "from-indigo-500/15 via-indigo-500/5 to-transparent text-indigo-500 dark:text-indigo-400",
  "from-emerald-500/15 via-emerald-500/5 to-transparent text-emerald-500 dark:text-emerald-400",
  "from-cyan-500/15 via-cyan-500/5 to-transparent text-cyan-500 dark:text-cyan-400",
  "from-purple-500/15 via-purple-500/5 to-transparent text-purple-500 dark:text-purple-400"
];

const percentOf = (value, total) => (total ? Math.round((value / total) * 100) : 0);

export default function VocabularyDeckCard({ deck, index, entry, onOpen, onStudy }) {
  const total = entry.total || 0;
  const mastered = entry.mastered || 0;
  const due = entry.due || 0;
  const learning = entry.cards.filter((card) => card.status === "learning").length;
  const percent = percentOf(mastered, total);
  const coverImage = entry.cards.find((card) => card.imageUrl)?.imageUrl;
  const coverTone = COVER_TONES[index % COVER_TONES.length];
  const reviewLabel = due ? `${due} cần ôn hôm nay` : total ? "Đã lên lịch ôn" : "Chưa có từ";

  return (
    <article className="panel group flex h-full flex-col overflow-hidden p-0 border border-slate-200/80 bg-white/70 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-indigo-400/50 hover:shadow-[0_16px_36px_-10px_rgba(99,102,241,0.18)] dark:border-white/[0.08] dark:bg-[#111827]/70 dark:hover:border-indigo-500/40 dark:hover:shadow-[0_16px_36px_-10px_rgba(0,0,0,0.5)]">
      <button type="button" onClick={() => onOpen(deck.id)} className="relative block aspect-[16/9] w-full overflow-hidden text-left" aria-label={`Mở bộ thẻ ${deck.title}`}>
        {coverImage ? <SafeImage src={coverImage} alt={deck.title} fallbackWord={deck.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" /> : <div className={`flex h-full w-full flex-col items-center justify-center bg-gradient-to-br ${coverTone}`}><span className="grid h-14 w-14 place-items-center rounded-2xl border border-white/20 bg-white/70 shadow-md backdrop-blur-md dark:bg-white/10"><BookOpen size={28} strokeWidth={2} /></span><span className="mt-2.5 max-w-[85%] truncate text-[11px] font-bold uppercase tracking-wider opacity-80">{deck.tags?.[0] || deck.level || "Vocabulary"}</span></div>}
        <span className="absolute right-3 top-3 rounded-full border border-white/10 bg-slate-900/70 px-2.5 py-1 text-[11px] font-mono font-bold text-white backdrop-blur-md">{total} từ</span>
        <span className="absolute bottom-3 left-3 inline-flex max-w-[80%] items-center gap-1.5 rounded-full border border-white/20 bg-white/80 px-2.5 py-1 text-xs font-bold text-slate-900 shadow-sm backdrop-blur-md dark:bg-slate-900/80 dark:text-white"><BookOpen size={12} className="text-indigo-500" />{deck.title}</span>
      </button>
      <div className="relative flex flex-1 flex-col p-4 sm:p-5">
        <p className="eyebrow text-indigo-600/80 dark:text-indigo-400/80">Bộ thẻ #{index + 1}</p>
        <h3 className="relative mt-1 line-clamp-2 font-display text-lg font-bold text-slate-900 dark:text-white">{deck.title}</h3>
        <div className="relative mt-3 flex flex-wrap gap-1.5">
          <span className="chip border border-slate-200/80 bg-slate-100/70 text-slate-700 dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-300">{total} từ vựng</span>
          <span className="chip border border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-400"><Clock3 size={12} className="mr-1" />{reviewLabel}</span>
        </div>
        <div className="relative mt-auto pt-5">
          <div className="mb-2 flex items-center justify-between gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span>{mastered}/{total} từ</span>
            <span className="font-mono text-emerald-600 dark:text-emerald-400">{percent}% hoàn thành</span>
          </div>
          <div className="flex h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10" role="progressbar" aria-label={`Tiến độ bộ ${deck.title}`} aria-valuemin="0" aria-valuemax="100" aria-valuenow={percent}>
            <span className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 transition-all duration-500" style={{ width: `${percent}%` }} />
            <span className="h-full bg-amber-400 transition-all duration-500" style={{ width: `${Math.min(100 - percent, percentOf(learning, total))}%` }} />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button type="button" onClick={() => onStudy(entry.dueCards.length ? entry.dueCards : entry.cards, deck.id)} disabled={!total} className="btn-primary flex-1 px-3 text-xs disabled:cursor-not-allowed sm:flex-none">
              {due ? <CheckCircle2 size={15} /> : <Sparkles size={15} />}
              {due ? `Ôn ${Math.min(due, 50)} từ` : "Học ngay"}
            </button>
            <button type="button" onClick={() => onOpen(deck.id)} className="btn-secondary flex-1 px-3 text-xs sm:flex-none">
              <Eye size={15} />Xem {total} từ
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
