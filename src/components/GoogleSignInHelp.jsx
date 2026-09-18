import { useState } from 'react'
import { ClipboardPaste, Copy, ExternalLink, LifeBuoy, LogIn } from 'lucide-react'
import { toast } from '../services/toast'
import {
  openGoogleAuthUrlInBrowser,
  readGoogleAuthDiagnostics,
  signInWithIdToken,
} from '../services/googleBrowserAuth'

const formatTime = (value) => (value ? new Date(value).toLocaleString('vi-VN') : '—')

/**
 * Trợ giúp đăng nhập Google trên bản APK:
 * - mở lại trang đăng nhập nếu Chrome không tự mở;
 * - dán mã đăng nhập (dự phòng khi deep link không quay về app được);
 * - xem nhật ký chẩn đoán để biết việc đăng nhập dừng ở bước nào.
 */
export default function GoogleSignInHelp({ compact = false }) {
  const [token, setToken] = useState('')
  const [busy, setBusy] = useState(false)
  const [diag, setDiag] = useState(() => readGoogleAuthDiagnostics())

  const reopen = async () => {
    const url = diag?.url
    if (!url) {
      toast.error('Chưa có phiên đăng nhập nào. Hãy bấm “Đăng nhập bằng Google” trước.')
      return
    }
    const method = await openGoogleAuthUrlInBrowser(url)
    toast[method === 'failed' ? 'error' : 'success'](method === 'failed' ? 'Không mở được trình duyệt trên thiết bị này.' : 'Đã mở lại trang đăng nhập Google.')
    setDiag(readGoogleAuthDiagnostics())
  }

  const submitToken = async () => {
    if (!token.trim()) return
    setBusy(true)
    try {
      const user = await signInWithIdToken(token)
      setToken('')
      toast.success(`Đăng nhập Google thành công${user?.displayName ? ` — ${user.displayName}` : ''}.`)
    } catch (error) {
      toast.error(error?.code === 'auth/invalid-credential'
        ? 'Mã đăng nhập không hợp lệ hoặc đã hết hạn. Hãy lấy mã mới.'
        : 'Không đăng nhập được bằng mã này.', { duration: 8000 })
    } finally {
      setBusy(false)
    }
  }

  const copyDiag = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(diag || {}, null, 2))
      toast.success('Đã sao chép nhật ký đăng nhập.')
    } catch {
      toast.info('Không sao chép tự động được, bạn hãy chụp màn hình phần này.')
    }
  }

  return <details className={`rounded-xl border border-ink/[0.08] p-3 dark:border-white/[0.08] ${compact ? 'mt-3' : 'mt-4'}`}>
    <summary className="flex cursor-pointer items-center gap-2 text-xs font-bold"><LifeBuoy size={14} />Không đăng nhập được bằng Google?</summary>
    <div className="mt-3 space-y-3 text-xs leading-5 text-ink/70 dark:text-white/70">
      <div className="rounded-xl bg-ink/[0.04] p-3 dark:bg-white/[0.06]">
        <p className="font-bold text-ink dark:text-white">Bước 1 · Mở lại trang đăng nhập trong Chrome</p>
        <p className="mt-1">Nếu bấm “Đăng nhập bằng Google” mà Chrome không mở, hãy bấm nút dưới đây.</p>
        <button type="button" onClick={reopen} className="btn-secondary mt-2 px-3"><ExternalLink size={15} />Mở lại trang đăng nhập Google</button>
      </div>

      <div className="rounded-xl bg-ink/[0.04] p-3 dark:bg-white/[0.06]">
        <p className="font-bold text-ink dark:text-white">Bước 2 · Dán mã đăng nhập (nếu app không tự quay về)</p>
        <ol className="mt-1 list-decimal space-y-0.5 pl-4">
          <li>Sau khi đăng nhập trong Chrome, ở trang “Đang quay lại ứng dụng…” bấm <em>Sao chép mã đăng nhập</em>.</li>
          <li>Quay lại app, dán mã vào ô dưới rồi bấm Đăng nhập.</li>
        </ol>
        <div className="mt-2 flex flex-wrap items-start gap-2">
          <textarea
            value={token}
            onChange={(event) => setToken(event.target.value)}
            rows={2}
            spellCheck={false}
            placeholder="Dán mã đăng nhập (bắt đầu bằng eyJ…)"
            className="field min-w-[220px] flex-1 font-mono text-[11px]"
          />
          <button type="button" onClick={submitToken} disabled={busy || !token.trim()} className="btn-primary px-3 disabled:opacity-50">
            {busy ? 'Đang kiểm tra…' : <><LogIn size={15} />Đăng nhập</>}
          </button>
        </div>
      </div>

      <div className="rounded-xl bg-ink/[0.04] p-3 dark:bg-white/[0.06]">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="font-bold text-ink dark:text-white">Nhật ký đăng nhập gần nhất</p>
          <div className="flex gap-2">
            <button type="button" onClick={() => setDiag(readGoogleAuthDiagnostics())} className="btn-ghost px-2 py-1">Làm mới</button>
            <button type="button" onClick={copyDiag} className="btn-ghost px-2 py-1"><Copy size={13} />Sao chép</button>
          </div>
        </div>
        {diag ? <ul className="mt-2 space-y-0.5 font-mono text-[11px]">
          <li>thời gian: {formatTime(diag.at)}</li>
          <li>chế độ: {diag.mode || '—'} · mở bằng: {diag.openedWith || '—'}</li>
          <li>app native: {String(diag.isNativeApp)} · plugin Browser: {String(diag.hasBrowserPlugin)}</li>
          <li>kết quả: {diag.returnStatus || '—'} {diag.errorCode ? `· ${diag.errorCode}` : ''}</li>
          {diag.errorMessage && <li className="break-all">lỗi: {diag.errorMessage}</li>}
        </ul> : <p className="mt-2 flex items-center gap-1.5"><ClipboardPaste size={13} />Chưa có lần thử nào.</p>}
        <p className="mt-2">Gửi nhật ký này cho tôi nếu vẫn không đăng nhập được.</p>
      </div>
    </div>
  </details>
}
