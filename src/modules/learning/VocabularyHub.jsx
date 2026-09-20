import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArchiveRestore,
  ArrowLeft,
  BookOpen,
  CalendarClock,
  Check,
  ChevronDown,
  ChevronRight,
  LoaderCircle,
  MoreVertical,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  Share2,
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
import { lookupWordOffline } from "../../services/dictionaryService";
import { consumePendingItem } from "../../services/deepLink";
import { findVocabularyImageSafely } from "../../services/imageService";
import { useDebounce } from "../../hooks/useDebounce";
import { dataService } from "../../services/dataService";
import { recordStudyEvent } from "../../services/historyService";
import { clearSharedDeckFromUrl, copyShareLink, readSharedDeckFromUrl, shareDeck } from "../../services/shareDeck";
import { refreshRequestedEvent } from "../../services/syncStatus";
import { publishCardStats } from "../../services/widgetBridge";
import { toast } from "../../services/toast";
import FlashcardModal from "../../components/learning/FlashcardModal";
import { speakText } from "../../utils/speech";
import ImportExportModal from "../../components/learning/ImportExportModal";
import StudyHubModal from "../../components/learning/StudyHubModal";
import QuizView from "../../components/learning/QuizView";
import SpellerView from "../../components/learning/SpellerView";
import MatchingView from "../../components/learning/MatchingView";
import { sanitizeCard } from "../../utils/sanitizeCard";
import SafeImage from "../../components/ui/SafeImage";
import { dateKey, isDue, isLeech, schedulePayload } from "../../utils/srs";
import StudyAnalyticsWidget from "../../components/StudyAnalyticsWidget";
import { createStarterDeck } from "../../data/starterDeck";
import { createThemeDeck, themeDecks } from "../../data/themeDecks";

// Mỗi phiên học tối đa 50 thẻ, và danh sách chỉ hiển thị 60 thẻ một lần
// (bộ mặc định có 1000 từ nên không thể render hết cùng lúc).
const SESSION_LIMIT = 50;
const RENDER_LIMIT = 60;

// Bộ mặc định cũ và bộ mặc định mới, dùng để nâng cấp một lần cho thư viện đã có sẵn.
const LEGACY_STARTER_TITLE = "IELTS Speaking Part 1";
const COMMON_DECK_TITLE_MATCH = "từ tiếng Anh thông dụng";
import { playStudySound } from "../../utils/studyFeedback";

const STORAGE_KEY = "lingua-vocabulary-library";
const OLD_STORAGE_KEY = "lingua-vocabulary";
const PROVIDER_STORAGE = "lingua-ai-provider";
const levels = ["A1", "A2", "B1", "B2", "C1", "C2"];
const statuses = { new: "Mới", learning: "Đang học", mastered: "Thuộc" };
// Bộ lọc theo lịch ôn (SRS) — gộp trong một menu để thanh lọc gọn lại
const srsFilterLabels = {
  due: "Cần ôn hôm nay",
  "interval-1": "Ôn sau 1 ngày",
  "interval-3": "Ôn sau 3 ngày",
  "interval-5": "Ôn sau 5 ngày",
  leech: "Từ hay quên",
};

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

function StatusBadge({ status }) {
  const styles =
    status === "mastered"
      ? "bg-okbg text-ok dark:bg-okdark dark:text-okfgdark"
      : status === "learning"
        ? "bg-lime text-ink"
        : "bg-ink/[0.06] text-ink/70 dark:bg-white/10 dark:text-white/70";
  return (
    <span className={`chip shrink-0 ${styles}`}>
      {statuses[status]}
    </span>
  );
}

function AddWordsSheet({ tab, onTabChange, draft, levels, busy, onChange, onSuggest, onSave, topic, onTopicChange, level, onLevelChange, amount, onAmountChange, onGenerate, lookupResult, onLookupWord, onSaveLookup, manualWord, onManualWordChange, lookupLoading, onClose }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-ink/40 p-0 backdrop-blur-sm sm:items-center sm:p-4">
      <section className="panel max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-b-none p-5 sm:rounded-2xl sm:p-6">
        <div className="flex items-start justify-between gap-4"><div><p className="eyebrow">Thêm từ</p><h2 className="mt-1 font-display text-xl font-bold">Thêm từ mới</h2></div><button onClick={onClose} className="icon-btn border border-ink/10 dark:border-white/15" aria-label="Đóng"><X size={18} /></button></div>
        <div className="mt-5 flex rounded-xl bg-ink/[0.06] p-1 dark:bg-white/[0.08]"><button onClick={() => onTabChange("manual")} className={`flex-1 rounded-lg px-3 py-2.5 text-sm font-bold ${tab === "manual" ? "bg-slab shadow-raised dark:bg-dark3" : "text-ink/60 dark:text-white/60"}`}>Thủ công</button><button onClick={() => onTabChange("ai")} className={`flex-1 rounded-lg px-3 py-2.5 text-sm font-bold ${tab === "ai" ? "bg-slab shadow-raised dark:bg-dark3" : "text-ink/60 dark:text-white/60"}`}><Sparkles size={14} className="mr-1 inline" />Sinh bằng AI</button></div>
        {tab === "manual" ? <form onSubmit={(event) => { event.preventDefault(); onSave(); }} className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="sm:col-span-2"><FieldLabel>Từ vựng *</FieldLabel><input autoFocus value={draft.word} onChange={(event) => onChange("word", event.target.value)} placeholder="accommodation" className="w-full rounded-xl border border-ink/10 bg-transparent px-3 py-3 text-sm outline-none dark:border-white/10" /></label>
          <label><FieldLabel>Phiên âm IPA</FieldLabel><input value={draft.ipa} onChange={(event) => onChange("ipa", event.target.value)} placeholder="/əˌkɒməˈdeɪʃən/" className="w-full rounded-xl border border-ink/10 bg-transparent px-3 py-3 text-sm outline-none dark:border-white/10" /></label>
          <div className="flex items-end"><button type="button" onClick={onSuggest} disabled={busy || !draft.word.trim()} className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-lime px-3 py-3 text-xs font-bold text-ink disabled:opacity-50"><Sparkles size={15} />AI gợi ý</button></div>
          <label className="sm:col-span-2"><FieldLabel>Định nghĩa tiếng Việt *</FieldLabel><textarea value={draft.meaning} onChange={(event) => onChange("meaning", event.target.value)} rows={2} placeholder="Nơi ở, chỗ ở" className="w-full resize-none rounded-xl border border-ink/10 bg-transparent px-3 py-3 text-sm outline-none dark:border-white/10" /></label>
          <label><FieldLabel>Ví dụ tiếng Anh</FieldLabel><textarea value={draft.example} onChange={(event) => onChange("example", event.target.value)} rows={3} placeholder="We booked accommodation near the station." className="w-full resize-none rounded-xl border border-ink/10 bg-transparent px-3 py-3 text-sm outline-none dark:border-white/10" /></label>
          <label><FieldLabel>Dịch nghĩa ví dụ</FieldLabel><textarea value={draft.exampleTranslation} onChange={(event) => onChange("exampleTranslation", event.target.value)} rows={3} placeholder="Chúng tôi đặt chỗ ở gần nhà ga." className="w-full resize-none rounded-xl border border-ink/10 bg-transparent px-3 py-3 text-sm outline-none dark:border-white/10" /></label>
          <label><FieldLabel>Cấp độ</FieldLabel><select value={draft.level} onChange={(event) => onChange("level", event.target.value)} className="w-full rounded-xl border border-ink/10 bg-transparent px-3 py-3 text-sm outline-none dark:border-white/10">{levels.map((item) => <option key={item}>{item}</option>)}</select></label>
          <div className="flex justify-end gap-2 sm:col-span-2"><button type="button" onClick={onClose} className="rounded-xl border border-ink/10 px-4 py-3 text-sm font-bold dark:border-white/10">Hủy</button><button disabled={busy} className="rounded-xl bg-ink px-5 py-3 text-sm font-bold text-white disabled:opacity-50 dark:bg-lime dark:text-ink">{busy ? "Đang lưu..." : "Lưu thẻ"}</button></div>
        </form> : <div className="mt-5 space-y-4"><p className="text-xs leading-5 text-ink/60 dark:text-white/60">Tra từ bằng AI nếu bạn đã lưu API key, hoặc bằng từ điển miễn phí — không cần key.</p><form onSubmit={(event) => { event.preventDefault(); onLookupWord(); }} className="flex gap-2"><input autoFocus value={manualWord} onChange={(event) => onManualWordChange(event.target.value)} placeholder="Nhập từ cần tra..." className="min-w-0 flex-1 rounded-xl border border-ink/10 bg-transparent px-3 py-3 text-sm outline-none dark:border-white/10" /><button disabled={lookupLoading} className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-ink text-white dark:bg-lime dark:text-ink" aria-label="Tra từ">{lookupLoading ? <LoaderCircle size={16} className="animate-spin" /> : <Search size={16} />}</button></form>{lookupResult && <div className="rounded-xl border border-lime/60 bg-lime/20 p-4 text-sm"><p className="font-display font-bold">{lookupResult.word} <span className="ml-1 text-xs font-normal text-sage">{lookupResult.ipa}</span></p><p className="mt-1 font-semibold">{lookupResult.meaning}</p><p className="mt-1 text-xs text-ink/55 dark:text-white/55">{lookupResult.example}</p><button onClick={onSaveLookup} disabled={lookupLoading} className="mt-3 w-full rounded-lg bg-ink px-3 py-2.5 text-xs font-bold text-white disabled:opacity-50 dark:bg-lime dark:text-ink">Thêm vào bộ này</button></div>}<div className="border-t border-ink/[0.08] pt-4 dark:border-white/[0.08]"><p className="text-sm font-bold">Sinh theo chủ đề</p><input value={topic} onChange={(event) => onTopicChange(event.target.value)} placeholder="Ví dụ: du lịch, công việc..." className="mt-3 w-full rounded-xl border border-ink/10 bg-transparent px-3 py-3 text-sm outline-none dark:border-white/10" /><div className="mt-2 grid grid-cols-3 gap-2"><select value={level} onChange={(event) => onLevelChange(event.target.value)} className="rounded-xl border border-ink/10 bg-transparent px-2 py-3 text-xs outline-none dark:border-white/10">{levels.map((item) => <option key={item}>{item}</option>)}</select><select value={amount} onChange={(event) => onAmountChange(event.target.value)} className="rounded-xl border border-ink/10 bg-transparent px-2 py-3 text-xs outline-none dark:border-white/10"><option value="5">5 từ</option><option value="10">10 từ</option></select><button onClick={onGenerate} disabled={busy} className="flex items-center justify-center gap-1 rounded-xl bg-lime px-2 text-xs font-bold text-ink disabled:opacity-60"><Sparkles size={14} />Sinh</button></div></div></div>}
      </section>
    </div>
  );
}

