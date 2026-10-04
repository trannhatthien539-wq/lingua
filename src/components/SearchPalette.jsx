import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowRight, BookOpen, Bot, GraduationCap, Headphones, ListChecks, Mic, PenLine, Search, X } from 'lucide-react'
import { navigationItems } from '../data/navigation'
import { searchEverything, TYPE_LABELS } from '../services/searchIndex'
import Dialog from './ui/Dialog'

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
    const handleKeyDown = (event) => {
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
  }, [])

  return (
    <Dialog onClose={onClose} ariaLabel="Tìm kiếm" initialFocusRef={inputRef} overlayClassName="fixed inset-0 z-[70] flex items-start justify-center bg-slate-900/40 px-4 pt-[12vh] backdrop-blur-md dark:bg-black/70" className="w-full max-w-lg overflow-hidden rounded-3xl border border-slate-200/80 bg-white/90 shadow-[0_25px_70px_-15px_rgba(0,0,0,0.2)] backdrop-blur-2xl dark:border-white/10 dark:bg-[#0B0F17]/90">
      <div className="flex items-center gap-3 border-b border-slate-100 px-4 dark:border-white/[0.08]">
        <Search size={18} className="shrink-0 text-indigo-500" />
        <input ref={inputRef} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Tìm từ vựng, ngữ pháp, bài học, đề thi..." className="h-14 min-w-0 flex-1 bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400 dark:text-white dark:placeholder:text-slate-500" />
        <button onClick={onClose} className="icon-btn h-9 w-9 rounded-lg" aria-label="Đóng tìm kiếm"><X size={16} /></button>
      </div>
      <div className="max-h-[min(55vh,360px)] overflow-y-auto p-2">
        {items.length ? items.map((item) => {
          const Icon = item.icon;
          return (
            <button key={item.id} onClick={() => (item.isCommand ? onOpenTutor?.() : onSelect(item))} className="flex w-full items-center gap-3 rounded-2xl px-3.5 py-3 text-left transition-all hover:bg-indigo-50/80 dark:hover:bg-white/[0.06] group">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-slate-200/60 bg-white/80 text-indigo-600 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-white/[0.05] dark:text-indigo-400"><Icon size={18} /></span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-bold text-slate-900 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">{item.label}</span>
                <span className="block truncate text-xs text-slate-500 dark:text-slate-400">{item.description}</span>
              </span>
              <ArrowRight size={15} className="text-slate-300 transition-transform group-hover:translate-x-1 group-hover:text-indigo-500 dark:text-slate-600" />
            </button>
          )
        }) : (
          <p className="px-3 py-10 text-center text-xs font-medium text-slate-400 dark:text-slate-500">{loading ? 'Đang tra cứu cơ sở dữ liệu…' : 'Gõ từ khóa để tra cứu toàn bộ bài học, ngữ pháp và 1000 từ vựng'}</p>
        )}
      </div>
      <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-4 py-2.5 text-[11px] font-medium text-slate-500 backdrop-blur-md dark:border-white/[0.05] dark:bg-white/[0.02] dark:text-slate-400">
        <span>Nhấn <kbd className="rounded-md border border-slate-200 bg-white px-1.5 py-0.5 font-mono text-[10px] shadow-sm dark:border-white/10 dark:bg-white/[0.05]">Enter</kbd> để mở kết quả</span>
      </div>
    </Dialog>
  );
}