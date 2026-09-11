import { useEffect, useMemo, useState } from "react";
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
} from "lucide-react";
import confetti from "canvas-confetti";
import { parseAiJson, requestAi } from "../../services/aiClient";
import { dataService } from "../../services/dataService";

const STORAGE_KEY = "lingua-vocabulary-library";
const OLD_STORAGE_KEY = "lingua-vocabulary";
const API_KEY_STORAGE = "lingua-ai-api-key";
const PROVIDER_STORAGE = "lingua-ai-provider";
const STREAK_STORAGE = "lingua-study-streak";
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
    }));
    return library;
  } catch {
    return emptyLibrary();
  }
}

const quickLookupPrompt = (word) =>
  `Tra cứu từ tiếng Anh "${word}". Chỉ trả về JSON hợp lệ theo schema {"ipa":"...","meaning":"nghĩa tiếng Việt ngắn gọn","example":"một câu ví dụ tiếng Anh"}. Không markdown.`;
const generatePrompt = (topic, level, amount) =>
  `Bạn là giáo viên tiếng Anh. Tạo đúng ${amount} từ vựng theo chủ đề "${topic}" ở trình độ ${level}. Chỉ trả về JSON hợp lệ theo schema {"cards":[{"word":"...","ipa":"...","meaning":"nghĩa tiếng Việt","example":"câu ví dụ tiếng Anh"}]}. Không markdown.`;

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

