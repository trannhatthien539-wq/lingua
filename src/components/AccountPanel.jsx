import { useState } from 'react';
import { Check, Copy, LogIn, LogOut, Save, UserRound } from 'lucide-react';
import { toast } from '../services/toast';
import { isCapacitor } from '../services/platform';
import GoogleSignInHelp from './GoogleSignInHelp';
import {
  GOOGLE_REDIRECT_URI,
  getGoogleLoginMode,
  getGoogleWebClientId,
  isGoogleClientId,
  storeClientId,
  storeLoginMode,
} from '../services/googleAuthConfig';

const initial = (user) => (user?.displayName || user?.email || 'K').trim().charAt(0).toUpperCase();

/**
 * Cách app APK đăng nhập Google. Mặc định là chế độ tự động: dùng trang handler có sẵn của
 * project Firebase nên không cần client ID, không cần SHA-1, không cần Google Cloud Console.
 */
function GoogleSetup() {
  const [mode, setMode] = useState(() => getGoogleLoginMode());
  const [draft, setDraft] = useState(() => getGoogleWebClientId());

  const changeMode = (next) => {
    setMode(storeLoginMode(next));
    toast.success(next === 'direct' ? 'Đã chuyển sang chế độ client ID riêng.' : 'Đã chuyển về chế độ tự động.');
  };

  const saveClientId = () => {
    const clean = storeClientId(draft);
    setDraft(clean);
    toast.success(clean ? 'Đã lưu Google client ID cho thiết bị này.' : 'Đã xoá Google client ID.');
  };

  const copyRedirect = async () => {
    try {
      await navigator.clipboard.writeText(GOOGLE_REDIRECT_URI);
      toast.success('Đã sao chép redirect URI.');
    } catch {
      toast.info('Hãy chọn và sao chép thủ công URI bên dưới.');
    }
  };

  return <details className="mt-4 rounded-xl border border-ink/[0.08] p-3 dark:border-white/[0.08]">
    <summary className="cursor-pointer text-xs font-bold">Cách đăng nhập Google trên APK</summary>
    <div className="mt-3 space-y-3 text-xs leading-5 text-ink/70 dark:text-white/70">
      <label className="flex items-start gap-2.5 rounded-xl border border-ink/[0.08] p-3 dark:border-white/[0.08]">
        <input type="radio" name="google-mode" checked={mode === 'auto'} onChange={() => changeMode('auto')} className="mt-0.5 h-4 w-4 accent-[#86a98f]" />
        <span>
          <span className="block font-bold text-ink dark:text-white">Tự động (khuyên dùng)</span>
          Dùng trang đăng nhập có sẵn của project Firebase — không cần client ID, không cần SHA-1, không cần cấu hình gì thêm.
        </span>
      </label>
      <label className="flex items-start gap-2.5 rounded-xl border border-ink/[0.08] p-3 dark:border-white/[0.08]">
        <input type="radio" name="google-mode" checked={mode === 'direct'} onChange={() => changeMode('direct')} className="mt-0.5 h-4 w-4 accent-[#86a98f]" />
        <span>
          <span className="block font-bold text-ink dark:text-white">Client ID riêng (nâng cao)</span>
          Mở thẳng trang OAuth của Google bằng client ID của bạn. Cần thêm redirect URI bên dưới vào Authorized redirect URIs trên Google Cloud Console.
        </span>
      </label>

      {mode === 'direct' && <>
        <label className="block">
          <span className="mb-1 block font-bold text-ink/80 dark:text-white/80">Web client ID</span>
          <input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            spellCheck={false}
            autoComplete="off"
            className="field font-mono text-[11px]"
            placeholder="1234567890-abc123.apps.googleusercontent.com"
          />
        </label>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={saveClientId} disabled={draft.trim() === getGoogleWebClientId()} className="btn-secondary px-3 disabled:opacity-50"><Save size={15} />Lưu client ID</button>
          <button type="button" onClick={copyRedirect} className="btn-ghost px-3"><Copy size={15} />Sao chép redirect URI</button>
        </div>
        <code className="block break-all rounded-lg bg-ink/[0.05] p-2 font-mono text-[11px] dark:bg-white/[0.08]">{GOOGLE_REDIRECT_URI}</code>
        {draft.trim() && !isGoogleClientId(draft) && <p className="text-danger dark:text-dangerfgdark">Client ID chưa đúng định dạng (phải kết thúc bằng <span className="font-mono">.apps.googleusercontent.com</span>).</p>}
      </>}
    </div>
  </details>;
}

/** Thẻ tài khoản: luôn hiển thị đầu trang Cài đặt, đăng nhập Google là hành động chính. */
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
      {isCapacitor() && <p className="mt-2 text-xs leading-5 text-ink/60 dark:text-white/60">Trên bản APK, app sẽ mở Chrome để bạn chọn tài khoản Google, sau đó tự quay về và hoàn tất đăng nhập.</p>}
      {isCapacitor() && <GoogleSignInHelp />}
      <GoogleSetup />
    </>}
  </section>;
}

