/**
 * Chấm điểm phát âm bằng Web Speech API (SpeechRecognition).
 * Không cần server: so khớp từng từ người học đọc với câu mẫu.
 */

const normalizeWords = (text = "") =>
  String(text)
    .toLowerCase()
    .replace(/[^a-z0-9'\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);

export const isSpeechRecognitionSupported = () =>
  typeof window !== "undefined" && Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);

/** Tạo đối tượng nhận dạng giọng nói; trả về null nếu trình duyệt không hỗ trợ. */
export function createRecognizer({ lang = "en-US", onPartial, onFinal, onError, onEnd } = {}) {
  const Recognition = typeof window !== "undefined" ? window.SpeechRecognition || window.webkitSpeechRecognition : null;
  if (!Recognition) return null;
  const recognition = new Recognition();
  recognition.lang = lang;
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.maxAlternatives = 1;
  recognition.onresult = (event) => {
    let finalText = "";
    let interimText = "";
    for (let index = event.resultIndex; index < event.results.length; index += 1) {
      const result = event.results[index];
      if (result.isFinal) finalText += `${result[0].transcript} `;
      else interimText += result[0].transcript;
    }
    if (interimText) onPartial?.(interimText);
    if (finalText.trim()) onFinal?.(finalText.trim());
  };
  recognition.onerror = (event) => onError?.(event.error);
  recognition.onend = () => onEnd?.();
  return recognition;
}

/** So khớp câu đọc được với câu mẫu: điểm %, danh sách từ còn thiếu, tốc độ nói. */
export function scorePronunciation(spoken = "", target = "", seconds = 0) {
  const spokenWords = normalizeWords(spoken);
  const targetWords = normalizeWords(target);
  if (!targetWords.length) return { score: 0, matched: 0, total: 0, missing: [], extra: [], wpm: 0 };
  const remaining = [...spokenWords];
  const missing = [];
  targetWords.forEach((word) => {
    const index = remaining.indexOf(word);
    if (index >= 0) remaining.splice(index, 1);
    else missing.push(word);
  });
  const matched = targetWords.length - missing.length;
  const duration = Number(seconds) || 0;
  return {
    score: Math.round((matched / targetWords.length) * 100),
    matched,
    total: targetWords.length,
    missing,
    extra: remaining,
    wpm: duration >= 2 ? Math.round((spokenWords.length / duration) * 60) : 0,
  };
}

export const scoreLabel = (score) => {
  if (score >= 92) return "Phát âm rất rõ";
  if (score >= 78) return "Khá tốt, giữ nhịp này nhé";
  if (score >= 55) return "Cần đọc chậm và rõ hơn";
  return "Thử lại, đọc chậm và tách từng từ";
};

export const speedLabel = (wpm) => {
  if (!wpm) return "";
  if (wpm < 90) return "Hơi chậm — thử nói tự nhiên hơn";
  if (wpm > 165) return "Hơi nhanh — chú ý phát âm rõ";
  return "Tốc độ nói tự nhiên";
};
