import { useEffect, useMemo, useState } from 'react'
import {
  AlertCircle,
  ArrowLeft,
  Check,
  CheckCircle2,
  Eraser,
  Loader2,
  PenLine,
  Quote,
  Sparkles,
  Volume2,
} from 'lucide-react'
import SkillLessonList from '../../components/learning/SkillLessonList'
import { writingTasks } from '../../data/skills/writing'
import { speakText } from '../../utils/speech'
import { canUseAi, normalizeProvider, parseAiJson, requestAi } from '../../services/aiService'
import { PROVIDER_STORAGE, readApiKeyForUser } from '../../services/apiKeyStorage'
import { toast } from '../../services/toast'

const draftKey = (id) => `lingua-writing-draft-${id}`
const aiFeedbackKey = (id) => `lingua-writing-ai-${id}`
const countWords = (value) => (value.trim() ? value.trim().split(/\s+/).length : 0)

const TYPE_LABELS = { email: 'Email', opinion: 'Nêu ý kiến', describe: 'Mô tả' }

/** Luyện viết B1: đề bài, checklist tự chấm, bài mẫu, đếm số từ và chấm điểm trực tiếp bằng AI. */
export default function WritingView({ apiKey, user, onStudyActivity, onNavigate }) {
  const [view, setView] = useState('list')
  const [taskId, setTaskId] = useState(writingTasks[0].id)
  const [draft, setDraft] = useState('')
  const [showModel, setShowModel] = useState(false)
  const [checked, setChecked] = useState({})
  const [grading, setGrading] = useState(false)
  const [aiFeedback, setAiFeedback] = useState(null)

  const task = writingTasks.find((item) => item.id === taskId) || writingTasks[0]
  const words = useMemo(() => countWords(draft), [draft])
  const enough = words >= task.minWords

  useEffect(() => {
    const saved = localStorage.getItem(draftKey(task.id)) || ''
    setDraft(saved)
    setShowModel(false)
    setChecked({})
    try {
      const savedAi = localStorage.getItem(aiFeedbackKey(task.id))
      setAiFeedback(savedAi ? JSON.parse(savedAi) : null)
    } catch {
      setAiFeedback(null)
    }
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

  const handleGradeWithAi = async () => {
    if (words < 5) {
      toast.error('Vui lòng viết ít nhất 5 từ trước khi chấm bài.')
      return
    }
    const key = apiKey || readApiKeyForUser(user)
    if (!canUseAi(key)) {
      toast.error('Vui lòng nhập API Key trong mục Cài đặt để AI chấm bài.')
      onNavigate?.('settings')
      return
    }
    const provider = localStorage.getItem(PROVIDER_STORAGE) || 'gemini'
    setGrading(true)
    try {
      const prompt = `Bạn là giám khảo tiếng Anh chuyên nghiệp chấm bài viết cấp độ B1 theo khung CEFR.
Đề bài: ${task.title}
Tình huống: ${task.situation}
Yêu cầu: ${task.task}
Độ dài tối thiểu yêu cầu: ${task.minWords} từ.

Bài làm của học viên (${words} từ):
"""
${draft}
"""

Chấm điểm khách quan theo 4 tiêu chí CEFR B1:
1) Hoàn thành yêu cầu đề (Task completion)
2) Mạch lạc & liên kết câu (Coherence)
3) Độ chính xác từ vựng (Vocabulary)
4) Độ chính xác ngữ pháp (Grammar)

Trả về CHÍNH XÁC một JSON hợp lệ theo schema sau (không markdown, không bọc backtick thừa):
{
  "score10": 7.0,
  "cefrBand": "B1",
  "summary": "Nhận xét tổng quan ngắn gọn (1-2 câu tiếng Việt)",
  "strengths": ["Điểm mạnh 1", "Điểm mạnh 2"],
  "improvements": ["Lỗi sai: 'câu sai của bài' -> Cách sửa: 'câu sửa đúng' (giải thích ngắn)"],
  "rewritten": "Bản viết lại nâng cấp tự nhiên, trôi chảy bằng tiếng Anh"
}`

      const raw = await requestAi(normalizeProvider(provider), key, prompt, { json: true })
      const parsed = parseAiJson(raw)
      if (!parsed || typeof parsed !== 'object') {
        throw new Error('Dữ liệu AI trả về không đúng định dạng JSON.')
      }
      setAiFeedback(parsed)
      try {
        localStorage.setItem(aiFeedbackKey(task.id), JSON.stringify(parsed))
      } catch {
        // ignore
      }
      toast.success(`Đã chấm xong! Điểm ước lượng: ${parsed.score10 || '7.0'}/10 (${parsed.cefrBand || 'B1'})`)
      onStudyActivity?.()
    } catch (err) {
      toast.error(err.message || 'Lỗi khi gọi AI chấm bài. Vui lòng thử lại sau.')
    } finally {
      setGrading(false)
    }
  }

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
          <p className="flex items-center gap-2 text-sm font-bold"><PenLine size={16} className="text-indigo-600 dark:text-indigo-400" />Bài viết của bạn</p>
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
          <button
            type="button"
            onClick={handleGradeWithAi}
            disabled={grading || words < 5}
            className="btn-primary px-4 shadow-sm disabled:opacity-50"
          >
            {grading ? (
              <>
                <Loader2 size={15} className="animate-spin" />Đang chấm bài...
              </>
            ) : (
              <>
                <Sparkles size={15} />Chấm bài bằng AI
              </>
            )}
          </button>
          <button type="button" onClick={() => setShowModel((value) => !value)} className="btn-secondary px-4">
            <Quote size={15} />{showModel ? 'Ẩn bài mẫu' : 'Xem bài mẫu'}
          </button>
          <button type="button" onClick={() => speakText(task.model, { rate: 0.95 })} className="btn-secondary px-4">
            <Volume2 size={15} />Nghe bài mẫu
          </button>
          <button
            type="button"
            onClick={() => {
              setDraft('')
              setAiFeedback(null)
              try { localStorage.removeItem(aiFeedbackKey(task.id)) } catch {}
            }}
            className="btn-ghost px-3"
          >
            <Eraser size={15} />Xoá nháp
          </button>
        </div>

        {showModel && (
          <div className="panel-flat mt-4 whitespace-pre-line p-4 text-sm leading-7">{task.model}</div>
        )}

        {/* Khối nhận xét và chấm điểm AI trực tiếp */}
        {aiFeedback && (
          <div className="mt-4 overflow-hidden rounded-2xl border border-indigo-500/30 bg-indigo-500/[0.04] p-4 text-ink dark:border-indigo-400/20 dark:bg-indigo-950/20 dark:text-white sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-indigo-500/15 pb-3 dark:border-indigo-400/15">
              <div className="flex items-center gap-2">
                <div className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 text-white shadow-sm">
                  <Sparkles size={16} />
                </div>
                <div>
                  <h3 className="font-display text-sm font-bold">Đánh giá bài viết bằng AI</h3>
                  <p className="text-[11px] text-ink/60 dark:text-white/60">Tiêu chuẩn CEFR B1</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-lg bg-emerald-500/20 px-2.5 py-1 font-mono text-xs font-black text-emerald-600 border border-emerald-500/30 dark:text-emerald-300">
                  {aiFeedback.score10 || 7.0}/10
                </span>
                <span className="rounded-lg bg-indigo-500/20 px-2 py-1 font-mono text-xs font-bold text-indigo-600 border border-indigo-500/30 dark:text-indigo-300">
                  Bậc {aiFeedback.cefrBand || 'B1'}
                </span>
              </div>
            </div>

            {aiFeedback.summary && (
              <p className="mt-3 text-xs leading-5 text-ink/80 dark:text-white/80 font-medium">
                {aiFeedback.summary}
              </p>
            )}

            {Array.isArray(aiFeedback.strengths) && aiFeedback.strengths.length > 0 && (
              <div className="mt-3 space-y-1">
                <p className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 size={13} /> Điểm mạnh:
                </p>
                <ul className="list-disc pl-5 text-xs space-y-0.5 text-ink/70 dark:text-white/70">
                  {aiFeedback.strengths.map((str, idx) => (
                    <li key={idx}>{str}</li>
                  ))}
                </ul>
              </div>
            )}

            {Array.isArray(aiFeedback.improvements) && aiFeedback.improvements.length > 0 && (
              <div className="mt-3 space-y-1">
                <p className="text-[11px] font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                  <AlertCircle size={13} /> Lỗi cần sửa &amp; góp ý:
                </p>
                <ul className="list-disc pl-5 text-xs space-y-0.5 text-ink/70 dark:text-white/70">
                  {aiFeedback.improvements.map((imp, idx) => (
                    <li key={idx}>{imp}</li>
                  ))}
                </ul>
              </div>
            )}

            {aiFeedback.rewritten && (
              <div className="mt-3.5 rounded-xl border border-indigo-500/20 bg-white/70 p-3 text-xs dark:border-white/10 dark:bg-white/[0.04]">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">Bản viết lại nâng cấp tham khảo:</span>
                  <button
                    type="button"
                    onClick={() => speakText(aiFeedback.rewritten, { rate: 0.95 })}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-300"
                  >
                    <Volume2 size={13} /> Nghe bản nâng cấp
                  </button>
                </div>
                <p className="whitespace-pre-line leading-relaxed text-ink/90 dark:text-white/90">
                  {aiFeedback.rewritten}
                </p>
              </div>
            )}
          </div>
        )}
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
                  className={`flex w-full items-start gap-3 rounded-xl border p-3 text-left transition ${active ? 'border-emerald-500/40 bg-emerald-500/10' : 'border-ink/[0.08] hover:bg-ink/[0.03] dark:border-white/[0.08] dark:hover:bg-white/[0.05]'}`}
                >
                  <span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md border ${active ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-ink/25 dark:border-white/30'}`}>
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
