const starterCards = [
  ["Routine", "/ruːˈtiːn/", "thói quen, lịch sinh hoạt", "A2", "My morning routine usually starts with a cup of coffee."],
  ["Leisure", "/ˈleʒ.ər/", "thời gian rảnh, sự thư giãn", "B1", "I enjoy reading books in my leisure time."],
  ["Convenient", "/kənˈviː.ni.ənt/", "thuận tiện", "B1", "Online shopping is convenient when I have a busy schedule."],
  ["Neighborhood", "/ˈneɪ.bər.hʊd/", "khu phố, khu dân cư", "A2", "My neighborhood is quiet and close to several parks."],
  ["Commute", "/kəˈmjuːt/", "đi lại hằng ngày", "B1", "I commute to work by bus because it is affordable."],
  ["Atmosphere", "/ˈæt.mə.sfɪr/", "bầu không khí, không gian", "B1", "I like this café because it has a relaxed atmosphere."],
  ["Preference", "/ˈpref.ər.əns/", "sở thích, sự ưa thích", "B1", "My preference is to study in the morning when I feel focused."],
  ["Memorable", "/ˈmem.ər.ə.bəl/", "đáng nhớ", "B1", "My first trip abroad was a memorable experience."],
  ["Socialize", "/ˈsəʊ.ʃəl.aɪz/", "giao lưu, kết bạn", "B1", "I often socialize with friends at the weekend."],
  ["Accommodation", "/əˌkɒm.əˈdeɪ.ʃən/", "chỗ ở, nơi lưu trú", "B1", "The accommodation was clean, comfortable, and near the beach."],
];

export const starterDeck = {
  id: "starter-deck-01",
  title: "IELTS Speaking Part 1",
  description: "10 từ vựng chủ đề quen thuộc để luyện IELTS Speaking Part 1",
  tags: ["IELTS", "Speaking", "SRS"],
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
