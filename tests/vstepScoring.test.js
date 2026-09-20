import test from "node:test";
import assert from "node:assert/strict";
import { bandFor, overallScore, percentToScale10, VSTEP_BANDS } from "../src/data/vstep/bands.js";
import { countExamQuestions, examQuestions, examMinutes, isAnswerCorrect, selfAssessedScore10, scoreObjectiveSection, summariseAttempt } from "../src/services/vstepScoring.js";
import b101 from "../src/data/vstep/exams/b1-01.js";

test("percentToScale10 quy đổi số câu đúng sang thang 0–10 và làm tròn 0.5", () => {
  assert.equal(percentToScale10(35, 35), 10);
  assert.equal(percentToScale10(0, 40), 0);
  assert.equal(percentToScale10(20, 40), 5);
  assert.equal(percentToScale10(1, 3), 3.5);
  assert.equal(percentToScale10(0, 0), 0);
});

test("bandFor trả đúng bậc theo ngưỡng B1/B2/C1", () => {
  assert.equal(bandFor(10).id, "C1");
  assert.equal(bandFor(8.5).id, "C1");
  assert.equal(bandFor(8).id, "B2");
  assert.equal(bandFor(6).id, "B2");
  assert.equal(bandFor(5.5).id, "B1");
  assert.equal(bandFor(3.5).id, "A2");
  assert.equal(VSTEP_BANDS.length, 4);
});

test("overallScore chỉ tính các kỹ năng đã có điểm", () => {
  assert.equal(overallScore({ listening: 8, reading: 6 }), 7);
  assert.equal(overallScore({ listening: 7, reading: 6, writing: null }), 6.5);
  assert.equal(overallScore({}), 0);
});

test("isAnswerCorrect chấp nhận nhiều đáp án điền và bỏ qua hoa/thường, dấu câu", () => {
  assert.equal(isAnswerCorrect({ type: "choice", answer: "B" }, "B"), true);
  assert.equal(isAnswerCorrect({ type: "choice", answer: "B" }, "C"), false);
  assert.equal(isAnswerCorrect({ type: "fill", answers: ["3", "three"] }, "Three."), true);
  assert.equal(isAnswerCorrect({ type: "fill", answers: ["3"] }, "  "), false);
  assert.equal(isAnswerCorrect({ type: "fill", answers: ["15"] }, ""), false);
});

test("scoreObjectiveSection chấm đúng và giữ chi tiết để xem lại", () => {
  const exam = {
    listening: { parts: [{ id: "L1", title: "Part 1", questions: [
      { id: "a", type: "choice", prompt: "Q1", options: ["x", "y"], answer: "y", explain: "vì y" },
      { id: "b", type: "fill", prompt: "Q2", answers: ["cat"], explain: "vì cat" },
    ] }] },
  };
  const result = scoreObjectiveSection(exam, "listening", { a: "y" });
  assert.equal(result.total, 2);
  assert.equal(result.correct, 1);
  assert.equal(result.percent, 50);
  assert.equal(result.score10, 5);
  assert.equal(result.details[1].expected, "cat");
  assert.equal(result.details[1].correct, false);
  assert.equal(result.details[0].explain, "vì y");
});

test("selfAssessedScore10 phạt khi thiếu từ và cần checklist", () => {
  assert.equal(selfAssessedScore10({ checkedRatio: 0, wordRatio: 0, sampleRatio: 0 }), 0);
  assert.equal(selfAssessedScore10({ checkedRatio: 1, wordRatio: 1 }), 10);
  const short = selfAssessedScore10({ checkedRatio: 1, wordRatio: 0.5 });
  assert.ok(short < 10 && short >= 5, `điểm bài ngắn phải thấp hơn nhưng không quá 0: ${short}`);
});

test("summariseAttempt tính điểm trung bình và bậc của một lần thi", () => {
  const exam = {
    listening: { parts: [{ id: "L1", questions: new Array(35).fill({ type: "choice", prompt: "q", options: ["a", "b"], answer: "a" }) }] },
    reading: { parts: [{ id: "R1", passages: [{ id: "p", questions: new Array(40).fill({ type: "choice", prompt: "q", options: ["a", "b"], answer: "a" }) }] }] },
    writing: { tasks: [{ id: "W1" }, { id: "W2" }] },
    speaking: { parts: [{ id: "S1" }] },
  };
  const summary = summariseAttempt({ exam, scores: { listening: 8, reading: 7, writing: 6.5, speaking: 6.5 } });
  assert.equal(summary.average, 7);
  assert.equal(summary.percent, 70);
  assert.equal(summary.band, "B2");
  assert.equal(summary.counts.listening + summary.counts.reading, 75);
});

test("đề B1 số 1: đếm câu, thời gian và cấu trúc phần thi đúng chuẩn", () => {
  assert.equal(countExamQuestions(b101).listening, 35);
  assert.equal(countExamQuestions(b101).reading, 40);
  assert.equal(examQuestions(b101, "reading").length, 40);
  assert.equal(examMinutes(b101), 172);
  assert.deepEqual(b101.listening.parts.map((part) => part.questions.length), [8, 12, 15]);
});
