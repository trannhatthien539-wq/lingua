import { clearGuestVocabulary, dataService } from './dataService';

const FALLBACK_DECK_TITLE = 'Bộ từ đã đồng bộ';

const deckKey = (value = '') => String(value).trim().replace(/\s+/g, ' ').toLowerCase();

export async function loadVocabulary() {
  const decks = await dataService.getDecks();
  const cards = (await Promise.all(decks.map((deck) => dataService.getCards(deck.id)))).flat();
  return { decks, cards };
}

/**
 * Gộp thư viện đang lưu trên thiết bị (chế độ khách) vào tài khoản vừa đăng nhập.
 * Chạy lại nhiều lần vẫn an toàn: bộ trùng tên và từ trùng trong cùng bộ sẽ bị bỏ qua.
 */
export async function syncVocabulary(library) {
  const guestLibrary = { decks: library?.decks || [], cards: library?.cards || [] };
  if (!guestLibrary.decks.length && !guestLibrary.cards.length) return loadVocabulary();

  const remote = await loadVocabulary();
  const deckIdByTitle = new Map(remote.decks.map((deck) => [deckKey(deck.title), deck.id]));
  const wordsByDeck = new Map(remote.decks.map((deck) => [deck.id, new Set()]));
  for (const card of remote.cards) {
    if (!wordsByDeck.has(card.deckId)) wordsByDeck.set(card.deckId, new Set());
    wordsByDeck.get(card.deckId).add(deckKey(card.word));
  }

  const createdDeckIds = [];
  const resolveDeckId = async (title) => {
    const key = deckKey(title) || deckKey(FALLBACK_DECK_TITLE);
    if (deckIdByTitle.has(key)) return deckIdByTitle.get(key);
    const created = await dataService.createDeck(String(title || '').trim() || FALLBACK_DECK_TITLE);
    createdDeckIds.push(created.id);
    deckIdByTitle.set(key, created.id);
    wordsByDeck.set(created.id, new Set());
    return created.id;
  };

  const guestDeckIds = new Map();
  for (const deck of guestLibrary.decks) {
    guestDeckIds.set(deck.id, await resolveDeckId(deck.title));
  }

  const cardsByDeck = new Map();
  for (const card of guestLibrary.cards) {
    const targetDeckId = guestDeckIds.get(card.deckId) || (await resolveDeckId(FALLBACK_DECK_TITLE));
    guestDeckIds.set(card.deckId, targetDeckId);
    const word = deckKey(card.word);
    if (!word || wordsByDeck.get(targetDeckId).has(word)) continue;
    if (!cardsByDeck.has(targetDeckId)) cardsByDeck.set(targetDeckId, []);
    cardsByDeck.get(targetDeckId).push({ ...card, deckId: targetDeckId });
  }
  try {
    for (const [targetDeckId, cards] of cardsByDeck) {
      const savedCards = await dataService.addCards(cards);
      for (const card of savedCards) wordsByDeck.get(targetDeckId).add(deckKey(card.word));
    }
  } catch (error) {
    // Nếu lần đồng bộ này tạo deck mới nhưng batch thẻ lỗi, dọn deck rỗng/dở dang.
    // Dữ liệu guest chưa bị xoá nên người dùng có thể đăng nhập lại và thử tiếp.
    await Promise.all(createdDeckIds.map((id) => dataService.deleteDeck(id).catch(() => {})));
    throw error;
  }

  clearGuestVocabulary();
  return loadVocabulary();
}