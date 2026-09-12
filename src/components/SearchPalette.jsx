import { useEffect, useRef, useState } from 'react'
import { ArrowRight, Search, X } from 'lucide-react'
import { navigationItems } from '../data/navigation'

export default function SearchPalette({ onClose, onSelect }) {
  const [query, setQuery] = useState('')
  const inputRef = useRef(null)
  const results = navigationItems.filter((item) => `${item.label} ${item.description}`.toLowerCase().includes(query.trim().toLowerCase()))

  useEffect(() => {
    inputRef.current?.focus()
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return <div className="fixed inset-0 z-[70] flex items-start justify-center bg-ink/30 px-4 pt-[12vh] backdrop-blur-sm dark:bg-black/60" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
    <section className="w-full max-w-lg overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-2xl dark:border-white/10 dark:bg-[#202724]" role="dialog" aria-modal="true" aria-label="Tìm kiếm">
      <div className="flex items-center gap-3 border-b border-ink/10 px-4 dark:border-white/10"><Search size={18} className="shrink-0 text-ink/40 dark:text-white/40" /><input ref={inputRef} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm trong các mục học tập..." className="h-14 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-ink/35 dark:placeholder:text-white/35" /><button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-lg text-ink/45 hover:bg-ink/5 dark:text-white/50 dark:hover:bg-white/10" aria-label="Đóng tìm kiếm"><X size={17} /></button></div>
      <div className="max-h-[min(55vh,360px)] overflow-y-auto p-2">{results.length ? results.map((item) => { const Icon = item.icon; return <button key={item.id} onClick={() => onSelect(item.id)} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-lime/20"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-ink/5 text-ink dark:bg-white/10 dark:text-white"><Icon size={17} /></span><span className="min-w-0 flex-1"><span className="block text-sm font-bold">{item.label}</span><span className="block truncate text-xs text-ink/45 dark:text-white/45">{item.description}</span></span><ArrowRight size={16} className="text-ink/35 dark:text-white/35" /></button> }) : <p className="px-3 py-8 text-center text-sm text-ink/50 dark:text-white/50">Không tìm thấy mục phù hợp</p>}</div>
      <div className="border-t border-ink/10 px-4 py-2 text-[11px] text-ink/40 dark:border-white/10 dark:text-white/40">Nhấn <kbd className="rounded border border-ink/15 px-1 dark:border-white/15">Esc</kbd> để đóng</div>
    </section>
  </div>
}