import { useEffect, useState } from "react";
import useDailyGoal from "./useDailyGoal";
import { getHistoryDays, historyChangedEvent, loadHistory } from "../services/historyService";
import { dayKeyOf } from "../utils/day";

/**
 * Tiến độ mục tiêu học hôm nay: số lượt đã ôn / mục tiêu + phần trăm.
 *
 * Dùng cho vòng ring quanh avatar (Sidebar) và chuông thông báo (Topbar):
 * đọc lịch sử từ `historyService` (bộ nhớ đệm) và tự cập nhật khi có
 * `lingua:history-changed` (mỗi lần ghi một phiên học).
 */
export default function useTodayProgress() {
  const { target } = useDailyGoal();
  const [today, setToday] = useState(() => getHistoryDays()[dayKeyOf()]?.reviewed || 0);

  useEffect(() => {
    let active = true;
    const refresh = () => {
      if (active) setToday(getHistoryDays()[dayKeyOf()]?.reviewed || 0);
    };
    loadHistory().then(refresh).catch(() => {});
    window.addEventListener(historyChangedEvent, refresh);
    return () => {
      active = false;
      window.removeEventListener(historyChangedEvent, refresh);
    };
  }, []);

  const percent = target > 0 ? Math.min(100, Math.round((today / target) * 100)) : 0;
  return { today, target, percent };
}