import { useState } from 'react';
import { LogIn, LogOut, Moon, Sun, X } from 'lucide-react';
import AppMark from './AppMark';
import NotificationBell from './NotificationBell';
import SyncStatusBadge from './ui/SyncStatusBadge';

export default function MobileHeader({ user, streak, onOpenAuth, onSignOut, theme, onToggleTheme }) {
  const [open, setOpen] = useState(false);
  const initials = (user?.displayName || user?.email || 'Guest').trim().slice(0, 1).toUpperCase();

  return <>
    <header className="no-print sticky top-0 z-40 flex items-center justify-between gap-2 border-b border-ink/10 bg-slab/95 px-3.5 py-2.5 backdrop-blur-md dark:border-white/10 dark:bg-dark1/95 md:hidden">
      <div className="flex min-w-0 flex-1 items-center gap-2.5"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-lime/25 dark:bg-lime/20"><AppMark className="h-7 w-7" /></span><div className="min-w-0"><p className="font-display text-sm font-bold">lingua.</p><p className="truncate text-[11px] text-ink/60 dark:text-white/55">{streak?.currentStreak > 0 ? `${streak.currentStreak} ngày chuỗi` : 'Bắt đầu học hôm nay'}</p></div></div>
      <div className="flex shrink-0 items-center gap-1.5"><span className="hidden sm:block"><SyncStatusBadge user={user} compact /></span><NotificationBell streak={streak} plain /><button onClick={onToggleTheme} className="grid h-11 w-11 place-items-center rounded-xl text-ink/60 transition hover:bg-ink/[0.06] hover:text-ink dark:text-white/60 dark:hover:bg-white/10 dark:hover:text-white" aria-label="Đổi chế độ sáng tối">{theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}</button>{user ? <button onClick={() => setOpen((value) => !value)} className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-full bg-lime text-sm font-black text-ink" aria-label="Mở tài khoản">{user.photoURL ? <img src={user.photoURL} alt="" className="h-full w-full object-cover" /> : initials}</button> : <button onClick={onOpenAuth} aria-label="Đăng nhập" className="flex h-11 min-w-[44px] items-center justify-center gap-1.5 rounded-xl border border-ink/15 px-0 text-sm font-bold text-ink/80 sm:px-3.5 dark:border-white/20 dark:text-white/80"><LogIn size={17} /><span className="hidden sm:inline">Đăng nhập</span></button>}</div>
    </header>
    {user && open && <div className="fixed inset-x-4 top-16 z-[60] rounded-2xl border border-ink/10 bg-slab p-4 shadow-soft dark:border-white/10 dark:bg-dark2"><div className="flex items-start justify-between gap-3"><div className="flex min-w-0 items-center gap-3"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-lime font-black text-ink">{initials}</span><div className="min-w-0"><p className="truncate text-sm font-bold">{user.displayName || 'Tài khoản Google'}</p><p className="truncate text-xs text-ink/60 dark:text-white/55">{user.email}</p></div></div><button onClick={() => setOpen(false)} className="icon-btn -mr-2" aria-label="Đóng"><X size={18} /></button></div><button onClick={onSignOut} className="mt-4 flex min-h-[44px] w-full items-center gap-2 rounded-xl bg-dangerbg px-3 py-3 text-left text-sm font-bold text-danger dark:bg-dangerdark dark:text-dangerfgdark"><LogOut size={16} />Đăng xuất</button></div>}
  </>;
}
