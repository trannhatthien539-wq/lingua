import { Flame, LogIn, LogOut, Moon, Sun } from 'lucide-react'
import ProgressAvatar from '../ui/ProgressAvatar'
import NavIcon from '../ui/NavIcon'
import useTodayProgress from '../../hooks/useTodayProgress'
import { navigationItems } from '../../data/navigation'

// Mục đang chọn phong cách Linear & Apple: dùng biến màu chủ đề tuỳ biến động
const ACTIVE_ITEM = 'border shadow-sm'
const IDLE_ITEM = 'border border-transparent text-slate-600 hover:border-slate-200/80 hover:bg-slate-100/70 hover:text-slate-900 dark:text-slate-400 dark:hover:border-white/[0.08] dark:hover:bg-white/[0.05] dark:hover:text-white'

export default function Sidebar({ activeTab, onTabChange, theme, onToggleTheme, user, streak, onOpenAuth, onSignOut }) {
  const currentStreak = streak?.currentStreak || 0
  const streakProgress = Math.min(100, Math.round((currentStreak / 7) * 100))
  const { percent: todayPercent } = useTodayProgress()
  return (
    <aside className="no-print hidden w-full shrink-0 flex-col border-b border-slate-200/80 bg-white/80 backdrop-blur-2xl px-4 py-4 dark:border-white/[0.08] dark:bg-[#0B0F17]/90 md:flex lg:fixed lg:inset-y-0 lg:left-0 lg:w-[264px] lg:border-b-0 lg:border-r lg:px-5 lg:py-6">
      <div className="flex items-center justify-between gap-3 lg:block">
        <div className="flex items-center gap-3">
          <ProgressAvatar user={user} percent={todayPercent} />
          <div className="flex items-center gap-1.5">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{
                backgroundColor: 'rgb(var(--accent))',
                boxShadow: '0 0 10px rgb(var(--accent))',
              }}
            />
            <p className="font-display text-2xl font-black tracking-tight text-slate-900 dark:text-white">lingua<span style={{ color: 'rgb(var(--accent))' }}>.</span></p>
          </div>
        </div>
        <button onClick={onToggleTheme} className="icon-btn h-10 w-10 border border-slate-200/80 lg:mt-0 dark:border-white/10" aria-label="Đổi giao diện">
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
              className={`flex h-11 min-w-max items-center gap-3 rounded-xl px-3 text-left transition-all duration-200 lg:w-full ${isActive ? ACTIVE_ITEM : IDLE_ITEM}`}
              style={
                isActive
                  ? {
                      borderColor: 'rgba(var(--accent), 0.38)',
                      backgroundColor: 'rgba(var(--accent), 0.12)',
                      color: 'rgb(var(--accent))',
                      boxShadow: '0 2px 14px -2px rgba(var(--accent), 0.22)',
                    }
                  : undefined
              }
            >
              <NavIcon icon={item.icon} color={item.color} size="sm" active={isActive} />
              <span className="min-w-0 truncate text-[13px] font-bold tracking-tight">{item.label}</span>
            </button>
          )
        })}
      </nav>
      <div className="panel-flat mt-auto hidden p-4 lg:block border border-slate-200/80 dark:border-white/[0.08] shadow-sm">
        <div className="flex items-center gap-2.5">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-[0_4px_12px_rgba(245,158,11,0.3)]"><Flame size={20} /></span>
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-500 dark:text-slate-400">Chuỗi ngày học</p>
            <p className="metric text-lg text-slate-900 dark:text-white">{currentStreak > 0 ? `${currentStreak} ngày` : 'Chưa bắt đầu'}</p>
          </div>
        </div>
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Mục tiêu tuần: 7 ngày</p>
        <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-slate-200/80 dark:bg-white/10"><div className="h-full rounded-full transition-all" style={{ width: `${streakProgress}%`, background: 'linear-gradient(90deg, rgb(var(--accent)), rgb(var(--accent-2)))' }} /></div>
      </div>
      <div className="mt-4 hidden border-t border-slate-200/80 pt-4 lg:block dark:border-white/[0.08]">{user ? <div className="flex items-center gap-3"><img src={user.photoURL || ''} alt="" className="h-9 w-9 shrink-0 rounded-full bg-slate-200 object-cover ring-2 ring-emerald-500/20" /><div className="min-w-0 flex-1"><p className="truncate text-sm font-bold text-slate-900 dark:text-white">{user.displayName || user.email}</p><button onClick={onSignOut} className="mt-1 flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"><LogOut size={13} />Đăng xuất</button></div></div> : <div><p className="mb-2 text-xs leading-5 text-slate-500 dark:text-slate-400">Đăng nhập để đồng bộ dữ liệu đám mây</p><button onClick={onOpenAuth} className="btn-primary w-full text-xs min-h-[40px]"><LogIn size={15} />Đăng nhập</button></div>}</div>
    </aside>
  )
}
