import { db, auth } from './firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  serverTimestamp, 
  orderBy 
} from 'firebase/firestore';

export const dataService = {
  // LẤY DANH SÁCH DECKS
  async getDecks() {
    const user = auth.currentUser;
    if (!user) {
      return JSON.parse(localStorage.getItem('study_decks') || '[]');
    }

    const q = query(
      collection(db, 'study_decks'),
      where('userId', '==', user.uid)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  // TẠO DECK MỚI
  async createDeck(title) {
    const user = auth.currentUser;
    if (!user) {
      const localDecks = JSON.parse(localStorage.getItem('study_decks') || '[]');
      const newDeck = { id: Date.now().toString(), title, createdAt: new Date().toISOString() };
      localStorage.setItem('study_decks', JSON.stringify([newDeck, ...localDecks]));
      return newDeck;
    }

    const docRef = await addDoc(collection(db, 'study_decks'), {
      userId: user.uid,
      title,
      createdAt: serverTimestamp()
    });
    return { id: docRef.id, title };
  },

  // LẤY DANH SÁCH TỪ VỰNG TRONG DECK
  async getCards(deckId) {
    const user = auth.currentUser;
    if (!user) {
      const allCards = JSON.parse(localStorage.getItem('vocabulary_cards') || '[]');
      return allCards.filter(c => c.deckId === deckId);
    }

    const q = query(
      collection(db, 'vocabulary_cards'),
      where('deckId', '==', deckId),
      where('userId', '==', user.uid)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  // THÊM TỪ VỰNG MỚI
  async addCard(card) {
    const user = auth.currentUser;
    if (!user) {
      const allCards = JSON.parse(localStorage.getItem('vocabulary_cards') || '[]');
      const newCard = { ...card, id: Date.now().toString(), createdAt: new Date().toISOString() };
      localStorage.setItem('vocabulary_cards', JSON.stringify([newCard, ...allCards]));
      return newCard;
    }

    const docRef = await addDoc(collection(db, 'vocabulary_cards'), {
      ...card,
      userId: user.uid,
      createdAt: serverTimestamp()
    });
    return { id: docRef.id, ...card };
  }
};