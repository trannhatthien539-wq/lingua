import { commonWordsPart1 } from './commonWords/part1.js'
import { commonWordsPart2 } from './commonWords/part2.js'
import { commonWordsPart3 } from './commonWords/part3.js'
import { commonWordsPart4 } from './commonWords/part4.js'

/** Số từ của bộ thẻ mặc định. */
export const COMMON_WORDS_TOTAL = 1000

const parsePart = (raw) =>
  raw
    .trim()
    .split('\n')
    .map((line) => {
      const [word, meaning] = line.split('|')
      return { word: (word || '').trim(), meaning: (meaning || '').trim() }
    })
    .filter((entry) => entry.word && entry.meaning)

const dedupe = (entries) => {
  const seen = new Set()
  return entries.filter((entry) => {
    const key = entry.word.toLowerCase()
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

// Một số từ có thể bị lặp giữa các phần nên luôn lọc trùng trước khi dùng.
export const commonWords = dedupe([
  ...parsePart(commonWordsPart1),
  ...parsePart(commonWordsPart2),
  ...parsePart(commonWordsPart3),
  ...parsePart(commonWordsPart4),
]).slice(0, COMMON_WORDS_TOTAL)

export const commonWordsDeckTitle = `${commonWords.length} từ tiếng Anh thông dụng`
export const commonWordsDeckDescription = `${commonWords.length} từ tiếng Anh thông dụng nhất, xếp theo mức độ phổ biến (A1 → B1). Học theo SRS để nhớ lâu.`
export const commonWordsDeckTags = ['Cơ bản', '1000 từ', 'SRS']

// Mức độ theo thứ hạng tần suất: 250 từ đầu là A1, tiếp theo là A2, phần còn lại B1.
const levelForRank = (rank) => (rank <= 250 ? 'A1' : rank <= 600 ? 'A2' : 'B1')

/**
 * Bộ thẻ mặc định 1000 từ thông dụng.
 * Id sinh mới mỗi lần tạo để không trùng khi tạo lại (React StrictMode, nhiều tab).
 */
export const createCommonWordsDeck = () => {
  const stamp = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
  const deckId = `common-deck-${stamp}`
  const now = new Date().toISOString()
  const today = now.slice(0, 10)
  return {
    deck: {
      id: deckId,
      title: commonWordsDeckTitle,
      description: commonWordsDeckDescription,
      tags: commonWordsDeckTags,
      createdAt: now,
    },
    cards: commonWords.map((entry, index) => ({
      id: `common-card-${stamp}-${String(index + 1).padStart(4, '0')}`,
      deckId,
      word: entry.word,
      ipa: '',
      meaning: entry.meaning,
      example: '',
      level: levelForRank(index + 1),
      status: 'new',
      interval: 1,
      nextReview: now,
      nextReviewDate: today,
      repetition: 0,
      reviewDate: now,
      imageUrl: '',
      audioUrl: '',
    })),
  }
}

/** Bộ khởi đầu nhỏ, chỉ được tạo khi người dùng chủ động bấm chọn. */
export const STARTER_PACK_SIZE = 50
export const STARTER_PACK_TITLE = `${STARTER_PACK_SIZE} từ tiếng Anh khởi đầu`
export const STARTER_PACK_DESCRIPTION = `${STARTER_PACK_SIZE} từ thông dụng đầu tiên, phù hợp để làm quen với flashcard và lịch ôn SRS.`
export const STARTER_PACK_TAGS = ['Khởi đầu', '50 từ', 'SRS']

export const createStarterPack = () => {
  const stamp = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
  const deckId = `starter-pack-${stamp}`
  const now = new Date().toISOString()
  return {
    deck: {
      id: deckId,
      title: STARTER_PACK_TITLE,
      description: STARTER_PACK_DESCRIPTION,
      tags: STARTER_PACK_TAGS,
      createdAt: now,
    },
    cards: commonWords.slice(0, STARTER_PACK_SIZE).map((entry, index) => ({
      id: `starter-pack-card-${stamp}-${String(index + 1).padStart(3, '0')}`,
      deckId,
      word: entry.word,
      ipa: '',
      meaning: entry.meaning,
      example: '',
      level: levelForRank(index + 1),
      status: 'new',
      interval: 0,
      nextReviewDate: null,
      reviewDate: null,
      repetition: 0,
      imageUrl: '',
      audioUrl: '',
    })),
  }
}
