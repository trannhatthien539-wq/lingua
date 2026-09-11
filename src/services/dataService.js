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

const STORAGE_KEY = "lingua-vocabulary-library";
const OLD_STORAGE_KEY = "lingua-vocabulary";

const readLocal = () => {
  try {
    const library = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    if (library.decks || library.cards) return { decks: library.decks || [], cards: library.cards || [] };
    const legacyWords = JSON.parse(localStorage.getItem(OLD_STORAGE_KEY) || "[]");
    if (!legacyWords.length) return { decks: [], cards: [] };
    const deck = { id: `deck-${Date.now()}`, title: "IELTS Speaking Part 1", tags: ["IELTS", "Speaking"], createdAt: new Date().toISOString() };
    return {
      decks: [deck],
      cards: legacyWords.map((item, index) => ({
        id: `card-${Date.now()}-${index}`,
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
  } catch {
    return { decks: [], cards: [] };
  }
};

const writeLocal = (library) => localStorage.setItem(STORAGE_KEY, JSON.stringify(library));
const currentUser = () => auth.currentUser;

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
});

const withUserId = (data) => ({ ...data, userId: currentUser().uid });

const getUserDocuments = async (collectionName) => {
  const user = currentUser();
  const snapshot = await getDocs(query(collection(db, collectionName), where("userId", "==", user.uid)));
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
};

export const dataService = {
  async getDecks() {
    if (!currentUser()) return readLocal().decks.map(normalizeDeck);
    return (await getUserDocuments("study_decks"))
      .sort((first, second) => String(first.createdAt).localeCompare(String(second.createdAt)))
      .map(normalizeDeck);
  },

  async createDeck(title) {
    const deck = normalizeDeck({
      id: `deck-${Date.now()}`,
      title,
      tags: [],
      createdAt: new Date().toISOString(),
    });
    if (!currentUser()) {
      const library = readLocal();
      writeLocal({ ...library, decks: [...library.decks, deck] });
      return deck;
    }
    const created = await addDoc(collection(db, "study_decks"), withUserId({
      title: deck.title,
      tags: deck.tags,
      createdAt: deck.createdAt,
    }));
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
    const cards = await getDocs(query(collection(db, "vocabulary_cards"), where("userId", "==", currentUser().uid), where("deckId", "==", id)));
    await Promise.all(cards.docs.map((card) => deleteDoc(card.ref)));
  },

  async getCards(deckId) {
    if (!currentUser()) return readLocal().cards.filter((card) => card.deckId === deckId).map(normalizeCard);
    const cards = await getUserDocuments("vocabulary_cards");
    return cards.filter((card) => card.deckId === deckId).map(normalizeCard);
  },

  async addCard(card) {
    const normalized = normalizeCard(card);
    if (!currentUser()) {
      const library = readLocal();
      writeLocal({ ...library, cards: [...library.cards, normalized] });
      return normalized;
    }
    const created = await addDoc(collection(db, "vocabulary_cards"), withUserId({
      deckId: normalized.deckId,
      word: normalized.word,
      ipa: normalized.ipa,
      meaning: normalized.meaning,
      example: normalized.example,
      level: normalized.level,
      status: normalized.status,
      reviewDate: normalized.reviewDate,
    }));
    return { ...normalized, id: created.id };
  },

  async updateCard(id, changes) {
    if (!currentUser()) {
      const library = readLocal();
      writeLocal({ ...library, cards: library.cards.map((card) => card.id === id ? { ...card, ...changes } : card) });
      return;
    }
    await updateDoc(doc(db, "vocabulary_cards", id), changes);
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
