/**
 * Tiêu đề section dùng chung: một cấp tiêu đề duy nhất + metadata ngắn + hành động bên phải.
 * Thay cho pattern "eyebrow + heading" lặp lại ở nhiều trang.
 */
export default function SectionHeader({ title, meta, action, className = '' }) {
  return (
    <div className={`flex flex-wrap items-end justify-between gap-3 ${className}`}>
      <div className="min-w-0">
        <h2 className="font-display text-lg font-black tracking-tight text-slate-900 dark:text-white sm:text-xl">
          {title}
        </h2>
        {meta && (
          <p className="mt-0.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
            {meta}
          </p>
        )}
      </div>
      {action}
    </div>
  )
}
