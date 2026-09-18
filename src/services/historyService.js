import { createDebouncedSync, loadUserDoc, userDocKeys } from "./userDocService";

/**
 * Lịch sử học tập theo ngày: { days: { "2026-09-18": { reviewed, correct, sessions } } }
 * Lưu theo tài khoản để xem được trên mọi thiết bị.
 */
const MAX_DAYS = 400;
const syncer = createDebouncedSync(userDocKeys.history, 1500);

export const historyChangedEvent = "lingua:history-changed";

export const dayKeyOf = (date = new Date()) => {
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60_000).toISOString().slice(0, 10);
};

let days = null;
let loading = null;

const prune = (allDays) =>
  Object.fromEntries(
    Object.entries(allDays)
      .sort(([first], [second]) => second.localeCompare(first))
      .slice(0, MAX_DAYS),
  );

export const loadHistory = async () => {
  if (days) return days;
  if (!loading) {
    loading = loadUserDoc(userDocKeys.history)
      .then((doc) => {
        days = prune(doc?.payload?.days && typeof doc.payload.days === "object" ? doc.payload.days : {});
        return days;
      })
      .catch(() => {
        days = {};
        return days;
      })
      .finally(() => {
        loading = null;
      });
  }
  return loading;
};

export const getHistoryDays = () => days || {};

export const recordStudyEvent = async ({ reviewed = 0, correct = 0, sessions = 0 } = {}) => {
  if (!reviewed && !sessions) return getHistoryDays();
  const current = await loadHistory();
  const key = dayKeyOf();
  const today = current[key] || { reviewed: 0, correct: 0, sessions: 0 };
  days = prune({
    ...current,
    [key]: {
      reviewed: today.reviewed + reviewed,
      correct: today.correct + correct,
      sessions: today.sessions + sessions,
    },
  });
  syncer.schedule({ days });
  window.dispatchEvent(new Event(historyChangedEvent));
  return days;
};

export const reloadHistory = async () => {
  days = null;
  const next = await loadHistory();
  window.dispatchEvent(new Event(historyChangedEvent));
  return next;
};

/** Xoá bộ đệm trong bộ nhớ khi đổi tài khoản để không hiển thị lịch sử của người khác. */
export const resetHistoryCache = () => {
  days = null;
  loading = null;
};

/** Trả về `count` ngày gần nhất theo thứ tự cũ -> mới để vẽ biểu đồ. */
export const recentHistory = (count = 14, allDays = getHistoryDays()) => {
  const result = [];
  const cursor = new Date();
  for (let index = count - 1; index >= 0; index -= 1) {
    const date = new Date(cursor.getFullYear(), cursor.getMonth(), cursor.getDate() - index);
    const key = dayKeyOf(date);
    const entry = allDays[key] || { reviewed: 0, correct: 0, sessions: 0 };
    result.push({ ...entry, date: key, label: `${date.getDate()}/${date.getMonth() + 1}` });
  }
  return result;
};

export const historySummary = (count = 7, allDays = getHistoryDays()) => {
  const window = recentHistory(count, allDays);
  const reviewed = window.reduce((total, day) => total + day.reviewed, 0);
  const correct = window.reduce((total, day) => total + day.correct, 0);
  const activeDays = window.filter((day) => day.reviewed > 0 || day.sessions > 0).length;
  return {
    reviewed,
    correct,
    activeDays,
    accuracy: reviewed ? Math.round((correct / reviewed) * 100) : 0,
  };
};
