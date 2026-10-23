import { useId } from 'react'

/**
 * Vòng tiến độ SVG dùng chung (mục tiêu ngày, tiến độ bộ thẻ…).
 * Dùng `--accent` của giao diện nên tự đổi màu theo bảng màu người dùng chọn.
 */
export default function GoalRing({
  value = 0,
  size = 88,
  stroke = 8,
  className = '',
  trackClassName = 'text-slate-200/80 dark:text-white/10',
  label,
  children,
}) {
  const safeValue = Math.max(0, Math.min(100, Number(value) || 0))
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const dashOffset = circumference * (1 - safeValue / 100)
  const gradientId = `goal-ring-${useId().replace(/:/g, '')}`

  return (
    <div
      className={`relative grid shrink-0 place-items-center ${className}`}
      style={{ width: size, height: size }}
      role="img"
      aria-label={`${label || 'Tiến độ'}: ${Math.round(safeValue)}%`}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90" aria-hidden="true">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgb(var(--accent))" />
            <stop offset="100%" stopColor="rgb(var(--accent-2))" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          className={trackClassName}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          style={{ transition: 'stroke-dashoffset 700ms cubic-bezier(0.16, 1, 0.3, 1)' }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center leading-none">
        {children ?? (
          <span className="metric text-lg text-slate-900 dark:text-white">{Math.round(safeValue)}%</span>
        )}
      </div>
    </div>
  )
}
