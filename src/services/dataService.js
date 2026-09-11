import { addDoc, collection, deleteDoc, doc, getDocs, query, serverTimestamp, updateDoc, where } from 'firebase/firestore'
import { auth, db } from './firebase'

const localDecksKey = 'study_decks'
const localCardsKey = 'vocabulary_cards'
const currentUser = () => auth.currentUser
const normalizeDeck = (snapshot) => { const data = snapshot.data ? snapshot.data() : snapshot; return { id: snapshot.id || data.id, ...data, tags: data.tags || [], createdAt: data.createdAt || data.created_at || new Date().toISOString() } }
const normalizeCard = (snapshot) => { const data = snapshot.data ? snapshot.data() : snapshot; return { id: snapshot.id || data.id, ...data, deckId: data.deckId || data.deck_id, reviewDate: data.reviewDate || data.review_date || null } }

export const dataService = {
  async getDecks() {
    const user = currentUser()
    if (!user) return JSON.parse(localStorage.getItem(localDecksKey) || '[]').map(normalizeDeck)
    const snapshot = await getDocs(query(collection(db, 'study_decks'), where('userId', '==', user.uid)))
    return snapshot.docs.map(normalizeDeck)
  },
  async createDeck(title) {
    const user = currentUser()
    if (!user) { const deck = { id: Date.now().toString(), title, tags: [], createdAt: new Date().toISOString() }; const decks = JSON.parse(localStorage.getItem(localDecksKey) || '[]'); localStorage.setItem(localDecksKey, JSON.stringify([deck, ...decks])); return deck }
    const reference = await addDoc(collection(db, 'study_decks'), { userId: user.uid, title, tags: [], createdAt: serverTimestamp() })
    return { id: reference.id, title, tags: [], createdAt: new Date().toISOString() }
  },
  async updateDeck(deckId, title) {
    const user = currentUser()
    if (!user) { const decks = JSON.parse(localStorage.getItem(localDecksKey) || '[]').map((deck) => deck.id === deckId ? { ...deck, title } : deck); localStorage.setItem(localDecksKey, JSON.stringify(decks)); return decks.find((deck) => deck.id === deckId) }
    await updateDoc(doc(db, 'study_decks', deckId), { title })
  },
  async deleteDeck(deckId) {
    const user = currentUser()
    if (!user) { localStorage.setItem(localDecksKey, JSON.stringify(JSON.parse(localStorage.getItem(localDecksKey) || '[]').filter((deck) => deck.id !== deckId))); localStorage.setItem(localCardsKey, JSON.stringify(JSON.parse(localStorage.getItem(localCardsKey) || '[]').filter((card) => card.deckId !== deckId))); return }
    await deleteDoc(doc(db, 'study_decks', deckId))
  },
  async getCards(deckId) {
    const user = currentUser()
    if (!user) return JSON.parse(localStorage.getItem(localCardsKey) || '[]').filter((card) => card.deckId === deckId).map(normalizeCard)
    const snapshot = await getDocs(query(collection(db, 'vocabulary_cards'), where('userId', '==', user.uid), where('deckId', '==', deckId)))
    return snapshot.docs.map(normalizeCard)
  },
  async addCard(card) {
    const user = currentUser()
    if (!user) { const saved = { ...card, id: Date.now().toString(), createdAt: new Date().toISOString() }; const cards = JSON.parse(localStorage.getItem(localCardsKey) || '[]'); localStorage.setItem(localCardsKey, JSON.stringify([saved, ...cards])); return saved }
    const reference = await addDoc(collection(db, 'vocabulary_cards'), { ...card, userId: user.uid, createdAt: serverTimestamp() })
    return { ...card, id: reference.id }
  },
  async updateCard(cardId, changes) {
    const user = currentUser()
    if (!user) { const cards = JSON.parse(localStorage.getItem(localCardsKey) || '[]').map((card) => card.id === cardId ? { ...card, ...changes } : card); localStorage.setItem(localCardsKey, JSON.stringify(cards)); return cards.find((card) => card.id === cardId) }
    await updateDoc(doc(db, 'vocabulary_cards', cardId), changes)
  },
  async deleteCard(cardId) {
    const user = currentUser()
    if (!user) { localStorage.setItem(localCardsKey, JSON.stringify(JSON.parse(localStorage.getItem(localCardsKey) || '[]').filter((card) => card.id !== cardId))); return }
    await deleteDoc(doc(db, 'vocabulary_cards', cardId))
  },
}
