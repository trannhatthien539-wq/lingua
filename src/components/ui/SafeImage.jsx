import { useEffect, useState } from "react";
import WordAvatar from "../WordAvatar";

export default function SafeImage({ src, alt = "", className = "", fallbackWord = alt }) {
  const localImage = /^data:image\/[a-z0-9.+-]+;base64,/i.test(src || "");
  const [failed, setFailed] = useState(!localImage);

  useEffect(() => setFailed(!/^data:image\/[a-z0-9.+-]+;base64,/i.test(src || "")), [src]);

  if (failed) return <WordAvatar word={fallbackWord} alt={alt} className={className} />;

  return <img src={src} alt={alt} className={className} loading="lazy" onError={() => setFailed(true)} />;
}