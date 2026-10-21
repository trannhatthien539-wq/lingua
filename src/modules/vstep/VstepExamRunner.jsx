import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AlarmClock,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Flag,
  Keyboard,
  Maximize2,
  Minimize2,
  WifiOff,
  X,
} from "lucide-react";
import Dialog from "../../components/ui/Dialog";
import ListeningSection from "./sections/ListeningSection";
import ReadingSection from "./sections/ReadingSection";
import WritingSection from "./sections/WritingSection";
import SpeakingSection from "./sections/SpeakingSection";
import { SECTION_LABELS, examQuestions, skillOrder } from "../../services/vstepService";
import { toast } from "../../services/toast";
import { DRAFT_VERSION, draftKeyFor, parseExamDraft } from "../../utils/examDraft";

const formatClock = (seconds) =>
  `${String(Math.floor(Math.max(0, seconds) / 60)).padStart(2, "0")}:${String(
    Math.max(0, seconds) % 60
  ).padStart(2, "0")}`;

const sectionSeconds = (exam, key) => (exam?.[key]?.minutes || 40) * 60;

/**
 * VstepExamRunner - Máy chạy đề thi & luyện tập VSTEP chuẩn EdTech:
 * 1. Code Quality & Performance: Tách timer độc lập, chặn re-render diện rộng từng giây, dọn sạch interval.
 * 2. UI/UX & Responsive: Thanh tiến độ câu hỏi trực quan, modal xác nhận thanh lịch thay window.confirm, Zen Mode.
 * 3. Edge Cases: Tự động lưu nháp vào LocalStorage (chống F5/mất điện), chặn nộp bài 2 lần (double-submit), cảnh báo đóng tab, báo mất mạng.
 * 4. Accessibility: ARIA roles, role="timer", phím tắt Esc & hỗ trợ bàn phím.
 */
