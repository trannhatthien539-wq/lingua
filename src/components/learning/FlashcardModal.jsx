import { useCallback, useEffect, useRef, useState } from "react";
import {
  Check,
  ChevronLeft,
  Volume2,
  X,
  RotateCcw,
  Sparkles,
  Inbox,
  ArrowRight,
  Flame,
} from "lucide-react";
import { speakText, stopSpeech } from "../../utils/speech";
import { intervalLabel, previewIntervals, schedulePayload } from "../../utils/srs";
import { celebrateStudyCompletion, playStudySound } from "../../utils/studyFeedback";

// Thời gian khớp với transition xoay 3D (ms) để tráo nội dung đúng nhịp
const FLIP_DURATION_MS = 450;

/**
 * FlashcardModal - Trình ôn tập thẻ ghi nhớ SRS chuẩn EdTech cao cấp
 * Hỗ trợ: Lật thẻ 3D vật lý, phản hồi âm thanh Web Audio, phím tắt toàn diện,
 * vuốt cảm ứng đa điểm, và xử lý triệt để các edge-case (rỗng, lỗi ảnh, âm thanh).
 */
export default function FlashcardModal({
  deck = {},
  cards = [],
  onClose,
  onUpdateCard,
  onStudyActivity,
  streak,
}) {
  // 1. Quản lý hàng đợi thẻ (Queue) & Vòng đời học tập
  const [queue, setQueue] = useState(() => (Array.isArray(cards) ? cards.map((c) => ({ ...c })) : []));
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

  const totalCards = queue.length;
  const isComplete = totalCards > 0 && index >= totalCards;
  const progressPercent = totalCards ? Math.min(100, Math.round((index / totalCards) * 100)) : 0;

  // Dọn dẹp âm thanh & timer khi component unmount
  useEffect(() => {
    return () => {
      stopSpeech();
      if (flipTimer.current) window.clearTimeout(flipTimer.current);
    };
  }, []);

  // Reset cờ lỗi ảnh mỗi khi chuyển sang thẻ mới
  useEffect(() => {
    setImageError(false);
  }, [currentCard?.id, currentCard?.imageUrl]);

  // Kích hoạt hiệu ứng ăn mừng khi hoàn thành toàn bộ hàng đợi
  useEffect(() => {
    if (isComplete && results.length > 0) {
      celebrateStudyCompletion();
    }
  }, [isComplete, results.length]);

  // Phát âm chuẩn bản ngữ cho từ hoặc câu ví dụ
  const handleSpeak = (text, targetId) => {
    if (!text?.trim()) return;
    setSpeaking(targetId);
    speakText(text, {
      onEnd: () => setSpeaking(""),
    });
  };

  // Cơ chế tráo nội dung sau khi lật úp để không lộ đáp án thẻ sau
  const advanceAfterFlip = useCallback(
    (swapCallback) => {
      if (flipTimer.current) window.clearTimeout(flipTimer.current);

      if (!flipped) {
        swapCallback();
        setImageError(false);
        return;
      }

      setLocked(true);
      setFlipped(false);
      flipTimer.current = window.setTimeout(() => {
        flipTimer.current = null;
        swapCallback();
        setImageError(false);
        setLocked(false);
      }, FLIP_DURATION_MS);
    },
    [flipped]
  );

  // Đánh giá thẻ theo thuật toán Spaced Repetition (SRS)
  const rateCard = useCallback(
    async (rating) => {
      if (!currentCard || locked) return;

      // Phản hồi âm thanh theo kết quả đánh giá
      if (rating === "mastered") {
        playStudySound("correct");
      } else if (rating === "again") {
        playStudySound("wrong");
      } else {
        playStudySound("hint");
      }

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
      const payload = schedulePayload(currentCard, rating);

      // Lưu cập nhật tiến độ
      await onUpdateCard?.(currentCard.id, payload);

      setHistory((curr) => [
        ...curr,
        {
          cardId: currentCard.id,
          previousSrs,
          rating,
          repeated: rating === "again",
        },
      ]);
      setResults(nextResults);

      advanceAfterFlip(() => {
        // Nếu chọn "Chưa nhớ", thẻ sẽ được đẩy lại cuối hàng đợi để ôn tiếp
        if (rating === "again") {
          setQueue((curr) => [...curr, currentCard]);
        }
        setIndex((curr) => curr + 1);
      });

      // Ghi nhận hoạt động học tập vào chuỗi Streak
      if (rating !== "again" && index + 1 >= queue.length) {
        await onStudyActivity?.();
      }
    },
    [advanceAfterFlip, currentCard, index, locked, onStudyActivity, onUpdateCard, queue.length, results]
  );

  // Khôi phục thẻ vừa học (Undo / Quay lại thẻ trước)
  const goPrevious = useCallback(async () => {
    if (locked || index === 0 || !history.length) return;
    const lastRecord = history[history.length - 1];
    const restorePromise = onUpdateCard?.(lastRecord.cardId, lastRecord.previousSrs);

    setHistory((curr) => curr.slice(0, -1));
    setResults((curr) => curr.slice(0, -1));

    advanceAfterFlip(() => {
      if (lastRecord.repeated) {
        setQueue((curr) => curr.slice(0, -1));
      }
      setIndex((curr) => curr - 1);
    });

    await restorePromise;
  }, [advanceAfterFlip, history, index, locked, onUpdateCard]);

  // Cử chỉ vuốt trên màn hình cảm ứng di động
  const handleTouchStart = (event) => {
    touchStartX.current = event.changedTouches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event) => {
    if (touchStartX.current === null) return;
    const distance = event.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (locked || Math.abs(distance) < 50) return;

    if (distance > 0) {
      goPrevious();
    } else if (distance < 0 && index < queue.length - 1) {
      advanceAfterFlip(() => setIndex((curr) => curr + 1));
    }
  };

  // Hệ thống phím tắt bàn phím chuẩn EdTech
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose?.();
        return;
      }
      if (isComplete || locked) return;

      if (event.code === "Space") {
        event.preventDefault();
        setFlipped((val) => !val);
      } else if (event.key === "ArrowLeft" || event.key === "Backspace" || event.key.toLowerCase() === "z") {
        event.preventDefault();
        goPrevious();
      } else if (flipped && ["1", "2", "3"].includes(event.key)) {
        event.preventDefault();
        const ratingMap = { "1": "again", "2": "soon", "3": "mastered" };
        rateCard(ratingMap[event.key]);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [flipped, goPrevious, isComplete, locked, onClose, rateCard]);

  // 2. EDGE CASE 1: Bộ thẻ rỗng (Empty State)
  if (!cards || cards.length === 0) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-md">
        <section className="relative w-full max-w-md rounded-3xl border border-white/15 bg-white/95 p-7 text-center shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/95">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-amber-500/10 text-amber-500 ring-8 ring-amber-500/5 dark:bg-amber-400/10 dark:text-amber-400">
            <Inbox size={28} />
          </div>
          <h3 className="mt-4 font-display text-xl font-bold text-slate-900 dark:text-white">
            Bộ thẻ này đang trống
          </h3>
          <p className="mt-2 text-xs leading-5 text-slate-500 dark:text-slate-400">
            Hiện chưa có từ vựng nào trong danh sách. Hãy thêm từ mới hoặc chọn bộ từ khác để bắt đầu học.
          </p>
          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-slate-800 active:scale-95 dark:bg-emerald-500 dark:text-slate-950 dark:hover:bg-emerald-400"
            >
              Quay lại thư viện
            </button>
          </div>
        </section>
      </div>
    );
  }

  // 3. MÀN HÌNH HOÀN THÀNH PHIÊN HỌC (Completion Screen)
  if (isComplete) {
    const masteredCount = results.filter((r) => r === "mastered").length;
    const accuracyRate = results.length ? Math.round((masteredCount / results.length) * 100) : 0;

    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-slate-950/80 p-4 backdrop-blur-md sm:p-6">
        <section className="relative w-full max-w-lg rounded-3xl border border-white/20 bg-white/95 p-7 text-center shadow-2xl backdrop-blur-2xl dark:border-white/10 dark:bg-slate-900/95 sm:p-9">
          {/* Huy hiệu chiến thắng */}
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-3xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white shadow-lg shadow-emerald-500/30 ring-8 ring-emerald-500/10">
            <Check size={36} strokeWidth={2.5} />
          </div>

          <div className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
            <Sparkles size={13} />
            <span>XUẤT SẮC HOÀN THÀNH</span>
          </div>

          <h2 className="mt-2 font-display text-2xl font-black text-slate-900 sm:text-3xl dark:text-white">
            Hoàn thành phiên ôn tập!
          </h2>
          <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">
            {deck?.title || "Bộ thẻ ghi nhớ"}
          </p>

          {/* Khối thống kê kết quả */}
          <div className="mt-6 grid grid-cols-3 gap-3">
            <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 backdrop-blur-xs dark:border-white/5 dark:bg-white/[0.03]">
              <p className="font-display text-2xl font-black text-slate-900 dark:text-white">
                {results.length}
              </p>
              <p className="mt-0.5 text-[11px] font-medium text-slate-400">Lượt đã ôn</p>
            </div>
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.06] p-4 dark:bg-emerald-500/10">
              <p className="font-display text-2xl font-black text-emerald-600 dark:text-emerald-400">
                {masteredCount}
              </p>
              <p className="mt-0.5 text-[11px] font-medium text-emerald-700/70 dark:text-emerald-400/70">
                Đã thuộc
              </p>
            </div>
            <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/[0.06] p-4 dark:bg-indigo-500/10">
              <p className="font-display text-2xl font-black text-indigo-600 dark:text-indigo-400">
                {accuracyRate}%
              </p>
              <p className="mt-0.5 text-[11px] font-medium text-indigo-700/70 dark:text-indigo-400/70">
                Tỷ lệ nhớ
              </p>
            </div>
          </div>

          {/* Chuỗi ngày học Streak */}
          <div className="mt-5 flex items-center justify-center gap-2 rounded-2xl border border-amber-500/20 bg-amber-500/[0.05] py-2.5 px-4 text-xs font-bold text-amber-700 dark:text-amber-400">
            <Flame size={16} className="text-amber-500" />
            <span>Chuỗi ngày học: {streak?.currentStreak || 1} ngày liên tiếp</span>
          </div>

          {/* Các nút hành động */}
          <div className="mt-7 grid grid-cols-2 gap-3">
            <button
              type="button"
              disabled={!history.length}
              onClick={goPrevious}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white py-3 text-xs font-bold text-slate-700 shadow-2xs transition hover:bg-slate-50 disabled:opacity-40 dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-300 dark:hover:bg-white/10"
            >
              <ChevronLeft size={16} /> Xem lại thẻ trước
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 py-3 text-xs font-bold text-white shadow-md shadow-emerald-500/25 transition hover:brightness-110 active:scale-98"
            >
              Về thư viện <ArrowRight size={15} />
            </button>
          </div>
        </section>
      </div>
    );
  }

  // 4. TRẠNG THÁI HIỂN THỊ THẺ HIỆN TẠI (Active Flashcard Workspace)
  if (!currentCard) return null;

  const exampleText = currentCard.example || "Chưa có câu ví dụ.";
  const intervals = previewIntervals(currentCard);

  return (
    <div className="fixed inset-0 z-[90] flex flex-col justify-between overflow-y-auto bg-slate-950/85 p-4 text-slate-900 backdrop-blur-xl dark:text-white sm:p-7">
      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-between">
        {/* Header điều hướng & Phím tắt */}
        <header className="flex items-center justify-between gap-4 border-b border-white/10 pb-3.5">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-md border border-white/20 bg-white/10 px-2 py-0.5 font-mono text-[10px] font-bold tracking-wider text-slate-300">
                {currentCard.level || "B1"}
              </span>
              <p className="truncate text-xs font-semibold text-slate-300 sm:text-sm">
                {deck?.title || "Ôn tập từ vựng"}
              </p>
            </div>
            <p className="mt-1 text-xs font-bold text-emerald-400">
              Thẻ {Math.min(index + 1, totalCards)} / {totalCards}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={index === 0 || !history.length}
              onClick={goPrevious}
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-xs font-bold text-slate-200 backdrop-blur-md transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-30"
              title="Quay lại thẻ trước (Phím Z hoặc phím Mũi tên trái)"
            >
              <ChevronLeft size={15} />
              <span className="hidden sm:inline">Thẻ trước</span>
              <kbd className="hidden rounded bg-black/30 px-1 py-0.5 font-mono text-[10px] sm:inline-block">
                Z
              </kbd>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="grid h-10 w-10 place-items-center rounded-xl border border-white/15 bg-white/10 text-slate-300 transition hover:bg-white/20 hover:text-white"
              title="Đóng phiên học (Esc)"
              aria-label="Đóng"
            >
              <X size={18} />
            </button>
          </div>
        </header>

        {/* Thanh tiến độ học tập đa sắc */}
        <div className="mt-3.5 h-2 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-400 shadow-sm transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* 5. KHỐI THẺ 3D LẬT VẬT LÝ (3D Perspective Card) */}
        <div className="my-auto py-5 [perspective:1400px]">
          <div
            role="button"
            tabIndex={0}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onClick={() => !locked && setFlipped((v) => !v)}
            onKeyDown={(e) => e.key === "Enter" && !locked && setFlipped((v) => !v)}
            className={`relative min-h-[360px] w-full cursor-pointer touch-pan-y [transform-style:preserve-3d] transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] sm:min-h-[400px] ${
              flipped ? "[transform:rotateY(180deg)]" : ""
            } ${locked ? "pointer-events-none" : ""}`}
            aria-label="Lật thẻ ghi nhớ"
          >
            {/* MẶT TRƯỚC (Front Face) */}
            <div className="absolute inset-0 flex flex-col items-center justify-between rounded-3xl border border-white/20 bg-white/95 p-8 text-center shadow-2xl backdrop-blur-2xl [backface-visibility:hidden] dark:border-white/10 dark:bg-slate-900/95 sm:p-10">
              <div className="flex w-full items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <span>Mặt trước</span>
                <span>Chạm để lật</span>
              </div>

              <div className="my-auto flex flex-col items-center">
                {currentCard.imageUrl && !imageError && (
                  <img
                    src={currentCard.imageUrl}
                    alt={currentCard.word}
                    className="mb-4 h-32 w-44 rounded-2xl border border-slate-200/80 object-contain shadow-xs dark:border-white/10"
                    onError={() => setImageError(true)}
                  />
                )}

                <h1 className="font-display text-5xl font-black tracking-tight text-slate-900 sm:text-7xl dark:text-white">
                  {currentCard.word}
                </h1>

                {/* Nút phát âm âm thanh */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSpeak(currentCard.word, `${currentCard.id}-word`);
                  }}
                  className={`mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-bold text-slate-950 shadow-md shadow-emerald-500/20 transition hover:bg-emerald-400 active:scale-95 ${
                    speaking === `${currentCard.id}-word` ? "animate-pulse ring-4 ring-emerald-500/30" : ""
                  }`}
                >
                  <Volume2 size={16} />
                  <span>Phát âm</span>
                </button>
              </div>

              <p className="text-xs text-slate-400">
                Bấm phím{" "}
                <kbd className="rounded border border-slate-300 bg-slate-100 px-1.5 py-0.5 font-mono text-[11px] font-bold text-slate-700 dark:border-white/20 dark:bg-white/10 dark:text-slate-300">
                  Space
                </kbd>{" "}
                hoặc click vào thẻ để xem nghĩa
              </p>
            </div>

            {/* MẶT SAU (Back Face) */}
            <div className="absolute inset-0 flex [transform:rotateY(180deg)] flex-col items-center justify-between rounded-3xl border border-white/20 bg-white/95 p-8 text-center shadow-2xl backdrop-blur-2xl [backface-visibility:hidden] dark:border-white/10 dark:bg-slate-900/95 sm:p-10">
              <div className="flex w-full items-center justify-between text-[11px] font-bold uppercase tracking-wider text-emerald-500">
                <span>Mặt sau</span>
                <span>Nghĩa &amp; Ví dụ</span>
              </div>

              <div className="my-auto flex flex-col items-center max-w-xl">
                {currentCard.ipa && (
                  <span className="font-mono text-base font-semibold text-emerald-600 dark:text-emerald-400 sm:text-lg">
                    {currentCard.ipa}
                  </span>
                )}

                <h2 className="mt-2 font-display text-3xl font-black text-slate-900 sm:text-4xl dark:text-white">
                  {currentCard.meaning}
                </h2>

                {/* Câu ví dụ kèm phát âm */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSpeak(exampleText, `${currentCard.id}-example`);
                  }}
                  className={`mt-5 flex items-start gap-3 rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 text-left text-xs leading-6 text-slate-700 shadow-2xs transition hover:border-emerald-500/40 hover:bg-white dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300 dark:hover:bg-white/10 sm:text-sm ${
                    speaking === `${currentCard.id}-example` ? "border-emerald-500 ring-2 ring-emerald-500/20" : ""
                  }`}
                >
                  <Volume2 size={17} className="mt-0.5 shrink-0 text-emerald-500" />
                  <span className="flex-1 italic">“{exampleText}”</span>
                </button>
              </div>

              <p className="text-xs text-slate-400">
                Nhấn phím{" "}
                <kbd className="rounded border border-slate-300 bg-slate-100 px-1.5 py-0.5 font-mono text-[11px] font-bold text-slate-700 dark:border-white/20 dark:bg-white/10 dark:text-slate-300">
                  1
                </kbd>
                ,{" "}
                <kbd className="rounded border border-slate-300 bg-slate-100 px-1.5 py-0.5 font-mono text-[11px] font-bold text-slate-700 dark:border-white/20 dark:bg-white/10 dark:text-slate-300">
                  2
                </kbd>
                ,{" "}
                <kbd className="rounded border border-slate-300 bg-slate-100 px-1.5 py-0.5 font-mono text-[11px] font-bold text-slate-700 dark:border-white/20 dark:bg-white/10 dark:text-slate-300">
                  3
                </kbd>{" "}
                để đánh giá tốc độ nhớ
              </p>
            </div>
          </div>
        </div>

        {/* 6. BỘ 3 NÚT ĐÁNH GIÁ SRS (Action Rating Bar) */}
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3 sm:gap-3.5">
          {/* Nút 1: Chưa nhớ */}
          <button
            type="button"
            disabled={!flipped}
            onClick={() => rateCard("again")}
            className="group relative flex min-h-[58px] flex-col justify-center rounded-2xl border-2 border-orange-400/40 bg-orange-500/10 px-4 py-2.5 text-left transition hover:border-orange-500 hover:bg-orange-500/20 active:scale-98 disabled:cursor-not-allowed disabled:opacity-40 dark:border-orange-500/30 dark:bg-orange-500/10"
          >
            <div className="flex items-center justify-between text-xs font-bold text-orange-600 dark:text-orange-400">
              <span>1 · Chưa nhớ</span>
              <kbd className="rounded bg-orange-500/20 px-1.5 py-0.5 font-mono text-[10px] text-orange-700 dark:text-orange-300">
                1
              </kbd>
            </div>
            <span className="mt-0.5 text-[11px] font-semibold text-orange-600/80 dark:text-orange-400/80">
              Ôn lại {intervalLabel(intervals.again)}
            </span>
          </button>

          {/* Nút 2: Nhớ vừa */}
          <button
            type="button"
            disabled={!flipped}
            onClick={() => rateCard("soon")}
            className="group relative flex min-h-[58px] flex-col justify-center rounded-2xl border-2 border-amber-400/40 bg-amber-500/10 px-4 py-2.5 text-left transition hover:border-amber-500 hover:bg-amber-500/20 active:scale-98 disabled:cursor-not-allowed disabled:opacity-40 dark:border-amber-500/30 dark:bg-amber-500/10"
          >
            <div className="flex items-center justify-between text-xs font-bold text-amber-600 dark:text-amber-400">
              <span>2 · Nhớ vừa</span>
              <kbd className="rounded bg-amber-500/20 px-1.5 py-0.5 font-mono text-[10px] text-amber-700 dark:text-amber-300">
                2
              </kbd>
            </div>
            <span className="mt-0.5 text-[11px] font-semibold text-amber-600/80 dark:text-amber-400/80">
              Gặp lại {intervalLabel(intervals.soon)}
            </span>
          </button>

          {/* Nút 3: Đã thuộc */}
          <button
            type="button"
            disabled={!flipped}
            onClick={() => rateCard("mastered")}
            className="group relative flex min-h-[58px] flex-col justify-center rounded-2xl border-2 border-emerald-400/40 bg-emerald-500/10 px-4 py-2.5 text-left transition hover:border-emerald-500 hover:bg-emerald-500/20 active:scale-98 disabled:cursor-not-allowed disabled:opacity-40 dark:border-emerald-500/30 dark:bg-emerald-500/10"
          >
            <div className="flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <span>3 · Đã thuộc</span>
              <kbd className="rounded bg-emerald-500/20 px-1.5 py-0.5 font-mono text-[10px] text-emerald-700 dark:text-emerald-300">
                3
              </kbd>
            </div>
            <span className="mt-0.5 text-[11px] font-semibold text-emerald-600/80 dark:text-emerald-400/80">
              Lặp lại {intervalLabel(intervals.mastered)}
            </span>
          </button>
        </div>

        {/* Chú thích thông minh */}
        <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-[11px] text-slate-400">
          <RotateCcw size={12} />
          <span>Thẻ đánh dấu "Chưa nhớ" sẽ tự động quay lại cuối hàng đợi trong phiên học này.</span>
        </p>
      </div>
    </div>
  );
}
