import { useEffect, useState } from 'react'
import { BookOpen, Download, FileUp, MoreHorizontal, Sparkles, Trash2 } from 'lucide-react'
import SummaryBar from '../ui/SummaryBar'

const percentOf = (value, total) => (total ? Math.round((value / total) * 100) : 0)

export default function VocabularyOverviewBanner({
  libraryStats,
  onStudy,
  onOpenTheme,
  onImport,
  onExport,
  onTrash,
}) {
  const total = libraryStats.total || 0
  const mastered = libraryStats.mastered || 0
  const learning = libraryStats.learning || 0
  const newCards = libraryStats.newCards || 0
  const masteredPercent = percentOf(mastered, total)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    if (!menuOpen) return undefined
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [menuOpen])

  const menuItems = [
    { label: 'Bộ theo chủ đề', icon: BookOpen, onClick: onOpenTheme },
    { label: 'Nhập thẻ', icon: FileUp, onClick: onImport },
    { label: 'Xuất thẻ', icon: Download, onClick: onExport },
    { label: 'Thùng rác', icon: Trash2, onClick: onTrash, danger: true },
  ]

  const runMenuAction = (action) => {
    setMenuOpen(false)
    action()
  }

  return (
    <SummaryBar
      icon={BookOpen}
      eyebrow="Kho từ vựng"
      title={`${mastered}/${total} từ đã thuộc`}
      meta={total ? `${total} từ trong thư viện` : 'Thư viện đang trống'}
      percent={masteredPercent}
      accent="#0EA5E9"
      accent2="#10B981"
      breakdown={[
        { label: `Đã thuộc ${mastered}`, color: '#10B981' },
        { label: `Đang học ${learning}`, color: '#F59E0B' },
        { label: `Chưa học ${newCards}`, color: '#F43F5E' },
      ]}
      action={
        <button
          type="button"
          onClick={onStudy}
          disabled={!total}
          className="btn-primary min-h-[42px] flex-1 px-4 text-xs lg:flex-none"
        >
          <Sparkles size={16} />
          Học ngay
        </button>
      }
    >
      <div className="relative">
        <button
          type="button"
          onClick={() => setMenuOpen((value) => !value)}
          className="btn-secondary h-[42px] w-[42px] shrink-0 px-0"
          aria-label="Thao tác khác cho thư viện"
          aria-expanded={menuOpen}
          aria-haspopup="menu"
        >
          <MoreHorizontal size={18} />
        </button>

        {menuOpen && (
          <>
            <button
              type="button"
              className="fixed inset-0 z-40 cursor-default"
              onClick={() => setMenuOpen(false)}
              aria-label="Đóng menu thao tác"
              tabIndex={-1}
            />
            <div
              className="absolute right-0 top-12 z-50 w-48 overflow-hidden rounded-xl border border-slate-200/80 bg-white/95 p-1.5 shadow-xl backdrop-blur-2xl dark:border-white/10 dark:bg-[#111827]/95"
              role="menu"
            >
              {menuItems.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  role="menuitem"
                  onClick={() => runMenuAction(item.onClick)}
                  className={`flex min-h-[40px] w-full items-center gap-2.5 rounded-lg px-2.5 text-left text-xs font-semibold transition hover:bg-slate-100 dark:hover:bg-white/[0.08] ${
                    item.danger ? 'text-rose-600 dark:text-rose-400' : 'text-slate-700 dark:text-slate-200'
                  }`}
                >
                  <item.icon size={15} />
                  {item.label}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </SummaryBar>
  )
}
