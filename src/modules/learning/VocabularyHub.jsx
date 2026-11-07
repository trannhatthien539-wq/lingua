import { useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import {
  AlertTriangle,
  ArchiveRestore,
  ArrowLeft,
  BookOpen,
  CalendarClock,
  Check,
  ChevronDown,
  FileUp,
  LoaderCircle,
  MoreVertical,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Share2,
  Sparkles,
  Trash2,
} from "lucide-react";
import { canUseAi, generateSmartVocabularyPrompt, parseAiJson, requestAi } from "../../services/aiService";
import { lookupWordOffline } from "../../services/dictionaryService";
import { consumePendingItem, subscribeOpenItem } from "../../services/deepLink";
import { findVocabularyImageSafely } from "../../services/imageService";
import { useDebounce } from "../../hooks/useDebounce";
import { dataService, invalidateVocabularyCache } from "../../services/dataService";
import { recordStudyEvent } from "../../services/historyService";
import { createStarterPackDeck } from "../../services/starterPackService";
import { clearSharedDeckFromUrl, copyShareLink, readSharedDeckFromUrl, shareDeck } from "../../services/shareDeck";
import { refreshRequestedEvent } from "../../services/syncStatus";
import { publishCardStats } from "../../services/widgetBridge";
import { toast } from "../../services/toast";
import FlashcardModal, { clearFlashcardSession } from "../../components/learning/FlashcardModal";
import { speakText } from "../../utils/speech";
import ImportExportModal from "../../components/learning/ImportExportModal";
import StudyHubModal from "../../components/learning/StudyHubModal";
import QuizView from "../../components/learning/QuizView";
import SpellerView from "../../components/learning/SpellerView";
import MatchingView from "../../components/learning/MatchingView";
import { sanitizeCard } from "../../utils/sanitizeCard";
import VocabularyDeckCard from "../../components/learning/VocabularyDeckCard";
import NewDeckModal from "../../components/learning/NewDeckModal";
import AddWordsSheet from "../../components/learning/AddWordsSheet";
import VocabularyCard, { levels } from "../../components/learning/VocabularyCard";
import {
  ImportProgressModal,
  SharedDeckModal,
  ThemePickerModal,
  TrashModal,
} from "../../components/learning/VocabularyModals";
import { dateKey, isDue, isLeech } from "../../utils/srs";
import { createThemeDeck, loadThemeDeckEntries, themeDecks } from "../../data/themeDecks";
import { loadCachedLibrary, saveCachedLibrary } from "../../services/vocabularyStorage";
import { auth } from "../../services/firebase";

// Mỗi phiên học tối đa 50 thẻ, và danh sách chỉ hiển thị 60 thẻ một lần
// (các bộ từ có thể chứa tới 4.000 mục nên không thể render hết cùng lúc).
const SESSION_LIMIT = 50;
const RENDER_LIMIT = 60;
const TRASH_PAGE_SIZE = 100;

const PROVIDER_STORAGE = "lingua-ai-provider";
// Bộ lọc theo lịch ôn (SRS) — gộp trong một menu để thanh lọc gọn lại
const srsFilterLabels = {
  due: "Cần ôn hôm nay",
  "interval-1": "Ôn sau 1 ngày",
  "interval-3": "Ôn sau 3 ngày",
  "interval-5": "Ôn sau 5 ngày",
  leech: "Từ hay quên",
};

// Id sinh từ `Date.now()` đơn thuần dễ trùng khi StrictMode chạy effect 2 lần → thêm phần ngẫu nhiên.
const makeId = (prefix) =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const quickLookupPrompt = (word) =>
  `Tra cứu từ tiếng Anh "${word}". Chỉ trả về JSON hợp lệ theo schema {"ipa":"...","meaning":"nghĩa tiếng Việt ngắn gọn","example":"một câu ví dụ tiếng Anh"}. Không markdown.`;
const normalizeWord = (word = "") => word.trim().replace(/\s+/g, " ").toLowerCase();
const titleCaseWord = (word = "") => word.trim().replace(/\s+/g, " ").split(" ").map((part) => part ? `${part[0].toUpperCase()}${part.slice(1).toLowerCase()}` : part).join(" ");

// Bản cũ sinh id theo mili-giây nên có thể trùng (bộ trùng id, thẻ trùng id).
// Lọc bỏ bản trùng và thẻ mồ côi để render không gặp key trùng.
const repairLibrary = (decks = [], cards = []) => {
  const safeDecksList = Array.isArray(decks) ? decks : [];
  const safeCardsList = Array.isArray(cards) ? cards : [];
  const seenDecks = new Set();
  const uniqueDecks = safeDecksList.filter((deck) => {
    if (!deck?.id || seenDecks.has(String(deck.id))) return false;
    seenDecks.add(String(deck.id));
    return true;
  });
  const validDeckIds = new Set(uniqueDecks.map((deck) => String(deck.id)));
  const seenCards = new Set();
  const uniqueCards = safeCardsList.filter((card) => {
    if (!validDeckIds.has(String(card?.deckId)) || !card?.id || seenCards.has(String(card.id))) return false;
    seenCards.add(String(card.id));
    return true;
  });
  return { decks: uniqueDecks, cards: uniqueCards };
};

export default function VocabularyHub({ onStudyActivity, streak, apiKey, user }) {
  const currentUid = user?.uid || auth.currentUser?.uid || "guest";
  const [library, setLibrary] = useState({ decks: [], cards: [] });
  const [selectedDeckId, setSelectedDeckId] = useState(null);
  const [deckInput, setDeckInput] = useState("");
  const [newDeckOpen, setNewDeckOpen] = useState(false);
  const [manualWord, setManualWord] = useState("");
  const [lookupResult, setLookupResult] = useState(null);
  const [manualModalOpen, setManualModalOpen] = useState(false);
  const [addTab, setAddTab] = useState("manual");
  const [actionsOpen, setActionsOpen] = useState(false);
  const [themePickerOpen, setThemePickerOpen] = useState(false);
  const [themeSearch, setThemeSearch] = useState("");
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
  // Yêu cầu "Ôn ngay" (deep link từ widget màn hình chính / shortcut) đang chờ thư viện tải xong.
  const [practicePending, setPracticePending] = useState(false);
  const [studyCards, setStudyCards] = useState(null);
  const [singleCardId, setSingleCardId] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [libraryLoading, setLibraryLoading] = useState(true);
  const [importProgress, setImportProgress] = useState({
    active: false,
    title: "",
    completed: 0,
    total: 0,
    percent: 0,
    done: false,
  });

  useEffect(() => {
    if (!importProgress.active) return;
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = "Đang nạp bộ thẻ từ vựng vào hệ thống. Tải lại trang lúc này có thể làm gián đoạn tiến trình.";
      return event.returnValue;
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [importProgress.active]);
  // 'list' = danh sách bộ thẻ (giống danh sách bài ở tab Ngữ pháp), 'deck' = đang xem một bộ.
  const [view, setView] = useState("list");
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
  const [trashCardLimit, setTrashCardLimit] = useState(TRASH_PAGE_SIZE);
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
          setReloadToken((value) => value + 1);
          toast.error(undoError.message || "Không thể hoàn tác toàn bộ. Dữ liệu đã được tải lại để kiểm tra.");
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
  const leechCards = useMemo(() => deckCards.filter((card) => isLeech(card)), [deckCards]);
  const statusCounts = useMemo(() => ({
    all: deckCards.length,
    due: dueCards.length,
    unlearned: deckCards.filter((card) => card.status !== "mastered").length,
    mastered: deckCards.filter((card) => card.status === "mastered").length,
    leech: leechCards.length,
  }), [deckCards, dueCards, leechCards]);
  // Số liệu cả thư viện + từng bộ, tính trong một lượt duyệt (thư viện có thể lên tới 1000+ thẻ).
  const { libraryStats, deckStats } = useMemo(() => {
    const byDeck = new Map();
    let mastered = 0;
    let learning = 0;
    let newCards = 0;
    let due = 0;
    library.cards.forEach((card) => {
      const entry = byDeck.get(card.deckId) || { total: 0, mastered: 0, due: 0, cards: [], dueCards: [] };
      entry.total += 1;
      entry.cards.push(card);
      if (card.status === "mastered") {
        entry.mastered += 1;
        mastered += 1;
      } else if (card.status === "learning") {
        entry.learning = (entry.learning || 0) + 1;
        learning += 1;
      } else {
        entry.newCards = (entry.newCards || 0) + 1;
        newCards += 1;
      }
      if (isDue(card, today)) {
        entry.due += 1;
        entry.dueCards.push(card);
        due += 1;
      }
      byDeck.set(card.deckId, entry);
    });
    return { libraryStats: { total: library.cards.length, mastered, learning, newCards, due }, deckStats: byDeck };
  }, [library.cards, today]);
  const activeDeckIndex = Math.max(0, library.decks.findIndex((deck) => deck.id === selectedDeck?.id));
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
    setError("");
    const loadLibrary = async () => {
      try {
        // 1. Nạp ngay từ IndexedDB cache để giao diện hiển thị trong 20ms (tránh gián đoạn/chờ đợi)
        const cached = await loadCachedLibrary(currentUid);
        if (active && cached && cached.decks?.length > 0) {
          const { decks: safeDecks, cards: initialCards } = repairLibrary(cached.decks, cached.cards || []);
          if (safeDecks.length > 0) {
            setLibrary({ decks: safeDecks, cards: initialCards });
            setLibraryLoading(false);
          }
        } else if (active) {
          setLibraryLoading(true);
        }

        // 2. Đồng bộ ngầm từ Firestore để cập nhật dữ liệu mới nhất
        const [decks, allCards] = await Promise.all([
          dataService.getDecks(),
          dataService.getAllCards(),
        ]);
        const { decks: safeDecks, cards: initialCards } = repairLibrary(decks, allCards);
        if (active) {
          setLibrary({ decks: safeDecks, cards: initialCards });
          void saveCachedLibrary(currentUid, { decks: safeDecks, cards: initialCards });
        }
        // Thư viện nhỏ: tự tra ảnh tối đa 8 thẻ mỗi lần tải, tránh gọi API hàng nghìn lần.
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
  }, [currentUid, reloadToken, setError, setNotice]);
  useEffect(() => {
    const handleRefresh = () => {
      invalidateVocabularyCache();
      setReloadToken((value) => value + 1);
    };
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
      setView("deck");
    }
    localStorage.removeItem("lingua-practice-topic");
    return undefined;
  }, [library.cards, library.decks]);

  // Tìm kiếm toàn cục (Ctrl/⌘+K) và deep link từ widget: mở đúng từ/bộ/phiên ôn.
  useEffect(() => {
    const handle = (pending) => {
      if (!pending) return;
      if (pending.type === "practice") setPracticePending(true);
      else if (pending.type === "new-deck") {
        setView("list");
        setNewDeckOpen(true);
      } else if (pending.type === "word" && pending.itemId) {
        setSearchQuery(pending.itemId);
        setActiveFilter("all");
        setView("deck");
      } else if (pending.type === "theme" && pending.itemId) {
        setThemePickerOpen(true);
      }
    };
    // Module lazy-load nên yêu cầu có thể được gửi TRƯỚC khi mount — đọc phần đang chờ...
    handle(consumePendingItem("vocabulary"));
    // ...và nghe tiếp cho trường hợp module đã mount sẵn (app đang mở, bấm widget).
    return subscribeOpenItem((event) => handle(event.detail));
  }, []);

  // "Ôn ngay": chờ thư viện tải xong rồi mở phiên ôn thẻ đến hạn (nếu hết thẻ thì ôn cả bộ).
  useEffect(() => {
    if (!practicePending || libraryLoading) return;
    setPracticePending(false);
    const deck = library.decks.find((item) => item.id === selectedDeckId) || library.decks[0];
    // Mỗi phiên tối đa 50 thẻ, giống nút "Ôn hôm nay" trong thẻ thống kê.
    const cards = (dueCards.length ? dueCards : deckCards).slice(0, SESSION_LIMIT);
    if (!deck || !cards.length) return;
    clearFlashcardSession(deck.id);
    setStudyCards(cards);
    setStudyDeckId(deck.id);
    setStudyMode(null);
  }, [practicePending, libraryLoading, dueCards, deckCards, library.decks, selectedDeckId]);

  const updateLibrary = (changes) =>
    setLibrary((current) => ({ ...current, ...changes }));
  const addDeck = async (event) => {
    event.preventDefault();
    const title = deckInput.trim();
    if (!title) return;
    setLoading("new-deck");
    try {
      const deck = await dataService.createDeck(title);
      const normalizedDeck = { ...deck, tags: deck.tags || [], createdAt: deck.createdAt || deck.created_at };
      updateLibrary({ decks: [...library.decks, normalizedDeck] });
      setSelectedDeckId(normalizedDeck.id);
      setDeckInput("");
      setNewDeckOpen(false);
      setNotice(`Đã tạo bộ “${title}”. Thêm từ cho bộ mới nhé.`);
    } catch (createError) {
      setError(createError.message || "Không thể tạo bộ thẻ lúc này.");
    } finally {
      setLoading("");
    }
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
    const savedCards = await dataService.addCards(cards);
    setLibrary((current) => ({ ...current, cards: [...savedCards, ...current.cards] }));
    return savedCards;
  };

  const importDeck = async (title, items) => {
    if (items.length > 80) {
      setImportProgress({
        active: true,
        title,
        completed: 0,
        total: items.length,
        percent: 0,
        done: false,
      });
    }
    try {
      const { deck, cards: savedCards } = await dataService.createDeckWithCards(title, items, {
        onProgress: ({ completed, total, percent }) => {
          setImportProgress((prev) => ({ ...prev, completed, total, percent }));
        },
      });
      if (items.length > 80) {
        setImportProgress((prev) => ({ ...prev, completed: savedCards.length, percent: 100, done: true }));
        await new Promise((resolve) => setTimeout(resolve, 600));
      }
      const normalizedDeck = { ...deck, tags: deck.tags || [], createdAt: deck.createdAt || new Date().toISOString() };
      const updatedDecks = [...library.decks, normalizedDeck];
      const updatedCards = [...savedCards, ...library.cards];
      setLibrary({ decks: updatedDecks, cards: updatedCards });
      void saveCachedLibrary(currentUid, { decks: updatedDecks, cards: updatedCards });
      setSelectedDeckId(normalizedDeck.id);
      setDataModal(null);
    } catch (err) {
      setError(err.message || "Không thể nhập bộ thẻ.");
    } finally {
      setImportProgress({ active: false, title: "", completed: 0, total: 0, percent: 0, done: false });
    }
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
      // Có key cá nhân hoặc key dự phòng (Gemini) thì dùng AI; không có hoặc AI lỗi thì rơi về từ điển miễn phí.
      let result = null;
      let aiFailed = false;
      if (canUseAi(apiKey, localStorage.getItem(PROVIDER_STORAGE) || "gemini")) {
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
    if (!manualDraft.word.trim()) return setError("Hãy nhập từ trước khi dùng AI.");
    if (!canUseAi(apiKey, localStorage.getItem(PROVIDER_STORAGE) || "gemini")) return setError("Hãy lưu API key trước khi dùng tính năng AI.");
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
    if (!canUseAi(apiKey, localStorage.getItem(PROVIDER_STORAGE) || "gemini"))
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
    setLoading(`theme-${deckId}`);
    try {
      const created = await createThemeDeck(deckId);
      if (!created) return;
      setThemePickerOpen(false);
      setImportProgress({
        active: true,
        title: created.deck.title,
        completed: 0,
        total: created.cards.length,
        percent: 0,
        done: false,
      });

      const { deck: targetDeck, cards: savedCards } = await dataService.createDeckWithCards(
        created.deck.title,
        created.cards,
        {
          tags: created.deck.tags,
          description: created.deck.description,
          themeDeckId: deckId,
          onProgress: ({ completed, total, percent }) => {
            setImportProgress((prev) => ({
              ...prev,
              completed,
              total,
              percent,
            }));
          },
        }
      );

      setImportProgress((prev) => ({ ...prev, completed: savedCards.length, percent: 100, done: true }));
      await new Promise((resolve) => setTimeout(resolve, 800));

      const updatedDecks = [...library.decks, { ...targetDeck, tags: created.deck.tags, description: created.deck.description }];
      const updatedCards = [...savedCards, ...library.cards];
      updateLibrary({
        decks: updatedDecks,
        cards: updatedCards,
      });
      void saveCachedLibrary(currentUid, { decks: updatedDecks, cards: updatedCards });
      setSelectedDeckId(targetDeck.id);
      setNotice(`Đã thêm “${created.deck.title}” với ${savedCards.length.toLocaleString("vi-VN")} từ vựng.`);
    } catch (requestError) {
      setError(requestError.message || "Không thể thêm bộ từ theo chủ đề lúc này.");
    } finally {
      setLoading("");
      setImportProgress({ active: false, title: "", completed: 0, total: 0, percent: 0, done: false });
    }
  };

  const getDeckIncompleteInfo = useCallback((deck, cards) => {
    if (!deck) return null;
    const matchedTheme = themeDecks.find((td) => td.id === deck.themeDeckId || td.title === deck.title);
    const expected = deck.expectedCount || (matchedTheme ? (matchedTheme.id.startsWith("essential_vocab") ? 4000 : null) : null);
    if (!expected) return null;
    const count = cards.filter((c) => c.deckId === deck.id).length;
    if (count < expected) {
      return {
        expected,
        actual: count,
        missing: expected - count,
        themeDeckId: deck.themeDeckId || matchedTheme?.id,
      };
    }
    return null;
  }, []);

  const resumeIncompleteDeck = async (deck, currentDeckCards) => {
    const incompleteInfo = getDeckIncompleteInfo(deck, library.cards);
    if (!incompleteInfo || !incompleteInfo.themeDeckId) {
      setError("Không xác định được nguồn từ vựng để nạp tiếp.");
      return;
    }

    setImportProgress({
      active: true,
      title: deck.title,
      completed: incompleteInfo.actual,
      total: incompleteInfo.expected,
      percent: Math.round((incompleteInfo.actual / incompleteInfo.expected) * 100),
      done: false,
    });

    try {
      const allThemeEntries = await loadThemeDeckEntries(incompleteInfo.themeDeckId);
      const existingWordSet = new Set(currentDeckCards.map((c) => c.word.trim().toLowerCase()));
      const missingEntries = allThemeEntries.filter((e) => !existingWordSet.has(e.word.trim().toLowerCase()));

      if (!missingEntries.length) {
        setNotice(`Bộ thẻ đã đầy đủ ${currentDeckCards.length} từ.`);
        return;
      }

      const meta = themeDecks.find((td) => td.id === incompleteInfo.themeDeckId);
      const stamp = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const now = new Date().toISOString();
      const today = now.slice(0, 10);

      const cardsToAdd = missingEntries.map((entry, index) => ({
        id: `theme-card-${stamp}-${String(index + 1).padStart(3, "0")}`,
        deckId: deck.id,
        word: entry.word,
        ipa: "",
        meaning: entry.meaning,
        example: "",
        level: meta?.level || "B1",
        status: "new",
        interval: 1,
        nextReview: now,
        nextReviewDate: today,
        repetition: 0,
        reviewDate: now,
        imageUrl: "",
        audioUrl: "",
      }));

      const initialCount = incompleteInfo.actual;
      const saved = await dataService.addCards(cardsToAdd, {
        onProgress: ({ completed }) => {
          const currentTotal = initialCount + completed;
          setImportProgress((prev) => ({
            ...prev,
            completed: currentTotal,
            percent: Math.min(100, Math.round((currentTotal / incompleteInfo.expected) * 100)),
          }));
        },
      });

      setImportProgress((prev) => ({
        ...prev,
        completed: incompleteInfo.expected,
        percent: 100,
        done: true,
      }));
      await new Promise((resolve) => setTimeout(resolve, 800));

      const updatedCards = [...saved, ...library.cards];
      setLibrary((curr) => ({ ...curr, cards: updatedCards }));
      void saveCachedLibrary(currentUid, { decks: library.decks, cards: updatedCards });
      setNotice(`Đã nạp bổ sung thành công ${saved.length.toLocaleString("vi-VN")} từ còn thiếu! Giờ bộ thẻ đã đủ ${incompleteInfo.expected.toLocaleString("vi-VN")} từ.`);
    } catch (resumeError) {
      setError(resumeError.message || "Không thể nạp tiếp từ vựng lúc này.");
    } finally {
      setImportProgress({ active: false, title: "", completed: 0, total: 0, percent: 0, done: false });
    }
  };

  const loadStarterPack = async () => {
    if (loading === "starter-pack") return;
    setLoading("starter-pack");
    try {
      const result = await createStarterPackDeck();
      setLibrary((current) => {
        const alreadyHasDeck = current.decks.some((deck) => deck.id === result.deck.id);
        const knownIds = new Set(current.cards.map((card) => card.id));
        return {
          decks: alreadyHasDeck ? current.decks : [...current.decks, result.deck],
          cards: [...result.cards.filter((card) => !knownIds.has(card.id)), ...current.cards],
        };
      });
      setSelectedDeckId(result.deck.id);
      setView("list");
      setNotice(result.existing
        ? "Bộ từ khởi đầu đã có trong thư viện của bạn."
        : `Đã nạp ${result.cards.length} thẻ từ vựng khởi đầu.`);
    } catch (requestError) {
      setError(requestError.message || "Không thể nạp bộ từ khởi đầu. Vui lòng thử lại.");
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
      await dataService.trashCards(selectedIds);
      setLibrary((current) => ({ ...current, cards: current.cards.filter((card) => !idSet.has(card.id)) }));
      setSelectedIds([]);
      offerUndo(`Đã chuyển ${removed.length} từ vào thùng rác.`, async () => {
        await dataService.restoreCards(removed.map((card) => card.id));
        setLibrary((current) => ({ ...current, cards: [...removed.map((card) => ({ ...card, deletedAt: null })), ...current.cards] }));
      });
    } catch (bulkError) {
      // Batch đầu có thể đã commit trước batch lỗi; nạp lại để không giữ UI ảo.
      setReloadToken((value) => value + 1);
      setError(bulkError.message || "Không thể xoá toàn bộ từ đã chọn. Thùng rác đã được tải lại để kiểm tra phần nào còn lại.");
    } finally {
      setBulkBusy(false);
    }
  };

  // --- Thùng rác -----------------------------------------------------------
  const openTrash = async () => {
    setActionsOpen(false);
    setTrashOpen(true);
    setTrashBusy(true);
    setTrashCardLimit(TRASH_PAGE_SIZE);
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

  const openStudy = (cards, deckId = selectedDeck?.id) => {
    // Mỗi phiên chỉ lấy tối đa 50 thẻ để phiên học không kéo dài vô tận với bộ 1000 từ.
    if (!deckId || !cards.length) return;
    clearFlashcardSession(deckId);
    setStudyCards(cards.slice(0, SESSION_LIMIT));
    setStudyDeckId(deckId);
    setStudyMode(null);
  };

  /** Mở danh sách từ của một bộ — giống bấm vào một thẻ bài học ở tab Ngữ pháp. */
  const openDeck = (deckId) => {
    setSelectedDeckId(deckId);
    setView("deck");
    setSearchQuery("");
    setActiveFilter("all");
    exitSelectMode();
    window.setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 60);
  };

  /** Về danh sách bộ thẻ. */
  const backToLibrary = () => {
    setView("list");
    exitSelectMode();
    window.setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 60);
  };

  const openSingleCard = (cardId) => {
    clearFlashcardSession(selectedDeck?.id);
    setSingleCardId(cardId);
  };

  /** Phiên ôn gộp cả thư viện: ưu tiên thẻ đến hạn, hết thì học thẻ chưa thuộc. */
  const startLibraryStudy = () => {
    const entry = library.cards.filter((card) => isDue(card, today));
    const cards = entry.length ? entry : library.cards;
    if (!cards.length) return;
    openStudy(cards, cards[0].deckId);
  };

  if (libraryLoading) {
    return <div role="status" aria-live="polite" className="panel grid min-h-64 place-items-center p-8"><LoaderCircle className="animate-spin text-indigo-500" size={24} aria-hidden="true" /><p className="mt-3 text-sm text-ink/50 dark:text-white/50">Đang đồng bộ thư viện từ vựng...</p></div>;
  }

  if (singleCardId) {
    const singleCard = deckCards.find((card) => card.id === singleCardId);
    if (singleCard) return createPortal(<FlashcardModal deck={selectedDeck} cards={[singleCard]} onClose={() => { clearFlashcardSession(selectedDeck?.id); setSingleCardId(null); }} onUpdateCard={updateCard} onStudyActivity={onStudyActivity} streak={streak} />, document.body);
  }

  if (studyDeckId) {
    const practiceDeck = library.decks.find(
      (deck) => deck.id === studyDeckId,
    );
    const practiceCards = studyCards || library.cards.filter(
      (card) => card.deckId === studyDeckId,
    );
    if (practiceDeck) {
      const closeStudy = () => { clearFlashcardSession(practiceDeck.id); setStudyDeckId(null); setStudyMode(null); setStudyCards(null); };
      const chooseMode = (mode) => setStudyMode(mode);
      const sharedProps = { deck: practiceDeck, cards: practiceCards, onClose: closeStudy, onChangeMode: () => setStudyMode(null), onUpdateCard: updateCard, onStudyActivity };
      if (!studyMode) return createPortal(<StudyHubModal deck={practiceDeck} cards={practiceCards.map(sanitizeCard)} onSelect={chooseMode} onClose={closeStudy} />, document.body);
      if (studyMode === "quiz") return createPortal(<QuizView {...sharedProps} />, document.body);
      if (studyMode === "speller") return createPortal(<SpellerView {...sharedProps} />, document.body);
      if (studyMode === "matching") return createPortal(<MatchingView {...sharedProps} />, document.body);
      return createPortal(<FlashcardModal {...sharedProps} streak={streak} />, document.body);
    }
  }

  return (
    <div className="space-y-6">
      {view === "deck" ? (
        <>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <button type="button" onClick={backToLibrary} className="btn-ghost px-3">
              <ArrowLeft size={16} />Danh sách bộ
            </button>
            <span className="text-xs font-semibold text-ink/55 dark:text-white/55">
              Bộ {activeDeckIndex + 1}/{library.decks.length} · {deckCards.length} từ
            </span>
          </div>
          <main className="min-w-0 space-y-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="eyebrow">Chi tiết bộ</p>
              <h2 className="mt-1 font-display text-2xl font-bold tracking-tight">
                {selectedDeck?.title}
              </h2>
              <div className="mt-2 flex flex-wrap gap-1.5">
                <span className="chip bg-okbg text-ok dark:bg-okdark dark:text-okfgdark">{statusCounts.mastered}/{statusCounts.all} đã thuộc</span>
                {dueCards.length > 0 && <span className="chip bg-warnbg text-warn">{dueCards.length} đến hạn ôn</span>}
                {statusCounts.leech > 0 && <span className="chip bg-amber-500/15 text-amber-700 dark:text-amber-400 font-semibold">⚡ {statusCounts.leech} hay quên</span>}
                <span className="chip bg-ink/[0.06] text-ink/70 dark:bg-white/10 dark:text-white/70">{statusCounts.unlearned} chưa thuộc</span>
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
            <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
              {leechCards.length > 0 && (
                <button
                  onClick={() => openStudy(leechCards)}
                  className="btn-ghost min-h-12 border border-amber-500/30 text-amber-700 hover:bg-amber-500/10 dark:text-amber-400 px-3.5 text-xs font-bold"
                  title="Ôn tập riêng các từ hay quên (quên ≥ 4 lần)"
                >
                  ⚡ Cấp cứu {sessionCount(leechCards)} từ khó
                </button>
              )}
              <button onClick={() => openStudy(deckCards)} disabled={!deckCards.length} className="btn-primary min-h-12 flex-1 px-5 disabled:cursor-not-allowed sm:flex-none">
                <Sparkles size={17} />Bắt đầu học ngay
              </button>
              <div className="relative"><button onClick={() => setActionsOpen((value) => !value)} className="icon-btn h-12 w-12 border border-ink/10 dark:border-white/15" aria-label="Thêm hành động cho bộ này" aria-expanded={actionsOpen}><MoreVertical size={19} /></button>{actionsOpen && <div className="absolute right-0 top-14 z-30 w-64 rounded-xl border border-ink/10 bg-slab p-1.5 shadow-soft dark:border-white/10 dark:bg-dark2"><p className="truncate px-3 py-2 text-xs font-bold uppercase tracking-[0.08em] text-ink/60 dark:text-white/50">{selectedDeck?.title}</p><button onClick={() => { openStudy(dueCards); setActionsOpen(false); }} disabled={!dueCards.length} className="menu-item"><Check size={16} />Ôn {sessionCount(dueCards)} từ đến hạn</button><button onClick={() => { setActionsOpen(false); renameDeck(selectedDeck); }} className="menu-item"><Pencil size={16} />Đổi tên bộ</button><button onClick={() => { shareCurrentDeck(); setActionsOpen(false); }} className="menu-item"><Share2 size={16} />Chia sẻ bộ này</button><button onClick={() => { cleanupDuplicates(); setActionsOpen(false); }} className="menu-item"><Trash2 size={16} />Dọn từ trùng</button><button onClick={() => { setThemePickerOpen(true); setActionsOpen(false); }} className="menu-item"><BookOpen size={16} />Thêm bộ từ theo chủ đề</button><button onClick={() => { openTrash(); }} className="menu-item"><ArchiveRestore size={16} />Thùng rác</button><button onClick={() => { deleteDeck(selectedDeck); setActionsOpen(false); }} className="menu-item text-danger dark:text-dangerfgdark"><Trash2 size={16} />Xoá bộ này</button></div>}</div>
            </div>
          </div>
          {selectedDeck && (() => {
            const incomplete = getDeckIncompleteInfo(selectedDeck, deckCards);
            if (!incomplete) return null;
            return (
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-amber-900 dark:text-amber-200">
                <div className="flex items-start sm:items-center gap-3">
                  <AlertTriangle className="mt-0.5 sm:mt-0 text-amber-500 shrink-0" size={20} />
                  <div>
                    <p className="text-sm font-bold">Bộ thẻ chưa nạp đủ ({incomplete.actual.toLocaleString("vi-VN")}/{incomplete.expected.toLocaleString("vi-VN")} từ)</p>
                    <p className="text-xs text-amber-800/80 dark:text-amber-300/80">Quá trình nạp trước đó có thể đã bị ngắt quãng do tải lại trang.</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => resumeIncompleteDeck(selectedDeck, deckCards)}
                  disabled={importProgress.active}
                  className="btn-primary shrink-0 bg-amber-600 hover:bg-amber-700 text-white text-xs px-4 py-2 font-bold shadow-sm"
                >
                  <RefreshCw size={14} className={importProgress.active ? "animate-spin" : ""} />
                  Nạp tiếp {incomplete.missing.toLocaleString("vi-VN")} từ còn thiếu
                </button>
              </div>
            );
          })()}
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
                  <button onClick={() => { setAddTab("manual"); openManualModal(); }} className="btn-ghost inline-flex">
                    <Plus size={16} />
                    Thêm thẻ
                  </button>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <div className="flex flex-wrap gap-1 rounded-xl bg-ink/[0.05] p-1 dark:bg-white/[0.08]" role="group" aria-label="Lọc theo trạng thái">
                  {[
                    ["all", "Tất cả"],
                    ["due", "Cần ôn hôm nay"],
                    ["unlearned", "Chưa thuộc"],
                    ["mastered", "Đã thuộc"],
                    ...(statusCounts.leech > 0 ? [["leech", "Hay quên"]] : []),
                  ].map(([value, label]) => {
                    const count = statusCounts[value] ?? 0;
                    const isDueFilter = value === "due";
                    return (
                      <button
                        key={value}
                        onClick={() => setActiveFilter(value)}
                        aria-pressed={activeFilter === value}
                        className={`flex min-h-[44px] items-center gap-1.5 rounded-lg px-3 text-sm font-bold transition ${
                          activeFilter === value
                            ? isDueFilter && count > 0
                              ? "bg-amber-500 text-slate-950 shadow-md font-black"
                              : "bg-slab shadow-raised dark:bg-dark3"
                            : isDueFilter && count > 0
                            ? "text-amber-600 dark:text-amber-400 font-bold hover:bg-amber-500/10"
                            : "text-ink/60 hover:text-ink dark:text-white/60 dark:hover:text-white"
                        }`}
                      >
                        {isDueFilter && count > 0 && <span className="text-xs">🔥</span>}
                        <span>{label}</span>
                        <span className="text-xs font-semibold opacity-75">({count})</span>
                      </button>
                    );
                  })}
                </div>
                <div className="relative">
                  <button
                    onClick={() => setSrsMenuOpen((value) => !value)}
                    aria-expanded={srsMenuOpen}
                    className={`flex min-h-[44px] items-center gap-2 rounded-xl border px-3.5 text-sm font-bold transition ${activeFilter === "due" || activeFilter.startsWith("interval-") ? "border-indigo-500/30 bg-indigo-500/15 text-indigo-600 dark:text-indigo-400" : "border-ink/10 text-ink/70 hover:bg-ink/[0.05] dark:border-white/15 dark:text-white/70 dark:hover:bg-white/10"}`}
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
                <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 rounded-xl border border-indigo-500/25 bg-indigo-500/10 px-3 py-2">
                  <label className="flex items-center gap-2 text-xs font-bold"><input type="checkbox" checked={filteredCards.length > 0 && selectedIds.length === filteredCards.length} onChange={toggleSelectAll} className="h-4 w-4 accent-indigo-500" />Chọn tất cả</label>
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
                {visibleCards.map((card) => <VocabularyCard key={card.id} card={card} speakingWord={speakingWord} onSpeak={speak} onStudy={openSingleCard} onUpdate={updateCard} onRemove={removeCard} selectMode={selectMode} selected={selectedIds.includes(card.id)} onToggleSelect={toggleSelect} />)}
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
        </>
      ) : library.decks.length === 0 ? (
        <section className="panel relative overflow-hidden p-6 sm:p-8" aria-labelledby="vocabulary-empty-title">
          <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-indigo-500/15 blur-3xl" aria-hidden="true" />
          <div className="relative mx-auto max-w-2xl text-center">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl border border-indigo-500/25 bg-indigo-500/15 text-indigo-600 dark:text-indigo-400">
              <BookOpen size={26} />
            </span>
            <p className="eyebrow mt-4">Bắt đầu thư viện</p>
            <h2 id="vocabulary-empty-title" className="mt-1 font-display text-2xl font-bold tracking-tight">
              Thư viện từ vựng đang trống
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-ink/60 dark:text-white/60">
              Chọn cách bắt đầu phù hợp. Lingua chỉ tạo dữ liệu khi bạn chủ động chọn — không tự nạp hàng nghìn thẻ.
            </p>
          </div>
          <div className="relative mx-auto mt-6 grid max-w-2xl gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={loadStarterPack}
              disabled={loading === "starter-pack"}
              className="btn-primary min-h-[64px] justify-start px-4 text-left disabled:cursor-wait disabled:opacity-70"
            >
              {loading === "starter-pack" ? <LoaderCircle size={20} className="shrink-0 animate-spin" /> : <Sparkles size={20} className="shrink-0" />}
              <span className="min-w-0">
                <span className="block text-sm font-bold">Nạp bộ từ vựng khởi đầu</span>
                <span className="mt-0.5 block text-[11px] font-medium opacity-80">50 thẻ mẫu A1 · có thể xoá bất cứ lúc nào</span>
              </span>
            </button>
            <button
              type="button"
              onClick={() => setNewDeckOpen(true)}
              className="btn-secondary min-h-[64px] justify-start px-4 text-left"
            >
              <Plus size={20} className="shrink-0" />
              <span className="min-w-0">
                <span className="block text-sm font-bold">Tạo bộ từ mới / Nhập thẻ riêng</span>
                <span className="mt-0.5 block text-[11px] font-medium text-ink/55 dark:text-white/55">Tự đặt tên bộ và thêm từ của bạn</span>
              </span>
            </button>
          </div>
        </section>
      ) : (
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-lg font-black tracking-tight text-slate-900 dark:text-white sm:text-xl">
                Bộ thẻ từ vựng
              </h2>
              <p className="mt-0.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                {library.decks.length} bộ · {libraryStats.total} từ · {libraryStats.mastered} đã thuộc{libraryStats.due > 0 ? ` · ${libraryStats.due} cần ôn` : ''}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {libraryStats.due > 0 && (
                <button
                  type="button"
                  onClick={startLibraryStudy}
                  className="btn-primary h-10 px-3.5 text-xs font-bold shadow-md shadow-indigo-500/20"
                >
                  <Sparkles size={14} />
                  <span>Ôn {Math.min(libraryStats.due, 50)} từ</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => setThemePickerOpen(true)}
                className="btn-secondary h-10 px-3 text-xs font-semibold"
              >
                <BookOpen size={14} />
                <span>Chủ đề mẫu</span>
              </button>
              <button
                type="button"
                onClick={() => setNewDeckOpen(true)}
                className="btn-secondary h-10 px-3 text-xs font-semibold"
              >
                <Plus size={14} />
                <span>Tạo bộ thẻ</span>
              </button>
              <button
                type="button"
                onClick={() => setDataModal("import")}
                className="btn-secondary h-10 px-2.5 text-xs"
                title="Nhập / Xuất thẻ"
                aria-label="Nhập hoặc xuất thẻ"
              >
                <FileUp size={14} />
              </button>
              <button
                type="button"
                onClick={openTrash}
                className="btn-secondary h-10 px-2.5 text-xs"
                title="Thùng rác"
                aria-label="Thùng rác"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {library.decks.map((deck, index) => {
              const entry = deckStats.get(deck.id) || { total: 0, mastered: 0, due: 0, cards: [], dueCards: [] };
              return <VocabularyDeckCard key={deck.id} deck={deck} index={index} entry={entry} onOpen={openDeck} onStudy={openStudy} />;
            })}
          </div>
        </section>
      )}
      {newDeckOpen && <NewDeckModal value={deckInput} onChange={setDeckInput} onSubmit={addDeck} onClose={() => { setNewDeckOpen(false); setDeckInput(""); }} busy={loading === "new-deck"} />}
      {themePickerOpen && (
        <ThemePickerModal
          themeSearch={themeSearch}
          onSearchChange={setThemeSearch}
          loading={loading}
          onSelectDeck={addThemeDeck}
          onClose={() => { setThemePickerOpen(false); setThemeSearch(""); }}
        />
      )}
      {trashOpen && (
        <TrashModal
          trashItems={trashItems}
          trashBusy={trashBusy}
          trashCardLimit={trashCardLimit}
          pageSize={TRASH_PAGE_SIZE}
          onShowMore={() => setTrashCardLimit((value) => value + TRASH_PAGE_SIZE)}
          onRestoreDeck={restoreTrashedDeck}
          onRestoreCard={restoreTrashedCard}
          onEmptyTrash={emptyTrash}
          onClose={() => setTrashOpen(false)}
        />
      )}
      {dataModal && <ImportExportModal mode={dataModal} onClose={() => setDataModal(null)} currentDeck={selectedDeck} decks={library.decks} cards={library.cards} onImport={importDeck} />}
      {sharedDeck && (
        <SharedDeckModal
          sharedDeck={sharedDeck}
          onDismiss={dismissSharedDeck}
          onImport={importSharedDeck}
        />
      )}
      {manualModalOpen && <AddWordsSheet tab={addTab} onTabChange={setAddTab} draft={manualDraft} levels={levels} busy={loading.startsWith("manual-")} onChange={updateManualDraft} onSuggest={suggestManualDetails} onSave={saveManualCard} topic={topic} onTopicChange={setTopic} level={level} onLevelChange={setLevel} amount={amount} onAmountChange={setAmount} onGenerate={generateVocabulary} lookupResult={lookupResult} onLookupWord={lookupWord} onSaveLookup={saveLookupResult} manualWord={manualWord} onManualWordChange={setManualWord} lookupLoading={loading === "lookup" || loading === "lookup-save"} onClose={() => setManualModalOpen(false)} />}
      {importProgress.active && <ImportProgressModal importProgress={importProgress} />}
    </div>
  );
}
