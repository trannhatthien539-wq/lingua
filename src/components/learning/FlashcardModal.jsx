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
import WordAvatar from "../WordAvatar";
import Dialog from "../ui/Dialog";
import { toast } from "../../services/toast";

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
  const sessionKey = deck?.id ? `lingua_flashcard_session_${deck.id}` : null;

  // Khôi phục phiên học dở dang từ sessionStorage (nếu người dùng lỡ tay F5)
  const [initialSession] = useState(() => {
    if (!sessionKey) return null;
    try {
      const saved = sessionStorage.getItem(sessionKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!parsed || !Array.isArray(parsed.queue) || typeof parsed.index !== "number") return null;
        // Phiên cũ không còn khớp bộ thẻ hiện tại (thẻ bị xoá/đổi bộ) → bỏ qua.
        const knownIds = new Set((cards || []).map((card) => card.id));
        if (knownIds.size && parsed.queue.some((card) => !knownIds.has(card.id))) return null;
        if (parsed.index < 0 || parsed.index > parsed.queue.length) return null;
        return {
          ...parsed,
          queue: parsed.queue,
          results: Array.isArray(parsed.results) ? parsed.results : [],
          history: Array.isArray(parsed.history) ? parsed.history : [],
        };
      }
    } catch {
      // Ignored
    }
    return null;
  });

  // 1. Quản lý hàng đợi thẻ (Queue) & Vòng đời học tập
  const [queue, setQueue] = useState(() => {
    if (initialSession?.queue?.length) return initialSession.queue;
    return Array.isArray(cards) ? cards.map((c) => ({ ...c })) : [];
  });
  const [index, setIndex] = useState(() => initialSession?.index || 0);
  const [flipped, setFlipped] = useState(false);
  const [locked, setLocked] = useState(false);
  const [results, setResults] = useState(() => initialSession?.results || []);
  const [history, setHistory] = useState(() => initialSession?.history || []);
  const [speaking, setSpeaking] = useState("");
  const [imageError, setImageError] = useState(false);

  const touchStartX = useRef(null);
  const flipTimer = useRef(null);
  const flipButtonRef = useRef(null);
  const saveWarningRef = useRef(false);
  const currentCard = queue[index];

  const totalCards = queue.length;
  const isComplete = totalCards > 0 && index >= totalCards;
  const progressPercent = totalCards ? Math.min(100, Math.round((index / totalCards) * 100)) : 0;

  // Bộ thẻ có thể được tải bất đồng bộ (Firestore/IndexedDB): nạp hàng đợi khi dữ liệu về muộn
  // để không rơi vào màn hình trắng vì `currentCard` chưa tồn tại.
  useEffect(() => {
    if (!Array.isArray(cards) || cards.length === 0) return;
    setQueue((current) => (current.length ? current : cards.map((card) => ({ ...card }))));
  }, [cards]);

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

  // Lưu tiến độ phiên học vào sessionStorage để tránh mất dữ liệu khi vô tình F5
  useEffect(() => {
    if (!sessionKey || isComplete) return;
    try {
      sessionStorage.setItem(
        sessionKey,
        JSON.stringify({ queue, index, results, history })
      );
    } catch {
      // Bỏ qua nếu storage đầy
    }
  }, [sessionKey, isComplete, queue, index, results, history]);

  // Xoá bản nháp khi đã hoàn thành phiên học
  useEffect(() => {
    if (isComplete && sessionKey) {
      try {
        sessionStorage.removeItem(sessionKey);
      } catch {
        // Ignored
      }
    }
  }, [isComplete, sessionKey]);

  // Phát âm chuẩn bản ngữ cho từ hoặc câu ví dụ với cơ chế bắt lỗi an toàn
  const handleSpeak = useCallback((text, targetId) => {
    if (!text?.trim()) return;
    stopSpeech();
    setSpeaking(targetId);
    try {
      speakText(text, {
        onEnd: () => setSpeaking(""),
        onError: () => {
          setSpeaking("");
          toast.warning("Không thể phát âm thanh. Vui lòng kiểm tra thiết bị phát âm.");
        },
      });
    } catch {
      setSpeaking("");
      toast.warning("Không thể phát âm thanh trên trình duyệt.");
    }
  }, []);

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

  /** Chỉ báo một lần cho cả phiên để không spam toast khi đang offline. */
  const warnSaveFailure = useCallback(() => {
    if (saveWarningRef.current) return;
    saveWarningRef.current = true;
    toast.warning("Chưa lưu được tiến độ lên máy chủ. Bạn vẫn học tiếp bình thường, dữ liệu sẽ đồng bộ khi có mạng.");
  }, []);

  const persistCard = useCallback(
    (cardId, payload) => {
      let result;
      try {
        result = onUpdateCard?.(cardId, payload);
      } catch {
        warnSaveFailure();
        return;
      }
      Promise.resolve(result).then(
        () => {
          saveWarningRef.current = false;
        },
        warnSaveFailure,
      );
    },
    [onUpdateCard, warnSaveFailure],
  );

  // Đánh giá thẻ theo thuật toán Spaced Repetition (SRS).
  // Cập nhật giao diện NGAY (optimistic) rồi lưu nền — mất mạng không làm kẹt phiên học.
  const rateCard = useCallback(
    (rating) => {
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
      const card = currentCard;
      const payload = schedulePayload(card, rating);

      setHistory((curr) => [
        ...curr,
        {
          cardId: card.id,
          previousSrs,
          rating,
          repeated: rating === "again",
        },
      ]);
      setResults((curr) => [...curr, rating]);

      advanceAfterFlip(() => {
        // Nếu chọn "Chưa nhớ", thẻ sẽ được đẩy lại cuối hàng đợi để ôn tiếp
        if (rating === "again") {
          setQueue((curr) => [...curr, card]);
        }
        setIndex((curr) => curr + 1);
      });

      persistCard(card.id, payload);

      // Ghi nhận hoạt động học tập vào chuỗi Streak
      if (rating !== "again" && index + 1 >= queue.length) {
        Promise.resolve(onStudyActivity?.()).catch(() => {});
      }
    },
    [advanceAfterFlip, currentCard, index, locked, onStudyActivity, persistCard, queue.length]
  );

  // Khôi phục thẻ vừa học (Undo / Quay lại thẻ trước)
  const goPrevious = useCallback(() => {
    if (locked || index === 0 || !history.length) return;
    const lastRecord = history[history.length - 1];

    setHistory((curr) => curr.slice(0, -1));
    setResults((curr) => curr.slice(0, -1));

    advanceAfterFlip(() => {
      if (lastRecord.repeated) {
        setQueue((curr) => curr.slice(0, -1));
      }
      setIndex((curr) => curr - 1);
    });

    persistCard(lastRecord.cardId, lastRecord.previousSrs);
  }, [advanceAfterFlip, history, index, locked, persistCard]);

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

  // Hệ thống phím tắt bàn phím chuẩn EdTech.
  // - Esc do <Dialog> đảm nhiệm (kèm focus trap).
  // - Không cướp phím khi người dùng đang gõ hoặc đang focus vào nút (Space/Enter vẫn kích hoạt nút).
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.defaultPrevented || event.ctrlKey || event.metaKey || event.altKey) return;
      const target = event.target;
      const tag = target?.tagName;
      if (target?.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(tag)) return;
      if (isComplete || locked) return;

      const onControl = Boolean(target?.closest?.("button, a, [role='button']"));
      const key = event.key.toLowerCase();

      if (event.code === "Space" && !onControl) {
        event.preventDefault();
        setFlipped((value) => !value);
      } else if (!onControl && (event.key === "ArrowLeft" || event.key === "Backspace" || key === "z")) {
        event.preventDefault();
        goPrevious();
      } else if (flipped && ["1", "2", "3"].includes(event.key)) {
        event.preventDefault();
        rateCard({ "1": "again", "2": "soon", "3": "mastered" }[event.key]);
      } else if (key === "r" && currentCard) {
        event.preventDefault();
        handleSpeak(
          flipped ? currentCard.example || currentCard.meaning : currentCard.word,
          `${currentCard.id}-shortcut`
        );
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [currentCard, flipped, goPrevious, handleSpeak, isComplete, locked, rateCard]);

  // 2. EDGE CASE 1: Bộ thẻ rỗng (Empty State)
  if (!cards || cards.length === 0) {
    return (
      <Dialog
        onClose={() => onClose?.()}
        ariaLabel="Bộ thẻ đang trống"
        closeOnBackdrop={false}
        className="relative w-full max-w-md rounded-3xl border border-white/15 bg-white/95 p-7 text-center shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/95"
      >
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-amber-500/10 text-amber-500 ring-8 ring-amber-500/5 dark:bg-amber-400/10 dark:text-amber-400">
          <Inbox size={28} aria-hidden="true" />
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
            className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-bold text-white transition hover:bg-slate-800 active:scale-95 dark:bg-emerald-500 dark:text-slate-950 dark:hover:bg-emerald-400"
          >
            Quay lại thư viện
          </button>
        </div>
      </Dialog>
    );
  }

  // 3. MÀN HÌNH HOÀN THÀNH PHIÊN HỌC (Completion Screen)
  if (isComplete) {
    const masteredCount = results.filter((r) => r === "mastered").length;
    const accuracyRate = results.length ? Math.round((masteredCount / results.length) * 100) : 0;

    return (
      <Dialog
        onClose={() => onClose?.()}
        ariaLabel="Hoàn thành phiên ôn tập"
        closeOnBackdrop={false}
        overlayClassName="fixed inset-0 z-[100] grid place-items-center overflow-y-auto bg-slate-950/80 p-4 backdrop-blur-md sm:p-6"
        className="relative w-full max-w-lg rounded-3xl border border-white/20 bg-white/95 p-7 text-center shadow-2xl backdrop-blur-2xl dark:border-white/10 dark:bg-slate-900/95 sm:p-9"
      >
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
      </Dialog>
    );
  }

  // 4. TRẠNG THÁI HIỂN THỊ THẺ HIỆN TẠI (Active Flashcard Workspace)
  if (!currentCard) {
    return (
      <Dialog
        onClose={() => onClose?.()}
        ariaLabel="Đang chuẩn bị thẻ"
        closeOnBackdrop={false}
        className="rounded-3xl border border-white/15 bg-white/95 px-8 py-10 text-center shadow-2xl dark:border-white/10 dark:bg-slate-900/95"
      >
        <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">Đang chuẩn bị thẻ học…</p>
      </Dialog>
    );
  }

  const exampleText = currentCard.example || "Chưa có câu ví dụ.";
  const intervals = previewIntervals(currentCard);

  return (
    <Dialog
      onClose={() => onClose?.()}
      ariaLabel={`Ôn tập thẻ ghi nhớ: ${deck?.title || "Từ vựng"}`}
      ariaDescribedBy="flashcard-live-status"
      closeOnBackdrop={false}
      initialFocusRef={flipButtonRef}
      overlayClassName="fixed inset-0 z-[90] flex justify-center overflow-y-auto bg-slate-950/85 p-4 text-slate-900 backdrop-blur-xl dark:text-white sm:p-7"
      className="mx-auto flex w-full max-w-3xl flex-col justify-between outline-none"
    >
      <div className="flex flex-1 flex-col justify-between">
        {/* Vùng thông báo cho trình đọc màn hình: chỉ đọc mặt đang hiển thị, không lộ đáp án */}
        <p id="flashcard-live-status" aria-live="polite" aria-atomic="true" className="sr-only">
          {`Thẻ ${Math.min(index + 1, totalCards)} trên ${totalCards}. Từ: ${currentCard.word}. ${
            flipped
              ? `Nghĩa: ${currentCard.meaning}${currentCard.example ? `. Ví dụ: ${currentCard.example}` : ""}. Chọn 1, 2 hoặc 3 để đánh giá.`
              : "Nhấn Space hoặc nút Lật thẻ để xem nghĩa."
          }`}
        </p>

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
        <div
          role="progressbar"
          aria-label="Tiến độ phiên ôn tập"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progressPercent}
          aria-valuetext={`${Math.min(index, totalCards)} trên ${totalCards} thẻ`}
          className="mt-3.5 h-2 w-full overflow-hidden rounded-full bg-white/10"
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-400 shadow-sm transition-all duration-500 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* 5. KHỐI THẺ 3D LẬT VẬT LÝ (3D Perspective Card) */}
        <div className="my-auto py-4 [perspective:1400px]">
          <div
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onClick={() => !locked && setFlipped((value) => !value)}
            className={`relative min-h-[260px] w-full cursor-pointer touch-pan-y [transform-style:preserve-3d] transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] sm:min-h-[320px] ${
              flipped ? "[transform:rotateY(180deg)]" : ""
            } ${locked ? "pointer-events-none" : ""}`}
          >
            {/* MẶT TRƯỚC (Front Face) — mặt bị úp được đánh dấu inert để AT không đọc lộ đáp án */}
            <div
              aria-hidden={flipped}
              inert={flipped}
              className="absolute inset-0 flex flex-col items-center justify-between overflow-hidden rounded-3xl border border-white/20 bg-white/95 p-5 text-center shadow-2xl backdrop-blur-2xl [backface-visibility:hidden] dark:border-white/10 dark:bg-slate-900/95 sm:p-7"
            >
              <div className="flex w-full items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <span>Mặt trước</span>
                <span>Chạm để lật</span>
              </div>

              <div className="my-auto flex flex-col items-center">
                {currentCard.imageUrl && !imageError ? (
                  <img
                    src={currentCard.imageUrl}
                    alt={currentCard.word}
                    className="mb-4 h-32 w-44 rounded-2xl border border-slate-200/80 object-contain shadow-xs dark:border-white/10"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="mb-4">
                    <WordAvatar
                      word={currentCard.word}
                      alt={currentCard.word}
                      className="h-20 w-20 rounded-2xl shadow-md sm:h-24 sm:w-24"
                    />
                  </div>
                )}

                <h1 className="break-words font-display text-4xl font-black tracking-tight text-slate-900 sm:text-6xl dark:text-white">
                  {currentCard.word}
                </h1>

                {/* Nút phát âm âm thanh */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSpeak(currentCard.word, `${currentCard.id}-word`);
                  }}
                  className={`mt-5 inline-flex min-h-[42px] items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-bold text-slate-950 shadow-md shadow-emerald-500/20 transition hover:bg-emerald-400 active:scale-95 ${
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
            <div
              aria-hidden={!flipped}
              inert={!flipped}
              className="absolute inset-0 flex [transform:rotateY(180deg)] flex-col items-center justify-between overflow-y-auto rounded-3xl border border-white/20 bg-white/95 p-6 text-center shadow-2xl backdrop-blur-2xl [backface-visibility:hidden] dark:border-white/10 dark:bg-slate-900/95 sm:p-9"
            >
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

                <h2 className="mt-2 break-words font-display text-2xl font-black text-slate-900 sm:text-4xl dark:text-white">
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

        {/* Nút lật thẻ — điều khiển chính thức cho bàn phím & trình đọc màn hình */}
        <button
          ref={flipButtonRef}
          type="button"
          onClick={() => !locked && setFlipped((value) => !value)}
          aria-pressed={flipped}
          className="mx-auto mb-3 flex min-h-[46px] w-full max-w-sm items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-4 text-xs font-bold text-white backdrop-blur-md transition hover:bg-white/20 active:scale-[0.99] sm:w-auto sm:px-6"
        >
          <RotateCcw size={15} aria-hidden="true" />
          <span>{flipped ? "Úp thẻ lại" : "Lật thẻ xem nghĩa"}</span>
          <kbd className="rounded bg-black/30 px-1.5 py-0.5 font-mono text-[10px] text-slate-300">Space</kbd>
        </button>

        {/* 6. BỘ 3 NÚT ĐÁNH GIÁ SRS (Action Rating Bar) — chỉ hiện sau khi đã xem nghĩa */}
        {!flipped && (
          <p className="mb-3 text-center text-xs text-slate-300">
            Lật thẻ để xem nghĩa, sau đó chọn mức độ nhớ (phím <kbd className="rounded bg-white/10 px-1 font-mono">1</kbd>{" "}
            <kbd className="rounded bg-white/10 px-1 font-mono">2</kbd>{" "}
            <kbd className="rounded bg-white/10 px-1 font-mono">3</kbd>).
          </p>
        )}
        <div className={flipped ? "grid grid-cols-1 gap-2.5 sm:grid-cols-3 sm:gap-3.5" : "hidden"}>
          {/* Nút 1: Chưa nhớ */}
          <button
            type="button"
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
        <p className="mt-4 hidden items-center justify-center gap-1.5 text-center text-[11px] text-slate-400 sm:flex">
          <RotateCcw size={12} />
          <span>Thẻ đánh dấu "Chưa nhớ" sẽ tự động quay lại cuối hàng đợi trong phiên học này.</span>
        </p>
      </div>
    </Dialog>
  );
}
