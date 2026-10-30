import { memo } from "react";
import { BookOpen, CheckCircle2, Eye, Sparkles } from "lucide-react";
import SafeImage from "../ui/SafeImage";

const COVER_TONES = [
  "from-indigo-500/15 via-indigo-500/5 to-transparent text-indigo-500 dark:text-indigo-400",
  "from-emerald-500/15 via-emerald-500/5 to-transparent text-emerald-500 dark:text-emerald-400",
  "from-cyan-500/15 via-cyan-500/5 to-transparent text-cyan-500 dark:text-cyan-400",
  "from-purple-500/15 via-purple-500/5 to-transparent text-purple-500 dark:text-purple-400"
];

const percentOf = (value, total) => (total ? Math.round((value / total) * 100) : 0);

export default memo(function VocabularyDeckCard({ deck, index, entry, onOpen, onStudy }) {
  const total = entry.total || 0;
  const mastered = entry.mastered || 0;
  const due = entry.due || 0;
  const percent = percentOf(mastered, total);
  const coverImage = entry.cards.find((card) => card.imageUrl)?.imageUrl;
  const coverTone = COVER_TONES[index % COVER_TONES.length];
  const newCount = entry.cards.filter((card) => !card.status || card.status === "new").length;
  const reviewLabel = due ? `${due} cần ôn hôm nay` : newCount ? `${newCount} từ mới` : total ? "Đã lên lịch ôn" : "Chưa có từ";

  return (
    <article className="panel group flex h-full flex-col overflow-hidden p-0 transition-all duration-300 hover:-translate-y-0.5 hover:border-indigo-400/50 hover:shadow-[0_16px_36px_-10px_rgba(99,102,241,0.16)] dark:hover:border-indigo-500/40">
      <button
        type="button"
        onClick={() => onOpen(deck.id)}
        className="relative block aspect-[24/9] w-full overflow-hidden text-left"
        aria-label={`Mở bộ thẻ ${deck.title}`}
      >
        {coverImage ? (
          <SafeImage src={coverImage} alt={deck.title} fallbackWord={deck.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
        ) : (
          <div className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${coverTone}`}>
            <span className="grid h-12 w-12 place-items-center rounded-2xl border border-white/20 bg-white/70 shadow-sm backdrop-blur-md dark:bg-white/10">
              <BookOpen size={24} strokeWidth={2} />
            </span>
          </div>
        )}
        <span className="absolute bottom-2.5 left-2.5 rounded-full border border-white/20 bg-white/80 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-700 backdrop-blur-md dark:bg-slate-900/80 dark:text-slate-200">
          {deck.level || "Từ vựng"}
        </span>
      </button>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-2 font-display text-base font-bold text-slate-900 dark:text-white">
          {deck.title}
        </h3>
        <p className="mt-1 text-[11px] font-medium text-slate-500 dark:text-slate-400">
          {total} từ · {reviewLabel}
        </p>

        <div className="mt-auto pt-4">
          <div className="mb-1.5 flex items-center justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400">
            <span>{mastered}/{total} từ</span>
            <span className="font-mono text-emerald-600 dark:text-emerald-400">{percent}%</span>
          </div>
          <div
            className="h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-white/10"
            role="progressbar"
            aria-label={`Tiến độ bộ ${deck.title}`}
            aria-valuemin="0"
            aria-valuemax="100"
            aria-valuenow={percent}
          >
            <span
              className="block h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 transition-all duration-500"
              style={{ width: `${percent}%` }}
            />
          </div>

          <div className="mt-3 flex items-center gap-2">
            <button
              type="button"
              onClick={() => onStudy(entry.dueCards.length ? entry.dueCards : entry.cards, deck.id)}
              disabled={!total}
              className="btn-primary h-10 min-h-0 flex-1 px-3 text-xs disabled:cursor-not-allowed"
            >
              {due ? <CheckCircle2 size={14} /> : <Sparkles size={14} />}
              {due ? `Ôn ${Math.min(due, 50)} từ` : "Học ngay"}
            </button>
            <button
              type="button"
              onClick={() => onOpen(deck.id)}
              className="btn-secondary h-10 min-h-0 w-10 shrink-0 px-0"
              aria-label={`Xem ${total} từ trong bộ ${deck.title}`}
              title={`Xem ${total} từ`}
            >
              <Eye size={16} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
});
