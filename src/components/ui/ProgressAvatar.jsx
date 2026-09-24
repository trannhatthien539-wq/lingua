import { UserRound } from "lucide-react";

/** Chữ đầu của tên/email tài khoản; khách chưa đăng nhập thì để trống. */
const initialsOf = (user) => {
  const source = (user?.displayName || user?.email || "").trim();
  return source ? source.slice(0, 1).toUpperCase() : "";
};

/**
 * Avatar người dùng tròn bọc bởi vòng progress (ring) thể hiện tiến độ
 * học hôm nay (% mục tiêu ngày) — dùng ở Sidebar cạnh logo “lingua.”.
 *
 * Vẽ bằng SVG (stroke-dasharray) nên mượt và không cần ảnh mask.
 * Tailwind không sinh class động nên màu/size truyền qua style.
 */
export default function ProgressAvatar({ user, percent = 0, size = 44 }) {
  const radius = 19; // trong viewBox 44×44
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, Number(percent) || 0));
  const offset = circumference * (1 - clamped / 100);
  const initial = initialsOf(user);

  return (
    <span
      role="img"
      aria-label={`Ảnh đại diện · tiến độ hôm nay ${clamped}%`}
      title={`Tiến độ hôm nay: ${clamped}%`}
      className="relative inline-grid shrink-0 place-items-center"
      style={{ width: size, height: size }}
    >
      <svg className="absolute inset-0 -rotate-90" viewBox="0 0 44 44" aria-hidden="true">
        <circle cx="22" cy="22" r={radius} fill="none" stroke="currentColor" strokeWidth="3" className="text-ink/15 dark:text-white/20" />
        <circle
          cx="22"
          cy="22"
          r={radius}
          fill="none"
          stroke="#58cc02"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 400ms ease" }}
        />
      </svg>
      <span
        className="relative z-10 grid place-items-center overflow-hidden rounded-full bg-lime text-ink"
        style={{ width: size - 10, height: size - 10 }}
      >
        {user?.photoURL ? (
          <img src={user.photoURL} alt="" className="h-full w-full object-cover" />
        ) : initial ? (
          <span className="text-sm font-black">{initial}</span>
        ) : (
          <UserRound size={(size - 10) * 0.55} />
        )}
      </span>
    </span>
  );
}