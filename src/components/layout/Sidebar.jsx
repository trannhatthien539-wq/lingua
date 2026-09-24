import { Flame, LogIn, LogOut, Moon, Sun } from 'lucide-react'
import ProgressAvatar from '../ui/ProgressAvatar'
import NavIcon from '../ui/NavIcon'
import useTodayProgress from '../../hooks/useTodayProgress'
import { navigationItems } from '../../data/navigation'

// Mục đang chọn giống Duolingo: nền xanh nhạt + viền xanh + chữ xanh.
const ACTIVE_ITEM = 'border-2 border-[#84d8ff] bg-[#ddf4ff] text-[#1899d6] dark:border-[#1cb0f6]/50 dark:bg-[#1cb0f6]/20 dark:text-[#84d8ff]'
const IDLE_ITEM = 'border-2 border-transparent text-ink/60 hover:bg-ink/[0.04] hover:text-ink dark:text-white/60 dark:hover:bg-white/[0.08] dark:hover:text-white'

export default function Sidebar({ activeTab, onTabChange, theme, onToggleTheme, user, streak, onOpenAuth, onSignOut }) {
  const currentStreak = streak?.currentStreak || 0
  const streakProgress = Math.min(100, Math.round((currentStreak / 7) * 100))
  const { percent: todayPercent } = useTodayProgress()
  return (
    <aside className="no-print hidden w-full shrink-0 flex-col border-b border-ink/[0.08] bg-slab px-4 py-4 dark:border-white/[0.08] dark:bg-dark2 md:flex lg:fixed lg:inset-y-0 lg:left-0 lg:w-[264px] lg:border-b-0 lg:border-r lg:px-5 lg:py-6">
      <div className="flex items-center justify-between gap-3 lg:block">
        <div className="flex items-center gap-2.5">
          <ProgressAvatar user={user} percent={todayPercent} />
          <p className="font-display text-2xl font-bold tracking-tight text-[#58cc02]">lingua<span className="text-ink/50 dark:text-white/45">.</span></p>
        </div>
        <button onClick={onToggleTheme} className="icon-btn h-10 w-10 border border-ink/10 lg:mt-0 dark:border-white/15" aria-label="Đổi giao diện">
          {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
        </button>
      </div>
      <nav className="mt-4 flex gap-1.5 overflow-x-auto pb-1 lg:mt-7 lg:block lg:space-y-1.5 lg:overflow-visible lg:pb-0" aria-label="Điều hướng chính">
        {navigationItems.map((item) => {
          const isActive = activeTab === item.id
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onTabChange(item.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`flex min-h-[52px] min-w-max items-center gap-3 rounded-2xl px-3 py-2 text-left transition lg:w-full ${isActive ? ACTIVE_ITEM : IDLE_ITEM}`}
            >
              <NavIcon icon={item.icon} color={item.color} size="sm" />
              <span className="min-w-0">
                <span className="block text-[13px] font-bold uppercase tracking-[0.06em]">{item.label}</span>
                <span className={`hidden text-xs lg:block ${isActive ? 'text-[#1899d6]/80 dark:text-[#84d8ff]/80' : 'text-ink/55 dark:text-white/50'}`}>{item.description}</span>
              </span>
            </button>
          )
        })}
      </nav>
      <div className="panel-flat mt-auto hidden p-4 lg:block">
        <div className="flex items-center gap-2.5">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#ff9600] text-white" style={{ boxShadow: 'inset 0 -3px 0 rgba(0,0,0,0.18)' }}><Flame size={20} /></span>
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.08em] text-ink/60 dark:text-white/55">Chuỗi ngày học</p>
            <p className="metric text-xl">{currentStreak > 0 ? `${currentStreak} ngày` : 'Chưa bắt đầu'}</p>
          </div>
        </div>
        <p className="mt-2 text-xs text-ink/60 dark:text-white/55">Mục tiêu tuần: 7 ngày.</p>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-ink/10 dark:bg-white/15"><div className="h-full rounded-full bg-[#ff9600] transition-all" style={{ width: `${streakProgress}%` }} /></div>
      </div>
      <div className="mt-5 hidden border-t border-ink/[0.08] pt-5 lg:block dark:border-white/[0.08]">{user ? <div className="flex items-center gap-3"><img src={user.photoURL || ''} alt="" className="h-9 w-9 shrink-0 rounded-full bg-sage/40 object-cover" /><div className="min-w-0 flex-1"><p className="truncate text-sm font-bold">{user.displayName || user.email}</p><button onClick={onSignOut} className="mt-1.5 flex items-center gap-1 text-xs font-semibold text-ink/60 hover:text-ink dark:text-white/60 dark:hover:text-white"><LogOut size={13} />Đăng xuất</button></div></div> : <div><p className="mb-2.5 text-xs leading-5 text-ink/60 dark:text-white/55">Đăng nhập để đồng bộ dữ liệu lên đám mây</p><button onClick={onOpenAuth} className="btn-primary w-full"><LogIn size={16} />Đăng nhập</button></div>}</div>
    </aside>
  )
}
