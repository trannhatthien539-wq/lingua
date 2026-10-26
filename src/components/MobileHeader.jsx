import { useState } from 'react';
import { LogIn, LogOut, Moon, Sun, X } from 'lucide-react';
import AppMark from './AppMark';
import NotificationBell from './NotificationBell';
import SyncStatusBadge from './ui/SyncStatusBadge';

export default function MobileHeader({ user, streak, onOpenAuth, onSignOut, theme, onToggleTheme }) {
  const [open, setOpen] = useState(false);
  const initials = (user?.displayName || user?.email || 'Guest').trim().slice(0, 1).toUpperCase();

  return (
    <>
      <header className="no-print sticky top-0 z-40 flex items-center justify-between gap-2 border-b border-slate-200/80 bg-white/85 px-3.5 py-2.5 backdrop-blur-xl dark:border-white/[0.08] dark:bg-[#0B0F17]/90 md:hidden">
        <div className="flex min-w-0 flex-1 items-center gap-2.5">
          <AppMark className="h-10 w-10 shrink-0 rounded-2xl drop-shadow-sm transition-transform active:scale-95" />
          <div className="min-w-0">
            <p className="font-display text-base font-black tracking-tight text-slate-900 dark:text-white">
              lingua<span style={{ color: 'rgb(var(--accent))' }}>.</span>
            </p>
            <p className="truncate text-[11px] font-medium text-slate-500 dark:text-slate-400">
              {streak?.currentStreak > 0 ? `${streak.currentStreak} ngày chuỗi` : 'Bắt đầu học hôm nay'}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <span className="hidden sm:block"><SyncStatusBadge user={user} compact /></span>
          <NotificationBell streak={streak} plain />
          <button
            onClick={onToggleTheme}
            className="grid h-10 w-10 place-items-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/[0.08] dark:hover:text-white"
            aria-label="Đổi chế độ sáng tối"
          >
            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          </button>
          {user ? (
            <button
              onClick={() => setOpen((value) => !value)}
              className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-full text-sm font-black text-white shadow-inner transition hover:scale-105"
              style={{ background: 'linear-gradient(135deg, rgb(var(--accent)), rgb(var(--accent-2)))' }}
              aria-label="Mở tài khoản"
            >
              {user.photoURL ? <img src={user.photoURL} alt="" className="h-full w-full object-cover" /> : initials}
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              aria-label="Đăng nhập"
              className="flex h-10 min-w-[40px] items-center justify-center gap-1.5 rounded-xl border border-slate-200/80 bg-white/70 px-0 text-xs font-bold text-slate-700 shadow-sm backdrop-blur-md transition hover:bg-white sm:px-3.5 dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-200"
            >
              <LogIn size={16} />
              <span className="hidden sm:inline">Đăng nhập</span>
            </button>
          )}
        </div>
      </header>
      {user && open && (
        <div className="fixed inset-x-4 top-16 z-[60] rounded-2xl border border-slate-200/80 bg-white/95 p-4 shadow-xl backdrop-blur-2xl dark:border-white/10 dark:bg-[#111827]/95">
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full font-black text-white shadow-inner" style={{ background: 'linear-gradient(135deg, rgb(var(--accent)), rgb(var(--accent-2)))' }}>
                {initials}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-slate-900 dark:text-white">{user.displayName || 'Tài khoản Google'}</p>
                <p className="truncate text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="icon-btn -mr-2" aria-label="Đóng">
              <X size={18} />
            </button>
          </div>
          <button
            onClick={onSignOut}
            className="mt-4 flex min-h-[44px] w-full items-center gap-2 rounded-xl bg-rose-50 px-3.5 py-3 text-left text-sm font-bold text-rose-600 transition hover:bg-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:hover:bg-rose-500/20"
          >
            <LogOut size={16} />Đăng xuất
          </button>
        </div>
      )}
    </>
  );
}
