const getEnglishVoice = () => {
  if (typeof window === "undefined" || !window.speechSynthesis) return null;
  const voices = window.speechSynthesis.getVoices();
  return voices.find((voice) => /^en-US$/i.test(voice.lang))
    || voices.find((voice) => /^en-GB$/i.test(voice.lang))
    || voices.find((voice) => /^en(-|_)/i.test(voice.lang))
    || null;
};

export function speakText(text, { rate = 0.9, onStart, onEnd } = {}) {
  if (typeof window === "undefined" || !window.speechSynthesis || !text?.trim()) return false;
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
}

export function stopSpeech() {
  window.speechSynthesis?.cancel();
}
