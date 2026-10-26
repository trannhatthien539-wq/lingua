import { useEffect, useRef, useState } from "react";
import { Bell, CheckCircle2, Flame, Target } from "lucide-react";
import useTodayProgress from "../hooks/useTodayProgress";

/**
 * Chuông thông báo ở header: badge đỏ hiển thị số thông báo chưa đọc
 * (mục tiêu ngày chưa đạt, chuỗi ngày học đang chờ…).
 */
export default function NotificationBell({ streak, plain = false }) {
  const { today, target, percent } = useTodayProgress();
  const [open, setOpen] = useState(false);
  const [read, setRead] = useState(false);
  const rootRef = useRef(null);
  const streakDays = Number(streak?.currentStreak) || 0;

  const items = [];
  if (target > 0 && percent < 100) {
    items.push({
      icon: Target,
      text: `Còn ${Math.max(0, target - today)} lượt ôn nữa để đạt mục tiêu hôm nay (${today}/${target}).`,
    });
  }
  items.push(
    streakDays > 0
      ? { icon: Flame, text: `Chuỗi ${streakDays} ngày — học hôm nay để không bị đứt chuỗi nhé.` }
      : { icon: Flame, text: "Bắt đầu chuỗi học: hoàn thành ít nhất một phiên học hôm nay." },
  );
  if (target > 0 && percent >= 100) {
    items.push({ icon: CheckCircle2, text: "Đã đạt mục tiêu hôm nay. Giỏi lắm! 🎉" });
  }

  const unread = !read && items.length > 0;
  const unreadCount = unread ? items.length : 0;

  useEffect(() => {
    if (!open) return undefined;
    const onPointerDown = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  const toggle = () => {
    setOpen((value) => !value);
    setRead(true);
  };

  const buttonClass = plain
    ? "relative grid h-10 w-10 place-items-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/[0.08] dark:hover:text-white"
    : "icon-btn relative h-10 w-10 border border-slate-200/80 bg-white/70 shadow-sm backdrop-blur-md transition-all hover:bg-white dark:border-white/10 dark:bg-white/[0.04]";

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label={unread ? `Mở thông báo (${unreadCount} chưa đọc)` : "Mở thông báo"}
        className={buttonClass}
      >
        <Bell size={17} />
        {unread && (
          <span
            className="absolute -right-1 -top-1 min-w-[18px] rounded-full bg-rose-500 px-1.5 py-0.5 text-center text-[10px] font-extrabold leading-3 text-white ring-2 ring-white dark:ring-slate-900"
            aria-hidden="true"
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>
      {open && (
        <div
          role="dialog"
          aria-label="Thông báo"
          className="absolute right-0 top-[calc(100%+8px)] z-[60] w-80 rounded-2xl border border-slate-200/80 bg-white/95 p-3.5 shadow-xl backdrop-blur-2xl dark:border-white/10 dark:bg-[#111827]/95"
        >
          <p className="eyebrow px-1">Thông báo</p>
          <ul className="mt-2 space-y-1.5">
            {items.map((item, index) => (
              <li key={index} className="flex items-start gap-2.5 rounded-xl border border-slate-200/60 bg-slate-50/80 p-2.5 dark:border-white/[0.06] dark:bg-white/[0.03]">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-indigo-500/25 bg-indigo-500/15 text-indigo-600 dark:text-indigo-400">
                  <item.icon size={15} />
                </span>
                <span className="text-xs font-medium leading-5 text-slate-700 dark:text-slate-300">{item.text}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
