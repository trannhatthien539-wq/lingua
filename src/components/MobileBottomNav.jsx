import { useEffect, useRef, useState } from 'react'
import { LayoutGrid, X } from 'lucide-react'
import NavIcon from './ui/NavIcon'
import { navigationItems } from '../data/navigation'

/** 5 tab chính luôn hiện dưới đáy; các tab còn lại nằm trong nút “Thêm”. */
const PRIMARY_TABS = ['home', 'vocabulary', 'grammar', 'skills', 'vstep']
const MORE_COLOR = '#5B21B6'

/**
 * Thanh điều hướng dưới cho điện thoại.
 * Chỉ 5 tab chính + “Thêm” để mọi mục đều bấm được mà không phải vuốt ngang.
 * Chạm vào tab sẽ tải trước (prefetch) chunk của tab đó để chuyển trang tức thì.
 */
export default function MobileBottomNav({ activeTab, onTabChange, onPrefetch }) {
  const [moreOpen, setMoreOpen] = useState(false)
  const sheetRef = useRef(null)
  const closeRef = useRef(null)
  const items = navigationItems
  const primary = PRIMARY_TABS.map((id) => items.find((item) => item.id === id)).filter(Boolean)
  const extra = items.filter((item) => !PRIMARY_TABS.includes(item.id))
  const extraActive = extra.some((item) => item.id === activeTab)

  useEffect(() => {
    if (!moreOpen) return undefined

    const previousFocus = document.activeElement
    const previousOverflow = document.body.style.overflow
    // Khóa cuộn nền để thao tác trong bottom sheet không làm trang phía sau di chuyển.
    document.body.style.overflow = 'hidden'
    const frame = window.requestAnimationFrame(() => closeRef.current?.focus())

    const focusable = () => Array.from(
      sheetRef.current?.querySelectorAll(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ) || [],
    ).filter((element) => element.offsetParent !== null)

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        setMoreOpen(false)
        return
      }
      if (event.key !== 'Tab') return

      const nodes = focusable()
      if (!nodes.length) {
        event.preventDefault()
        sheetRef.current?.focus()
        return
      }
      const first = nodes[0]
      const last = nodes[nodes.length - 1]
      const active = document.activeElement
      const inside = sheetRef.current?.contains(active)

      if (event.shiftKey && (active === first || !inside)) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && (active === last || !inside)) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => {
      window.cancelAnimationFrame(frame)
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) previousFocus.focus()
    }
  }, [moreOpen])

  const selectTab = (id) => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) navigator.vibrate(10)
    setMoreOpen(false)
    onTabChange(id)
  }

  const prefetch = (id) => onPrefetch?.(id)

  return (
    <>
      {moreOpen && (
        <div className="no-print fixed inset-0 z-[60] md:hidden" role="dialog" aria-modal="true" aria-label="Chọn mục khác">
          <button type="button" onClick={() => setMoreOpen(false)} className="absolute inset-0 h-full w-full bg-slate-950/40 backdrop-blur-[3px]" aria-label="Đóng bảng chọn mục" />
          <div className="animate-sheet-up absolute inset-x-0 bottom-0 rounded-t-[28px] border-t border-slate-200/80 bg-white/95 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] shadow-[0_-20px_60px_-20px_rgba(15,23,42,0.4)] backdrop-blur-2xl dark:border-white/10 dark:bg-[#0B0F17]/95">
            <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-slate-300 dark:bg-white/20" aria-hidden="true" />
            <div className="flex items-center justify-between">
              <div>
                <p className="eyebrow">Mục khác</p>
                <p className="mt-0.5 text-sm font-bold text-slate-900 dark:text-white">Công cụ &amp; cá nhân</p>
              </div>
              <button type="button" onClick={() => setMoreOpen(false)} className="icon-btn h-9 w-9" aria-label="Đóng">
                <X size={16} />
              </button>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {extra.map((item) => {
                const active = activeTab === item.id
                return (
                  <button
                    key={item.id}
                    type="button"
                    onTouchStart={() => prefetch(item.id)}
                    onClick={() => selectTab(item.id)}
                    aria-current={active ? 'page' : undefined}
                    className={`flex min-h-[56px] items-center gap-3 rounded-2xl border px-3 py-2 text-left transition-all ${active ? 'border-indigo-500/40 bg-indigo-50/90 text-indigo-600 dark:border-indigo-400/30 dark:bg-indigo-500/15 dark:text-indigo-400' : 'border-slate-200/80 bg-slate-50/70 text-slate-700 hover:bg-slate-100 dark:border-white/[0.08] dark:bg-white/[0.03] dark:text-slate-300'}`}
                  >
                    <NavIcon icon={item.icon} color={item.color} size="sm" active={active} />
                    <span className="min-w-0">
                      <span className="block truncate text-[13px] font-bold tracking-tight">{item.shortLabel || item.label}</span>
                      <span className="block truncate text-[10px] font-medium text-slate-500 dark:text-slate-400">{item.description}</span>
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}

      <nav
        className="no-print fixed inset-x-0 bottom-0 z-50 flex items-stretch gap-0.5 border-t border-slate-200/80 bg-white/85 px-2 pt-1.5 pb-[calc(0.375rem+env(safe-area-inset-bottom))] shadow-[0_-8px_30px_-12px_rgba(15,23,42,0.18)] backdrop-blur-2xl dark:border-white/[0.08] dark:bg-[#0B0F17]/85 md:hidden"
        aria-label="Điều hướng mobile"
      >
        {primary.map((item) => {
          const active = activeTab === item.id
          return (
            <button
              key={item.id}
              type="button"
              onTouchStart={() => prefetch(item.id)}
              onClick={() => selectTab(item.id)}
              className={`relative flex min-w-0 flex-1 flex-col items-center gap-1 rounded-xl px-0.5 pb-1 pt-0.5 text-[10px] font-bold tracking-tight transition-all duration-200 ${active ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-300'}`}
              aria-current={active ? 'page' : undefined}
            >
              <span
                className={`absolute top-0 h-[2.5px] w-6 rounded-full transition-all duration-300 ${active ? 'opacity-100' : 'opacity-0'}`}
                style={{ backgroundColor: 'rgb(var(--accent))', boxShadow: '0 0 8px rgba(var(--accent), 0.5)' }}
                aria-hidden="true"
              />
              <span className={`grid h-9 w-10 place-items-center rounded-xl transition-all duration-200 ${active ? 'bg-indigo-50/90 shadow-sm dark:bg-indigo-500/20' : ''}`}>
                <NavIcon icon={item.icon} color={item.color} size="sm" active={active} />
              </span>
              <span className="max-w-full truncate">{item.shortLabel || item.label}</span>
            </button>
          )
        })}
        <button
          type="button"
          onClick={() => setMoreOpen((value) => !value)}
          aria-expanded={moreOpen}
          aria-haspopup="dialog"
          className={`relative flex min-w-0 flex-1 flex-col items-center gap-1 rounded-xl px-0.5 pb-1 pt-0.5 text-[10px] font-bold tracking-tight transition-all duration-200 ${extraActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-300'}`}
        >
          <span
            className={`absolute top-0 h-[2.5px] w-6 rounded-full transition-all duration-300 ${extraActive ? 'opacity-100' : 'opacity-0'}`}
            style={{ backgroundColor: 'rgb(var(--accent))', boxShadow: '0 0 8px rgba(var(--accent), 0.5)' }}
            aria-hidden="true"
          />
          <span className={`grid h-9 w-10 place-items-center rounded-xl transition-all duration-200 ${extraActive ? 'bg-indigo-50/90 shadow-sm dark:bg-indigo-500/20' : ''}`}>
            <NavIcon icon={LayoutGrid} color={MORE_COLOR} size="sm" active={extraActive} />
          </span>
          <span className="max-w-full truncate">Thêm</span>
        </button>
      </nav>
    </>
  )
}
