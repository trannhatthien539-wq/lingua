import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Inbox, Volume2, X } from "lucide-react";
import Dialog from "../ui/Dialog";
import StudySummary from "./StudySummary";
import { getPlayableAudio, sanitizeCard } from "../../utils/sanitizeCard";
import { addDaysKey, dateKey } from "../../utils/srs";
import { playCorrect, playIncorrect, celebrateStudyCompletion } from "../../utils/soundEffects";
import { toast } from "../../services/toast";

const shuffle = (items) => [...items].sort(() => Math.random() - 0.5);
const uniqueMeanings = (items) =>
  items.filter(
    (item, index, all) =>
      all.findIndex((candidate) => candidate.trim().toLowerCase() === item.trim().toLowerCase()) === index,
  );

export default function QuizView({ deck, cards, onClose, onChangeMode, onUpdateCard, onStudyActivity }) {
  const safeCards = useMemo(() => (Array.isArray(cards) ? cards : []).map(sanitizeCard), [cards]);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [results, setResults] = useState([]);
  const [startedAt, setStartedAt] = useState(() => Date.now());
  const advanceTimerRef = useRef(null);
  const mountedRef = useRef(false);
  const onlineWarningShown = useRef(false);
  const card = safeCards[index];
  const total = safeCards.length;
  const complete = total > 0 && index >= total;

  // Giữ nguyên thứ tự đáp án trong suốt thời gian hiển thị một thẻ.
  // `safeCards` được tạo lại sau mỗi lần lưu SRS (cùng nội dung, khác tham chiếu) nên nếu
  // memo theo object thì các đáp án sẽ bị xáo lại ngay sau khi người học vừa chọn.
  const optionsCacheRef = useRef({ cardId: null, options: [] });
  const options = useMemo(() => {
    if (!card) return [];
    if (optionsCacheRef.current.cardId === card.id) return optionsCacheRef.current.options;
    const distractors = uniqueMeanings(
      safeCards.filter((item) => item.id !== card.id).map((item) => item.meaning),
    ).slice(0, 3);
    const next = shuffle(uniqueMeanings([card.meaning, ...distractors]));
    optionsCacheRef.current = { cardId: card.id, options: next };
    return next;
  }, [card, safeCards]);

  // Dọn timer chuyển câu khi đóng bài để không set state sau khi unmount.
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      window.clearTimeout(advanceTimerRef.current);
    };
  }, []);

  const choose = useCallback(
    (option) => {
      if (selected || !card || !option) return;
      const correct = option === card.meaning;
      if (correct) playCorrect();
      else playIncorrect();
      setSelected(option);
      setResults((current) => [...current, { word: card.word, correct }]);

      const interval = correct ? 5 : 1;
      try {
        Promise.resolve(
          onUpdateCard?.(card.id, {
            status: correct ? "mastered" : "learning",
            interval,
            nextReviewDate: addDaysKey(interval),
            lastStudiedDate: dateKey(),
            repetition: correct ? Number(card.repetition || 0) + 1 : 0,
          }),
        ).catch(() => {
          if (onlineWarningShown.current) return;
          onlineWarningShown.current = true;
          toast.warning("Chưa lưu được tiến độ. Bạn vẫn có thể tiếp tục luyện tập.");
        });
      } catch {
        toast.warning("Chưa lưu được tiến độ. Bạn vẫn có thể tiếp tục luyện tập.");
      }

      // Ghi nhận hoạt động học ngay khi trả lời câu cuối thay vì đặt trong setTimeout,
      // để đóng bài trong 800ms đầu cũng không mất tiến độ; timer chỉ hoãn chuyển câu.
      if (index + 1 >= total) {
        if (correct) celebrateStudyCompletion();
        Promise.resolve(onStudyActivity?.()).catch(() => {});
      }

      window.clearTimeout(advanceTimerRef.current);
      advanceTimerRef.current = window.setTimeout(() => {
        if (!mountedRef.current) return;
        setIndex((current) => current + 1);
        setSelected(null);
      }, 800);
    },
    [card, index, onStudyActivity, onUpdateCard, selected, total],
  );

  // Phím 1–4 để chọn nhanh đáp án (không cướp phím khi đang gõ văn bản).
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.ctrlKey || event.metaKey || event.altKey) return;
      const tag = event.target?.tagName;
      if (event.target?.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(tag)) return;
      if (!/^[1-4]$/.test(event.key)) return;
      const option = options[Number(event.key) - 1];
      if (!option) return;
      event.preventDefault();
      choose(option);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [choose, options]);

  if (!total) {
    return (
      <Dialog
        onClose={onClose}
        ariaLabel="Bộ thẻ đang trống"
        className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-2xl dark:border-white/10 dark:bg-slate-900"
      >
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-amber-500/10 text-amber-500">
          <Inbox size={28} aria-hidden="true" />
        </div>
        <h2 className="mt-4 font-display text-xl font-bold">Chưa có thẻ để luyện</h2>
        <p className="mt-2 text-sm text-ink/60 dark:text-white/60">
          Hãy thêm từ vựng hoặc chọn bộ thẻ khác trước khi bắt đầu trắc nghiệm.
        </p>
        <button type="button" onClick={onClose} className="btn-primary mt-6 px-5 py-3 text-sm">
          Quay lại
        </button>
      </Dialog>
    );
  }

  if (complete) {
    const correct = results.filter((result) => result.correct).length;
    return (
      <StudySummary
        title={`Quiz · ${deck.title}`}
        score={correct}
        total={total}
        duration={`${Math.round((Date.now() - startedAt) / 1000)}s`}
        mistakes={results.filter((result) => !result.correct).map((result) => result.word)}
        onReplay={() => {
          setIndex(0);
          setResults([]);
          setSelected(null);
          setStartedAt(Date.now());
        }}
        onChangeMode={onChangeMode}
        onClose={onClose}
      />
    );
  }

  const selectedIsCorrect = Boolean(selected) && selected === card.meaning;

  return (
    <div className="fixed inset-0 z-[90] overflow-y-auto bg-mist p-4 text-ink dark:bg-dark1 dark:text-white sm:p-10">
      <div className="mx-auto max-w-3xl">
        <header className="flex items-center justify-between gap-3">
          <div>
            <p className="eyebrow">Trắc nghiệm · {deck.title}</p>
            <p className="mt-1 text-sm font-bold">
              Câu {index + 1}/{total}
            </p>
          </div>
          <button type="button" onClick={onClose} className="icon-btn" aria-label="Đóng bài trắc nghiệm">
            <X size={19} />
          </button>
        </header>

        <div
          role="progressbar"
          aria-label="Tiến độ bài trắc nghiệm"
          aria-valuemin={0}
          aria-valuemax={total}
          aria-valuenow={index}
          className="mt-4 h-2 rounded-full bg-slate-200/60 dark:bg-white/10"
        >
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${(index / total) * 100}%`,
              background: "linear-gradient(90deg, rgb(var(--accent)), rgb(var(--accent-2)))",
            }}
          />
        </div>

        <section className="panel mt-8 p-6 sm:mt-10 sm:p-8">
          <p className="eyebrow text-center">Chọn nghĩa đúng</p>
          <div className="mt-5 flex items-center justify-center gap-3">
            <h2 className="font-display text-3xl font-bold sm:text-4xl">{card.word}</h2>
            <button
              type="button"
              onClick={getPlayableAudio(card)}
              className="btn-primary grid h-11 w-11 place-items-center rounded-xl p-0"
              aria-label={`Phát âm từ ${card.word}`}
            >
              <Volume2 size={17} />
            </button>
          </div>
          <p className="mt-3 text-center text-sm font-medium text-indigo-600 dark:text-indigo-400">
            {card.ipa || "IPA chưa có"}
          </p>

          <div role="group" aria-label="Các lựa chọn nghĩa" className="mt-8 grid gap-3 sm:grid-cols-2">
            {options.map((option, optionIndex) => {
              const isCorrect = option === card.meaning;
              const isSelected = selected === option;
              return (
                <button
                  key={`${option}-${optionIndex}`}
                  type="button"
                  disabled={Boolean(selected)}
                  aria-pressed={isSelected}
                  onClick={() => choose(option)}
                  className={`min-h-[56px] break-words rounded-xl border-2 p-4 text-left text-sm font-bold transition ${
                    !selected
                      ? "border-ink/10 hover:border-indigo-400 hover:bg-indigo-500/[0.04] dark:border-white/10"
                      : isCorrect
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-200"
                        : isSelected
                          ? "animate-[quiz-shake_360ms_ease-in-out] border-red-500 bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-200"
                          : "border-ink/10 opacity-50 dark:border-white/10"
                  }`}
                >
                  <span className="mr-2 text-ink/35 dark:text-white/35">{optionIndex + 1}</span>
                  {option}
                </button>
              );
            })}
          </div>

          <p aria-live="polite" className="mt-4 min-h-[20px] text-center text-sm font-bold">
            {selected ? (selectedIsCorrect ? "Chính xác! 🎉" : `Chưa đúng — đáp án đúng: ${card.meaning}`) : ""}
          </p>
          <p className="mt-1 text-center text-xs text-ink/45 dark:text-white/45">
            Mẹo: nhấn phím 1–4 để chọn nhanh đáp án.
          </p>
        </section>
      </div>
    </div>
  );
}
