import { useState } from "react";
import QuestionBlock from "../QuestionBlock";
import useTranscriptAudio, { AudioBadge } from "../useTranscriptAudio";
import { examQuestions } from "../../../services/vstepService";

const PartTabs = ({ parts, activeId, onChange, answers }) => (
  <div className="flex gap-2 overflow-x-auto pb-1">
    {parts.map((part) => {
      const total = (part.questions || []).length;
      const done = (part.questions || []).filter((question) => answers[question.id]).length;
      return (
        <button
          key={part.id}
          type="button"
          onClick={() => onChange(part.id)}
          aria-current={activeId === part.id ? "true" : undefined}
          className={`flex min-h-[44px] min-w-max items-center gap-2 rounded-xl px-3.5 text-sm font-bold transition ${activeId === part.id ? "bg-lime text-ink" : "text-ink/70 hover:bg-ink/[0.05] dark:text-white/70 dark:hover:bg-white/[0.08]"}`}
        >
          {part.title}
          <span className={`chip ${done === total ? "bg-okbg text-ok dark:bg-okdark dark:text-okfgdark" : "bg-ink/[0.06] text-ink/60 dark:bg-white/10 dark:text-white/60"}`}>{done}/{total}</span>
        </button>
      );
    })}
  </div>
);

/** Phần Nghe: băng đọc transcript (TTS) + câu hỏi trắc nghiệm/điền từ. */
export default function ListeningSection({ exam, answers = {}, onAnswer, mode = "exam", review = null, startIndex = 0 }) {
  const parts = exam.listening?.parts || [];
  const [activeId, setActiveId] = useState(parts[0]?.id);
  const part = parts.find((item) => item.id === activeId) || parts[0];
  const player = useTranscriptAudio(part, { maxPlays: 2, examMode: mode === "exam" });

  if (!part) return <p className="text-sm text-ink/60 dark:text-white/60">Đề này chưa có phần Nghe.</p>;

  // Số thứ tự câu hỏi tính liên tục cho cả bài thi (Nghe 1–35, Đọc 36–75).
  const ordered = examQuestions(exam, "listening");
  const numberOf = (questionId) => ordered.findIndex((item) => item.id === questionId) + 1 + startIndex;
  const reviewByQuestion = new Map((review?.details || []).map((item) => [item.id, item]));

  return (
    <div className="space-y-4">
      <PartTabs parts={parts} activeId={part.id} onChange={setActiveId} answers={answers} />

      <section className="panel p-4 sm:p-5">
        <p className="eyebrow">{part.title}</p>
        <p className="mt-1 text-sm leading-6 text-ink/70 dark:text-white/70">{part.instruction}</p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <AudioBadge player={player} label="Phát băng" />
          {mode !== "exam" && (
            <label className="flex items-center gap-2 text-xs font-semibold">
              Tốc độ
              <select value={player.rate} onChange={(event) => player.setRate(Number(event.target.value))} className="rounded-lg border border-ink/10 bg-transparent px-2 py-1.5 dark:border-white/15">
                <option value={0.8}>0.8x</option>
                <option value={1}>1x</option>
                <option value={1.2}>1.2x</option>
              </select>
            </label>
          )}
          <span className="text-xs text-ink/60 dark:text-white/60">Băng đọc bằng giọng tổng hợp — hãy nghe như đang làm bài thật.</span>
        </div>
        {mode === "review" && (
          <details className="mt-4 rounded-xl bg-ink/[0.04] p-3 text-sm leading-6 dark:bg-white/[0.06]">
            <summary className="cursor-pointer text-xs font-bold uppercase tracking-wide text-ink/60 dark:text-white/60">Xem transcript</summary>
            <div className="mt-2 space-y-1">
              {(part.transcript || []).map((line, index) => (
                <p key={`${line.line}-${index}`}><span className="font-bold text-sage">{line.speaker}:</span> {line.line}</p>
              ))}
            </div>
          </details>
        )}
      </section>

      <section className="panel p-4 sm:p-5">
        <p className="eyebrow">Câu hỏi phần {part.title.split("·")[0].trim()}</p>
        <ol className="mt-3 space-y-3">
          {(part.questions || []).map((question) => {
            const detail = reviewByQuestion.get(question.id);
            return (
              <QuestionBlock
                key={question.id}
                question={question}
                index={numberOf(question.id)}
                value={answers[question.id] ?? ""}
                onChange={onAnswer}
                mode={mode}
                correct={detail ? detail.correct : null}
              />
            );
          })}
        </ol>
      </section>
    </div>
  );
}
