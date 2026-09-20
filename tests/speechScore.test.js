import test from "node:test";
import assert from "node:assert/strict";
import { scoreLabel, scorePronunciation, speedLabel } from "../src/utils/speechScore.js";

test("đọc đúng toàn bộ câu mẫu được 100 điểm", () => {
  const result = scorePronunciation("I am from Da Nang, a city on the coast.", "I am from Da Nang a city on the coast", 5);
  assert.equal(result.score, 100);
  assert.equal(result.missing.length, 0);
});

test("bỏ sót từ thì bị liệt kê vào danh sách chưa nghe rõ", () => {
  const result = scorePronunciation("I am from Da Nang", "I am from Da Nang a city on the coast", 4);
  assert.equal(result.total, 10);
  assert.equal(result.matched, 5);
  assert.equal(result.score, 50);
  assert.deepEqual(result.missing, ["a", "city", "on", "the", "coast"]);
});

test("bỏ qua dấu câu và chữ hoa", () => {
  const result = scorePronunciation("HELLO, world!", "hello world", 2);
  assert.equal(result.score, 100);
});

test("tính tốc độ nói khi biết thời lượng", () => {
  const result = scorePronunciation("one two three four five six", "one two three four five six", 3);
  assert.equal(result.wpm, 120);
  assert.equal(scorePronunciation("one two", "one two", 0).wpm, 0);
});

test("câu mẫu rỗng trả về điểm 0 an toàn", () => {
  assert.deepEqual(scorePronunciation("abc", "", 10), { score: 0, matched: 0, total: 0, missing: [], extra: [], wpm: 0 });
});

test("nhãn điểm và tốc độ đổi theo ngưỡng", () => {
  assert.equal(scoreLabel(95), "Phát âm rất rõ");
  assert.equal(scoreLabel(80), "Khá tốt, giữ nhịp này nhé");
  assert.equal(speedLabel(120), "Tốc độ nói tự nhiên");
  assert.equal(speedLabel(0), "");
});
