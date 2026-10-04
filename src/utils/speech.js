let cachedVoices = [];

const loadVoices = () => {
  if (typeof window === "undefined" || !window.speechSynthesis) return [];
  const voices = window.speechSynthesis.getVoices();
  if (voices.length) cachedVoices = voices;
  return cachedVoices;
};

if (typeof window !== "undefined" && window.speechSynthesis) {
  loadVoices();
  window.speechSynthesis.onvoiceschanged = () => {
    loadVoices();
  };
}

const getEnglishVoice = () => {
  const voices = cachedVoices.length ? cachedVoices : loadVoices();
  if (!voices.length) return null;
  // Ưu tiên các giọng đọc tự nhiên (Natural / Neural / Samantha / Daniel / Google)
  return (
    voices.find((v) => /Google.*(US|UK)|Samantha|Daniel|Natural|Ava|Oliver/i.test(v.name) && /^en/i.test(v.lang)) ||
    voices.find((v) => /^en-US$/i.test(v.lang)) ||
    voices.find((v) => /^en-GB$/i.test(v.lang)) ||
    voices.find((v) => /^en(-|_)/i.test(v.lang)) ||
    null
  );
};

export function speakText(text, { rate = 0.9, onStart, onEnd } = {}) {
  if (typeof window === "undefined" || !window.speechSynthesis || !text?.trim()) return false;
  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text.trim());
    utterance.lang = "en-US";
    utterance.rate = rate;
    const voice = getEnglishVoice();
    if (voice) utterance.voice = voice;
    utterance.onstart = onStart;
    utterance.onend = onEnd;
    utterance.onerror = onEnd;
    window.speechSynthesis.speak(utterance);
    return true;
  } catch {
    onEnd?.();
    return false;
  }
}

export function stopSpeech() {
  if (typeof window !== "undefined" && window.speechSynthesis) {
    try {
      window.speechSynthesis.cancel();
    } catch {
      // bỏ qua
    }
  }
}
