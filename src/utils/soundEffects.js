import confetti from "canvas-confetti";

const SFX_STORAGE_KEY = "lingua-sfx-enabled";

export const isSfxEnabled = () => {
  if (typeof window === "undefined") return true;
  return localStorage.getItem(SFX_STORAGE_KEY) !== "false";
};

export const setSfxEnabled = (enabled) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(SFX_STORAGE_KEY, String(Boolean(enabled)));
};

let audioContext = null;

const getAudioContext = () => {
  if (typeof window === "undefined") return null;
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return null;
  audioContext ||= new AudioCtx();
  if (audioContext.state === "suspended") {
    audioContext.resume().catch(() => {});
  }
  return audioContext;
};

/**
 * Phát âm thanh trả lời đúng: 2 nốt trong trẻo vút lên (D5 -> A5)
 */
export function playCorrect() {
  if (!isSfxEnabled()) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const notes = [587.33, 880.0]; // D5, A5
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + idx * 0.09);

      gain.gain.setValueAtTime(0.001, now + idx * 0.09);
      gain.gain.exponentialRampToValueAtTime(0.12, now + idx * 0.09 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.09 + 0.22);

      osc.connect(gain).connect(ctx.destination);
      osc.start(now + idx * 0.09);
      osc.stop(now + idx * 0.09 + 0.24);
    });
  } catch {
    // Không làm gián đoạn UI nếu trình duyệt chặn âm thanh
  }
}

/**
 * Phát âm thanh trả lời sai: tiếng trầm nhẹ nhàng (không chói tai)
 */
export function playIncorrect() {
  if (!isSfxEnabled()) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.exponentialRampToValueAtTime(110, now + 0.22);

    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

    osc.connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.24);
  } catch {
    // Bỏ qua lỗi trình duyệt
  }
}

/**
 * Phát âm thanh gợi ý / trung lập: 2 nốt nhẹ
 */
export function playHint() {
  if (!isSfxEnabled()) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const notes = [440, 554.37]; // A4, C#5
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      gain.gain.setValueAtTime(0.001, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.08, now + idx * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.18);

      osc.connect(gain).connect(ctx.destination);
      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.2);
    });
  } catch {
    // Bỏ qua lỗi
  }
}

/**
 * Phát âm thanh hoàn thành / ăn mừng: 4 nốt arpeggio C5 -> E5 -> G5 -> C6
 */
export function playCelebration() {
  if (!isSfxEnabled()) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      gain.gain.setValueAtTime(0.001, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.14, now + idx * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.35);

      osc.connect(gain).connect(ctx.destination);
      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.38);
    });
  } catch {
    // Bỏ qua lỗi
  }
}

/**
 * Tương thích ngược với các module gọi playStudySound
 */
export function playStudySound(type) {
  if (type === "correct") playCorrect();
  else if (type === "wrong") playIncorrect();
  else if (type === "hint") playHint();
  else if (type === "complete" || type === "celebration" || type === "levelup") playCelebration();
}

/**
 * Bắn pháo hoa confetti và phát âm thanh ăn mừng khi xong bài học / đạt mốc
 */
export function celebrateStudyCompletion() {
  playCelebration();
  try {
    confetti({ particleCount: 120, spread: 78, origin: { y: 0.62 } });
  } catch {
    // Tránh lỗi nếu canvas không khả dụng
  }
}

