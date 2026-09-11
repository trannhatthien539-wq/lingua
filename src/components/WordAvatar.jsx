const PALETTE = ["#6366f1", "#ec4899", "#8b5cf6", "#10b981", "#f59e0b", "#06b6d4", "#3b82f6"];

const hashWord = (word = "") => [...word].reduce((hash, letter) => ((hash * 31) + letter.charCodeAt(0)) >>> 0, 7);
const initials = (word = "") => word.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "?";

export default function WordAvatar({ word = "", alt = "", className = "" }) {
  const hash = hashWord(word);
  const firstColor = PALETTE[hash % PALETTE.length];
  const secondColor = PALETTE[(hash >>> 3) % PALETTE.length];

  return (
    <span className={`relative isolate grid place-items-center overflow-hidden rounded-xl text-sm font-black tracking-wide text-white ${className}`} style={{ background: `linear-gradient(135deg, ${firstColor}, ${secondColor})` }} role="img" aria-label={alt || word}>
      <svg className="absolute inset-0 -z-10 h-full w-full opacity-25" viewBox="0 0 48 48" aria-hidden="true">
        <circle cx="8" cy="8" r="15" fill="white" />
        <circle cx="43" cy="38" r="20" fill="white" />
        <path d="M-4 38 16 18l10 10 14-18 16 16v26H-4Z" fill="black" opacity=".18" />
      </svg>
      <span className="relative drop-shadow-sm">{initials(word)}</span>
    </span>
  );
}