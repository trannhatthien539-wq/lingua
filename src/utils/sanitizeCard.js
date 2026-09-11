import { speakText } from "./speech";

export function cleanText(htmlString = "") {
  const withoutMedia = String(htmlString)
    .replace(/\[sound:[^\]]+\]/gi, "")
    .replace(/\{\{c\d+::(.*?)(?:::[^}]*)?\}\}/gi, "$1")
    .replace(/<br\s*\/?>(\r?\n)?/gi, "\n");
  if (typeof DOMParser === "undefined") return withoutMedia.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
  const documentFragment = new DOMParser().parseFromString(withoutMedia, "text/html");
  return (documentFragment.body.textContent || "").replace(/\s+/g, " ").trim();
}

export function sanitizeCard(card = {}) {
  return {
    ...card,
    word: cleanText(card.word || "") || "Từ chưa có tên",
    ipa: cleanText(card.ipa || ""),
    meaning: cleanText(card.meaning || "Chưa có nghĩa") || "Chưa có nghĩa",
    example: cleanText(card.example || ""),
    audioUrl: card.audioUrl || "",
    imageUrl: /^data:image\/[a-z0-9.+-]+;base64,/i.test(card.imageUrl || "") ? card.imageUrl : undefined,
  };
}

export function getPlayableAudio(card) {
  const safeCard = sanitizeCard(card);
  if (safeCard.audioUrl) {
    return () => {
      const audio = new Audio(safeCard.audioUrl);
      audio.play().catch(() => speakText(safeCard.word));
    };
  }
  return () => speakText(safeCard.word);
}
