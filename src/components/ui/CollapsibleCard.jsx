import { useEffect, useRef } from 'react'
import { ChevronDown } from 'lucide-react'

/**
 * Thẻ có thể thu gọn / mở rộng dùng cho trang Cài đặt.
 * - Tiêu đề là một <button> cao tối thiểu 68px, có aria-expanded / aria-controls.
 * - Khi thu gọn, phần nội dung được đánh dấu `inert` + aria-hidden nên không
 *   thể tab vào và không bị trình đọc màn hình đọc.
 */
export default function CollapsibleCard({
  id,
  icon: Icon,
  eyebrow,
  title,
  description,
  badge,
  open,
  onToggle,
  children,
  className = '',
}) {
  const titleId = `${id}-title`
  const panelId = `${id}-panel`
  const panelRef = useRef(null)

  // Gán trực tiếp qua DOM để hoạt động ổn định trên mọi phiên bản React.
  useEffect(() => {
    const node = panelRef.current
    if (!node) return
    if (open) {
      node.removeAttribute('inert')
      node.removeAttribute('aria-hidden')
    } else {
      node.setAttribute('inert', '')
      node.setAttribute('aria-hidden', 'true')
    }
  }, [open])

  return (
    <section className={`panel overflow-hidden ${className}`}>
      <h2 className="m-0">
        <button
          type="button"
          id={titleId}
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={panelId}
          className="flex min-h-[68px] w-full items-center gap-3 px-4 py-3.5 text-left transition hover:bg-ink/[0.03] sm:px-5 dark:hover:bg-white/[0.04]"
        >
          {Icon && (
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-lime text-ink">
              <Icon size={19} />
            </span>
          )}
          <span className="min-w-0 flex-1">
            {eyebrow && <span className="eyebrow block">{eyebrow}</span>}
            <span className="block truncate font-display text-base font-bold">{title}</span>
            {description && (
              <span className="mt-0.5 block truncate text-xs text-ink/60 dark:text-white/60">{description}</span>
            )}
          </span>
          {badge}
          <ChevronDown
            size={20}
            aria-hidden="true"
            className={`shrink-0 text-ink/50 transition-transform duration-300 dark:text-white/50 ${open ? 'rotate-180' : ''}`}
          />
        </button>
      </h2>
      <div
        ref={panelRef}
        id={panelId}
        role="region"
        aria-labelledby={titleId}
        className="grid transition-[grid-template-rows] duration-300 ease-out"
        style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
      >
        <div className="overflow-hidden">
          <div className="border-t border-ink/[0.08] p-4 sm:p-5 dark:border-white/[0.08]">{children}</div>
        </div>
      </div>
    </section>
  )
}
