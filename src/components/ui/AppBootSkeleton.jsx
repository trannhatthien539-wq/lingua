/**
 * Màn hình chờ đầu tiên (trong lúc Firebase khôi phục phiên đăng nhập).
 * Dùng cùng bố cục với app thật để lúc vào không bị "nhảy" giao diện.
 */
export default function AppBootSkeleton() {
  return (
    <div className="min-h-screen bg-mist text-ink dark:bg-dark1 dark:text-white" aria-busy="true" aria-label="Đang tải Lingua">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <aside className="hidden w-[272px] shrink-0 border-r border-slate-200/80 p-5 dark:border-white/[0.08] lg:block">
          <div className="flex items-center gap-2.5">
            <div className="skeleton h-10 w-10 rounded-2xl" />
            <div className="space-y-1.5">
              <div className="skeleton h-4 w-24 rounded-md" />
              <div className="skeleton h-2 w-16 rounded-full" />
            </div>
          </div>
          <div className="mt-8 space-y-2">
            {Array.from({ length: 7 }).map((_, index) => (
              <div key={index} className="skeleton h-10 rounded-xl" style={{ width: `${88 - (index % 3) * 6}%` }} />
            ))}
          </div>
          <div className="mt-8 skeleton h-28 rounded-2xl" />
        </aside>
        <main className="min-w-0 flex-1 px-4 py-6 sm:px-8 sm:py-9 lg:px-12">
          <div className="space-y-2">
            <div className="skeleton h-3 w-32 rounded-full" />
            <div className="skeleton h-8 w-56 rounded-lg" />
          </div>
          <div className="mt-6 space-y-4">
            <div className="skeleton h-64 rounded-3xl" />
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="skeleton h-24 rounded-2xl" />
              ))}
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="skeleton h-36 rounded-2xl" />
              ))}
            </div>
          </div>
        </main>
      </div>
      <span className="sr-only">Đang tải…</span>
    </div>
  )
}
