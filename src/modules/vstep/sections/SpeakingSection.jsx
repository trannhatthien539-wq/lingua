import { useEffect, useState } from "react";
import { CircleStop, Mic, Quote, Volume2 } from "lucide-react";
import { speakText, stopSpeech } from "../../../utils/speech";
import { scoreLabel, scorePronunciation } from "../../../utils/speechScore";
import useAudioRecorder, { formatSeconds } from "../useAudioRecorder";

/** Phần Nói: nghe câu hỏi bằng TTS, ghi âm câu trả lời, chấm phát âm khi xem lại. */
export default function SpeakingSection({ exam, speaking = {}, onSpeak, mode = "exam", review = null }) {
  const parts = exam.speaking?.parts || [];
  const [activeId, setActiveId] = useState(parts[0]?.id);
  const part = parts.find((item) => item.id === activeId) || parts[0];
  const recorder = useAudioRecorder();
  const [saved, setSaved] = useState(() => speaking[part?.id] || null);

  useEffect(() => {
    setSaved(speaking[part?.id] || null);
    recorder.reset();
    return () => stopSpeech();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [part?.id]);

  if (!part) return <p className="text-sm text-ink/60 dark:text-white/60">Đề này chưa có phần Nói.</p>;

  const prompts = [part.situation, part.topic, ...(part.questions || []).map((item) => item.q), ...(part.options || [])].filter(Boolean);
  const sample = part.sample || (part.questions || []).map((item) => item.sample).filter(Boolean).join(" ");

  const startRecording = async () => {
    await recorder.start(() => {
      const seconds = recorder.seconds;
      onSpeak(part.id, { transcript: recorder.transcript, seconds, at: new Date().toISOString() });
    });
  };

  const stopRecording = () => {
    const seconds = recorder.seconds;
    const transcript = recorder.transcript;
    recorder.stop();
    onSpeak(part.id, { transcript, seconds, at: new Date().toISOString() });
    setSaved({ transcript, seconds });
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
              className={`flex min-h-[44px] min-w-max items-center gap-2 rounded-xl px-3.5 text-sm font-bold transition ${item.id === part.id ? "bg-lime text-ink" : "text-ink/70 hover:bg-ink/[0.05] dark:text-white/70 dark:hover:bg-white/[0.08]"}`}
            >
              {item.title}
              {answer?.seconds ? <span className="chip bg-okbg text-ok dark:bg-okdark dark:text-okfgdark">{formatSeconds(answer.seconds)}</span> : null}
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
            onClick={() => speakText(prompts.join(" "))}
            className="btn-secondary px-4"
          >
            <Volume2 size={16} />Nghe đề bằng tiếng Anh
          </button>
          {recorder.recording ? (
            <button type="button" onClick={stopRecording} className="btn-primary px-4">
              <CircleStop size={16} />Dừng ({formatSeconds(recorder.seconds)})
            </button>
          ) : (
            <button type="button" onClick={startRecording} className="btn-primary px-4">
              <Mic size={16} />{saved ? "Ghi âm lại" : "Bắt đầu nói"}
            </button>
          )}
          {recorder.audioUrl && <audio controls src={recorder.audioUrl} className="h-11 w-full max-w-xs" />}
        </div>
        {recorder.error && <p className="mt-2 text-xs text-danger dark:text-dangerfgdark">{recorder.error}</p>}
        {recorder.transcript && (
          <p className="mt-3 rounded-xl bg-ink/[0.04] p-3 text-sm leading-6 dark:bg-white/[0.06]">
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
