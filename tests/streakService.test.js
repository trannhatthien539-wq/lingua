import test from 'node:test'
import assert from 'node:assert/strict'
import { calculateNextStreak } from '../src/services/streakService.js'

test('lần đầu học đặt streak = 1 và giữ 1 khiên bảo vệ', () => {
  const result = calculateNextStreak({}, '2026-10-15', '2026-10-14', '2026-10-13')
  assert.equal(result.currentStreak, 1)
  assert.equal(result.lastActiveDate, '2026-10-15')
  assert.equal(result.totalSessions, 1)
  assert.equal(result.streakFreezes, 1)
  assert.equal(result.freezeUsedToday, false)
})

test('học nhiều lần trong cùng một ngày giữ nguyên chuỗi', () => {
  const initial = { currentStreak: 5, lastActiveDate: '2026-10-15', totalSessions: 10, streakFreezes: 1 }
  const result = calculateNextStreak(initial, '2026-10-15', '2026-10-14', '2026-10-13')
  assert.equal(result.currentStreak, 5)
  assert.equal(result.totalSessions, 10)
  assert.equal(result.freezeUsedToday, false)
})

test('học liên tiếp ngày hôm sau tăng chuỗi thêm 1', () => {
  const initial = { currentStreak: 5, lastActiveDate: '2026-10-14', totalSessions: 10, streakFreezes: 1 }
  const result = calculateNextStreak(initial, '2026-10-15', '2026-10-14', '2026-10-13')
  assert.equal(result.currentStreak, 6)
  assert.equal(result.lastActiveDate, '2026-10-15')
  assert.equal(result.totalSessions, 11)
})

test('đạt mốc 7 ngày chuỗi thưởng thêm 1 khiên bảo vệ', () => {
  const initial = { currentStreak: 6, lastActiveDate: '2026-10-14', totalSessions: 6, streakFreezes: 1 }
  const result = calculateNextStreak(initial, '2026-10-15', '2026-10-14', '2026-10-13')
  assert.equal(result.currentStreak, 7)
  assert.equal(result.streakFreezes, 2)
})

test('bỏ lỡ 1 ngày nhưng còn khiên thì kích hoạt khiên và bảo vệ chuỗi', () => {
  // Lần học cuối là 2 ngày trước (2026-10-13), bỏ lỡ ngày 2026-10-14
  const initial = { currentStreak: 12, lastActiveDate: '2026-10-13', totalSessions: 20, streakFreezes: 1 }
  const result = calculateNextStreak(initial, '2026-10-15', '2026-10-14', '2026-10-13')
  assert.equal(result.currentStreak, 13)
  assert.equal(result.streakFreezes, 0)
  assert.equal(result.freezeUsedToday, true)
  assert.equal(result.lastFreezeUsed, '2026-10-14')
})

test('bỏ lỡ 1 ngày nhưng hết khiên thì reset chuỗi về 1', () => {
  const initial = { currentStreak: 12, lastActiveDate: '2026-10-13', totalSessions: 20, streakFreezes: 0 }
  const result = calculateNextStreak(initial, '2026-10-15', '2026-10-14', '2026-10-13')
  assert.equal(result.currentStreak, 1)
  assert.equal(result.freezeUsedToday, false)
})

test('bỏ lỡ từ 2 ngày trở lên thì reset chuỗi về 1', () => {
  // Lần học cuối là 3 ngày trước (2026-10-12)
  const initial = { currentStreak: 20, lastActiveDate: '2026-10-12', totalSessions: 30, streakFreezes: 2 }
  const result = calculateNextStreak(initial, '2026-10-15', '2026-10-14', '2026-10-13')
  assert.equal(result.currentStreak, 1)
})

