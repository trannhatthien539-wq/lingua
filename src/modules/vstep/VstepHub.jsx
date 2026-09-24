import { useCallback, useEffect, useState } from "react";
import { BookOpen, Clock3, GraduationCap, History, LoaderCircle, PlayCircle, Sparkles, Target, Trash2 } from "lucide-react";
import ModuleHero from "../../components/ui/ModuleHero";
import ModuleTabs from "../../components/ui/ModuleTabs";
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
  { id: "handbook", label: "Sổ tay", icon: BookOpen },
  { id: "vocabulary", label: "Từ vựng", icon: Target },
  { id: "phrases", label: "Mẫu câu", icon: Sparkles },
  { id: "history", label: "Lịch sử", icon: History },
];

/** Tóm tắt cấu trúc đề — thay cho đoạn văn mô tả dài. */
const SKILL_SUMMARY = [
  { label: "Nghe", detail: "35 câu · 40′" },
  { label: "Đọc", detail: "40 câu · 60′" },
  { label: "Viết", detail: "2 task · 60′" },
  { label: "Nói", detail: "3 phần · 12′" },
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

  return (
    <div className="space-y-5">
      <ModuleHero
        icon={GraduationCap}
        eyebrow="VSTEP · B1 – B2 – C1"
        title="Sẵn sàng cho kỳ thi VSTEP"
        description="Đi một chiều như thi thật, luyện cả 4 kỹ năng và theo dõi điểm số của bạn."
        accent="#ff5a5f"
        deep="#b62d3a"
        illustration="exam"
        progress={Math.round((attempts.length / Math.max(1, examsByLevel('all').length)) * 100)}
        progressLabel="Số đề đã từng thử"
        stats={[{ label: 'Đã thi', value: attempts.length }, { label: 'Điểm gần nhất', value: attempts.length ? `${attempts[attempts.length - 1].average}/10` : '—' }, { label: 'Bản nháp', value: draftCount }]}
        action="Thử đề đầu tiên"
        onAction={() => examsByLevel('all')[0] && openExam(examsByLevel('all')[0].id, 'exam')}
        actionDisabled={loadingId === examsByLevel('all')[0]?.id}
      >
        <ModuleTabs items={VIEWS} value={view} onChange={setView} ariaLabel="Chọn nội dung VSTEP" />
      </ModuleHero>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {SKILL_SUMMARY.map((item) => <div key={item.label} className="rounded-xl border border-ink/[0.08] bg-white px-3 py-2 shadow-sm dark:border-white/[0.08] dark:bg-dark1"><p className="text-xs font-bold">{item.label}</p><p className="text-xs text-ink/50 dark:text-white/50">{item.detail}</p></div>)}
      </div>

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
              {examsByLevel(level).length} đề · 75 câu Nghe + Đọc, 2 Viết, 3 Nói
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {examsByLevel(level).map((meta) => {
              const best = bestFor(meta.id);
              const last = attempts.filter((item) => item.examId === meta.id).slice(-1)[0];
              return (
                <article key={meta.id} className="panel group flex h-full flex-col overflow-hidden p-0 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg" style={{ borderBottom: `4px solid #ff4b4b` }}>
                  <div className="border-b border-ink/[0.08] bg-gradient-to-br from-[#fff0f0] via-[#fffafa] to-[#ffe5e5] p-5 dark:from-[#3a2022] dark:via-[#2d1a1c] dark:to-[#261516]">
                    <div className="flex items-center justify-between gap-3"><span className="grid h-14 w-14 place-items-center rounded-2xl bg-white/75 text-[#ff4b4b] shadow-sm"><GraduationCap size={28} /></span><span className="rounded-full bg-ink/65 px-2.5 py-1 text-xs font-bold text-white">{meta.level}</span></div>
                    <p className="mt-3 text-xs font-bold uppercase tracking-[0.1em] text-[#b62d3a] dark:text-[#ffb0b0]">{meta.tags.join(" · ")}</p><h3 className="mt-1 font-display text-lg font-bold text-ink dark:text-white">{meta.title}</h3><p className="mt-1 text-xs text-ink/60 dark:text-white/60">35 Nghe · 40 Đọc · 2 Viết · 3 Nói · 172 phút</p>
                  </div>
                  <div className="flex flex-1 flex-col p-4 sm:p-5">
                    <div className="flex items-start justify-between gap-3"><p className="text-sm text-ink/65 dark:text-white/65">{last ? `Lần gần nhất: ${new Date(last.at).toLocaleDateString("vi-VN")}` : "Chưa có lần thi nào"}</p>{best ? <span className="shrink-0 text-right"><span className="metric block text-lg">{best.average}/10</span><span className="text-xs font-bold text-sage">{bandFor(best.average).label}</span></span> : <span className="chip bg-ink/[0.06] text-ink/60 dark:bg-white/10 dark:text-white/60">Chưa thi</span>}</div>
                    <div className="mt-4 flex flex-wrap gap-2"><button type="button" onClick={() => openExam(meta.id, "exam")} disabled={loadingId === meta.id} className="btn-primary flex-1 px-4">{loadingId === meta.id ? <LoaderCircle size={16} className="animate-spin" /> : <PlayCircle size={16} />}Thi thật</button><button type="button" onClick={() => openExam(meta.id, "practice")} disabled={loadingId === meta.id} className="btn-secondary flex-1 px-4"><BookOpen size={16} />Luyện từng kỹ năng</button></div>
                  </div>
                </article>
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
