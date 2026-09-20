import { Check, LogIn, LogOut, UserRound } from 'lucide-react';

const initial = (user) => (user?.displayName || user?.email || 'K').trim().charAt(0).toUpperCase();


export default function AccountPanel({ user, onGoogleLogin, onSignOut }) {
  return <section className="panel p-5 md:p-6">
    <div className="flex items-center gap-3">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-lime text-ink"><UserRound size={19} /></span>
      <div className="min-w-0">
        <p className="eyebrow">Tài khoản</p>
        <h2 className="font-display text-lg font-bold">{user ? 'Đã đăng nhập' : 'Đang dùng với tư cách Khách'}</h2>
      </div>
    </div>

    {user ? <>
      <div className="mt-4 flex flex-wrap items-center gap-3 rounded-xl border border-ink/[0.08] p-3 dark:border-white/[0.08]">
        {user.photoURL ? <img src={user.photoURL} alt="" className="h-11 w-11 shrink-0 rounded-full object-cover" /> : <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-lime text-base font-black text-ink">{initial(user)}</span>}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold">{user.displayName || 'Tài khoản Google'}</p>
          <p className="truncate text-xs text-ink/60 dark:text-white/60">{user.email}</p>
        </div>
        <button onClick={onSignOut} className="inline-flex h-11 shrink-0 items-center gap-2 rounded-xl border border-danger/25 px-3.5 text-xs font-bold text-danger transition hover:bg-dangerbg dark:border-danger/40 dark:hover:bg-dangerdark"><LogOut size={15} />Đăng xuất</button>
      </div>
      <p className="mt-3 flex items-center gap-2 text-xs text-ink/60 dark:text-white/60"><Check size={14} className="text-sage" /> Dữ liệu được đồng bộ riêng theo tài khoản này.</p>
    </> : <>
      <p className="mt-4 text-sm leading-6 text-ink/70 dark:text-white/70">Đăng nhập để đồng bộ bộ thẻ, tiến độ, kế hoạch học và streak trên mọi thiết bị. Dữ liệu đang có trên thiết bị này vẫn được giữ nguyên và gộp vào tài khoản sau khi đăng nhập.</p>
      <button onClick={onGoogleLogin} className="btn-primary mt-4 w-full"><LogIn size={17} />Đăng nhập bằng Google</button>
    </>}
  </section>;
}

