import { grammarLessons } from './grammarCurriculum'
import { grammarTopics } from './grammarTopics'

/** Gộp 12 thì và các cấu trúc nâng cao thành một danh sách bài học. */
export const grammarAllItems = [...grammarLessons, ...grammarTopics]

/** Chia nhóm để hiển thị trong danh sách bài. */
export const grammarSections = [
  { id: 'tenses', title: '12 thì cơ bản', items: grammarLessons },
  { id: 'topics', title: 'Cấu trúc nâng cao (B1)', items: grammarTopics },
]

export const grammarItemById = (id) => grammarAllItems.find((item) => item.id === id)
