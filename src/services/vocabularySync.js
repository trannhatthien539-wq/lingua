import { supabase } from './supabaseClient';

const toLocalDeck = (deck) => ({ id: deck.id, title: deck.title, tags: deck.tags || [], createdAt: deck.created_at || new Date().toISOString() });
const toLocalCard = (card) => ({ id: card.id, deckId: card.deck_id, word: card.word || '', ipa: card.ipa || '', meaning: card.meaning || '', example: card.example || '', level: card.level || 'B1', status: card.status || 'new', reviewDate: card.review_date || null });

export async function loadVocabulary(userId) {
  const [{ data: decks, error: decksError }, { data: cards, error: cardsError }] = await Promise.all([
    supabase.from('study_decks').select('*').eq('user_id', userId).order('created_at'),
    supabase.from('vocabulary_cards').select('*').eq('user_id', userId).order('created_at'),
  ]);
  if (decksError) throw decksError;
  if (cardsError) throw cardsError;
  return { decks: (decks || []).map(toLocalDeck), cards: (cards || []).map(toLocalCard) };
}

export async function syncVocabulary(userId, library) {
  const deckRows = library.decks.map(({ title, tags, createdAt }) => ({ user_id: userId, title, tags: tags || [], created_at: createdAt || new Date().toISOString() }));
  const { data: savedDecks, error: decksError } = await supabase.from('study_decks').insert(deckRows).select();
  if (decksError) throw decksError;
  const deckIds = new Map(library.decks.map((deck, index) => [deck.id, savedDecks[index].id]));
  const cardRows = library.cards.map(({ deckId, word, ipa, meaning, example, level, status, reviewDate }) => ({ user_id: userId, deck_id: deckIds.get(deckId), word, ipa, meaning, example, level, status, review_date: reviewDate }));
  const { error: cardsError } = cardRows.length ? await supabase.from('vocabulary_cards').insert(cardRows) : { error: null };
  if (cardsError) throw cardsError;
  return loadVocabulary(userId);
}