import { grammarLessons } from './grammarCurriculum.js'
import { grammarTopics } from './grammarTopics.js'
import { grammarTopicsB1a } from './grammarTopicsB1a.js'
import { grammarTopicsB1b } from './grammarTopicsB1b.js'
import { grammarTopicsC1 } from './grammarTopicsC1.js'

/**
 * Gộp toàn bộ bài ngữ pháp thành một danh sách duy nhất:
 * 12 thì (order 1–12) + 8 chuyên đề B1 gốc (101–108) + 6 chủ điểm mở rộng (109–114)
 * + 4 cấu trúc C1 (201–204) = 30 bài.
 */
const b1More = [...grammarTopicsB1a, ...grammarTopicsB1b]
export const grammarB1Topics = [...grammarTopics, ...b1More]

/**
 * Gắn id ổn định cho từng câu hỏi (`<lessonId>-q<index>`) để lưu vào sổ câu sai
 * và tìm lại câu hỏi theo id. File bài học gốc không bị sửa.
 */
export const withQuestionIds = (lesson) => ({
  ...lesson,
  questions: (lesson.questions || []).map((question, index) => ({
    ...question,
    id: question.id || `${lesson.id}-q${index + 1}`,
    lessonId: lesson.id,
    lessonTitle: lesson.title,
  })),
})

export const grammarAllItems = [...grammarLessons, ...grammarB1Topics, ...grammarTopicsC1].map(withQuestionIds)

const taggedById = new Map(grammarAllItems.map((item) => [item.id, item]))
const tagged = (items) => items.map((item) => taggedById.get(item.id) || withQuestionIds(item))

/** Chia nhóm để hiển thị trong danh sách bài. */
export const grammarSections = [
  { id: 'tenses', title: '12 thì cơ bản', items: tagged(grammarLessons) },
  { id: 'topics', title: 'Cấu trúc B1', items: tagged(grammarTopics) },
  { id: 'b1-more', title: 'Chủ điểm mở rộng', items: tagged(b1More) },
  { id: 'c1', title: 'Cấu trúc C1', items: tagged(grammarTopicsC1) },
]

export const grammarItemById = (id) => taggedById.get(id) || null

/** Tất cả câu hỏi của mọi bài (đã có id) — dùng cho thi tổng hợp và sổ câu sai. */
export const grammarAllQuestions = grammarAllItems.flatMap((lesson) => lesson.questions)

export const grammarQuestionById = (id) => grammarAllQuestions.find((question) => question.id === id) || null

/** Bảng tra nhanh cho các chủ điểm ngoài 12 thì (mẫu cấu trúc đầu tiên của mỗi bài). */
export const grammarTopicCheatSheet = [...grammarTopics, ...b1More, ...grammarTopicsC1].map((lesson) => ({
  id: lesson.id,
  order: lesson.order,
  title: lesson.title,
  en: lesson.en,
  group: lesson.order > 200 ? 'C1' : lesson.order > 108 ? 'Mở rộng' : 'B1',
  pattern: lesson.forms?.[0]?.pattern || '',
  example: lesson.forms?.[0]?.example || lesson.examples?.[0]?.en || '',
  signal: (lesson.signals || []).slice(0, 3).join(', '),
}))
