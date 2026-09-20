import { useEffect, useMemo, useRef, useState } from "react";
import { AlarmClock, ChevronRight, Flag, X } from "lucide-react";
import ListeningSection from "./sections/ListeningSection";
import ReadingSection from "./sections/ReadingSection";
import WritingSection from "./sections/WritingSection";
import SpeakingSection from "./sections/SpeakingSection";
import { SECTION_LABELS, examQuestions, skillOrder } from "../../services/vstepService";
import { toast } from "../../services/toast";

const formatClock = (seconds) => `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(Math.max(0, seconds) % 60).padStart(2, "0")}`;

/**
 * Máy chạy đề VSTEP.
 * - `mode="exam"`: thi thật — đồng hồ từng kỹ năng + đồng hồ tổng, đi một chiều, không xem đáp án.
 * - `mode="practice"`: luyện tập — không đồng hồ, được xem đáp án từng phần.
 */
export default function VstepExamRunner({ exam, mode = "exam", onExit, onSubmit }) {
  const isExam = mode === "exam";
  const sections = useMemo(() => skillOrder.filter((key) => (exam[key]?.parts?.length || exam[key]?.tasks?.length)), [exam]);
  const [sectionKey, setSectionKey] = useState(sections[0]);
  const [revealed, setRevealed] = useState({});
  const [responses, setResponses] = useState({});
  const [writings, setWritings] = useState({});
  const [writingChecks, setWritingChecks] = useState({});
  const [speaking, setSpeaking] = useState({});
  const [secondsLeft, setSecondsLeft] = useState((exam[sections[0]]?.minutes || 40) * 60);
  const startedAt = useRef(Date.now());
  const submittedRef = useRef(false);

  const index = sections.indexOf(sectionKey);
  const isLast = index === sections.length - 1;

  const answer = (questionId, value) => setResponses((current) => ({ ...current, [questionId]: value }));
  const write = (taskId, text) => setWritings((current) => ({ ...current, [taskId]: text }));
  const check = (key, value) => setWritingChecks((current) => ({ ...current, [key]: value }));
  const speak = (partId, data) => setSpeaking((current) => ({ ...current, [partId]: { ...current[partId], ...data } }));

  const submit = (reason) => {
    if (submittedRef.current) return;
    submittedRef.current = true;
    onSubmit({
      responses,
      writings,
      writingChecks,
      speaking,
      durationSeconds: Math.round((Date.now() - startedAt.current) / 1000),
      reason,
    });
  };

  const goNext = () => {
    if (!isLast) {
      const nextKey = sections[index + 1];
      setSectionKey(nextKey);
      setSecondsLeft((exam[nextKey]?.minutes || 40) * 60);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    submit("manual");
  };

  const confirmNext = () => {
    if (!isExam) {
      goNext();
      return;
    }
    const message = isLast
      ? "Nộp bài thi? Bạn sẽ không thể sửa đáp án sau khi nộp."
      : `Kết thúc phần ${SECTION_LABELS[sectionKey]} và chuyển sang phần ${SECTION_LABELS[sections[index + 1]]}? Bạn không thể quay lại phần này.`;
    if (window.confirm(message)) goNext();
  };

  // Đồng hồ của phần đang làm. Hết giờ thì tự chuyển phần / nộp bài.
  useEffect(() => {
    if (!isExam) return undefined;
    const timer = window.setInterval(() => {
      setSecondsLeft((value) => {
        if (value <= 1) {
          if (isLast) {
            toast.info("Hết giờ làm bài. Bài thi được nộp tự động.");
            submit("time");
            return 0;
          }
          const nextKey = sections[index + 1];
          toast.info(`Hết giờ phần ${SECTION_LABELS[sectionKey]}. Chuyển sang phần ${SECTION_LABELS[nextKey]}.`);
          setSectionKey(nextKey);
          return (exam[nextKey]?.minutes || 40) * 60;
        }
        return value - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isExam, sectionKey, index, isLast, sections, exam]);

  const sectionProps = { exam, answers: responses, onAnswer: answer, mode: revealed[sectionKey] ? "review" : "exam" };
  const listeningCount = examQuestions(exam, "listening").length;

  return (
    <div className="space-y-4">
      <section className="panel no-print sticky top-2 z-30 p-3 sm:p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="eyebrow">{isExam ? "Đang thi" : "Đang luyện"} · {exam.title}</p>
            <p className="mt-1 font-display text-lg font-bold">{SECTION_LABELS[sectionKey]} ({index + 1}/{sections.length})</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {isExam ? (
              <span className={`chip ${secondsLeft <= 300 ? "bg-danger/15 text-danger dark:text-dangerfgdark" : "bg-ink/[0.06] text-ink/70 dark:bg-white/10 dark:text-white/70"}`}>
                <AlarmClock size={13} className="mr-1" />Còn {formatClock(secondsLeft)}
              </span>
            ) : (
              <button type="button" onClick={() => setRevealed((current) => ({ ...current, [sectionKey]: !current[sectionKey] }))} className="btn-secondary px-3 text-xs">
                {revealed[sectionKey] ? "Tắt đáp án" : "Xem đáp án phần này"}
              </button>
            )}
            <button type="button" onClick={confirmNext} className="btn-primary px-4 text-xs">
              {isLast ? <><Flag size={15} />Nộp bài</> : <><ChevronRight size={15} />Phần tiếp theo</>}
            </button>
            <button
              type="button"
              onClick={() => {
                if (window.confirm("Thoát bài thi? Kết quả sẽ không được lưu.")) onExit();
              }}
              className="icon-btn h-11 w-11"
              aria-label="Thoát bài thi"
            >
              <X size={18} />
            </button>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {sections.map((key, position) => {
            const done = position < index;
            const active = key === sectionKey;
            return (
              <span
                key={key}
                className={`chip ${active ? "bg-lime text-ink" : done ? "bg-okbg text-ok dark:bg-okdark dark:text-okfgdark" : "bg-ink/[0.06] text-ink/55 dark:bg-white/10 dark:text-white/55"}`}
              >
                {SECTION_LABELS[key]} · {exam[key].minutes}′
              </span>
            );
          })}
          <span className="chip bg-ink/[0.06] text-ink/60 dark:bg-white/10 dark:text-white/60">
            {isExam ? "Đi một chiều như thi thật" : "Chế độ luyện: xem đáp án được"}
          </span>
        </div>
      </section>

      {sectionKey === "listening" && <ListeningSection {...sectionProps} review={null} startIndex={0} />}
      {sectionKey === "reading" && <ReadingSection {...sectionProps} review={null} startIndex={listeningCount} />}
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
      {sectionKey === "speaking" && <SpeakingSection exam={exam} speaking={speaking} onSpeak={speak} mode={isExam ? "exam" : "practice"} />}

      <div className="no-print flex justify-end">
        <button type="button" onClick={confirmNext} className="btn-primary px-5">
          {isLast ? "Nộp bài thi" : `Sang phần ${SECTION_LABELS[sections[index + 1]]}`}
        </button>
      </div>
    </div>
  );
}
