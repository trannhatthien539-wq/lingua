import test from 'node:test'
import assert from 'node:assert/strict'
import {
  defaultReminder,
  describeNextReminder,
  formatTime,
  isReminderDue,
  nextReminderAt,
  normalizeReminder,
  normalizeTime,
  reminderBody,
  todayKey,
} from '../src/utils/reminderSchedule.js'

test('normalizeTime chấp nhận "HH:mm" và trả null với giá trị rỗng (hộp chọn giờ bị huỷ)', () => {
  assert.equal(normalizeTime('21:30'), '21:30')
  assert.equal(normalizeTime('7:05'), '07:05')
  assert.equal(normalizeTime(''), null)
  assert.equal(normalizeTime('   '), null)
  assert.equal(normalizeTime(null), null)
  assert.equal(normalizeTime(undefined), null)
  assert.equal(normalizeTime('24:00'), null)
  assert.equal(normalizeTime('20:75'), null)
  assert.equal(normalizeTime('tối'), null)
})

test('normalizeReminder giữ giờ đã lưu và không làm mất enabled khi payload thiếu', () => {
  assert.deepEqual(normalizeReminder({ enabled: true, time: '21:30' }), {
    enabled: true,
    time: '21:30',
    lastNotifiedDate: null,
  })
  // Giờ rỗng/hỏng (lỗi từng làm ô Giờ nhắc nhảy về 20:00) phải rơi về giờ mặc định.
  assert.equal(normalizeReminder({ enabled: true, time: '' }).time, defaultReminder.time)
  assert.equal(normalizeReminder({ time: '99:99' }).time, defaultReminder.time)
  // Payload rỗng hoàn toàn = chưa từng cấu hình.
  assert.deepEqual(normalizeReminder(null), defaultReminder)
  assert.deepEqual(normalizeReminder({}), defaultReminder)
})

test('formatTime luôn trả về giờ hợp lệ', () => {
  assert.equal(formatTime('6:00'), '06:00')
  assert.equal(formatTime(''), '20:00')
})

test('isReminderDue chỉ tới hạn khi đã bật, tới giờ và hôm nay chưa nhắc', () => {
  const now = new Date(2026, 8, 21, 21, 0)
  assert.equal(isReminderDue({ enabled: true, time: '20:00', lastNotifiedDate: null }, now), true)
  assert.equal(isReminderDue({ enabled: false, time: '20:00', lastNotifiedDate: null }, now), false)
  assert.equal(isReminderDue({ enabled: true, time: '22:00', lastNotifiedDate: null }, now), false)
  assert.equal(
    isReminderDue({ enabled: true, time: '20:00', lastNotifiedDate: todayKey(now) }, now),
    false,
    'đã nhắc hôm nay thì không nhắc lại',
  )
  assert.equal(isReminderDue({ enabled: true, time: '20:00', lastNotifiedDate: '2026-09-20' }, now), true)
})

test('nextReminderAt: hôm nay nếu chưa tới giờ, mai nếu đã nhắc hoặc đã qua giờ', () => {
  const morning = new Date(2026, 8, 21, 8, 0)
  const tonight = nextReminderAt({ enabled: true, time: '20:00', lastNotifiedDate: null }, morning)
  assert.equal(tonight.getDate(), 21)
  assert.equal(describeNextReminder({ enabled: true, time: '20:00', lastNotifiedDate: null }, morning), 'hôm nay lúc 20:00')

  const afternoon = new Date(2026, 8, 21, 15, 0)
  assert.equal(describeNextReminder({ enabled: true, time: '20:00', lastNotifiedDate: null }, afternoon), 'hôm nay lúc 20:00')

  const afterTime = new Date(2026, 8, 21, 21, 30)
  assert.equal(
    describeNextReminder({ enabled: true, time: '20:00', lastNotifiedDate: null }, afterTime),
    'trong ít phút tới',
    'đã qua giờ mà hôm nay chưa nhắc thì sẽ nhắc ngay',
  )
  // Đã nhắc hôm nay rồi thì lần kế tiếp là mai.
  assert.equal(
    describeNextReminder({ enabled: true, time: '20:00', lastNotifiedDate: todayKey(afterTime) }, afterTime),
    'mai lúc 20:00',
  )

  const alreadyNotified = new Date(2026, 8, 21, 20, 5)
  assert.equal(
    describeNextReminder({ enabled: true, time: '20:00', lastNotifiedDate: todayKey(alreadyNotified) }, alreadyNotified),
    'mai lúc 20:00',
  )

  assert.equal(nextReminderAt({ enabled: false, time: '20:00' }, morning), null)
  assert.equal(describeNextReminder({ enabled: false, time: '20:00' }, morning), '')
})

test('reminderBody nhắc tới chuỗi ngày học khi đã có', () => {
  assert.match(reminderBody({ currentStreak: 7 }), /7 ngày/)
  assert.match(reminderBody({ currentStreak: 0 }), /bắt đầu chuỗi/)
  assert.match(reminderBody(null), /bắt đầu chuỗi/)
})
