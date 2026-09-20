import { useCallback, useEffect, useState } from "react";
import { BookOpen, Clock3, GraduationCap, History, LoaderCircle, PlayCircle, Sparkles, Target, Trash2 } from "lucide-react";
import VstepExamRunner from "./VstepExamRunner";
import VstepResult from "./VstepResult";
import DocHandbook from "./docs/DocHandbook";
import DocVocabulary from "./docs/DocVocabulary";
import DocPhrases from "./docs/DocPhrases";
import { examQuestions, isAnswerCorrect, loadFullExam, SECTION_LABELS, skillOrder } from "../../services/vstepService";
import { examsByLevel, VSTEP_LEVELS } from "../../data/vstep/registry";
import useVstepProgress from "../../hooks/useVstepProgress";
import useMistakeBank from "../../hooks/useMistakeBank";
import { consumePendingItem } from "../../services/deepLink";
import { bandFor } from "../../data/vstep/bands";
import { toast } from "../../services/toast";

const VIEWS = [
  { id: "exams", label: "Bộ đề", icon: GraduationCap },
  { id: "handbook", label: "Sổ tay VSTEP", icon: BookOpen },
  { id: "vocabulary", label: "Từ vựng", icon: Target },
  { id: "phrases", label: "Mẫu câu", icon: Sparkles },
  { id: "history", label: "Lịch sử thi", icon: History },
];

