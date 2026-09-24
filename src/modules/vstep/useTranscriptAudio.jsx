import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Pause, RotateCcw, Volume2 } from "lucide-react";
import { speakText, stopSpeech } from "../../utils/speech";

/**
 * Phát transcript bằng TTS như "băng nghe" của đề thi.
 * - Chế độ thi: nghe tối đa `maxPlays` lần (mặc định 2) để giống điều kiện thi thật.
 * - Chế độ luyện: nghe không giới hạn, có chỉnh tốc độ.
 */
export default function useTranscriptAudio(part, { maxPlays = 2, examMode = true } = {}) {
  const [playing, setPlaying] = useState(false);
  const [plays, setPlays] = useState(0);
  const [rate, setRate] = useState(1);
  const playsRef = useRef(0);
  const cancelledRef = useRef(false);

  // `part?.transcript || []` tạo mảng mới mỗi render nên phải memo, nếu không
  // `play()` bị tạo lại liên tục (lint từng cảnh báo useCallback đổi mỗi render).
  const lines = useMemo(() => part?.transcript || [], [part?.transcript]);

  const stop = useCallback(() => {
    cancelledRef.current = true;
    stopSpeech();
    setPlaying(false);
  }, []);

  // Dừng audio khi đổi phần thi hoặc rời trang.
  useEffect(() => () => stop(), [stop]);

  useEffect(() => {
    cancelledRef.current = true;
    stopSpeech();
    setPlaying(false);
    setPlays(0);
    playsRef.current = 0;
  }, [part?.id]);

  const play = useCallback(() => {
    if (!lines.length) return;
    if (examMode && playsRef.current >= maxPlays) return;
    cancelledRef.current = false;
    playsRef.current += 1;
    setPlays(playsRef.current);
    setPlaying(true);
    const text = lines.map((line) => (line.speaker ? `${line.speaker}: ${line.line}` : line.line)).join(" ");
    speakText(text, { rate, onEnd: () => setPlaying(false) });
  }, [lines, examMode, maxPlays, rate]);

  const canPlay = lines.length > 0 && (!examMode || playsRef.current < maxPlays);
  const remaining = examMode ? Math.max(0, maxPlays - plays) : Infinity;

  return { play, stop, playing, canPlay, plays, remaining, rate, setRate, hasAudio: lines.length > 0 };
}

export const AudioBadge = ({ player, label = "Nghe" }) => (
  <div className="flex flex-wrap items-center gap-2">
    {player.playing ? (
      <button type="button" onClick={player.stop} className="btn-secondary px-4">
        <Pause size={16} />Dừng băng
      </button>
    ) : (
      <button type="button" onClick={player.play} disabled={!player.canPlay} className="btn-primary px-4">
        <Volume2 size={16} />
        {player.plays ? "Nghe lại" : label}
        {player.remaining !== Infinity && <span className="ml-1 text-xs opacity-70">(còn {player.remaining} lần)</span>}
      </button>
    )}
    {player.remaining !== Infinity && !player.canPlay && (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-warn">
        <RotateCcw size={13} />Đã hết số lần nghe cho phần này
      </span>
    )}
  </div>
);
