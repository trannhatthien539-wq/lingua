import { useEffect, useMemo, useRef, useState } from 'react'
import useGrammarProgress from './useGrammarProgress'
import { grammarAllItems } from '../data/grammarIndex'
import {
  buildWidgetSummary,
  pushWidgetSummary,
  readCardStats,
  summarySignature,
  widgetStatsChangedEvent,
} from '../services/widgetBridge'

/**
 * Đẩy số liệu ra widget màn hình chính của APK (thẻ đến hạn, chuỗi ngày, chủ điểm ngữ pháp).
 *
 * Chạy một lần ở `App`:
 * - số liệu thẻ lấy từ bản đệm do `VocabularyHub` ghi khi tải thư viện (không gọi thêm mạng);
 * - chủ điểm ngữ pháp lấy từ tiến độ ngữ pháp (bài chưa đạt đầu tiên);
 * - chuỗi ngày lấy từ state `streak` của App.
 */
export default function useWidgetSummary({ streak }) {
  const { progress } = useGrammarProgress()
  const [statsVersion, setStatsVersion] = useState(0)
  const lastSignature = useRef('')

  useEffect(() => {
    const bump = () => setStatsVersion((value) => value + 1)
    window.addEventListener(widgetStatsChangedEvent, bump)
    return () => window.removeEventListener(widgetStatsChangedEvent, bump)
  }, [])

  const nextLesson = useMemo(() => {
    const completed = progress?.completed || {}
    return grammarAllItems.find((item) => !completed[item.id]?.passed) || null
  }, [progress])

  const streakDays = Number(streak?.currentStreak) || 0

  useEffect(() => {
    const summary = buildWidgetSummary({
      cardStats: readCardStats(),
      grammarTitle: nextLesson?.title || '',
      streak: streakDays,
    })
    const signature = summarySignature(summary)
    if (signature === lastSignature.current) return
    lastSignature.current = signature
    void pushWidgetSummary(summary)
  }, [nextLesson?.id, nextLesson?.title, streakDays, statsVersion])
}
