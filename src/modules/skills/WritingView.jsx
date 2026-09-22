import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, Check, Eraser, PenLine, Quote, Volume2 } from 'lucide-react'
import SkillLessonList from '../../components/learning/SkillLessonList'
import { writingTasks } from '../../data/skills/writing'
import { speakText } from '../../utils/speech'

const draftKey = (id) => `lingua-writing-draft-${id}`
const countWords = (value) => (value.trim() ? value.trim().split(/\s+/).length : 0)

const TYPE_LABELS = { email: 'Email', opinion: 'Nêu ý kiến', describe: 'Mô tả' }

/** Luyện viết B1: đề bài, checklist tự chấm, bài mẫu và đếm số từ. */
export default function WritingView() {
  const [view, setView] = useState('list')
  const [taskId, setTaskId] = useState(writingTasks[0].id)
  const [draft, setDraft] = useState('')
  const [showModel, setShowModel] = useState(false)
  const [checked, setChecked] = useState({})

  const task = writingTasks.find((item) => item.id === taskId) || writingTasks[0]
  const words = useMemo(() => countWords(draft), [draft])
  const enough = words >= task.minWords

  useEffect(() => {
    const saved = localStorage.getItem(draftKey(task.id)) || ''
    setDraft(saved)
    setShowModel(false)
    setChecked({})
  }, [task.id])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        if (draft) localStorage.setItem(draftKey(task.id), draft)
        else localStorage.removeItem(draftKey(task.id))
      } catch {
        // Bỏ qua khi localStorage đầy hoặc bị chặn.
      }
    }, 600)
    return () => window.clearTimeout(timer)
  }, [draft, task.id])

  const doneChecks = task.checklist.filter((item) => checked[item.label]).length
  const taskIndex = Math.max(0, writingTasks.findIndex((item) => item.id === task.id))

  // Chỉ hiện danh sách đề bài; nội dung viết mở ra khi bấm vào một thẻ.
  if (view === 'list') {
    return (
      <SkillLessonList
        icon={PenLine}
        color="#14d4f4"
        actionLabel="Luyện viết"
        items={writingTasks.map((item, index) => ({
          id: item.id,
          index: index + 1,
          title: item.title,
          tag: TYPE_LABELS[item.type] || item.type,
          meta: `Tối thiểu ${item.minWords} từ · ${item.checklist.length} mục tự chấm`,
          summary: item.situation,
          chip: localStorage.getItem(draftKey(item.id)) ? 'Có bản nháp' : 'Chưa viết',
        }))}
        onOpen={(id) => {
          setTaskId(id)
          setView('lesson')
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }}
      />
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <button type="button" onClick={() => setView('list')} className="btn-ghost px-3">
          <ArrowLeft size={16} />Danh sách đề bài
        </button>
        <span className="text-xs font-semibold text-ink/55 dark:text-white/55">Đề {taskIndex + 1}/{writingTasks.length}</span>
      </div>

      <section className="panel p-4 sm:p-5">
        <p className="eyebrow">Đề bài · {task.type}</p>
        <h2 className="mt-1 font-display text-xl font-bold">{task.title}</h2>
        <p className="mt-3 text-sm leading-6 text-ink/80 dark:text-white/80">{task.situation}</p>
        <p className="mt-3 rounded-xl bg-ink/[0.04] p-3 text-sm leading-6 dark:bg-white/[0.06]">{task.task}</p>
      </section>

      <section className="panel p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="flex items-center gap-2 text-sm font-bold"><PenLine size={16} className="text-sage" />Bài viết của bạn</p>
          <span className={`chip ${enough ? 'bg-okbg text-ok dark:bg-okdark dark:text-okfgdark' : 'bg-ink/[0.06] text-ink/70 dark:bg-white/10 dark:text-white/70'}`}>
            {words}/{task.minWords} từ
          </span>
        </div>
        <textarea
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          rows={10}
          placeholder="Viết bài ở đây. Bản nháp được lưu tự động trên thiết bị này."
          aria-label="Bài viết"
          className="field mt-3 leading-7"
        />
        <div className="mt-3 flex flex-wrap gap-2">
          <button type="button" onClick={() => setShowModel((value) => !value)} className="btn-secondary px-4">
            <Quote size={15} />{showModel ? 'Ẩn bài mẫu' : 'Xem bài mẫu'}
          </button>
          <button type="button" onClick={() => speakText(task.model, { rate: 0.95 })} className="btn-secondary px-4">
            <Volume2 size={15} />Nghe bài mẫu
          </button>
          <button type="button" onClick={() => setDraft('')} className="btn-ghost px-3">
            <Eraser size={15} />Xoá nháp
          </button>
        </div>
        {showModel && (
          <div className="panel-flat mt-4 whitespace-pre-line p-4 text-sm leading-7">{task.model}</div>
        )}
        <p className="mt-3 text-xs text-ink/60 dark:text-white/60">
          Muốn AI chỉ lỗi và viết lại tự nhiên hơn? Dán bài vào tab <span className="font-bold">Kiểm tra Writing</span>.
        </p>
      </section>

      <section className="panel p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="eyebrow">Tự chấm theo checklist</p>
          <span className="text-xs text-ink/60 dark:text-white/60">{doneChecks}/{task.checklist.length} mục</span>
        </div>
        <ul className="mt-3 space-y-2">
          {task.checklist.map((item) => {
            const active = Boolean(checked[item.label])
            return (
              <li key={item.label}>
                <button
                  type="button"
                  onClick={() => setChecked((current) => ({ ...current, [item.label]: !current[item.label] }))}
                  aria-pressed={active}
                  className={`flex w-full items-start gap-3 rounded-xl border p-3 text-left transition ${active ? 'border-sage bg-sage/10' : 'border-ink/[0.08] hover:bg-ink/[0.03] dark:border-white/[0.08] dark:hover:bg-white/[0.05]'}`}
                >
                  <span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md border ${active ? 'border-sage bg-sage text-ink' : 'border-ink/25 dark:border-white/30'}`}>
                    {active && <Check size={13} strokeWidth={3} />}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold">{item.label}</span>
                    <span className="mt-0.5 block text-xs text-ink/60 dark:text-white/60">{item.hint}</span>
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </section>

      <section className="panel p-4 sm:p-5">
        <p className="eyebrow">Cụm từ nên dùng</p>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {task.phrases.map((item) => (
            <li key={item.phrase} className="rounded-xl border border-ink/[0.08] p-3 text-sm dark:border-white/[0.08]">
              <span className="block font-semibold">{item.phrase}</span>
              <span className="mt-0.5 block text-xs text-ink/60 dark:text-white/60">{item.meaning}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
