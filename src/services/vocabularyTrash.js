export function buildTrashView(decks, cards) {
  const safeDecks = Array.isArray(decks) ? decks.filter((deck) => deck?.deletedAt) : [];
  const safeCards = Array.isArray(cards) ? cards : [];
  const trashedDeckIds = new Set(safeDecks.map((deck) => deck.id));
  const cardCounts = new Map();
  for (const card of safeCards) {
    if (!trashedDeckIds.has(card?.deckId)) continue;
    cardCounts.set(card.deckId, (cardCounts.get(card.deckId) || 0) + 1);
  }
  return {
    decks: safeDecks.map((deck) => ({ ...deck, cardCount: cardCounts.get(deck.id) || deck.cardCount || 0 })),
    cards: safeCards.filter((card) => card?.deletedAt && !trashedDeckIds.has(card.deckId)),
  };
}
