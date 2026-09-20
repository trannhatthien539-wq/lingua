import test from "node:test";
import assert from "node:assert/strict";
import { registry, VSTEP_LEVELS } from "../src/data/vstep/metadata.js";
import { countExamQuestions, examMinutes, examQuestions, normaliseExam } from "../src/services/vstepScoring.js";
import b101 from "../src/data/vstep/exams/b1-01.js";
import b102 from "../src/data/vstep/exams/b1-02.js";
import b103 from "../src/data/vstep/exams/b1-03.js";
import b201 from "../src/data/vstep/exams/b2-01.js";
import b202 from "../src/data/vstep/exams/b2-02.js";
import b203 from "../src/data/vstep/exams/b2-03.js";
import b204 from "../src/data/vstep/exams/b2-04.js";
import c101 from "../src/data/vstep/exams/c1-01.js";
import c102 from "../src/data/vstep/exams/c1-02.js";
import c103 from "../src/data/vstep/exams/c1-03.js";

const exams = [b101, b102, b103, b201, b202, b203, b204, c101, c102, c103].map(normaliseExam);

test("có ít nhất 10 đề, đủ 3 bậc B1/B2/C1 và metadata khớp nội dung", () => {
  assert.ok(registry.length >= 10, "cần ít nhất 10 đề");
  for (const level of VSTEP_LEVELS) {
    assert.ok(registry.some((item) => item.level === level), `thiếu đề bậc ${level}`);
  }
  for (const meta of registry) {
    const exam = exams.find((item) => item.id === meta.id);
    assert.ok(exam, `registry có ${meta.id} nhưng không tìm thấy file đề`);
    assert.equal(exam.level, meta.level);
    assert.equal(exam.title, meta.title);
    const counts = countExamQuestions(exam);
    assert.equal(counts.listening, meta.counts.listening, `${meta.id}: sai số câu Nghe`);
    assert.equal(counts.reading, meta.counts.reading, `${meta.id}: sai số câu Đọc`);
  }
  assert.equal(exams.length, registry.length, "số file đề phải khớp registry");
});

test("mỗi đề đúng cấu trúc VSTEP: 8/12/15 câu Nghe, 10/10/10/10 câu Đọc", () => {
  for (const exam of exams) {
    assert.equal(exam.listening.parts.length, 3, `${exam.id}: Nghe phải có 3 phần`);
    assert.deepEqual(
      exam.listening.parts.map((part) => part.questions.length),
      [8, 12, 15],
      `${exam.id}: số câu từng phần Nghe sai`,
    );
    assert.equal(exam.reading.parts.length, 4, `${exam.id}: Đọc phải có 4 phần`);
    assert.deepEqual(
      exam.reading.parts.map((part) => part.passages.reduce((sum, passage) => sum + passage.questions.length, 0)),
      [10, 10, 10, 10],
      `${exam.id}: số câu từng phần Đọc sai`,
    );
    assert.equal(examMinutes(exam), 172, `${exam.id}: tổng thời gian phải là 172 phút`);
    assert.equal(exam.listening.minutes, 40);
    assert.equal(exam.reading.minutes, 60);
    assert.equal(exam.writing.minutes, 60);
    assert.equal(exam.speaking.minutes, 12);
  }
});

test("mọi câu hỏi hợp lệ: id duy nhất, đáp án nằm trong lựa chọn, câu điền có đáp án", () => {
  for (const exam of exams) {
    const ids = new Set();
    for (const section of ["listening", "reading"]) {
      for (const question of examQuestions(exam, section)) {
        assert.ok(!ids.has(question.id), `${exam.id}: id câu hỏi trùng — ${question.id}`);
        ids.add(question.id);
        assert.ok(question.prompt?.trim(), `${exam.id}/${question.id}: thiếu prompt`);
        if (question.type === "choice") {
          assert.ok(Array.isArray(question.options) && question.options.length >= 2, `${exam.id}/${question.id}: thiếu options`);
          assert.ok(question.options.includes(question.answer), `${exam.id}/${question.id}: đáp án không nằm trong options`);
          assert.equal(new Set(question.options).size, question.options.length, `${exam.id}/${question.id}: lựa chọn bị trùng`);
        } else if (question.type === "fill") {
          assert.ok(Array.isArray(question.answers) && question.answers.length > 0, `${exam.id}/${question.id}: câu điền thiếu answers`);
        } else {
          assert.fail(`${exam.id}/${question.id}: loại câu hỏi không hỗ trợ (${question.type})`);
        }
        assert.ok(question.explain?.trim(), `${exam.id}/${question.id}: thiếu giải thích`);
      }
    }
  }
});

test("phần Nghe có transcript đầy đủ và phần Viết/Nói đủ task", () => {
  for (const exam of exams) {
    for (const part of exam.listening.parts) {
      assert.ok(part.transcript?.length >= 3, `${exam.id}/${part.id}: transcript quá ngắn`);
      for (const line of part.transcript) {
        assert.ok(line.speaker?.trim() && line.line?.trim(), `${exam.id}/${part.id}: transcript thiếu speaker/line`);
      }
      assert.ok(part.instruction?.trim(), `${exam.id}/${part.id}: thiếu instruction`);
    }
    assert.ok(exam.writing.tasks.length >= 2, `${exam.id}: cần 2 task Viết`);
    assert.deepEqual(exam.writing.tasks.map((task) => task.task), [1, 2], `${exam.id}: thứ tự task Viết sai`);
    for (const task of exam.writing.tasks) {
      assert.ok(task.prompt?.trim() && task.checklist?.length >= 4, `${exam.id}/${task.id}: thiếu đề bài hoặc checklist`);
      const words = String(task.model || "").trim().split(/\s+/).filter(Boolean).length;
      assert.ok(words >= task.minWords, `${exam.id}/${task.id}: bài mẫu (${words} từ) ngắn hơn yêu cầu ${task.minWords} từ`);
      assert.ok(task.minWords >= (task.task === 1 ? 100 : 200), `${exam.id}/${task.id}: minWords chưa đạt chuẩn VSTEP`);
    }
    assert.equal(exam.speaking.parts.length, 3, `${exam.id}: phần Nói cần 3 phần`);
    assert.deepEqual(exam.speaking.parts.map((part) => part.kind), ["social", "solution", "topic"], `${exam.id}: sai loại phần Nói`);
    for (const part of exam.speaking.parts) {
      // Part 1 thường để bài mẫu trong từng câu hỏi, các part khác để ở `sample`.
      const hasSample = Boolean(part.sample?.trim()) || (part.questions || []).some((item) => item.sample?.trim());
      assert.ok(part.instruction?.trim() && hasSample, `${exam.id}/${part.id}: thiếu instruction hoặc bài mẫu`);
      assert.ok(Number(part.minutes) > 0, `${exam.id}/${part.id}: thiếu số phút`);
    }
  }
});

test("registry không có id trùng và mọi đề đều có nhãn bậc hợp lệ", () => {
  const ids = registry.map((item) => item.id);
  assert.equal(new Set(ids).size, ids.length, "registry có id trùng");
  for (const meta of registry) {
    assert.ok(VSTEP_LEVELS.includes(meta.level), `${meta.id}: bậc không hợp lệ`);
    assert.ok(meta.title?.trim() && meta.tags?.length > 0, `${meta.id}: thiếu tiêu đề hoặc tags`);
  }
});
