import { isCapacitor } from './platform.js'
import { isDue, isLeech } from '../utils/srs.js'

/**
 * Cầu nối tới widget màn hình chính của APK (`LinguaWidget` – plugin native cục bộ).
 *
 * Web không có widget: mọi hàm ở đây vẫn chạy bình thường, chỉ ghi bản tóm tắt vào
 * localStorage (để Cài đặt xem trước nội dung) và bỏ qua phần native.
 */
const STATS_KEY = 'lingua-widget-card-stats'
const SUMMARY_KEY = 'lingua-widget-summary'
const PLUGIN_NAME = 'LinguaWidget'

/** Bắn ra mỗi khi số liệu thẻ thay đổi, để hook trong App đẩy lại widget. */
export const widgetStatsChangedEvent = 'lingua:widget-stats'

const readJson = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

const writeJson = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* localStorage đầy hoặc bị chặn */
  }
}

/**
 * Đếm số liệu thẻ cho widget.
 * - `due`: thẻ đến hạn hôm nay (gồm cả thẻ mới chưa học) — khớp bộ lọc “Cần ôn hôm nay”.
 * - `fresh`: thẻ còn ở trạng thái mới.
 * - `leech`: từ đã quên ≥ 4 lần.
 */
export const summarizeCards = (cards = []) => {
  const list = Array.isArray(cards) ? cards.filter((card) => card && !card.deletedAt) : []
  return {
    total: list.length,
    due: list.filter((card) => isDue(card)).length,
    fresh: list.filter((card) => !card.status || card.status === 'new').length,
    leech: list.filter((card) => isLeech(card)).length,
    at: Date.now(),
  }
}

export const readCardStats = () => readJson(STATS_KEY, { total: 0, due: 0, fresh: 0, leech: 0, at: 0 })

/** Lưu số liệu thẻ (gọi từ VocabularyHub khi thư viện thay đổi) và thông báo cho hook. */
export const publishCardStats = (cards = []) => {
  const stats = summarizeCards(cards)
  writeJson(STATS_KEY, stats)
  try {
    window.dispatchEvent(new CustomEvent(widgetStatsChangedEvent, { detail: stats }))
  } catch {
    /* môi trường không có window */
  }
  return stats
}

const pad = (value) => String(value).padStart(2, '0')

/** Số thẻ tối đa của một phiên học (khớp `SESSION_LIMIT` trong VocabularyHub). */
export const WIDGET_SESSION_LIMIT = 50

/**
 * Nội dung widget. Text được soạn ở JS (tiếng Việt) để code native giữ đơn giản.
 * Số thẻ hiển thị tối đa bằng `WIDGET_SESSION_LIMIT` cho đỡ ngợp; tổng số thẻ đến hạn
 * được ghi ở dòng ghi chú khi thư viện còn nhiều thẻ.
 * `now` truyền vào để test được.
 */
export const buildWidgetSummary = ({ cardStats = null, grammarTitle = '', streak = 0, now = new Date() } = {}) => {
  const stats = cardStats || readCardStats()
  const due = Number(stats?.due) || 0
  const leech = Number(stats?.leech) || 0
  const days = Number(streak) || 0
  const session = Math.min(due, WIDGET_SESSION_LIMIT)

  const notes = [days > 0 ? `Chuỗi ${days} ngày` : 'Bắt đầu chuỗi học hôm nay']
  if (due > WIDGET_SESSION_LIMIT) notes.push(`${due} thẻ đến hạn`)
  else if (leech > 0) notes.push(`${leech} từ hay quên`)

  return {
    title: 'Hôm nay học gì?',
    primary: due > 0 ? `Ôn ${session} thẻ hôm nay` : 'Không còn thẻ đến hạn 🎉',
    secondary: grammarTitle ? `Ngữ pháp: ${grammarTitle}` : 'Ngữ pháp: đã học hết 30 bài',
    tertiary: notes.join(' · '),
    footer: `Cập nhật ${pad(now.getHours())}:${pad(now.getMinutes())} ${pad(now.getDate())}/${pad(now.getMonth() + 1)}`,
    due,
    leech,
    session,
    streak: days,
  }
}

/** Chữ ký để tránh đẩy dữ liệu trùng lên widget. */
export const summarySignature = (summary = {}) =>
  [summary.title, summary.primary, summary.secondary, summary.tertiary, summary.footer].join('|')

export const widgetNativeAvailable = () => {
  if (!isCapacitor()) return false
  // Chỉ có khi APK được build kèm plugin cục bộ (xem .github/workflows/build-apk.yml).
  return window.Capacitor?.isPluginAvailable?.('LinguaWidget') ?? true
}

let pluginPromise = null
const getPlugin = async () => {
  if (!widgetNativeAvailable()) return null
  if (!pluginPromise) {
    pluginPromise = import('@capacitor/core')
      .then(({ registerPlugin }) => registerPlugin(PLUGIN_NAME))
      .catch(() => null)
  }
  return pluginPromise
}

/** Gửi nội dung ra widget (native) và lưu bản tóm tắt để xem trước trên web. */
export const pushWidgetSummary = async (summary) => {
  writeJson(SUMMARY_KEY, summary)
  const plugin = await getPlugin()
  if (!plugin) return false
  try {
    await plugin.save({
      title: summary.title,
      primary: summary.primary,
      secondary: summary.secondary,
      tertiary: summary.tertiary,
      footer: summary.footer,
    })
    return true
  } catch (error) {
    console.warn('Lingua: không cập nhật được widget.', error)
    return false
  }
}

export const readWidgetSummary = () => readJson(SUMMARY_KEY, null)
