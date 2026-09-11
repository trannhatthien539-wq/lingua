import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  Check,
  ChevronRight,
  LoaderCircle,
  Pencil,
  Plus,
  Search,
  Sparkles,
  Trash2,
  Volume2,
  X,
  XCircle,
  Download,
  FileUp,
} from "lucide-react";
import confetti from "canvas-confetti";
import { generateSmartVocabularyPrompt, parseAiJson, requestAi } from "../../services/aiService";
import { findVocabularyImageSafely } from "../../services/imageService";
import { useDebounce } from "../../hooks/useDebounce";
import { dataService } from "../../services/dataService";
import FlashcardModal from "../../components/learning/FlashcardModal";
import { speakText } from "../../utils/speech";
import ImportExportModal from "../../components/learning/ImportExportModal";
import StudyHubModal from "../../components/learning/StudyHubModal";
import QuizView from "../../components/learning/QuizView";
import SpellerView from "../../components/learning/SpellerView";
import MatchingView from "../../components/learning/MatchingView";
import { sanitizeCard } from "../../utils/sanitizeCard";
import SafeImage from "../../components/ui/SafeImage";
import { dateKey } from "../../utils/srs";

const STORAGE_KEY = "lingua-vocabulary-library";
const OLD_STORAGE_KEY = "lingua-vocabulary";
const PROVIDER_STORAGE = "lingua-ai-provider";
const levels = ["A1", "A2", "B1", "B2", "C1", "C2"];
const statuses = { new: "Mới", learning: "Đang học", mastered: "Thuộc" };

const makeId = (prefix) =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
const emptyLibrary = () => ({
  decks: [
    {
      id: makeId("deck"),
      title: "IELTS Speaking Part 1",
      tags: ["IELTS", "Speaking"],
      createdAt: new Date().toISOString(),
    },
  ],
  cards: [],
});

function readLibrary() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (stored?.decks && stored?.cards) return stored;
    const oldWords = JSON.parse(localStorage.getItem(OLD_STORAGE_KEY) || "[]");
    const library = emptyLibrary();
    library.cards = oldWords.map((item) => ({
      id: makeId("card"),
      deckId: library.decks[0].id,
      word: item.word || "",
      ipa: item.pronunciation || "",
      meaning: item.meaning || "",
      example: item.example || "",
      level: "B1",
      status: "new",
      reviewDate: null,
      interval: 0,
      nextReviewDate: null,
      repetition: 0,
      imageUrl: "",
    }));
    return library;
  } catch {
    return emptyLibrary();
  }
}

const quickLookupPrompt = (word) =>
  `Tra cứu từ tiếng Anh "${word}". Chỉ trả về JSON hợp lệ theo schema {"ipa":"...","meaning":"nghĩa tiếng Việt ngắn gọn","example":"một câu ví dụ tiếng Anh"}. Không markdown.`;
const normalizeWord = (word = "") => word.trim().replace(/\s+/g, " ").toLowerCase();
const titleCaseWord = (word = "") => word.trim().replace(/\s+/g, " ").split(" ").map((part) => part ? `${part[0].toUpperCase()}${part.slice(1).toLowerCase()}` : part).join(" ");

function FieldLabel({ children }) {
  return (
    <span className="mb-2 block text-xs font-bold text-ink/60 dark:text-white/60">
      {children}
    </span>
  );
}

function ErrorMessage({ message, onClose }) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-xl bg-red-50 p-3 text-xs leading-5 text-red-700 dark:bg-red-950/30 dark:text-red-200">
      <span>{message}</span>
      <button onClick={onClose} aria-label="Đóng lỗi">
        <X size={15} />
      </button>
    </div>
  );
}

function SuccessMessage({ message, onClose }) {
  return <div className="flex items-start justify-between gap-3 rounded-xl bg-emerald-50 p-3 text-xs leading-5 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-200"><span>{message}</span><button onClick={onClose} aria-label="Đóng thông báo"><X size={15} /></button></div>;
}

function StatusBadge({ status }) {
  const styles =
    status === "mastered"
      ? "bg-[#e6f3e8] text-[#568460] dark:bg-[#293f31] dark:text-[#a9d5af]"
      : status === "learning"
        ? "bg-lime text-ink"
        : "bg-ink/[0.06] text-ink/50 dark:bg-white/10 dark:text-white/50";
  return (
    <span className={`rounded-full px-2 py-1 text-[10px] font-bold ${styles}`}>
      {statuses[status]}
    </span>
  );
}

function ManualCardModal({ draft, levels, busy, onChange, onSuggest, onSave, onClose }) {
  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-ink/40 p-4 backdrop-blur-sm">
      <section className="panel max-h-[90vh] w-full max-w-xl overflow-y-auto p-6">
        <div className="flex items-start justify-between gap-4"><div><p className="eyebrow">New vocabulary card</p><h2 className="mt-1 font-display text-xl font-bold">Thêm thẻ mới</h2></div><button onClick={onClose} aria-label="Đóng"><X size={18} /></button></div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="sm:col-span-2"><FieldLabel>Từ vựng *</FieldLabel><input autoFocus value={draft.word} onChange={(event) => onChange("word", event.target.value)} placeholder="accommodation" className="w-full rounded-xl border border-ink/10 bg-transparent px-3 py-3 text-sm outline-none dark:border-white/10" /></label>
          <label><FieldLabel>Phiên âm IPA</FieldLabel><input value={draft.ipa} onChange={(event) => onChange("ipa", event.target.value)} placeholder="/əˌkɒməˈdeɪʃən/" className="w-full rounded-xl border border-ink/10 bg-transparent px-3 py-3 text-sm outline-none dark:border-white/10" /></label>
          <div className="flex items-end"><button onClick={onSuggest} disabled={busy || !draft.word.trim()} className="flex w-full items-center justify-center gap-2 rounded-xl bg-lime px-3 py-3 text-xs font-bold text-ink disabled:opacity-50"><Sparkles size={15} />AI gợi ý IPA & Nghĩa</button></div>
          <label className="sm:col-span-2"><FieldLabel>Định nghĩa tiếng Việt *</FieldLabel><textarea value={draft.meaning} onChange={(event) => onChange("meaning", event.target.value)} rows={2} placeholder="Nơi ở, chỗ ở" className="w-full resize-none rounded-xl border border-ink/10 bg-transparent px-3 py-3 text-sm outline-none dark:border-white/10" /></label>
          <label><FieldLabel>Ví dụ tiếng Anh</FieldLabel><textarea value={draft.example} onChange={(event) => onChange("example", event.target.value)} rows={3} placeholder="We booked accommodation near the station." className="w-full resize-none rounded-xl border border-ink/10 bg-transparent px-3 py-3 text-sm outline-none dark:border-white/10" /></label>
          <label><FieldLabel>Dịch nghĩa ví dụ</FieldLabel><textarea value={draft.exampleTranslation} onChange={(event) => onChange("exampleTranslation", event.target.value)} rows={3} placeholder="Chúng tôi đặt chỗ ở gần nhà ga." className="w-full resize-none rounded-xl border border-ink/10 bg-transparent px-3 py-3 text-sm outline-none dark:border-white/10" /></label>
          <label><FieldLabel>Cấp độ</FieldLabel><select value={draft.level} onChange={(event) => onChange("level", event.target.value)} className="w-full rounded-xl border border-ink/10 bg-transparent px-3 py-3 text-sm outline-none dark:border-white/10">{levels.map((item) => <option key={item}>{item}</option>)}</select></label>
        </div>
        <div className="mt-6 flex justify-end gap-2"><button onClick={onClose} className="rounded-xl border border-ink/10 px-4 py-3 text-sm font-bold dark:border-white/10">Hủy</button><button onClick={onSave} disabled={busy} className="rounded-xl bg-ink px-5 py-3 text-sm font-bold text-white disabled:opacity-50 dark:bg-lime dark:text-ink">{busy ? "Đang lưu..." : "Lưu thẻ"}</button></div>
      </section>
    </div>
  );
}

