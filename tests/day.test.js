import test from "node:test";
import assert from "node:assert/strict";
import { addDaysToKey, dayKeyOf, previousDayKey } from "../src/utils/day.js";

test("dayKeyOf dùng giờ địa phương, không lệch vì UTC", () => {
  const date = new Date(2026, 0, 5, 23, 30);
  assert.equal(dayKeyOf(date), "2026-01-05");
  assert.equal(dayKeyOf(new Date(2026, 11, 31, 0, 1)), "2026-12-31");
});

test("dayKeyOf đệm 0 cho tháng/ngày một chữ số", () => {
  assert.equal(dayKeyOf(new Date(2026, 8, 9)), "2026-09-09");
});

test("dayKeyOf nhận chuỗi ISO và luôn trả về YYYY-MM-DD", () => {
  assert.match(dayKeyOf("2026-09-23T10:00:00Z"), /^\d{4}-\d{2}-\d{2}$/);
});

test("dayKeyOf ném lỗi với ngày không hợp lệ", () => {
  assert.throws(() => dayKeyOf("không phải ngày"), TypeError);
});

test("addDaysToKey tiến/lùi qua mốc tháng và năm", () => {
  assert.equal(addDaysToKey("2026-01-31", 1), "2026-02-01");
  assert.equal(addDaysToKey("2026-12-31", 1), "2027-01-01");
  assert.equal(addDaysToKey("2026-03-01", -1), "2026-02-28");
  assert.equal(addDaysToKey("2024-03-01", -1), "2024-02-29");
  assert.equal(addDaysToKey("2026-09-23", 0), "2026-09-23");
});

test("addDaysToKey ném lỗi khi khoá ngày sai định dạng", () => {
  assert.throws(() => addDaysToKey("23-09-2026", 1), TypeError);
});

test("previousDayKey trả về hôm trước của ngày truyền vào", () => {
  assert.equal(previousDayKey(new Date(2026, 8, 23)), "2026-09-22");
  assert.equal(previousDayKey(new Date(2026, 0, 1)), "2025-12-31");
});

test("dayKeyOf + addDaysToKey khứ hồi không mất ngày", () => {
  const start = new Date(2026, 8, 23);
  const forward = addDaysToKey(dayKeyOf(start), 10);
  assert.equal(dayKeyOf(start), addDaysToKey(forward, -10));
});
