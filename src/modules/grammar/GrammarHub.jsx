import { useEffect, useMemo, useRef, useState } from 'react'
import { BadgeCheck, GraduationCap, PlayCircle, Table2 } from 'lucide-react'
import CollapsibleCard from '../../components/ui/CollapsibleCard'
import useSectionState from '../../hooks/useSectionState'
import useGrammarProgress from '../../hooks/useGrammarProgress'
import GrammarLesson from './GrammarLesson'
import { grammarCheatSheet } from '../../data/grammarCurriculum'
import { grammarAllItems, grammarSections } from '../../data/grammarIndex'
import { consumePendingItem } from '../../services/deepLink'

/** Module Ngữ pháp: 12 thì + cấu trúc nâng cao B1, mỗi bài có cấu trúc – ví dụ – câu hỏi – bài kiểm tra cuối bài. */
export default function GrammarHub({ onStudyActivity }) {
  const { progress, completedCount, setLastLesson, recordResult } = useGrammarProgress()
  const [cheatOpen, toggleCheat] = useSectionState('grammar-cheatsheet', false)
  const lessonAreaRef = useRef(null)

  const initialLesson = useMemo(() => {
    const saved = grammarAllItems.find((lesson) => lesson.id === progress.lastLesson)
    if (saved && !progress.completed?.[saved.id]?.passed) return saved
    const nextIncomplete = grammarAllItems.find((lesson) => !progress.completed?.[lesson.id]?.passed)
    return nextIncomplete || saved || grammarAllItems[0]
  }, [progress])
  const [activeId, setActiveId] = useState(initialLesson.id)

  // Mở đúng bài khi người dùng chọn kết quả từ tìm kiếm toàn cục (Ctrl/⌘+K).
  useEffect(() => {
    const pending = consumePendingItem('grammar')
    if (pending?.itemId && grammarAllItems.some((item) => item.id === pending.itemId)) setActiveId(pending.itemId)
  }, [])

  const activeIndex = Math.max(0, grammarAllItems.findIndex((lesson) => lesson.id === activeId))
  const lesson = grammarAllItems[activeIndex] || grammarAllItems[0]
  const percent = Math.round((completedCount / grammarAllItems.length) * 100)

  const scrollToLesson = () => {
    window.setTimeout(() => lessonAreaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60)
  }

  const selectLesson = (id) => {
    setActiveId(id)
    setLastLesson(id)
    scrollToLesson()
  }

  const goTo = (offset) => {
    const next = grammarAllItems[activeIndex + offset]
    if (!next) return
    selectLesson(next.id)
  }

  const handleResult = (correct, total) => {
    // Chỉ tính vào chuỗi ngày học khi bài kiểm tra đạt yêu cầu.
    if (total > 0 && correct / total >= 0.8) onStudyActivity?.()
    recordResult(lesson.id, correct, total)
  }

  return (
    <div className="space-y-4">
      <section className="panel p-4 sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="eyebrow">Ngữ pháp nền tảng</p>
            <h2 className="mt-1 flex items-center gap-2 font-display text-xl font-bold">
              <GraduationCap size={20} className="text-sage" /> 12 thì &amp; cấu trúc B1
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-ink/70 dark:text-white/70">
              Học lần lượt từng thì: bảng cấu trúc đủ các dạng (khẳng định, phủ định, nghi vấn), cách dùng, dấu hiệu nhận biết,
              ví dụ có dịch, lỗi thường gặp, câu hỏi luyện tập và bài kiểm tra cuối bài. Sau 12 thì là 8 chuyên đề cấu trúc
              nâng cao (câu điều kiện, bị động, mệnh đề quan hệ, câu gián tiếp, modal verbs…).
            </p>
          </div>
          <button type="button" onClick={() => selectLesson(initialLesson.id)} className="btn-primary px-4">
            <PlayCircle size={16} />
            {completedCount ? 'Tiếp tục học' : 'Bắt đầu học'}
          </button>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-ink/10 dark:bg-white/15">
            <div className="h-full rounded-full bg-lime transition-all" style={{ width: `${percent}%` }} />
          </div>
          <span className="metric shrink-0 text-sm">
            {completedCount}/{grammarAllItems.length} bài
          </span>
        </div>
      </section>

      <CollapsibleCard
        id="grammar-cheatsheet"
        icon={Table2}
        eyebrow="Tra cứu nhanh"
        title="Bảng cấu trúc 12 thì"
        description="Công thức khẳng định và dấu hiệu nhận biết của cả 12 thì"
        open={cheatOpen}
        onToggle={toggleCheat}
      >
        <div className="-mx-1 overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-[0.06em] text-ink/60 dark:text-white/60">
                <th className="px-2 py-2 font-bold">#</th>
                <th className="px-2 py-2 font-bold">Thì</th>
                <th className="px-2 py-2 font-bold">Cấu trúc khẳng định</th>
                <th className="px-2 py-2 font-bold">Ví dụ</th>
                <th className="px-2 py-2 font-bold">Dấu hiệu</th>
              </tr>
            </thead>
            <tbody>
              {grammarCheatSheet.map((row) => (
                <tr key={row.id} className="border-t border-ink/[0.08] align-top dark:border-white/[0.08]">
                  <td className="px-2 py-2.5 tabular-nums text-ink/60 dark:text-white/60">{row.order}</td>
                  <td className="px-2 py-1">
                    <button type="button" onClick={() => selectLesson(row.id)} className="flex min-h-[44px] w-full flex-col justify-center text-left font-bold hover:underline">
                      {row.title}
                      <span className="text-xs font-normal text-ink/60 dark:text-white/60">{row.en}</span>
                    </button>
                  </td>
                  <td className="px-2 py-2.5 font-mono text-xs text-sage">{row.pattern}</td>
                  <td className="px-2 py-2.5 text-xs italic text-ink/80 dark:text-white/80">{row.example}</td>
                  <td className="px-2 py-2.5 text-xs text-ink/60 dark:text-white/60">{row.signal}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CollapsibleCard>

      <div className="space-y-4 lg:grid lg:grid-cols-[272px_1fr] lg:items-start lg:gap-5 lg:space-y-0">
        <nav className="panel p-3 lg:sticky lg:top-4" aria-label="Danh sách bài ngữ pháp">
          <p className="eyebrow hidden px-2 pb-2 lg:block">Danh sách bài</p>
          <div className="flex gap-2 overflow-x-auto pb-1 lg:block lg:space-y-1 lg:overflow-visible lg:pb-0">
            {grammarSections.map((section) => (
              <div key={section.id} className="min-w-max lg:min-w-0">
                <p className="eyebrow min-w-max whitespace-nowrap px-2 pb-1 pt-2">{section.title}</p>
                <div className="flex gap-2 lg:block lg:space-y-1">
                  {section.items.map((item) => {
                    const active = item.id === lesson.id
                    const done = progress.completed?.[item.id]?.passed
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => selectLesson(item.id)}
                        aria-current={active ? 'true' : undefined}
                        className={`flex min-h-[44px] min-w-max items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm transition lg:w-full ${active ? 'bg-lime text-ink' : 'text-ink/70 hover:bg-ink/[0.05] dark:text-white/70 dark:hover:bg-white/[0.08]'}`}
                      >
                        <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg text-xs font-bold ${active ? 'bg-ink/10' : 'bg-ink/[0.06] dark:bg-white/10'}`}>
                          {item.order > 100 ? '+' : item.order}
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate font-bold">{item.title}</span>
                          <span className={`block truncate text-xs ${active ? 'text-ink/70' : 'text-ink/60 dark:text-white/60'}`}>{item.en}</span>
                        </span>
                        {done && <BadgeCheck size={16} className={`ml-auto shrink-0 ${active ? 'text-ink/70' : 'text-ok dark:text-okfgdark'}`} />}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </nav>

        <div ref={lessonAreaRef} className="scroll-mt-4">
          <GrammarLesson
            key={lesson.id}
            lesson={lesson}
            completed={progress.completed?.[lesson.id]}
            onResult={handleResult}
            onPrev={() => goTo(-1)}
            onNext={() => goTo(1)}
            hasPrev={activeIndex > 0}
            hasNext={activeIndex < grammarAllItems.length - 1}
          />
        </div>
      </div>
    </div>
  )
}
