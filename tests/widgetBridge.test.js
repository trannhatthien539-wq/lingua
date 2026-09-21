import test from 'node:test'
import assert from 'node:assert/strict'
import { addDaysKey, dateKey, LEECH_LAPSES } from '../src/utils/srs.js'
import { buildWidgetSummary, summarizeCards, summarySignature } from '../src/services/widgetBridge.js'

const card = (overrides = {}) => ({
  id: overrides.id || 'card-1',
  status: 'learning',
  nextReviewDate: dateKey(),
  lapses: 0,
  ...overrides,
})

test('summarizeCards đếm thẻ đến hạn, thẻ mới và từ hay quên', () => {
  const today = dateKey()
  const stats = summarizeCards([
    card({ id: 'a', nextReviewDate: today }),
    card({ id: 'b', nextReviewDate: addDaysKey(3) }),
    card({ id: 'c', status: 'new' }),
    card({ id: 'd', lapses: LEECH_LAPSES }),
    card({ id: 'e', deletedAt: '2026-01-01T00:00:00.000Z' }),
  ])
  assert.equal(stats.total, 4)
  // "a" đến hạn hôm nay + "c" thẻ mới (isDue coi thẻ mới là đến hạn) + "d" đến hạn hôm nay.
  assert.equal(stats.due, 3)
  assert.equal(stats.fresh, 1)
  assert.equal(stats.leech, 1)
})

test('summarizeCards chịu được dữ liệu rỗng hoặc sai kiểu', () => {
  assert.equal(summarizeCards().total, 0)
  assert.equal(summarizeCards(null).due, 0)
  assert.equal(summarizeCards([null, undefined]).total, 0)
})

test('buildWidgetSummary soạn nội dung tiếng Việt cho widget', () => {
  const now = new Date(2026, 8, 20, 22, 5)
  const summary = buildWidgetSummary({
    cardStats: { due: 12, fresh: 4, leech: 3 },
    grammarTitle: 'Mệnh đề quan hệ',
    streak: 5,
    now,
  })
  assert.equal(summary.title, 'Hôm nay học gì?')
  assert.equal(summary.primary, 'Ôn 12 thẻ hôm nay')
  assert.equal(summary.secondary, 'Ngữ pháp: Mệnh đề quan hệ')
  assert.equal(summary.tertiary, 'Chuỗi 5 ngày · 3 từ hay quên')
  assert.equal(summary.footer, 'Cập nhật 22:05 20/09')
})

test('buildWidgetSummary hiện tiến độ mục tiêu ngày khi đã có mục tiêu', () => {
  const now = new Date(2026, 8, 20, 22, 5)
  const summary = buildWidgetSummary({
    cardStats: { due: 12, fresh: 4, leech: 0 },
    grammarTitle: 'Mệnh đề quan hệ',
    streak: 5,
    goalTarget: 20,
    reviewedToday: 8,
    mistakes: 3,
    now,
  })
  assert.equal(summary.tertiary, 'Chuỗi 5 ngày · Mục tiêu 8/20 thẻ')
  assert.equal(summary.progressMax, 20)
  assert.equal(summary.progressValue, 8)
  assert.equal(summary.goalTarget, 20)
  assert.equal(summary.reviewedToday, 8)
  assert.equal(summary.footer, '3 câu sai · Cập nhật 22:05 20/09')
  // Vượt mục tiêu thì thanh tiến độ không vượt quá 100%.
  const done = buildWidgetSummary({ cardStats: { due: 1 }, goalTarget: 20, reviewedToday: 31, now })
  assert.equal(done.progressValue, 20)
})

test('buildWidgetSummary gợi ý học thẻ mới khi không còn thẻ đến hạn nhưng còn thẻ mới', () => {
  const summary = buildWidgetSummary({ cardStats: { due: 0, fresh: 700 }, streak: 2, now: new Date(2026, 8, 20, 9, 0) })
  assert.equal(summary.primary, 'Học 50 thẻ mới')
  assert.equal(summary.tertiary, 'Chuỗi 2 ngày')
})

test('buildWidgetSummary dùng số bài ngữ pháp thật khi không còn bài nào chưa đạt', () => {
  const summary = buildWidgetSummary({ cardStats: { due: 0, fresh: 0 }, grammarTitle: '', grammarTotal: 30, now: new Date(2026, 8, 20, 9, 0) })
  assert.equal(summary.secondary, 'Ngữ pháp: xong 30 bài')
})

test('buildWidgetSummary giới hạn số thẻ hiển thị và ghi tổng ở dòng ghi chú', () => {
  const summary = buildWidgetSummary({
    cardStats: { due: 1000, leech: 0 },
    grammarTitle: 'Hiện tại đơn',
    streak: 1,
    now: new Date(2026, 8, 20, 23, 59),
  })
  assert.equal(summary.primary, 'Ôn 50 thẻ hôm nay')
  assert.equal(summary.tertiary, 'Chuỗi 1 ngày')
  assert.equal(summary.footer, '1000 thẻ đến hạn · Cập nhật 23:59 20/09')
  assert.equal(summary.session, 50)
  assert.equal(summary.due, 1000)
})

test('buildWidgetSummary đổi câu chữ khi không còn thẻ đến hạn hoặc chưa học bài nào', () => {
  const summary = buildWidgetSummary({ cardStats: { due: 0, leech: 0 }, grammarTitle: '', streak: 0, now: new Date(2026, 0, 2, 8, 0) })
  assert.equal(summary.primary, 'Không còn thẻ đến hạn 🎉')
  assert.equal(summary.secondary, 'Ngữ pháp: mở app để xem bài tiếp theo')
  assert.equal(summary.tertiary, 'Bắt đầu chuỗi học hôm nay')
  assert.equal(summary.footer, 'Cập nhật 08:00 02/01')
})

test('summarySignature đổi khi nội dung đổi (để tránh đẩy trùng)', () => {
  const first = buildWidgetSummary({ cardStats: { due: 1 }, streak: 1, now: new Date(2026, 0, 1, 8, 0) })
  const second = buildWidgetSummary({ cardStats: { due: 2 }, streak: 1, now: new Date(2026, 0, 1, 8, 0) })
  const third = buildWidgetSummary({ cardStats: { due: 1 }, streak: 1, goalTarget: 10, reviewedToday: 4, now: new Date(2026, 0, 1, 8, 0) })
  assert.equal(summarySignature(first), summarySignature(first))
  assert.notEqual(summarySignature(first), summarySignature(second))
  assert.notEqual(summarySignature(first), summarySignature(third), 'tiến độ mục tiêu cũng phải làm chữ ký đổi')
})
