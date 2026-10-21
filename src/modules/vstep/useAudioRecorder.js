import { useCallback, useEffect, useRef, useState } from "react";
import { createRecognizer, isSpeechRecognitionSupported } from "../../utils/speechScore";

const isRecorderSupported = () =>
  typeof navigator !== "undefined" &&
  typeof window !== "undefined" &&
  Boolean(navigator.mediaDevices?.getUserMedia) &&
  typeof MediaRecorder !== "undefined";

const pickMimeType = () => {
  if (typeof MediaRecorder === "undefined" || typeof MediaRecorder.isTypeSupported !== "function") return undefined;
  return ["audio/webm;codecs=opus", "audio/webm", "audio/mp4"].find((type) => MediaRecorder.isTypeSupported(type));
};

/**
 * Ghi âm câu trả lời Nói + (nếu trình duyệt hỗ trợ) nhận dạng giọng nói để lấy transcript.
 *
 * Transcript dùng cho chấm điểm phát âm và cho AI nhận xét.
 * `onFinish` nhận một payload CHỐT (thời lượng + transcript + blob) được đo tại thời điểm
 * `onstop`, nhờ vậy không còn tình trạng lưu đè bằng dữ liệu cũ do closure của React.
 */
export default function useAudioRecorder({ maxSeconds = 300 } = {}) {
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [audioUrl, setAudioUrl] = useState("");
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState("");

  const mountedRef = useRef(false);
  const recorderRef = useRef(null);
  const chunksRef = useRef([]);
  const streamRef = useRef(null);
  const recognizerRef = useRef(null);
  const secondsRef = useRef(0);
  const transcriptRef = useRef("");
  const audioUrlRef = useRef("");
  const finishHandlerRef = useRef(null);
  const discardRef = useRef(false);
  const stopRef = useRef(null);
  const maxSecondsRef = useRef(maxSeconds);
  maxSecondsRef.current = maxSeconds;

  const stopTracks = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => {
      try {
        track.stop();
      } catch {
        // bỏ qua
      }
    });
    streamRef.current = null;
  }, []);

  const stopRecognizer = useCallback(() => {
    const recognizer = recognizerRef.current;
    recognizerRef.current = null;
    try {
      recognizer?.stop();
    } catch {
      // bỏ qua
    }
  }, []);

  const revokeAudio = useCallback(() => {
    const previous = audioUrlRef.current;
    audioUrlRef.current = "";
    if (!previous) return;
    try {
      URL.revokeObjectURL(previous);
    } catch {
      // bỏ qua
    }
    if (mountedRef.current) setAudioUrl("");
  }, []);

  // Đồng hồ đếm thời lượng ghi: dựa trên mốc thời gian thật để không bị lệch khi tab bị throttle.
  useEffect(() => {
    if (!recording) return undefined;
    const startedAt = Date.now() - secondsRef.current * 1000;
    const timer = window.setInterval(() => {
      const value = Math.max(0, Math.floor((Date.now() - startedAt) / 1000));
      secondsRef.current = value;
      if (mountedRef.current) setSeconds(value);
      if (value >= maxSecondsRef.current) stopRef.current?.("limit");
    }, 500);
    return () => window.clearInterval(timer);
  }, [recording]);

  // Dọn micro/recognition khi unmount (không setState sau khi unmount).
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      const recorder = recorderRef.current;
      recorderRef.current = null;
      if (recorder && recorder.state !== "inactive") {
        recorder.onstop = null;
        recorder.ondataavailable = null;
        try {
          recorder.stop();
        } catch {
          // bỏ qua
        }
      }
      finishHandlerRef.current = null;
      stopRecognizer();
      stopTracks();
      if (audioUrlRef.current) {
        try {
          URL.revokeObjectURL(audioUrlRef.current);
        } catch {
          // bỏ qua
        }
        audioUrlRef.current = "";
      }
    };
  }, [stopRecognizer, stopTracks]);

  /** Bắt đầu ghi. `onFinish(payload)` được gọi một lần khi bản ghi dừng và có dữ liệu. */
  const start = useCallback(
    async (onFinish) => {
      if (!mountedRef.current) return false;
      if (recorderRef.current && recorderRef.current.state !== "inactive") return false;
      setError("");
      if (!isRecorderSupported()) {
        setError("Thiết bị/trình duyệt này không hỗ trợ ghi âm.");
        return false;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        if (!mountedRef.current) {
          stream.getTracks().forEach((track) => track.stop());
          return false;
        }

        revokeAudio();
        stopTracks();
        streamRef.current = stream;
        chunksRef.current = [];
        transcriptRef.current = "";
        secondsRef.current = 0;
        discardRef.current = false;
        finishHandlerRef.current = onFinish || null;
        setTranscript("");
        setSeconds(0);

        const mimeType = pickMimeType();
        const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);

        recorder.ondataavailable = (event) => {
          if (event.data?.size) chunksRef.current.push(event.data);
        };
        recorder.onstop = () => {
          const chunks = chunksRef.current;
          chunksRef.current = [];
          recorderRef.current = null;
          stopRecognizer();
          stopTracks();

          const handler = finishHandlerRef.current;
          finishHandlerRef.current = null;
          if (discardRef.current) {
            discardRef.current = false;
            if (mountedRef.current) setRecording(false);
            return;
          }

          const payload = {
            seconds: secondsRef.current,
            transcript: transcriptRef.current.trim(),
            audioUrl: "",
            mimeType: recorder.mimeType || mimeType || "audio/webm",
          };

          if (chunks.length) {
            const blob = new Blob(chunks, { type: payload.mimeType });
            const url = URL.createObjectURL(blob);
            audioUrlRef.current = url;
            payload.audioUrl = url;
            payload.blob = blob;
          }

          if (mountedRef.current) {
            if (payload.audioUrl) setAudioUrl(payload.audioUrl);
            setRecording(false);
          }
          handler?.(payload);
        };

        recorder.start();
        recorderRef.current = recorder;
        setRecording(true);

        // Nhận dạng giọng nói chạy song song để lấy transcript (không bắt buộc, có thể lỗi mạng).
        if (isSpeechRecognitionSupported()) {
          const recognizer = createRecognizer({
            onPartial: (text) => {
              transcriptRef.current = text;
              if (mountedRef.current) setTranscript(text);
            },
            onFinal: (text) => {
              transcriptRef.current = `${transcriptRef.current} ${text}`.trim();
              if (mountedRef.current) setTranscript(transcriptRef.current);
            },
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
        stopTracks();
        if (!mountedRef.current) return false;
        setError(
          recordingError?.name === "NotAllowedError"
            ? "Bạn chưa cho phép dùng micro. Hãy bật quyền micro rồi thử lại."
            : recordingError?.name === "NotFoundError"
              ? "Không tìm thấy micro trên thiết bị này."
              : "Không thể bắt đầu ghi âm trên thiết bị này.",
        );
        return false;
      }
    },
    [revokeAudio, stopRecognizer, stopTracks],
  );

  const stop = useCallback(() => {
    const recorder = recorderRef.current;
    if (!recorder || recorder.state === "inactive") {
      stopRecognizer();
      stopTracks();
      if (mountedRef.current) setRecording(false);
      return;
    }
    stopRecognizer();
    try {
      recorder.stop();
    } catch {
      recorderRef.current = null;
      stopTracks();
      if (mountedRef.current) setRecording(false);
    }
  }, [stopRecognizer, stopTracks]);
  stopRef.current = stop;

  const reset = useCallback(() => {
    // Bỏ bản ghi đang chạy (nếu có) mà không tạo blob của phần thi cũ.
    if (recorderRef.current && recorderRef.current.state !== "inactive") {
      discardRef.current = true;
      stop();
    }
    finishHandlerRef.current = null;
    stopRecognizer();
    revokeAudio();
    transcriptRef.current = "";
    secondsRef.current = 0;
    if (!mountedRef.current) return;
    setTranscript("");
    setSeconds(0);
    setError("");
    setRecording(false);
  }, [revokeAudio, stop, stopRecognizer]);

  return {
    recording,
    seconds,
    audioUrl,
    transcript,
    error,
    start,
    stop,
    reset,
    canRecord: isRecorderSupported(),
    maxSeconds,
  };
}

export const formatSeconds = (value) =>
  `${String(Math.floor(Math.max(0, Number(value) || 0) / 60)).padStart(2, "0")}:${String(
    Math.max(0, Number(value) || 0) % 60,
  ).padStart(2, "0")}`;
