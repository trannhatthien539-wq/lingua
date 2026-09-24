import { useEffect, useRef, useState } from 'react'
import { Check, CheckCircle2, KeyRound, Save } from 'lucide-react'
import CollapsibleCard from '../../components/ui/CollapsibleCard'
import useSectionState from '../../hooks/useSectionState'
import { getApiKeyStorageKey, PROVIDER_STORAGE, readApiKeyForUser } from '../../services/apiKeyStorage'
import { hasAiProxy } from '../../services/aiService'

export default function ApiSettings({ user, apiKey, setApiKey }) {
  const [open, toggleSection] = useSectionState('api', false)
  const [provider, setProvider] = useState(() => localStorage.getItem(PROVIDER_STORAGE) || 'gemini')
  const [saved, setSaved] = useState(false)
  const savedTimerRef = useRef(null)
  // Dọn timer khi unmount để không set state sau khi đóng thẻ cài đặt.
  useEffect(() => () => window.clearTimeout(savedTimerRef.current), [])
  // Bản build có `VITE_AI_PROXY_URL`: AI chạy qua máy chủ riêng, người dùng không cần API key.
  const proxied = hasAiProxy()
  const connected = proxied || Boolean(apiKey?.trim());

  useEffect(() => {
    setApiKey(readApiKeyForUser(user))
    setSaved(false)
  }, [user, setApiKey])

  const saveSettings = () => {
    const storageKey = getApiKeyStorageKey(user)
    const nextApiKey = apiKey.trim()
    localStorage.setItem(storageKey, nextApiKey)
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
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-ink/[0.08] pt-5 dark:border-white/[0.08]">
        <span className="flex items-center gap-2 text-xs font-semibold text-sage"><Check size={15} /> Key chỉ lưu trên thiết bị này</span>
        <button onClick={saveSettings} className="btn-primary px-4"><Save size={15} />Lưu thay đổi</button>
      </div>
      {saved && <p className="mt-3 flex items-center gap-2 text-xs font-semibold text-sage"><CheckCircle2 size={14} />Đã lưu cấu hình AI.</p>}
    </CollapsibleCard>
  )
}
