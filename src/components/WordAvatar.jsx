const PALETTE = ["#6366f1", "#ec4899", "#8b5cf6", "#10b981", "#f59e0b", "#06b6d4", "#3b82f6"];

const hashWord = (word = "") => [...word].reduce((hash, letter) => ((hash * 31) + letter.charCodeAt(0)) >>> 0, 7);
const initials = (word = "") => word.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "?";

export default function WordAvatar({ word = "", alt = "", className = "" }) {
  const hash = hashWord(word);
  const firstColor = PALETTE[hash % PALETTE.length];
  const secondColor = PALETTE[(hash >>> 3) % PALETTE.length];
  const variant = hash % 3;

  return (
    <span className={`relative isolate grid place-items-center overflow-hidden rounded-xl text-sm font-black tracking-wide text-white ${className}`} style={{ background: `linear-gradient(135deg, ${firstColor}, ${secondColor})` }} role="img" aria-label={alt || word}>
      <svg className="absolute inset-0 -z-10 h-full w-full" viewBox="0 0 48 48" aria-hidden="true">
        <circle cx="8" cy="8" r="15" fill="white" opacity=".22" />
        <circle cx="43" cy="38" r="20" fill="white" opacity=".18" />
        {variant === 0 && <><path d="M-4 39 13 22l8 7 10-13 21 23H-4Z" fill="white" opacity=".28" /><circle cx="35" cy="12" r="5" fill="white" opacity=".7" /></>}
        {variant === 1 && <><path d="M8 16c7-4 13-4 20 0v20c-7-4-13-4-20 0V16Z" fill="white" opacity=".3" /><path d="M28 16c5-3 9-3 13-1v20c-4-2-8-2-13 1V16Z" fill="white" opacity=".5" /><path d="M10 20c6-3 11-3 17 0M10 25c6-3 11-3 17 0" fill="none" stroke="white" strokeWidth="1.5" opacity=".8" /></>}
        {variant === 2 && <><path d="m24 6 3.2 11.8L39 21l-11.8 3.2L24 36l-3.2-11.8L9 21l11.8-3.2L24 6Z" fill="white" opacity=".65" /><circle cx="38" cy="10" r="2" fill="white" opacity=".8" /><circle cx="9" cy="36" r="2.5" fill="white" opacity=".5" /></>}
      </svg>
      <span className="relative mt-4 rounded-md bg-black/15 px-1.5 py-0.5 text-xs drop-shadow-sm">{initials(word)}</span>
    </span>
  );
}