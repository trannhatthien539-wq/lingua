import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
  writeBatch,
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
  deletedAt: deck.deletedAt || null,
});

// ease/lapses phục vụ lịch ôn tập chung (xem `utils/srs.js`); `deletedAt` là xoá mềm (thùng rác).
const DEFAULT_EASE = 2.5;

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
  ease: Number(card.ease) || DEFAULT_EASE,
  lapses: Number(card.lapses) || 0,
  deletedAt: card.deletedAt || null,
});

const withUserId = (data) => ({ ...data, userId: requireUser().uid });

// Payload gửi lên Firestore của một thẻ từ vựng.
const cardPayload = (card) => ({
  deckId: card.deckId,
  word: card.word,
  ipa: card.ipa,
  meaning: card.meaning,
  example: card.example,
  level: card.level,
  status: card.status,
  reviewDate: card.reviewDate,
  interval: card.interval,
  nextReviewDate: card.nextReviewDate,
  repetition: card.repetition,
  lastStudiedDate: card.lastStudiedDate,
  imageUrl: card.imageUrl,
  audioUrl: card.audioUrl,
  needAiImage: card.needAiImage,
  ease: card.ease,
  lapses: card.lapses,
  deletedAt: card.deletedAt,
});

// Firestore giới hạn 500 thao tác mỗi batch.
const BATCH_SIZE = 400;

const getUserDocuments = async (collectionName) => {
  const user = requireUser();
  const snapshot = await getDocs(query(collection(db, collectionName), where("userId", "==", user.uid)));
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
};

