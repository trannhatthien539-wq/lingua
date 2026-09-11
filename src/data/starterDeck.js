const starterCards = [
  ["Accomplish", "/əˈkɑːm.plɪʃ/", "hoàn thành, đạt được", "B1", "She worked hard to accomplish her personal goals."],
  ["Consistent", "/kənˈsɪs.tənt/", "kiên trì, nhất quán", "B2", "Consistent practice is key to mastering any language."],
  ["Productive", "/prəˈdʌk.tɪv/", "năng suất, hiệu quả", "B1", "Using the Pomodoro timer helped me stay productive all morning."],
  ["Curiosity", "/ˌkjʊr.iˈɑː.sə.t̬i/", "sự tò mò, ham học hỏi", "B1", "Children have a natural curiosity about the world around them."],
  ["Persevere", "/ˌpɜːr.səˈvɪr/", "kiên trì, bền bỉ", "B2", "You need to persevere even when the challenge feels tough."],
  ["Crucial", "/ˈkruː.ʃəl/", "tối quan trọng, thiết yếu", "B2", "Regular vocabulary review is crucial for long-term memory."],
  ["Expand", "/ɪkˈspænd/", "mở rộng, phát triển", "B1", "Reading news articles helps expand your active vocabulary."],
  ["Insightful", "/ˈɪn.saɪt.fəl/", "sâu sắc, sáng tỏ", "B2", "The teacher provided insightful feedback on my essay."],
  ["Memorize", "/ˈmem.ə.raɪz/", "ghi nhớ, học thuộc", "A2", "Spaced repetition makes it much easier to memorize new words."],
  ["Efficiency", "/ɪˈfɪʃ.ən.si/", "hiệu suất, tính hiệu quả", "B2", "Organizing your study schedule greatly improves learning efficiency."],
];

export const starterDeck = {
  id: "starter-deck-01",
  title: "10 Từ Vựng Thiết Yếu (Starter Kit)",
  description: "Bộ từ vựng cơ bản kiểm thử tính năng học SRS",
  tags: ["Starter", "SRS", "B1-B2"],
  createdAt: new Date().toISOString(),
  cards: starterCards.map(([word, ipa, meaning, level, example], index) => ({
    id: `starter-card-${String(index + 1).padStart(2, "0")}`,
    deckId: "starter-deck-01",
    word,
    ipa,
    meaning,
    level,
    example,
    status: "new",
    interval: 1,
    nextReview: new Date().toISOString(),
    nextReviewDate: new Date().toISOString().slice(0, 10),
    repetition: 0,
    reviewDate: new Date().toISOString(),
    imageUrl: "",
    audioUrl: "",
  })),
};

export const createStarterDeck = () => ({
  ...starterDeck,
  createdAt: new Date().toISOString(),
  cards: starterDeck.cards.map((card) => ({ ...card, nextReview: new Date().toISOString(), nextReviewDate: new Date().toISOString().slice(0, 10), reviewDate: new Date().toISOString() })),
});
