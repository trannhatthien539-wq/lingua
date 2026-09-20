import { useCallback, useMemo } from 'react'
import useCloudDoc from './useCloudDoc'
import { userDocKeys } from '../services/userDocService'

/**
 * Sổ câu sai dùng chung cho Nghe, Đọc và VSTEP (Ngữ pháp có sổ riêng trong `useGrammarProgress`).
 *
 * Mỗi câu sai được lưu kèm đủ dữ liệu để làm lại: đề bài, lựa chọn, đáp án, giải thích.
 * Lưu theo tài khoản qua `user_state` key `mistakes`.
 */
const emptyBank = { items: {}, attempts: [] }
const MAX_ITEMS = 150
const MAX_ATTEMPTS = 40

export const MISTAKE_SOURCE_LABELS = {
  listening: 'Nghe',
  reading: 'Đọc',
  vstep: 'VSTEP',
  mock: 'Thi thử',
}

const trim = (value, max = 220) => {
  const text = String(value ?? '')
  return text.length > max ? `${text.slice(0, max - 1)}…` : text
}

const optionText = (option) => (typeof option === 'string' ? option : option?.text ?? option?.label ?? '')

const normalize = (payload, current) => {
  const base = current || emptyBank
  if (!payload || typeof payload !== 'object') return base
  return {
    items: payload.items && typeof payload.items === 'object' ? payload.items : {},
    attempts: Array.isArray(payload.attempts) ? payload.attempts.slice(-MAX_ATTEMPTS) : [],
  }
}

/** Rút gọn một câu hỏi thành bản ghi nhỏ gọn nhưng vẫn làm lại được. */
export const toMistakeItem = ({ detail, source, refId, label = '' }) => {
  const question = detail?.question || {}
  const options = Array.isArray(question.options) ? question.options.slice(0, 6).map((option) => trim(optionText(option), 150)) : []
  const answers = Array.isArray(question.answers) ? question.answers.slice(0, 3).map((answer) => trim(answer, 80)) : []
  // Ưu tiên khoá đã có (khi luyện lại sổ câu sai) để không tạo bản ghi trùng.
  const key =
    detail?.key ||
    question.mistakeKey ||
    (question.id ? `${source}:${question.id}` : `${source}:${refId || 'x'}:${detail?.id ?? Math.random().toString(36).slice(2, 7)}`)
  return {
    key,
    source: detail?.source || question.source || source,
    label: label || detail?.label || question.label || MISTAKE_SOURCE_LABELS[source] || source,
    refId: refId || null,
    type: question.type === 'choice' ? 'choice' : 'fill',
    prompt: trim(question.prompt, 400),
    options,
    answer: question.type === 'choice' ? trim(question.answer, 150) : '',
    answers: question.type === 'choice' ? [] : answers,
    explain: trim(question.explain, 400),
    response: trim(detail?.response, 150),
  }
}

/** Lấy danh sách bản ghi sau khi cập nhật với một lượt làm bài. */
export const mergeMistakes = (current = {}, records = []) => {
  const items = { ...current }
  records.forEach(({ detail, ...rest }) => {
    const entry = toMistakeItem({ detail, ...rest })
    const previous = items[entry.key]
    if (detail?.correct) {
      delete items[entry.key]
      return
    }
    items[entry.key] = { ...entry, count: (previous?.count || 0) + 1, at: Date.now() }
  })
  return Object.fromEntries(
    Object.entries(items)
      .sort(([, first], [, second]) => (second.count || 0) - (first.count || 0))
      .slice(0, MAX_ITEMS),
  )
}

export default function useMistakeBank() {
  const { value, setValue, ready } = useCloudDoc(userDocKeys.mistakes, { initial: emptyBank, normalize })
  const bank = value || emptyBank

  /** Ghi một lượt làm bài: `details` là mảng `{ id, question, response, correct }`. */
  const record = useCallback(
    (details = [], source = 'reading', refId = null, label = '') => {
      const records = details
        .filter((detail) => detail?.question)
        .map((detail) => ({
          detail,
          source: detail.source || detail.question?.source || source,
          refId: detail.refId || detail.question?.refId || refId,
          label: detail.label || detail.question?.label || label,
        }))
      if (!records.length) return
      setValue((current) => ({ ...(current || emptyBank), items: mergeMistakes((current || emptyBank).items, records) }))
    },
    [setValue],
  )

  const remove = useCallback(
    (key) => {
      setValue((current) => {
        const items = { ...((current || emptyBank).items || {}) }
        delete items[key]
        return { ...(current || emptyBank), items }
      })
    },
    [setValue],
  )

  const clear = useCallback(() => {
    setValue((current) => ({ ...(current || emptyBank), items: {} }))
  }, [setValue])

  /** Lưu kết quả một lượt luyện lại sổ câu sai. */
  const recordRetry = useCallback(
    (correct, total) => {
      setValue((current) => {
        const state = current || emptyBank
        const percent = total ? Math.round((correct / total) * 100) : 0
        return {
          ...state,
          attempts: [...(state.attempts || []), { at: Date.now(), source: 'mistake-bank', correct, total, percent }].slice(-MAX_ATTEMPTS),
        }
      })
    },
    [setValue],
  )

  const mistakes = useMemo(
    () => Object.values(bank.items || {}).sort((first, second) => (second.count || 0) - (first.count || 0)),
    [bank],
  )

  const stats = useMemo(() => {
    const bySource = {}
    mistakes.forEach((item) => {
      bySource[item.source] = (bySource[item.source] || 0) + 1
    })
    const attempts = bank.attempts || []
    const lastAttempt = attempts[attempts.length - 1] || null
    return { total: mistakes.length, bySource, retryCount: attempts.length, lastAttempt }
  }, [mistakes, bank])

  return { mistakes, stats, ready, record, remove, clear, recordRetry }
}
