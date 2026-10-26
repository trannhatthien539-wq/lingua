import { useEffect, useState } from "react";
import {
  getHistoryDays,
  historyChangedEvent,
  historySummary,
  loadHistory,
  recentHistory,
} from "../../services/historyService";

const dayAria = (day) =>
  `${day.date}: ôn ${day.reviewed} từ, trả lời đúng ${day.correct}${day.reviewed ? ` (${Math.round((day.correct / day.reviewed) * 100)}%)` : ""}`;

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
  const labelEvery = chartDays.length > 10 ? 3 : 2;

  return (
    <div className="pt-1">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-600 dark:text-slate-400">
            <span className="h-2 w-2 rounded-full bg-gradient-to-t from-[rgb(var(--accent))] to-[rgb(var(--accent-2))]" aria-hidden="true" />
            Đã ôn
          </span>
          <span className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-600 dark:text-slate-400">
            <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
            Đúng
          </span>
        </div>
        <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
          {summary.reviewed} lượt · {summary.activeDays} ngày · đúng {summary.accuracy}%
        </p>
      </div>

      {summary.reviewed === 0 ? (
        <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">Chưa có dữ liệu học tập.</p>
      ) : (
        <div
          className="mt-4 flex h-32 items-end gap-1 sm:gap-1.5"
          role="group"
          aria-label={`Biểu đồ ${days} ngày gần đây: ${summary.reviewed} lượt ôn, đúng ${summary.accuracy}%`}
        >
          {chartDays.map((day, index) => {
            const height = day.reviewed ? Math.max(6, Math.round((day.reviewed / peak) * 100)) : 2;
            const accuracy = day.reviewed ? Math.round((day.correct / Math.max(day.reviewed, 1)) * 100) : 0;
            const showLabel = index === 0 || index === chartDays.length - 1 || (index + 1) % labelEvery === 0;
            return (
              <div key={day.date} className="group relative flex h-full min-w-0 flex-1 flex-col items-center justify-end" title={dayAria(day)}>
                <span className="pointer-events-none absolute -top-1 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-900 px-2 py-0.5 text-[10px] font-bold text-white opacity-0 shadow-md transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 dark:bg-white dark:text-slate-900" aria-hidden="true">
                  {day.reviewed}
                </span>
                <div
                  tabIndex={0}
                  role="img"
                  aria-label={dayAria(day)}
                  className="relative w-full max-w-[22px] overflow-hidden rounded-t-[4px] bg-slate-200/70 outline-none transition-[height] duration-500 ease-out focus-visible:ring-2 focus-visible:ring-[rgb(var(--accent))] dark:bg-white/10"
                  style={{ height: `${height}%` }}
                >
                  <div
                    className="absolute inset-x-0 bottom-0 rounded-t-[4px] bg-gradient-to-t from-[rgb(var(--accent))] to-[rgb(var(--accent-2))] opacity-90"
                    style={{ height: "100%" }}
                  >
                    <div className="absolute inset-x-0 bottom-0 bg-emerald-500 transition-[height]" style={{ height: `${accuracy}%` }} />
                  </div>
                </div>
                <span className={`mt-1.5 h-3 text-[10px] font-medium tabular-nums ${showLabel ? "text-slate-500 dark:text-slate-400" : "text-transparent"}`} aria-hidden="true">
                  {showLabel ? day.label : "·"}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
