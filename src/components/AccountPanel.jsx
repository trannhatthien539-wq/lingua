import { Check, LogIn, LogOut, UserRound } from 'lucide-react';

const initial = (user) => (user?.displayName || user?.email || 'K').trim().charAt(0).toUpperCase();

export default function AccountPanel({ user, onOpenAuth, onSignOut }) {
  return (
    <section className="panel p-5 md:p-6">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-indigo-500/20 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
          <UserRound size={19} />
        </span>
        <div className="min-w-0">
          <p className="eyebrow">Tài khoản</p>
          <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">
            {user ? 'Đã đăng nhập' : 'Đang dùng với tư cách Khách'}
          </h2>
        </div>
      </div>

      {user ? (
        <>
          <div className="mt-4 flex flex-wrap items-center gap-3 rounded-xl border border-slate-200/80 bg-white/60 p-3.5 backdrop-blur-md dark:border-white/[0.08] dark:bg-white/[0.03]">
            {user.photoURL ? (
              <img src={user.photoURL} alt="" className="h-11 w-11 shrink-0 rounded-full object-cover" />
            ) : (
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-to-br from-indigo-500 to-indigo-700 text-base font-black text-white shadow-sm">
                {initial(user)}
              </span>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-slate-900 dark:text-white">{user.displayName || 'Tài khoản Google'}</p>
              <p className="truncate text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
            </div>
            <button
              onClick={onSignOut}
              className="inline-flex h-10 shrink-0 items-center gap-2 rounded-xl border border-rose-200 bg-rose-50/50 px-3.5 text-xs font-bold text-rose-600 transition hover:bg-rose-100 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-400 dark:hover:bg-rose-500/20"
            >
              <LogOut size={15} />Đăng xuất
            </button>
          </div>
          <p className="mt-3 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <Check size={14} className="text-emerald-500" /> Dữ liệu được đồng bộ riêng theo tài khoản này.
          </p>
        </>
      ) : (
        <>
          <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300">
            Đăng nhập để đồng bộ bộ thẻ, tiến độ, kế hoạch học và streak trên mọi thiết bị. Dữ liệu đang có trên thiết bị này vẫn được giữ nguyên và gộp vào tài khoản sau khi đăng nhập.
          </p>
          <button onClick={onOpenAuth} className="btn-primary mt-4 w-full">
            <LogIn size={17} />Đăng nhập / Tạo tài khoản
          </button>
        </>
      )}
    </section>
  );
}
