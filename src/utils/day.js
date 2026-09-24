/**
 * Nguồn sự thật duy nhất cho "khoá ngày" (YYYY-MM-DD theo giờ địa phương).
 *
 * Vì sao tách riêng: trước đây mỗi module tự viết lại logic ngày (historyService,
 * utils/srs.js) nên dễ lệch nhau giữa lịch ôn (SRS), chuỗi ngày (streak) và biểu đồ.
 * Lưu ý thứ tự tham số khác `addDaysKey` của `utils/srs.js` nên hàm ở đây đặt tên
 * `addDaysToKey` để không bị gọi nhầm.
 */

const pad = (value) => String(value).padStart(2, "0");

/** Trả về ngày theo múi giờ địa phương, tránh phụ thuộc UTC của `toISOString`. */
export const dayKeyOf = (date = new Date()) => {
  const value = date instanceof Date ? new Date(date.getTime()) : new Date(date);
  if (Number.isNaN(value.getTime())) {
    throw new TypeError("Ngày không hợp lệ");
  }
  return `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(value.getDate())}`;
};

/** Dịch một khoá ngày `YYYY-MM-DD` đi `days` ngày (âm để lùi). */
export const addDaysToKey = (key, days) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(key))) throw new TypeError(`Ngày không hợp lệ: ${key}`);
  const [year, month, day] = String(key).split("-").map(Number);
  if (!year || !month || !day) throw new TypeError(`Ngày không hợp lệ: ${key}`);
  const value = new Date(year, month - 1, day);
  value.setDate(value.getDate() + Number(days));
  return dayKeyOf(value);
};

/** Khoá ngày của hôm trước (dùng cho tính chuỗi ngày học). */
export const previousDayKey = (date = new Date()) => addDaysToKey(dayKeyOf(date), -1);
