import { Command, HelpCircle, Search, Sparkles } from 'lucide-react'
import SyncStatusBadge from '../ui/SyncStatusBadge'
import NotificationBell from '../NotificationBell'

export default function Topbar({ title, eyebrow, onOpenSearch, onOpenTutor, onOpenShortcuts, user, streak }) {
  const buttonClass = 'inline-flex h-10 shrink-0 items-center gap-2 rounded-xl border border-slate-200/80 bg-white/60 px-3.5 text-xs font-semibold text-slate-600 shadow-sm backdrop-blur-md transition-all hover:border-indigo-400/50 hover:bg-white hover:text-slate-900 active:scale-[0.98] dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300 dark:hover:border-white/20 dark:hover:bg-white/[0.08] dark:hover:text-white'
  return (
    <header className="no-print flex items-center justify-between gap-3 pb-4 md:gap-5 md:pb-7">
      <div className="min-w-0 flex-1">
        <p className="eyebrow truncate text-indigo-600/80 dark:text-indigo-400/80">{eyebrow}</p>
        <h1 className="mt-0.5 truncate font-display text-2xl font-black tracking-tight text-slate-900 md:text-3xl dark:text-white">{title}</h1>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <span className="hidden md:block"><SyncStatusBadge user={user} /></span>
        <button onClick={onOpenTutor} className={`${buttonClass} hidden sm:inline-flex`} aria-label="Mở gia sư AI">
          <Sparkles size={15} className="text-emerald-500" />
          <span>Gia sư AI</span>
        </button>
        <span className="hidden sm:block"><NotificationBell streak={streak} /></span>
        <button onClick={onOpenSearch} className={buttonClass} aria-label="Mở tìm kiếm">
          <Search size={15} className="text-slate-400 dark:text-slate-500" />
          <span className="hidden sm:inline">Tìm kiếm</span>
          <span className="ml-1.5 hidden items-center gap-0.5 rounded-lg border border-slate-200 bg-slate-100/80 px-1.5 py-0.5 font-mono text-[10px] font-bold text-slate-500 sm:flex dark:border-white/10 dark:bg-white/[0.06] dark:text-slate-400">
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
