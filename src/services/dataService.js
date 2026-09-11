import { supabase } from './supabaseClient';

export const dataService = {
  // Lấy danh sách Decks
  async getDecks() {
    const { data: { session } } = await supabase.auth.getSession();
    
    // Nếu chưa đăng nhập: đọc từ LocalStorage
    if (!session?.user) {
      return JSON.parse(localStorage.getItem('study_decks') || '[]');
    }

    // Đã đăng nhập: RLS tự động lọc chỉ trả về decks của user này
    const { data, error } = await supabase
      .from('study_decks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data.map((deck) => ({ ...deck, tags: deck.tags || [], createdAt: deck.created_at || deck.createdAt }));
  },

  // Tạo Deck mới
  async createDeck(title) {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) {
      const localDecks = JSON.parse(localStorage.getItem('study_decks') || '[]');
      const newDeck = { id: Date.now().toString(), title, created_at: new Date().toISOString() };
      localStorage.setItem('study_decks', JSON.stringify([newDeck, ...localDecks]));
      return newDeck;
    }

    const { data, error } = await supabase
      .from('study_decks')
      .insert([{ title, user_id: session.user.id }])
      .select()
      .single();

    if (error) throw error;
    return { ...data, tags: data.tags || [], createdAt: data.created_at || data.createdAt };
  },

  async updateDeck(deckId, title) {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      const decks = JSON.parse(localStorage.getItem('study_decks') || '[]');
      const updated = decks.map((deck) => deck.id === deckId ? { ...deck, title } : deck);
      localStorage.setItem('study_decks', JSON.stringify(updated));
      return updated.find((deck) => deck.id === deckId);
    }
    const { data, error } = await supabase.from('study_decks').update({ title }).eq('id', deckId).select().single();
    if (error) throw error;
    return data.map((card) => ({ ...card, deckId: card.deck_id || card.deckId, reviewDate: card.review_date || card.reviewDate }));
  },

  async deleteDeck(deckId) {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      const decks = JSON.parse(localStorage.getItem('study_decks') || '[]').filter((deck) => deck.id !== deckId);
      const cards = JSON.parse(localStorage.getItem('vocabulary_cards') || '[]').filter((card) => card.deckId !== deckId);
      localStorage.setItem('study_decks', JSON.stringify(decks));
      localStorage.setItem('vocabulary_cards', JSON.stringify(cards));
      return;
    }
    const { error } = await supabase.from('study_decks').delete().eq('id', deckId);
    if (error) throw error;
  },

  // Lấy cards thuộc về một deck
  async getCards(deckId) {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) {
      const allCards = JSON.parse(localStorage.getItem('vocabulary_cards') || '[]');
      return allCards.filter(c => c.deckId === deckId);
    }

    const { data, error } = await supabase
      .from('vocabulary_cards')
      .select('*')
      .eq('deck_id', deckId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Thêm card mới
  async addCard(card) {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) {
      const allCards = JSON.parse(localStorage.getItem('vocabulary_cards') || '[]');
      const newCard = { ...card, id: Date.now().toString(), created_at: new Date().toISOString() };
      localStorage.setItem('vocabulary_cards', JSON.stringify([newCard, ...allCards]));
      return newCard;
    }

    const { data, error } = await supabase
      .from('vocabulary_cards')
      .insert([{
        deck_id: card.deckId,
        user_id: session.user.id,
        word: card.word,
        ipa: card.ipa,
        meaning: card.meaning,
        example: card.example,
        level: card.level || 'B1',
        status: card.status || 'new',
        review_date: card.reviewDate || null
      }])
      .select()
      .single();

    if (error) throw error;
    return { ...data, deckId: data.deck_id || data.deckId, reviewDate: data.review_date || data.reviewDate };
  },

  async updateCard(cardId, changes) {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      const cards = JSON.parse(localStorage.getItem('vocabulary_cards') || '[]');
      const updated = cards.map((card) => card.id === cardId ? { ...card, ...changes } : card);
      localStorage.setItem('vocabulary_cards', JSON.stringify(updated));
      return updated.find((card) => card.id === cardId);
    }
    const payload = { ...changes };
    if (payload.deckId) { payload.deck_id = payload.deckId; delete payload.deckId; }
    if (payload.reviewDate) { payload.review_date = payload.reviewDate; delete payload.reviewDate; }
    const { data, error } = await supabase.from('vocabulary_cards').update(payload).eq('id', cardId).select().single();
    if (error) throw error;
    return { ...data, deckId: data.deck_id || data.deckId, reviewDate: data.review_date || data.reviewDate };
  },

  async deleteCard(cardId) {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      const cards = JSON.parse(localStorage.getItem('vocabulary_cards') || '[]').filter((card) => card.id !== cardId);
      localStorage.setItem('vocabulary_cards', JSON.stringify(cards));
      return;
    }
    const { error } = await supabase.from('vocabulary_cards').delete().eq('id', cardId);
    if (error) throw error;
  }
};