import { useCallback, useMemo } from 'react'
import useCloudDoc from './useCloudDoc'
import { userDocKeys } from '../services/userDocService'
import { PASS_RATIO, grammarLessons } from '../data/grammarCurriculum'

const emptyProgress = { completed: {}, lastLesson: null }

const normalize = (payload, current) => {
  const base = current || emptyProgress
  if (!payload || typeof payload !== 'object') return base
  const completed = payload.completed && typeof payload.completed === 'object' ? payload.completed : {}
  return {
    completed,
    lastLesson: typeof payload.lastLesson === 'string' && payload.lastLesson ? payload.lastLesson : base.lastLesson,
  }
}

/**
 * Tiến độ học ngữ pháp: mỗi bài đạt từ 80% bài kiểm tra cuối bài thì được tính là hoàn thành.
 * Lưu theo tài khoản qua `user_state` (kèm bản trên thiết bị nên dùng được khi ngoại tuyến).
 */
export default function useGrammarProgress() {
  const { value, setValue, ready } = useCloudDoc(userDocKeys.grammar, { initial: emptyProgress, normalize })
  const progress = value || emptyProgress

  const completedCount = useMemo(
    () => grammarLessons.filter((lesson) => progress.completed?.[lesson.id]?.passed).length,
    [progress],
  )

  const setLastLesson = useCallback(
    (lessonId) => {
      setValue((current) => ({ ...(current || emptyProgress), lastLesson: lessonId }))
    },
    [setValue],
  )

  const recordResult = useCallback(
    (lessonId, correct, total) => {
      const passed = total > 0 && correct / total >= PASS_RATIO
      setValue((current) => {
        const state = current || emptyProgress
        const previous = state.completed?.[lessonId]
        const best = previous ? Math.max(previous.best || 0, correct) : correct
        // Chỉ ghi lại khi đạt, hoặc khi đã từng có kết quả (để cập nhật điểm cao nhất).
        if (!passed && !previous) return { ...state, lastLesson: lessonId }
        return {
          ...state,
          lastLesson: lessonId,
          completed: {
            ...state.completed,
            [lessonId]: { best, total, passed: Boolean(passed || previous?.passed), at: Date.now() },
          },
        }
      })
    },
    [setValue],
  )

  return { progress, ready, completedCount, setLastLesson, recordResult }
}
