import confetti from "canvas-confetti";

let audioContext;

const getAudioContext = () => {
  if (!window.AudioContext) return null;
  audioContext ||= new window.AudioContext();
  if (audioContext.state === "suspended") void audioContext.resume();
  return audioContext;
};

export function playStudySound(type) {
  const context = getAudioContext();
  if (!context) return;
  const frequencies = type === "correct" ? [660, 990] : type === "complete" ? [523, 659, 784] : [170, 110];
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
}

export function celebrateStudyCompletion() {
  playStudySound("complete");
  confetti({ particleCount: 120, spread: 78, origin: { y: 0.62 } });
}