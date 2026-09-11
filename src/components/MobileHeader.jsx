import { useState } from 'react';
import { LogIn, LogOut, Moon, Sparkles, Sun, UserRound, X } from 'lucide-react';

export default function MobileHeader({ user, streak, onGoogleLogin, onSignOut, notice, theme, onToggleTheme }) {
  const [open, setOpen] = useState(false);
  const initials = (user?.displayName || user?.email || 'Guest').trim().slice(0, 1).toUpperCase();

  return <>
    <header className="sticky top-0 z-40 flex items-center justify-between border-b border-zinc-200 bg-white/90 px-4 py-2.5 backdrop-blur-md dark:border-white/10 dark:bg-[#151a18]/90 md:hidden">
      <div className="flex min-w-0 items-center gap-2.5"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-ink text-lime dark:bg-lime dark:text-ink"><Sparkles size={15} /></span><div className="min-w-0"><p className="font-display text-sm font-bold">lingua.</p><p className="truncate text-[10px] text-ink/45 dark:text-white/45">{streak?.currentStreak || 0} ngày streak · {new Date().toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}</p></div></div>
      <div className="flex items-center gap-2"><button onClick={onToggleTheme} className="grid h-9 w-9 place-items-center rounded-full border border-zinc-200 text-zinc-600 dark:border-white/10 dark:text-white/70" aria-label="Đổi chế độ sáng tối">{theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}</button>{user ? <button onClick={() => setOpen((value) => !value)} className="grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-full bg-lime text-sm font-black text-ink" aria-label="Mở tài khoản">{user.photoURL ? <img src={user.photoURL} alt="" className="h-full w-full object-cover" /> : initials}</button> : <button onClick={onGoogleLogin} className="flex items-center gap-1.5 rounded-full border border-ink px-3 py-2 text-xs font-bold dark:border-lime dark:text-lime"><LogIn size={14} />Đăng nhập</button>}</div>
    </header>
    {user && open && <div className="fixed inset-x-4 top-14 z-[60] rounded-2xl border border-ink/10 bg-white p-4 shadow-xl dark:border-white/10 dark:bg-[#202724]"><div className="flex items-start justify-between gap-3"><div className="flex min-w-0 items-center gap-3"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-lime font-black text-ink">{initials}</span><div className="min-w-0"><p className="truncate text-sm font-bold">{user.displayName || 'Tài khoản Google'}</p><p className="truncate text-xs text-ink/50 dark:text-white/50">{user.email}</p></div></div><button onClick={() => setOpen(false)} aria-label="Đóng"><X size={17} /></button></div><button onClick={onSignOut} className="mt-4 flex w-full items-center gap-2 rounded-xl bg-red-50 px-3 py-3 text-left text-sm font-bold text-red-600 dark:bg-red-950/30 dark:text-red-300"><LogOut size={16} />Đăng xuất</button></div>}
    {notice && <div className="fixed inset-x-4 top-16 z-50 rounded-xl bg-emerald-600 px-4 py-3 text-center text-xs font-bold text-white shadow-lg" role="status">{notice}</div>}
  </>;
}
