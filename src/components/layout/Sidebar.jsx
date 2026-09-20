import { LogIn, LogOut, Moon, Sun } from 'lucide-react'
import AppMark from '../AppMark'
import { navigationItems } from '../../data/navigation'

export default function Sidebar({ activeTab, onTabChange, theme, onToggleTheme, user, streak, onOpenAuth, onSignOut }) {
  const currentStreak = streak?.currentStreak || 0
  const streakProgress = Math.min(100, Math.round((currentStreak / 7) * 100))
  return (
    <aside className="no-print hidden w-full shrink-0 flex-col border-b border-ink/[0.08] bg-slab px-4 py-4 dark:border-white/[0.08] dark:bg-dark2 md:flex lg:fixed lg:inset-y-0 lg:left-0 lg:w-[264px] lg:border-b-0 lg:border-r lg:px-5 lg:py-6">
      <div className="flex items-center justify-between lg:block">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-lime/25 dark:bg-lime/20"><AppMark className="h-8 w-8" /></div>
          <div><p className="font-display text-base font-bold tracking-tight">lingua.</p><p className="text-xs text-ink/60 dark:text-white/55">Không gian học tập</p></div>
        </div>
        <button onClick={onToggleTheme} className="icon-btn mt-0 lg:mt-0" aria-label="Đổi giao diện">
          {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
        </button>
      </div>
      <nav className="mt-6 flex gap-1 overflow-x-auto lg:mt-12 lg:block lg:space-y-1" aria-label="Điều hướng chính">
        {navigationItems.map(({ id, label, description, icon: Icon }) => {
          const isActive = activeTab === id
          return <button key={id} onClick={() => onTabChange(id)} className={`group flex min-h-[44px] min-w-max items-center gap-3 rounded-xl px-3 py-2.5 text-left transition lg:w-full ${isActive ? 'bg-lime text-ink' : 'text-ink/60 hover:bg-ink/5 hover:text-ink dark:text-white/60 dark:hover:bg-white/10 dark:hover:text-white'}`}>
            <Icon size={18} strokeWidth={isActive ? 2.4 : 1.8} />
            <span className="leading-tight"><span className={`block text-sm ${isActive ? 'font-bold' : 'font-semibold'}`}>{label}</span><span className={`hidden text-xs lg:block ${isActive ? 'text-ink/60' : 'text-ink/60 dark:text-white/50'}`}>{description}</span></span>
          </button>
        })}
      </nav>
      <div className="panel-flat mt-auto hidden p-4 lg:block"><p className="text-xs font-bold uppercase tracking-[0.08em] text-ink/60 dark:text-white/55">Chuỗi ngày học</p><p className="metric mt-1.5 text-2xl">{currentStreak > 0 ? `${currentStreak} ngày` : 'Chưa bắt đầu'}</p><p className="mt-1 text-xs text-ink/60 dark:text-white/55">Mục tiêu tuần: 7 ngày.</p><div className="mt-3 h-1.5 overflow-hidden rounded-full bg-ink/10 dark:bg-white/15"><div className="h-full rounded-full bg-lime transition-all" style={{ width: `${streakProgress}%` }} /></div></div>
      <div className="mt-5 hidden border-t border-ink/[0.08] pt-5 lg:block dark:border-white/[0.08]">{user ? <div className="flex items-center gap-3"><img src={user.photoURL || ''} alt="" className="h-9 w-9 shrink-0 rounded-full bg-sage/40 object-cover" /><div className="min-w-0 flex-1"><p className="truncate text-sm font-bold">{user.displayName || user.email}</p><button onClick={onSignOut} className="mt-1.5 flex items-center gap-1 text-xs font-semibold text-ink/60 hover:text-ink dark:text-white/60 dark:hover:text-white"><LogOut size={13} />Đăng xuất</button></div></div> : <div><p className="mb-2.5 text-xs leading-5 text-ink/60 dark:text-white/55">Đăng nhập để đồng bộ dữ liệu lên đám mây</p><button onClick={onOpenAuth} className="btn-primary w-full"><LogIn size={16} />Đăng nhập</button></div>}</div>
    </aside>
  )
}
