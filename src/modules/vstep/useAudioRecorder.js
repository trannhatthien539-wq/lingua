import { useCallback, useEffect, useRef, useState } from "react";
import { createRecognizer, isSpeechRecognitionSupported } from "../../utils/speechScore";

/**
 * Ghi âm câu trả lời Nói + (nếu trình duyệt hỗ trợ) nhận dạng giọng nói để lấy transcript.
 * Transcript dùng cho chấm điểm phát âm và cho AI nhận xét.
 */
export default function useAudioRecorder() {
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [audioUrl, setAudioUrl] = useState("");
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState("");

  const recorderRef = useRef(null);
  const chunksRef = useRef([]);
  const streamRef = useRef(null);
  const recognizerRef = useRef(null);

  useEffect(() => {
    if (!recording) return undefined;
    const timer = window.setInterval(() => setSeconds((value) => value + 1), 1000);
    return () => window.clearInterval(timer);
  }, [recording]);

  const cleanup = useCallback(() => {
    recorderRef.current?.state === "recording" && recorderRef.current.stop();
    try {
      recognizerRef.current?.stop();
    } catch {
      // bỏ qua
    }
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    recognizerRef.current = null;
  }, []);

  useEffect(
    () => () => {
      cleanup();
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  /** Bắt đầu ghi. `onFinish` được gọi khi người dùng bấm dừng. */
  const start = async (onFinish) => {
    setError("");
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
      setError("Thiết bị/trình duyệt này không hỗ trợ ghi âm.");
      return false;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      chunksRef.current = [];
      setTranscript("");
      const recorder = new MediaRecorder(stream);
      recorder.ondataavailable = (event) => {
        if (event.data.size) chunksRef.current.push(event.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || "audio/webm" });
        setAudioUrl((current) => {
          if (current) URL.revokeObjectURL(current);
          return URL.createObjectURL(blob);
        });
        streamRef.current?.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
        onFinish?.();
      };
      recorder.start();
      recorderRef.current = recorder;
      setSeconds(0);
      setRecording(true);

      // Nhận dạng giọng nói chạy song song để lấy transcript (không bắt buộc).
      if (isSpeechRecognitionSupported()) {
        const recognizer = createRecognizer({
          onPartial: (text) => setTranscript(text),
          onFinal: (text) => setTranscript((current) => `${current} ${text}`.trim()),
          onError: () => {},
        });
        if (recognizer) {
          recognizerRef.current = recognizer;
          try {
            recognizer.start();
          } catch {
            recognizerRef.current = null;
          }
        }
      }
      return true;
    } catch (recordingError) {
      setError(
        recordingError?.name === "NotAllowedError"
          ? "Bạn chưa cho phép dùng micro. Hãy bật quyền micro rồi thử lại."
          : "Không thể bắt đầu ghi âm trên thiết bị này.",
      );
      return false;
    }
  };

  const stop = () => {
    recorderRef.current?.state === "recording" && recorderRef.current.stop();
    try {
      recognizerRef.current?.stop();
    } catch {
      // bỏ qua
    }
    setRecording(false);
  };

  const reset = () => {
    setTranscript("");
    setSeconds(0);
    setError("");
  };

  return { recording, seconds, audioUrl, transcript, error, start, stop, reset, canRecord: Boolean(navigator.mediaDevices?.getUserMedia) };
}

export const formatSeconds = (value) => `${String(Math.floor(value / 60)).padStart(2, "0")}:${String(value % 60).padStart(2, "0")}`;
