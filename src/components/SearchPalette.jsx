import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowRight, BookOpen, Bot, GraduationCap, Headphones, ListChecks, Mic, PenLine, Search, X } from 'lucide-react'
import { navigationItems } from '../data/navigation'
import { searchEverything, TYPE_LABELS } from '../services/searchIndex'

const TYPE_ICONS = {
  tab: ArrowRight,
  grammar: GraduationCap,
  listening: Headphones,
  reading: BookOpen,
  speaking: Mic,
  writing: PenLine,
  sentence: ListChecks,
  theme: BookOpen,
  word: BookOpen,
  vstep: GraduationCap,
  "vstep-doc": BookOpen,
  vstepWord: BookOpen,
}

const COMMANDS = [
  {
    id: 'command:tutor',
    type: 'tutor',
    label: 'Gia sư AI',
    description: 'Hỏi ngữ pháp, sửa câu, xin ví dụ',
    keywords: 'gia su ai tro ly hoi dap sua cau tutor chat',
  },
]

export default function SearchPalette({ onClose, onSelect, onOpenTutor }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const inputRef = useRef(null)

  // Tìm async (có index từ thông dụng nạp lười) + debounce nhẹ.
  useEffect(() => {
    const term = query.trim()
    if (!term) {
      setResults([])
      setLoading(false)
      return undefined
    }
    let active = true
    setLoading(true)
    const timer = window.setTimeout(async () => {
      try {
        const found = await searchEverything(term)
        if (active) setResults(found)
      } finally {
        if (active) setLoading(false)
      }
    }, 120)
    return () => {
      active = false
      window.clearTimeout(timer)
    }
  }, [query])

  const items = useMemo(() => {
    const term = query.trim().toLowerCase()
    const commands = term
      ? COMMANDS.filter((command) => command.keywords.includes(term) || command.label.toLowerCase().includes(term)).map((command) => ({ ...command, icon: Bot }))
      : []
    const mapped = results.map((result) => ({
      ...result,
      isCommand: false,
      description: result.type === 'word' ? `${TYPE_LABELS.word} · ${result.detail}` : result.detail,
      icon: result.type === 'tab'
        ? navigationItems.find((item) => item.id === result.tab)?.icon || ArrowRight
        : TYPE_ICONS[result.type] || BookOpen,
    }))
    return [...commands, ...mapped]
  }, [query, results])

  // Giữ ref cho danh sách kết quả + callback (App truyền arrow inline) để phím Enter
  // luôn mở item mới nhất mà không phải gắn lại listener mỗi render.
  const itemsRef = useRef(items)
  itemsRef.current = items
  const onSelectRef = useRef(onSelect)
  onSelectRef.current = onSelect
  const onOpenTutorRef = useRef(onOpenTutor)
  onOpenTutorRef.current = onOpenTutor

  useEffect(() => {
    inputRef.current?.focus()
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
      // Enter mở kết quả đầu tiên (khớp gợi ý ở footer); bỏ qua khi đang gõ bằng IME.
      if (event.key === 'Enter' && !event.nativeEvent.isComposing) {
        const first = itemsRef.current[0]
        if (first) {
          event.preventDefault()
          if (first.isCommand) onOpenTutorRef.current?.()
          else onSelectRef.current?.(first)
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return <div className="fixed inset-0 z-[70] flex items-start justify-center bg-ink/30 px-4 pt-[12vh] backdrop-blur-sm dark:bg-black/60" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
    <section className="w-full max-w-lg overflow-hidden rounded-2xl border border-ink/10 bg-slab shadow-soft dark:border-white/10 dark:bg-dark2" role="dialog" aria-modal="true" aria-label="Tìm kiếm">
      <div className="flex items-center gap-3 border-b border-ink/10 px-4 dark:border-white/10"><Search size={18} className="shrink-0 text-ink/40 dark:text-white/40" /><input ref={inputRef} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm từ vựng, ngữ pháp, bài học..." className="h-14 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-ink/35 dark:placeholder:text-white/35" /><button onClick={onClose} className="icon-btn h-10 w-10" aria-label="Đóng tìm kiếm"><X size={17} /></button></div>
      <div className="max-h-[min(55vh,360px)] overflow-y-auto p-2">{items.length ? items.map((item) => { const Icon = item.icon; return <button key={item.id} onClick={() => (item.isCommand ? onOpenTutor?.() : onSelect(item))} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition hover:bg-lime/20"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-ink/5 text-ink dark:bg-white/10 dark:text-white"><Icon size={17} /></span><span className="min-w-0 flex-1"><span className="block text-sm font-bold">{item.label}</span><span className="block truncate text-xs text-ink/45 dark:text-white/45">{item.description}</span></span><ArrowRight size={16} className="text-ink/35 dark:text-white/35" /></button> }) : <p className="px-3 py-8 text-center text-sm text-ink/50 dark:text-white/50">{loading ? 'Đang tìm…' : 'Không tìm thấy từ vựng, bài học nào phù hợp'}</p>}</div>
      <div className="border-t border-ink/10 px-4 py-2.5 text-xs text-ink/60 dark:border-white/10 dark:text-white/55">Enter để mở · <kbd className="rounded border border-ink/15 px-1 dark:border-white/15">Esc</kbd> để đóng · tìm cả trong 1000 từ thông dụng</div>
    </section>
  </div>
}