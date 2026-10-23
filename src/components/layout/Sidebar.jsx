import { Flame, LogIn, LogOut, Moon, Sun } from 'lucide-react'
import ProgressAvatar from '../ui/ProgressAvatar'
import NavIcon from '../ui/NavIcon'
import AppMark from '../AppMark'
import GoalRing from '../ui/GoalRing'
import useTodayProgress from '../../hooks/useTodayProgress'
import { navigationGroups, navigationItems } from '../../data/navigation'

const ACTIVE_ITEM = 'border shadow-sm'
const IDLE_ITEM = 'border border-transparent text-slate-600 hover:border-slate-200/80 hover:bg-slate-100/70 hover:text-slate-900 dark:text-slate-400 dark:hover:border-white/[0.08] dark:hover:bg-white/[0.05] dark:hover:text-white'

const activeStyle = {
  borderColor: 'rgba(var(--accent), 0.30)',
  backgroundColor: 'rgba(var(--accent), 0.10)',
  color: 'rgb(var(--accent))',
  boxShadow: '0 6px 18px -10px rgba(var(--accent), 0.45)',
}

function ActiveRail() {
  return (
    <span
      className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full"
      style={{ backgroundColor: 'rgb(var(--accent))' }}
      aria-hidden="true"
    />
  )
}

