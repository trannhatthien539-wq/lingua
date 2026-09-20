/**
 * Bảng quy đổi điểm VSTEP → bậc năng lực.
 *
 * Cách tính trong app: mỗi kỹ năng được quy về thang 0–10 (làm tròn 0.5),
 * điểm tổng = trung bình cộng các kỹ năng đã có điểm, rồi tra bảng dưới đây.
 * Ngưỡng được tách riêng ở file này để chỉnh theo bảng công bố của đơn vị tổ chức thi.
 */
export const VSTEP_BANDS = [
  { id: 'C1', label: 'Bậc 5 · C1', min: 8.5, note: 'Sử dụng tiếng Anh thành thạo, có thể học tập và làm việc bằng tiếng Anh.' },
  { id: 'B2', label: 'Bậc 4 · B2', min: 6, note: 'Tự tin giao tiếp, viết được luận và báo cáo ở mức khá.' },
  { id: 'B1', label: 'Bậc 3 · B1', min: 4, note: 'Đủ để giao tiếp hằng ngày và học tập cơ bản.' },
  { id: 'A2', label: 'Dưới B1 · A2', min: 0, note: 'Cần củng cố ngữ pháp, từ vựng và tốc độ nghe trước khi thi.' },
];

export const bandFor = (average) => {
  const value = Number(average) || 0;
  return VSTEP_BANDS.find((band) => value >= band.min) || VSTEP_BANDS[VSTEP_BANDS.length - 1];
};

/** Quy đổi số câu đúng → thang 0–10 (làm tròn 0.5) cho phần Nghe/Đọc. */
export const percentToScale10 = (correct, total) => {
  if (!total) return 0;
  return Math.round(((correct / total) * 10) * 2) / 2;
};

/** Điểm trung bình tổng, chỉ tính các kỹ năng đã có điểm (bỏ qua null/undefined). */
export const overallScore = (scores = {}) => {
  const values = Object.values(scores).filter((value) => typeof value === 'number' && !Number.isNaN(value));
  if (!values.length) return 0;
  return Math.round((values.reduce((total, value) => total + value, 0) / values.length) * 10) / 10;
};
