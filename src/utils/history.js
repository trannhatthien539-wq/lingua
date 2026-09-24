/**
 * Phần **thuần** của lịch sử học tập: không đụng Firestore, không đụng DOM nên test được
 * bằng `npm test`. `src/services/historyService.js` lo nạp/ghi dữ liệu rồi dùng lại các hàm này
 * (trước đây toàn bộ logic nằm trong service nên không có test nào che phần lịch sử/streak/widget).
 */
import { dayKeyOf } from "./day.js";

export const MAX_DAYS = 400;

const emptyDay = () => ({ reviewed: 0, correct: 0, sessions: 0 });

/** Giữ tối đa `max` ngày mới nhất (mới -> cũ) để payload gửi lên Firestore không phình mãi. */
export const pruneDays = (allDays, max = MAX_DAYS) =>
  Object.fromEntries(
    Object.entries(allDays)
      .sort(([first], [second]) => second.localeCompare(first))
      .slice(0, max),
  );

/** Trả về `count` ngày gần nhất theo thứ tự cũ -> mới để vẽ biểu đồ. */
export const recentHistory = (count = 14, allDays = {}, today = new Date()) => {
  const result = [];
  const cursor = new Date(today);
  for (let index = count - 1; index >= 0; index -= 1) {
    const date = new Date(cursor.getFullYear(), cursor.getMonth(), cursor.getDate() - index);
    const key = dayKeyOf(date);
    const entry = allDays[key] || emptyDay();
    result.push({ ...entry, date: key, label: `${date.getDate()}/${date.getMonth() + 1}` });
  }
  return result;
};

/** Tổng hợp `count` ngày gần nhất: số lượt ôn, số câu đúng, số ngày có học, độ chính xác (%). */
export const historySummary = (count = 7, allDays = {}, today = new Date()) => {
  const windowDays = recentHistory(count, allDays, today);
  const reviewed = windowDays.reduce((total, day) => total + day.reviewed, 0);
  const correct = windowDays.reduce((total, day) => total + day.correct, 0);
  const activeDays = windowDays.filter((day) => day.reviewed > 0 || day.sessions > 0).length;
  return {
    reviewed,
    correct,
    activeDays,
    accuracy: reviewed ? Math.round((correct / reviewed) * 100) : 0,
  };
};
