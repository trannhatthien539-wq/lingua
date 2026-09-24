import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import useGrammarProgress from './useGrammarProgress'
import useDailyGoal from './useDailyGoal'
import { grammarAllItems } from '../data/grammarIndex'
import { dataService } from '../services/dataService'
import { dayKeyOf } from '../utils/day'
import { getHistoryDays, historyChangedEvent, loadHistory } from '../services/historyService'
import { isCapacitor } from '../services/platform'
import { readCachedUserDoc, userDocKeys } from '../services/userDocService'
import {
  buildWidgetSummary,
  publishCardStats,
  pushWidgetSummary,
  readCardStats,
  summarySignature,
  widgetStatsChangedEvent,
} from '../services/widgetBridge'

/** Số liệu thẻ cũ hơn mức này thì tính lại từ dữ liệu thật (30 phút). */
const STATS_STALE_MS = 30 * 60 * 1000

/** Số câu sai đang có trong sổ câu sai (đọc nhanh bản trên thiết bị, không gọi mạng). */
const mistakesCount = () => {
  const payload = readCachedUserDoc(userDocKeys.mistakes)
  const items = payload?.items
  return items && typeof items === 'object' ? Object.keys(items).length : 0
}

/**
 * Đẩy số liệu ra widget màn hình chính của APK (thẻ đến hạn, chuỗi ngày, bài ngữ pháp, mục tiêu).
 *
 * Chạy một lần ở `App`:
 * - số liệu thẻ lấy từ bản đệm do `VocabularyHub` ghi; nếu bản đệm chưa có hoặc đã cũ (mới cài
 *   app, vừa học xong rồi thoát app) thì tự tính lại từ `dataService` — nhờ vậy widget không còn
 *   hiện "Không còn thẻ đến hạn" trong khi thư viện có cả nghìn thẻ;
 * - mục tiêu ngày lấy từ `useDailyGoal`, số thẻ đã ôn hôm nay từ `historyService`;
 * - chủ điểm ngữ pháp lấy từ tiến độ ngữ pháp (bài chưa đạt đầu tiên);
 * - chuỗi ngày lấy từ state `streak` của App.
 */
export default function useWidgetSummary({ streak, user }) {
  const { progress } = useGrammarProgress()
  const { target } = useDailyGoal()
  const [statsVersion, setStatsVersion] = useState(0)
  const [historyVersion, setHistoryVersion] = useState(0)
  const lastSignature = useRef('')

  const bump = useCallback(() => setStatsVersion((value) => value + 1), [])

  useEffect(() => {
    const bumpHistory = () => setHistoryVersion((value) => value + 1)
    window.addEventListener(widgetStatsChangedEvent, bump)
    window.addEventListener(historyChangedEvent, bumpHistory)
    return () => {
      window.removeEventListener(widgetStatsChangedEvent, bump)
      window.removeEventListener(historyChangedEvent, bumpHistory)
    }
  }, [bump])

  /**
   * Tính lại số liệu thẻ khi bản đệm trống/đã cũ. Chờ một nhịp sau khi mở app để không tranh
   * băng thông với trang Từ vựng và để Firebase kịp khôi phục phiên đăng nhập.
   */
  useEffect(() => {
    let cancelled = false
    const stats = readCardStats()
    const fresh = stats?.at && Date.now() - stats.at < STATS_STALE_MS && stats.total > 0
    if (fresh) return undefined
    const timer = window.setTimeout(async () => {
      try {
        const decks = await dataService.getDecks()
        const cards = (await Promise.all(decks.map((deck) => dataService.getCards(deck.id)))).flat()
        if (cancelled || !cards.length) return
        publishCardStats(cards)
      } catch (error) {
        console.warn('Lingua: chưa tính lại được số liệu thẻ cho widget.', error)
      }
    }, 1500)
    return () => {
      cancelled = true
      window.clearTimeout(timer)
    }
  }, [user?.uid])

  // Lịch sử học tập dùng cho tiến độ mục tiêu ngày (chỉ đọc bản đệm trong bộ nhớ).
  useEffect(() => {
    loadHistory()
      .then(() => setHistoryVersion((value) => value + 1))
      .catch(() => {})
  }, [user?.uid])

  // Quay lại app (hoặc quay lại tab) là đẩy lại số liệu: học xong rồi về là widget đổi ngay.
  useEffect(() => {
    const refresh = () => setStatsVersion((value) => value + 1)
    document.addEventListener('visibilitychange', refresh)
    let stopAppState = null
    if (isCapacitor()) {
      import('@capacitor/app')
        .then(({ App }) => App.addListener('appStateChange', ({ isActive }) => { if (isActive) refresh() }))
        .then((handle) => { stopAppState = handle })
        .catch(() => {})
    }
    return () => {
      document.removeEventListener('visibilitychange', refresh)
      try {
        stopAppState?.remove?.()
      } catch {
        /* bỏ qua */
      }
    }
  }, [])

  const nextLesson = useMemo(() => {
    const completed = progress?.completed || {}
    return grammarAllItems.find((item) => !completed[item.id]?.passed) || null
  }, [progress])

  const streakDays = Number(streak?.currentStreak) || 0

  useEffect(() => {
    const today = getHistoryDays()[dayKeyOf()] || null
    const summary = buildWidgetSummary({
      cardStats: readCardStats(),
      grammarTitle: nextLesson?.title || '',
      grammarTotal: grammarAllItems.length,
      streak: streakDays,
      goalTarget: target,
      reviewedToday: today?.reviewed || 0,
      mistakes: mistakesCount(),
    })
    const signature = summarySignature(summary)
    if (signature === lastSignature.current) return
    lastSignature.current = signature
    void pushWidgetSummary(summary)
  }, [nextLesson?.id, nextLesson?.title, streakDays, statsVersion, historyVersion, target])
}
