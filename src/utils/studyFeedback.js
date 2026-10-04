import confetti from "canvas-confetti";

let audioContext;

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

export function playStudySound(type) {
  try {
    const context = getAudioContext();
    if (!context) return;
    const frequencies =
      type === "correct"
        ? [660, 990]
        : type === "complete"
          ? [523, 659, 784]
          : type === "hint"
            ? [440, 554]
            : [170, 110];
    const start = context.currentTime;
    frequencies.forEach((frequency, index) => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = type === "wrong" ? "sawtooth" : "sine";
      oscillator.frequency.setValueAtTime(frequency, start + index * 0.08);
      gain.gain.setValueAtTime(0.001, start + index * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.08, start + index * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, start + index * 0.08 + 0.2);
      oscillator.connect(gain).connect(context.destination);
      oscillator.start(start + index * 0.08);
      oscillator.stop(start + index * 0.08 + 0.22);
    });
  } catch {
    // Tránh gián đoạn giao diện nếu trình duyệt chặn Web Audio
  }
}

export function celebrateStudyCompletion() {
  playStudySound("complete");
  try {
    confetti({ particleCount: 120, spread: 78, origin: { y: 0.62 } });
  } catch {
    // Tránh lỗi nếu canvas không khả dụng
  }
}