export default function VstepExamRunner({ exam, mode = "exam", onExit, onSubmit }) {
  const isExam = mode === "exam";
  const draftKey = draftKeyFor(exam.id, mode);

  const sections = useMemo(
    () =>
      skillOrder.filter(
        (key) => exam[key]?.parts?.length || exam[key]?.tasks?.length
      ),
    [exam]
  );

  // 1. Phục hồi bản nháp từ LocalStorage nếu có (đã kiểm tra đúng đề/chế độ/phần thi)
  const [initialDraft] = useState(() => {
    if (typeof localStorage === "undefined") return null;
    try {
      return parseExamDraft(localStorage.getItem(draftKey), {
        examId: exam.id,
        mode,
        availableSections: sections,
        minutesFor: (key) => sectionSeconds(exam, key),
      });
    } catch {
      // Chế độ riêng tư có thể chặn storage — bỏ qua và bắt đầu bài mới.
      return null;
    }
  });

  const [sectionKey, setSectionKey] = useState(() => initialDraft?.sectionKey || sections[0]);
  const [zenMode, setZenMode] = useState(false);
  const [revealed, setRevealed] = useState({});
  const [responses, setResponses] = useState(() => initialDraft?.responses || {});
  const [writings, setWritings] = useState(() => initialDraft?.writings || {});
  const [writingChecks, setWritingChecks] = useState(() => initialDraft?.writingChecks || {});
  const [speaking, setSpeaking] = useState(() => initialDraft?.speaking || {});
  const [secondsLeft, setSecondsLeft] = useState(() => {
    const fallback = sectionSeconds(exam, initialDraft?.sectionKey || sections[0]);
    return typeof initialDraft?.secondsLeft === "number" ? initialDraft.secondsLeft : fallback;
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState(null); // { title, message, onConfirm }
  const [isOnline, setIsOnline] = useState(() => (typeof navigator !== "undefined" ? navigator.onLine : true));
  const [timeAnnouncement, setTimeAnnouncement] = useState("");
  const [savedAt, setSavedAt] = useState(null);

  const startedAt = useRef(initialDraft?.startedAt || Date.now());
  const submittedRef = useRef(false);
  const mountedRef = useRef(false);
  /** Mốc thời gian kết thúc phần thi hiện tại (chống lệch giờ khi tab bị throttle/ngủ). */
  const deadlineRef = useRef(Date.now() + secondsLeft * 1000);
  /** Ảnh chụp mới nhất của bài làm, dùng cho autosave để không phụ thuộc deps từng giây. */
  const snapshotRef = useRef(null);

  const index = sections.indexOf(sectionKey);
  const isLast = index === sections.length - 1;

  snapshotRef.current = {
    version: DRAFT_VERSION,
    examId: exam.id,
    mode,
    sectionKey,
    responses,
    writings,
    writingChecks,
    speaking,
    secondsLeft,
    startedAt: startedAt.current,
    timestamp: Date.now(),
  };

  const saveDraft = useCallback(() => {
    if (submittedRef.current || typeof localStorage === "undefined") return;
    const snapshot = snapshotRef.current;
    if (!snapshot) return;
    try {
      localStorage.setItem(draftKey, JSON.stringify({ ...snapshot, timestamp: Date.now() }));
      if (mountedRef.current) setSavedAt(Date.now());
    } catch {
      // Storage có thể đầy hoặc bị chặn (chế độ riêng tư) — không ngắt luồng làm bài.
    }
  }, [draftKey]);

  // 2a. Lưu nháp có debounce khi nội dung thay đổi (không ghi localStorage mỗi giây).
  useEffect(() => {
    if (submittedRef.current) return undefined;
    const timer = window.setTimeout(saveDraft, 700);
    return () => window.clearTimeout(timer);
  }, [saveDraft, sectionKey, responses, writings, writingChecks, speaking]);

  // 2b. Chốt giờ định kỳ + khi tab bị ẩn/đóng để không mất dữ liệu.
  useEffect(() => {
    if (submittedRef.current) return undefined;
    const checkpoint = window.setInterval(saveDraft, 5000);
    const flush = () => {
      if (typeof document !== "undefined" && document.visibilityState === "hidden") saveDraft();
    };
    window.addEventListener("pagehide", saveDraft);
    document.addEventListener("visibilitychange", flush);
    return () => {
      window.clearInterval(checkpoint);
      window.removeEventListener("pagehide", saveDraft);
      document.removeEventListener("visibilitychange", flush);
    };
  }, [saveDraft]);

  // Thông báo khi khôi phục bản nháp
  useEffect(() => {
    if (initialDraft) {
      toast.info("Đã khôi phục bài làm từ bản lưu tự động gần nhất.");
    }
  }, [initialDraft]);

  // 3. Theo dõi trạng thái mạng (Online/Offline)
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success("Đã kết nối lại Internet.");
    };
    const handleOffline = () => {
      setIsOnline(false);
      toast.warning("Mất kết nối Internet! Bài làm vẫn đang được lưu an toàn trên máy.");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // 4. Ngăn ngừa đóng tab/tải lại vô tình (BeforeUnload) và chốt bản nháp cuối cùng
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!isExam) return undefined;
    const handleBeforeUnload = (event) => {
      if (submittedRef.current) return;
      saveDraft();
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isExam, saveDraft]);

  // 5. Cập nhật câu trả lời an toàn
  const answer = useCallback((questionId, value) => {
    setResponses((current) => ({ ...current, [questionId]: value }));
  }, []);

  const write = useCallback((taskId, text) => {
    setWritings((current) => ({ ...current, [taskId]: text }));
  }, []);

  const check = useCallback((key, value) => {
    setWritingChecks((current) => ({ ...current, [key]: value }));
  }, []);

  const speak = useCallback((partId, data) => {
    setSpeaking((current) => ({
      ...current,
      [partId]: { ...current[partId], ...data },
    }));
  }, []);

  // 6. Nộp bài thi có bảo vệ chống Double-Submit + xử lý lỗi khi nộp thất bại
  const submit = useCallback(
    async (reason) => {
      if (submittedRef.current) return;
      submittedRef.current = true;
      setIsSubmitting(true);

      try {
        await onSubmit?.({
          responses,
          writings,
          writingChecks,
          speaking,
          durationSeconds: Math.round((Date.now() - startedAt.current) / 1000),
          reason,
        });
        // Chỉ xoá nháp khi đã nộp thành công, để có thể thử lại nếu lỗi.
        try {
          localStorage.removeItem(draftKey);
        } catch {
          // Ignored
        }
      } catch (error) {
        submittedRef.current = false;
        saveDraft();
        toast.error(error?.message || "Không thể nộp bài lúc này. Bài làm vẫn được lưu trên máy, vui lòng thử lại.");
      } finally {
        if (mountedRef.current) setIsSubmitting(false);
      }
    },
    [draftKey, onSubmit, responses, writings, writingChecks, speaking, saveDraft]
  );

  /** Chuyển phần thi và đặt lại đồng hồ đếm ngược theo thời lượng phần mới. */
  const startSection = useCallback(
    (nextKey) => {
      const nextSeconds = sectionSeconds(exam, nextKey);
      setSectionKey(nextKey);
      setSecondsLeft(nextSeconds);
      deadlineRef.current = Date.now() + nextSeconds * 1000;
      setTimeAnnouncement(`Đã chuyển sang phần ${SECTION_LABELS[nextKey]}.`);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [exam]
  );

  const goNext = useCallback(() => {
    if (!isLast) {
      startSection(sections[index + 1]);
      return;
    }
    void submit("manual");
  }, [index, isLast, sections, startSection, submit]);

  // 7. Thống kê số câu đã làm trong phần hiện tại
  const currentQuestions = useMemo(() => {
    if (sectionKey === "listening" || sectionKey === "reading") {
      return examQuestions(exam, sectionKey);
    }
    return [];
  }, [exam, sectionKey]);

  const currentAnsweredCount = useMemo(() => {
    if (!currentQuestions.length) return 0;
    return currentQuestions.filter(
      (q) => responses[q.id] !== undefined && responses[q.id] !== ""
    ).length;
  }, [currentQuestions, responses]);

  // 8. Hộp thoại xác nhận chuyển phần / nộp bài (thay thế window.confirm)
  const confirmNext = useCallback(() => {
    if (!isExam) {
      goNext();
      return;
    }

    const uncompleted = currentQuestions.length - currentAnsweredCount;
    let warningNote = "";
    if (uncompleted > 0) {
      warningNote = `Bạn còn ${uncompleted}/${currentQuestions.length} câu chưa trả lời trong phần này. `;
    }

    const title = isLast ? "Nộp bài thi VSTEP" : `Chuyển sang phần ${SECTION_LABELS[sections[index + 1]]}`;
    const message = isLast
      ? `${warningNote}Bạn sẽ không thể sửa đáp án sau khi nộp bài. Bạn có chắc chắn muốn nộp không?`
      : `${warningNote}Sau khi chuyển phần, bạn sẽ không thể quay lại làm lại ${SECTION_LABELS[sectionKey]}. Bạn đã sẵn sàng?`;

    setConfirmDialog({
      title,
      message,
      confirmLabel: isLast ? "Nộp bài ngay" : "Tiếp tục chuyển",
      confirmVariant: isLast ? "primary" : "indigo",
      onConfirm: () => {
        setConfirmDialog(null);
        goNext();
      },
    });
  }, [currentAnsweredCount, currentQuestions.length, goNext, index, isExam, isLast, sectionKey, sections]);

  // 9. Đồng hồ đếm ngược dựa trên MỐC THỜI GIAN THẬT thay vì trừ dần mỗi giây:
  //    khi tab bị ẩn/ngủ, trình duyệt throttle setInterval và cách trừ dần sẽ làm học
  //    sinh được thêm thời gian. Tính theo deadline giữ đúng giờ thi thật.
  useEffect(() => {
    if (!isExam) return undefined;

    const sync = () => {
      const remaining = Math.max(0, Math.ceil((deadlineRef.current - Date.now()) / 1000));
      setSecondsLeft((prev) => (prev === remaining ? prev : remaining));
    };
    const timer = window.setInterval(sync, 1000);
    const onVisible = () => {
      if (typeof document === "undefined" || document.visibilityState === "visible") sync();
    };

    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", onVisible);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", onVisible);
    };
  }, [isExam]);

  // Thông báo mốc giờ quan trọng cho trình đọc màn hình.
  useEffect(() => {
    if (!isExam || secondsLeft <= 0) return;
    if (secondsLeft === 300 || secondsLeft === 60 || secondsLeft === 30) {
      setTimeAnnouncement(`Còn ${formatClock(secondsLeft)} cho phần ${SECTION_LABELS[sectionKey]}.`);
    }
  }, [isExam, secondsLeft, sectionKey]);

  // Hiệu ứng chuyển phần tự động khi hết giờ
  useEffect(() => {
    if (!isExam || secondsLeft > 0 || isSubmitting) return;

    if (isLast) {
      toast.info("Hết giờ làm bài! Bài thi đang được nộp tự động.");
      setTimeAnnouncement("Hết giờ làm bài. Bài thi đang được nộp tự động.");
      void submit("time");
    } else {
      const nextKey = sections[index + 1];
      toast.info(`Hết giờ phần ${SECTION_LABELS[sectionKey]}. Tự động chuyển sang phần ${SECTION_LABELS[nextKey]}.`);
      setTimeAnnouncement(`Hết giờ phần ${SECTION_LABELS[sectionKey]}. Chuyển sang phần ${SECTION_LABELS[nextKey]}.`);
      startSection(nextKey);
    }
  }, [index, isExam, isLast, isSubmitting, secondsLeft, sectionKey, sections, startSection, submit]);

  // 10. Phím tắt: Ctrl/⌘ + Enter để chuyển phần/nộp bài, Esc để thoát Zen mode.
  //     (Esc của hộp thoại xác nhận do <Dialog> đảm nhiệm — có focus trap chuẩn.)
  useEffect(() => {
    const isEditable = (target) =>
      Boolean(target?.isContentEditable) || ["INPUT", "TEXTAREA", "SELECT"].includes(target?.tagName);

    const handleKeyDown = (event) => {
      if (confirmDialog) return;
      if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
        event.preventDefault();
        confirmNext();
        return;
      }
      if (event.key === "Escape" && zenMode && !isEditable(event.target)) {
        event.preventDefault();
        setZenMode(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [confirmDialog, confirmNext, zenMode]);

  const sectionProps = useMemo(
    () => ({
      exam,
      answers: responses,
      onAnswer: answer,
      mode: revealed[sectionKey] ? "review" : "exam",
    }),
    [exam, responses, answer, revealed, sectionKey]
  );

  const listeningCount = useMemo(() => examQuestions(exam, "listening").length, [exam]);

  return (
    <div
      className={
        zenMode
          ? "fixed inset-0 z-50 overflow-y-auto bg-slate-950 p-4 text-slate-100 sm:p-6"
          : "space-y-4"
      }
    >
      <div className={zenMode ? "mx-auto max-w-5xl space-y-4" : "space-y-4"}>
        {/* Vùng thông báo cho trình đọc màn hình (không chiếm chỗ trên giao diện) */}
        <p aria-live="polite" aria-atomic="true" className="sr-only">
          {timeAnnouncement}
        </p>

        {/* Banner cảnh báo mất mạng */}
        {!isOnline && (
          <aside
            role="status"
            className="flex items-center gap-2.5 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-2.5 text-xs font-semibold text-amber-700 dark:text-amber-300"
          >
            <WifiOff size={16} className="shrink-0 animate-bounce" />
            <span>Mất kết nối Internet. Tiến trình làm bài vẫn được tự động lưu cục bộ an toàn.</span>
          </aside>
        )}

        {/* Thanh điều khiển cố định (Sticky Header) */}
        <header className="panel no-print sticky top-2 z-30 p-3 sm:p-4 backdrop-blur-xl border border-slate-200/80 bg-white/90 shadow-md dark:border-white/10 dark:bg-slate-900/90">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="eyebrow truncate">
                {isExam ? "Kỳ thi mô phỏng" : "Luyện tập tự do"} · {exam.title}
              </p>
              <h1 className="mt-0.5 font-display text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
                {SECTION_LABELS[sectionKey]}{" "}
                <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
                  (Phần {index + 1}/{sections.length})
                </span>
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {isExam ? (
                <div
                  role="timer"
                  aria-label={`Thời gian còn lại ${formatClock(secondsLeft)}`}
                  className={`chip font-mono font-bold tabular-nums transition-all ${
                    secondsLeft <= 120
                      ? "bg-rose-500/20 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400 animate-pulse border border-rose-500/40"
                      : secondsLeft <= 300
                        ? "bg-amber-500/15 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300 border border-amber-500/30"
                        : "bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-200"
                  }`}
                >
                  <AlarmClock size={14} className="mr-1 inline-block" />
                  {formatClock(secondsLeft)}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() =>
                    setRevealed((current) => ({
                      ...current,
                      [sectionKey]: !current[sectionKey],
                    }))
                  }
                  className="btn-secondary px-3 text-xs"
                >
                  {revealed[sectionKey] ? "Ẩn đáp án" : "Xem đáp án"}
                </button>
              )}

              {/* Chế độ tập trung Zen Mode */}
              <button
                type="button"
                onClick={() => setZenMode((prev) => !prev)}
                className={`icon-btn h-10 w-10 ${
                  zenMode
                    ? "border border-indigo-500/50 bg-indigo-500/20 text-indigo-600 dark:text-indigo-400"
                    : ""
                }`}
                title={zenMode ? "Thoát chế độ tập trung (Esc)" : "Bật chế độ tập trung toàn màn hình"}
                aria-label={zenMode ? "Thoát chế độ tập trung" : "Bật chế độ tập trung"}
              >
                {zenMode ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              </button>

              {/* Nút Chuyển phần / Nộp bài */}
              <button
                type="button"
                onClick={confirmNext}
                disabled={isSubmitting}
                className="btn-primary min-h-[40px] px-4 text-xs font-bold shadow-sm"
              >
                {isSubmitting ? (
                  <span>Đang nộp…</span>
                ) : isLast ? (
                  <>
                    <Flag size={14} />
                    <span>Nộp bài</span>
                  </>
                ) : (
                  <>
                    <ChevronRight size={14} />
                    <span>Phần tiếp theo</span>
                  </>
                )}
              </button>

              {/* Nút Thoát bài thi */}
              <button
                type="button"
                onClick={() => {
                  setConfirmDialog({
                    title: "Thoát bài thi?",
                    message: "Nếu thoát lúc này, kết quả sẽ không được tính điểm và bản nháp sẽ bị xoá. Bạn có chắc muốn thoát?",
                    confirmLabel: "Thoát không lưu",
                    confirmVariant: "danger",
                    onConfirm: () => {
                      try {
                        localStorage.removeItem(draftKey);
                      } catch {
                        // Ignored
                      }
                      setConfirmDialog(null);
                      onExit();
                    },
                  });
                }}
                className="icon-btn h-10 w-10 hover:text-rose-500"
                aria-label="Thoát bài thi"
                title="Thoát bài thi"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Dải tiến trình các kỹ năng & Trạng thái câu hỏi đã trả lời */}
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-200/60 pt-2.5 dark:border-white/10">
            <div className="flex flex-wrap items-center gap-1.5">
              {sections.map((key, position) => {
                const done = position < index;
                const active = key === sectionKey;
                return (
                  <span
                    key={key}
                    className={`chip text-[11px] ${
                      active
                        ? "bg-slate-900 text-white font-bold shadow-xs dark:bg-white dark:text-slate-950"
                        : done
                          ? "border border-emerald-500/30 bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
                          : "bg-slate-100 text-slate-500 dark:bg-white/5 dark:text-slate-400"
                    }`}
                  >
                    {SECTION_LABELS[key]} · {exam[key].minutes}′
                  </span>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <span className="hidden items-center gap-1 text-[11px] font-medium text-slate-500 dark:text-slate-400 sm:inline-flex">
                <CheckCircle2 size={12} className="text-emerald-500" aria-hidden="true" />
                {savedAt
                  ? `Đã lưu nháp lúc ${new Date(savedAt).toLocaleTimeString("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}`
                  : "Bản nháp được lưu tự động"}
              </span>
              {currentQuestions.length > 0 && (
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                  Đã trả lời:{" "}
                  <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                    {currentAnsweredCount}
                  </span>
                  /{currentQuestions.length} câu
                </span>
              )}
            </div>
          </div>
        </header>

        {/* Nội dung phần thi hiện tại */}
        <main>
          {sectionKey === "listening" && (
            <ListeningSection {...sectionProps} review={null} startIndex={0} />
          )}
          {sectionKey === "reading" && (
            <ReadingSection {...sectionProps} review={null} startIndex={listeningCount} />
          )}
          {sectionKey === "writing" && (
            <WritingSection
              exam={exam}
              writings={writings}
              onWrite={write}
              mode={isExam ? "exam" : "practice"}
              checks={writingChecks}
              onCheck={check}
            />
          )}
          {sectionKey === "speaking" && (
            <SpeakingSection
              exam={exam}
              speaking={speaking}
              onSpeak={speak}
              mode={isExam ? "exam" : "practice"}
            />
          )}
        </main>

        {/* Nút hành động đáy trang */}
        <footer className="no-print flex flex-wrap items-center justify-end gap-3 pb-8">
          <p className="mr-auto hidden items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 sm:flex">
            <Keyboard size={14} aria-hidden="true" />
            <span>
              <kbd className="rounded border border-slate-300 bg-slate-100 px-1.5 py-0.5 font-mono text-[11px] font-bold dark:border-white/20 dark:bg-white/10">
                Ctrl/⌘
              </kbd>{" "}
              +{" "}
              <kbd className="rounded border border-slate-300 bg-slate-100 px-1.5 py-0.5 font-mono text-[11px] font-bold dark:border-white/20 dark:bg-white/10">
                Enter
              </kbd>{" "}
              để {isLast ? "nộp bài" : "chuyển phần"}
            </span>
          </p>
          <button
            type="button"
            onClick={confirmNext}
            disabled={isSubmitting}
            aria-busy={isSubmitting}
            className="btn-primary min-h-[46px] px-6 text-sm font-bold shadow-md hover:scale-[1.01] active:scale-[0.99]"
          >
            {isSubmitting ? (
              <span>Đang xử lý nộp bài…</span>
            ) : isLast ? (
              <>
                <CheckCircle2 size={17} />
                <span>Hoàn tất &amp; Nộp bài thi</span>
              </>
            ) : (
              <>
                <span>Hoàn thành {SECTION_LABELS[sectionKey]} ➔</span>
              </>
            )}
          </button>
        </footer>
      </div>

      {/* 11. Hộp thoại xác nhận dùng <Dialog> chung: focus trap, Esc, trả focus, khoá scroll nền */}
      {confirmDialog && (
        <Dialog
          onClose={() => setConfirmDialog(null)}
          ariaLabelledBy="vstep-confirm-title"
          ariaDescribedBy="vstep-confirm-message"
          closeOnBackdrop={false}
          className="relative w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-slate-900 sm:p-7"
        >
          <div className="flex items-center gap-3 text-amber-500 dark:text-amber-400">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-amber-500/10 dark:bg-amber-400/10">
              <AlertTriangle size={20} aria-hidden="true" />
            </span>
            <h2 id="vstep-confirm-title" className="font-display text-lg font-bold text-slate-900 dark:text-white">
              {confirmDialog.title}
            </h2>
          </div>

          <p
            id="vstep-confirm-message"
            className="mt-3 text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-300"
          >
            {confirmDialog.message}
          </p>

          <div className="mt-6 flex justify-end gap-2.5">
            <button
              type="button"
              onClick={() => setConfirmDialog(null)}
              className="btn-secondary px-4 py-2.5 text-xs font-semibold"
            >
              Tiếp tục làm bài
            </button>
            <button
              type="button"
              onClick={confirmDialog.onConfirm}
              className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-xs font-bold text-white transition active:scale-95 ${
                confirmDialog.confirmVariant === "danger"
                  ? "bg-rose-600 hover:bg-rose-500"
                  : "bg-indigo-600 hover:bg-indigo-500 shadow-sm"
              }`}
            >
              {confirmDialog.confirmLabel}
            </button>
          </div>
        </Dialog>
      )}
    </div>
  );
}
