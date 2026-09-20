import { bandFor, overallScore, percentToScale10 } from "../data/vstep/bands.js";

/**
 * Chấm điểm VSTEP — hàm thuần, không phụ thuộc React/Vite nên test được bằng `node --test`.
 * Việc nạp đề nằm ở `vstepService.js`.
 */

export const SECTION_ORDER = ["listening", "reading", "writing", "speaking"];

export const SECTION_LABELS = {
  listening: "Nghe",
  reading: "Đọc",
  writing: "Viết",
  speaking: "Nói",
};

/** Bù các field thiếu để component không phải kiểm tra `undefined` liên tục. */
export const normaliseExam = (exam = {}) => ({
  ...exam,
  listening: { minutes: 40, parts: [], ...(exam.listening || {}) },
  reading: { minutes: 60, parts: [], ...(exam.reading || {}) },
  writing: { minutes: 60, tasks: [], ...(exam.writing || {}) },
  speaking: { minutes: 12, parts: [], ...(exam.speaking || {}) },
});

/** Tất cả câu hỏi trắc nghiệm/điền từ của Nghe hoặc Đọc, theo đúng thứ tự thi. */
export const examQuestions = (exam, section) => {
  if (section === "listening") {
    return (exam.listening?.parts || []).flatMap((part) =>
      (part.questions || []).map((question) => ({ ...question, partId: part.id, partTitle: part.title, section: "listening" })),
    );
  }
  if (section === "reading") {
    return (exam.reading?.parts || []).flatMap((part) =>
      (part.passages || []).flatMap((passage) =>
        (passage.questions || []).map((question) => ({
          ...question,
          partId: part.id,
          passageId: passage.id,
          partTitle: part.title,
          section: "reading",
        })),
      ),
    );
  }
  return [];
};

export const countExamQuestions = (exam) => ({
  listening: examQuestions(exam, "listening").length,
  reading: examQuestions(exam, "reading").length,
  writing: (exam.writing?.tasks || []).length,
  speaking: (exam.speaking?.parts || []).length,
});

export const totalExamQuestions = (exam) => {
  const counts = countExamQuestions(exam);
  return counts.listening + counts.reading;
};

/** Tổng thời gian của cả bài thi (phút). */
export const examMinutes = (exam) =>
  SECTION_ORDER.reduce((total, section) => total + (Number(exam[section]?.minutes) || 0), 0);

const normalise = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/[.,!?;:'"]+$/g, "")
    .replace(/\s+/g, " ")
    .trim();

export const isAnswerCorrect = (question, response) => {
  if (response === undefined || response === null || response === "") return false;
  if (question.type === "choice") return response === question.answer;
  const given = normalise(response);
  if (!given) return false;
  return (question.answers || []).some((answer) => normalise(answer) === given);
};

/** Chấm phần Nghe/Đọc: điểm 0–10 + chi tiết từng câu để xem lại. */
export const scoreObjectiveSection = (exam, section, responses = {}) => {
  const questions = examQuestions(exam, section);
  const details = questions.map((question) => ({
    id: question.id,
    prompt: question.prompt,
    partId: question.partId,
    partTitle: question.partTitle,
    response: responses[question.id] ?? "",
    expected: question.type === "choice" ? question.answer : (question.answers || [])[0],
    explain: question.explain || "",
    correct: isAnswerCorrect(question, responses[question.id]),
  }));
  const correct = details.filter((item) => item.correct).length;
  return {
    total: questions.length,
    correct,
    percent: questions.length ? Math.round((correct / questions.length) * 100) : 0,
    score10: percentToScale10(correct, questions.length),
    details,
  };
};

/**
 * Điểm Viết/Nói khi không có AI: dựa trên checklist tự đánh giá và số từ đạt yêu cầu.
 */
export const selfAssessedScore10 = ({ checkedRatio = 0, wordRatio = 1, sampleRatio = 1 } = {}) => {
  const quality = Math.min(1, checkedRatio) * 0.7 + Math.min(1, sampleRatio) * 0.3;
  const lengthPenalty = wordRatio >= 1 ? 1 : Math.max(0.5, wordRatio);
  return Math.round(quality * lengthPenalty * 10 * 2) / 2;
};

/** Tổng hợp một lần thi: điểm trung bình, phần trăm và bậc. */
export const summariseAttempt = ({ exam, scores = {} }) => {
  const average = overallScore(scores);
  const band = bandFor(average);
  return {
    average,
    percent: Math.round(average * 10),
    band: band.id,
    bandLabel: band.label,
    bandNote: band.note,
    counts: countExamQuestions(exam),
  };
};