export default function Sidebar({ activeTab, onTabChange, onPrefetch, theme, onToggleTheme, user, streak, onOpenAuth, onSignOut }) {
  const currentStreak = streak?.currentStreak || 0
  const streakProgress = Math.min(100, Math.round((currentStreak / 7) * 100))
  const { today, target, percent: todayPercent } = useTodayProgress()

  const prefetch = (id) => onPrefetch?.(id)

  return (
    <aside className="no-print hidden w-full shrink-0 flex-col border-b border-slate-200/80 bg-white/80 px-4 py-4 backdrop-blur-2xl dark:border-white/[0.08] dark:bg-[#0B0F17]/90 md:flex lg:fixed lg:inset-y-0 lg:left-0 lg:w-[272px] lg:overflow-y-auto lg:border-b-0 lg:border-r lg:px-5 lg:py-6 no-scrollbar">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
            <div
              className="grid h-10 w-10 place-items-center rounded-2xl border p-1 shadow-sm backdrop-blur-md"
              style={{ borderColor: 'rgba(var(--accent), 0.25)', background: 'linear-gradient(135deg, rgba(var(--accent), 0.16), rgba(var(--accent-2), 0.08))' }}
            >
              <AppMark className="h-8 w-8 drop-shadow-sm transition-transform duration-200 hover:scale-105" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: 'rgb(var(--accent))', boxShadow: '0 0 10px rgba(var(--accent), 0.7)' }}
                />
                <p className="font-display text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                  lingua<span style={{ color: 'rgb(var(--accent))' }}>.</span>
                </p>
              </div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">learning hub</p>
            </div>
          </div>
          <button onClick={onToggleTheme} className="icon-btn h-9 w-9 border border-slate-200/80 dark:border-white/10" aria-label="Đổi giao diện">
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>

      {/* Menu trên desktop: phân nhóm tinh tế */}
      <nav className="mt-5 hidden lg:block lg:space-y-5" aria-label="Điều hướng chính">
        {navigationGroups.map((group) => {
          const items = group.itemIds.map((id) => navigationItems.find((item) => item.id === id)).filter(Boolean)
          return (
            <div key={group.id} className="space-y-1">
              <p className="px-3 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">{group.label}</p>
              {items.map((item) => {
                const isActive = activeTab === item.id
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onTabChange(item.id)}
                    onMouseEnter={() => prefetch(item.id)}
                    onFocus={() => prefetch(item.id)}
                    aria-current={isActive ? 'page' : undefined}
                    className={`relative flex h-10 w-full items-center gap-3 rounded-xl px-3 text-left transition-all duration-200 ${isActive ? ACTIVE_ITEM : IDLE_ITEM}`}
                    style={isActive ? activeStyle : undefined}
                  >
                    {isActive && <ActiveRail />}
                    <NavIcon icon={item.icon} color={item.color} darkColor={item.colorDark} size="sm" active={isActive} />
                    <span className="min-w-0 truncate text-[13px] font-bold tracking-tight">{item.label}</span>
                    {isActive && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-current opacity-70" aria-hidden="true" />}
                  </button>
                )
              })}
            </div>
          )
        })}
      </nav>

      {/* Menu trên tablet (ngang cuộn) */}
      <nav className="mt-4 flex gap-1.5 overflow-x-auto pb-1 lg:hidden no-scrollbar" aria-label="Điều hướng tablet">
        {navigationItems.map((item) => {
          const isActive = activeTab === item.id
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onTabChange(item.id)}
              onMouseEnter={() => prefetch(item.id)}
              onFocus={() => prefetch(item.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`relative flex h-10 min-w-max items-center gap-2.5 rounded-xl px-3 text-left transition-all duration-200 ${isActive ? ACTIVE_ITEM : IDLE_ITEM}`}
              style={isActive ? activeStyle : undefined}
            >
              <NavIcon icon={item.icon} color={item.color} darkColor={item.colorDark} size="sm" active={isActive} />
              <span className="min-w-0 truncate text-[13px] font-bold tracking-tight">{item.label}</span>
            </button>
          )
        })}
      </nav>

      {/* Trang chủ đã có thẻ Daily Goal đầy đủ trong Hero; tránh lặp lại trên desktop. */}
      {activeTab !== 'home' && (
        <div className="panel-flat mt-auto hidden p-3.5 lg:block border border-slate-200/80 dark:border-white/[0.08] shadow-sm">
        <div className="flex items-center justify-between gap-2">
          <p className="eyebrow">Hôm nay</p>
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 dark:text-amber-300" title={`Chuỗi ${currentStreak} ngày`}>
            <Flame size={12} />
            {currentStreak > 0 ? `${currentStreak} ngày` : 'Bắt đầu'}
          </span>
        </div>
        <div className="mt-2.5 flex items-center gap-3">
          <GoalRing value={todayPercent} size={54} stroke={6} label="Mục tiêu hôm nay">
            <div className="text-center">
              <p className="metric text-sm leading-none text-slate-900 dark:text-white">{todayPercent}%</p>
            </div>
          </GoalRing>
          <div className="min-w-0">
            <p className="text-sm font-bold text-slate-900 dark:text-white">
              {today}/{target} <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">lượt ôn</span>
            </p>
            <p className="mt-0.5 text-[11px] font-medium text-slate-500 dark:text-slate-400">
              {todayPercent >= 100 ? 'Đã đạt mục tiêu 🎉' : 'Mục tiêu hôm nay'}
            </p>
          </div>
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-200/80 dark:bg-white/10">
          <div className="h-full rounded-full transition-all duration-700" style={{ width: `${streakProgress}%`, background: 'linear-gradient(90deg, rgb(var(--accent)), rgb(var(--accent-2)))' }} />
        </div>
        <p className="mt-1.5 text-[10px] font-semibold text-slate-500 dark:text-slate-400">Chuỗi tuần: {Math.min(currentStreak, 7)}/7 ngày</p>
        </div>
      )}

      <div className="mt-4 hidden border-t border-slate-200/80 pt-4 lg:mt-auto lg:block dark:border-white/[0.08]">
        {user ? (
          <div className="flex items-center gap-3">
            <ProgressAvatar user={user} percent={todayPercent} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-slate-900 dark:text-white">{user.displayName || user.email}</p>
              <button onClick={onSignOut} className="mt-1 flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
                <LogOut size={13} />Đăng xuất
              </button>
            </div>
          </div>
        ) : (
          <div>
            <p className="mb-2 text-xs leading-5 text-slate-500 dark:text-slate-400">Đăng nhập để đồng bộ dữ liệu đám mây</p>
            <button onClick={onOpenAuth} className="btn-primary w-full text-xs min-h-[40px]"><LogIn size={15} />Đăng nhập</button>
          </div>
        )}
      </div>
    </aside>
  )
}
