import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { auth, db } from "./firebase";
import { isSafeImageSource } from "./imageService";
import { trackPendingWrite } from "./syncStatus";

const STORAGE_KEY = "lingua-vocabulary-library";
const OLD_STORAGE_KEY = "lingua-vocabulary";

const readLocal = () => {
  try {
    const library = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    if (library.decks || library.cards) return { decks: library.decks || [], cards: library.cards || [] };
    const legacyWords = JSON.parse(localStorage.getItem(OLD_STORAGE_KEY) || "[]");
    if (!legacyWords.length) return { decks: [], cards: [] };
    const deck = { id: makeId("deck"), title: "IELTS Speaking Part 1", tags: ["IELTS", "Speaking"], createdAt: new Date().toISOString() };
    const migrated = {
      decks: [deck],
      cards: legacyWords.map((item) => ({
        id: makeId("card"),
        deckId: deck.id,
        word: item.word || "",
        ipa: item.pronunciation || "",
        meaning: item.meaning || "",
        example: item.example || "",
        level: "B1",
        status: "new",
        reviewDate: null,
      })),
    };
    // Lưu lại ngay để id bộ thẻ/từ vựng ổn định giữa các lần đọc.
    writeLocal(migrated);
    return migrated;
  } catch {
    return { decks: [], cards: [] };
  }
};

const writeLocal = (library) => localStorage.setItem(STORAGE_KEY, JSON.stringify(library));
const currentUser = () => auth.currentUser;

// Id phải duy nhất kể cả khi hai thao tác diễn ra trong cùng một mili-giây
// (ví dụ React StrictMode chạy effect hai lần khi tạo bộ thẻ khởi tạo).
const makeId = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
const requireUser = () => {
  const user = currentUser();
  if (!user) throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
  return user;
};

// Firestore từ chối field có giá trị `undefined`, nên luôn lọc bỏ trước khi ghi.
const omitUndefined = (data) =>
  Object.fromEntries(Object.entries(data).filter(([, value]) => value !== undefined));

export const readGuestLibrary = () => readLocal();
export const hasGuestVocabulary = () => {
  const library = readLocal();
  return library.decks.length > 0 || library.cards.length > 0;
};

export const clearGuestVocabulary = () => {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(OLD_STORAGE_KEY);
  localStorage.removeItem("lingua-practice-topic");
};

const normalizeDeck = (deck) => ({
  id: deck.id,
  title: deck.title || "",
  tags: deck.tags || [],
  createdAt: deck.createdAt || deck.created_at || new Date().toISOString(),
});

const normalizeCard = (card) => ({
  id: card.id,
  deckId: card.deckId || card.deck_id,
  word: card.word || "",
  ipa: card.ipa || "",
  meaning: card.meaning || "",
  example: card.example || "",
  level: card.level || "B1",
  status: card.status || "new",
  reviewDate: card.reviewDate || card.review_date || null,
  interval: Number(card.interval) || 0,
  nextReviewDate: card.nextReviewDate || card.next_review_date || (card.reviewDate || card.review_date || "").slice(0, 10) || null,
  repetition: Number(card.repetition) || 0,
  lastStudiedDate: card.lastStudiedDate || card.last_studied_date || null,
  imageUrl: isSafeImageSource(card.imageUrl || card.image_url || "") ? (card.imageUrl || card.image_url) : "",
  audioUrl: card.audioUrl || card.audio_url || "",
  needAiImage: Boolean(card.needAiImage),
});

const withUserId = (data) => ({ ...data, userId: requireUser().uid });

const getUserDocuments = async (collectionName) => {
  const user = requireUser();
  const snapshot = await getDocs(query(collection(db, collectionName), where("userId", "==", user.uid)));
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
};

