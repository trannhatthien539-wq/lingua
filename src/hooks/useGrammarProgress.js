import { useCallback, useMemo } from 'react'
import useCloudDoc from './useCloudDoc'
import { userDocKeys } from '../services/userDocService'
import { PASS_RATIO } from '../data/grammarCurriculum'
import { grammarAllItems, grammarQuestionById } from '../data/grammarIndex'

const emptyProgress = { completed: {}, lastLesson: null, mistakes: {}, attempts: [] }
const MAX_MISTAKES = 200
const MAX_ATTEMPTS = 30

const normalize = (payload, current) => {
  const base = current || emptyProgress
  if (!payload || typeof payload !== 'object') return base
  return {
    completed: payload.completed && typeof payload.completed === 'object' ? payload.completed : {},
    lastLesson: typeof payload.lastLesson === 'string' && payload.lastLesson ? payload.lastLesson : base.lastLesson,
    mistakes: payload.mistakes && typeof payload.mistakes === 'object' ? payload.mistakes : {},
    attempts: Array.isArray(payload.attempts) ? payload.attempts.slice(-MAX_ATTEMPTS) : [],
  }
}

/** Rút gọn một câu hỏi để lưu vào sổ câu sai (không lưu cả mảng options dài dòng). */
const mistakeEntry = (detail, previous) => {
  const question = detail.question || {}
  return {
    questionId: question.id,
    lessonId: question.lessonId || null,
    lessonTitle: question.lessonTitle || '',
    prompt: question.prompt || '',
    type: question.type || 'fill',
    answer: question.type === 'choice' ? question.answer : (question.answers || [])[0] || '',
    explain: question.explain || '',
    response: String(detail.response || ''),
    count: (previous?.count || 0) + 1,
    at: Date.now(),
  }
}

const mergeMistakes = (current = {}, details = []) => {
  const mistakes = { ...current }
  details.forEach((detail) => {
    const questionId = detail?.question?.id
    if (!questionId) return
    // Câu đúng lại thì xoá khỏi sổ, câu sai thì tăng số lần sai.
    if (detail.correct) delete mistakes[questionId]
    else mistakes[questionId] = mistakeEntry(detail, mistakes[questionId])
  })
  return Object.fromEntries(
    Object.entries(mistakes)
      .sort(([, first], [, second]) => (second.count || 0) - (first.count || 0))
      .slice(0, MAX_MISTAKES),
  )
}

/**
 * Tiến độ học ngữ pháp: bài đã đạt (≥ 80%), sổ câu sai và lịch sử làm bài.
 * Lưu theo tài khoản qua `user_state` key `grammar`.
 */
export default function useGrammarProgress() {
  const { value, setValue, ready } = useCloudDoc(userDocKeys.grammar, { initial: emptyProgress, normalize })
  const progress = value || emptyProgress

  const completedCount = useMemo(
    () => grammarAllItems.filter((lesson) => progress.completed?.[lesson.id]?.passed).length,
    [progress],
  )

  const setLastLesson = useCallback(
    (lessonId) => {
      setValue((current) => ({ ...(current || emptyProgress), lastLesson: lessonId }))
    },
    [setValue],
  )

  /**
   * Ghi kết quả một lượt làm bài của một bài học.
   * `details` (tuỳ chọn) là mảng `{ question, response, correct }` để cập nhật sổ câu sai.
   */
  const recordResult = useCallback(
    (lessonId, correct, total, details = []) => {
      const passed = total > 0 && correct / total >= PASS_RATIO
      setValue((current) => {
        const state = current || emptyProgress
        const previous = state.completed?.[lessonId]
        const best = previous ? Math.max(previous.best || 0, correct) : correct
        return {
          ...state,
          lastLesson: lessonId,
          mistakes: mergeMistakes(state.mistakes, details),
          attempts: [
            ...(state.attempts || []),
            { at: Date.now(), source: 'lesson', lessonId, correct, total, percent: total ? Math.round((correct / total) * 100) : 0 },
          ].slice(-MAX_ATTEMPTS),
          completed: !passed && !previous
            ? state.completed
            : {
                ...state.completed,
                [lessonId]: { best, total, passed: Boolean(passed || previous?.passed), at: Date.now() },
              },
        }
      })
    },
    [setValue],
  )

  /** Ghi kết quả bài thi tổng hợp (không gắn với một bài học cụ thể). */
  const recordExam = useCallback(
    (correct, total, details = []) => {
      const percent = total ? Math.round((correct / total) * 100) : 0
      setValue((current) => {
        const state = current || emptyProgress
        return {
          ...state,
          mistakes: mergeMistakes(state.mistakes, details),
          attempts: [...(state.attempts || []), { at: Date.now(), source: 'exam', correct, total, percent }].slice(-MAX_ATTEMPTS),
        }
      })
    },
    [setValue],
  )

  const recordMistakes = useCallback(
    (details = []) => setValue((current) => ({ ...(current || emptyProgress), mistakes: mergeMistakes((current || emptyProgress).mistakes, details) })),
    [setValue],
  )

  const removeMistake = useCallback(
    (questionId) => {
      setValue((current) => {
        const state = current || emptyProgress
        const mistakes = { ...state.mistakes }
        delete mistakes[questionId]
        return { ...state, mistakes }
      })
    },
    [setValue],
  )

  const clearMistakes = useCallback(
    () => setValue((current) => ({ ...(current || emptyProgress), mistakes: {} })),
    [setValue],
  )

  /** Danh sách câu sai kèm dữ liệu câu hỏi đầy đủ, sắp theo số lần sai. */
  const mistakes = useMemo(
    () =>
      Object.values(progress.mistakes || {})
        .map((entry) => ({ ...entry, question: grammarQuestionById(entry.questionId) }))
        .filter((entry) => entry.question)
        .sort((first, second) => (second.count || 0) - (first.count || 0) || (second.at || 0) - (first.at || 0)),
    [progress.mistakes],
  )

  const examHistory = useMemo(
    () => (progress.attempts || []).filter((item) => item.source === 'exam'),
    [progress.attempts],
  )

  return {
    progress,
    ready,
    total: grammarAllItems.length,
    completedCount,
    mistakes,
    attempts: progress.attempts || [],
    examHistory,
    setLastLesson,
    recordResult,
    recordExam,
    recordMistakes,
    removeMistake,
    clearMistakes,
  }
}
