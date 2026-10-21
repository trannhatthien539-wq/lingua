import { useEffect, useState } from "react";
import { CircleStop, Mic, Quote, Volume2 } from "lucide-react";
import { speakText, stopSpeech } from "../../../utils/speech";
import { scoreLabel, scorePronunciation } from "../../../utils/speechScore";
import { toast } from "../../../services/toast";
import useAudioRecorder, { formatSeconds } from "../useAudioRecorder";

/**
 * Phần Nói: nghe câu hỏi bằng TTS, ghi âm câu trả lời, chấm phát âm khi xem lại.
 * (Câu trả lời đã lưu nằm trong `speaking[part.id]`, nên không cần prop `review`.)
 */
export default function SpeakingSection({ exam, speaking = {}, onSpeak, mode = "exam" }) {
  const parts = exam.speaking?.parts || [];
  const [activeId, setActiveId] = useState(parts[0]?.id);
  const part = parts.find((item) => item.id === activeId) || parts[0];
  const recorder = useAudioRecorder();
  const [saved, setSaved] = useState(() => speaking[part?.id] || null);

  const resetRecorder = recorder.reset;

  useEffect(() => {
    setSaved(speaking[part?.id] || null);
    // Đổi phần thi khi đang ghi âm: dừng micro và bỏ bản ghi của phần trước.
    resetRecorder();
    return () => stopSpeech();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [part?.id]);

  if (!part) return <p className="text-sm text-ink/60 dark:text-white/60">Đề này chưa có phần Nói.</p>;

  const prompts = [part.situation, part.topic, ...(part.questions || []).map((item) => item.q), ...(part.options || [])].filter(Boolean);
  const sample = part.sample || (part.questions || []).map((item) => item.sample).filter(Boolean).join(" ");

  const startRecording = async () => {
    stopSpeech();
    // Payload được chốt tại thời điểm MediaRecorder dừng → không còn lưu đè bằng dữ liệu cũ.
    await recorder.start((payload) => {
      const answer = {
        transcript: payload.transcript,
        seconds: payload.seconds,
        at: new Date().toISOString(),
      };
      onSpeak(part.id, answer);
      setSaved(answer);
    });
  };

  const stopRecording = () => {
    recorder.stop();
  };

  const pronunciation = saved?.transcript && sample ? scorePronunciation(saved.transcript, sample, saved.seconds) : null;

  return (
    <div className="space-y-4">
      <div className="flex gap-2 overflow-x-auto pb-1">
        {parts.map((item) => {
          const answer = speaking[item.id];
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveId(item.id)}
              aria-current={item.id === part.id ? "true" : undefined}
              className={`flex min-h-[44px] min-w-max items-center gap-2 rounded-xl px-3.5 text-sm font-bold transition ${item.id === part.id ? "bg-slate-900 text-white shadow-sm dark:bg-white dark:text-slate-900" : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/[0.08]"}`}
            >
              {item.title}
              {answer?.seconds ? <span className="chip border border-emerald-500/25 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">{formatSeconds(answer.seconds)}</span> : null}
            </button>
          );
        })}
      </div>

      <section className="panel p-4 sm:p-5">
        <p className="eyebrow">{part.title} · {part.minutes} phút</p>
        <p className="mt-1 text-sm leading-6 text-ink/70 dark:text-white/70">{part.instruction}</p>

        <div className="mt-4 space-y-2 rounded-xl border border-ink/[0.08] p-3 text-sm leading-6 dark:border-white/[0.08]">
          {part.situation && <p><span className="font-bold">Tình huống: </span>{part.situation}</p>}
          {part.topic && <p><span className="font-bold">Chủ đề: </span>{part.topic}</p>}
          {part.outline?.length > 0 && (
            <ul className="list-disc pl-5 text-ink/80 dark:text-white/80">{part.outline.map((item) => <li key={item}>{item}</li>)}</ul>
          )}
          {part.options?.length > 0 && (
            <ol className="list-decimal pl-5 text-ink/80 dark:text-white/80">{part.options.map((item) => <li key={item}>{item}</li>)}</ol>
          )}
          {(part.questions || []).map((item) => (
            <p key={item.q} className="font-semibold">• {item.q}</p>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => speakText(prompts.join(" "), { onError: () => toast.error("Không phát được âm thanh. Hãy kiểm tra loa/thiết bị.") })}
            className="btn-secondary px-4"
            aria-label="Nghe đề bài bằng tiếng Anh"
          >
            <Volume2 size={16} />Nghe đề bằng tiếng Anh
          </button>
          {recorder.recording ? (
            <button
              type="button"
              onClick={stopRecording}
              className="btn-primary px-4"
              aria-label={`Dừng ghi âm, đã ghi ${formatSeconds(recorder.seconds)}`}
            >
              <CircleStop size={16} />
              <span className="inline-flex items-center gap-1.5">
                <span className="h-2 w-2 animate-pulse rounded-full bg-white" aria-hidden="true" />
                Dừng ({formatSeconds(recorder.seconds)})
              </span>
            </button>
          ) : (
            <button
              type="button"
              onClick={startRecording}
              className="btn-primary px-4"
              aria-pressed={false}
              aria-describedby="vstep-recorder-hint"
            >
              <Mic size={16} />{saved ? "Ghi âm lại" : "Bắt đầu nói"}
            </button>
          )}
          {recorder.audioUrl && (
            <audio
              controls
              src={recorder.audioUrl}
              className="h-11 w-full max-w-xs"
              aria-label="Nghe lại bản ghi âm của bạn"
            />
          )}
        </div>
        <p id="vstep-recorder-hint" className="mt-2 text-xs text-ink/55 dark:text-white/55">
          Tối đa {formatSeconds(recorder.maxSeconds)} mỗi lần ghi âm. Bản ghi tự dừng khi hết giới hạn.
        </p>
        {recorder.error && (
          <p role="alert" className="mt-2 text-xs font-semibold text-danger dark:text-dangerfgdark">
            {recorder.error}
          </p>
        )}
        {recorder.transcript && (
          <p aria-live="polite" className="mt-3 rounded-xl bg-ink/[0.04] p-3 text-sm leading-6 dark:bg-white/[0.06]">
            <span className="text-xs font-bold uppercase tracking-wide text-ink/50 dark:text-white/50">Nhận dạng được: </span>
            {recorder.transcript}
          </p>
        )}
        {mode === "exam" && (
          <p className="mt-3 text-xs text-ink/60 dark:text-white/60">
            Trong chế độ thi thật, hãy nói liên tục cho đến khi hết thời gian của phần này. Bạn có thể ghi âm lại trước khi chuyển sang phần tiếp theo.
          </p>
        )}
      </section>

      {pronunciation && (
        <section className="panel p-4 sm:p-5">
          <p className="eyebrow">Phát âm (so với bài mẫu)</p>
          <div className="mt-2 flex flex-wrap items-center gap-4">
            <p className="metric text-2xl">{pronunciation.score}%</p>
            <p className="text-sm font-bold">{scoreLabel(pronunciation.score)}</p>
            <p className="text-xs text-ink/60 dark:text-white/60">Khớp {pronunciation.matched}/{pronunciation.total} từ</p>
          </div>
        </section>
      )}

      {mode === "review" && (
        <section className="panel p-4 sm:p-5">
          <p className="eyebrow flex items-center gap-2"><Quote size={14} />Bài nói mẫu</p>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-7">{sample}</p>
        </section>
      )}
    </div>
  );
}
