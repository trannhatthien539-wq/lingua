/**
 * Khung xương khi một module đang được tải lười (Suspense fallback).
 * Giữ đúng nhịp bố cục của trang để không bị "nhảy" khi nội dung thật xuất hiện.
 */
export default function PageSkeleton({ rows = 3 }) {
  return (
    <div className="space-y-4" aria-busy="true" aria-live="polite" aria-label="Đang tải trang">
      <div className="panel overflow-hidden p-5 sm:p-7">
        <div className="flex items-center gap-4">
          <div className="skeleton h-12 w-12 rounded-2xl" />
          <div className="min-w-0 flex-1 space-y-2">
            <div className="skeleton h-3 w-28 rounded-full" />
            <div className="skeleton h-6 w-2/3 max-w-xs rounded-lg" />
          </div>
        </div>
        <div className="mt-5 grid gap-2 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="skeleton h-16 rounded-2xl" />
          ))}
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: rows }).map((_, index) => (
          <div key={index} className="panel space-y-3 p-4">
            <div className="flex items-center gap-3">
              <div className="skeleton h-10 w-10 rounded-xl" />
              <div className="skeleton h-4 w-1/2 rounded-md" />
            </div>
            <div className="skeleton h-3 w-full rounded-md" />
            <div className="skeleton h-3 w-4/5 rounded-md" />
            <div className="skeleton h-2 w-full rounded-full" />
          </div>
        ))}
      </div>
      <span className="sr-only">Đang tải trang…</span>
    </div>
  )
}
