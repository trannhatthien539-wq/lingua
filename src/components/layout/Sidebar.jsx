import { LogIn, LogOut, Moon, Sun, Sparkles } from 'lucide-react'
import { supabase } from '../../services/supabaseClient'
import { navigationItems } from '../../data/navigation'

export default function Sidebar({ activeTab, onTabChange, theme, onToggleTheme, user, onOpenAuth }) {
  return (
    <aside className="flex w-full shrink-0 flex-col border-b border-ink/[0.08] bg-white px-4 py-4 dark:border-white/[0.08] dark:bg-[#1b211f] lg:fixed lg:inset-y-0 lg:left-0 lg:w-[272px] lg:border-b-0 lg:border-r lg:px-5 lg:py-6">
      <div className="flex items-center justify-between lg:block">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-ink text-lime dark:bg-lime dark:text-ink"><Sparkles size={19} /></div>
          <div><p className="font-display text-base font-bold tracking-tight">lingua.</p><p className="text-xs text-ink/40 dark:text-white/40">Language workspace</p></div>
        </div>
        <button onClick={onToggleTheme} className="grid h-9 w-9 place-items-center rounded-lg text-ink/50 transition hover:bg-ink/5 hover:text-ink dark:text-white/50 dark:hover:bg-white/10 dark:hover:text-white" aria-label="Đổi giao diện">
          {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
        </button>
      </div>
      <nav className="mt-6 flex gap-1 overflow-x-auto lg:mt-12 lg:block lg:space-y-1" aria-label="Điều hướng chính">
        {navigationItems.map(({ id, label, description, icon: Icon }) => {
          const isActive = activeTab === id
          return <button key={id} onClick={() => onTabChange(id)} className={`group flex min-w-max items-center gap-3 rounded-xl px-3 py-2.5 text-left transition lg:w-full ${isActive ? 'bg-ink text-white shadow-lg shadow-ink/10 dark:bg-lime dark:text-ink' : 'text-ink/55 hover:bg-ink/5 hover:text-ink dark:text-white/55 dark:hover:bg-white/10 dark:hover:text-white'}`}>
            <Icon size={18} strokeWidth={isActive ? 2.4 : 1.8} />
            <span className="leading-tight"><span className="block text-sm font-semibold">{label}</span><span className={`hidden text-[11px] lg:block ${isActive ? 'text-white/55 dark:text-ink/60' : 'text-ink/35 dark:text-white/35'}`}>{description}</span></span>
          </button>
        })}
      </nav>
      <div className="mt-auto hidden rounded-2xl bg-lime p-4 lg:block"><p className="text-xs font-bold uppercase tracking-[0.14em] text-ink/55">Streak hiện tại</p><p className="mt-2 font-display text-3xl font-bold">12 ngày</p><p className="mt-1 text-xs text-ink/60">Giữ nhịp học mỗi ngày.</p><div className="mt-4 h-1.5 overflow-hidden rounded-full bg-ink/10"><div className="h-full w-[78%] rounded-full bg-ink" /></div></div>
      <div className="mt-5 hidden border-t border-ink/[0.08] pt-5 lg:block dark:border-white/[0.08]">{user ? <div className="flex items-center gap-3"><div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#f2b880] text-xs font-bold">{(user.email || '?').slice(0, 1).toUpperCase()}</div><div className="min-w-0 flex-1"><p className="truncate text-xs font-bold">{user.email}</p><button onClick={() => supabase.auth.signOut()} className="mt-1 flex items-center gap-1 text-[11px] text-ink/45 hover:text-ink dark:text-white/45 dark:hover:text-white"><LogOut size={12} />Đăng xuất</button></div></div> : <div><p className="mb-2 text-[11px] leading-4 text-ink/45 dark:text-white/45">Đăng nhập để đồng bộ dữ liệu đám mây</p><button onClick={onOpenAuth} className="flex w-full items-center gap-2 rounded-xl bg-ink px-3 py-3 text-left text-xs font-bold text-white dark:bg-lime dark:text-ink"><LogIn size={15} />Đăng nhập / Đăng ký</button></div>}</div>
    </aside>
  )
}
