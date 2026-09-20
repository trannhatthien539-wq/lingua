import { dataService } from "./dataService";
import { vocabularyTopicById, vocabularyItems } from "../data/vstep/vocabulary/topics";

/**
 * Chuyển một chủ đề từ vựng VSTEP thành bộ flashcard để học bằng SRS.
 * Dùng `dataService.addCards` (một lần ghi cho khách, batch cho tài khoản).
 */
export const createDeckFromVocabularyTopic = async (topicId) => {
  const topic = vocabularyTopicById(topicId);
  if (!topic) throw new Error("Không tìm thấy chủ đề từ vựng.");
  const deck = await dataService.createDeck(`VSTEP · ${topic.title}`);
  const words = vocabularyItems.filter((item) => item.topicId === topicId);
  const cards = await dataService.addCards(
    words.map((item) => ({
      deckId: deck.id,
      word: item.word,
      ipa: item.ipa,
      meaning: item.vi,
      example: item.example,
      level: item.level || "B1",
      status: "new",
      reviewDate: null,
      interval: 0,
      nextReviewDate: null,
      repetition: 0,
    })),
  );
  return { deck, count: cards.length };
};

/** Tạo nhiều bộ cùng lúc (dùng cho nút "Thêm 3 chủ đề yếu nhất" hoặc nhập hàng loạt). */
export const createDecksFromTopics = async (topicIds = []) => {
  const result = [];
  for (const topicId of topicIds) {
    result.push(await createDeckFromVocabularyTopic(topicId));
  }
  return result;
};
