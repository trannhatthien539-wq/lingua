import { useMemo, useState } from "react";
import { AlertTriangle, Layers, ListChecks, Sparkles, Trash2 } from "lucide-react";
import CollapsibleCard from "./ui/CollapsibleCard";
import GrammarQuiz from "../modules/grammar/GrammarQuiz";
import useGrammarProgress from "../hooks/useGrammarProgress";
import useMistakeBank, { MISTAKE_SOURCE_LABELS } from "../hooks/useMistakeBank";
import useSectionState from "../hooks/useSectionState";
import { dataService } from "../services/dataService";
import { toast } from "../services/toast";

const DECK_TITLE = "Sổ câu sai · Nghe/Đọc/VSTEP";
const MAX_RETRY = 20;

const truncate = (value, max = 70) => {
  const text = String(value || "");
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
};

/**
 * Sổ câu sai hợp nhất: Ngữ pháp + Nghe + Đọc + VSTEP.
 * Cho phép luyện lại ngay và chuyển câu sai thành bộ flashcard để ôn bằng SRS.
 */
export default function MistakeBankCard({ apiKey = "", provider = "gemini" }) {
  const { mistakes: grammarMistakes, removeMistake, clearMistakes: clearGrammar, recordMistakes: recordGrammar } = useGrammarProgress();
  const { mistakes: bankMistakes, stats, remove: removeBank, clear: clearBank, record: recordBank, recordRetry } = useMistakeBank();
  const [open, toggleOpen] = useSectionState("progress-mistakes", true);
  const [quizOpen, setQuizOpen] = useState(false);
  const [busy, setBusy] = useState("");

  /** Gộp câu sai ngữ pháp và câu sai kỹ năng/VSTEP thành một danh sách. */
  const items = useMemo(() => {
    const grammar = grammarMistakes.map((entry) => ({
      key: `grammar:${entry.questionId}`,
      scope: "grammar",
      source: "grammar",
      label: entry.lessonTitle || "Ngữ pháp",
      prompt: entry.prompt,
      answer: entry.answer,
      explain: entry.explain,
      response: entry.response,
      count: entry.count || 1,
      question: entry.question,
    }));
    const others = bankMistakes.map((entry) => ({
      key: entry.key,
      scope: "bank",
      source: entry.source,
      refId: entry.refId,
      label: entry.label,
      prompt: entry.prompt,
      answer: entry.answer || (entry.answers || [])[0] || "",
      explain: entry.explain,
      response: entry.response,
      count: entry.count || 1,
      question: {
        id: entry.key,
        mistakeKey: entry.key,
        source: entry.source,
        refId: entry.refId,
        label: entry.label,
        type: entry.type,
        prompt: entry.prompt,
        options: entry.options,
        answer: entry.answer,
        answers: entry.answers,
        explain: entry.explain,
      },
    }));
    return [...grammar, ...others].sort((first, second) => (second.count || 0) - (first.count || 0));
  }, [grammarMistakes, bankMistakes]);

  const retryQuestions = useMemo(() => items.map((item) => item.question).slice(0, MAX_RETRY), [items]);

  const summary = useMemo(() => {
    const bySource = { ...(stats.bySource || {}) };
    if (grammarMistakes.length) bySource.grammar = grammarMistakes.length;
    return Object.entries(bySource)
      .filter(([, value]) => value > 0)
      .map(([source, value]) => `${value} ${MISTAKE_SOURCE_LABELS[source] || "Ngữ pháp"}`)
      .join(" · ");
  }, [stats, grammarMistakes.length]);

  const handleRemove = (item) => {
    if (item.scope === "grammar") removeMistake(item.question?.id || item.key.replace("grammar:", ""));
    else removeBank(item.key);
  };

  const handleClear = () => {
    if (!window.confirm("Xoá toàn bộ sổ câu sai (ngữ pháp + kỹ năng + VSTEP)?")) return;
    clearGrammar();
    clearBank();
    toast.success("Đã xoá sổ câu sai.");
  };

  /** Chuyển câu sai thành flashcard để ôn bằng SRS ở tab Từ vựng. */
  const createDeck = async () => {
    if (!items.length) return;
    setBusy("deck");
    try {
      const decks = await dataService.getDecks();
      let deck = decks.find((entry) => entry.title === DECK_TITLE);
      if (!deck) deck = await dataService.createDeck(DECK_TITLE);
      const existing = await dataService.getCards(deck.id);
      const seen = new Set(existing.map((card) => card.word));
      const cards = items
        .filter((item) => item.prompt && !seen.has(truncate(item.prompt)))
        .map((item) => ({
          deckId: deck.id,
          word: truncate(item.prompt),
          ipa: "",
          meaning: `Đáp án: ${item.answer || "(xem lại)"}`,
          example: `${item.prompt}${item.explain ? `\n(${item.explain})` : ""}`,
          level: "B1",
          status: "new",
          reviewDate: null,
          interval: 0,
          nextReviewDate: null,
          repetition: 0,
        }));
      if (!cards.length) {
        toast.info("Các câu sai này đã có trong bộ thẻ.");
        return;
      }
      await dataService.addCards(cards);
      toast.success(`Đã thêm ${cards.length} câu vào bộ “${DECK_TITLE}” ở tab Từ vựng.`);
    } catch (error) {
      toast.error(error.message || "Không thể tạo bộ thẻ.");
    } finally {
      setBusy("");
    }
  };

  return (
    <CollapsibleCard
      id="progress-mistakes"
      icon={AlertTriangle}
      eyebrow="Ôn tập cá nhân"
      title="Sổ câu sai (Ngữ pháp · Nghe · Đọc · VSTEP)"
      description={items.length ? `${items.length} câu bạn từng làm sai — luyện lại hoặc chuyển thành flashcard` : "Câu làm sai ở Ngữ pháp, Nghe, Đọc, VSTEP sẽ tự động vào đây"}
      badge={<span className={`chip ${items.length ? "bg-warnbg text-warn" : "bg-ink/[0.06] text-ink/60 dark:bg-white/10 dark:text-white/60"}`}>{items.length} câu</span>}
      open={open}
      onToggle={toggleOpen}
    >
      {!items.length ? (
        <p className="text-sm text-ink/60 dark:text-white/60">
          Chưa có câu sai nào. Làm bài luyện tập hoặc thi thử — câu sai sẽ được lưu tự động để bạn ôn lại sau.
        </p>
      ) : (
        <>
          {summary && (
            <p className="text-xs font-bold uppercase tracking-[0.06em] text-ink/55 dark:text-white/55">{summary}</p>
          )}
          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" onClick={() => setQuizOpen((value) => !value)} className="btn-primary px-4">
              <Sparkles size={16} />
              {quizOpen ? "Ẩn phần luyện lại" : `Luyện lại ${Math.min(items.length, MAX_RETRY)} câu sai`}
            </button>
            <button type="button" onClick={createDeck} disabled={busy === "deck"} className="btn-secondary px-4">
              <Layers size={16} />
              {busy === "deck" ? "Đang tạo…" : "Tạo bộ flashcard"}
            </button>
            <button type="button" onClick={handleClear} className="btn-ghost px-3 text-xs text-danger dark:text-dangerfgdark">
              <Trash2 size={14} />
              Xoá sổ
            </button>
          </div>

          {quizOpen && retryQuestions.length > 0 && (
            <div className="mt-4">
              <GrammarQuiz
                key={`mistake-bank-${retryQuestions.length}`}
                questions={retryQuestions}
                immediate
                limit={MAX_RETRY}
                title="Luyện câu sai"
                subtitle={`${retryQuestions.length} câu · đáp án hiện ngay sau mỗi câu`}
                finishLabel="Xong"
                apiKey={apiKey}
                provider={provider}
                onAnswerResult={(detail) => {
                  // Câu ngữ pháp có lessonId → ghi vào sổ ngữ pháp; còn lại ghi vào sổ chung.
                  if (detail?.question?.lessonId) recordGrammar([detail]);
                  else recordBank([detail], "reading");
                }}
                onFinish={(correct, total) => {
                  recordRetry(correct, total);
                  setQuizOpen(false);
                }}
              />
            </div>
          )}

          <ul className="mt-4 space-y-2">
            {items.slice(0, 20).map((item) => (
              <li key={item.key} className="rounded-xl border border-ink/[0.08] p-3 dark:border-white/[0.08]">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <p className="min-w-0 flex-1 text-sm font-semibold leading-6">{item.prompt}</p>
                  <span className="chip shrink-0 bg-ink/[0.06] text-ink/70 dark:bg-white/10 dark:text-white/70">
                    {MISTAKE_SOURCE_LABELS[item.source] || "Ngữ pháp"}
                  </span>
                </div>
                <p className="mt-1.5 text-xs text-ink/70 dark:text-white/70">
                  Bạn trả lời: <span className="font-bold">{item.response || "(bỏ trống)"}</span>
                </p>
                <p className="mt-0.5 text-xs text-ink/70 dark:text-white/70">
                  Đáp án: <span className="font-bold text-sage">{item.answer || "(xem giải thích)"}</span>
                </p>
                {item.explain && <p className="mt-1 text-xs text-ink/60 dark:text-white/60">{item.explain}</p>}
                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                  <span className="chip bg-warnbg text-warn">sai {item.count} lần</span>
                  <button
                    type="button"
                    onClick={() => handleRemove(item)}
                    className="inline-flex min-h-[36px] items-center gap-1.5 rounded-lg px-2.5 font-bold text-danger transition hover:bg-danger/10 dark:text-dangerfgdark"
                  >
                    <Trash2 size={13} />Đã hiểu, xoá
                  </button>
                </div>
              </li>
            ))}
          </ul>
          {items.length > 20 && (
            <p className="mt-2 flex items-center gap-1.5 text-xs text-ink/55 dark:text-white/55">
              <ListChecks size={13} />Còn {items.length - 20} câu khác trong sổ — bấm “Luyện lại” để ôn hết.
            </p>
          )}
        </>
      )}
    </CollapsibleCard>
  );
}
