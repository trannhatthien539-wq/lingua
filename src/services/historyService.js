import { dayKeyOf } from "../utils/day.js";
import { MAX_DAYS, historySummary, pruneDays, recentHistory } from "../utils/history.js";
import { createDebouncedSync, loadUserDoc, userDocKeys } from "./userDocService";

/**
 * Lịch sử học tập theo ngày: { days: { "2026-09-18": { reviewed, correct, sessions } } }
 * Lưu theo tài khoản để xem được trên mọi thiết bị.
 *
 * File này chỉ lo nạp/ghi; các hàm thuần (pruneDays/recentHistory/historySummary) nằm ở
 * `src/utils/history.js` để có test, và khoá ngày lấy từ `src/utils/day.js` (một nguồn duy nhất).
 */
const syncer = createDebouncedSync(userDocKeys.history, 1500);

export const historyChangedEvent = "lingua:history-changed";

let days = null;
let loading = null;

const notifyChanged = () => {
  if (typeof window !== "undefined") window.dispatchEvent(new Event(historyChangedEvent));
};

export const loadHistory = async () => {
  if (days) return days;
  if (!loading) {
    loading = loadUserDoc(userDocKeys.history)
      .then((doc) => {
        days = pruneDays(doc?.payload?.days && typeof doc.payload.days === "object" ? doc.payload.days : {});
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
  days = pruneDays({
    ...current,
    [key]: {
      reviewed: today.reviewed + reviewed,
      correct: today.correct + correct,
      sessions: today.sessions + sessions,
    },
  });
  syncer.schedule({ days });
  notifyChanged();
  return days;
};

export const reloadHistory = async () => {
  days = null;
  const next = await loadHistory();
  notifyChanged();
  return next;
};

/** Xoá bộ đệm trong bộ nhớ khi đổi tài khoản để không hiển thị lịch sử của người khác. */
export const resetHistoryCache = () => {
  days = null;
  loading = null;
};

/** Giữ lại đúng API cũ cho các component (StudyHistoryChart, ProgressHub) nhưng thân hàm nằm ở utils/history.js. */
export { MAX_DAYS, historySummary, recentHistory };
