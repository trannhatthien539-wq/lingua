import { useMemo, useState } from 'react'
import { ArrowRight, Check, RotateCcw, Volume2, X } from 'lucide-react'
import { PASS_RATIO } from '../../data/grammarCurriculum'
import { speakText } from '../../utils/speech'

const normalizeAnswer = (value) =>
  String(value || '')
    .toLowerCase()
    .replace(/[.,!?;:]+$/g, '')
    .replace(/\s+/g, ' ')
    .trim()

const isCorrect = (question, response) => {
  if (question.type === 'choice') return response === question.answer
  const given = normalizeAnswer(response)
  if (!given) return false
  return (question.answers || []).some((answer) => normalizeAnswer(answer) === given)
}

const shuffle = (items) => {
  const copy = [...items]
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1))
    ;[copy[index], copy[swap]] = [copy[swap], copy[index]]
  }
  return copy
}

/**
 * Bộ câu hỏi của một bài ngữ pháp.
 * - `immediate`: hiện đáp án + giải thích ngay sau mỗi câu (chế độ luyện tập).
 * - Không bật: trả lời hết rồi mới chấm điểm và xem lại (bài kiểm tra cuối bài).
 */
export default function GrammarQuiz({ questions, immediate = false, title, subtitle, onFinish, finishLabel = 'Tiếp tục' }) {
  const items = useMemo(
    () => (immediate ? questions.slice(0, Math.min(4, questions.length)) : shuffle(questions)),
    [questions, immediate],
  )
  const [index, setIndex] = useState(0)
  const [response, setResponse] = useState('')
  const [checked, setChecked] = useState(false)
  const [results, setResults] = useState([])
  const [finished, setFinished] = useState(false)

  const question = items[index]
  const correctCount = results.filter((item) => item.correct).length

  const reset = () => {
    setIndex(0)
    setResponse('')
    setChecked(false)
    setResults([])
    setFinished(false)
  }

  const submit = () => {
    if (!response) return
    const correct = isCorrect(question, response)
    const next = [...results, { id: index, correct, response, question }]
    setResults(next)
    if (immediate) {
      setChecked(true)
      return
    }
    // Chế độ kiểm tra: đi tiếp ngay, chấm điểm ở cuối.
    if (index + 1 < items.length) {
      setIndex(index + 1)
      setResponse('')
    } else {
      setFinished(true)
      onFinish?.(next.filter((item) => item.correct).length, items.length)
    }
  }

  const nextQuestion = () => {
    if (index + 1 < items.length) {
      setIndex(index + 1)
      setResponse('')
      setChecked(false)
      return
    }
    setFinished(true)
    onFinish?.(results.filter((item) => item.correct).length, items.length)
  }

  if (finished) {
    const total = items.length
    const percent = total ? Math.round((correctCount / total) * 100) : 0
    const passed = total > 0 && correctCount / total >= PASS_RATIO
    return (
      <div className="panel-flat p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="eyebrow">Kết quả</p>
            <p className="mt-1 font-display text-2xl font-bold">
              {correctCount}/{total} câu đúng
            </p>
          </div>
          <span className={`chip ${passed ? 'bg-okbg text-ok dark:bg-okdark dark:text-okfgdark' : 'bg-warnbg text-warn'}`}>
            {percent}% {passed ? '· Đạt' : '· Chưa đạt'}
          </span>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-ink/10 dark:bg-white/15">
          <div className={`h-full rounded-full transition-all ${passed ? 'bg-ok' : 'bg-warn'}`} style={{ width: `${percent}%` }} />
        </div>
        <p className="mt-3 text-xs leading-5 text-ink/60 dark:text-white/60">
          {passed
            ? 'Bạn đã nắm bài này. Sang bài tiếp theo để học thêm cấu trúc mới.'
            : `Cần đạt ${Math.round(PASS_RATIO * 100)}% để hoàn thành bài. Xem lại phần cấu trúc và ví dụ rồi làm lại nhé.`}
        </p>

        <div className="mt-4 space-y-2">
          {results.map((item, position) => (
            <div key={item.id} className="rounded-xl border border-ink/[0.08] p-3 dark:border-white/[0.08]">
              <p className="flex items-start gap-2 text-xs font-semibold">
                {item.correct ? <Check size={14} className="mt-0.5 shrink-0 text-ok" /> : <X size={14} className="mt-0.5 shrink-0 text-danger" />}
                <span>
                  Câu {position + 1}: {item.question.prompt}
                </span>
              </p>
              <p className="mt-1.5 pl-6 text-xs text-ink/70 dark:text-white/70">
                Bạn trả lời: <span className="font-bold">{item.response || '(bỏ trống)'}</span>
              </p>
              {!item.correct && (
                <p className="mt-1 pl-6 text-xs text-ink/70 dark:text-white/70">
                  Đáp án: <span className="font-bold text-sage">{Array.isArray(item.question.answer) ? item.question.answer[0] : item.question.answer || item.question.answers?.[0]}</span>
                </p>
              )}
              {item.question.explain && <p className="mt-1 pl-6 text-xs text-ink/60 dark:text-white/60">{item.question.explain}</p>}
            </div>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" onClick={reset} className="btn-secondary px-4"><RotateCcw size={15} />Làm lại</button>
          <button type="button" onClick={() => onFinish?.(correctCount, items.length, true)} className="btn-primary px-4">{finishLabel}<ArrowRight size={15} /></button>
        </div>
      </div>
    )
  }

  const answeredCorrect = checked && isCorrect(question, response)

  return (
    <div className="panel-flat p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="eyebrow">{title}</p>
          {subtitle && <p className="mt-0.5 text-xs text-ink/60 dark:text-white/60">{subtitle}</p>}
        </div>
        <span className="chip bg-ink/[0.06] text-ink/70 dark:bg-white/10 dark:text-white/70">
          Câu {index + 1}/{items.length}
        </span>
      </div>

      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-ink/10 dark:bg-white/15">
        <div className="h-full rounded-full bg-sage transition-all" style={{ width: `${(index / items.length) * 100}%` }} />
      </div>

      <p className="mt-4 text-sm font-bold leading-6">{question.prompt}</p>
      {question.type === 'fill' && <p className="mt-1 text-xs text-ink/60 dark:text-white/60">Điền dạng đúng của từ trong ngoặc, không cần viết hoa.</p>}

      {question.type === 'choice' ? (
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {question.options.map((option) => {
            const selected = response === option
            const showRight = checked && option === question.answer
            const showWrong = checked && selected && option !== question.answer
            return (
              <button
                key={option}
                type="button"
                onClick={() => { if (!checked) setResponse(option) }}
                aria-pressed={selected}
                className={`flex min-h-[44px] items-center gap-2 rounded-xl border px-3 py-2.5 text-left text-sm font-semibold transition ${
                  showRight
                    ? 'border-ok bg-okbg text-ok dark:bg-okdark dark:text-okfgdark'
                    : showWrong
                      ? 'border-danger bg-dangerbg text-danger dark:bg-dangerdark dark:text-dangerfgdark'
                      : selected
                        ? 'border-sage bg-sage/15'
                        : 'border-ink/10 hover:bg-ink/[0.04] dark:border-white/15 dark:hover:bg-white/10'
                }`}
              >
                {showRight && <Check size={15} className="shrink-0" />}
                {showWrong && <X size={15} className="shrink-0" />}
                <span>{option}</span>
              </button>
            )
          })}
        </div>
      ) : (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <input
            value={response}
            onChange={(event) => setResponse(event.target.value)}
            onKeyDown={(event) => { if (event.key === 'Enter') { event.preventDefault(); checked ? nextQuestion() : submit() } }}
            disabled={checked}
            aria-label="Câu trả lời"
            placeholder="Nhập câu trả lời..."
            className="field max-w-sm flex-1"
          />
          {!checked && <button type="button" onClick={submit} disabled={!response} className="btn-secondary px-4">{immediate ? 'Kiểm tra' : index + 1 < items.length ? 'Câu tiếp theo' : 'Nộp bài'}</button>}
        </div>
      )}

      {checked && (
        <div className={`mt-3 rounded-xl px-3 py-2.5 text-xs leading-5 ${answeredCorrect ? 'bg-okbg text-ok dark:bg-okdark dark:text-okfgdark' : 'bg-dangerbg text-danger dark:bg-dangerdark dark:text-dangerfgdark'}`}>
          <p className="font-bold">{answeredCorrect ? 'Chính xác!' : `Chưa đúng. Đáp án: ${question.answer || question.answers?.[0]}`}</p>
          {question.explain && <p className="mt-1 opacity-90">{question.explain}</p>}
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        {question.type === 'choice' && !checked && (
          <button type="button" onClick={submit} disabled={!response} className="btn-primary px-4">
            {immediate ? 'Kiểm tra' : index + 1 < items.length ? 'Câu tiếp theo' : 'Nộp bài'}
          </button>
        )}
        {question.type === 'choice' && checked && (
          <button type="button" onClick={nextQuestion} className="btn-primary px-4">
            {index + 1 < items.length ? 'Câu tiếp theo' : 'Xem kết quả'}
          </button>
        )}
        {question.type === 'fill' && checked && (
          <button type="button" onClick={nextQuestion} className="btn-primary px-4">
            {index + 1 < items.length ? 'Câu tiếp theo' : 'Xem kết quả'}
          </button>
        )}
        <button type="button" onClick={() => speakText(question.prompt)} className="btn-ghost px-3" aria-label="Nghe câu hỏi">
          <Volume2 size={15} />Nghe
        </button>
      </div>
    </div>
  )
}
