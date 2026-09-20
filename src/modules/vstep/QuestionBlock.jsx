import { Check, X } from "lucide-react";

const LETTERS = ["A", "B", "C", "D", "E", "F"];

/**
 * Khung một câu hỏi dùng chung cho Nghe/Đọc.
 * - `mode="exam"`: chỉ ghi nhận đáp án, không tiết lộ đúng/sai.
 * - `mode="review"`: hiện đáp án đúng, lựa chọn của bạn và giải thích.
 */
export default function QuestionBlock({ question, index, value = "", onChange, mode = "exam", correct = null }) {
  const locked = mode === "review";
  const isChoice = question.type === "choice";
  const correctAnswer = isChoice ? question.answer : (question.answers || [])[0];

  return (
    <li className={`rounded-xl border p-3.5 sm:p-4 ${mode === "review" ? (correct ? "border-ok/50 bg-okbg/40 dark:border-ok/40 dark:bg-okdark/30" : "border-danger/40 bg-danger/5") : "border-ink/[0.08] dark:border-white/[0.08]"}`}>
      <div className="flex items-start gap-3">
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-ink/[0.06] text-xs font-bold dark:bg-white/10">{index}</span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold leading-6">{question.prompt}</p>

          {isChoice ? (
            <div className="mt-3 grid gap-2">
              {(question.options || []).map((option, optionIndex) => {
                const selected = value === option;
                const isRight = mode === "review" && option === correctAnswer;
                const isWrong = mode === "review" && selected && option !== correctAnswer;
                return (
                  <button
                    key={`${option}-${optionIndex}`}
                    type="button"
                    disabled={locked}
                    onClick={() => onChange(question.id, option)}
                    aria-pressed={selected}
                    className={`flex min-h-[44px] items-center gap-3 rounded-xl border px-3 py-2 text-left text-sm transition ${
                      isRight
                        ? "border-ok bg-okbg text-ok dark:bg-okdark dark:text-okfgdark"
                        : isWrong
                          ? "border-danger bg-danger/10 text-danger dark:text-dangerfgdark"
                          : selected
                            ? "border-sage bg-sage/15 font-bold"
                            : "border-ink/[0.1] hover:bg-ink/[0.04] dark:border-white/[0.1] dark:hover:bg-white/[0.06]"
                    }`}
                  >
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-ink/[0.07] text-xs font-bold dark:bg-white/10">{LETTERS[optionIndex]}</span>
                    <span className="min-w-0 flex-1">{option}</span>
                    {isRight && <Check size={16} className="shrink-0" />}
                    {isWrong && <X size={16} className="shrink-0" />}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="mt-3">
              {mode === "review" ? (
                <p className={`rounded-xl border px-3 py-2 text-sm font-bold ${correct ? "border-ok bg-okbg text-ok dark:bg-okdark dark:text-okfgdark" : "border-danger bg-danger/5 text-danger dark:text-dangerfgdark"}`}>
                  Bạn trả lời: {value || "(bỏ trống)"} · Đáp án: {correctAnswer}
                </p>
              ) : (
                <input
                  value={value}
                  onChange={(event) => onChange(question.id, event.target.value)}
                  placeholder="Nhập câu trả lời…"
                  aria-label={`Câu trả lời cho câu ${index}`}
                  className="field max-w-xs"
                />
              )}
            </div>
          )}

          {mode === "review" && question.explain && (
            <p className="mt-2 text-xs leading-5 text-ink/70 dark:text-white/70">💡 {question.explain}</p>
          )}
        </div>
      </div>
    </li>
  );
}
