let cachedVoices = [];
let currentFallbackAudio = null;
/** Lượt phát hiện tại. Mọi callback của lượt cũ bị bỏ qua để tránh "ma audio". */
let activeToken = 0;
/** Hàm kết thúc lượt phát hiện tại (idempotent) để onEnd luôn chạy đúng 1 lần. */
let activeStop = null;

const loadVoices = () => {
  if (typeof window === "undefined" || !window.speechSynthesis) return [];
  const voices = window.speechSynthesis.getVoices();
  if (voices.length) cachedVoices = voices;
  return cachedVoices;
};

if (typeof window !== "undefined" && window.speechSynthesis) {
  loadVoices();
  try {
    window.speechSynthesis.addEventListener("voiceschanged", loadVoices);
  } catch {
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }
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

const stopFallbackAudio = () => {
  if (!currentFallbackAudio) return;
  const audio = currentFallbackAudio;
  currentFallbackAudio = null;
  try {
    audio.onended = null;
    audio.onerror = null;
    audio.pause();
    audio.removeAttribute?.("src");
  } catch {
    // bỏ qua
  }
};

/**
 * Phát âm dự phòng qua audio stream khi SpeechSynthesis bị lỗi hoặc thiếu giọng tiếng Anh.
 * `isCurrent` đảm bảo audio của lượt cũ không chen vào lượt mới.
 */
const playFallbackAudio = (text, { onStart, onEnd, onError, isCurrent } = {}) => {
  if (typeof window === "undefined" || !text?.trim()) {
    onEnd?.();
    return false;
  }
  try {
    stopFallbackAudio();
    const clean = text.trim();
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=en&client=tw-ob&q=${encodeURIComponent(clean)}`;
    const audio = new Audio(url);
    currentFallbackAudio = audio;
    const current = () => (isCurrent ? isCurrent() && currentFallbackAudio === audio : currentFallbackAudio === audio);

    audio.onplay = () => {
      if (current()) onStart?.();
    };
    audio.onended = () => {
      if (!current()) return;
      currentFallbackAudio = null;
      onEnd?.();
    };
    audio.onerror = () => {
      if (!current()) return;
      currentFallbackAudio = null;
      onError?.(new Error("Không phát được âm thanh dự phòng."));
      onEnd?.();
    };
    audio.play()?.catch?.(() => {
      if (!current()) return;
      currentFallbackAudio = null;
      onError?.(new Error("Trình duyệt chặn phát âm thanh."));
      onEnd?.();
    });
    return true;
  } catch (error) {
    onError?.(error);
    onEnd?.();
    return false;
  }
};

/**
 * Đọc văn bản tiếng Anh bằng Web Speech API, tự động chuyển sang audio dự phòng khi:
 * - Trình duyệt không có `speechSynthesis` / không có giọng tiếng Anh.
 * - `speak()` không phát được (một số trình duyệt không bắn sự kiện nào).
 * - Xảy ra lỗi synthesis.
 *
 * `onEnd` luôn được gọi đúng một lần (kể cả khi bị `stopSpeech()` ngắt) để UI không bị kẹt
 * ở trạng thái "đang phát". `onError` chỉ được gọi khi không thể phát bằng bất kỳ cách nào.
 */
export function speakText(text, { rate = 0.9, onStart, onEnd, onError } = {}) {
  if (typeof window === "undefined" || !text?.trim()) return false;

  // Kết thúc lượt phát trước để onEnd của nó chạy trước khi lượt mới bắt đầu.
  const previousStop = activeStop;
  activeStop = null;
  previousStop?.();
  stopFallbackAudio();

  const token = (activeToken += 1);
  let settled = false;
  let watchdog = null;

  const end = () => {
    if (settled) return;
    settled = true;
    if (watchdog) window.clearTimeout(watchdog);
    if (activeToken === token) activeStop = null;
    onEnd?.();
  };
  const stop = () => {
    if (settled) return;
    stopFallbackAudio();
    end();
  };
  activeStop = stop;

  const isCurrent = () => token === activeToken && !settled;
  const playFallback = () =>
    playFallbackAudio(text, {
      onStart,
      onEnd: end,
      onError: (error) => {
        if (isCurrent()) onError?.(error);
      },
      isCurrent,
    });

  if (window.speechSynthesis) {
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text.trim());
      utterance.lang = "en-US";
      utterance.rate = rate;
      const voice = getEnglishVoice();
      if (voice) utterance.voice = voice;

      let started = false;
      let usedFallback = false;
      // Đánh dấu lượt huỷ do watchdog (không phải người dùng bấm dừng) để không bỏ qua fallback.
      let timedOut = false;

      const fallbackOnce = () => {
        if (usedFallback || !isCurrent()) return;
        usedFallback = true;
        playFallback();
      };

      utterance.onstart = () => {
        if (!isCurrent()) return;
        started = true;
        if (watchdog) {
          window.clearTimeout(watchdog);
          watchdog = null;
        }
        onStart?.();
      };
      utterance.onend = () => end();
      utterance.onerror = (event) => {
        if (!isCurrent()) return;
        const reason = String(event?.error || "");
        // "canceled"/"interrupted" là do chính stopSpeech() hoặc lượt phát mới → coi như kết thúc.
        // Ngoại lệ: watchdog tự huỷ để chuyển sang audio dự phòng.
        if (reason === "canceled" || reason === "interrupted") {
          if (!timedOut) end();
          return;
        }
        if (!started) {
          fallbackOnce();
        } else {
          onError?.(new Error("Không đọc được văn bản bằng giọng tổng hợp."));
          end();
        }
      };

      window.speechSynthesis.speak(utterance);

      // Một số trình duyệt (đặc biệt trên mobile) không bắn onstart/onerror khi bị chặn.
      watchdog = window.setTimeout(() => {
        watchdog = null;
        if (!isCurrent() || started) return;
        timedOut = true;
        try {
          window.speechSynthesis.cancel();
        } catch {
          // bỏ qua
        }
        fallbackOnce();
      }, 1200);

      return true;
    } catch (error) {
      return playFallbackAudio(text, {
        onStart,
        onEnd: end,
        onError: (fallbackError) => {
          if (isCurrent()) onError?.(fallbackError || error);
        },
        isCurrent,
      });
    }
  }

  return playFallback();
}

/** Dừng mọi âm thanh đang phát (TTS + audio dự phòng) và đóng lượt phát hiện tại. */
export function stopSpeech() {
  activeToken += 1;
  const stop = activeStop;
  activeStop = null;
  stopFallbackAudio();
  if (typeof window !== "undefined" && window.speechSynthesis) {
    try {
      window.speechSynthesis.cancel();
    } catch {
      // bỏ qua
    }
  }
  stop?.();
}
