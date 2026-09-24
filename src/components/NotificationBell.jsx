import { useEffect, useRef, useState } from "react";
import { Bell, CheckCircle2, Flame, Target } from "lucide-react";
import useTodayProgress from "../hooks/useTodayProgress";

/**
 * Chuông thông báo ở header: badge đỏ hiển thị số thông báo chưa đọc
 * (mục tiêu ngày chưa đạt, chuỗi ngày học đang chờ…).
 *
 * Nội dung lấy từ dữ liệu đã có (mục tiêu + lịch sử + streak) — không tạo
 * hệ thống thông báo mới; mọi thông báo UI khác vẫn qua `toast`.
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
    ? "relative grid h-11 w-11 place-items-center rounded-xl text-ink/60 transition hover:bg-ink/[0.06] hover:text-ink dark:text-white/60 dark:hover:bg-white/10 dark:hover:text-white"
    : "icon-btn relative border border-ink/10 dark:border-white/[0.12]";

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
            className="absolute -right-1 -top-1 min-w-[18px] rounded-full bg-[#e5484d] px-1.5 py-0.5 text-center text-[10px] font-extrabold leading-3 text-white ring-2 ring-mist dark:ring-dark1"
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
          className="absolute right-0 top-[calc(100%+8px)] z-[60] w-72 rounded-2xl border border-ink/10 bg-slab p-3 shadow-soft dark:border-white/10 dark:bg-dark2"
        >
          <p className="eyebrow px-1">Thông báo</p>
          <ul className="mt-2 space-y-1.5">
            {items.map((item, index) => (
              <li key={index} className="flex items-start gap-2.5 rounded-xl bg-slab2 p-2.5 dark:bg-dark3">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-lime/30 text-ink dark:bg-lime/20 dark:text-lime">
                  <item.icon size={15} />
                </span>
                <span className="text-xs leading-5 text-ink/70 dark:text-white/70">{item.text}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}