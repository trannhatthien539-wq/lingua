import { useCallback, useEffect, useRef, useState } from "react";
import { Check, ChevronLeft, Volume2, X, RotateCcw } from "lucide-react";
import { speakText, stopSpeech } from "../../utils/speech";
import { intervalLabel, previewIntervals, schedulePayload } from "../../utils/srs";

// Phải khớp với `duration-500` của thẻ để nội dung chỉ đổi sau khi thẻ đã xoay xong.
const FLIP_MS = 500;

export default function FlashcardModal({ deck, cards, onClose, onUpdateCard, onStudyActivity, streak }) {
  const [queue, setQueue] = useState(() => cards.map((card) => ({ ...card })));
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [locked, setLocked] = useState(false);
  const [results, setResults] = useState([]);
  const [history, setHistory] = useState([]);
  const [speaking, setSpeaking] = useState("");
  const [imageError, setImageError] = useState(false);
  const touchStartX = useRef(null);
  const flipTimer = useRef(null);
  const currentCard = queue[index];
  const isComplete = index >= queue.length;
  const progress = queue.length ? Math.min(100, (index / queue.length) * 100) : 100;

  useEffect(
    () => () => {
      stopSpeech();
      window.clearTimeout(flipTimer.current);
    },
    [],
  );
  useEffect(() => setImageError(false), [currentCard?.id, currentCard?.imageUrl]);

  const speak = (text, id) => {
    setSpeaking(id);
    speakText(text, { onEnd: () => setSpeaking("") });
  };

  // Nếu thẻ đang ở mặt sau: lật về mặt trước (vẫn giữ nội dung thẻ hiện tại) rồi mới đổi
  // sang thẻ kế tiếp. Nếu không làm vậy, mặt sau của thẻ mới sẽ lộ ra trong lúc xoay.
  const advanceAfterFlip = useCallback((swapContent) => {
    window.clearTimeout(flipTimer.current);
    if (!flipped) {
      swapContent();
      setImageError(false);
      return;
    }
    setLocked(true);
    setFlipped(false);
    flipTimer.current = window.setTimeout(() => {
      flipTimer.current = null;
      swapContent();
      setImageError(false);
      setLocked(false);
    }, FLIP_MS);
  }, [flipped]);

  const rateCard = useCallback(async (rating) => {
    if (!currentCard || locked) return;
    const previousSrs = {
      status: currentCard.status || "new",
      interval: Number(currentCard.interval) || 0,
      nextReviewDate: currentCard.nextReviewDate || null,
      repetition: Number(currentCard.repetition) || 0,
      reviewDate: currentCard.reviewDate || null,
      ease: Number(currentCard.ease) || 2.5,
      lapses: Number(currentCard.lapses) || 0,
    };
    const nextResults = [...results, rating];
    await onUpdateCard(currentCard.id, schedulePayload(currentCard, rating));
    setHistory((current) => [...current, { cardId: currentCard.id, previousSrs, rating, repeated: rating === "again" }]);
    setResults(nextResults);
    advanceAfterFlip(() => {
      if (rating === "again") {
        setQueue((current) => [...current, currentCard]);
      }
      setIndex((current) => current + 1);
    });
    if (rating !== "again" && index + 1 >= queue.length) await onStudyActivity?.();
  }, [advanceAfterFlip, currentCard, index, locked, onStudyActivity, onUpdateCard, queue.length, results]);

  const goPrevious = useCallback(async () => {
    if (locked || index === 0 || !history.length) return;
    const record = history[history.length - 1];
    const restore = onUpdateCard(record.cardId, record.previousSrs);
    setHistory((current) => current.slice(0, -1));
    setResults((current) => current.slice(0, -1));
    advanceAfterFlip(() => {
      if (record.repeated) setQueue((current) => current.slice(0, -1));
      setIndex((current) => current - 1);
    });
    await restore;
  }, [advanceAfterFlip, history, index, locked, onUpdateCard]);

  const handleTouchStart = (event) => {
    touchStartX.current = event.changedTouches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event) => {
    if (touchStartX.current === null) return;
    const distance = event.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (locked || Math.abs(distance) < 55) return;
    if (distance < 0 && index < queue.length - 1) {
      advanceAfterFlip(() => setIndex((current) => current + 1));
    } else if (distance > 0) {
      goPrevious();
    }
  };

  useEffect(() => {
    const onKeyDown = (event) => {
      if (isComplete || locked) return;
      if (event.code === "Space") {
        event.preventDefault();
        setFlipped((value) => !value);
      }
      if (event.key === "ArrowLeft" || event.key === "Backspace" || event.key.toLowerCase() === "z") {
        event.preventDefault();
        goPrevious();
        return;
      }
      if (flipped && ["1", "2", "3"].includes(event.key)) {
        event.preventDefault();
        rateCard({ 1: "again", 2: "soon", 3: "mastered" }[event.key]);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [flipped, goPrevious, isComplete, locked, rateCard]);

  if (isComplete) {
    const mastered = results.filter((result) => result === "mastered").length;
    return (
      <div className="fixed inset-0 z-[80] overflow-y-auto bg-mist p-5 text-ink dark:bg-dark1 dark:text-white sm:p-10">
        <div className="mx-auto flex min-h-full max-w-xl items-center justify-center">
          <section className="panel w-full p-8 text-center">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-lime text-ink"><Check size={30} /></div>
            <p className="eyebrow mt-5">Hoàn thành phiên</p>
            <h2 className="mt-2 font-display text-3xl font-bold">Hoàn thành lượt ôn tập</h2>
            <p className="mt-2 text-sm text-ink/50 dark:text-white/50">{deck.title}</p>
            <div className="mt-8 grid grid-cols-3 gap-3"><div className="rounded-xl bg-mist p-4 dark:bg-[#29332f]"><p className="font-display text-2xl font-bold">{results.length}</p><p className="text-xs text-ink/45 dark:text-white/45">Đã ôn</p></div><div className="rounded-xl bg-[#e6f3e8] p-4 dark:bg-[#293f31]"><p className="font-display text-2xl font-bold text-[#568460]">{mastered}</p><p className="text-xs text-ink/45 dark:text-white/45">Đã thuộc</p></div><div className="rounded-xl bg-lime p-4 text-ink"><p className="font-display text-2xl font-bold">{results.length ? Math.round((mastered / results.length) * 100) : 0}%</p><p className="text-xs text-ink/60">Tỷ lệ nhớ</p></div></div>
            <p className="mt-6 text-sm text-ink/55 dark:text-white/55">Streak hiện tại: <strong>{streak?.currentStreak || 0} ngày</strong></p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2"><button onClick={goPrevious} disabled={!history.length} className="flex items-center justify-center gap-1 rounded-xl border border-ink/10 py-3 text-sm font-bold text-ink/60 disabled:cursor-not-allowed disabled:opacity-30 dark:border-white/10 dark:text-white/60"><ChevronLeft size={16} />Thẻ trước</button><button onClick={onClose} className="rounded-xl bg-ink py-3 text-sm font-bold text-white dark:bg-lime dark:text-ink">Về thư viện</button></div>
          </section>
        </div>
      </div>
    );
  }

  if (!currentCard) return null;
  const example = currentCard.example || "Chưa có câu ví dụ.";
  const intervals = previewIntervals(currentCard);
  return (
    <div className="fixed inset-0 z-[80] overflow-y-auto bg-mist p-4 text-ink dark:bg-dark1 dark:text-white sm:p-8">
      <div className="mx-auto max-w-3xl">
        <header className="flex items-center justify-between gap-4"><div><p className="eyebrow">Thẻ ghi nhớ · {deck.title}</p><p className="mt-1 text-sm font-bold">Thẻ {Math.min(index + 1, queue.length)}/{queue.length}</p></div><div className="flex items-center gap-2"><button onClick={goPrevious} disabled={index === 0 || !history.length} className="flex items-center gap-1 rounded-xl border border-ink/10 px-3 py-2 text-xs font-bold text-ink/60 disabled:cursor-not-allowed disabled:opacity-30 dark:border-white/10 dark:text-white/60" aria-label="Thẻ trước"><ChevronLeft size={16} />Thẻ trước</button><button onClick={onClose} className="icon-btn border border-ink/10 dark:border-white/15" aria-label="Thoát học"><X size={19} /></button></div></header>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-ink/10 dark:bg-white/10"><div className="h-full rounded-full bg-sage transition-all duration-500" style={{ width: `${progress}%` }} /></div>
        <div className="mt-6 [perspective:1200px] sm:mt-10"><div role="button" tabIndex={0} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd} onClick={() => !locked && setFlipped((value) => !value)} onKeyDown={(event) => event.key === "Enter" && !locked && setFlipped((value) => !value)} className={`relative min-h-[360px] w-full touch-pan-y [transform-style:preserve-3d] transition-transform duration-500 sm:min-h-[390px] ${flipped ? "[transform:rotateY(180deg)]" : ""} ${locked ? "pointer-events-none" : ""}`} aria-label="Lật flashcard">
          <div className="panel absolute inset-0 flex flex-col items-center justify-center p-8 [backface-visibility:hidden]"><p className="eyebrow">Mặt trước</p>{currentCard.imageUrl && !imageError && <img src={currentCard.imageUrl} alt={currentCard.word} className="mt-4 h-36 w-48 rounded-xl border border-zinc-200 object-contain" onError={() => setImageError(true)} />}<p className={`${currentCard.imageUrl && !imageError ? "mt-7" : "mt-2"} font-display text-5xl font-bold sm:text-7xl`}>{currentCard.word}</p><button onClick={(event) => { event.stopPropagation(); speak(currentCard.word, `${currentCard.id}-word`); }} className={`mt-8 flex items-center gap-2 rounded-xl bg-lime px-4 py-3 text-sm font-bold text-ink ${speaking === `${currentCard.id}-word` ? "animate-pulse" : ""}`}><Volume2 size={17} />Phát âm</button><p className="mt-8 text-xs text-ink/40 dark:text-white/40">Bấm Space hoặc click để xem nghĩa</p></div>
          <div className="panel absolute inset-0 flex [transform:rotateY(180deg)] flex-col items-center justify-center p-8 text-center [backface-visibility:hidden]"><p className="eyebrow">Mặt sau</p>{currentCard.imageUrl && !imageError && <img src={currentCard.imageUrl} alt={currentCard.word} className="mt-3 h-24 w-32 rounded-lg border border-zinc-200 object-contain" onError={() => setImageError(true)} />}<p className={`${currentCard.imageUrl && !imageError ? "mt-5" : "mt-2"} text-lg text-sage`}>{currentCard.ipa || "Chưa có IPA"}</p><p className="mt-2 font-display text-3xl font-bold">{currentCard.meaning}</p><button onClick={(event) => { event.stopPropagation(); speak(example, `${currentCard.id}-example`); }} className={`mt-7 flex max-w-lg items-start gap-2 rounded-xl bg-ink/[0.06] p-4 text-left text-sm leading-6 dark:bg-white/10 ${speaking === `${currentCard.id}-example` ? "text-sage" : ""}`}><Volume2 size={17} className="mt-1 shrink-0" />{example}</button><p className="mt-5 text-xs text-ink/40 dark:text-white/40">Nhấn số 1, 2 hoặc 3 để đánh giá</p></div>
        </div></div>
        <div className="mt-6 grid grid-cols-1 gap-3 sm:mt-8 sm:grid-cols-3"><button disabled={!flipped} onClick={() => rateCard("again")} className="min-h-14 w-full rounded-xl border-2 border-orange-300 bg-orange-50 px-4 py-3 text-left text-sm font-bold text-orange-700 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-orange-950/20"><span className="block text-xs opacity-70">1 · Chưa nhớ</span>{intervalLabel(intervals.again)}</button><button disabled={!flipped} onClick={() => rateCard("soon")} className="min-h-14 w-full rounded-xl border-2 border-amber-300 bg-amber-50 px-4 py-3 text-left text-sm font-bold text-amber-700 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-amber-950/20"><span className="block text-xs opacity-70">2 · Nhớ vừa</span>{intervalLabel(intervals.soon)}</button><button disabled={!flipped} onClick={() => rateCard("mastered")} className="min-h-14 w-full rounded-xl border-2 border-emerald-300 bg-emerald-50 px-4 py-3 text-left text-sm font-bold text-emerald-700 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-emerald-950/20"><span className="block text-xs opacity-70">3 · Đã thuộc</span>{intervalLabel(intervals.mastered)}</button></div>
        <p className="mt-5 flex items-center justify-center gap-2 text-xs text-ink/40 dark:text-white/40"><RotateCcw size={13} /> Thẻ chưa nhớ sẽ quay lại cuối hàng đợi</p>
      </div>
    </div>
  );
}
