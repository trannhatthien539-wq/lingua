/**
 * Kiểm tra nhanh toàn bộ đề VSTEP và in ra MỌI lỗi (không dừng ở lỗi đầu tiên
 * như `npm test`). Dùng khi vừa thêm đề mới:
 *
 *   node scripts/check-vstep.mjs
 */
import { registry } from "../src/data/vstep/metadata.js";
import { countExamQuestions, examQuestions, examMinutes, normaliseExam } from "../src/services/vstepScoring.js";

const problems = [];
const report = (examId, message) => problems.push(`${examId}: ${message}`);

const exams = [];
for (const meta of registry) {
  try {
    const module = await import(`../src/data/vstep/exams/${meta.id}.js`);
    exams.push(normaliseExam(module.default));
  } catch (error) {
    report(meta.id, `không import được file đề (${error.message})`);
  }
}

for (const exam of exams) {
  const meta = registry.find((item) => item.id === exam.id);
  if (!meta) report(exam.id, "không có trong registry");
  else {
    if (meta.level !== exam.level) report(exam.id, `level ${exam.level} khác registry ${meta.level}`);
    if (meta.title !== exam.title) report(exam.id, "title khác registry");
    const counts = countExamQuestions(exam);
    if (counts.listening !== (meta.counts?.listening ?? 35)) report(exam.id, `Nghe ${counts.listening} câu (mong đợi ${meta.counts?.listening ?? 35})`);
    if (counts.reading !== (meta.counts?.reading ?? 40)) report(exam.id, `Đọc ${counts.reading} câu (mong đợi ${meta.counts?.reading ?? 40})`);
  }

  const perPart = exam.listening.parts.map((part) => part.questions?.length || 0);
  if (JSON.stringify(perPart) !== JSON.stringify([8, 12, 15])) report(exam.id, `số câu từng phần Nghe = [${perPart}]`);
  const readingPerPart = exam.reading.parts.map((part) => (part.passages || []).reduce((sum, passage) => sum + (passage.questions?.length || 0), 0));
  if (JSON.stringify(readingPerPart) !== JSON.stringify([10, 10, 10, 10])) report(exam.id, `số câu từng phần Đọc = [${readingPerPart}]`);
  if (examMinutes(exam) !== 172) report(exam.id, `tổng thời gian ${examMinutes(exam)} phút`);

  for (const part of exam.listening.parts) {
    (part.transcript || []).forEach((line, index) => {
      if (!line?.speaker?.trim() || !line?.line?.trim()) report(exam.id, `${part.id} transcript dòng ${index + 1} thiếu speaker/line`);
    });
    if ((part.transcript || []).length < 3) report(exam.id, `${part.id} transcript quá ngắn`);
  }

  const ids = new Set();
  for (const section of ["listening", "reading"]) {
    for (const question of examQuestions(exam, section)) {
      if (ids.has(question.id)) report(exam.id, `id trùng: ${question.id}`);
      ids.add(question.id);
      if (!question.prompt?.trim()) report(exam.id, `${question.id} thiếu prompt`);
      if (question.type === "choice") {
        if (!question.options?.length) report(exam.id, `${question.id} thiếu options`);
        else if (!question.options.includes(question.answer)) report(exam.id, `${question.id} đáp án không nằm trong options`);
      } else if (question.type !== "fill") {
        report(exam.id, `${question.id} loại câu hỏi lạ: ${question.type}`);
      } else if (!question.answers?.length) {
        report(exam.id, `${question.id} câu điền thiếu answers`);
      }
      if (!question.explain?.trim()) report(exam.id, `${question.id} thiếu explain`);
    }
  }

  exam.writing.tasks.forEach((task) => {
    const words = String(task.model || "").trim().split(/\s+/).filter(Boolean).length;
    if (words < task.minWords) report(exam.id, `${task.id} bài mẫu ${words} từ < yêu cầu ${task.minWords} từ`);
  });

  exam.speaking.parts.forEach((part) => {
    const hasSample = Boolean(part.sample?.trim()) || (part.questions || []).some((item) => item.sample?.trim());
    if (!hasSample) report(exam.id, `${part.id} thiếu bài mẫu`);
    if (!part.instruction?.trim()) report(exam.id, `${part.id} thiếu instruction`);
    if (!Number(part.minutes)) report(exam.id, `${part.id} thiếu minutes`);
  });
}

const words = exams.reduce((total, exam) => total + examQuestions(exam, "listening").length + examQuestions(exam, "reading").length, 0);
console.log(`Đã kiểm tra ${exams.length} đề · ${words} câu Nghe + Đọc + ${exams.length * 2} task Viết + ${exams.length * 3} phần Nói.`);
if (problems.length) {
  console.log(`\n❌ ${problems.length} lỗi:`);
  problems.forEach((item) => console.log(`  - ${item}`));
  process.exit(1);
}
console.log("✅ Không có lỗi cấu trúc nào.");
