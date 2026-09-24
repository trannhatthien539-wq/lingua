import { BookOpen, CheckCircle2, Clock3, Eye, Sparkles } from "lucide-react";
import SafeImage from "../ui/SafeImage";

const COVER_TONES = ["from-[#dff5ff] via-[#edf9ff] to-[#d5f0e5] text-[#1573a8]", "from-[#fff0d7] via-[#fff8e9] to-[#ffe4c2] text-[#b56a1a]", "from-[#e8e2ff] via-[#f5f1ff] to-[#dceafb] text-[#6851b8]", "from-[#ffe2e8] via-[#fff0f3] to-[#f9dfcf] text-[#bd5367]"];

const percentOf = (value, total) => (total ? Math.round((value / total) * 100) : 0);

export default function VocabularyDeckCard({ deck, index, entry, onOpen, onStudy }) {
  const total = entry.total || 0;
  const mastered = entry.mastered || 0;
  const due = entry.due || 0;
  const learning = entry.cards.filter((card) => card.status === "learning").length;
  const percent = percentOf(mastered, total);
  const coverImage = entry.cards.find((card) => card.imageUrl)?.imageUrl;
  const coverTone = COVER_TONES[index % COVER_TONES.length];
  const reviewLabel = due ? `${due} cần ôn hôm nay` : total ? "Đã lên lịch ôn tập" : "Chưa có từ";

  return (
    <article className="panel group flex h-full flex-col overflow-hidden p-0 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <button type="button" onClick={() => onOpen(deck.id)} className="relative block aspect-[16/9] w-full overflow-hidden text-left" aria-label={`Mở bộ thẻ ${deck.title}`}>
        {coverImage ? <SafeImage src={coverImage} alt={deck.title} fallbackWord={deck.title} className="h-full w-full object-cover" /> : <div className={`flex h-full w-full flex-col items-center justify-center bg-gradient-to-br ${coverTone}`}><span className="grid h-16 w-16 place-items-center rounded-2xl bg-white/70 shadow-sm"><BookOpen size={32} strokeWidth={1.8} /></span><span className="mt-3 max-w-[85%] truncate text-xs font-bold uppercase tracking-[0.12em] opacity-75">{deck.tags?.[0] || deck.level || "Vocabulary deck"}</span></div>}
        <span className="absolute right-3 top-3 rounded-full bg-ink/65 px-2.5 py-1 text-xs font-bold text-white backdrop-blur-sm">{total} từ</span>
        <span className="absolute bottom-3 left-3 inline-flex max-w-[80%] items-center gap-1.5 rounded-full bg-white/85 px-2.5 py-1 text-xs font-bold text-ink shadow-sm backdrop-blur-sm"><BookOpen size={13} />{deck.title}</span>
      </button>
      <div className="relative flex flex-1 flex-col p-4 sm:p-5">
        <BookOpen className="pointer-events-none absolute -bottom-3 -right-3 h-24 w-24 rotate-[-12deg] text-sage/10" strokeWidth={1.2} aria-hidden="true" />
        <p className="eyebrow relative">{index + 1}. Bộ thẻ</p>
        <h3 className="relative mt-1 line-clamp-2 font-display text-lg font-bold leading-6">{deck.title}</h3>
        <div className="relative mt-3 flex flex-wrap gap-1.5"><span className="chip bg-ink/[0.06] text-ink/70 dark:bg-white/10 dark:text-white/70">{total} từ vựng</span><span className="chip bg-ink/[0.06] text-ink/70 dark:bg-white/10 dark:text-white/70"><Clock3 size={12} className="mr-1" />{reviewLabel}</span></div>
        <div className="relative mt-auto pt-5">
          <div className="mb-2 flex items-center justify-between gap-2 text-xs font-semibold text-ink/60 dark:text-white/60"><span>{mastered}/{total} từ</span><span>{percent}% complete</span></div>
          <div className="flex h-2 overflow-hidden rounded-full bg-ink/10 dark:bg-white/15" role="progressbar" aria-label={`Tiến độ bộ ${deck.title}`} aria-valuemin="0" aria-valuemax="100" aria-valuenow={percent}><span className="h-full bg-sage transition-all" style={{ width: `${percent}%` }} /><span className="h-full bg-orange-400 transition-all" style={{ width: `${Math.min(100 - percent, percentOf(learning, total))}%` }} /></div>
          <div className="mt-4 flex flex-wrap gap-2"><button type="button" onClick={() => onStudy(entry.dueCards.length ? entry.dueCards : entry.cards, deck.id)} disabled={!total} className="btn-primary flex-1 px-3 text-xs disabled:cursor-not-allowed sm:flex-none">{due ? <CheckCircle2 size={15} /> : <Sparkles size={15} />}{due ? `Ôn ${Math.min(due, 50)} từ` : "Học ngay"}</button><button type="button" onClick={() => onOpen(deck.id)} className="btn-secondary flex-1 px-3 text-xs sm:flex-none"><Eye size={15} />Xem {total} từ</button></div>
        </div>
      </div>
    </article>
  );
}
