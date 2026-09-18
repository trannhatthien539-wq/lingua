import { useCallback } from 'react'
import useCloudDoc from './useCloudDoc'
import { userDocKeys } from '../services/userDocService'

const empty = { listening: {}, reading: {}, mock: [], sentence: { attempted: 0, correct: 0 } }

const normalize = (payload, current) => {
  const base = current || empty
  if (!payload || typeof payload !== 'object') return base
  return {
    listening: payload.listening && typeof payload.listening === 'object' ? payload.listening : {},
    reading: payload.reading && typeof payload.reading === 'object' ? payload.reading : {},
    mock: Array.isArray(payload.mock) ? payload.mock.slice(-20) : [],
    sentence: payload.sentence && typeof payload.sentence === 'object' ? payload.sentence : base.sentence,
  }
}

/**
 * Tiến độ phần Luyện kỹ năng: điểm nghe/đọc, bài thi thử gần nhất, thống kê luyện câu.
 * Lưu theo tài khoản qua `user_state` key `skills`.
 */
export default function useSkillsProgress() {
  const { value, setValue } = useCloudDoc(userDocKeys.skills, { initial: empty, normalize })
  const progress = value || empty

  const recordSection = useCallback(
    (section, id, correct, total) => {
      setValue((current) => {
        const state = current || empty
        const previous = state[section]?.[id]
        const best = previous ? Math.max(previous.best || 0, correct) : correct
        return {
          ...state,
          [section]: { ...state[section], [id]: { best, total, at: Date.now() } },
        }
      })
    },
    [setValue],
  )

  const recordMock = useCallback(
    (score, total) => {
      setValue((current) => {
        const state = current || empty
        return { ...state, mock: [...state.mock, { score, total, at: Date.now() }].slice(-20) }
      })
    },
    [setValue],
  )

  const recordSentence = useCallback(
    (correct, total) => {
      setValue((current) => {
        const state = current || empty
        return {
          ...state,
          sentence: {
            attempted: (state.sentence?.attempted || 0) + total,
            correct: (state.sentence?.correct || 0) + correct,
          },
        }
      })
    },
    [setValue],
  )

  return { progress, recordSection, recordMock, recordSentence }
}
