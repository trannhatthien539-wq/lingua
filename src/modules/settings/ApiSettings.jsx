import { useEffect, useState } from 'react'
import { Check, CheckCircle2, KeyRound, Save } from 'lucide-react'
import CollapsibleCard from '../../components/ui/CollapsibleCard'
import useSectionState from '../../hooks/useSectionState'
import { getApiKeyStorageKey, PROVIDER_STORAGE, readApiKeyForUser } from '../../services/apiKeyStorage'

export default function ApiSettings({ user, apiKey, setApiKey }) {
  const [open, toggleSection] = useSectionState('api', false)
  const [provider, setProvider] = useState(() => localStorage.getItem(PROVIDER_STORAGE) || 'gemini')
  const [saved, setSaved] = useState(false)

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
    window.setTimeout(() => setSaved(false), 1800)
  }

  return (
    <CollapsibleCard
      id="settings-api"
      icon={KeyRound}
      eyebrow="Nhà cung cấp"
      title="Kết nối AI"
      description="Sinh từ vựng, chấm chữa và gợi ý mindmap"
      badge={
        <span className={`chip ${apiKey ? 'bg-okbg text-ok dark:bg-okdark dark:text-okfgdark' : 'bg-ink/[0.06] text-ink/60 dark:bg-white/10 dark:text-white/60'}`}>
          {apiKey ? 'Đã cấu hình' : 'Chưa kết nối'}
        </span>
      }
      open={open}
      onToggle={toggleSection}
    >
      <div className="max-w-xl space-y-5">
        <label className="block">
          <span className="mb-2 block text-xs font-bold text-ink/60 dark:text-white/60">Provider</span>
          <select value={provider} onChange={(event) => setProvider(event.target.value)} className="field">
            <option value="gemini">Google Gemini</option>
            <option value="groq">Groq</option>
          </select>
        </label>
        <label className="block">
          <span className="mb-2 block text-xs font-bold text-ink/60 dark:text-white/60">API key</span>
          <div className="flex items-center gap-2 rounded-xl border border-ink/10 px-3 dark:border-white/10">
            <KeyRound size={15} className="shrink-0 text-ink/40 dark:text-white/40" />
            <input
              type="password"
              value={apiKey}
              onChange={(event) => setApiKey(event.target.value)}
              placeholder={provider === 'gemini' ? 'AIza...' : 'gsk_...'}
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
