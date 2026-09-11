import { useEffect, useState } from 'react'
import { Check, CheckCircle2, KeyRound, Link2, Save } from 'lucide-react'
import { getApiKeyStorageKey, PROVIDER_STORAGE, readApiKeyForUser } from '../../services/apiKeyStorage'

export default function ApiSettings({ user, apiKey, setApiKey }) {
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

  return <div className="max-w-3xl space-y-6"><section className="panel p-6"><div className="flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-xl bg-[#e9e8f3] text-[#635b91] dark:bg-[#353348] dark:text-[#c9c2ff]"><KeyRound size={19} /></div><div><p className="eyebrow">Integrations</p><h2 className="font-display text-lg font-bold">Kết nối AI</h2></div></div><p className="mt-5 text-sm leading-6 text-ink/50 dark:text-white/50">Cấu hình provider và API key cho các tính năng sinh từ vựng, chấm chữa và gợi ý mindmap. Key chỉ được lưu trên thiết bị này.</p><div className="mt-6 space-y-5"><label className="block"><span className="mb-2 block text-xs font-bold text-ink/60 dark:text-white/60">Provider</span><select value={provider} onChange={(event) => setProvider(event.target.value)} className="w-full rounded-xl border border-ink/[0.1] bg-transparent px-3 py-3 text-sm outline-none dark:border-white/[0.1]"><option value="gemini">Google Gemini</option><option value="groq">Groq</option></select></label><label className="block"><span className="mb-2 block text-xs font-bold text-ink/60 dark:text-white/60">API key</span><div className="flex items-center gap-2 rounded-xl border border-ink/[0.1] px-3 dark:border-white/[0.1]"><KeyRound size={15} className="text-ink/30 dark:text-white/30" /><input type="password" value={apiKey} onChange={(event) => setApiKey(event.target.value)} placeholder={provider === 'gemini' ? 'AIza...' : 'gsk_...'} className="w-full bg-transparent py-3 text-sm outline-none placeholder:text-ink/25 dark:placeholder:text-white/25" /></div></label></div><div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-ink/[0.08] pt-5 dark:border-white/[0.08]"><span className="flex items-center gap-2 text-xs font-semibold text-sage"><Check size={15} /> Dữ liệu chỉ lưu trên thiết bị</span><button onClick={saveSettings} className="flex items-center gap-2 rounded-xl bg-ink px-4 py-2.5 text-sm font-bold text-white dark:bg-lime dark:text-ink"><Save size={15} />Lưu thay đổi</button></div>{saved && <p className="mt-4 flex items-center gap-2 text-xs font-semibold text-sage"><CheckCircle2 size={14} />Đã lưu cấu hình AI.</p>}</section><section className="panel p-5"><div className="flex items-center justify-between"><div className="flex items-center gap-3"><Link2 size={17} /><p className="text-sm font-bold">Kết nối hiện tại</p></div><span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${apiKey ? 'bg-[#e6f3e8] text-[#568460] dark:bg-[#293f31] dark:text-[#a9d5af]' : 'bg-ink/[0.06] text-ink/45 dark:bg-white/10 dark:text-white/45'}`}>{apiKey ? 'Đã cấu hình' : 'Chưa kết nối'}</span></div></section></div>
}