const dataMethods = {
  async getDecks() {
    if (!currentUser()) return readLocal().decks.map(normalizeDeck);
    return (await getUserDocuments("study_decks"))
      .sort((first, second) => String(first.createdAt).localeCompare(String(second.createdAt)))
      .map(normalizeDeck);
  },

  async createDeck(title) {
    const deck = normalizeDeck({
      id: makeId("deck"),
      title,
      tags: [],
      createdAt: new Date().toISOString(),
    });
    if (!currentUser()) {
      const library = readLocal();
      writeLocal({ ...library, decks: [...library.decks, deck] });
      return deck;
    }
    const created = await addDoc(collection(db, "study_decks"), withUserId(omitUndefined({
      title: deck.title,
      tags: deck.tags,
      createdAt: deck.createdAt,
    })));
    return { ...deck, id: created.id };
  },

  async updateDeck(id, title) {
    if (!currentUser()) {
      const library = readLocal();
      writeLocal({ ...library, decks: library.decks.map((deck) => deck.id === id ? { ...deck, title } : deck) });
      return;
    }
    await updateDoc(doc(db, "study_decks", id), { title });
  },

  async deleteDeck(id) {
    if (!currentUser()) {
      const library = readLocal();
      writeLocal({
        decks: library.decks.filter((deck) => deck.id !== id),
        cards: library.cards.filter((card) => card.deckId !== id),
      });
      return;
    }
    await deleteDoc(doc(db, "study_decks", id));
    const cards = await getDocs(query(collection(db, "vocabulary_cards"), where("userId", "==", requireUser().uid), where("deckId", "==", id)));
    await Promise.all(cards.docs.map((card) => deleteDoc(card.ref)));
  },

  async getCards(deckId) {
    if (!currentUser()) return readLocal().cards.filter((card) => card.deckId === deckId).map(normalizeCard);
    const user = requireUser();
    const snapshot = await getDocs(query(
      collection(db, "vocabulary_cards"),
      where("userId", "==", user.uid),
      where("deckId", "==", deckId),
    ));
    return snapshot.docs.map((item) => normalizeCard({ id: item.id, ...item.data() }));
  },

  async addCard(card) {
    const normalized = normalizeCard(card);
    if (!currentUser()) {
      const library = readLocal();
      writeLocal({ ...library, cards: [...library.cards, normalized] });
      return normalized;
    }
    const created = await addDoc(collection(db, "vocabulary_cards"), withUserId(omitUndefined({
      deckId: normalized.deckId,
      word: normalized.word,
      ipa: normalized.ipa,
      meaning: normalized.meaning,
      example: normalized.example,
      level: normalized.level,
      status: normalized.status,
      reviewDate: normalized.reviewDate,
      interval: normalized.interval,
      nextReviewDate: normalized.nextReviewDate,
      repetition: normalized.repetition,
      lastStudiedDate: normalized.lastStudiedDate,
      imageUrl: normalized.imageUrl,
      audioUrl: normalized.audioUrl,
      needAiImage: normalized.needAiImage,
    })));
    return { ...normalized, id: created.id };
  },

  async updateCard(id, changes) {
    const normalizedChanges = omitUndefined({ ...changes });
    if (normalizedChanges.reviewDate && !normalizedChanges.nextReviewDate) normalizedChanges.nextReviewDate = String(normalizedChanges.reviewDate).slice(0, 10);
    if (normalizedChanges.nextReviewDate && !normalizedChanges.reviewDate) normalizedChanges.reviewDate = `${normalizedChanges.nextReviewDate}T00:00:00.000Z`;
    if (!currentUser()) {
      const library = readLocal();
      writeLocal({ ...library, cards: library.cards.map((card) => card.id === id ? { ...card, ...normalizedChanges } : card) });
      return;
    }
    if (!Object.keys(normalizedChanges).length) return;
    await updateDoc(doc(db, "vocabulary_cards", id), normalizedChanges);
  },

  async deleteCard(id) {
    if (!currentUser()) {
      const library = readLocal();
      writeLocal({ ...library, cards: library.cards.filter((card) => card.id !== id) });
      return;
    }
    await deleteDoc(doc(db, "vocabulary_cards", id));
  },
};

const withFriendlyDataError = async (operation, args) => {
  try {
    return await operation(...args);
  } catch (error) {
    console.error("Lingua data service error", error);
    throw new Error("Không thể đồng bộ dữ liệu. Vui lòng kiểm tra kết nối và thử lại.");
  }
};

const READ_METHODS = new Set(["getDecks", "getCards"]);

export const dataService = Object.fromEntries(
  Object.entries(dataMethods).map(([name, operation]) => [
    name,
    (...args) => (READ_METHODS.has(name)
      ? withFriendlyDataError(operation, args)
      : trackPendingWrite(() => withFriendlyDataError(operation, args))),
  ]),
);
