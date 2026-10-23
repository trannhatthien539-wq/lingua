import { useEffect, useRef, useState } from 'react'
import { Check, CheckCircle2, KeyRound, Save } from 'lucide-react'
import CollapsibleCard from '../../components/ui/CollapsibleCard'
import useSectionState from '../../hooks/useSectionState'
import { isApiKeyRemembered, PROVIDER_STORAGE, readApiKeyForUser, writeApiKey } from '../../services/apiKeyStorage'
import { hasAiProxy } from '../../services/aiService'

export default function ApiSettings({ user, apiKey, setApiKey }) {
  const [open, toggleSection] = useSectionState('api', false)
  const [provider, setProvider] = useState(() => localStorage.getItem(PROVIDER_STORAGE) || 'gemini')
  const [remember, setRemember] = useState(() => isApiKeyRemembered(user))
  const [saved, setSaved] = useState(false)
  const savedTimerRef = useRef(null)
  // Dọn timer khi unmount để không set state sau khi đóng thẻ cài đặt.
  useEffect(() => () => window.clearTimeout(savedTimerRef.current), [])
  // Bản build có `VITE_AI_PROXY_URL`: AI chạy qua máy chủ riêng, người dùng không cần API key.
  const proxied = hasAiProxy()
  const connected = proxied || Boolean(apiKey?.trim());

  useEffect(() => {
    setApiKey(readApiKeyForUser(user))
    setRemember(isApiKeyRemembered(user))
    setSaved(false)
  }, [user, setApiKey])

  const saveSettings = () => {
    const nextApiKey = apiKey.trim()
    writeApiKey(user, nextApiKey, { remember })
    setApiKey(nextApiKey)
    localStorage.setItem(PROVIDER_STORAGE, provider)
    setSaved(true)
    // Xóa timer cũ để bấm Lưu liên tiếp không làm chữ “Đã lưu” tắt sớm.
    window.clearTimeout(savedTimerRef.current)
    savedTimerRef.current = window.setTimeout(() => setSaved(false), 1800)
  }

  return (
    <CollapsibleCard
      id="settings-api"
      icon={KeyRound}
      eyebrow="Nhà cung cấp"
      title="Kết nối AI"
      description="Sinh từ vựng, chấm chữa và gợi ý mindmap"
      badge={
        <span className={`chip ${connected ? 'bg-okbg text-ok dark:bg-okdark dark:text-okfgdark' : 'bg-ink/[0.06] text-ink/60 dark:bg-white/10 dark:text-white/60'}`}>
          {proxied && !apiKey?.trim() ? 'Máy chủ proxy' : connected ? 'Đã cấu hình' : 'Chưa kết nối'}
        </span>
      }
      open={open}
      onToggle={toggleSection}
    >
      <div className="max-w-xl space-y-5">
        {proxied && (
          <p className="rounded-xl bg-okbg px-3 py-2 text-xs font-semibold leading-5 text-ok dark:bg-okdark dark:text-okfgdark">
            Bản này dùng máy chủ AI proxy riêng — mọi tính năng AI hoạt động mà không cần nhập API key.
          </p>
        )}
        <label className="block">
          <span className="mb-2 block text-xs font-bold text-ink/60 dark:text-white/60">Provider</span>
          <select value={provider} onChange={(event) => setProvider(event.target.value)} className="field">
            <option value="gemini">Google Gemini</option>
            <option value="groq">Groq</option>
            <option value="deepseek">DeepSeek (deepseek-chat)</option>
          </select>
        </label>
        <p className="-mt-2 text-xs leading-5 text-ink/60 dark:text-white/60">
          DeepSeek dùng key dạng <code>sk-...</code> lấy tại platform.deepseek.com — phù hợp cho chấm Writing VSTEP và gia sư AI.
        </p>
        <label className="block">
          <span className="mb-2 block text-xs font-bold text-ink/60 dark:text-white/60">API key</span>
          <div className="flex items-center gap-2 rounded-xl border border-ink/10 px-3 dark:border-white/10">
            <KeyRound size={15} className="shrink-0 text-ink/40 dark:text-white/40" />
            <input
              type="password"
              value={apiKey}
              onChange={(event) => setApiKey(event.target.value)}
              placeholder={provider === 'gemini' ? 'AIza...' : provider === 'deepseek' ? 'sk-...' : 'gsk_...'}
              className="w-full bg-transparent py-3 text-sm outline-none placeholder:text-ink/50 dark:placeholder:text-white/50"
            />
          </div>
        </label>
        <label className="flex items-start gap-3 rounded-xl border border-ink/[0.08] p-3 dark:border-white/[0.08]">
          <input
            type="checkbox"
            checked={remember}
            onChange={(event) => setRemember(event.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 accent-indigo-600"
          />
          <span className="min-w-0">
            <span className="block text-xs font-bold text-ink/80 dark:text-white/80">Nhớ API key trên thiết bị này</span>
            <span className="mt-0.5 block text-[11px] leading-5 text-ink/55 dark:text-white/55">
              Mặc định key chỉ lưu trong phiên hiện tại (sessionStorage) và mất khi đóng tab.
            </span>
          </span>
        </label>
        {remember && (
          <p className="rounded-xl border border-amber-500/30 bg-amber-500/[0.08] px-3 py-2 text-[11px] leading-5 text-amber-800 dark:text-amber-200">
            Cảnh báo XSS: key lưu trong localStorage có thể bị mã độc trên trang đọc được. Chỉ bật ghi nhớ trên thiết bị cá nhân và tin cậy.
          </p>
        )}
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-ink/[0.08] pt-5 dark:border-white/[0.08]">
        <span className="flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
          <Check size={15} />
          {remember ? 'Key được ghi nhớ trên thiết bị này' : 'Key chỉ lưu trong phiên hiện tại'}
        </span>
        <button onClick={saveSettings} className="btn-primary px-4"><Save size={15} />Lưu thay đổi</button>
      </div>
      {saved && <p className="mt-3 flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-300"><CheckCircle2 size={14} />Đã lưu cấu hình AI.</p>}
    </CollapsibleCard>
  )
}
