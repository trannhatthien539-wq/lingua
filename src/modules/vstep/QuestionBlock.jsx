import { useCallback, useMemo } from "react";
import { Check, X } from "lucide-react";

const LETTERS = ["A", "B", "C", "D", "E", "F"];

/**
 * Khung câu hỏi chuẩn EdTech cho Nghe/Đọc:
 * - Hỗ trợ chuẩn ngữ nghĩa A11y (role="radiogroup", role="radio", aria-checked).
 * - Phím tắt nhanh: bấm 1-6 hoặc A-F khi đang focus vào câu hỏi để chọn đáp án.
 * - Micro-interactions mượt mà, độ tương phản chuẩn WCAG AA trong cả Light & Dark mode.
 */
export default function QuestionBlock({
  question,
  index,
  value = "",
  onChange,
  mode = "exam",
  correct = null,
}) {
  const locked = mode === "review";
  const isChoice = question.type === "choice";
  const options = useMemo(() => question.options || [], [question.options]);
  const correctAnswer = isChoice ? question.answer : (question.answers || [])[0];
  const selectedIndex = options.findIndex((option) => option === value);

  // Phím tắt A-F / 1-6 và điều hướng bằng mũi tên (chuẩn radiogroup) để chọn đáp án nhanh.
  const handleKeyDown = useCallback(
    (event) => {
      if (locked || !isChoice || !options.length) return;
      const key = event.key.toUpperCase();

      let targetIndex = -1;
      if (LETTERS.includes(key)) {
        targetIndex = LETTERS.indexOf(key);
      } else if (["1", "2", "3", "4", "5", "6"].includes(event.key)) {
        targetIndex = Number.parseInt(event.key, 10) - 1;
      } else if (["ArrowDown", "ArrowRight"].includes(event.key)) {
        targetIndex = selectedIndex < 0 ? 0 : Math.min(options.length - 1, selectedIndex + 1);
      } else if (["ArrowUp", "ArrowLeft"].includes(event.key)) {
        targetIndex = selectedIndex < 0 ? options.length - 1 : Math.max(0, selectedIndex - 1);
      }

      if (targetIndex >= 0 && targetIndex < options.length) {
        event.preventDefault();
        onChange(question.id, options[targetIndex]);
      }
    },
    [locked, isChoice, options, selectedIndex, question.id, onChange]
  );

  return (
    <li
      tabIndex={locked ? -1 : 0}
      onKeyDown={handleKeyDown}
      aria-label={`Câu hỏi ${index}: ${question.prompt}`}
      className={`group rounded-2xl border p-4 sm:p-5 transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 ${
        mode === "review"
          ? correct
            ? "border-emerald-500/40 bg-emerald-50/60 dark:border-emerald-500/30 dark:bg-emerald-950/20"
            : "border-rose-500/40 bg-rose-50/60 dark:border-rose-500/30 dark:bg-rose-950/20"
          : "border-slate-200/80 bg-white/70 shadow-xs hover:border-slate-300 dark:border-white/10 dark:bg-white/[0.03] dark:hover:border-white/20"
      }`}
    >
      <div className="flex items-start gap-3.5">
        <span
          className={`grid h-8 w-8 shrink-0 place-items-center rounded-xl text-xs font-bold transition-colors ${
            mode === "review"
              ? correct
                ? "bg-emerald-500 text-white"
                : "bg-rose-500 text-white"
              : value
                ? "bg-indigo-600 text-white shadow-xs dark:bg-indigo-500"
                : "bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-200"
          }`}
        >
          {index}
        </span>

        <div className="min-w-0 flex-1">
          <p className="text-sm sm:text-base font-semibold leading-relaxed text-slate-900 dark:text-white">
            {question.prompt}
          </p>

          {isChoice ? (
            <div
              role="radiogroup"
              aria-label={`Lựa chọn cho câu ${index}`}
              className="mt-3.5 grid gap-2.5"
            >
              {options.map((option, optionIndex) => {
                const selected = value === option;
                const isRight = mode === "review" && option === correctAnswer;
                const isWrong = mode === "review" && selected && option !== correctAnswer;
                // Roving tabindex: chỉ một đáp án nằm trong luồng Tab, di chuyển bằng mũi tên.
                const tabIndex = selected || (selectedIndex === -1 && optionIndex === 0) ? 0 : -1;

                return (
                  <button
                    key={`${option}-${optionIndex}`}
                    type="button"
                    role="radio"
                    disabled={locked}
                    aria-checked={selected}
                    tabIndex={tabIndex}
                    onClick={() => onChange(question.id, option)}
                    className={`flex min-h-[46px] w-full items-center gap-3 rounded-xl border px-3.5 py-2.5 text-left text-sm transition-all duration-150 ${
                      isRight
                        ? "border-emerald-500 bg-emerald-100/80 font-bold text-emerald-900 shadow-xs dark:border-emerald-500/50 dark:bg-emerald-950/50 dark:text-emerald-200"
                        : isWrong
                          ? "border-rose-500 bg-rose-100/80 font-bold text-rose-900 dark:border-rose-500/50 dark:bg-rose-950/50 dark:text-rose-200"
                          : selected
                            ? "border-indigo-600 bg-indigo-50/90 font-bold text-indigo-900 ring-1 ring-indigo-600/30 dark:border-indigo-400 dark:bg-indigo-950/40 dark:text-indigo-200 dark:ring-indigo-400/30"
                            : "border-slate-200 bg-white/60 text-slate-700 hover:border-slate-300 hover:bg-slate-50 active:scale-[0.99] dark:border-white/10 dark:bg-white/[0.02] dark:text-slate-200 dark:hover:border-white/20 dark:hover:bg-white/[0.06]"
                    }`}
                  >
                    <span
                      className={`grid h-6 w-6 shrink-0 place-items-center rounded-lg text-xs font-bold transition-colors ${
                        selected
                          ? "bg-indigo-600 text-white dark:bg-indigo-500"
                          : "bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-300"
                      }`}
                    >
                      {LETTERS[optionIndex]}
                    </span>

                    <span className="min-w-0 flex-1 leading-snug">{option}</span>

                    {isRight && <Check size={18} className="shrink-0 text-emerald-600 dark:text-emerald-400" />}
                    {isWrong && <X size={18} className="shrink-0 text-rose-600 dark:text-rose-400" />}
                  </button>
                );
              })}
              <span className="sr-only" aria-live="polite">
                {selectedIndex >= 0 ? `Đã chọn đáp án ${LETTERS[selectedIndex]}.` : ""}
              </span>
            </div>
          ) : (
            <div className="mt-3.5">
              {mode === "review" ? (
                <div
                  className={`rounded-xl border p-3.5 text-sm font-semibold ${
                    correct
                      ? "border-emerald-500/30 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-200"
                      : "border-rose-500/30 bg-rose-50 text-rose-800 dark:bg-rose-950/30 dark:text-rose-200"
                  }`}
                >
                  <p>
                    Bạn trả lời:{" "}
                    <span className="font-mono font-bold">{value || "(bỏ trống)"}</span>
                  </p>
                  {!correct && (
                    <p className="mt-1 text-xs font-normal text-emerald-700 dark:text-emerald-300">
                      Đáp án chính xác: <span className="font-mono font-bold">{correctAnswer}</span>
                    </p>
                  )}
                </div>
              ) : (
                <input
                  type="text"
                  value={value}
                  onChange={(event) => onChange(question.id, event.target.value)}
                  placeholder="Nhập câu trả lời của bạn…"
                  aria-label={`Câu trả lời cho câu ${index}`}
                  className="field max-w-sm font-medium transition focus:ring-2 focus:ring-indigo-500"
                />
              )}
            </div>
          )}

          {mode === "review" && question.explain && (
            <div className="mt-3 rounded-xl border border-amber-500/20 bg-amber-500/[0.06] p-3 text-xs leading-relaxed text-amber-900 dark:text-amber-200">
              <span className="font-bold">💡 Giải thích:</span> {question.explain}
            </div>
          )}
        </div>
      </div>
    </li>
  );
}
