import test from "node:test";
import assert from "node:assert/strict";
import { computeStats, computeXp, levelFor, achievementsFor } from "../src/services/gamification.js";

const days = {
  "2026-09-18": { reviewed: 20, correct: 15, sessions: 1 },
  "2026-09-19": { reviewed: 30, correct: 24, sessions: 2 },
};

const cards = [
  { id: "1", status: "mastered", nextReviewDate: "2099-01-01" },
  { id: "2", status: "learning", nextReviewDate: "2026-09-19" },
  { id: "3", status: "new" },
  { id: "4", status: "learning", nextReviewDate: "2099-01-01", lapses: 5 },
];

test("computeStats gộp lịch sử, thẻ và tiến độ module", () => {
  const stats = computeStats({
    days,
    streak: { currentStreak: 3, totalSessions: 9 },
    cards,
    grammar: { completed: { a: { passed: true }, b: { passed: false } } },
    skills: { listening: { x: {} }, reading: {}, mock: [{ score: 25 }, { score: 22 }], sentence: { attempted: 10, correct: 9 } },
    goal: { target: 20 },
  });
  assert.equal(stats.reviewed, 50);
  assert.equal(stats.correct, 39);
  assert.equal(stats.sessions, 3);
  assert.equal(stats.accuracy, 78);
  assert.equal(stats.activeDays, 2);
  assert.equal(stats.bestDay, 30);
  assert.equal(stats.cards.mastered, 1);
  assert.equal(stats.cards.leeches, 1);
  assert.equal(stats.grammar.passed, 1);
  assert.equal(stats.skills.mockBest, 25);
  assert.equal(stats.skills.sentenceAccuracy, 90);
  assert.equal(stats.streak.current, 3);
});

test("không có dữ liệu thì không chia cho 0", () => {
  const stats = computeStats({});
  assert.equal(stats.accuracy, 0);
  assert.equal(stats.skills.sentenceAccuracy, 0);
  assert.equal(computeXp(stats), 0);
  assert.equal(levelFor(0).level, 1);
});

test("XP tăng theo lượt ôn, ngữ pháp và thi thử", () => {
  const base = computeStats({ days, cards });
  const more = computeStats({ days, cards, grammar: { completed: { a: { passed: true } } }, skills: { mock: [{ score: 30 }] } });
  assert.ok(computeXp(more) > computeXp(base));
});

test("levelFor trả về cấp, tiêu đề và tiến độ tới cấp kế tiếp", () => {
  const level = levelFor(0);
  assert.equal(level.level, 1);
  assert.equal(level.nextAt, 120);
  assert.equal(level.percent, 0);
  const advanced = levelFor(340);
  assert.equal(advanced.level, 3);
  assert.equal(advanced.toNext, 620 - 340);
  assert.equal(levelFor(999999).nextAt, null);
  assert.equal(levelFor(999999).percent, 100);
});

test("huy hiệu mở khoá theo số liệu", () => {
  const stats = computeStats({ days, streak: { currentStreak: 7 }, cards, goal: { target: 20 } });
  const earned = achievementsFor(stats).filter((achievement) => achievement.earned).map((achievement) => achievement.id);
  assert.ok(earned.includes("first-session"));
  assert.ok(earned.includes("streak-7"));
  assert.ok(!earned.includes("review-1000"));
  assert.ok(!earned.includes("mastered-300"));
});
