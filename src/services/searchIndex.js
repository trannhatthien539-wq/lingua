import { navigationItems } from "../data/navigation";
import { grammarAllItems } from "../data/grammarIndex";
import { themeDecks } from "../data/themeDecks";
import { listeningLessons } from "../data/skills/listening";
import { readingPassages } from "../data/skills/reading";
import { writingTasks } from "../data/skills/writing";
import { speakingTopics } from "../data/skills/speaking";
import { clozeExercises, orderExercises, rewriteExercises } from "../data/skills/sentencePractice";

/**
 * Chỉ mục tìm kiếm toàn cục (Ctrl/⌘+K): điều hướng, ngữ pháp, kỹ năng,
 * bộ từ theo chủ đề và 1000 từ thông dụng (nạp lười, chỉ khi người dùng gõ).
 */

export const TYPE_LABELS = {
  tab: "Mục",
  grammar: "Ngữ pháp",
  listening: "Nghe",
  reading: "Đọc",
  writing: "Viết",
  speaking: "Nói",
  sentence: "Luyện câu",
  theme: "Bộ theo chủ đề",
  word: "Từ thông dụng",
};

/** Bỏ dấu để "ngu phap" vẫn khớp "Ngữ pháp". */
const fold = (text = "") =>
  String(text)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase();

const makeItem = ({ id, type, tab, itemId, label, detail, extra = "" }) => ({
  id,
  type,
  tab,
  itemId,
  label: String(label || ""),
  detail: String(detail || ""),
  keywords: fold(`${label} ${detail} ${extra}`),
});

const staticItems = [
  ...navigationItems.map((item) =>
    makeItem({ id: `tab:${item.id}`, type: "tab", tab: item.id, label: item.label, detail: item.description }),
  ),
  ...grammarAllItems.map((lesson) =>
    makeItem({
      id: `grammar:${lesson.id}`,
      type: "grammar",
      tab: "grammar",
      itemId: lesson.id,
      label: lesson.title,
      detail: `Ngữ pháp · ${lesson.level || "B1"}`,
      extra: lesson.summary || lesson.usage || "",
    }),
  ),
  ...listeningLessons.map((lesson) =>
    makeItem({
      id: `listening:${lesson.id}`,
      type: "listening",
      tab: "skills",
      itemId: lesson.id,
      label: lesson.title,
      detail: `Nghe · ${lesson.level} · ${lesson.topic}`,
    }),
  ),
  ...readingPassages.map((passage) =>
    makeItem({
      id: `reading:${passage.id}`,
      type: "reading",
      tab: "skills",
      itemId: passage.id,
      label: passage.title,
      detail: `Đọc · ${passage.level} · ${passage.topic}`,
    }),
  ),
  ...writingTasks.map((task) =>
    makeItem({
      id: `writing:${task.id}`,
      type: "writing",
      tab: "skills",
      itemId: task.id,
      label: task.title,
      detail: `Viết · ${task.type === "email" ? "Email" : "Đoạn văn"}`,
    }),
  ),
  ...speakingTopics.map((topic) =>
    makeItem({
      id: `speaking:${topic.id}`,
      type: "speaking",
      tab: "skills",
      itemId: topic.id,
      label: topic.title,
      detail: `Nói · ${topic.topic}`,
    }),
  ),
  ...[...clozeExercises, ...orderExercises, ...rewriteExercises].map((exercise) =>
    makeItem({
      id: `sentence:${exercise.id}`,
      type: "sentence",
      tab: "skills",
      itemId: "sentence",
      label: exercise.text || exercise.hint || "Bài luyện câu",
      detail: `Luyện câu · ${exercise.hint || "B1"}`,
    }),
  ),
  ...themeDecks.map((deck) =>
    makeItem({
      id: `theme:${deck.id}`,
      type: "theme",
      tab: "vocabulary",
      itemId: deck.id,
      label: deck.title,
      detail: `Bộ từ theo chủ đề · ${deck.level}`,
      extra: deck.description,
    }),
  ),
];

let commonWordItems = null;

export const loadCommonWordIndex = async () => {
  if (!commonWordItems) {
    const { createCommonWordsDeck } = await import("../data/commonWords");
    commonWordItems = createCommonWordsDeck().cards.map((card) =>
      makeItem({
        id: `word:${card.word}`,
        type: "word",
        tab: "vocabulary",
        itemId: card.word,
        label: card.word,
        detail: card.meaning,
      }),
    );
  }
  return commonWordItems;
};

export const staticItemCount = staticItems.length;

const matchScore = (item, query) => {
  const tokens = query.split(/\s+/).filter(Boolean);
  if (!tokens.every((token) => item.keywords.includes(token))) return 0;
  const label = fold(item.label);
  if (label === query) return 100;
  if (label.startsWith(query)) return 70;
  if (label.includes(query)) return 50;
  return 25;
};

export async function searchEverything(rawQuery, { limit = 14 } = {}) {
  const query = fold(rawQuery).trim();
  if (query.length < 1) return [];
  const score = (item) => matchScore(item, query);
  const scored = staticItems
    .map((item) => ({ ...item, score: score(item) }))
    .filter((item) => item.score > 0);

  let wordResults = [];
  try {
    wordResults = (await loadCommonWordIndex())
      .map((item) => ({ ...item, score: score(item) }))
      .filter((item) => item.score > 0)
      .slice(0, 6);
  } catch {
    wordResults = [];
  }

  return [...scored, ...wordResults].sort((first, second) => second.score - first.score).slice(0, limit);
}
