import { Command, Search } from 'lucide-react'
import SyncStatusBadge from '../ui/SyncStatusBadge'

export default function Topbar({ title, eyebrow, onOpenSearch, user }) {
  return <header className="flex items-center justify-between gap-4 pb-6"><div className="min-w-0"><p className="eyebrow">{eyebrow}</p><h1 className="mt-1 font-display text-2xl font-bold tracking-tight md:text-3xl">{title}</h1></div><div className="flex items-center gap-2"><SyncStatusBadge user={user} /><button onClick={onOpenSearch} className="hidden h-11 items-center gap-2 rounded-xl border border-ink/10 px-3.5 text-sm font-semibold text-ink/60 transition hover:border-ink/20 hover:text-ink sm:flex dark:border-white/[0.12] dark:text-white/60 dark:hover:border-white/25 dark:hover:text-white" aria-label="Mở tìm kiếm"><Search size={16} />Tìm kiếm<span className="ml-2 flex items-center gap-0.5 rounded-md border border-ink/10 px-1.5 py-0.5 text-xs text-ink/60 dark:border-white/15 dark:text-white/60"><Command size={12} />K</span></button></div></header>
}
