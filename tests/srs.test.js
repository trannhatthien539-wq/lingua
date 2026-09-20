import test from "node:test";
import assert from "node:assert/strict";
import { dateKey, addDaysKey, isDue, isLeech, previewIntervals, scheduleReview } from "../src/utils/srs.js";

test("thẻ mới: 3 mốc đánh giá giữ đúng 1/3/5 ngày", () => {
  const card = { status: "new", interval: 0, repetition: 0, lapses: 0, ease: 2.5 };
  assert.equal(scheduleReview(card, "again").interval, 1);
  assert.equal(scheduleReview(card, "soon").interval, 3);
  assert.equal(scheduleReview(card, "mastered").interval, 5);
});

test("previewIntervals trả về khoảng nghỉ của cả ba lựa chọn", () => {
  assert.deepEqual(previewIntervals({ interval: 0 }), { again: 1, soon: 3, mastered: 5 });
});

test("again: reset chuỗi, hạ ease và tăng số lần quên", () => {
  const next = scheduleReview({ interval: 20, repetition: 4, lapses: 1, ease: 2.5 }, "again");
  assert.equal(next.status, "learning");
  assert.equal(next.interval, 1);
  assert.equal(next.repetition, 0);
  assert.equal(next.lapses, 2);
  assert.equal(next.ease, 2.3);
  assert.equal(next.leech, false);
});

test("mastered: giãn lịch theo ease và tăng ease nhẹ", () => {
  const next = scheduleReview({ interval: 10, repetition: 2, lapses: 0, ease: 2.5 }, "mastered");
  assert.equal(next.status, "mastered");
  assert.equal(next.interval, 33); // 10 × 2.5 × 1.3
  assert.equal(next.ease, 2.55);
  assert.equal(next.repetition, 3);
});

test("soon: giãn chậm hơn mastered", () => {
  const soon = scheduleReview({ interval: 10, ease: 2.5 }, "soon");
  const mastered = scheduleReview({ interval: 10, ease: 2.5 }, "mastered");
  assert.ok(soon.interval < mastered.interval);
  assert.equal(soon.interval, 23); // 10 × 2.5 × 0.9
});

test("ease không xuống dưới 1.3 và khoảng nghỉ bị chặn 365 ngày", () => {
  let card = { interval: 300, ease: 1.4, repetition: 5, lapses: 0 };
  for (let index = 0; index < 5; index += 1) card = { ...card, ...scheduleReview(card, "again") };
  assert.equal(card.ease, 1.3);
  const long = scheduleReview({ interval: 300, ease: 3.2 }, "mastered");
  assert.equal(long.interval, 365);
});

test("quên 4 lần thì bị đánh dấu là từ hay quên", () => {
  let card = { interval: 0, ease: 2.5, lapses: 0 };
  for (let index = 0; index < 4; index += 1) card = { ...card, ...scheduleReview(card, "again") };
  assert.equal(card.lapses, 4);
  assert.equal(card.leech, true);
  assert.equal(isLeech(card), true);
});

test("ngày ôn kế tiếp luôn ở tương lai và đúng định dạng", () => {
  const from = new Date(2026, 8, 20);
  const next = scheduleReview({ interval: 0 }, "soon", from);
  assert.equal(next.nextReviewDate, addDaysKey(3, from));
  assert.match(next.nextReviewDate, /^\d{4}-\d{2}-\d{2}$/);
  assert.equal(next.reviewDate, `${next.nextReviewDate}T00:00:00.000Z`);
  assert.equal(next.lastStudiedDate, dateKey(from));
});

test("isDue: thẻ mới luôn đến hạn, thẻ đã lên lịch chỉ đến hạn khi tới ngày", () => {
  assert.equal(isDue({ status: "new" }), true);
  assert.equal(isDue({ status: "learning", nextReviewDate: "2026-01-01" }, "2026-09-20"), true);
  assert.equal(isDue({ status: "learning", nextReviewDate: "2099-01-01" }, "2026-09-20"), false);
  assert.equal(isDue({ status: "mastered", reviewDate: "2026-09-20T00:00:00.000Z" }, "2026-09-20"), true);
});
