import { useEffect, useState } from "react";
import { ImageOff } from "lucide-react";
import { isSafeImageSource } from "../../services/imageService";

export default function SafeImage({ src, alt = "", className = "", fallbackWord = alt }) {
  const localImage = isSafeImageSource(src);
  const [failed, setFailed] = useState(!localImage);

  useEffect(() => setFailed(!isSafeImageSource(src)), [src]);

  if (failed) return <span className={`grid place-items-center rounded-xl bg-ink/[0.06] text-ink/35 dark:bg-white/10 dark:text-white/35 ${className}`} role="img" aria-label={`${alt || fallbackWord} - không có ảnh`}><ImageOff size={18} aria-hidden="true" /></span>;

  return <img src={src} alt={alt} className={className} loading="lazy" onError={() => setFailed(true)} />;
}