import { dataService } from "./dataService";

/**
 * Chỉ tạo bộ 50 thẻ khởi đầu khi người dùng chủ động bấm chọn.
 * Dùng chung cho Home và Vocabulary để hai nơi không tạo trùng bộ.
 */
let starterPromise = null;

export function createStarterPackDeck() {
  if (!starterPromise) {
    starterPromise = (async () => {
      const { createStarterPack } = await import("../data/commonWords.js");
      const pack = createStarterPack();
      const decks = await dataService.getDecks();
      const existing = decks.find((deck) => deck.title === pack.deck.title);
      if (existing) {
        const cards = await dataService.getCards(existing.id);
        return { deck: existing, cards, existing: true };
      }
      const created = await dataService.createDeckWithCards(pack.deck.title, pack.cards);
      return { ...created, existing: false };
    })().finally(() => {
      starterPromise = null;
    });
  }
  return starterPromise;
}