/** Tab VSTEP: danh sách đề, thi thật 4 kỹ năng, sổ tay/từ vựng/mẫu câu và lịch sử thi. */
export default function VstepHub({ apiKey, onStudyActivity }) {
  const [view, setView] = useState("exams");
  const [level, setLevel] = useState("all");
  const [phase, setPhase] = useState("list");
  const [exam, setExam] = useState(null);
  const [mode, setMode] = useState("exam");
  const [result, setResult] = useState(null);
  const [saved, setSaved] = useState(false);
  const [loadingId, setLoadingId] = useState("");
  const { attempts, drafts, recordAttempt, saveDraft, bestFor, clearHistory } = useVstepProgress();
  const { record: recordMistakes } = useMistakeBank();
  const provider = typeof localStorage !== "undefined" ? localStorage.getItem("lingua-ai-provider") || "gemini" : "gemini";

  const openExam = useCallback(async (id, nextMode) => {
    setLoadingId(id);
    try {
      const loaded = await loadFullExam(id);
      setExam(loaded);
      setMode(nextMode);
      setResult(null);
      setSaved(false);
      setPhase("running");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      toast.error(error.message || "Không thể mở đề này.");
    } finally {
      setLoadingId("");
    }
  }, []);

  // Mở đúng đề/tài liệu khi đến từ tìm kiếm toàn cục (Ctrl/⌘+K).
  useEffect(() => {
    const pending = consumePendingItem("vstep");
    if (!pending) return;
    if (pending.type === "vstep" && pending.itemId) void openExam(pending.itemId, "exam");
    else if (["handbook", "vocabulary", "phrases"].includes(pending.itemId)) setView(pending.itemId);
  }, [openExam]);

  /** Thi xong một đề: lưu nháp Writing, ghi câu sai vào sổ rồi chuyển sang màn hình kết quả. */
  const finish = (payload) => {
    setResult(payload);
    setPhase("result");
    window.scrollTo({ top: 0, behavior: "smooth" });
    onStudyActivity?.();
    Object.entries(payload.writings || {}).forEach(([taskId, text]) => {
      if (text?.trim()) saveDraft(exam.id, taskId, text);
    });
    // Ghi lại câu sai phần Nghe/Đọc (chỉ câu đã trả lời) để luyện lại ở Sổ câu sai.
    const wrong = [];
    ["listening", "reading"].forEach((section) => {
      examQuestions(exam, section).forEach((question, index) => {
        const response = payload.responses?.[question.id];
        if (response === undefined || response === null || response === "") return;
        if (isAnswerCorrect(question, response)) return;
        wrong.push({ id: `${section}-${index}`, question, response, correct: false });
      });
    });
    if (wrong.length) recordMistakes(wrong, "vstep", exam.id, `VSTEP ${String(exam.id).toUpperCase()}`);
  };

  if (phase === "running" && exam) {
    return (
      <VstepExamRunner
        exam={exam}
        mode={mode}
        onExit={() => { setPhase("list"); setExam(null); }}
        onSubmit={finish}
      />
    );
  }

  const draftCount = draftKeyPreview(drafts).length;

  if (phase === "result" && exam && result) {
    return (
      <VstepResult
        exam={exam}
        result={result}
        apiKey={apiKey}
        provider={provider}
        saved={saved}
        onSave={(attempt) => { recordAttempt(attempt); setSaved(true); }}
        onRetry={() => openExam(exam.id, mode)}
        onExit={() => { setPhase("list"); setExam(null); setResult(null); }}
      />
    );
  }

  const deckDraft = draftKeyPreview(drafts);

  return (
    <div className="space-y-5">
      <section className="panel p-5 print-report">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="eyebrow">VSTEP · B1 – B2 – C1</p>
            <h2 className="mt-1 font-display text-xl font-bold">Thi thử như thi thật, đủ 4 kỹ năng</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-ink/70 dark:text-white/70">
              Mỗi đề gồm Nghe (35 câu · 40 phút), Đọc (40 câu · 60 phút), Viết (2 task · 60 phút) và Nói (3 phần · 12 phút).
              Bài thi đi một chiều, có đồng hồ từng kỹ năng và không xem đáp án trước khi nộp.
            </p>
          </div>
          {attempts.length > 0 && (
            <div className="rounded-xl bg-ink/[0.04] p-3 text-right dark:bg-white/[0.06]">
              <p className="text-xs text-ink/60 dark:text-white/60">Lần thi gần nhất</p>
              <p className="metric text-xl">{attempts[attempts.length - 1].average}/10</p>
              <p className="text-xs font-bold text-sage">{bandFor(attempts[attempts.length - 1].average).label}</p>
            </div>
          )}
        </div>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {VIEWS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setView(item.id)}
              aria-pressed={view === item.id}
              className={`inline-flex min-h-[44px] items-center gap-2 rounded-xl px-3.5 text-sm font-bold transition ${view === item.id ? "bg-lime text-ink" : "text-ink/70 hover:bg-ink/[0.05] dark:text-white/70 dark:hover:bg-white/[0.08]"}`}
            >
              <item.icon size={15} />{item.label}
            </button>
          ))}
        </div>
      </section>

      {view === "exams" && (
        <>
          <div className="flex flex-wrap items-center gap-2">
            {["all", ...VSTEP_LEVELS].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setLevel(item)}
                aria-pressed={level === item}
                className={`min-h-[40px] rounded-xl px-3.5 text-xs font-bold transition ${level === item ? "bg-ink text-white dark:bg-lime dark:text-ink" : "border border-ink/10 text-ink/70 hover:bg-ink/[0.05] dark:border-white/15 dark:text-white/70"}`}
              >
                {item === "all" ? "Tất cả bậc" : item}
              </button>
            ))}
            <span className="ml-auto text-xs font-semibold text-ink/60 dark:text-white/60">
              {examsByLevel(level).length} đề · mỗi đề 75 câu Nghe + Đọc, 2 task Viết, 3 phần Nói
            </span>
          </div>

          <div className="grid gap-3 lg:grid-cols-2">
            {examsByLevel(level).map((meta) => {
              const best = bestFor(meta.id);
              const last = attempts.filter((item) => item.examId === meta.id).slice(-1)[0];
              return (
                <section key={meta.id} className="panel p-4 sm:p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="eyebrow">{meta.level} · {meta.tags.join(" · ")}</p>
                      <h3 className="mt-1 font-display text-base font-bold">{meta.title}</h3>
                      <p className="mt-1 text-xs text-ink/60 dark:text-white/60">
                        35 câu Nghe + 40 câu Đọc · 2 task Viết · 3 phần Nói · tổng 172 phút
                      </p>
                    </div>
                    <div className="text-right">
                      {best ? (
                        <>
                          <p className="metric text-lg">{best.average}/10</p>
                          <p className="text-xs font-bold text-sage">Cao nhất · {bandFor(best.average).id}</p>
                        </>
                      ) : (
                        <span className="chip bg-ink/[0.06] text-ink/60 dark:bg-white/10 dark:text-white/60">Chưa thi</span>
                      )}
                    </div>
                  </div>
                  {last && (
                    <p className="mt-2 text-xs text-ink/55 dark:text-white/55">
                      Lần gần nhất: {new Date(last.at).toLocaleDateString("vi-VN")} · {SECTION_LABELS.listening} {last.scores?.listening ?? "—"} · {SECTION_LABELS.reading} {last.scores?.reading ?? "—"}
                    </p>
                  )}
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button type="button" onClick={() => openExam(meta.id, "exam")} disabled={loadingId === meta.id} className="btn-primary px-4">
                      {loadingId === meta.id ? <LoaderCircle size={16} className="animate-spin" /> : <PlayCircle size={16} />}Thi thật
                    </button>
                    <button type="button" onClick={() => openExam(meta.id, "practice")} disabled={loadingId === meta.id} className="btn-secondary px-4">
                      <BookOpen size={16} />Luyện từng kỹ năng
                    </button>
                  </div>
                </section>
              );
            })}
          </div>
        </>
      )}

      {view === "handbook" && <DocHandbook />}
      {view === "vocabulary" && <DocVocabulary />}
      {view === "phrases" && <DocPhrases />}

      {view === "history" && (
        <section className="panel p-5 print-report">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="eyebrow flex items-center gap-2"><History size={14} />Lịch sử thi ({attempts.length})</p>
            {attempts.length > 0 && (
              <button
                type="button"
                onClick={() => { if (window.confirm("Xoá toàn bộ lịch sử thi VSTEP?")) { clearHistory(); toast.success("Đã xoá lịch sử thi."); } }}
                className="btn-ghost px-3 text-xs text-danger dark:text-dangerfgdark"
              >
                <Trash2 size={14} />Xoá lịch sử
              </button>
            )}
          </div>
          {attempts.length === 0 ? (
            <p className="mt-3 text-sm text-ink/60 dark:text-white/60">Chưa có lần thi nào. Hãy bắt đầu với một đề ở bậc phù hợp.</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {[...attempts].reverse().map((attempt) => (
                <li key={`${attempt.examId}-${attempt.at}`} className="rounded-xl border border-ink/[0.08] p-3 dark:border-white/[0.08]">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold">{attempt.examTitle}</p>
                      <p className="text-xs text-ink/60 dark:text-white/60">
                        {new Date(attempt.at).toLocaleString("vi-VN")} · {Math.round((attempt.durationSeconds || 0) / 60)} phút
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="metric text-lg">{attempt.average}/10</p>
                      <p className="text-xs font-bold text-sage">{bandFor(attempt.average).label}</p>
                    </div>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {skillOrder.map((key) => (
                      <span key={key} className="chip bg-ink/[0.06] text-ink/70 dark:bg-white/10 dark:text-white/70">
                        {SECTION_LABELS[key]}: {typeof attempt.scores?.[key] === "number" ? `${attempt.scores[key]}/10` : "—"}
                      </span>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          )}
          {draftCount > 0 && (
            <p className="mt-3 flex items-center gap-2 text-xs text-ink/60 dark:text-white/60">
              <Clock3 size={13} />Bạn có {draftCount} bản nháp Writing được lưu tự động.
            </p>
          )}
        </section>
      )}
    </div>
  );
}

const draftKeyPreview = (drafts = {}) => Object.keys(drafts).filter((key) => String(drafts[key] || "").trim());
