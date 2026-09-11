import { dataService } from './dataService';

export async function loadVocabulary(userId) {
  const decks = await dataService.getDecks();
  const cards = (await Promise.all(decks.map((deck) => dataService.getCards(deck.id)))).flat();
  return { decks, cards };
}

export async function syncVocabulary(userId, library) {
  const deckIds = new Map();
  for (const deck of library.decks) {
    const savedDeck = await dataService.createDeck(deck.title);
    deckIds.set(deck.id, savedDeck.id);
  }
  for (const card of library.cards) {
    await dataService.addCard({ ...card, deckId: deckIds.get(card.deckId) });
  }
  return loadVocabulary(userId);
}