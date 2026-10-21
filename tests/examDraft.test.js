import test from "node:test";
import assert from "node:assert/strict";
import { draftKeyFor, parseExamDraft } from "../src/utils/examDraft.js";

const options = {
  examId: "b1-01",
  mode: "exam",
  availableSections: ["listening", "reading", "writing", "speaking"],
  minutesFor: (key) => ({ listening: 40 * 60, reading: 40 * 60, writing: 60 * 60, speaking: 12 * 60 })[key],
};

test("draftKeyFor tách riêng đề và chế độ", () => {
  assert.equal(draftKeyFor("b1-01", "exam"), "lingua_vstep_draft_b1-01_exam");
  assert.notEqual(draftKeyFor("b1-01", "exam"), draftKeyFor("b1-01", "practice"));
});

test("parseExamDraft trả null với dữ liệu rỗng/hỏng/sai kiểu", () => {
  assert.equal(parseExamDraft(null, options), null);
  assert.equal(parseExamDraft("", options), null);
  assert.equal(parseExamDraft("{not json", options), null);
  assert.equal(parseExamDraft("[]", options), null);
  assert.equal(parseExamDraft('"text"', options), null);
});

test("parseExamDraft bỏ bản nháp của đề hoặc chế độ khác", () => {
  const draft = { examId: "b2-01", mode: "exam", sectionKey: "reading", responses: { q1: "A" } };
  assert.equal(parseExamDraft(draft, options), null);
  assert.equal(parseExamDraft({ ...draft, examId: "b1-01", mode: "practice" }, options), null);
});

test("parseExamDraft khôi phục đầy đủ dữ liệu bài làm", () => {
  const draft = {
    examId: "b1-01",
    mode: "exam",
    sectionKey: "reading",
    responses: { q1: "A" },
    writings: { "task-1": "Hello" },
    writingChecks: { "task-1:Đủ từ": true },
    speaking: { "part-1": { seconds: 30, transcript: "hi" } },
    secondsLeft: 1200,
    startedAt: 1000,
    timestamp: 2000,
  };

  const parsed = parseExamDraft(JSON.stringify(draft), options);
  assert.ok(parsed);
  assert.equal(parsed.sectionKey, "reading");
  assert.deepEqual(parsed.responses, { q1: "A" });
  assert.deepEqual(parsed.writings, { "task-1": "Hello" });
  assert.deepEqual(parsed.writingChecks, { "task-1:Đủ từ": true });
  assert.deepEqual(parsed.speaking, { "part-1": { seconds: 30, transcript: "hi" } });
  assert.equal(parsed.secondsLeft, 1200);
  assert.equal(parsed.startedAt, 1000);
});

test("parseExamDraft kẹp thời gian còn lại trong khoảng của phần thi", () => {
  const tooLong = parseExamDraft(
    { sectionKey: "speaking", secondsLeft: 9999 },
    options,
  );
  assert.equal(tooLong.secondsLeft, 12 * 60);

  const negative = parseExamDraft({ sectionKey: "listening", secondsLeft: -50 }, options);
  assert.equal(negative.secondsLeft, 0);

  const invalid = parseExamDraft({ sectionKey: "listening", secondsLeft: "abc" }, options);
  assert.equal(invalid.secondsLeft, null);
});

test("parseExamDraft quay về phần đầu tiên khi sectionKey không hợp lệ", () => {
  const parsed = parseExamDraft({ sectionKey: "khong-ton-tai", secondsLeft: 60 }, options);
  assert.equal(parsed.sectionKey, "listening");
  assert.equal(parsed.secondsLeft, 60);
});

test("parseExamDraft chuẩn hoá các trường sai kiểu thành object rỗng", () => {
  const parsed = parseExamDraft({ responses: [], writings: null, speaking: "x" }, options);
  assert.deepEqual(parsed.responses, {});
  assert.deepEqual(parsed.writings, {});
  assert.deepEqual(parsed.speaking, {});
  assert.equal(parsed.sectionKey, "listening");
});
