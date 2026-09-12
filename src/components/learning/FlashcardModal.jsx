import { useEffect, useRef, useState } from "react";
import { Check, ChevronLeft, Volume2, X, RotateCcw } from "lucide-react";
import { speakText, stopSpeech } from "../../utils/speech";
import { addDaysKey, dateKey } from "../../utils/srs";

const REVIEW_DAYS = { again: 1, soon: 3, mastered: 5 };

export default function FlashcardModal({ deck, cards, onClose, onUpdateCard, onStudyActivity, streak }) {
  const [queue, setQueue] = useState(() => cards.map((card) => ({ ...card })));
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [results, setResults] = useState([]);
  const [history, setHistory] = useState([]);
  const [speaking, setSpeaking] = useState("");
  const [imageError, setImageError] = useState(false);
  const touchStartX = useRef(null);
  const currentCard = queue[index];
  const isComplete = index >= queue.length;
  const progress = queue.length ? Math.min(100, (index / queue.length) * 100) : 100;

  useEffect(() => () => stopSpeech(), []);
  useEffect(() => setImageError(false), [currentCard?.id, currentCard?.imageUrl]);

  const speak = (text, id) => {
    setSpeaking(id);
    speakText(text, { onEnd: () => setSpeaking("") });
  };

  const rateCard = async (rating) => {
    if (!currentCard) return;
    const previousSrs = {
      status: currentCard.status || "new",
      interval: Number(currentCard.interval) || 0,
      nextReviewDate: currentCard.nextReviewDate || null,
      repetition: Number(currentCard.repetition) || 0,
      reviewDate: currentCard.reviewDate || null,
    };
    const nextResults = [...results, rating];
    const interval = REVIEW_DAYS[rating];
    const nextReviewDate = addDaysKey(interval);
    await onUpdateCard(currentCard.id, {
      status: rating === "mastered" ? "mastered" : "learning",
      interval,
      nextReviewDate,
      repetition: rating === "again" ? 0 : Number(currentCard.repetition || 0) + 1,
      reviewDate: `${nextReviewDate}T00:00:00.000Z`,
      lastStudiedDate: dateKey(),
    });
    setHistory((current) => [...current, { cardId: currentCard.id, previousSrs, rating, repeated: rating === "again" }]);
    setResults(nextResults);
    setFlipped(false);
    setImageError(false);
    if (rating === "again") {
      setQueue((current) => [...current, currentCard]);
    }
    setIndex((current) => current + 1);
    if (rating !== "again" && index + 1 >= queue.length) await onStudyActivity?.();
  };

  const goPrevious = async () => {
    if (index === 0 || !history.length) return;
    const record = history[history.length - 1];
    await onUpdateCard(record.cardId, record.previousSrs);
    if (record.repeated) setQueue((current) => current.slice(0, -1));
    setHistory((current) => current.slice(0, -1));
    setResults((current) => current.slice(0, -1));
    setIndex((current) => current - 1);
    setFlipped(false);
    setImageError(false);
  };

  const handleTouchStart = (event) => {
    touchStartX.current = event.changedTouches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event) => {
    if (touchStartX.current === null) return;
    const distance = event.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(distance) < 55) return;
    if (distance < 0 && index < queue.length - 1) {
      setIndex((current) => current + 1);
      setFlipped(false);
      setImageError(false);
    } else if (distance > 0) {
      goPrevious();
    }
  };

  useEffect(() => {
    const onKeyDown = (event) => {
      if (isComplete) return;
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
  }, [flipped, index, isComplete, currentCard, queue.length, results, history]);

  if (isComplete) {
    const mastered = results.filter((result) => result === "mastered").length;
    return (
      <div className="fixed inset-0 z-[80] overflow-y-auto bg-[#f5f7f3] p-5 text-ink dark:bg-[#121715] dark:text-white sm:p-10">
        <div className="mx-auto flex min-h-full max-w-xl items-center justify-center">
          <section className="panel w-full p-8 text-center">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-lime text-ink"><Check size={30} /></div>
            <p className="eyebrow mt-5">Session complete</p>
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
  return (
    <div className="fixed inset-0 z-[80] overflow-y-auto bg-[#f5f7f3] p-4 text-ink dark:bg-[#121715] dark:text-white sm:p-8">
      <div className="mx-auto max-w-3xl">
        <header className="flex items-center justify-between gap-4"><div><p className="eyebrow">SRS Flashcard · {deck.title}</p><p className="mt-1 text-sm font-bold">Thẻ {Math.min(index + 1, queue.length)}/{queue.length}</p></div><div className="flex items-center gap-2"><button onClick={goPrevious} disabled={index === 0 || !history.length} className="flex items-center gap-1 rounded-xl border border-ink/10 px-3 py-2 text-xs font-bold text-ink/60 disabled:cursor-not-allowed disabled:opacity-30 dark:border-white/10 dark:text-white/60" aria-label="Thẻ trước"><ChevronLeft size={16} />Thẻ trước</button><button onClick={onClose} className="grid h-10 w-10 place-items-center rounded-xl border border-ink/10 dark:border-white/10" aria-label="Thoát học"><X size={19} /></button></div></header>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-ink/10 dark:bg-white/10"><div className="h-full rounded-full bg-sage transition-all duration-500" style={{ width: `${progress}%` }} /></div>
        <div className="mt-6 [perspective:1200px] sm:mt-10"><div role="button" tabIndex={0} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd} onClick={() => setFlipped((value) => !value)} onKeyDown={(event) => event.key === "Enter" && setFlipped((value) => !value)} className={`relative min-h-[360px] w-full touch-pan-y [transform-style:preserve-3d] transition-transform duration-500 sm:min-h-[390px] ${flipped ? "[transform:rotateY(180deg)]" : ""}`} aria-label="Lật flashcard">
          <div className="panel absolute inset-0 flex flex-col items-center justify-center p-8 [backface-visibility:hidden]"><p className="eyebrow">Mặt trước</p>{currentCard.imageUrl && !imageError && <img src={currentCard.imageUrl} alt={currentCard.word} className="mt-4 h-36 w-48 rounded-xl border border-zinc-200 object-contain" onError={() => setImageError(true)} />}<p className={`${currentCard.imageUrl && !imageError ? "mt-7" : "mt-2"} font-display text-5xl font-bold sm:text-7xl`}>{currentCard.word}</p><button onClick={(event) => { event.stopPropagation(); speak(currentCard.word, `${currentCard.id}-word`); }} className={`mt-8 flex items-center gap-2 rounded-xl bg-lime px-4 py-3 text-sm font-bold text-ink ${speaking === `${currentCard.id}-word` ? "animate-pulse" : ""}`}><Volume2 size={17} />Phát âm</button><p className="mt-8 text-xs text-ink/40 dark:text-white/40">Bấm Space hoặc click để xem nghĩa</p></div>
          <div className="panel absolute inset-0 flex [transform:rotateY(180deg)] flex-col items-center justify-center p-8 text-center [backface-visibility:hidden]"><p className="eyebrow">Mặt sau</p>{currentCard.imageUrl && !imageError && <img src={currentCard.imageUrl} alt={currentCard.word} className="mt-3 h-24 w-32 rounded-lg border border-zinc-200 object-contain" onError={() => setImageError(true)} />}<p className={`${currentCard.imageUrl && !imageError ? "mt-5" : "mt-2"} text-lg text-sage`}>{currentCard.ipa || "Chưa có IPA"}</p><p className="mt-2 font-display text-3xl font-bold">{currentCard.meaning}</p><button onClick={(event) => { event.stopPropagation(); speak(example, `${currentCard.id}-example`); }} className={`mt-7 flex max-w-lg items-start gap-2 rounded-xl bg-ink/[0.06] p-4 text-left text-sm leading-6 dark:bg-white/10 ${speaking === `${currentCard.id}-example` ? "text-sage" : ""}`}><Volume2 size={17} className="mt-1 shrink-0" />{example}</button><p className="mt-5 text-xs text-ink/40 dark:text-white/40">Nhấn số 1, 2 hoặc 3 để đánh giá</p></div>
        </div></div>
        <div className="mt-6 grid grid-cols-1 gap-3 sm:mt-8 sm:grid-cols-3"><button disabled={!flipped} onClick={() => rateCard("again")} className="min-h-14 w-full rounded-xl border-2 border-orange-300 bg-orange-50 px-4 py-3 text-left text-sm font-bold text-orange-700 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-orange-950/20"><span className="block text-xs opacity-70">1 · Chưa nhớ</span>Ôn lại ngày mai</button><button disabled={!flipped} onClick={() => rateCard("soon")} className="min-h-14 w-full rounded-xl border-2 border-amber-300 bg-amber-50 px-4 py-3 text-left text-sm font-bold text-amber-700 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-amber-950/20"><span className="block text-xs opacity-70">2 · Nhớ vừa</span>Ôn sau 3 ngày</button><button disabled={!flipped} onClick={() => rateCard("mastered")} className="min-h-14 w-full rounded-xl border-2 border-emerald-300 bg-emerald-50 px-4 py-3 text-left text-sm font-bold text-emerald-700 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-emerald-950/20"><span className="block text-xs opacity-70">3 · Đã thuộc</span>Ôn sau 5 ngày</button></div>
        <p className="mt-5 flex items-center justify-center gap-2 text-xs text-ink/40 dark:text-white/40"><RotateCcw size={13} /> Thẻ chưa nhớ sẽ quay lại cuối hàng đợi</p>
      </div>
    </div>
  );
}
