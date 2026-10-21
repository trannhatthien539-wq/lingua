export const DRAFT_PREFIX = "lingua_vstep_draft_";
export const DRAFT_VERSION = 2;

/** Khoá lưu nháp riêng cho từng đề + chế độ (thi thật / luyện tập). */
export const draftKeyFor = (examId, mode) => `${DRAFT_PREFIX}${examId}_${mode}`;

const asObject = (value) =>
  value && typeof value === "object" && !Array.isArray(value) ? value : {};

/**
 * Chuẩn hoá bản nháp đọc từ LocalStorage.
 *
 * Trả về `null` khi dữ liệu hỏng hoặc thuộc về đề/chế độ khác để màn hình thi
 * không bao giờ bị treo vì một bản nháp cũ. Thời gian còn lại được kẹp trong
 * khoảng [0, thời lượng phần thi] của chính phần được khôi phục.
 *
 * @param {string|object|null} raw Giá trị thô trong storage.
 * @param {{ examId?: string, mode?: string, availableSections?: string[], minutesFor?: (sectionKey: string) => number }} [options]
 */
export function parseExamDraft(raw, options = {}) {
  if (!raw) return null;

  let parsed;
  try {
    parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
  } catch {
    return null;
  }
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;

  const { examId, mode, availableSections = [], minutesFor } = options;
  if (parsed.examId && examId && parsed.examId !== examId) return null;
  if (parsed.mode && mode && parsed.mode !== mode) return null;

  const sectionKey = availableSections.includes(parsed.sectionKey)
    ? parsed.sectionKey
    : availableSections[0] ?? null;

  let secondsLeft =
    typeof parsed.secondsLeft === "number" && Number.isFinite(parsed.secondsLeft)
      ? Math.round(parsed.secondsLeft)
      : null;

  const maxSeconds = sectionKey && typeof minutesFor === "function" ? minutesFor(sectionKey) : null;
  if (secondsLeft !== null && typeof maxSeconds === "number" && Number.isFinite(maxSeconds)) {
    secondsLeft = Math.min(Math.max(0, secondsLeft), maxSeconds);
  }

  return {
    sectionKey,
    responses: asObject(parsed.responses),
    writings: asObject(parsed.writings),
    writingChecks: asObject(parsed.writingChecks),
    speaking: asObject(parsed.speaking),
    secondsLeft,
    startedAt: Number.isFinite(parsed.startedAt) ? parsed.startedAt : null,
    timestamp: Number.isFinite(parsed.timestamp) ? parsed.timestamp : null,
  };
}
