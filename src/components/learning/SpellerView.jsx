import { useEffect, useMemo, useRef, useState } from "react";
import { Check, Headphones, Volume2, X } from "lucide-react";
import Dialog from "../ui/Dialog";
import StudySummary from "./StudySummary";
import { getPlayableAudio, sanitizeCard } from "../../utils/sanitizeCard";
import { addDaysKey, dateKey } from "../../utils/srs";
import { toast } from "../../services/toast";

const mismatch = (actual, expected) => {
  const first = Math.max(
    [...expected].findIndex((letter, index) => actual[index]?.toLowerCase() !== letter.toLowerCase()),
    0,
  );
  return `${actual.slice(0, first)}${actual[first] || "_"} → ${expected[first] || ""}`;
};

export default function SpellerView({ deck, cards, onClose, onChangeMode, onUpdateCard, onStudyActivity }) {
  const safeCards = useMemo(() => (Array.isArray(cards) ? cards : []).map(sanitizeCard), [cards]);
  const total = safeCards.length;
  const [index, setIndex] = useState(0);
  const [value, setValue] = useState("");
  const [feedback, setFeedback] = useState("");
  const [results, setResults] = useState([]);
  const [startedAt, setStartedAt] = useState(() => Date.now());
  const inputRef = useRef(null);
  const warnedRef = useRef(false);
  const card = safeCards[index];
  const cardRef = useRef(card);
  const complete = total > 0 && index >= total;
  cardRef.current = card;

  // Nghe phát âm mẫu một lần cho mỗi thẻ mới (không chặn nếu trình duyệt chặn autoplay).
  // Phụ thuộc vào `id` thay vì object `card`: bản ghi SRS cập nhật thẻ thành object mới
  // (cùng nội dung) và sẽ làm âm thanh phát lại ngoài ý muốn.
  const cardId = card?.id;
  useEffect(() => {
    const current = cardRef.current;
    if (!current) return;
    try {
      getPlayableAudio(current)();
    } catch {
      // Autoplay bị chặn/thiếu file âm thanh: người học vẫn có nút "Phát lại".
    }
  }, [cardId]);

  // Giữ focus ở ô nhập để gõ liên tục bằng bàn phím.
  useEffect(() => {
    if (!complete) inputRef.current?.focus();
  }, [index, complete]);

  const notifySaveFailure = () => {
    if (warnedRef.current) return;
    warnedRef.current = true;
    toast.warning("Chưa lưu được tiến độ lên máy chủ. Bạn vẫn có thể tiếp tục luyện tập.");
  };

  const submit = (event) => {
    event.preventDefault();
    if (!card) return;
    const answer = value.trim();
    if (!answer) {
      setFeedback("Hãy gõ từ bạn nghe được rồi nhấn Enter.");
      inputRef.current?.focus();
      return;
    }
    if (answer.toLowerCase() !== card.word.toLowerCase()) {
      setFeedback(`Chưa đúng: ${mismatch(answer, card.word)}. Hãy nghe lại và gõ lại nhé.`);
      inputRef.current?.focus();
      return;
    }

    setFeedback("");
    setResults((current) => [...current, { word: card.word, correct: true }]);

    // Cập nhật giao diện ngay; việc lưu tiến độ chạy nền để không chặn khi mạng chậm.
    try {
      Promise.resolve(
        onUpdateCard?.(card.id, {
          status: "mastered",
          interval: 5,
          nextReviewDate: addDaysKey(5),
          lastStudiedDate: dateKey(),
          repetition: Number(card.repetition || 0) + 1,
        }),
      ).catch(notifySaveFailure);
    } catch {
      notifySaveFailure();
    }
    if (index + 1 >= total) Promise.resolve(onStudyActivity?.()).catch(() => {});

    setIndex((current) => current + 1);
    setValue("");
  };

  if (!total) {
    return (
      <Dialog
        onClose={onClose}
        ariaLabel="Chưa có thẻ để luyện"
        className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-2xl dark:border-white/10 dark:bg-slate-900"
      >
        <h2 className="font-display text-xl font-bold">Chưa có thẻ để luyện</h2>
        <p className="mt-2 text-sm text-ink/60 dark:text-white/60">
          Hãy thêm từ vựng hoặc chọn bộ thẻ khác trước khi bắt đầu.
        </p>
        <button type="button" onClick={onClose} className="btn-primary mt-6 px-5 py-3 text-sm">
          Quay lại
        </button>
      </Dialog>
    );
  }

  if (complete) {
    return (
      <StudySummary
        title={`Speller · ${deck.title}`}
        score={results.length}
        total={total}
        duration={`${Math.round((Date.now() - startedAt) / 1000)}s`}
        onReplay={() => {
          setIndex(0);
          setResults([]);
          setFeedback("");
          setValue("");
          setStartedAt(Date.now());
        }}
        onChangeMode={onChangeMode}
        onClose={onClose}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-[90] overflow-y-auto bg-mist p-4 text-ink dark:bg-dark1 dark:text-white sm:p-10">
      <div className="mx-auto max-w-2xl">
        <header className="flex items-center justify-between gap-3">
          <div>
            <p className="eyebrow">Nghe &amp; viết · {deck.title}</p>
            <p className="mt-1 text-sm font-bold">
              Từ {index + 1}/{total}
            </p>
          </div>
          <button type="button" onClick={onClose} className="icon-btn" aria-label="Đóng bài nghe viết">
            <X size={19} />
          </button>
        </header>

        <div
          role="progressbar"
          aria-label="Tiến độ bài nghe viết"
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

        <section className="panel mt-8 p-6 text-center sm:mt-10 sm:p-8">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-indigo-500/30 bg-indigo-500/15 text-indigo-600 dark:text-indigo-400">
            <Headphones size={24} aria-hidden="true" />
          </div>
          <p className="eyebrow mt-5">Nghe và gõ lại</p>
          <button
            type="button"
            onClick={getPlayableAudio(card)}
            className="btn-primary mx-auto mt-5 flex items-center gap-2 px-5 py-3 text-sm font-bold"
            aria-label="Phát lại âm thanh của từ"
          >
            <Volume2 size={17} />Phát lại âm thanh
          </button>
          <p className="mt-7 text-lg font-bold">{card.meaning}</p>
          <p className="mt-2 text-sm font-medium text-indigo-600 dark:text-indigo-400">{card.ipa || "IPA chưa có"}</p>

          <form onSubmit={submit} className="mx-auto mt-8 flex max-w-md flex-col gap-2 sm:flex-row">
            <label htmlFor="speller-answer" className="sr-only">
              Gõ lại từ tiếng Anh bạn vừa nghe
            </label>
            <input
              id="speller-answer"
              ref={inputRef}
              value={value}
              onChange={(event) => {
                setValue(event.target.value);
                if (feedback) setFeedback("");
              }}
              autoComplete="off"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              enterKeyHint="done"
              aria-invalid={Boolean(feedback)}
              aria-describedby="speller-feedback speller-hint"
              className="min-w-0 flex-1 rounded-xl border border-ink/10 bg-transparent px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:border-white/10"
              placeholder="Gõ từ tiếng Anh..."
            />
            <button type="submit" className="btn-primary px-5 py-3 text-sm">
              Kiểm tra
            </button>
          </form>

          <p id="speller-feedback" role="status" aria-live="polite" className="mt-4 min-h-[20px] text-sm font-bold text-red-600 dark:text-red-300">
            {feedback && (
              <>
                <X size={15} className="mr-1 inline" aria-hidden="true" />
                {feedback}
              </>
            )}
          </p>
          <p id="speller-hint" className="text-xs text-ink/50 dark:text-white/50">
            <Check size={13} className="mr-1 inline" aria-hidden="true" />
            Nhấn Enter để kiểm tra · nhấn phím Tab để tới nút Phát lại
          </p>
        </section>
      </div>
    </div>
  );
}
