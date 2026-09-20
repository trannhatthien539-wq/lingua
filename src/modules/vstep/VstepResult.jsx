import { useMemo, useState } from "react";
import { Award, BookOpenCheck, Check, LoaderCircle, RotateCcw, Save, Sparkles, Target } from "lucide-react";
import ListeningSection from "./sections/ListeningSection";
import ReadingSection from "./sections/ReadingSection";
import WritingSection from "./sections/WritingSection";
import SpeakingSection from "./sections/SpeakingSection";
import { SECTION_LABELS, scoreObjectiveSection, selfAssessedScore10, summariseAttempt } from "../../services/vstepService";
import { bandFor } from "../../data/vstep/bands";
import { gradeSpeakingPart, gradeWritingTask } from "../../services/vstepAi";
import { toast } from "../../services/toast";

const countWords = (value = "") => (value.trim() ? value.trim().split(/\s+/).length : 0);
const round1 = (value) => Math.round((Number(value) || 0) * 10) / 10;

/**
 * Màn hình kết quả: điểm từng kỹ năng, bậc VSTEP, xem lại từng câu,
 * chấm Writing/Nói bằng AI (nếu có API key) và lưu vào lịch sử.
 */
export default function VstepResult({ exam, result, apiKey, provider, onRetry, onExit, onSave, saved }) {
  const listening = useMemo(() => scoreObjectiveSection(exam, "listening", result.responses), [exam, result.responses]);
  const reading = useMemo(() => scoreObjectiveSection(exam, "reading", result.responses), [exam, result.responses]);
  const [writingFeedback, setWritingFeedback] = useState({});
  const [speakingFeedback, setSpeakingFeedback] = useState({});
  const [busy, setBusy] = useState("");
  const [view, setView] = useState("listening");

  // Điểm Viết khi chưa có AI: dựa trên checklist tự chấm + số từ đạt yêu cầu.
  const writingSelfScore = useMemo(() => {
    const tasks = exam.writing?.tasks || [];
    if (!tasks.length) return null;
    const scores = tasks.map((task) => {
      const text = result.writings?.[task.id] || "";
      const checklist = task.checklist || [];
      const checked = checklist.filter((item) => result.writingChecks?.[`${task.id}:${item.label}`]).length;
      return selfAssessedScore10({
        checkedRatio: checklist.length ? checked / checklist.length : 0,
        wordRatio: task.minWords ? countWords(text) / task.minWords : 1,
      });
    });
    return round1(scores.reduce((total, value) => total + value, 0) / scores.length);
  }, [exam, result.writings, result.writingChecks]);

  const writingAiScores = Object.values(writingFeedback).map((item) => item.score10);
  const writingScore = writingAiScores.length
    ? round1(writingAiScores.reduce((total, value) => total + value, 0) / writingAiScores.length)
    : (result.writings && Object.values(result.writings).some((text) => text?.trim()) ? writingSelfScore : null);

  const speakingScores = Object.values(speakingFeedback).map((item) => item.score10);
  const speakingAnswered = Object.values(result.speaking || {}).some((item) => item?.seconds > 0 || item?.transcript);
  const speakingScore = speakingScores.length
    ? round1(speakingScores.reduce((total, value) => total + value, 0) / speakingScores.length)
    : null;

  const scores = { listening: listening.score10, reading: reading.score10 };
  if (typeof writingScore === "number") scores.writing = writingScore;
  if (typeof speakingScore === "number") scores.speaking = speakingScore;
  const summary = summariseAttempt({ exam, scores });
  const band = bandFor(summary.average);
  const missing = [
    typeof writingScore !== "number" ? "Viết" : null,
    typeof speakingScore !== "number" && speakingAnswered ? "Nói" : null,
  ].filter(Boolean);

  const gradeWriting = async (task) => {
    const text = result.writings?.[task.id] || "";
    if (!text.trim()) return toast.error(`Task ${task.task} chưa có bài viết.`);
    setBusy(`w-${task.id}`);
    try {
      const feedback = await gradeWritingTask({ provider, apiKey, exam, task, text });
      setWritingFeedback((current) => ({ ...current, [task.id]: feedback }));
      toast.success(`Đã chấm Task ${task.task}: ${feedback.score10}/10.`);
    } catch (error) {
      toast.error(error.message || "Không thể chấm bài viết.");
    } finally {
      setBusy("");
    }
  };

  const gradeSpeaking = async (part) => {
    const transcript = result.speaking?.[part.id]?.transcript || "";
    if (!transcript.trim()) return toast.error("Phần này chưa có bản ghi lời nói (cần micro + trình duyệt hỗ trợ nhận dạng giọng nói).");
    setBusy(`s-${part.id}`);
    try {
      const feedback = await gradeSpeakingPart({ provider, apiKey, exam, part, transcript });
      setSpeakingFeedback((current) => ({ ...current, [part.id]: feedback }));
      toast.success(`${part.title}: ${feedback.score10}/10.`);
    } catch (error) {
      toast.error(error.message || "Không thể chấm phần Nói.");
    } finally {
      setBusy("");
    }
  };

  const save = () => {
    onSave?.({
      examId: exam.id,
      examTitle: exam.title,
      level: exam.level,
      scores,
      average: summary.average,
      band: summary.band,
      durationSeconds: result.durationSeconds,
    });
    toast.success("Đã lưu kết quả vào lịch sử thi.");
  };

  const tabs = [
    ["listening", `Nghe ${listening.correct}/${listening.total}`],
    ["reading", `Đọc ${reading.correct}/${reading.total}`],
    ...(exam.writing?.tasks?.length ? [["writing", `Viết ${typeof writingScore === "number" ? `${writingScore}/10` : "chưa chấm"}`]] : []),
    ...(exam.speaking?.parts?.length ? [["speaking", `Nói ${typeof speakingScore === "number" ? `${speakingScore}/10` : "chưa chấm"}`]] : []),
  ];

  return (
    <div className="space-y-5">
      <section className="panel p-5 print-report">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="eyebrow">Kết quả {result.reason === "time" ? "· hết giờ" : ""}</p>
            <h2 className="mt-1 flex items-center gap-2 font-display text-2xl font-bold">
              <Award size={22} className="text-sage" />{band.label}
            </h2>
            <p className="mt-1 text-sm text-ink/70 dark:text-white/70">{band.note}</p>
          </div>
          <div className="text-right">
            <p className="metric text-3xl">{summary.average}/10</p>
            <p className="text-xs text-ink/60 dark:text-white/60">điểm trung bình {Object.keys(scores).length}/4 kỹ năng</p>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[["listening", "Nghe"], ["reading", "Đọc"], ["writing", "Viết"], ["speaking", "Nói"]].map(([key, label]) => {
            const value = scores[key];
            const detail = key === "listening" ? `${listening.correct}/${listening.total}` : key === "reading" ? `${reading.correct}/${reading.total}` : "";
            return (
              <div key={key} className="rounded-xl border border-ink/[0.08] p-3 dark:border-white/[0.08]">
                <p className="text-xs font-semibold text-ink/60 dark:text-white/60">{label}</p>
                <p className="metric mt-1 text-2xl">{typeof value === "number" ? value : "—"}</p>
                <p className="mt-0.5 text-xs text-ink/50 dark:text-white/50">
                  {typeof value === "number" ? (detail ? `${detail} câu đúng` : "điểm 0–10") : "chưa chấm"}
                </p>
              </div>
            );
          })}
        </div>

        {missing.length > 0 && (
          <p className="mt-4 rounded-xl bg-warnbg/50 p-3 text-xs leading-5 text-ink/80 dark:text-white/80">
            Điểm trung bình hiện chỉ tính các kỹ năng đã có điểm ({Object.keys(scores).map((key) => SECTION_LABELS[key]).join(", ")}).
            Hãy chấm {missing.join(" và ")} bằng AI (hoặc tự chấm checklist) để có kết quả sát thực tế hơn.
          </p>
        )}

        <div className="mt-5 flex flex-wrap gap-2">
          <button type="button" onClick={save} disabled={saved} className="btn-primary px-4">
            {saved ? <><Check size={16} />Đã lưu vào lịch sử</> : <><Save size={16} />Lưu vào lịch sử</>}
          </button>
          <button type="button" onClick={onRetry} className="btn-secondary px-4"><RotateCcw size={16} />Làm lại đề này</button>
          <button type="button" onClick={onExit} className="btn-ghost px-4">Về danh sách đề</button>
        </div>
      </section>

      {(typeof writingScore === "number" || typeof speakingScore === "number") && (
        <section className="panel p-5 print-report">
          <p className="eyebrow">Điểm mỗi kỹ năng</p>
          <ul className="mt-3 space-y-2 text-sm">
            {Object.entries(scores).map(([key, value]) => (
              <li key={key} className="flex items-center justify-between gap-3 rounded-xl bg-ink/[0.04] px-3 py-2 dark:bg-white/[0.06]">
                <span className="font-semibold">{SECTION_LABELS[key]}</span>
                <span className="font-bold">{value}/10</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-ink/60 dark:text-white/60">
            Thời gian làm bài: {Math.round((result.durationSeconds || 0) / 60)} phút.
          </p>
        </section>
      )}

      <div className="no-print flex flex-wrap gap-2">
        {tabs.map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setView(key)}
            aria-pressed={view === key}
            className={`min-h-[44px] rounded-xl px-4 text-sm font-bold transition ${view === key ? "bg-lime text-ink" : "border border-ink/10 text-ink/70 hover:bg-ink/[0.05] dark:border-white/15 dark:text-white/70"}`}
          >
            {label}
          </button>
        ))}
      </div>

      {view === "listening" && <ListeningSection exam={exam} answers={result.responses} onAnswer={() => {}} mode="review" review={listening} startIndex={0} />}
      {view === "reading" && <ReadingSection exam={exam} answers={result.responses} onAnswer={() => {}} mode="review" review={reading} startIndex={listening.total} />}

      {view === "writing" && (
        <div className="space-y-4">
          <section className="panel p-4 sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="eyebrow flex items-center gap-2"><Target size={14} />Chấm phần Viết</p>
                <p className="mt-1 text-sm text-ink/70 dark:text-white/70">
                  {writingAiScores.length
                    ? `Điểm AI: ${writingScore}/10 (đã chấm ${writingAiScores.length}/${exam.writing.tasks.length} task)`
                    : `Tạm tính theo checklist: ${writingSelfScore}/10 — nên chấm bằng AI để chính xác hơn.`}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {(exam.writing?.tasks || []).map((task) => (
                  <button key={task.id} type="button" onClick={() => gradeWriting(task)} disabled={busy === `w-${task.id}`} className="btn-secondary px-3 text-xs">
                    {busy === `w-${task.id}` ? <LoaderCircle size={14} className="animate-spin" /> : <Sparkles size={14} />}Chấm Task {task.task} bằng AI
                  </button>
                ))}
              </div>
            </div>
            {!apiKey && <p className="mt-2 text-xs text-warn">Chưa có API key — mở Cài đặt → Kết nối AI (Gemini/Groq/DeepSeek) để dùng tính năng chấm tự động.</p>}
          </section>
          <WritingSection exam={exam} writings={result.writings} onWrite={() => {}} mode="review" review={{ writing: writingFeedback }} checks={result.writingChecks} onCheck={() => {}} />
        </div>
      )}

      {view === "speaking" && (
        <div className="space-y-4">
          <section className="panel p-4 sm:p-5">
            <p className="eyebrow flex items-center gap-2"><Target size={14} />Chấm phần Nói</p>
            <p className="mt-1 text-sm text-ink/70 dark:text-white/70">
              Chấm dựa trên bản ghi lời nói (nhận dạng giọng nói của trình duyệt). Hãy đọc lại yêu cầu từng phần và so với bài mẫu.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {(exam.speaking?.parts || []).map((part) => (
                <button key={part.id} type="button" onClick={() => gradeSpeaking(part)} disabled={busy === `s-${part.id}`} className="btn-secondary px-3 text-xs">
                  {busy === `s-${part.id}` ? <LoaderCircle size={14} className="animate-spin" /> : <Sparkles size={14} />}Chấm {part.title} bằng AI
                </button>
              ))}
            </div>
          </section>
          <SpeakingSection exam={exam} speaking={result.speaking} onSpeak={() => {}} mode="review" review={{ speaking: speakingFeedback }} />
        </div>
      )}

      <section className="panel p-4 sm:p-5 print-report">
        <p className="eyebrow flex items-center gap-2"><BookOpenCheck size={14} />Việc nên làm tiếp</p>
        <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-6">
          {listening.percent < 70 && <li>Nghe dưới 70%: luyện lại phần Nghe của đề này ở chế độ luyện, kèm xem transcript.</li>}
          {reading.percent < 70 && <li>Đọc dưới 70%: đọc lại các bài đọc và ghi lại từ khoá chưa hiểu.</li>}
          {typeof writingScore === "number" && writingScore < 6 && <li>Viết dưới 6: viết lại Task 2 theo nhận xét của AI (mục tiêu 250+ từ, đủ 3 phần).</li>}
          {typeof speakingScore === "number" && speakingScore < 6 && <li>Nói dưới 6: trả lời lại từng phần, dùng bài mẫu để học cụm từ rồi nói lại trong 2 phút.</li>}
          {listening.percent >= 70 && reading.percent >= 70 && <li>Tốt! Hãy thử đề ở bậc cao hơn để tăng độ khó.</li>}
        </ul>
      </section>
    </div>
  );
}
