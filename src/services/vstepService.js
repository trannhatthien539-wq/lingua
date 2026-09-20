import { loadExam } from "../data/vstep/registry";
import { normaliseExam } from "./vstepScoring";

/**
 * Lớp dịch vụ VSTEP cho UI: nạp đề (lazy) + re-export toàn bộ hàm chấm điểm
 * từ `vstepScoring.js` để component chỉ cần import một chỗ.
 */
export {
  SECTION_LABELS,
  SECTION_ORDER,
  countExamQuestions,
  examMinutes,
  examQuestions,
  isAnswerCorrect,
  normaliseExam,
  scoreObjectiveSection,
  selfAssessedScore10,
  summariseAttempt,
  totalExamQuestions,
} from "./vstepScoring";

/** Thứ tự 4 kỹ năng trong một đề thi. */
export const skillOrder = ["listening", "reading", "writing", "speaking"];

/** Nạp và chuẩn hoá một đề theo id. */
export const loadFullExam = async (id) => normaliseExam(await loadExam(id));