function VocabularyCard({ card, speakingWord, onSpeak, onStudy, onUpdate, onRemove, selectMode = false, selected = false, onToggleSelect }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return <article className={`relative flex flex-col gap-3 border-b border-ink/[0.07] p-4 last:border-b-0 dark:border-white/[0.07] sm:p-5 md:flex-row md:items-center ${selected ? "bg-lime/15" : ""}`}>
    {selectMode && <label className="flex shrink-0 items-center"><input type="checkbox" checked={selected} onChange={() => onToggleSelect(card.id)} className="h-5 w-5 accent-lime" aria-label={`Chọn từ ${card.word}`} /></label>}
    <div className="flex min-w-0 items-start gap-3"><SafeImage src={card.imageUrl} alt={card.word} fallbackWord={card.word} className="hidden h-10 w-10 shrink-0 rounded-lg object-cover sm:block" /><div className="min-w-0 flex-1"><div className="flex items-center gap-2"><p className="truncate font-display text-base font-bold sm:text-lg">{card.word}</p><button onClick={() => onSpeak(card.word, card.id)} className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-ink/10 text-ink/55 hover:text-ink dark:border-white/10 dark:text-white/55 dark:hover:text-white ${speakingWord === card.id ? "animate-pulse text-sage" : ""}`} aria-label={`Nghe phát âm ${card.word}`}><Volume2 size={17} /></button></div><div className="mt-1 flex items-center gap-2"><p className="min-w-0 truncate text-sm text-ink/70 dark:text-white/70">{card.meaning}</p><span className="chip shrink-0 bg-ink/[0.06] text-ink/70 dark:bg-white/10 dark:text-white/70">{card.level}</span><StatusBadge status={card.status} /></div><button onClick={() => onSpeak(card.example, `${card.id}-example`)} className={`mt-2 hidden min-h-[44px] max-w-full items-center gap-1.5 text-left text-xs leading-5 text-ink/60 hover:text-ink md:flex dark:text-white/55 dark:hover:text-white ${speakingWord === `${card.id}-example` ? "text-sage" : ""}`}><Volume2 size={14} className="shrink-0" />{card.example || "Chưa có ví dụ"}</button></div></div>
    {!selectMode && <button onClick={() => onStudy(card.id)} className="btn-secondary hidden min-h-11 px-3.5 md:inline-flex" title="Học riêng từ này"><BookOpen size={16} />Học</button>}
    <div className="absolute right-3 top-3 md:static"><button onClick={() => setMenuOpen((value) => !value)} className="icon-btn" aria-label={`Tùy chọn cho ${card.word}`} aria-expanded={menuOpen}><MoreVertical size={18} /></button>{menuOpen && <div className="absolute right-0 top-14 z-20 w-56 rounded-xl border border-ink/10 bg-slab p-1.5 shadow-soft dark:border-white/10 dark:bg-dark2"><button onClick={() => { onStudy(card.id); setMenuOpen(false); }} className="menu-item"><BookOpen size={16} />Học từ này</button><label className="menu-item cursor-pointer"><span className="flex-1">Cấp độ</span><select value={card.level} onChange={(event) => onUpdate(card.id, { level: event.target.value })} className="w-14 rounded border border-ink/10 bg-transparent px-1 py-1 text-xs dark:border-white/10">{levels.map((item) => <option key={item}>{item}</option>)}</select></label><label className="menu-item cursor-pointer"><span className="flex-1">Trạng thái</span><select value={card.status} onChange={(event) => onUpdate(card.id, { status: event.target.value })} className="w-20 rounded border border-ink/10 bg-transparent px-1 py-1 text-xs dark:border-white/10">{Object.entries(statuses).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label><button onClick={() => { onRemove(card.id); setMenuOpen(false); }} className="menu-item text-danger dark:text-dangerfgdark"><Trash2 size={16} />Xoá từ</button></div>}</div>
  </article>;
}

const shuffle = (items) => [...items].sort(() => Math.random() - 0.5);

// Chỉ tạo bộ thẻ khởi tạo một lần, kể cả khi effect chạy lại (React StrictMode)
// hoặc hai tab cùng mở — tránh tạo trùng bộ và trùng id thẻ.
// Bộ mặc định là 1000 từ thông dụng, được tải riêng để không làm nặng gói chính.
let starterSeedPromise = null;
const seedStarterDeck = () => {
  if (!starterSeedPromise) {
    starterSeedPromise = (async () => {
      const { createCommonWordsDeck } = await import("../../data/commonWords");
      const { deck: draftDeck, cards: draftCards } = createCommonWordsDeck();
      const created = await dataService.createDeck(draftDeck.title);
      // Ghi một lần theo batch: nhanh hơn nhiều so với 1000 request riêng lẻ.
      const cards = await dataService.addCards(draftCards.map((card) => ({ ...card, deckId: created.id })));
      if (!cards.length) {
        await dataService.deleteDeck(created.id).catch(() => {});
        starterSeedPromise = null;
        throw new Error("Không thể tạo bộ từ khởi tạo. Vui lòng kiểm tra kết nối và thử lại.");
      }
      return { decks: [{ ...created, title: draftDeck.title, description: draftDeck.description, tags: draftDeck.tags, createdAt: created.createdAt || created.created_at }], cards };
    })();
  }
  return starterSeedPromise;
};

// Bản cũ sinh id theo mili-giây nên có thể trùng (bộ trùng id, thẻ trùng id).
// Lọc bỏ bản trùng và thẻ mồ côi để render không gặp key trùng.
const repairLibrary = (decks, cards) => {
  const seenDecks = new Set();
  const uniqueDecks = decks.filter((deck) => {
    if (!deck.id || seenDecks.has(deck.id)) return false;
    seenDecks.add(deck.id);
    return true;
  });
  const validDeckIds = new Set(uniqueDecks.map((deck) => deck.id));
  const seenCards = new Set();
  const uniqueCards = cards.filter((card) => {
    if (!validDeckIds.has(card.deckId) || !card.id || seenCards.has(card.id)) return false;
    seenCards.add(card.id);
    return true;
  });
  return { decks: uniqueDecks, cards: uniqueCards };
};

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
    void recordStudyEvent({ sessions: 1, reviewed: 0 });
    setResults(nextResults);
    setCompleted(true);
  };

  const submitResult = (isCorrect) => {
    const nextResults = [...results, isCorrect];
    // Dùng chung lịch ôn với flashcard để tiến độ không bị lệch giữa các chế độ.
    onUpdateCard(card.id, schedulePayload(card, isCorrect ? "mastered" : "again"));
    setAnswer(isCorrect);
    if (mode === "quiz") {
      playStudySound(isCorrect ? "correct" : "wrong");
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
          <p className="eyebrow mt-5">Hoàn thành phiên</p>
          <h2 className="mt-2 font-display text-2xl font-bold">
            Hoàn thành lượt học
          </h2>
          <p className="mt-2 text-sm text-ink/50 dark:text-white/50">
            {deck.title}
          </p>
          <div className="mt-8 grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-okbg p-4 dark:bg-okdark">
              <p className="metric text-2xl text-ok dark:text-okfgdark">
                {correct}
              </p>
              <p className="mt-1 text-xs text-ink/60 dark:text-white/55">
                Đúng
              </p>
            </div>
            <div className="rounded-xl bg-dangerbg p-4 dark:bg-dangerdark">
              <p className="metric text-2xl text-danger dark:text-dangerfgdark">
                {results.length - correct}
              </p>
              <p className="mt-1 text-xs text-ink/60 dark:text-white/55">
                Cần ôn lại
              </p>
            </div>
            <div className="rounded-xl bg-slab2 p-4 dark:bg-dark3">
              <p className="metric text-2xl">
                {Math.round((correct / results.length) * 100)}%
              </p>
              <p className="mt-1 text-xs text-ink/60 dark:text-white/55">
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
          className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-bold ${mode === "flashcard" ? "bg-slab shadow-raised dark:bg-dark3" : "text-ink/60 dark:text-white/60"}`}
        >
          Flashcard
        </button>
        <button
          onClick={() => {
            setMode("quiz");
            setAnswer(null);
            setSelectedOption(null);
          }}
          className={`flex-1 rounded-xl px-3 py-2.5 text-sm font-bold ${mode === "quiz" ? "bg-slab shadow-raised dark:bg-dark3" : "text-ink/60 dark:text-white/60"}`}
        >
          Trắc nghiệm
        </button>
        <button
          onClick={() => {
            setMode("spelling");
            setAnswer(null);
            setSelectedOption(null);
          }}
          className={`flex-1 rounded-xl px-3 py-2.5 text-sm font-bold ${mode === "spelling" ? "bg-slab shadow-raised dark:bg-dark3" : "text-ink/60 dark:text-white/60"}`}
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
                className={`text-sm font-bold ${answer ? "text-sage" : "text-danger"}`}
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
  const [addTab, setAddTab] = useState("manual");
  const [actionsOpen, setActionsOpen] = useState(false);
  const [themePickerOpen, setThemePickerOpen] = useState(false);
  const [manualDraft, setManualDraft] = useState({ word: "", ipa: "", meaning: "", example: "", exampleTranslation: "", level: "B1" });
  const [topic, setTopic] = useState("Du lịch - giao tiếp");
  const [level, setLevel] = useState("B1");
  const [amount, setAmount] = useState("5");
  const [loading, setLoading] = useState("");
  // Mọi thông báo đi qua hệ thống toast dùng chung; giữ tên hàm để không phải sửa các chỗ gọi.
  const setError = useCallback((message) => { if (message) toast.error(message); }, []);
  const setNotice = useCallback((message) => { if (message) toast.success(message); }, []);
  const [studyDeckId, setStudyDeckId] = useState(null);
  const [studyMode, setStudyMode] = useState(null);
  const [studyCards, setStudyCards] = useState(null);
  const [singleCardId, setSingleCardId] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [libraryLoading, setLibraryLoading] = useState(true);
  const [speakingWord, setSpeakingWord] = useState("");
  const [dataModal, setDataModal] = useState(null);
  const [sharedDeck, setSharedDeck] = useState(() => readSharedDeckFromUrl());
  const [reloadToken, setReloadToken] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [srsMenuOpen, setSrsMenuOpen] = useState(false);
  // Sửa hàng loạt + thùng rác (xoá mềm).
  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [bulkBusy, setBulkBusy] = useState(false);
  const [trashOpen, setTrashOpen] = useState(false);
  const [trashItems, setTrashItems] = useState({ decks: [], cards: [] });
  const [trashBusy, setTrashBusy] = useState(false);
  const debouncedSearch = useDebounce(searchQuery);
  const debouncedManualWord = useDebounce(manualWord);
  const debouncedTopic = useDebounce(topic);

  const offerUndo = useCallback((message, action) => {
    toast.undo(message, {
      label: "Hoàn tác",
      onClick: async () => {
        try {
          await action();
          toast.success("Đã hoàn tác thao tác xoá.");
        } catch (undoError) {
          toast.error(undoError.message || "Không thể hoàn tác.");
        }
      },
    });
  }, []);

  const selectedDeck =
    library.decks.find((deck) => deck.id === selectedDeckId) ||
    library.decks[0];
  const deckCards = useMemo(
    () => library.cards.filter((card) => card.deckId === selectedDeck?.id),
    [library.cards, selectedDeck?.id],
  );
  const today = dateKey();
  const dueCards = useMemo(() => deckCards.filter((card) => isDue(card, today)), [deckCards, today]);
  const statusCounts = useMemo(() => ({
    all: deckCards.length,
    unlearned: deckCards.filter((card) => card.status !== "mastered").length,
    mastered: deckCards.filter((card) => card.status === "mastered").length,
  }), [deckCards]);
  const searchTerm = debouncedSearch.trim().toLowerCase();
  const filteredCards = useMemo(() => {
    const intervalMatch = String(activeFilter).match(/^interval-(\d+)$/);
    const base = activeFilter === "due"
      ? dueCards
      : activeFilter === "unlearned"
        ? deckCards.filter((card) => card.status !== "mastered")
        : activeFilter === "mastered"
          ? deckCards.filter((card) => card.status === "mastered")
          : activeFilter === "leech"
            ? deckCards.filter((card) => isLeech(card))
            : intervalMatch
              ? deckCards.filter((card) => Number(card.interval) === Number(intervalMatch[1]))
              : deckCards;
    if (!searchTerm) return base;
    return base.filter((card) => `${card.word} ${card.meaning} ${card.example}`.toLowerCase().includes(searchTerm));
  }, [activeFilter, deckCards, dueCards, searchTerm]);

  const [visibleCount, setVisibleCount] = useState(RENDER_LIMIT);
  const visibleCards = useMemo(() => filteredCards.slice(0, visibleCount), [filteredCards, visibleCount]);
  useEffect(() => {
    setVisibleCount(RENDER_LIMIT);
  }, [selectedDeck?.id, activeFilter, searchTerm]);
  const sessionCount = (cards) => Math.min(cards.length, SESSION_LIMIT);

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
          const seeded = await seedStarterDeck();
          if (active) setLibrary(seeded);
          return;
        }
        const cardsByDeck = await Promise.all(decks.map((deck) => dataService.getCards(deck.id)));
        const { decks: safeDecks, cards: initialCards } = repairLibrary(decks, cardsByDeck.flat());
        decks = safeDecks;
        // Bộ mặc định cũ (10 từ IELTS) chưa học gì thì thay bằng bộ 1000 từ thông dụng.
        const legacyDeck = decks.find((deck) => {
          if (deck.title !== LEGACY_STARTER_TITLE) return false;
          const owned = initialCards.filter((card) => card.deckId === deck.id);
          return owned.length > 0 && owned.length <= 12 && owned.every((card) => card.status === "new" && !card.repetition && !card.lastStudiedDate);
        });
        const hasCommonDeck = decks.some((deck) => deck.title.includes(COMMON_DECK_TITLE_MATCH));
        if (legacyDeck && !hasCommonDeck) {
          const seeded = await seedStarterDeck();
          await dataService.deleteDeck(legacyDeck.id).catch(() => {});
          const remainingDecks = decks.filter((deck) => deck.id !== legacyDeck.id);
          const remainingCards = initialCards.filter((card) => card.deckId !== legacyDeck.id);
          if (active) {
            setLibrary({ decks: [...remainingDecks, ...seeded.decks], cards: [...remainingCards, ...seeded.cards] });
            setNotice(`Đã thay bộ thẻ mặc định bằng ${seeded.cards.length} từ tiếng Anh thông dụng.`);
          }
          return;
        }
        if (active) setLibrary({ decks, cards: initialCards });
        // Bộ mặc định có 1000 từ: chỉ tự tra ảnh cho thư viện nhỏ, và tối đa 8 thẻ mỗi lần tải
        // để không gọi API hàng nghìn lần.
        if (initialCards.length <= 200) {
          void Promise.all(initialCards.filter((card) => !card.imageUrl).slice(0, 8).map(async (card) => {
            const imageUrl = await findVocabularyImageSafely(card.word, card.meaning);
            if (!imageUrl) return;
            try { await dataService.updateCard(card.id, { imageUrl }); } catch { return; }
            if (active) setLibrary((current) => ({ ...current, cards: current.cards.map((item) => item.id === card.id ? { ...item, imageUrl } : item) }));
          }));
        }
      } catch (loadError) {
        if (active) setError(loadError.message || "Không thể tải thư viện từ vựng.");
      } finally {
        if (active) setLibraryLoading(false);
      }
    };
    loadLibrary();
    return () => { active = false; };
  }, [user?.uid, reloadToken]);
  useEffect(() => {
    const handleRefresh = () => setReloadToken((value) => value + 1);
    window.addEventListener(refreshRequestedEvent, handleRefresh);
    return () => window.removeEventListener(refreshRequestedEvent, handleRefresh);
  }, []);
  useEffect(() => {
    if (!selectedDeck && library.decks[0])
      setSelectedDeckId(library.decks[0].id);
  }, [library.decks, selectedDeck]);
  // Widget màn hình chính (APK) dùng số liệu này: chỉ ghi localStorage + bắn event, không gọi mạng.
  useEffect(() => {
    publishCardStats(library.cards);
  }, [library.cards]);
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

  // Tìm kiếm toàn cục (Ctrl/⌘+K): mở đúng từ/bộ khi người dùng chọn kết quả.
  useEffect(() => {
    const pending = consumePendingItem("vocabulary");
    if (!pending) return;
    if (pending.type === "word" && pending.itemId) {
      setSearchQuery(pending.itemId);
      setActiveFilter("all");
    } else if (pending.type === "theme" && pending.itemId) {
      setThemePickerOpen(true);
    }
  }, []);

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
    if (!window.confirm(`Chuyển bộ “${deck.title}” và toàn bộ từ trong bộ vào thùng rác?`))
      return;
    const removedCards = library.cards.filter((card) => card.deckId === deck.id);
    await dataService.trashDeck(deck.id);
    const nextDecks = library.decks.filter((item) => item.id !== deck.id);
    updateLibrary({
      decks: nextDecks,
      cards: library.cards.filter((card) => card.deckId !== deck.id),
    });
    setSelectedDeckId(nextDecks[0].id);
    offerUndo(`Đã chuyển bộ “${deck.title}” (${removedCards.length} từ) vào thùng rác.`, async () => {
      await dataService.restoreDeck(deck.id);
      setLibrary((current) => ({
        ...current,
        decks: [...current.decks, { ...deck, deletedAt: null }],
        cards: [...removedCards.map((card) => ({ ...card, deletedAt: null })), ...current.cards],
      }));
      setSelectedDeckId(deck.id);
    });
  };

  const shareCurrentDeck = async () => {
    if (!selectedDeck) return;
    try {
      const { url, count } = shareDeck(selectedDeck, deckCards);
      if (await copyShareLink(url)) setNotice(`Đã copy liên kết chia sẻ ${count} từ của bộ “${selectedDeck.title}”.`);
      else window.prompt("Copy liên kết chia sẻ dưới đây:", url);
      setError("");
    } catch (shareError) {
      setError(shareError.message || "Không thể tạo liên kết chia sẻ.");
    }
  };

  const importSharedDeck = async () => {
    if (!sharedDeck) return;
    try {
      await importDeck(sharedDeck.title, sharedDeck.cards);
      clearSharedDeckFromUrl();
      setSharedDeck(null);
      setNotice(`Đã thêm bộ “${sharedDeck.title}” từ liên kết chia sẻ.`);
    } catch (importError) {
      setError(importError.message || "Không thể nhập bộ thẻ được chia sẻ.");
    }
  };

  const dismissSharedDeck = () => {
    clearSharedDeckFromUrl();
    setSharedDeck(null);
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
        audioUrl: item.audioUrl || "",
      }))
      .filter((card) => card.word);
    const savedCards = await Promise.all(cards.map((card) => dataService.addCard(card)));
    setLibrary((current) => ({ ...current, cards: [...savedCards, ...current.cards] }));
    return savedCards;
  };

  const importDeck = async (title, items) => {
    const deck = await dataService.createDeck(title);
    // Thẻ có thể đến từ file/liên kết chia sẻ nên cần bổ sung id duy nhất.
    const importedCards = items.map((item) => ({ ...item, id: item.id || makeId("card"), deckId: deck.id }));
    const savedCards = await Promise.all(importedCards.map((card) => dataService.addCard(card)));
    const normalizedDeck = { ...deck, tags: deck.tags || [], createdAt: deck.createdAt || new Date().toISOString() };
    setLibrary((current) => ({ ...current, decks: [...current.decks, normalizedDeck], cards: [...savedCards, ...current.cards] }));
    setSelectedDeckId(normalizedDeck.id);
    setDataModal(null);
  };

  const lookupWord = async () => {
    const term = debouncedManualWord.trim();
    if (!term) return;
    setLoading("lookup");
    setError("");
    try {
      if (deckCards.some((card) => normalizeWord(card.word) === normalizeWord(term))) {
        setError("Từ này đã có trong bộ hiện tại.");
        return;
      }
      // Có API key thì dùng AI; chưa có hoặc AI lỗi thì rơi về từ điển miễn phí.
      let result = null;
      let aiFailed = false;
      if (apiKey) {
        try {
          result = parseAiJson(
            await requestAi(
              localStorage.getItem(PROVIDER_STORAGE) || "gemini",
              apiKey,
              quickLookupPrompt(term),
              { json: true },
            ),
          );
        } catch {
          aiFailed = true;
        }
      }
      if (!result) {
        result = await lookupWordOffline(term);
        if (aiFailed) toast.info("AI không phản hồi, đã tra bằng từ điển miễn phí.");
      }
      setLookupResult({ ...result, word: titleCaseWord(result.word || term), level });
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
      if (saved.length) { setLookupResult(null); setManualWord(""); setError(""); setManualModalOpen(false); setNotice(`Đã thêm vào bộ ${selectedDeck?.title}.`); }
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
      const saved = await addCards(result.cards || []);
      if (saved.length) setManualModalOpen(false);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading("");
    }
  };

  // Cập nhật theo hàm: khi học, nhiều thẻ được chấm liên tiếp nên không được ghi đè lẫn nhau.
  const updateCard = useCallback(async (cardId, changes) => {
    await dataService.updateCard(cardId, changes);
    setLibrary((current) => ({ ...current, cards: current.cards.map((card) => (card.id === cardId ? { ...card, ...changes } : card)) }));
    // Chỉ ghi lịch sử khi đây là một lượt ôn thật (có lastStudiedDate).
    if (changes?.lastStudiedDate) void recordStudyEvent({ reviewed: 1, correct: changes.status === "mastered" ? 1 : 0 });
  }, []);
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
    setNotice(`Đã dọn ${duplicateIds.length} từ trùng lặp trong bộ.`);
  };
  // Thêm một bộ từ theo chủ đề (cụm từ/collocation) vào thư viện.
  const addThemeDeck = async (deckId) => {
    const created = createThemeDeck(deckId);
    if (!created) return;
    setLoading(`theme-${deckId}`);
    try {
      const targetDeck = await dataService.createDeck(created.deck.title);
      const savedCards = await dataService.addCards(created.cards.map((card) => ({ ...card, deckId: targetDeck.id })));
      updateLibrary({
        decks: [...library.decks, { ...targetDeck, tags: created.deck.tags, description: created.deck.description }],
        cards: [...savedCards, ...library.cards],
      });
      setSelectedDeckId(targetDeck.id);
      setThemePickerOpen(false);
      setNotice(`Đã thêm “${created.deck.title}” với ${savedCards.length} cụm từ.`);
    } catch (requestError) {
      setError(requestError.message || "Không thể thêm bộ từ theo chủ đề lúc này.");
    } finally {
      setLoading("");
    }
  };

  const addIeltsDeck = async () => {
    const seed = createStarterDeck();
    const existingDeck = library.decks.find((deck) => deck.title === seed.title);
    if (existingDeck) {
      setSelectedDeckId(existingDeck.id);
      return setNotice("Bộ IELTS Speaking Part 1 đã có trong thư viện.");
    }    setLoading("add-deck");
    try {
      const targetDeck = await dataService.createDeck(seed.title);
      const newCards = seed.cards.map((card) => ({ ...card, deckId: targetDeck.id }));
      const savedCards = await Promise.all(newCards.map((card) => dataService.addCard(card)));
      updateLibrary({ decks: [...library.decks, { ...targetDeck, tags: seed.tags, description: seed.description }], cards: [...savedCards, ...library.cards] });
      setSelectedDeckId(targetDeck.id);
      setNotice(`Đã thêm bộ IELTS Speaking Part 1 với ${savedCards.length} từ.`);
    } catch (requestError) {
      setError(requestError.message || "Không thể thêm bộ IELTS lúc này.");
    } finally {
      setLoading("");
    }
  };
  const removeCard = useCallback(async (cardId) => {
    const removedCard = library.cards.find((card) => card.id === cardId);
    await dataService.trashCard(cardId);
    setLibrary((current) => ({ ...current, cards: current.cards.filter((card) => card.id !== cardId) }));
    if (removedCard) {
      offerUndo(`Đã chuyển từ “${removedCard.word}” vào thùng rác.`, async () => {
        await dataService.restoreCard(removedCard.id);
        setLibrary((current) => ({ ...current, cards: [{ ...removedCard, deletedAt: null }, ...current.cards] }));
      });
    }
  }, [library.cards, offerUndo]);
  const speak = (word, id = word) => {
    setSpeakingWord(id);
    speakText(word, { onEnd: () => setSpeakingWord("") });
  };

  // --- Sửa hàng loạt -------------------------------------------------------
  const exitSelectMode = () => {
    setSelectMode(false);
    setSelectedIds([]);
  };
  const toggleSelect = useCallback((cardId) => {
    setSelectedIds((current) => (current.includes(cardId) ? current.filter((id) => id !== cardId) : [...current, cardId]));
  }, []);
  const toggleSelectAll = () =>
    setSelectedIds((current) => (current.length === filteredCards.length ? [] : filteredCards.map((card) => card.id)));
  const applyBulk = async (changes, message) => {
    if (!selectedIds.length) return;
    setBulkBusy(true);
    try {
      await dataService.updateCards(selectedIds, changes);
      const idSet = new Set(selectedIds);
      setLibrary((current) => ({ ...current, cards: current.cards.map((card) => (idSet.has(card.id) ? { ...card, ...changes } : card)) }));
      setNotice(message);
      setSelectedIds([]);
    } catch (bulkError) {
      setError(bulkError.message || "Không thể cập nhật các từ đã chọn.");
    } finally {
      setBulkBusy(false);
    }
  };
  const bulkTrash = async () => {
    if (!selectedIds.length) return;
    setBulkBusy(true);
    try {
      const idSet = new Set(selectedIds);
      const removed = library.cards.filter((card) => idSet.has(card.id));
      await Promise.all(removed.map((card) => dataService.trashCard(card.id)));
      setLibrary((current) => ({ ...current, cards: current.cards.filter((card) => !idSet.has(card.id)) }));
      setSelectedIds([]);
      offerUndo(`Đã chuyển ${removed.length} từ vào thùng rác.`, async () => {
        await Promise.all(removed.map((card) => dataService.restoreCard(card.id)));
        setLibrary((current) => ({ ...current, cards: [...removed.map((card) => ({ ...card, deletedAt: null })), ...current.cards] }));
      });
    } catch (bulkError) {
      setError(bulkError.message || "Không thể xoá các từ đã chọn.");
    } finally {
      setBulkBusy(false);
    }
  };

  // --- Thùng rác -----------------------------------------------------------
  const openTrash = async () => {
    setActionsOpen(false);
    setTrashOpen(true);
    setTrashBusy(true);
    try {
      setTrashItems(await dataService.getTrashed());
    } catch (trashError) {
      setError(trashError.message || "Không thể tải thùng rác.");
    } finally {
      setTrashBusy(false);
    }
  };
  const restoreTrashedDeck = async (deck) => {
    setTrashBusy(true);
    try {
      await dataService.restoreDeck(deck.id);
      setTrashItems(await dataService.getTrashed());
      setReloadToken((value) => value + 1);
      setNotice(`Đã khôi phục bộ “${deck.title}”.`);
    } catch (trashError) {
      setError(trashError.message || "Không thể khôi phục bộ thẻ.");
    } finally {
      setTrashBusy(false);
    }
  };
  const restoreTrashedCard = async (card) => {
    setTrashBusy(true);
    try {
      await dataService.restoreCard(card.id);
      setTrashItems(await dataService.getTrashed());
      setReloadToken((value) => value + 1);
      setNotice(`Đã khôi phục từ “${card.word}”.`);
    } catch (trashError) {
      setError(trashError.message || "Không thể khôi phục từ này.");
    } finally {
      setTrashBusy(false);
    }
  };
  const emptyTrash = async () => {
    if (!window.confirm("Xoá vĩnh viễn toàn bộ bộ thẻ và từ trong thùng rác?")) return;
    setTrashBusy(true);
    try {
      await dataService.purgeTrash();
      setTrashItems({ decks: [], cards: [] });
      setNotice("Đã dọn sạch thùng rác.");
    } catch (trashError) {
      setError(trashError.message || "Không thể dọn thùng rác.");
    } finally {
      setTrashBusy(false);
    }
  };

  const openStudy = (cards) => {
    // Mỗi phiên chỉ lấy tối đa 50 thẻ để phiên học không kéo dài vô tận với bộ 1000 từ.
    setStudyCards(cards.slice(0, SESSION_LIMIT));
    setStudyDeckId(selectedDeck.id);
    setStudyMode(null);
  };

  if (libraryLoading) {
    return <div role="status" aria-live="polite" className="panel grid min-h-64 place-items-center p-8"><LoaderCircle className="animate-spin text-sage" size={24} aria-hidden="true" /><p className="mt-3 text-sm text-ink/50 dark:text-white/50">Đang đồng bộ thư viện từ vựng...</p></div>;
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
      <StudyAnalyticsWidget cards={deckCards} streak={streak} dueCount={sessionCount(dueCards)} deckTitle={selectedDeck?.title || ''} onStartToday={() => openStudy(dueCards.length ? dueCards : deckCards)} />
      <div className="grid gap-6 xl:grid-cols-[280px_1fr]">
        <aside className="panel h-fit overflow-hidden p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="eyebrow">Thư viện</p>
              <div className="flex items-center gap-1"><h2 className="mt-1 font-display font-bold">Bộ chủ đề</h2><button onClick={() => setDataModal("export")} className="icon-btn h-10 w-10" aria-label="Xuất dữ liệu" title="Xuất dữ liệu"><Download size={16} /></button><button onClick={() => setDataModal("import")} className="icon-btn h-10 w-10" aria-label="Nhập dữ liệu" title="Nhập dữ liệu"><FileUp size={16} /></button></div>
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
              className="min-w-0 flex-1 rounded-xl border border-ink/10 bg-transparent px-3 py-2.5 text-sm outline-none dark:border-white/10"
            />
            <button
              className="btn-primary h-11 w-11 shrink-0 p-0"
              aria-label="Tạo bộ mới"
            >
              <Plus size={17} />
            </button>
          </form>
          <div className="mt-4 flex gap-2 overflow-x-auto pb-1 xl:block xl:space-y-1.5">
            {library.decks.map((deck) => (
              <button
                key={deck.id}
                onClick={() => setSelectedDeckId(deck.id)}
                aria-current={selectedDeck?.id === deck.id ? "true" : undefined}
                className={`flex min-h-[44px] min-w-[190px] items-center gap-2.5 rounded-xl px-3 py-2.5 text-left transition xl:w-full ${selectedDeck?.id === deck.id ? "bg-lime text-ink" : "text-ink/70 hover:bg-ink/[0.05] dark:text-white/70 dark:hover:bg-white/[0.08]"}`}
              >
                <BookOpen size={17} className="shrink-0" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-bold">{deck.title}</span>
                  <span className="text-xs text-ink/60 dark:text-white/50">
                    {library.cards.filter((card) => card.deckId === deck.id).length} từ
                  </span>
                </span>
                <ChevronRight size={15} className="shrink-0 opacity-50" />
              </button>
            ))}
          </div>
        </aside>
        <main className="min-w-0 space-y-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="eyebrow">Chi tiết bộ</p>
              <h2 className="mt-1 font-display text-2xl font-bold tracking-tight">
                {selectedDeck?.title}
              </h2>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {(selectedDeck?.tags || []).map((tag) => (
                  <span
                    key={tag}
                    className="chip bg-ink/[0.06] text-ink/70 dark:bg-white/10 dark:text-white/70"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex w-full items-center gap-2 sm:w-auto">
              <button onClick={() => openStudy(deckCards)} disabled={!deckCards.length} className="btn-primary min-h-12 flex-1 px-5 disabled:cursor-not-allowed sm:flex-none">
                <Sparkles size={17} />Bắt đầu học ngay
              </button>
              <div className="relative"><button onClick={() => setActionsOpen((value) => !value)} className="icon-btn h-12 w-12 border border-ink/10 dark:border-white/15" aria-label="Thêm hành động cho bộ này" aria-expanded={actionsOpen}><MoreVertical size={19} /></button>{actionsOpen && <div className="absolute right-0 top-14 z-30 w-64 rounded-xl border border-ink/10 bg-slab p-1.5 shadow-soft dark:border-white/10 dark:bg-dark2"><p className="truncate px-3 py-2 text-xs font-bold uppercase tracking-[0.08em] text-ink/60 dark:text-white/50">{selectedDeck?.title}</p><button onClick={() => { openStudy(dueCards); setActionsOpen(false); }} disabled={!dueCards.length} className="menu-item"><Check size={16} />Ôn {sessionCount(dueCards)} từ đến hạn</button><button onClick={() => { setActionsOpen(false); renameDeck(selectedDeck); }} className="menu-item"><Pencil size={16} />Đổi tên bộ</button><button onClick={() => { shareCurrentDeck(); setActionsOpen(false); }} className="menu-item"><Share2 size={16} />Chia sẻ bộ này</button><button onClick={() => { cleanupDuplicates(); setActionsOpen(false); }} className="menu-item"><Trash2 size={16} />Dọn từ trùng</button><button onClick={() => { setThemePickerOpen(true); setActionsOpen(false); }} className="menu-item"><BookOpen size={16} />Thêm bộ từ theo chủ đề</button><button onClick={() => { addIeltsDeck(); setActionsOpen(false); }} disabled={loading === "add-deck"} className="menu-item"><BookOpen size={16} />Thêm bộ IELTS mẫu</button><button onClick={() => { openTrash(); }} className="menu-item"><ArchiveRestore size={16} />Thùng rác</button><button onClick={() => { deleteDeck(selectedDeck); setActionsOpen(false); }} className="menu-item text-danger dark:text-dangerfgdark"><Trash2 size={16} />Xoá bộ này</button></div>}</div>
            </div>
          </div>
          <section className="panel overflow-hidden">
            <div className="border-b border-ink/[0.08] px-5 py-4 dark:border-white/[0.08]">
              <div className="flex flex-wrap items-center gap-3">
                <p className="font-display font-bold">Từ trong bộ</p>
                <label className="relative min-w-0 flex-1 sm:max-w-xs">
                  <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink/60 dark:text-white/50" aria-hidden="true" />
                  <input
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Tìm từ hoặc nghĩa..."
                    aria-label="Tìm từ trong bộ này"
                    className="field py-2.5 pl-9 text-sm"
                  />
                </label>
                <div className="ml-auto flex items-center gap-2">
                  <button onClick={() => (selectMode ? exitSelectMode() : setSelectMode(true))} aria-pressed={selectMode} className="btn-ghost px-3 text-xs">
                    {selectMode ? "Xong" : "Sửa hàng loạt"}
                  </button>
                  <button onClick={() => openStudy(filteredCards)} disabled={!filteredCards.length} className="btn-secondary px-4">
                    <Sparkles size={16} />
                    Học {sessionCount(filteredCards)} từ
                  </button>
                  <button onClick={() => { setAddTab("manual"); openManualModal(); }} className="btn-ghost hidden sm:inline-flex">
                    <Plus size={16} />
                    Thêm thẻ
                  </button>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <div className="flex gap-1 rounded-xl bg-ink/[0.05] p-1 dark:bg-white/[0.08]" role="group" aria-label="Lọc theo trạng thái">
                  {[["all", "Tất cả"], ["unlearned", "Chưa thuộc"], ["mastered", "Đã thuộc"]].map(([value, label]) => (
                    <button
                      key={value}
                      onClick={() => setActiveFilter(value)}
                      aria-pressed={activeFilter === value}
                      className={`min-h-[44px] rounded-lg px-3.5 text-sm font-bold transition ${activeFilter === value ? "bg-slab shadow-raised dark:bg-dark3" : "text-ink/60 hover:text-ink dark:text-white/60 dark:hover:text-white"}`}
                    >
                      {label} ({statusCounts[value]})
                    </button>
                  ))}
                </div>
                <div className="relative">
                  <button
                    onClick={() => setSrsMenuOpen((value) => !value)}
                    aria-expanded={srsMenuOpen}
                    className={`flex min-h-[44px] items-center gap-2 rounded-xl border px-3.5 text-sm font-bold transition ${activeFilter === "due" || activeFilter.startsWith("interval-") ? "border-sage bg-sage/15 text-ink dark:text-white" : "border-ink/10 text-ink/70 hover:bg-ink/[0.05] dark:border-white/15 dark:text-white/70 dark:hover:bg-white/10"}`}
                  >
                    <CalendarClock size={16} />
                    {srsFilterLabels[activeFilter] || "Lịch ôn"}
                    <ChevronDown size={15} className={`transition ${srsMenuOpen ? "rotate-180" : ""}`} />
                  </button>
                  {srsMenuOpen && (
                    <div className="absolute left-0 top-12 z-30 w-56 rounded-xl border border-ink/10 bg-slab p-1.5 shadow-soft dark:border-white/10 dark:bg-dark2">
                      {Object.entries(srsFilterLabels).map(([value, label]) => (
                        <button key={value} onClick={() => { setActiveFilter(value); setSrsMenuOpen(false); }} className="menu-item">
                          {label} {value === "due" ? `(${dueCards.length})` : ""}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <span className="ml-auto text-xs font-semibold text-ink/60 dark:text-white/55">Hiện {filteredCards.length} từ</span>
              </div>
              {selectMode && (
                <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 rounded-xl border border-sage/40 bg-sage/10 px-3 py-2">
                  <label className="flex items-center gap-2 text-xs font-bold"><input type="checkbox" checked={filteredCards.length > 0 && selectedIds.length === filteredCards.length} onChange={toggleSelectAll} className="h-4 w-4 accent-lime" />Chọn tất cả</label>
                  <span className="text-xs font-semibold text-ink/60 dark:text-white/60">Đã chọn {selectedIds.length}</span>
                  <div className="ml-auto flex flex-wrap items-center gap-2">
                    <button disabled={!selectedIds.length || bulkBusy} onClick={() => applyBulk({ status: "mastered" }, `Đã đánh dấu thuộc ${selectedIds.length} từ.`)} className="btn-secondary px-3 text-xs">Đã thuộc</button>
                    <button disabled={!selectedIds.length || bulkBusy} onClick={() => applyBulk({ status: "new", interval: 0, repetition: 0, lapses: 0, ease: 2.5, nextReviewDate: null, reviewDate: null, lastStudiedDate: null }, `Đã đặt lại tiến độ ${selectedIds.length} từ.`)} className="btn-secondary px-3 text-xs">Học lại từ đầu</button>
                    <select
                      disabled={!selectedIds.length || bulkBusy}
                      defaultValue=""
                      onChange={(event) => {
                        const value = event.target.value;
                        event.target.value = "";
                        if (value) applyBulk({ level: value }, `Đã đổi ${selectedIds.length} từ sang cấp độ ${value}.`);
                      }}
                      className="min-h-[44px] rounded-xl border border-ink/10 bg-transparent px-2 text-xs font-bold dark:border-white/15"
                      aria-label="Đổi cấp độ cho các từ đã chọn"
                    >
                      <option value="">Cấp độ…</option>
                      {levels.map((item) => <option key={item} value={item}>{item}</option>)}
                    </select>
                    <button disabled={!selectedIds.length || bulkBusy} onClick={bulkTrash} className="btn-ghost px-3 text-xs text-danger dark:text-dangerfgdark"><Trash2 size={15} />Vào thùng rác</button>
                  </div>
                </div>
              )}
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
              <div>
                {visibleCards.map((card) => <VocabularyCard key={card.id} card={card} speakingWord={speakingWord} onSpeak={speak} onStudy={setSingleCardId} onUpdate={updateCard} onRemove={removeCard} selectMode={selectMode} selected={selectedIds.includes(card.id)} onToggleSelect={toggleSelect} />)}
                {filteredCards.length > visibleCards.length && (
                  <div className="border-t border-ink/[0.08] p-4 text-center dark:border-white/[0.08]">
                    <button onClick={() => setVisibleCount((value) => value + RENDER_LIMIT)} className="btn-secondary px-4">
                      Xem thêm {Math.min(RENDER_LIMIT, filteredCards.length - visibleCards.length)} từ
                    </button>
                  </div>
                )}
              </div>
            )}
          </section>
        </main>
      </div>
      {themePickerOpen && <div className="fixed inset-0 z-[120] grid place-items-center bg-ink/40 p-4 backdrop-blur-sm"><section className="panel w-full max-w-lg p-5"><div className="flex items-start justify-between gap-3"><div><p className="eyebrow">Bộ từ theo chủ đề</p><h2 className="mt-1 font-display text-xl font-bold">Học theo cụm từ</h2></div><button onClick={() => setThemePickerOpen(false)} className="icon-btn -mr-2" aria-label="Đóng"><X size={18} /></button></div><p className="mt-3 text-xs leading-5 text-ink/60 dark:text-white/60">Học cụm từ (collocation, phrasal verb) giúp bạn dùng từ đúng ngữ cảnh — đây là phần hay mất điểm ở trình độ B1.</p><ul className="mt-4 max-h-[60vh] space-y-2 overflow-y-auto">{themeDecks.map((deck) => <li key={deck.id}><button onClick={() => addThemeDeck(deck.id)} disabled={loading === `theme-${deck.id}`} className="flex w-full items-center gap-3 rounded-xl border border-ink/[0.08] p-3 text-left transition hover:bg-ink/[0.03] disabled:opacity-60 dark:border-white/[0.08] dark:hover:bg-white/[0.05]"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-lime text-ink"><BookOpen size={17} /></span><span className="min-w-0 flex-1"><span className="block truncate text-sm font-bold">{deck.title}</span><span className="mt-0.5 block truncate text-xs text-ink/60 dark:text-white/60">{deck.description}</span></span><span className="chip shrink-0 bg-ink/[0.06] text-ink/70 dark:bg-white/10 dark:text-white/70">{loading === `theme-${deck.id}` ? 'Đang thêm…' : deck.level}</span></button></li>)}</ul></section></div>}
      {trashOpen && <div className="fixed inset-0 z-[120] grid place-items-center bg-ink/40 p-4 backdrop-blur-sm"><section className="panel max-h-[85vh] w-full max-w-lg overflow-y-auto p-5"><div className="flex items-start justify-between gap-3"><div><p className="eyebrow">Thùng rác</p><h2 className="mt-1 font-display text-xl font-bold">Bộ thẻ &amp; từ đã xoá</h2></div><button onClick={() => setTrashOpen(false)} className="icon-btn -mr-2" aria-label="Đóng"><X size={18} /></button></div><p className="mt-3 text-xs leading-5 text-ink/60 dark:text-white/60">Mọi thứ bạn xoá được giữ ở đây để khôi phục. “Dọn thùng rác” sẽ xoá vĩnh viễn.</p>{trashBusy && <p className="mt-4 flex items-center gap-2 text-xs text-ink/60 dark:text-white/60"><LoaderCircle size={14} className="animate-spin" />Đang xử lý…</p>}<div className="mt-4 space-y-2">{trashItems.decks.map((deck) => <div key={deck.id} className="flex items-center gap-3 rounded-xl border border-ink/[0.08] p-3 dark:border-white/[0.08]"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-ink/[0.06] dark:bg-white/10"><BookOpen size={16} /></span><span className="min-w-0 flex-1"><span className="block truncate text-sm font-bold">{deck.title}</span><span className="text-xs text-ink/50 dark:text-white/50">Bộ thẻ</span></span><button disabled={trashBusy} onClick={() => restoreTrashedDeck(deck)} className="btn-secondary shrink-0 px-3 text-xs"><ArchiveRestore size={14} />Khôi phục</button></div>)}{trashItems.cards.map((card) => <div key={card.id} className="flex items-center gap-3 rounded-xl border border-ink/[0.08] p-3 dark:border-white/[0.08]"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-ink/[0.06] dark:bg-white/10"><RotateCcw size={16} /></span><span className="min-w-0 flex-1"><span className="block truncate text-sm font-bold">{card.word}</span><span className="block truncate text-xs text-ink/50 dark:text-white/50">{card.meaning}</span></span><button disabled={trashBusy} onClick={() => restoreTrashedCard(card)} className="btn-secondary shrink-0 px-3 text-xs"><ArchiveRestore size={14} />Khôi phục</button></div>)}{!trashBusy && !trashItems.decks.length && !trashItems.cards.length && <p className="rounded-xl bg-ink/[0.04] p-4 text-center text-sm text-ink/50 dark:bg-white/[0.06] dark:text-white/50">Thùng rác đang trống.</p>}</div><div className="mt-5 flex justify-end gap-2"><button onClick={() => setTrashOpen(false)} className="btn-secondary px-4">Đóng</button><button disabled={trashBusy || (!trashItems.decks.length && !trashItems.cards.length)} onClick={emptyTrash} className="btn-ghost px-4 text-danger dark:text-dangerfgdark"><Trash2 size={16} />Dọn thùng rác</button></div></section></div>}
      {dataModal && <ImportExportModal mode={dataModal} onClose={() => setDataModal(null)} currentDeck={selectedDeck} decks={library.decks} cards={library.cards} onImport={importDeck} />}
      {sharedDeck && <div className="fixed inset-0 z-[110] grid place-items-center bg-ink/40 p-4 backdrop-blur-sm"><section className="panel w-full max-w-md p-6"><div className="flex items-start justify-between gap-3"><div><p className="eyebrow">Chia sẻ</p><h2 className="mt-1 font-display text-xl font-bold">Bộ thẻ được chia sẻ</h2></div><button onClick={dismissSharedDeck} className="icon-btn -mr-2" aria-label="Đóng"><X size={18} /></button></div><p className="mt-4 text-sm font-bold">{sharedDeck.title}</p><p className="mt-1 text-xs text-ink/50 dark:text-white/50">{sharedDeck.cards.length} từ vựng · tiến độ học của bạn sẽ bắt đầu từ đầu</p><ul className="mt-4 max-h-40 overflow-y-auto rounded-xl bg-ink/[0.04] p-3 text-xs leading-6 dark:bg-white/[0.06]">{sharedDeck.cards.slice(0, 8).map((card) => <li key={card.word} className="truncate">• {card.word} — {card.meaning}</li>)}{sharedDeck.cards.length > 8 && <li className="text-ink/45 dark:text-white/45">...và {sharedDeck.cards.length - 8} từ khác</li>}</ul><div className="mt-5 flex justify-end gap-2"><button onClick={dismissSharedDeck} className="rounded-xl border border-ink/10 px-4 py-3 text-sm font-bold dark:border-white/10">Bỏ qua</button><button onClick={importSharedDeck} className="rounded-xl bg-ink px-5 py-3 text-sm font-bold text-white dark:bg-lime dark:text-ink">Thêm vào thư viện</button></div></section></div>}
      <button onClick={() => { setAddTab("manual"); openManualModal(); }} className="fixed bottom-24 right-4 z-40 flex h-14 items-center gap-2 rounded-full bg-lime px-5 text-sm font-bold text-ink shadow-soft transition hover:-translate-y-0.5 sm:hidden" aria-label="Thêm từ mới"><Plus size={19} />Thêm từ</button>
      {manualModalOpen && <AddWordsSheet tab={addTab} onTabChange={setAddTab} draft={manualDraft} levels={levels} busy={loading.startsWith("manual-")} onChange={updateManualDraft} onSuggest={suggestManualDetails} onSave={saveManualCard} topic={topic} onTopicChange={setTopic} level={level} onLevelChange={setLevel} amount={amount} onAmountChange={setAmount} onGenerate={generateVocabulary} lookupResult={lookupResult} onLookupWord={lookupWord} onSaveLookup={saveLookupResult} manualWord={manualWord} onManualWordChange={setManualWord} lookupLoading={loading === "lookup" || loading === "lookup-save"} onClose={() => setManualModalOpen(false)} />}
    </div>
  );
}