const dataMethods = {
  async getDecks() {
    if (!currentUser()) return readLocal().decks.filter((deck) => !deck.deletedAt).map(normalizeDeck);
    return (await getUserDocuments("study_decks"))
      .filter((deck) => !deck.deletedAt)
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
    if (!currentUser()) return readLocal().cards.filter((card) => card.deckId === deckId && !card.deletedAt).map(normalizeCard);
    const user = requireUser();
    const snapshot = await getDocs(query(
      collection(db, "vocabulary_cards"),
      where("userId", "==", user.uid),
      where("deckId", "==", deckId),
    ));
    return snapshot.docs
      .map((item) => normalizeCard({ id: item.id, ...item.data() }))
      .filter((card) => !card.deletedAt);
  },

  async addCard(card) {
    const normalized = normalizeCard(card);
    if (!currentUser()) {
      const library = readLocal();
      writeLocal({ ...library, cards: [...library.cards, normalized] });
      return normalized;
    }
    const created = await addDoc(collection(db, "vocabulary_cards"), withUserId(omitUndefined(cardPayload(normalized))));
    return { ...normalized, id: created.id };
  },

  /**
   * Thêm nhiều thẻ cùng lúc (dùng khi tạo bộ thẻ khởi tạo 1000 từ).
   * - Khách: ghi localStorage đúng một lần thay vì 1000 lần.
   * - Đã đăng nhập: gom theo batch để tránh 1000 request riêng lẻ.
   */
  async addCards(cards) {
    const normalized = cards.map((card) => normalizeCard(card));
    if (!normalized.length) return [];
    if (!currentUser()) {
      const library = readLocal();
      writeLocal({ ...library, cards: [...library.cards, ...normalized] });
      return normalized;
    }
    const saved = [];
    for (let index = 0; index < normalized.length; index += BATCH_SIZE) {
      const chunk = normalized.slice(index, index + BATCH_SIZE);
      const batch = writeBatch(db);
      chunk.forEach((card) => {
        const ref = doc(collection(db, "vocabulary_cards"));
        batch.set(ref, withUserId(omitUndefined(cardPayload(card))));
        saved.push({ ...card, id: ref.id });
      });
      await batch.commit();
    }
    return saved;
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

  async updateCards(ids, changes) {
    const normalizedChanges = omitUndefined({ ...changes });
    const uniqueIds = [...new Set(ids)].filter(Boolean);
    if (!uniqueIds.length || !Object.keys(normalizedChanges).length) return 0;
    if (!currentUser()) {
      const library = readLocal();
      const idSet = new Set(uniqueIds);
      writeLocal({
        ...library,
        cards: library.cards.map((card) => (idSet.has(card.id) ? { ...card, ...normalizedChanges } : card)),
      });
      return uniqueIds.length;
    }
    for (let index = 0; index < uniqueIds.length; index += BATCH_SIZE) {
      const batch = writeBatch(db);
      uniqueIds.slice(index, index + BATCH_SIZE).forEach((id) => {
        batch.update(doc(db, "vocabulary_cards", id), normalizedChanges);
      });
      await batch.commit();
    }
    return uniqueIds.length;
  },

  async deleteCard(id) {
    if (!currentUser()) {
      const library = readLocal();
      writeLocal({ ...library, cards: library.cards.filter((card) => card.id !== id) });
      return;
    }
    await deleteDoc(doc(db, "vocabulary_cards", id));
  },

  /**
   * Thùng rác: xoá mềm để người dùng còn khôi phục.
   * `deletedAt` là chuỗi ISO; bộ thẻ và các thẻ con được đánh dấu cùng lúc.
   */
  async trashDeck(id) {
    const deletedAt = new Date().toISOString();
    if (!currentUser()) {
      const library = readLocal();
      writeLocal({
        ...library,
        decks: library.decks.map((deck) => (deck.id === id ? { ...deck, deletedAt } : deck)),
        cards: library.cards.map((card) => (card.deckId === id ? { ...card, deletedAt } : card)),
      });
      return deletedAt;
    }
    const user = requireUser();
    await updateDoc(doc(db, "study_decks", id), { deletedAt });
    const cards = await getDocs(query(
      collection(db, "vocabulary_cards"),
      where("userId", "==", user.uid),
      where("deckId", "==", id),
    ));
    for (let index = 0; index < cards.docs.length; index += BATCH_SIZE) {
      const batch = writeBatch(db);
      cards.docs.slice(index, index + BATCH_SIZE).forEach((card) => batch.update(card.ref, { deletedAt }));
      await batch.commit();
    }
    return deletedAt;
  },

  async restoreDeck(id) {
    if (!currentUser()) {
      const library = readLocal();
      writeLocal({
        ...library,
        decks: library.decks.map((deck) => (deck.id === id ? { ...deck, deletedAt: null } : deck)),
        cards: library.cards.map((card) => (card.deckId === id ? { ...card, deletedAt: null } : card)),
      });
      return;
    }
    const user = requireUser();
    await updateDoc(doc(db, "study_decks", id), { deletedAt: null });
    const cards = await getDocs(query(
      collection(db, "vocabulary_cards"),
      where("userId", "==", user.uid),
      where("deckId", "==", id),
    ));
    for (let index = 0; index < cards.docs.length; index += BATCH_SIZE) {
      const batch = writeBatch(db);
      cards.docs.slice(index, index + BATCH_SIZE).forEach((card) => batch.update(card.ref, { deletedAt: null }));
      await batch.commit();
    }
  },

  async trashCard(id) {
    const deletedAt = new Date().toISOString();
    if (!currentUser()) {
      const library = readLocal();
      writeLocal({ ...library, cards: library.cards.map((card) => (card.id === id ? { ...card, deletedAt } : card)) });
      return deletedAt;
    }
    await updateDoc(doc(db, "vocabulary_cards", id), { deletedAt });
    return deletedAt;
  },

  async restoreCard(id) {
    if (!currentUser()) {
      const library = readLocal();
      writeLocal({ ...library, cards: library.cards.map((card) => (card.id === id ? { ...card, deletedAt: null } : card)) });
      return;
    }
    await updateDoc(doc(db, "vocabulary_cards", id), { deletedAt: null });
  },

  /** Danh sách đang nằm trong thùng rác (bộ thẻ + thẻ lẻ). */
  async getTrashed() {
    if (!currentUser()) {
      const library = readLocal();
      const trashedDeckIds = new Set(library.decks.filter((deck) => deck.deletedAt).map((deck) => deck.id));
      return {
        decks: library.decks.filter((deck) => deck.deletedAt).map(normalizeDeck),
        cards: library.cards
          .filter((card) => card.deletedAt && !trashedDeckIds.has(card.deckId))
          .map(normalizeCard),
      };
    }
    const decks = (await getUserDocuments("study_decks")).filter((deck) => deck.deletedAt).map(normalizeDeck);
    const deckIds = new Set(decks.map((deck) => deck.id));
    const cards = (await getUserDocuments("vocabulary_cards"))
      .map((item) => normalizeCard({ id: item.id, ...item.data() }))
      .filter((card) => card.deletedAt && !deckIds.has(card.deckId));
    return { decks, cards };
  },

  /** Xoá vĩnh viễn mọi thứ trong thùng rác (dùng khi người dùng bấm "Dọn thùng rác"). */
  async purgeTrash() {
    if (!currentUser()) {
      const library = readLocal();
      const trashedDeckIds = new Set(library.decks.filter((deck) => deck.deletedAt).map((deck) => deck.id));
      writeLocal({
        decks: library.decks.filter((deck) => !deck.deletedAt),
        cards: library.cards.filter((card) => !card.deletedAt && !trashedDeckIds.has(card.deckId)),
      });
      return;
    }
    const decks = await getUserDocuments("study_decks");
    const cards = await getUserDocuments("vocabulary_cards");
    const trashedDeckIds = new Set(decks.filter((deck) => deck.deletedAt).map((deck) => deck.id));
    const targets = [
      ...decks.filter((deck) => deck.deletedAt).map((deck) => ["study_decks", deck.id]),
      ...cards
        .filter((card) => card.deletedAt || trashedDeckIds.has(card.deckId))
        .map((card) => ["vocabulary_cards", card.id]),
    ];
    for (let index = 0; index < targets.length; index += BATCH_SIZE) {
      const batch = writeBatch(db);
      targets.slice(index, index + BATCH_SIZE).forEach(([collectionName, id]) => {
        batch.delete(doc(db, collectionName, id));
      });
      await batch.commit();
    }
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
