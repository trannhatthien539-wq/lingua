export const dateKey = (date = new Date()) => {
  const value = new Date(date);
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const addDaysKey = (days, from = new Date()) => {
  const value = new Date(from);
  value.setDate(value.getDate() + days);
  return dateKey(value);
};

/**
 * Lịch ôn tập dùng chung cho mọi chế độ học (flashcard, trắc nghiệm, chính tả...).
 * Trước đây mỗi màn hình tự hardcode mốc 1/3/5 ngày nên tiến độ bị lệch nhau.
 */
export const SRS_RATINGS = { again: "again", soon: "soon", mastered: "mastered" };
export const SRS_RATING_LABELS = { again: "Chưa nhớ", soon: "Nhớ vừa", mastered: "Đã thuộc" };
/** Số lần quên liên tiếp để bị coi là "từ hay quên" (leech). */
export const LEECH_LAPSES = 4;

const MIN_EASE = 1.3;
const MAX_EASE = 3.2;
const MAX_INTERVAL = 365;
const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const nextInterval = (rating, interval, ease) => {
  if (rating === SRS_RATINGS.again) return 1;
  const growing = interval > 0;
  if (rating === SRS_RATINGS.mastered) return growing ? clamp(Math.round(interval * ease * 1.3), 5, MAX_INTERVAL) : 5;
  return growing ? clamp(Math.round(interval * ease * 0.9), 2, MAX_INTERVAL) : 3;
};

/** Bản cập nhật SRS của một thẻ sau khi người học tự đánh giá (1 · 2 · 3). */
export function scheduleReview(card = {}, rating = SRS_RATINGS.soon, from = new Date()) {
  const ease = clamp(Number(card.ease) || 2.5, MIN_EASE, MAX_EASE);
  const interval = Number(card.interval) || 0;
  const repetition = Number(card.repetition) || 0;
  const lapses = Number(card.lapses) || 0;
  const isAgain = rating === SRS_RATINGS.again;
  const nextLapses = isAgain ? lapses + 1 : lapses;
  const days = nextInterval(rating, interval, ease);
  const nextReviewDate = addDaysKey(days, from);
  const nextEase = isAgain
    ? clamp(ease - 0.2, MIN_EASE, MAX_EASE)
    : rating === SRS_RATINGS.mastered
      ? clamp(ease + 0.05, MIN_EASE, MAX_EASE)
      : ease;
  return {
    status: rating === SRS_RATINGS.mastered ? "mastered" : "learning",
    interval: days,
    ease: Number(nextEase.toFixed(2)),
    repetition: isAgain ? 0 : repetition + 1,
    lapses: nextLapses,
    leech: nextLapses >= LEECH_LAPSES,
    nextReviewDate,
    reviewDate: `${nextReviewDate}T00:00:00.000Z`,
    lastStudiedDate: dateKey(from),
  };
}

/** Nhãn khoảng nghỉ cho nút đánh giá, ví dụ "Ôn sau 12 ngày". */
export const intervalLabel = (days) => (days <= 1 ? "Ôn lại ngày mai" : `Ôn sau ${days} ngày`);

/** Bản cập nhật sẵn sàng ghi vào dữ liệu (bỏ cờ suy diễn `leech`). */
export const schedulePayload = (card, rating, from = new Date()) => {
  const { leech, ...payload } = scheduleReview(card, rating, from);
  void leech;
  return payload;
};

/** Xem trước khoảng nghỉ của cả ba lựa chọn để hiển thị ngay trên nút. */
export const previewIntervals = (card = {}) =>
  Object.fromEntries(Object.values(SRS_RATINGS).map((rating) => [rating, scheduleReview(card, rating).interval]));

/** Thẻ đến hạn hôm nay: thẻ mới hoặc đã qua ngày ôn kế tiếp. */
export const isDue = (card, today = dateKey()) => {
  if (!card) return false;
  if (!card.status || card.status === "new") return true;
  const reviewDate = String(card.nextReviewDate || card.reviewDate || "").slice(0, 10);
  return Boolean(reviewDate) && reviewDate <= today;
};

export const isLeech = (card) => Number(card?.lapses) >= LEECH_LAPSES;