function PracticeSession({ deck, cards, onExit, onUpdateCard }) {
  const [mode, setMode] = useState("flashcard");
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [answer, setAnswer] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [spelling, setSpelling] = useState("");
  const [results, setResults] = useState([]);
  const [completed, setCompleted] = useState(false);
  const [streak, setStreak] = useState(() =>
    JSON.parse(
      localStorage.getItem(STREAK_STORAGE) || '{"current":0,"totalSessions":0}',
    ),
  );
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

  const finish = (nextResults) => {
    const today = new Date().toISOString().slice(0, 10);
    const stored = JSON.parse(
      localStorage.getItem(STREAK_STORAGE) || '{"current":0,"totalSessions":0}',
    );
    const nextStreak =
      stored.lastDate === today
        ? stored
        : {
            current: (stored.current || 0) + 1,
            totalSessions: (stored.totalSessions || 0) + 1,
            lastDate: today,
          };
    localStorage.setItem(STREAK_STORAGE, JSON.stringify(nextStreak));
    setStreak(nextStreak);
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
              {streak.current} ngày liên tiếp
            </p>
            <p className="mt-1 text-xs text-ink/60">
              Tổng số phiên: {streak.totalSessions}
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
            onClick={() => setFlipped((value) => !value)}
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
                    window.speechSynthesis?.speak(
                      Object.assign(new SpeechSynthesisUtterance(card.word), {
                        lang: "en-US",
                      }),
                    );
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
              window.speechSynthesis?.speak(
                Object.assign(new SpeechSynthesisUtterance(card.word), {
                  lang: "en-US",
                }),
              )
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

export default function VocabularyHub() {
  const [library, setLibrary] = useState({ decks: [], cards: [] });
  const [selectedDeckId, setSelectedDeckId] = useState(null);
  const [deckInput, setDeckInput] = useState("");
  const [manualWord, setManualWord] = useState("");
  const [topic, setTopic] = useState("Du lịch - giao tiếp");
  const [level, setLevel] = useState("B1");
  const [amount, setAmount] = useState("5");
  const [loading, setLoading] = useState("");
  const [error, setError] = useState("");
  const [practiceDeckId, setPracticeDeckId] = useState(null);
  const [libraryLoading, setLibraryLoading] = useState(true);

  const selectedDeck =
    library.decks.find((deck) => deck.id === selectedDeckId) ||
    library.decks[0];
  const deckCards = useMemo(
    () => library.cards.filter((card) => card.deckId === selectedDeck?.id),
    [library.cards, selectedDeck?.id],
  );

  useEffect(() => {
    let active = true;
    const loadLibrary = async () => {
      try {
        let decks = await dataService.getDecks();
        if (!decks.length) {
          const created = await dataService.createDeck("IELTS Speaking Part 1");
          decks = [{ ...created, tags: created.tags || ["IELTS", "Speaking"], createdAt: created.createdAt || created.created_at }];
        }
        const cardsByDeck = await Promise.all(decks.map((deck) => dataService.getCards(deck.id)));
        if (active) setLibrary({ decks, cards: cardsByDeck.flat() });
      } catch (loadError) {
        if (active) setError(loadError.message || "Không thể tải thư viện từ vựng.");
      } finally {
        if (active) setLibraryLoading(false);
      }
    };
    loadLibrary();
    return () => { active = false; };
  }, []);
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
      setPracticeDeckId(matchingDeck.id);
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
    const cards = items
      .map((item) => ({
        id: makeId("card"),
        deckId: selectedDeck.id,
        word: item.word?.trim() || "",
        ipa: item.ipa || item.pronunciation || "",
        meaning: item.meaning || "",
        example: item.example || "",
        level: item.level || level,
        status: "new",
        reviewDate: null,
      }))
      .filter((card) => card.word);
    const savedCards = await Promise.all(cards.map((card) => dataService.addCard(card)));
    updateLibrary({ cards: [...savedCards, ...library.cards] });
  };

  const lookupWord = async () => {
    if (!manualWord.trim()) return;
    const apiKey = localStorage.getItem(API_KEY_STORAGE) || "";
    if (!apiKey)
      return setError(
        "Hãy lưu API key trong tab Cài đặt API trước khi tra từ.",
      );
    setLoading("lookup");
    setError("");
    try {
      const result = parseAiJson(
        await requestAi(
          localStorage.getItem(PROVIDER_STORAGE) || "gemini",
          apiKey,
          quickLookupPrompt(manualWord),
          { json: true },
        ),
      );
      await addCards([{ ...result, word: manualWord }]);
      setManualWord("");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading("");
    }
  };

  const generateVocabulary = async () => {
    const apiKey = localStorage.getItem(API_KEY_STORAGE) || "";
    if (!apiKey)
      return setError(
        "Hãy lưu API key trong tab Cài đặt API trước khi dùng AI.",
      );
    setLoading("generate");
    setError("");
    try {
      const result = parseAiJson(
        await requestAi(
          localStorage.getItem(PROVIDER_STORAGE) || "gemini",
          apiKey,
          generatePrompt(topic, level, amount),
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

  const updateCard = async (cardId, changes) => {
    await dataService.updateCard(cardId, changes);
    updateLibrary({ cards: library.cards.map((card) => card.id === cardId ? { ...card, ...changes } : card) });
  };
  const removeCard = async (cardId) => {
    await dataService.deleteCard(cardId);
    updateLibrary({ cards: library.cards.filter((card) => card.id !== cardId) });
  };
  const speak = (word) => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = "en-US";
      window.speechSynthesis.speak(utterance);
    }
  };

  if (libraryLoading) {
    return <div className="panel grid min-h-64 place-items-center p-8"><LoaderCircle className="animate-spin text-sage" size={24} /><p className="mt-3 text-sm text-ink/50 dark:text-white/50">Đang đồng bộ thư viện từ vựng...</p></div>;
  }

  if (practiceDeckId) {
    const practiceDeck = library.decks.find(
      (deck) => deck.id === practiceDeckId,
    );
    const practiceCards = library.cards.filter(
      (card) => card.deckId === practiceDeckId,
    );
    if (practiceDeck)
      return (
        <PracticeSession
          deck={practiceDeck}
          cards={practiceCards}
          onExit={() => setPracticeDeckId(null)}
          onUpdateCard={(cardId, changes) => updateCard(cardId, changes)}
        />
      );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[280px_1fr]">
        <aside className="panel h-fit p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="eyebrow">Library</p>
              <h2 className="mt-1 font-display font-bold">Bộ chủ đề</h2>
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
                onClick={() => setPracticeDeckId(selectedDeck.id)}
                disabled={!deckCards.length}
                className="flex items-center gap-2 rounded-xl bg-ink px-3 py-2.5 text-xs font-bold text-white disabled:cursor-not-allowed disabled:opacity-40 dark:bg-lime dark:text-ink"
              >
                <Sparkles size={15} />
                Bắt đầu học bộ này
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
              </div>
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
          <section className="panel overflow-hidden">
            <div className="border-b border-ink/[0.08] px-5 py-4 dark:border-white/[0.08]">
              <p className="font-display font-bold">Từ trong bộ</p>
            </div>
            {deckCards.length === 0 ? (
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
                {deckCards.map((card) => (
                  <article
                    key={card.id}
                    className="flex flex-wrap items-center gap-3 px-5 py-4"
                  >
                    <button
                      onClick={() => speak(card.word)}
                      className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-ink/[0.1] text-ink/45 hover:text-ink dark:border-white/[0.1] dark:text-white/45 dark:hover:text-white"
                      aria-label={`Nghe phát âm ${card.word}`}
                    >
                      <Volume2 size={16} />
                    </button>
                    <div className="min-w-[160px] flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-display font-bold">{card.word}</p>
                        <span className="text-xs text-sage">{card.ipa}</span>
                        <StatusBadge status={card.status} />
                      </div>
                      <p className="mt-1 text-sm font-semibold">
                        {card.meaning}
                      </p>
                      <p className="mt-1 text-xs leading-5 text-ink/45 dark:text-white/45">
                        {card.example}
                      </p>
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
                        <option key={value} value={status}>
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
    </div>
  );
}
