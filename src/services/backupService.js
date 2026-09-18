import { dataService } from "./dataService";
import { getUserStreak, restoreUserStreak } from "./streakService";
import { loadUserDoc, saveUserDoc, userDocKeys } from "./userDocService";
import { markSynced } from "./syncStatus";

const BACKUP_VERSION = 1;
const wordKey = (value = "") => String(value).trim().replace(/\s+/g, " ").toLowerCase();

const download = (content, filename, type) => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

/** Gộp toàn bộ dữ liệu của tài khoản (bộ thẻ, kế hoạch, mindmap, nháp ngữ pháp, nhắc học, streak). */
export const buildBackup = async () => {
  const decks = await dataService.getDecks();
  const cards = (await Promise.all(decks.map((deck) => dataService.getCards(deck.id)))).flat();
  const [planner, mindmap, grammar, reminder, history] = await Promise.all(
    [userDocKeys.planner, userDocKeys.mindmap, userDocKeys.grammar, userDocKeys.reminder, userDocKeys.history]
      .map((key) => loadUserDoc(key).catch(() => null)),
  );
  return {
    app: "lingua",
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    streak: await getUserStreak().catch(() => null),
    decks,
    cards,
    planner: planner?.payload ?? null,
    mindmap: mindmap?.payload ?? null,
    grammar: grammar?.payload ?? null,
    reminder: reminder?.payload ?? null,
    history: history?.payload ?? null,
  };
};

export const downloadBackup = async () => {
  const backup = await buildBackup();
  const stamp = new Date().toISOString().slice(0, 10);
  download(JSON.stringify(backup, null, 2), `lingua-backup-${stamp}.json`, "application/json");
  return { decks: backup.decks.length, cards: backup.cards.length };
};

const restoreLibrary = async (backup) => {
  if (!Array.isArray(backup.decks) || !Array.isArray(backup.cards)) return { decks: 0, cards: 0 };
  const remoteDecks = await dataService.getDecks();
  const deckIdByTitle = new Map(remoteDecks.map((deck) => [wordKey(deck.title), deck.id]));
  const wordsByDeck = new Map(remoteDecks.map((deck) => [deck.id, new Set()]));
  for (const card of (await Promise.all(remoteDecks.map((deck) => dataService.getCards(deck.id)))).flat()) {
    if (!wordsByDeck.has(card.deckId)) wordsByDeck.set(card.deckId, new Set());
    wordsByDeck.get(card.deckId).add(wordKey(card.word));
  }

  const localDeckIds = new Map();
  let addedDecks = 0;
  for (const deck of backup.decks) {
    const key = wordKey(deck.title);
    if (!key) continue;
    if (deckIdByTitle.has(key)) {
      localDeckIds.set(deck.id, deckIdByTitle.get(key));
      continue;
    }
    const created = await dataService.createDeck(deck.title);
    deckIdByTitle.set(key, created.id);
    wordsByDeck.set(created.id, new Set());
    localDeckIds.set(deck.id, created.id);
    addedDecks += 1;
  }

  let addedCards = 0;
  for (const card of backup.cards) {
    const targetDeck = localDeckIds.get(card.deckId);
    if (!targetDeck || !card.word) continue;
    const key = wordKey(card.word);
    if (wordsByDeck.get(targetDeck)?.has(key)) continue;
    wordsByDeck.get(targetDeck).add(key);
    await dataService.addCard({
      ...card,
      deckId: targetDeck,
      status: card.status || "new",
      level: card.level || "B1",
      interval: Number(card.interval) || 0,
      repetition: Number(card.repetition) || 0,
      nextReviewDate: card.nextReviewDate || null,
      lastStudiedDate: card.lastStudiedDate || null,
    });
    addedCards += 1;
  }
  return { decks: addedDecks, cards: addedCards };
};

export const importBackup = async (backup) => {
  if (!backup || backup.app !== "lingua") {
    throw new Error("File này không phải bản sao lưu của Lingua.");
  }
  const library = await restoreLibrary(backup);
  const docs = [
    [userDocKeys.planner, backup.planner],
    [userDocKeys.mindmap, backup.mindmap],
    [userDocKeys.grammar, backup.grammar],
    [userDocKeys.reminder, backup.reminder],
    [userDocKeys.history, backup.history],
  ];
  let restoredDocs = 0;
  for (const [key, payload] of docs) {
    if (!payload) continue;
    await saveUserDoc(key, payload);
    restoredDocs += 1;
  }
  if (backup.streak) await restoreUserStreak(backup.streak).catch(() => {});
  markSynced();
  return { ...library, docs: restoredDocs };
};
