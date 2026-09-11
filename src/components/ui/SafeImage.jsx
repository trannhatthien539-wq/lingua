import { useEffect, useState } from "react";
import WordAvatar from "../WordAvatar";
import { isSafeImageSource } from "../../services/imageService";

export default function SafeImage({ src, alt = "", className = "", fallbackWord = alt }) {
  const localImage = isSafeImageSource(src);
  const [failed, setFailed] = useState(!localImage);

  useEffect(() => setFailed(!isSafeImageSource(src)), [src]);

  if (failed) return <WordAvatar word={fallbackWord} alt={alt} className={className} />;

  return <img src={src} alt={alt} className={className} loading="lazy" onError={() => setFailed(true)} />;
}