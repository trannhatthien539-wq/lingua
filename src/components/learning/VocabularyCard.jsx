import { memo, useState } from "react";
import { BookOpen, MoreVertical, Trash2, Volume2 } from "lucide-react";
import SafeImage from "../ui/SafeImage";

export const levels = ["A1", "A2", "B1", "B2", "C1", "C2"];
export const statuses = { new: "Mới", learning: "Đang học", mastered: "Thuộc" };

export function StatusBadge({ status }) {
  const styles =
    status === "mastered"
      ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
      : status === "learning"
        ? "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20"
        : "bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-400 border border-slate-200/60 dark:border-white/10";
  return <span className={`chip shrink-0 ${styles}`}>{statuses[status]}</span>;
}

const VocabularyCard = memo(function VocabularyCard({
  card,
  speakingWord,
  onSpeak,
  onStudy,
  onUpdate,
  onRemove,
  selectMode = false,
  selected = false,
  onToggleSelect,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <article
      className={`relative flex flex-col gap-3 border-b border-ink/[0.07] p-4 last:border-b-0 dark:border-white/[0.07] sm:p-5 md:flex-row md:items-center ${
        selected ? "bg-indigo-500/10 dark:bg-indigo-500/15" : ""
      }`}
    >
      {selectMode && (
        <label className="flex shrink-0 items-center">
          <input
            type="checkbox"
            checked={selected}
            onChange={() => onToggleSelect(card.id)}
            className="h-5 w-5 accent-indigo-500"
            aria-label={`Chọn từ ${card.word}`}
          />
        </label>
      )}
      <div className="flex min-w-0 flex-1 items-start gap-3">
        <SafeImage
          src={card.imageUrl}
          alt={card.word}
          fallbackWord={card.word}
          className="hidden h-10 w-10 shrink-0 rounded-lg object-cover sm:block"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate font-display text-base font-bold sm:text-lg">{card.word}</p>
            <button
              onClick={() => onSpeak(card.word, card.id)}
              className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-ink/10 text-ink/55 hover:text-ink dark:border-white/10 dark:text-white/55 dark:hover:text-white ${
                speakingWord === card.id ? "animate-pulse text-indigo-600 dark:text-indigo-400" : ""
              }`}
              aria-label={`Nghe phát âm ${card.word}`}
            >
              <Volume2 size={17} />
            </button>
          </div>
          <div className="mt-1 flex items-center gap-2">
            <p className="min-w-0 truncate text-sm text-ink/70 dark:text-white/70">{card.meaning}</p>
            <span className="chip shrink-0 bg-ink/[0.06] text-ink/70 dark:bg-white/10 dark:text-white/70">
              {card.level}
            </span>
            <StatusBadge status={card.status} />
          </div>
          <button
            onClick={() => onSpeak(card.example, `${card.id}-example`)}
            className={`mt-2 hidden min-h-[44px] max-w-full items-center gap-1.5 text-left text-xs leading-5 text-ink/60 hover:text-ink dark:text-white/55 dark:hover:text-white md:flex ${
              speakingWord === `${card.id}-example` ? "text-indigo-600 dark:text-indigo-400" : ""
            }`}
          >
            <Volume2 size={14} className="shrink-0" />
            {card.example || "Chưa có ví dụ"}
          </button>
        </div>
      </div>
      {!selectMode && (
        <button
          onClick={() => onStudy(card.id)}
          className="btn-secondary hidden min-h-11 px-3.5 md:inline-flex"
          title="Học riêng từ này"
        >
          <BookOpen size={16} />
          Học
        </button>
      )}
      <div className="absolute right-3 top-3 md:static">
        <button
          onClick={() => setMenuOpen((value) => !value)}
          className="icon-btn"
          aria-label={`Tùy chọn cho ${card.word}`}
          aria-expanded={menuOpen}
        >
          <MoreVertical size={18} />
        </button>
        {menuOpen && (
          <div className="absolute right-0 top-14 z-20 w-56 rounded-xl border border-ink/10 bg-slab p-1.5 shadow-soft dark:border-white/10 dark:bg-dark2">
            <button
              onClick={() => {
                onStudy(card.id);
                setMenuOpen(false);
              }}
              className="menu-item"
            >
              <BookOpen size={16} />
              Học từ này
            </button>
            <label className="menu-item cursor-pointer">
              <span className="flex-1">Cấp độ</span>
              <select
                value={card.level}
                onChange={(event) => onUpdate(card.id, { level: event.target.value })}
                className="w-14 rounded border border-ink/10 bg-transparent px-1 py-1 text-xs dark:border-white/10"
              >
                {levels.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            <label className="menu-item cursor-pointer">
              <span className="flex-1">Trạng thái</span>
              <select
                value={card.status}
                onChange={(event) => onUpdate(card.id, { status: event.target.value })}
                className="w-20 rounded border border-ink/10 bg-transparent px-1 py-1 text-xs dark:border-white/10"
              >
                {Object.entries(statuses).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
            <button
              onClick={() => {
                onRemove(card.id);
                setMenuOpen(false);
              }}
              className="menu-item text-danger dark:text-dangerfgdark"
            >
              <Trash2 size={16} />
              Xoá từ
            </button>
          </div>
        )}
      </div>
    </article>
  );
});

export default VocabularyCard;
