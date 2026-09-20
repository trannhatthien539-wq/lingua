import { useState } from "react";
import { BookMarked } from "lucide-react";
import QuestionBlock from "../QuestionBlock";
import TappableText, { GlossaryList } from "../../../components/ui/TappableText";
import { examQuestions } from "../../../services/vstepService";

/** Phần Đọc: Part 1 văn bản ngắn, Part 2–3 bài đọc hiểu, Part 4 điền khuyết. */
export default function ReadingSection({ exam, answers = {}, onAnswer, mode = "exam", review = null, startIndex = 0 }) {
  const parts = exam.reading?.parts || [];
  const [activePartId, setActivePartId] = useState(parts[0]?.id);
  const [activePassageId, setActivePassageId] = useState(parts[0]?.passages?.[0]?.id);
  const part = parts.find((item) => item.id === activePartId) || parts[0];
  const passages = part?.passages || [];
  const passage = passages.find((item) => item.id === activePassageId) || passages[0];

  if (!part || !passage) return <p className="text-sm text-ink/60 dark:text-white/60">Đề này chưa có phần Đọc.</p>;

  const reviewByQuestion = new Map((review?.details || []).map((item) => [item.id, item]));
  // Số thứ tự câu chạy liên tục cho cả bài thi khi được truyền `startIndex`.
  const ordered = examQuestions(exam, "reading");
  const numberOf = (questionId) => ordered.findIndex((item) => item.id === questionId) + 1 + startIndex;

  const selectPart = (partId) => {
    const next = parts.find((item) => item.id === partId);
    setActivePartId(partId);
    setActivePassageId(next?.passages?.[0]?.id);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 overflow-x-auto pb-1">
        {parts.map((item) => {
          const total = (item.passages || []).reduce((sum, entry) => sum + (entry.questions || []).length, 0);
          const done = (item.passages || []).reduce((sum, entry) => sum + (entry.questions || []).filter((question) => answers[question.id]).length, 0);
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => selectPart(item.id)}
              aria-current={item.id === part.id ? "true" : undefined}
              className={`flex min-h-[44px] min-w-max items-center gap-2 rounded-xl px-3.5 text-sm font-bold transition ${item.id === part.id ? "bg-lime text-ink" : "text-ink/70 hover:bg-ink/[0.05] dark:text-white/70 dark:hover:bg-white/[0.08]"}`}
            >
              {item.title}
              <span className={`chip ${done === total ? "bg-okbg text-ok dark:bg-okdark dark:text-okfgdark" : "bg-ink/[0.06] text-ink/60 dark:bg-white/10 dark:text-white/60"}`}>{done}/{total}</span>
            </button>
          );
        })}
      </div>

      {passages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {passages.map((entry, index) => (
            <button
              key={entry.id}
              type="button"
              onClick={() => setActivePassageId(entry.id)}
              aria-pressed={entry.id === passage.id}
              className={`min-h-[40px] min-w-max rounded-xl border px-3 text-xs font-bold transition ${entry.id === passage.id ? "border-sage bg-sage/15" : "border-ink/[0.1] text-ink/65 hover:bg-ink/[0.04] dark:border-white/[0.1] dark:text-white/65"}`}
            >
              {passages.length > 1 ? `Văn bản ${index + 1}` : entry.title}
            </button>
          ))}
        </div>
      )}

      <section className="panel p-4 sm:p-5">
        <p className="eyebrow">{part.title}</p>
        <p className="mt-1 text-sm leading-6 text-ink/70 dark:text-white/70">{part.instruction}</p>
      </section>

      <div className="grid gap-4 xl:grid-cols-2">
        <section className="panel h-fit p-4 sm:p-5">
          <div className="flex items-center gap-2">
            <BookMarked size={16} className="text-sage" />
            <h3 className="font-display text-base font-bold">{passage.title}</h3>
          </div>
          <div className="mt-3 space-y-3 text-sm leading-7">
            <TappableText text={passage.text} />
            <p className="text-xs text-ink/45 dark:text-white/45">Bấm vào từ tiếng Anh để tra nghĩa nhanh (không ảnh hưởng bài thi).</p>
          </div>
          {passage.glossary?.length > 0 && (
            <details className="mt-4 rounded-xl bg-ink/[0.04] p-3 dark:bg-white/[0.06]">
              <summary className="cursor-pointer text-xs font-bold uppercase tracking-wide text-ink/60 dark:text-white/60">Từ khoá ({passage.glossary.length})</summary>
              <div className="mt-2">
                <GlossaryList items={passage.glossary} showMeaning />
              </div>
              <p className="mt-2 text-xs text-ink/45 dark:text-white/45">Bấm biểu tượng ＋ để lưu từ vào bộ thẻ cá nhân.</p>
            </details>
          )}
        </section>

        <section className="panel p-4 sm:p-5">
          <p className="eyebrow">Câu hỏi</p>
          <ol className="mt-3 space-y-3">
            {(passage.questions || []).map((question) => {
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
    </div>
  );
}
