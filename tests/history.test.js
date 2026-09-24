import test from "node:test";
import assert from "node:assert/strict";
import { MAX_DAYS, historySummary, pruneDays, recentHistory } from "../src/utils/history.js";

const day = (reviewed, correct = 0, sessions = 0) => ({ reviewed, correct, sessions });

test("pruneDays giữ tối đa MAX_DAYS ngày, mới nhất trước", () => {
  const allDays = {};
  for (let index = 0; index < 5; index += 1) allDays[`2026-09-0${index + 1}`] = day(index + 1);
  const pruned = pruneDays(allDays, 2);
  assert.deepEqual(Object.keys(pruned), ["2026-09-05", "2026-09-04"]);
  assert.equal(MAX_DAYS, 400);
});

test("pruneDays không đổi dữ liệu khi ít hơn giới hạn", () => {
  const allDays = { "2026-09-23": day(10, 8, 1) };
  assert.deepEqual(pruneDays(allDays), allDays);
});

test("recentHistory trả về đúng số ngày, theo thứ tự cũ -> mới, kết thúc ở hôm nay", () => {
  const today = new Date(2026, 8, 23);
  const rows = recentHistory(3, { "2026-09-22": day(4, 3, 1) }, today);
  assert.deepEqual(rows.map((row) => row.date), ["2026-09-21", "2026-09-22", "2026-09-23"]);
  assert.deepEqual(rows.map((row) => row.label), ["21/9", "22/9", "23/9"]);
  assert.equal(rows[1].reviewed, 4);
  assert.equal(rows[0].reviewed, 0);
});

test("recentHistory trả về ngày rỗng khi chưa học ngày nào", () => {
  const empty = day(0, 0, 0);
  const rows = recentHistory(2, {}, new Date(2026, 8, 23));
  assert.deepEqual(rows, [
    { ...empty, date: "2026-09-22", label: "22/9" },
    { ...empty, date: "2026-09-23", label: "23/9" },
  ]);
});

test("historySummary cộng đúng lượt ôn, số đúng, ngày có học và độ chính xác", () => {
  const allDays = {
    "2026-09-22": day(10, 7, 1),
    "2026-09-23": day(10, 9, 2),
    "2026-08-30": day(50, 0, 1),
  };
  const summary = historySummary(7, allDays, new Date(2026, 8, 23));
  assert.deepEqual(summary, { reviewed: 20, correct: 16, activeDays: 2, accuracy: 80 });
});

test("historySummary không chia cho 0 khi chưa có lượt ôn nào", () => {
  const summary = historySummary(7, {}, new Date(2026, 8, 23));
  assert.deepEqual(summary, { reviewed: 0, correct: 0, activeDays: 0, accuracy: 0 });
});
