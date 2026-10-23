import { useEffect, useState } from 'react'
import { Command, Flame, HelpCircle, Search, Sparkles } from 'lucide-react'
import SyncStatusBadge from '../ui/SyncStatusBadge'
import NotificationBell from '../NotificationBell'

/**
 * Thanh tiêu đề của từng tab.
 *
 * Trên desktop thanh này dính ở đầu vùng nội dung và chỉ hiện nền kính khi đã cuộn
 * (giống Linear/Notion) — vừa giữ ngữ cảnh, vừa không chiếm thêm diện tích khi ở đầu trang.
 */
export default function Topbar({ title, eyebrow, accent = '#4F46E5', activeTab, onOpenSearch, onPrefetchSearch, onOpenTutor, onPrefetchTutor, onOpenShortcuts, user, streak }) {
  const [scrolled, setScrolled] = useState(false)
  const streakDays = Number(streak?.currentStreak) || 0
  const isHome = activeTab === 'home' || title === 'Trang chủ'

  useEffect(() => {
    let frame = 0
    const onScroll = () => {
      if (frame) return
      frame = window.requestAnimationFrame(() => {
        frame = 0
        setScrolled(window.scrollY > 8)
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  const buttonClass = 'inline-flex h-10 shrink-0 items-center gap-2 rounded-xl border border-slate-200/80 bg-white/70 px-3.5 text-xs font-semibold text-slate-600 shadow-sm backdrop-blur-md transition-all hover:border-slate-300 hover:bg-white hover:text-slate-900 active:scale-[0.98] dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300 dark:hover:border-white/20 dark:hover:bg-white/[0.08] dark:hover:text-white'

  return (
    <header
      className={`no-print md:sticky md:top-0 md:z-30 md:-mx-8 md:-mt-9 md:mb-5 md:border-b md:px-8 md:pb-4 md:pt-6 lg:-mx-12 lg:px-12 ${
        scrolled
          ? 'md:border-slate-200/70 md:bg-mist/85 md:shadow-[0_16px_40px_-28px_rgba(15,23,42,0.35)] md:backdrop-blur-xl dark:md:border-white/[0.07] dark:md:bg-dark1/80'
          : 'md:border-transparent md:bg-transparent'
      } flex items-center justify-between gap-3 ${isHome ? 'max-md:pb-1 max-md:pt-0' : 'pb-4'} transition-colors duration-300 md:gap-5`}
    >
      <div className={`min-w-0 flex-1 ${isHome ? 'hidden md:block' : ''}`}>
        {!isHome && eyebrow && (
          <p className="eyebrow flex items-center gap-1.5 truncate">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: accent, boxShadow: `0 0 8px ${accent}80` }} aria-hidden="true" />
            <span className="truncate text-slate-600 dark:text-slate-300">{eyebrow}</span>
          </p>
        )}
        <h1 className={`${!isHome ? 'mt-1' : ''} truncate font-display text-xl font-black tracking-tight text-slate-900 md:text-[1.9rem] dark:text-white`}>{title}</h1>
      </div>

      <div className={`flex shrink-0 items-center gap-2 ${isHome ? 'w-full justify-end md:w-auto' : ''}`}>
        {streakDays > 0 && (
          <span
            className="hidden h-10 items-center gap-1.5 rounded-xl border border-amber-500/25 bg-amber-500/10 px-3 text-xs font-bold text-amber-700 backdrop-blur-md dark:border-amber-400/25 dark:bg-amber-400/10 dark:text-amber-300 lg:inline-flex"
            title={`Chuỗi ${streakDays} ngày học`}
          >
            <Flame size={15} className="text-amber-500" />
            {streakDays} ngày
          </span>
        )}
        <span className="hidden md:block"><SyncStatusBadge user={user} /></span>
        <button
          onClick={onOpenTutor}
          onMouseEnter={onPrefetchTutor}
          onFocus={onPrefetchTutor}
          className={`${buttonClass} ${isHome ? 'inline-flex' : 'hidden sm:inline-flex'}`}
          aria-label="Mở gia sư AI"
        >
          <Sparkles size={15} className="text-emerald-500" />
          <span>Gia sư AI</span>
        </button>
        <span className="hidden sm:block"><NotificationBell streak={streak} /></span>
        <button
          onClick={onOpenSearch}
          onMouseEnter={onPrefetchSearch}
          onFocus={onPrefetchSearch}
          className={`${buttonClass} group`}
          aria-label="Mở tìm kiếm (Ctrl K)"
          title="Tìm kiếm (Ctrl/⌘ + K)"
        >
          <Search size={15} className="text-slate-400 transition-colors group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300" />
          <span className="hidden sm:inline">Tìm kiếm</span>
          <span className="ml-1.5 hidden items-center gap-0.5 rounded-md border border-slate-200 bg-slate-100/80 px-1.5 py-0.5 font-mono text-[10px] font-bold text-slate-500 sm:flex dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-400">
            <Command size={10} />K
          </span>
        </button>
        <button onClick={onOpenShortcuts} className="btn-secondary hidden h-10 px-3.5 text-xs md:inline-flex" aria-label="Xem phím tắt" title="Phím tắt (?)">
          <HelpCircle size={15} />
          <span>Phím tắt</span>
        </button>
      </div>
    </header>
  )
}
