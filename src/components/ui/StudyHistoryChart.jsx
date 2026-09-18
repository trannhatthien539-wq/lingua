import { useEffect, useState } from "react";
import {
  getHistoryDays,
  historyChangedEvent,
  historySummary,
  loadHistory,
  recentHistory,
} from "../../services/historyService";

/** Biểu đồ 14 ngày gần nhất: số từ đã ôn và số từ trả lời đúng. */
export default function StudyHistoryChart({ days = 14 }) {
  const [allDays, setAllDays] = useState(() => getHistoryDays());

  useEffect(() => {
    let active = true;
    const refresh = () => {
      loadHistory().then((next) => {
        if (active) setAllDays({ ...next });
      }).catch(() => {});
    };
    refresh();
    window.addEventListener(historyChangedEvent, refresh);
    return () => {
      active = false;
      window.removeEventListener(historyChangedEvent, refresh);
    };
  }, []);

  const chartDays = recentHistory(days, allDays);
  const summary = historySummary(days, allDays);
  const peak = Math.max(1, ...chartDays.map((day) => day.reviewed));

  return (
    <div className="mt-5 border-t border-ink/[0.08] pt-4 dark:border-white/[0.08]">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-bold uppercase tracking-[0.08em] text-ink/60 dark:text-white/55">{days} ngày gần đây</p>
        <p className="text-xs font-semibold text-ink/60 dark:text-white/55">
          {summary.reviewed} lượt ôn · {summary.activeDays} ngày có học · đúng {summary.accuracy}%
        </p>
      </div>
      {summary.reviewed === 0 ? (
        <p className="mt-3 text-xs text-ink/60 dark:text-white/55">Chưa có dữ liệu. Hoàn thành một lượt luyện tập để bắt đầu thống kê.</p>
      ) : (
        <div className="mt-3 flex h-24 items-end gap-1">
          {chartDays.map((day) => (
            <div key={day.date} className="group relative flex h-full flex-1 flex-col items-center justify-end" title={`${day.date}: ôn ${day.reviewed} từ, đúng ${day.correct}`}>
              <div className="w-full overflow-hidden rounded-t bg-ok/25" style={{ height: `${Math.max(day.reviewed ? 8 : 2, Math.round((day.reviewed / peak) * 100))}%` }}>
                <div className="h-full w-full bg-ok" style={{ height: `${day.reviewed ? Math.round((day.correct / Math.max(day.reviewed, 1)) * 100) : 0}%` }} />
              </div>
              <span className="mt-1 hidden text-xs text-ink/60 group-hover:block dark:text-white/55">{day.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
