let cachedVoices = [];
let currentFallbackAudio = null;

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

/**
 * Phát âm thanh dự phòng qua audio stream khi SpeechSynthesis bị lỗi hoặc thiếu giọng tiếng Anh
 */
const playFallbackAudio = (text, onStart, onEnd) => {
  if (typeof window === "undefined" || !text?.trim()) {
    onEnd?.();
    return false;
  }
  try {
    if (currentFallbackAudio) {
      currentFallbackAudio.pause();
      currentFallbackAudio = null;
    }
    const clean = text.trim();
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=en&client=tw-ob&q=${encodeURIComponent(clean)}`;
    const audio = new Audio(url);
    currentFallbackAudio = audio;
    audio.onplay = () => onStart?.();
    audio.onended = () => {
      currentFallbackAudio = null;
      onEnd?.();
    };
    audio.onerror = () => {
      currentFallbackAudio = null;
      onEnd?.();
    };
    audio.play().catch(() => {
      currentFallbackAudio = null;
      onEnd?.();
    });
    return true;
  } catch {
    onEnd?.();
    return false;
  }
};

export function speakText(text, { rate = 0.9, onStart, onEnd } = {}) {
  if (typeof window === "undefined" || !text?.trim()) return false;

  if (currentFallbackAudio) {
    try {
      currentFallbackAudio.pause();
      currentFallbackAudio = null;
    } catch {
      // bỏ qua
    }
  }

  if (window.speechSynthesis) {
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text.trim());
      utterance.lang = "en-US";
      utterance.rate = rate;
      const voice = getEnglishVoice();
      if (voice) utterance.voice = voice;

      let started = false;
      utterance.onstart = () => {
        started = true;
        onStart?.();
      };
      utterance.onend = () => {
        onEnd?.();
      };
      utterance.onerror = () => {
        if (!started) {
          playFallbackAudio(text, onStart, onEnd);
        } else {
          onEnd?.();
        }
      };

      window.speechSynthesis.speak(utterance);
      return true;
    } catch {
      return playFallbackAudio(text, onStart, onEnd);
    }
  }

  return playFallbackAudio(text, onStart, onEnd);
}

export function stopSpeech() {
  if (typeof window !== "undefined") {
    if (currentFallbackAudio) {
      try {
        currentFallbackAudio.pause();
        currentFallbackAudio = null;
      } catch {
        // bỏ qua
      }
    }
    if (window.speechSynthesis) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // bỏ qua
      }
    }
  }
}
