import { useEffect, useState } from "react";
import { BookOpen } from "lucide-react";

const initials = (word = "") => word.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "?";

export default function SafeImage({ src, alt = "", className = "", fallbackWord = alt }) {
  const [failed, setFailed] = useState(!src);

  useEffect(() => setFailed(!src), [src]);

  if (failed) {
    return (
      <span className={`grid place-items-center overflow-hidden bg-gradient-to-br from-lime to-sage text-xs font-black text-ink ${className}`} aria-label={alt} role="img">
        {fallbackWord ? initials(fallbackWord) : <BookOpen size={16} aria-hidden="true" />}
      </span>
    );
  }

  return <img src={src} alt={alt} className={className} loading="lazy" onError={() => setFailed(true)} />;
}