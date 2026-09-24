import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  getDocsFromServer,
  query,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { auth, db } from "./firebase";
import { isSafeImageSource } from "./imageService";
import { trackPendingWrite } from "./syncStatus";
import { chunkForFirestore, runInBatches } from "./firestoreBatch";
import { buildTrashView } from "./vocabularyTrash";

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

const withUniqueLocalCardIds = (cards, library) => {
  const usedIds = new Set(library.cards.map((card) => card.id).filter(Boolean));
  return cards.map((card) => {
    const normalized = normalizeCard(card);
    let id = normalized.id;
    while (!id || usedIds.has(id)) id = makeId("card");
    usedIds.add(id);
    return { ...normalized, id };
  });
};

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

// Firestore giới hạn 500 thao tác mỗi batch; helper dùng biên 400.
const getUserDocuments = async (collectionName, { serverOnly = false } = {}) => {
  const user = requireUser();
  const documentsQuery = query(collection(db, collectionName), where("userId", "==", user.uid));
  const snapshot = serverOnly ? await getDocsFromServer(documentsQuery) : await getDocs(documentsQuery);
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
    const cards = await getDocs(query(collection(db, "vocabulary_cards"), where("userId", "==", requireUser().uid), where("deckId", "==", id)));
    for (const cardChunk of chunkForFirestore(cards.docs)) {
      const batch = writeBatch(db);
      cardChunk.forEach((card) => batch.delete(card.ref));
      await batch.commit();
    }
    await deleteDoc(doc(db, "study_decks", id));
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
    const normalized = cards.map((card) => normalizeCard(card)).filter((card) => card.word && card.deckId);
    if (!normalized.length) return [];
    if (!currentUser()) {
      const library = readLocal();
      const savedCards = withUniqueLocalCardIds(normalized, library);
      writeLocal({ ...library, cards: [...savedCards, ...library.cards] });
      return savedCards;
    }
    const entries = normalized.map((card) => ({ card, ref: doc(collection(db, "vocabulary_cards")) }));
    const committed = await runInBatches(entries, {
      commit: async (entryChunk) => {
        const batch = writeBatch(db);
        entryChunk.forEach(({ card, ref }) => batch.set(ref, withUserId(omitUndefined(cardPayload(card)))));
        await batch.commit();
      },
      rollback: async (createdEntries) => {
        for (const entryChunk of chunkForFirestore(createdEntries)) {
          const batch = writeBatch(db);
          entryChunk.forEach(({ ref }) => batch.delete(ref));
          await batch.commit();
        }
      },
    });
    return committed.map(({ card, ref }) => ({ ...card, id: ref.id }));
  },

  /** Tạo deck và nhập nhiều thẻ; tự xoá deck/thẻ đã ghi nếu một batch lỗi. */
  async createDeckWithCards(title, cards) {
    if (!currentUser()) {
      // Ghi deck + toàn bộ thẻ trong một localStorage write để không để lại deck rỗng khi quota lỗi.
      const library = readLocal();
      const deck = normalizeDeck({ id: makeId("deck"), title, tags: [], createdAt: new Date().toISOString() });
      const candidates = cards.map((card) => ({ ...card, deckId: deck.id })).filter((card) => card.word);
      const savedCards = withUniqueLocalCardIds(candidates, library);
      writeLocal({ decks: [...library.decks, deck], cards: [...savedCards, ...library.cards] });
      return { deck, cards: savedCards };
    }

    const deck = await dataMethods.createDeck(title);
    try {
      const savedCards = await dataMethods.addCards(cards.map((card) => ({ ...card, deckId: deck.id })));
      return { deck, cards: savedCards };
    } catch (error) {
      await dataMethods.deleteDeck(deck.id).catch(() => {});
      throw error;
    }
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
    for (const idChunk of chunkForFirestore(uniqueIds)) {
      const batch = writeBatch(db);
      idChunk.forEach((id) => {
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
   * `deletedAt` là chuỗi ISO; bộ mới chỉ đánh dấu deck để xử lý bộ 1.000 từ chỉ với một write.
   * Vẫn hỗ trợ dữ liệu cũ đã đánh dấu cả deck và các thẻ con.
   */
  async trashDeck(id) {
    const deletedAt = new Date().toISOString();
    if (!currentUser()) {
      const library = readLocal();
      writeLocal({
        ...library,
        decks: library.decks.map((deck) => (deck.id === id ? { ...deck, deletedAt } : deck)),
      });
      return deletedAt;
    }
    // Chỉ đánh dấu deck là đủ để ẩn deck và toàn bộ thẻ con. Tránh 1.000 update khi
    // xoá bộ 1.000 từ; các thẻ con vẫn được giữ nguyên để khôi phục nhanh và an toàn.
    await updateDoc(doc(db, "study_decks", id), { deletedAt });
    return deletedAt;
  },

  async restoreDeck(id) {
    if (!currentUser()) {
      const library = readLocal();
      writeLocal({
        ...library,
        decks: library.decks.map((deck) => (deck.id === id ? { ...deck, deletedAt: null } : deck)),
        // Dữ liệu guest tạo bởi phiên bản cũ có thể đã đánh dấu thẻ con.
        cards: library.cards.map((card) => (card.deckId === id && card.deletedAt ? { ...card, deletedAt: null } : card)),
      });
      return;
    }
    const user = requireUser();
    const cards = await getDocs(query(
      collection(db, "vocabulary_cards"),
      where("userId", "==", user.uid),
      where("deckId", "==", id),
    ));
    // Bộ mới chỉ xoá ở cấp deck. Vẫn quét tài liệu con để khôi phục dữ liệu tạo bởi
    // phiên bản cũ (trước đây từng ghi deletedAt lên từng thẻ), nhưng chỉ update card thực sự bị xoá.
    for (const cardChunk of chunkForFirestore(cards.docs)) {
      const legacyDeletedCards = cardChunk.filter((card) => Boolean(card.data()?.deletedAt));
      if (!legacyDeletedCards.length) continue;
      const batch = writeBatch(db);
      legacyDeletedCards.forEach((card) => batch.update(card.ref, { deletedAt: null }));
      await batch.commit();
    }
    // Chỉ mở deck sau khi mọi batch dữ liệu cũ đã phục hồi thành công.
    await updateDoc(doc(db, "study_decks", id), { deletedAt: null });
  },

  async trashCards(ids) {
    const uniqueIds = [...new Set(ids)].filter(Boolean);
    if (!uniqueIds.length) return 0;
    const deletedAt = new Date().toISOString();
    await dataMethods.updateCards(uniqueIds, { deletedAt });
    return uniqueIds.length;
  },

  async restoreCards(ids) {
    const uniqueIds = [...new Set(ids)].filter(Boolean);
    if (!uniqueIds.length) return 0;
    await dataMethods.updateCards(uniqueIds, { deletedAt: null });
    return uniqueIds.length;
  },

  async trashCard(id) {
    return dataMethods.trashCards([id]);
  },

  async restoreCard(id) {
    return dataMethods.restoreCards([id]);
  },

  /** Danh sách đang nằm trong thùng rác (bộ thẻ + thẻ lẻ). */
  async getTrashed() {
    if (!currentUser()) {
      const library = readLocal();
      return buildTrashView(
        library.decks.map(normalizeDeck),
        library.cards.map(normalizeCard),
      );
    }
    // Đọc server trực tiếp: nếu vừa chia 1.000 thẻ thành nhiều batch, không được
    // trả cache cũ và báo nhầm cho người dùng rằng thùng rác đã đồng bộ.
    const [decks, cards] = await Promise.all([
      getUserDocuments("study_decks", { serverOnly: true }),
      getUserDocuments("vocabulary_cards", { serverOnly: true }),
    ]);
    return buildTrashView(
      decks.map(normalizeDeck),
      cards.map((item) => normalizeCard({ id: item.id, ...item })),
    );
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
    const decks = await getUserDocuments("study_decks", { serverOnly: true });
    const cards = await getUserDocuments("vocabulary_cards", { serverOnly: true });
    const trashedDeckIds = new Set(decks.filter((deck) => deck.deletedAt).map((deck) => deck.id));
    const targets = [
      ...decks.filter((deck) => deck.deletedAt).map((deck) => ["study_decks", deck.id]),
      ...cards
        .filter((card) => card.deletedAt || trashedDeckIds.has(card.deckId))
        .map((card) => ["vocabulary_cards", card.id]),
    ];
    for (const targetChunk of chunkForFirestore(targets)) {
      const batch = writeBatch(db);
      targetChunk.forEach(([collectionName, id]) => {
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
    throw new Error("Không thể đồng bộ dữ liệu. Vui lòng kiểm tra kết nối và thử lại.", { cause: error });
  }
};

const READ_METHODS = new Set(["getDecks", "getCards", "getTrashed"]);

export const dataService = Object.fromEntries(
  Object.entries(dataMethods).map(([name, operation]) => [
    name,
    (...args) => (READ_METHODS.has(name)
      ? withFriendlyDataError(operation, args)
      : trackPendingWrite(() => withFriendlyDataError(operation, args))),
  ]),
);