const shuffle = (items) => [...items].sort(() => Math.random() - 0.5);

function playQuizSound(correct) {
  if (!window.AudioContext) return;
  const context = new window.AudioContext();
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = correct ? "sine" : "sawtooth";
  oscillator.frequency.setValueAtTime(correct ? 660 : 150, context.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(correct ? 990 : 90, context.currentTime + 0.18);
  gain.gain.setValueAtTime(0.08, context.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.22);
  oscillator.connect(gain).connect(context.destination);
  oscillator.start();
  oscillator.stop(context.currentTime + 0.22);
}

function PracticeSession({ deck, cards, onExit, onUpdateCard, onStudyActivity, streak }) {
  const [mode, setMode] = useState("flashcard");
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [answer, setAnswer] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [spelling, setSpelling] = useState("");
  const [results, setResults] = useState([]);
  const [completed, setCompleted] = useState(false);
  const card = cards[index];
  const quizOptions = useMemo(() => {
    if (!card) return [];
    const distractors = shuffle(
      cards
        .filter((item) => item.id !== card.id && item.word !== card.word)
        .map((item) => item.word),
    ).slice(0, 3);
    return shuffle([card.word, ...distractors]);
  }, [card?.id]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Enter" && answer !== null && mode === "quiz" && index < cards.length - 1) {
        event.preventDefault();
        nextQuestion();
        return;
      }
      if (mode !== "quiz" || answer !== null) return;
      const optionIndex = Number(event.key) - 1;
      if (optionIndex >= 0 && optionIndex < quizOptions.length) {
        event.preventDefault();
        quizAnswer(quizOptions[optionIndex]);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [answer, cards.length, index, mode, quizOptions]);

  const finish = async (nextResults) => {
    await onStudyActivity?.();
    setResults(nextResults);
    setCompleted(true);
  };

  const submitResult = (isCorrect) => {
    const nextResults = [...results, isCorrect];
    onUpdateCard(card.id, {
      status: isCorrect ? "mastered" : "learning",
      reviewDate: new Date(
        Date.now() + (isCorrect ? 3 : 1) * 86400000,
      ).toISOString(),
    });
    setAnswer(isCorrect);
    if (mode === "quiz") {
      playQuizSound(isCorrect);
      if (isCorrect) confetti({ particleCount: 90, spread: 70, origin: { y: 0.65 } });
    }
    if (index === cards.length - 1) finish(nextResults);
    else if (mode === "flashcard") {
      setIndex((current) => current + 1);
      setFlipped(false);
      setAnswer(null);
      setSpelling("");
    }
  };

  const leave = () => {
    setIndex(0);
    setCompleted(false);
    setResults([]);
    setFlipped(false);
    setAnswer(null);
    setSelectedOption(null);
    setSpelling("");
    onExit();
  };
  const quizAnswer = (option) => {
    if (answer === null) {
      setSelectedOption(option);
      submitResult(option === card.word);
    }
  };
  const spellingAnswer = (event) => {
    event.preventDefault();
    if (answer === null)
      submitResult(
        spelling.trim().toLowerCase() === card.word.trim().toLowerCase(),
      );
  };
  const nextQuestion = () => {
    setIndex((current) => current + 1);
    setAnswer(null);
    setSelectedOption(null);
    setSpelling("");
    setFlipped(false);
  };

  if (completed) {
    const correct = results.filter(Boolean).length;
    return (
      <div className="space-y-6">
        <button
          onClick={leave}
          className="flex items-center gap-2 text-sm font-bold text-ink/55 hover:text-ink dark:text-white/55 dark:hover:text-white"
        >
          <ArrowLeft size={16} />
          Quay lại bộ từ
        </button>
        <section className="panel mx-auto max-w-xl p-8 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-lime text-ink">
            <Check size={27} />
          </div>
          <p className="eyebrow mt-5">Session complete</p>
          <h2 className="mt-2 font-display text-2xl font-bold">
            Hoàn thành lượt học
          </h2>
          <p className="mt-2 text-sm text-ink/50 dark:text-white/50">
            {deck.title}
          </p>
          <div className="mt-8 grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-[#e6f3e8] p-4 dark:bg-[#293f31]">
              <p className="font-display text-2xl font-bold text-[#568460] dark:text-[#a9d5af]">
                {correct}
              </p>
              <p className="mt-1 text-xs text-ink/45 dark:text-white/45">
                Đúng
              </p>
            </div>
            <div className="rounded-xl bg-[#fff1ed] p-4 dark:bg-[#402c29]">
              <p className="font-display text-2xl font-bold text-red-600 dark:text-red-200">
                {results.length - correct}
              </p>
              <p className="mt-1 text-xs text-ink/45 dark:text-white/45">
                Cần ôn lại
              </p>
            </div>
            <div className="rounded-xl bg-mist p-4 dark:bg-[#29332f]">
              <p className="font-display text-2xl font-bold">
                {Math.round((correct / results.length) * 100)}%
              </p>
              <p className="mt-1 text-xs text-ink/45 dark:text-white/45">
                Điểm số
              </p>
            </div>
          </div>
          <div className="mt-6 rounded-xl bg-lime p-4 text-left">
            <p className="text-xs font-bold uppercase tracking-wider text-ink/55">
              Streak học tập
            </p>
            <p className="mt-1 font-display text-2xl font-bold">
              {streak?.currentStreak || 0} ngày liên tiếp
            </p>
            <p className="mt-1 text-xs text-ink/60">
              Tổng số phiên: {streak?.totalSessions || 0}
            </p>
          </div>
          <button
            onClick={leave}
            className="mt-6 w-full rounded-xl bg-ink py-3 text-sm font-bold text-white dark:bg-lime dark:text-ink"
          >
            Về thư viện
          </button>
        </section>
      </div>
    );
  }

  if (!card)
    return (
      <div className="panel p-8 text-center">
        <p className="font-bold">Bộ này chưa có từ để luyện tập.</p>
        <button onClick={onExit} className="mt-4 text-sm font-bold text-sage">
          Quay lại
        </button>
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={onExit}
          className="flex items-center gap-2 text-sm font-bold text-ink/55 hover:text-ink dark:text-white/55 dark:hover:text-white"
        >
          <ArrowLeft size={16} />
          Thoát luyện tập
        </button>
        <div className="text-right">
          <p className="font-display font-bold">
            {index + 1} / {cards.length}
          </p>
          <p className="text-xs text-ink/40 dark:text-white/40">{deck.title}</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-1 rounded-xl bg-ink/[0.06] p-1 dark:bg-white/[0.08]">
        <button
          onClick={() => {
            setMode("flashcard");
            setAnswer(null);
            setSelectedOption(null);
          }}
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-xs font-bold ${mode === "flashcard" ? "bg-white shadow-sm dark:bg-[#29332f]" : "text-ink/45 dark:text-white/45"}`}
        >
          Flashcard
        </button>
        <button
          onClick={() => {
            setMode("quiz");
            setAnswer(null);
            setSelectedOption(null);
          }}
          className={`flex-1 rounded-lg px-3 py-2.5 text-xs font-bold ${mode === "quiz" ? "bg-white shadow-sm dark:bg-[#29332f]" : "text-ink/45 dark:text-white/45"}`}
        >
          Trắc nghiệm
        </button>
        <button
          onClick={() => {
            setMode("spelling");
            setAnswer(null);
            setSelectedOption(null);
          }}
          className={`flex-1 rounded-lg px-3 py-2.5 text-xs font-bold ${mode === "spelling" ? "bg-white shadow-sm dark:bg-[#29332f]" : "text-ink/45 dark:text-white/45"}`}
        >
          Điền từ / Nghe gõ
        </button>
      </div>
      {mode === "flashcard" && (
        <section className="mx-auto max-w-2xl">
          <button
            onClick={() => {
              if (!flipped) onStudyActivity?.();
              setFlipped((value) => !value);
            }}
            className="panel flex min-h-[330px] w-full flex-col items-center justify-center p-8 text-center transition hover:-translate-y-1"
          >
            <p className="eyebrow">
              {flipped ? "Mặt sau" : "Mặt trước"} · Click để lật
            </p>
            {flipped ? (
              <>
                <p className="mt-5 text-sm text-sage">{card.ipa}</p>
                <p className="mt-2 font-display text-3xl font-bold">
                  {card.meaning}
                </p>
                <p className="mt-5 max-w-md text-sm leading-6 text-ink/55 dark:text-white/55">
                  {card.example.replace(new RegExp(card.word, "ig"), "_____")}
                </p>
              </>
            ) : (
              <>
                <p className="mt-5 font-display text-5xl font-bold">
                  {card.word}
                </p>
                <span
                  onClick={(event) => {
                    event.stopPropagation();
                    speakText(card.word);
                  }}
                  className="mt-6 inline-flex items-center gap-2 rounded-lg bg-ink/[0.06] px-3 py-2 text-xs font-bold dark:bg-white/10"
                >
                  <Volume2 size={15} />
                  Nghe phát âm
                </span>
              </>
            )}
          </button>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <button
              onClick={() => submitResult(false)}
              className="flex items-center justify-center gap-2 rounded-xl border border-ink/[0.1] py-3 text-sm font-bold text-ink/60 dark:border-white/[0.1] dark:text-white/60"
            >
              <XCircle size={16} />
              Chưa thuộc
            </button>
            <button
              onClick={() => submitResult(true)}
              className="flex items-center justify-center gap-2 rounded-xl bg-ink py-3 text-sm font-bold text-white dark:bg-lime dark:text-ink"
            >
              <Check size={16} />
              Đã thuộc
            </button>
          </div>
        </section>
      )}
      {mode === "quiz" && (
        <section className="panel relative mx-auto max-w-2xl overflow-hidden p-7 pb-28">
          <div className="text-center">
            <p className="eyebrow">Chọn từ đúng với nghĩa</p>
            <p className="mt-5 font-display text-2xl font-bold">
              {card.meaning}
            </p>
            <p className="mt-2 text-sm text-ink/45 dark:text-white/45">
              {card.example.replace(new RegExp(card.word, "ig"), "_____")}
            </p>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {quizOptions.map((option, optionIndex) => (
              <button
                key={`${option}-${optionIndex}`}
                disabled={answer !== null}
                onClick={() => quizAnswer(option)}
                className={`rounded-2xl border-2 border-b-4 p-4 text-left text-sm font-bold transition-all active:translate-y-[2px] active:border-b-2 ${answer === null ? "border-slate-200 bg-white hover:bg-slate-50 dark:border-white/10 dark:bg-[#29332f] dark:hover:bg-[#34423c]" : option === card.word ? "quiz-correct border-emerald-500 bg-emerald-50 text-emerald-700 shadow-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-200" : selectedOption === option ? "quiz-shake border-rose-500 bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-200" : "border-slate-200 bg-white opacity-60 dark:border-white/10 dark:bg-[#29332f]"}`}
              >
                <span className="mr-3 inline-grid h-6 w-6 place-items-center rounded-md bg-slate-100 text-xs text-slate-500 dark:bg-white/10 dark:text-white/50">{optionIndex + 1}</span>{option}
              </button>
            ))}
          </div>
          {answer !== null && (
            <div className={`absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 px-7 py-4 ${answer ? "bg-emerald-50 dark:bg-emerald-950/30" : "bg-rose-50 dark:bg-rose-950/30"}`}>
              <p className={`flex items-center gap-2 text-sm font-bold ${answer ? "text-emerald-700 dark:text-emerald-200" : "text-rose-700 dark:text-rose-200"}`}>
                {answer ? <><Check size={18} />Tuyệt vời!</> : <><XCircle size={18} />Cần cố gắng thêm</>}
              </p>
              {index < cards.length - 1 && <button onClick={nextQuestion} className={`rounded-xl border-2 border-b-4 px-5 py-2.5 text-sm font-bold text-white transition-all active:translate-y-[2px] active:border-b-2 ${answer ? "border-emerald-700 bg-emerald-600" : "border-rose-700 bg-rose-600"}`}>Tiếp tục <span className="ml-1 text-xs opacity-70">Enter</span></button>}
            </div>
          )}
        </section>
      )}
      {mode === "spelling" && (
        <section className="panel mx-auto max-w-2xl p-7 text-center">
          <p className="eyebrow">Nghe và gõ lại từ</p>
          <button
            onClick={() =>
              speakText(card.word)
            }
            className="mx-auto mt-6 flex items-center gap-2 rounded-xl bg-lime px-4 py-3 text-sm font-bold text-ink"
          >
            <Volume2 size={17} />
            Phát âm
          </button>
          <p className="mt-5 text-sm text-ink/50 dark:text-white/50">
            {card.meaning}
          </p>
          <form
            onSubmit={spellingAnswer}
            className="mx-auto mt-6 flex max-w-md gap-2"
          >
            <input
              autoFocus
              value={spelling}
              onChange={(event) => setSpelling(event.target.value)}
              placeholder="Gõ từ bạn nghe được..."
              className="min-w-0 flex-1 rounded-xl border border-ink/[0.1] bg-transparent px-3 py-3 text-sm outline-none dark:border-white/[0.1]"
            />
            <button
              disabled={answer !== null}
              className="rounded-xl bg-ink px-4 py-3 text-sm font-bold text-white disabled:opacity-50 dark:bg-lime dark:text-ink"
            >
              Kiểm tra
            </button>
          </form>
          {answer !== null && (
            <div className="mt-5">
              <p
                className={`text-sm font-bold ${answer ? "text-sage" : "text-red-500"}`}
              >
                {answer
                  ? "Chính xác!"
                  : `Gợi ý: ${card.word.slice(0, 2)}... (${card.word.length} ký tự)`}
              </p>
              {index < cards.length - 1 && (
                <button
                  onClick={nextQuestion}
                  className="mt-3 rounded-xl bg-ink px-4 py-2.5 text-xs font-bold text-white dark:bg-lime dark:text-ink"
                >
                  Từ tiếp theo
                </button>
              )}
            </div>
          )}
        </section>
      )}
    </div>
  );
}

export default function VocabularyHub({ onStudyActivity, streak, apiKey, user }) {
  const [library, setLibrary] = useState({ decks: [], cards: [] });
  const [selectedDeckId, setSelectedDeckId] = useState(null);
  const [deckInput, setDeckInput] = useState("");
  const [manualWord, setManualWord] = useState("");
  const [lookupResult, setLookupResult] = useState(null);
  const [manualModalOpen, setManualModalOpen] = useState(false);
  const [manualDraft, setManualDraft] = useState({ word: "", ipa: "", meaning: "", example: "", exampleTranslation: "", level: "B1" });
  const [topic, setTopic] = useState("Du lịch - giao tiếp");
  const [level, setLevel] = useState("B1");
  const [amount, setAmount] = useState("5");
  const [loading, setLoading] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [studyDeckId, setStudyDeckId] = useState(null);
  const [studyMode, setStudyMode] = useState(null);
  const [studyCards, setStudyCards] = useState(null);
  const [singleCardId, setSingleCardId] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [libraryLoading, setLibraryLoading] = useState(true);
  const [speakingWord, setSpeakingWord] = useState("");
  const [dataModal, setDataModal] = useState(null);
  const debouncedManualWord = useDebounce(manualWord);
  const debouncedTopic = useDebounce(topic);

  const selectedDeck =
    library.decks.find((deck) => deck.id === selectedDeckId) ||
    library.decks[0];
  const deckCards = useMemo(
    () => library.cards.filter((card) => card.deckId === selectedDeck?.id),
    [library.cards, selectedDeck?.id],
  );
  const today = dateKey();
  const dueCards = useMemo(() => deckCards.filter((card) => {
    const reviewDate = (card.nextReviewDate || card.reviewDate || "").slice(0, 10);
    return card.status === "new" || Boolean(reviewDate && reviewDate <= today);
  }), [deckCards, today]);
  const filteredCards = useMemo(() => {
    if (activeFilter === "due") return dueCards;
    if (activeFilter === "mastered") return deckCards.filter((card) => card.status === "mastered");
    if (activeFilter === "interval-3") return deckCards.filter((card) => Number(card.interval) === 3);
    if (activeFilter === "interval-5") return deckCards.filter((card) => Number(card.interval) === 5);
    return deckCards;
  }, [activeFilter, deckCards, dueCards]);

  useEffect(() => {
    let active = true;
    setLibrary({ decks: [], cards: [] });
    setSelectedDeckId(null);
    setStudyDeckId(null);
    setStudyMode(null);
    setError("");
    setLibraryLoading(true);
    const loadLibrary = async () => {
      try {
        let decks = await dataService.getDecks();
        if (!decks.length) {
          const created = await dataService.createDeck("IELTS Speaking Part 1");
          decks = [{ ...created, tags: created.tags || ["IELTS", "Speaking"], createdAt: created.createdAt || created.created_at }];
        }
        const cardsByDeck = await Promise.all(decks.map((deck) => dataService.getCards(deck.id)));
        const initialCards = cardsByDeck.flat();
        if (active) setLibrary({ decks, cards: initialCards });
        void Promise.all(initialCards.filter((card) => !card.imageUrl).map(async (card) => {
          const imageUrl = await findVocabularyImageSafely(card.word, card.meaning);
          if (!imageUrl) return;
          try { await dataService.updateCard(card.id, { imageUrl }); } catch { return; }
          if (active) setLibrary((current) => ({ ...current, cards: current.cards.map((item) => item.id === card.id ? { ...item, imageUrl } : item) }));
        }));
      } catch (loadError) {
        if (active) setError(loadError.message || "Không thể tải thư viện từ vựng.");
      } finally {
        if (active) setLibraryLoading(false);
      }
    };
    loadLibrary();
    return () => { active = false; };
  }, [user?.uid]);
  useEffect(() => {
    if (!selectedDeck && library.decks[0])
      setSelectedDeckId(library.decks[0].id);
  }, [library.decks, selectedDeck]);
  useEffect(() => {
    const topic = localStorage.getItem("lingua-practice-topic");
    if (!topic) return undefined;
    const matchingDeck = library.decks.find((deck) =>
      deck.title.toLowerCase().includes(topic.toLowerCase()),
    );
    if (matchingDeck && library.cards.some((card) => card.deckId === matchingDeck.id)) {
      setSelectedDeckId(matchingDeck.id);
      setStudyDeckId(matchingDeck.id);
      setStudyMode("flashcard");
    }
    localStorage.removeItem("lingua-practice-topic");
    return undefined;
  }, [library.cards, library.decks]);

  const updateLibrary = (changes) =>
    setLibrary((current) => ({ ...current, ...changes }));
  const addDeck = async (event) => {
    event.preventDefault();
    const title = deckInput.trim();
    if (!title) return;
    const deck = await dataService.createDeck(title);
    const normalizedDeck = { ...deck, tags: deck.tags || [], createdAt: deck.createdAt || deck.created_at };
    updateLibrary({ decks: [...library.decks, normalizedDeck] });
    setSelectedDeckId(normalizedDeck.id);
    setDeckInput("");
  };
  const renameDeck = async (deck) => {
    const title = window.prompt("Tên mới của bộ thẻ:", deck.title)?.trim();
    if (!title) return;
    await dataService.updateDeck(deck.id, title);
    updateLibrary({ decks: library.decks.map((item) => item.id === deck.id ? { ...item, title } : item) });
  };
  const deleteDeck = async (deck) => {
    if (library.decks.length === 1)
      return setError("Cần giữ lại ít nhất một bộ từ vựng.");
    if (!window.confirm(`Xóa bộ “${deck.title}” và toàn bộ từ trong bộ?`))
      return;
    await dataService.deleteDeck(deck.id);
    const nextDecks = library.decks.filter((item) => item.id !== deck.id);
    updateLibrary({
      decks: nextDecks,
      cards: library.cards.filter((card) => card.deckId !== deck.id),
    });
    setSelectedDeckId(nextDecks[0].id);
  };

  const addCards = async (items) => {
    const existingWordList = deckCards.map((card) => normalizeWord(card.word));
    const seenWords = new Set(existingWordList);
    const uniqueItems = items.filter((item) => {
      const key = normalizeWord(item.word);
      if (!key || seenWords.has(key)) return false;
      seenWords.add(key);
      return true;
    });
    if (!uniqueItems.length) {
      setError("Không có từ mới để thêm: tất cả từ AI trả về đều đã tồn tại trong bộ.");
      return [];
    }
    const enrichedItems = await Promise.all(uniqueItems.map(async (item) => ({
      ...item,
      imageUrl: item.imageUrl || await findVocabularyImageSafely(item.word, item.meaning),
    })));
    const cards = enrichedItems
      .map((item) => ({
        id: makeId("card"),
        deckId: selectedDeck.id,
        word: titleCaseWord(item.word || ""),
        ipa: item.ipa || item.pronunciation || "",
        meaning: item.meaning || "",
        example: item.example || "",
        level: item.level || level,
        status: "new",
        reviewDate: null,
        interval: 0,
        nextReviewDate: null,
        repetition: 0,
        imageUrl: item.imageUrl || "",
      }))
      .filter((card) => card.word);
    const savedCards = await Promise.all(cards.map((card) => dataService.addCard(card)));
    updateLibrary({ cards: [...savedCards, ...library.cards] });
    return savedCards;
  };

  const importDeck = async (title, items) => {
    const deck = await dataService.createDeck(title);
    const importedCards = items.map((item) => ({ ...item, deckId: deck.id }));
    const savedCards = await Promise.all(importedCards.map((card) => dataService.addCard(card)));
    const normalizedDeck = { ...deck, tags: deck.tags || [], createdAt: deck.createdAt || new Date().toISOString() };
    updateLibrary({ decks: [...library.decks, normalizedDeck], cards: [...savedCards, ...library.cards] });
    setSelectedDeckId(normalizedDeck.id);
    setDataModal(null);
  };

  const lookupWord = async () => {
    if (!debouncedManualWord.trim()) return;
    if (!apiKey)
      return setError(
        "Hãy lưu API key trong tab Cài đặt API trước khi tra từ.",
      );
    setLoading("lookup");
    setError("");
    try {
      if (deckCards.some((card) => normalizeWord(card.word) === normalizeWord(debouncedManualWord))) {
        setError("Từ này đã có trong bộ hiện tại.");
        return;
      }
      const result = parseAiJson(
        await requestAi(
          localStorage.getItem(PROVIDER_STORAGE) || "gemini",
          apiKey,
          quickLookupPrompt(debouncedManualWord),
          { json: true },
        ),
      );
      setLookupResult({ ...result, word: titleCaseWord(debouncedManualWord), level });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading("");
    }
  };

  const saveLookupResult = async () => {
    if (!lookupResult) return;
    setLoading("lookup-save");
    try {
      const saved = await addCards([lookupResult]);
      if (saved.length) { setLookupResult(null); setManualWord(""); setError(""); setNotice(`Đã thêm vào bộ ${selectedDeck?.title}.`); }
    } catch (requestError) { setError(requestError.message || "Không thể lưu thẻ."); }
    finally { setLoading(""); }
  };

  const openManualModal = () => {
    setManualDraft({ word: manualWord, ipa: "", meaning: "", example: "", exampleTranslation: "", level });
    setManualModalOpen(true);
  };
  const updateManualDraft = (field, value) => setManualDraft((current) => ({ ...current, [field]: value }));
  const suggestManualDetails = async () => {
    if (!apiKey || !manualDraft.word.trim()) return setError("Hãy nhập từ và lưu API key trước khi dùng AI.");
    setLoading("manual-suggest");
    try {
      const result = parseAiJson(await requestAi(localStorage.getItem(PROVIDER_STORAGE) || "gemini", apiKey, quickLookupPrompt(manualDraft.word), { json: true }));
      setManualDraft((current) => ({ ...current, ipa: result.ipa || current.ipa, meaning: result.meaning || current.meaning, example: result.example || current.example }));
    } catch (requestError) { setError(requestError.message); }
    finally { setLoading(""); }
  };
  const saveManualCard = async () => {
    if (!manualDraft.word.trim() || !manualDraft.meaning.trim()) return setError("Từ vựng và định nghĩa là bắt buộc.");
    setLoading("manual-save");
    try {
      const saved = await addCards([{ ...manualDraft, example: manualDraft.exampleTranslation ? `${manualDraft.example}\n${manualDraft.exampleTranslation}` : manualDraft.example }]);
      if (saved.length) { setManualModalOpen(false); setManualDraft({ word: "", ipa: "", meaning: "", example: "", exampleTranslation: "", level }); setNotice(`Đã thêm vào bộ ${selectedDeck?.title}.`); }
    } catch (requestError) { setError(requestError.message || "Không thể lưu thẻ."); }
    finally { setLoading(""); }
  };

  const generateVocabulary = async () => {
    if (!apiKey)
      return setError(
        "Hãy lưu API key trong tab Cài đặt API trước khi dùng AI.",
      );
    setLoading("generate");
    setError("");
    try {
      const existingWordList = deckCards.map((card) => normalizeWord(card.word));
      const result = parseAiJson(
        await requestAi(
          localStorage.getItem(PROVIDER_STORAGE) || "gemini",
          apiKey,
          generateSmartVocabularyPrompt(debouncedTopic, level, amount, existingWordList),
          { json: true },
        ),
      );
      await addCards(result.cards || []);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading("");
    }
  };

  const updateCard = useCallback(async (cardId, changes) => {
    await dataService.updateCard(cardId, changes);
    updateLibrary({ cards: library.cards.map((card) => card.id === cardId ? { ...card, ...changes } : card) });
  }, [library.cards]);
  const cleanupDuplicates = async () => {
    const seen = new Map();
    const duplicateIds = [];
    const normalizedCards = deckCards.map((card) => {
      const key = normalizeWord(card.word);
      const canonicalWord = titleCaseWord(card.word);
      if (seen.has(key)) {
        duplicateIds.push(card.id);
        return card;
      }
      seen.set(key, card.id);
      return canonicalWord === card.word ? card : { ...card, word: canonicalWord };
    });
    const keptCards = normalizedCards.filter((card) => !duplicateIds.includes(card.id));
    const changedCards = keptCards.filter((card) => card.word !== deckCards.find((item) => item.id === card.id)?.word);
    if (!duplicateIds.length && !changedCards.length) {
      setError("Bộ này không có từ trùng lặp.");
      return;
    }
    await Promise.all([
      ...changedCards.map((card) => dataService.updateCard(card.id, { word: card.word })),
      ...duplicateIds.map((cardId) => dataService.deleteCard(cardId)),
    ]);
    const duplicateSet = new Set(duplicateIds);
    updateLibrary({ cards: library.cards.filter((card) => card.deckId !== selectedDeck.id || !duplicateSet.has(card.id)).map((card) => keptCards.find((item) => item.id === card.id) || card) });
    setError(`Đã dọn ${duplicateIds.length} từ trùng lặp trong bộ.`);
  };
  const removeCard = useCallback(async (cardId) => {
    await dataService.deleteCard(cardId);
    updateLibrary({ cards: library.cards.filter((card) => card.id !== cardId) });
  }, [library.cards]);
  const speak = (word, id = word) => {
    setSpeakingWord(id);
    speakText(word, { onEnd: () => setSpeakingWord("") });
  };

  const openStudy = (cards) => {
    setStudyCards(cards);
    setStudyDeckId(selectedDeck.id);
    setStudyMode(null);
  };

  if (libraryLoading) {
    return <div className="panel grid min-h-64 place-items-center p-8"><LoaderCircle className="animate-spin text-sage" size={24} /><p className="mt-3 text-sm text-ink/50 dark:text-white/50">Đang đồng bộ thư viện từ vựng...</p></div>;
  }

  if (singleCardId) {
    const singleCard = deckCards.find((card) => card.id === singleCardId);
    if (singleCard) return <FlashcardModal deck={selectedDeck} cards={[singleCard]} onClose={() => setSingleCardId(null)} onUpdateCard={updateCard} onStudyActivity={onStudyActivity} streak={streak} />;
  }

  if (studyDeckId) {
    const practiceDeck = library.decks.find(
      (deck) => deck.id === studyDeckId,
    );
    const practiceCards = studyCards || library.cards.filter(
      (card) => card.deckId === studyDeckId,
    );
    if (practiceDeck) {
      const closeStudy = () => { setStudyDeckId(null); setStudyMode(null); setStudyCards(null); };
      const chooseMode = (mode) => setStudyMode(mode);
      if (!studyMode) return <StudyHubModal deck={practiceDeck} cards={practiceCards.map(sanitizeCard)} onSelect={chooseMode} onClose={closeStudy} />;
      const sharedProps = { deck: practiceDeck, cards: practiceCards, onClose: closeStudy, onChangeMode: () => setStudyMode(null), onUpdateCard: updateCard, onStudyActivity };
      if (studyMode === "quiz") return <QuizView {...sharedProps} />;
      if (studyMode === "speller") return <SpellerView {...sharedProps} />;
      if (studyMode === "matching") return <MatchingView {...sharedProps} />;
      return <FlashcardModal {...sharedProps} streak={streak} />;
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[280px_1fr]">
        <aside className="panel h-fit p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="eyebrow">Library</p>
              <div className="flex items-center gap-2"><h2 className="mt-1 font-display font-bold">Bộ chủ đề</h2><button onClick={() => setDataModal("export")} className="grid h-7 w-7 place-items-center rounded-lg text-ink/45 hover:bg-ink/5 hover:text-ink dark:text-white/45 dark:hover:bg-white/10" aria-label="Xuất dữ liệu" title="Xuất dữ liệu"><Download size={14} /></button><button onClick={() => setDataModal("import")} className="grid h-7 w-7 place-items-center rounded-lg text-ink/45 hover:bg-ink/5 hover:text-ink dark:text-white/45 dark:hover:bg-white/10" aria-label="Nhập dữ liệu" title="Nhập dữ liệu"><FileUp size={14} /></button></div>
            </div>
            <span className="text-xs text-ink/40 dark:text-white/40">
              {library.decks.length} bộ
            </span>
          </div>
          <form onSubmit={addDeck} className="mt-5 flex gap-2">
            <input
              value={deckInput}
              onChange={(event) => setDeckInput(event.target.value)}
              placeholder="Tên bộ mới..."
              className="min-w-0 flex-1 rounded-lg border border-ink/[0.1] bg-transparent px-2.5 py-2 text-xs outline-none dark:border-white/[0.1]"
            />
            <button
              className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-ink text-white dark:bg-lime dark:text-ink"
              aria-label="Tạo bộ mới"
            >
              <Plus size={15} />
            </button>
          </form>
          <div className="mt-4 space-y-1">
            {library.decks.map((deck) => (
              <button
                key={deck.id}
                onClick={() => setSelectedDeckId(deck.id)}
                className={`group flex w-full items-center gap-2 rounded-xl p-3 text-left transition ${selectedDeck?.id === deck.id ? "bg-ink text-white dark:bg-lime dark:text-ink" : "hover:bg-ink/[0.05] dark:hover:bg-white/[0.08]"}`}
              >
                <BookOpen size={16} className="shrink-0" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-bold">
                    {deck.title}
                  </span>
                  <span
                    className={`text-[11px] ${selectedDeck?.id === deck.id ? "text-white/55 dark:text-ink/55" : "text-ink/40 dark:text-white/40"}`}
                  >
                    {
                      library.cards.filter((card) => card.deckId === deck.id)
                        .length
                    }{" "}
                    từ
                  </span>
                </span>
                <span className="hidden gap-1 group-hover:flex">
                  <span
                    onClick={(event) => {
                      event.stopPropagation();
                      renameDeck(deck);
                    }}
                    className="cursor-pointer p-1"
                    title="Đổi tên"
                  >
                    <Pencil size={13} />
                  </span>
                  <span
                    onClick={(event) => {
                      event.stopPropagation();
                      deleteDeck(deck);
                    }}
                    className="cursor-pointer p-1"
                    title="Xóa"
                  >
                    <Trash2 size={13} />
                  </span>
                </span>
                <ChevronRight size={14} className="shrink-0 opacity-40" />
              </button>
            ))}
          </div>
        </aside>
        <main className="min-w-0 space-y-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="eyebrow">Deck detail</p>
              <h2 className="mt-1 font-display text-2xl font-bold tracking-tight">
                {selectedDeck?.title}
              </h2>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {(selectedDeck?.tags || []).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-ink/[0.06] px-2 py-1 text-[10px] font-bold text-ink/50 dark:bg-white/10 dark:text-white/50"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-ink/40 dark:text-white/40">
                {deckCards.length} từ trong bộ
              </span>
              <button
                onClick={() => openStudy(deckCards)}
                disabled={!deckCards.length}
                className="flex items-center gap-2 rounded-xl bg-ink px-3 py-2.5 text-xs font-bold text-white disabled:cursor-not-allowed disabled:opacity-40 dark:bg-lime dark:text-ink"
              >
                <Sparkles size={15} />
                Bắt đầu học bộ này
              </button>
              <button
                onClick={() => openStudy(dueCards)}
                disabled={!dueCards.length}
                className="flex items-center gap-2 rounded-xl border border-ink/[0.1] px-3 py-2.5 text-xs font-bold disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/[0.1]"
              >
                <Check size={15} />
                Ôn đến hạn ({dueCards.length})
              </button>
              <button
                onClick={cleanupDuplicates}
                className="grid h-10 w-10 place-items-center rounded-xl border border-ink/[0.1] text-ink/50 hover:border-red-300 hover:text-red-500 dark:border-white/[0.1] dark:text-white/50"
                aria-label="Dọn từ trùng"
                title="Dọn từ trùng"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
          <section className="panel grid gap-4 p-5 lg:grid-cols-[1fr_auto]">
            <div>
              <p className="text-sm font-bold">Thêm từ thủ công</p>
              <p className="mt-1 text-xs text-ink/40 dark:text-white/40">
                AI sẽ tra IPA, nghĩa và ví dụ trước khi lưu.
              </p>
              <div className="mt-4 flex gap-2">
                <input
                  value={manualWord}
                  onChange={(event) => setManualWord(event.target.value)}
                  onKeyDown={(event) => event.key === "Enter" && lookupWord()}
                  placeholder="Nhập một từ tiếng Anh..."
                  className="min-w-0 flex-1 rounded-xl border border-ink/[0.1] bg-transparent px-3 py-3 text-sm outline-none dark:border-white/[0.1]"
                />
                <button
                  onClick={lookupWord}
                  disabled={loading === "lookup"}
                  className="flex items-center gap-2 rounded-xl bg-ink px-3 text-sm font-bold text-white disabled:opacity-60 dark:bg-lime dark:text-ink"
                >
                  {loading === "lookup" ? (
                    <LoaderCircle size={15} className="animate-spin" />
                  ) : (
                    <Search size={15} />
                  )}
                  Tra nhanh
                </button>
                <button
                  onClick={saveLookupResult}
                  disabled={!lookupResult || loading === "lookup-save"}
                  className="flex items-center gap-2 rounded-xl bg-lime px-3 text-sm font-bold text-ink disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Plus size={15} />Thêm vào bộ này
                </button>
              </div>
              {lookupResult && <div className="mt-4 rounded-xl border border-lime/60 bg-lime/20 p-4 text-sm"><div className="flex flex-wrap items-center justify-between gap-2"><div><p className="font-display font-bold">{lookupResult.word} <span className="ml-1 text-xs font-normal text-sage">{lookupResult.ipa}</span></p><p className="mt-1 font-semibold">{lookupResult.meaning}</p><p className="mt-1 text-xs text-ink/55 dark:text-white/55">{lookupResult.example}</p></div><button onClick={saveLookupResult} disabled={loading === "lookup-save"} className="rounded-lg bg-ink px-3 py-2 text-xs font-bold text-white disabled:opacity-50 dark:bg-lime dark:text-ink">Lưu kết quả</button></div></div>}
            </div>
            <div className="border-t border-ink/[0.08] pt-4 lg:border-l lg:border-t-0 lg:pl-4 dark:border-white/[0.08]">
              <p className="text-sm font-bold">AI Sinh từ vựng thông minh</p>
              <div className="mt-3 grid grid-cols-3 gap-2">
                <input
                  value={topic}
                  onChange={(event) => setTopic(event.target.value)}
                  className="col-span-3 rounded-lg border border-ink/[0.1] bg-transparent px-2.5 py-2 text-xs outline-none dark:border-white/[0.1]"
                  placeholder="Chủ đề"
                />
                <select
                  value={level}
                  onChange={(event) => setLevel(event.target.value)}
                  className="rounded-lg border border-ink/[0.1] bg-transparent px-2 py-2 text-xs outline-none dark:border-white/[0.1]"
                >
                  {levels.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
                <select
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                  className="rounded-lg border border-ink/[0.1] bg-transparent px-2 py-2 text-xs outline-none dark:border-white/[0.1]"
                >
                  <option value="5">5 từ</option>
                  <option value="10">10 từ</option>
                </select>
                <button
                  onClick={generateVocabulary}
                  disabled={loading === "generate"}
                  className="flex items-center justify-center gap-1 rounded-lg bg-lime px-2 text-xs font-bold text-ink disabled:opacity-60"
                >
                  {loading === "generate" ? (
                    <LoaderCircle size={14} className="animate-spin" />
                  ) : (
                    <Sparkles size={14} />
                  )}
                  Sinh
                </button>
              </div>
            </div>
          </section>
          {error && (
            <ErrorMessage message={error} onClose={() => setError("")} />
          )}
          {notice && <SuccessMessage message={notice} onClose={() => setNotice("")} />}
          <section className="panel overflow-hidden">
            <div className="border-b border-ink/[0.08] px-5 py-4 dark:border-white/[0.08]">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3"><p className="font-display font-bold">Từ trong bộ</p><button onClick={openManualModal} className="flex items-center gap-1 rounded-lg bg-lime px-2.5 py-2 text-[11px] font-bold text-ink"><Plus size={14} />Thêm thẻ mới</button></div>
                <div className="flex max-w-full gap-1 overflow-x-auto rounded-xl bg-ink/[0.05] p-1 dark:bg-white/[0.08]">
                  {[
                    ["all", `Tất cả (${deckCards.length})`],
                    ["due", `Cần ôn hôm nay (${dueCards.length})`],
                    ["interval-3", `Sau 3 ngày (${deckCards.filter((card) => Number(card.interval) === 3).length})`],
                    ["interval-5", `Sau 5 ngày (${deckCards.filter((card) => Number(card.interval) === 5).length})`],
                    ["mastered", `Đã thuộc (${deckCards.filter((card) => card.status === "mastered").length})`],
                  ].map(([value, label]) => <button key={value} onClick={() => setActiveFilter(value)} className={`whitespace-nowrap rounded-lg px-2.5 py-2 text-[11px] font-bold ${activeFilter === value ? "bg-white shadow-sm dark:bg-[#29332f]" : "text-ink/45 dark:text-white/45"}`}>{label}</button>)}
                </div>
                <button
                  onClick={() => openStudy(filteredCards)}
                  disabled={!filteredCards.length}
                  className="flex shrink-0 items-center gap-2 rounded-xl bg-ink px-3 py-2.5 text-xs font-bold text-white disabled:cursor-not-allowed disabled:opacity-40 dark:bg-lime dark:text-ink"
                >
                  <Sparkles size={15} />
                  Học nhóm này ({filteredCards.length} từ)
                </button>
              </div>
            </div>
            {filteredCards.length === 0 ? (
              <div className="p-10 text-center">
                <BookOpen
                  className="mx-auto text-ink/25 dark:text-white/25"
                  size={26}
                />
                <p className="mt-3 text-sm font-bold">Bộ này chưa có từ</p>
                <p className="mt-1 text-xs text-ink/40 dark:text-white/40">
                  Thêm từ thủ công hoặc dùng AI để bắt đầu.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-ink/[0.07] dark:divide-white/[0.07]">
                {filteredCards.map((card) => (
                  <article
                    key={card.id}
                    className="flex flex-wrap items-center gap-3 px-5 py-4"
                  >
                    <button
                      onClick={() => speak(card.word, card.id)}
                      className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-ink/[0.1] text-ink/45 hover:text-ink dark:border-white/[0.1] dark:text-white/45 dark:hover:text-white ${speakingWord === card.id ? "animate-pulse text-sage" : ""}`}
                      aria-label={`Nghe phát âm ${card.word}`}
                    >
                      <Volume2 size={16} />
                    </button>
                    <button
                      onClick={() => setSingleCardId(card.id)}
                      className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-lime text-ink hover:bg-sage"
                      aria-label={`Học từ ${card.word}`}
                      title="Học từ này"
                    >
                      <BookOpen size={16} />
                    </button>
                    <div className="min-w-[160px] flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <SafeImage src={card.imageUrl} alt={card.word} fallbackWord={card.word} className="h-8 w-8 rounded-md object-cover" />
                        <p className="font-display font-bold">{card.word}</p>
                        <span className="text-xs text-sage">{card.ipa}</span>
                        <StatusBadge status={card.status} />
                      </div>
                      <p className="mt-1 text-sm font-semibold">
                        {card.meaning}
                      </p>
                      <button onClick={() => speak(card.example, `${card.id}-example`)} className={`mt-1 flex items-start gap-1 text-left text-xs leading-5 text-ink/45 dark:text-white/45 ${speakingWord === `${card.id}-example` ? "text-sage" : ""}`}><Volume2 size={13} className="mt-1 shrink-0" />{card.example}</button>
                    </div>
                    <select
                      value={card.level}
                      onChange={(event) =>
                        updateCard(card.id, { level: event.target.value })
                      }
                      className="rounded-lg border border-ink/[0.1] bg-transparent px-2 py-2 text-xs outline-none dark:border-white/[0.1]"
                    >
                      {levels.map((item) => (
                        <option key={item}>{item}</option>
                      ))}
                    </select>
                    <select
                      value={card.status}
                      onChange={(event) =>
                        updateCard(card.id, { status: event.target.value })
                      }
                      className="rounded-lg border border-ink/[0.1] bg-transparent px-2 py-2 text-xs outline-none dark:border-white/[0.1]"
                    >
                      {Object.entries(statuses).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => removeCard(card.id)}
                      className="text-ink/25 hover:text-red-500 dark:text-white/25"
                      aria-label={`Xóa ${card.word}`}
                    >
                      <Trash2 size={15} />
                    </button>
                  </article>
                ))}
              </div>
            )}
          </section>
        </main>
      </div>
      {dataModal && <ImportExportModal mode={dataModal} onClose={() => setDataModal(null)} currentDeck={selectedDeck} decks={library.decks} cards={library.cards} onImport={importDeck} />}
      {manualModalOpen && <ManualCardModal draft={manualDraft} levels={levels} busy={loading.startsWith("manual-")} onChange={updateManualDraft} onSuggest={suggestManualDetails} onSave={saveManualCard} onClose={() => setManualModalOpen(false)} />}
    </div>
  );
}
