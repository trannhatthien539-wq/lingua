import { useCallback, useEffect, useMemo, useState } from 'react'
import { ArrowRight, Check, RotateCcw, Volume2, X } from 'lucide-react'
import { PASS_RATIO } from '../../data/grammarCurriculum'
import { speakText } from '../../utils/speech'
import { celebrateStudyCompletion } from '../../utils/studyFeedback'
import { playCorrect, playIncorrect } from '../../utils/soundEffects'
import AiExplainButton from './AiExplainButton'

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
export default function GrammarQuiz({ questions, immediate = false, title, subtitle, onFinish, finishLabel = 'Tiếp tục', timeLimit = 0, onTimeUp, onAnswerResult, apiKey, provider = 'gemini', limit = 4 }) {
  const items = useMemo(
    () => (immediate ? questions.slice(0, Math.min(limit, questions.length)) : shuffle(questions)),
    [questions, immediate, limit],
  )
  const [index, setIndex] = useState(0)
  const [response, setResponse] = useState('')
  const [checked, setChecked] = useState(false)
  const [results, setResults] = useState([])
  const [finished, setFinished] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(timeLimit)
  const [timedOut, setTimedOut] = useState(false)

  // Đồng hồ cho bài thi thử: đếm ngược an toàn không gọi side-effect trong state updater
  useEffect(() => {
    if (!timeLimit || finished) return undefined;
    const timer = window.setInterval(() => {
      setSecondsLeft((value) => Math.max(0, value - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [timeLimit, finished]);

  // Kích hoạt khi hết giờ
  useEffect(() => {
    if (timeLimit > 0 && secondsLeft === 0 && !finished) {
      setTimedOut(true);
      setFinished(true);
      onTimeUp?.();
    }
  }, [timeLimit, secondsLeft, finished, onTimeUp]);

  const question = items[index]
  const correctCount = results.filter((item) => item.correct).length

  useEffect(() => {
    if (finished && items.length > 0 && correctCount / items.length >= PASS_RATIO) {
      celebrateStudyCompletion()
    }
  }, [finished, items.length, correctCount])

  const reset = () => {
    setIndex(0)
    setResponse('')
    setChecked(false)
    setResults([])
    setFinished(false)
  }

  const submit = useCallback(() => {
    if (!response) return
    const correct = isCorrect(question, response)
    const next = [...results, { id: index, correct, response, question }]
    setResults(next)
    // Báo từng câu để component cha lưu vào sổ câu sai.
    onAnswerResult?.(next[next.length - 1])
    if (immediate) {
      if (correct) playCorrect()
      else playIncorrect()
      setChecked(true)
      return
    }
    // Chế độ kiểm tra: đi tiếp ngay, chấm điểm ở cuối.
    if (index + 1 < items.length) {
      setIndex(index + 1)
      setResponse('')
    } else {
      setFinished(true)
      onFinish?.(next.filter((item) => item.correct).length, items.length, false, next)
    }
  }, [response, question, results, index, onAnswerResult, immediate, items.length, onFinish])

  const nextQuestion = useCallback(() => {
    if (index + 1 < items.length) {
      setIndex(index + 1)
      setResponse('')
      setChecked(false)
      return
    }
    setFinished(true)
    onFinish?.(results.filter((item) => item.correct).length, items.length, false, results)
  }, [index, items.length, onFinish, results])

  // Phím tắt bàn phím: Enter để nộp / sang câu, 1-4 hoặc A-D để chọn đáp án
  useEffect(() => {
    if (finished) return undefined
    const handleKeyDown = (event) => {
      if (event.target.tagName === 'INPUT') return

      if (event.key === 'Enter') {
        event.preventDefault()
        if (checked) nextQuestion()
        else if (response) submit()
        return
      }

      if (!checked && question?.type === 'choice' && question.options?.length) {
        const letters = ['A', 'B', 'C', 'D', 'E', 'F']
        const key = event.key.toUpperCase()
        let targetIdx = -1
        if (letters.includes(key)) {
          targetIdx = letters.indexOf(key)
        } else if (['1', '2', '3', '4', '5', '6'].includes(event.key)) {
          targetIdx = Number.parseInt(event.key, 10) - 1
        }

        if (targetIdx >= 0 && targetIdx < question.options.length) {
          event.preventDefault()
          setResponse(question.options[targetIdx])
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [finished, checked, response, question, nextQuestion, submit])

  if (finished) {
    const total = items.length
    const percent = total ? Math.round((correctCount / total) * 100) : 0
    const passed = total > 0 && correctCount / total >= PASS_RATIO
    return (
      <div className="panel-flat p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="eyebrow">{timedOut ? 'Hết giờ' : 'Kết quả'}</p>
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
                  Đáp án: <span className="font-bold text-emerald-600 dark:text-emerald-400">{Array.isArray(item.question.answer) ? item.question.answer[0] : item.question.answer || item.question.answers?.[0]}</span>
                </p>
              )}
              {item.question.explain && <p className="mt-1 pl-6 text-xs text-ink/60 dark:text-white/60">{item.question.explain}</p>}
              {!item.correct && <AiExplainButton question={item.question} response={item.response} apiKey={apiKey} provider={provider} />}
            </div>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button type="button" onClick={reset} className="btn-secondary px-4"><RotateCcw size={15} />Làm lại</button>
          <button type="button" onClick={() => onFinish?.(correctCount, items.length, true, results)} className="btn-primary px-4">{finishLabel}<ArrowRight size={15} /></button>
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
        {timeLimit > 0 && (
          <span className={`chip ${secondsLeft <= 60 ? 'bg-dangerbg text-danger dark:bg-dangerdark dark:text-dangerfgdark' : 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-300'}`}>
            Còn {String(Math.floor(secondsLeft / 60)).padStart(2, '0')}:{String(secondsLeft % 60).padStart(2, '0')}
          </span>
        )}
      </div>

      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-ink/10 dark:bg-white/15">
        <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-indigo-600 transition-all" style={{ width: `${(index / items.length) * 100}%` }} />
      </div>

      <p className="mt-4 text-sm font-bold leading-6">{question.prompt}</p>
      {question.type !== 'choice' && (
        <p className="mt-1 text-xs text-ink/60 dark:text-white/60">
          {question.hint || 'Điền dạng đúng của từ trong ngoặc, không cần viết hoa.'}
        </p>
      )}

      {question.type === 'choice' ? (
        <div
          role="radiogroup"
          aria-label={question.prompt}
          className="mt-3.5 grid gap-2.5 sm:grid-cols-2"
        >
          {question.options.map((option, optIdx) => {
            const letters = ['A', 'B', 'C', 'D', 'E', 'F']
            const selected = response === option
            const showRight = checked && option === question.answer
            const showWrong = checked && selected && option !== question.answer
            return (
              <button
                key={option}
                type="button"
                role="radio"
                disabled={checked}
                aria-checked={selected}
                onClick={() => { if (!checked) setResponse(option) }}
                className={`flex min-h-[46px] items-center gap-3 rounded-xl border px-3.5 py-2.5 text-left text-sm font-semibold transition active:scale-[0.99] ${
                  showRight
                    ? 'border-ok bg-okbg text-ok dark:bg-okdark dark:text-okfgdark'
                    : showWrong
                      ? 'border-danger bg-dangerbg text-danger dark:bg-dangerdark dark:text-dangerfgdark'
                      : selected
                        ? 'border-indigo-600 bg-indigo-50/90 text-indigo-900 font-bold ring-1 ring-indigo-500/30 dark:border-indigo-400 dark:bg-indigo-950/40 dark:text-indigo-200'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 dark:border-white/10 dark:hover:border-white/20 dark:hover:bg-white/[0.05]'
                }`}
              >
                <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-lg text-xs font-bold ${selected ? 'bg-indigo-600 text-white dark:bg-indigo-500' : 'bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-300'}`}>
                  {letters[optIdx]}
                </span>
                <span className="min-w-0 flex-1 leading-snug">{option}</span>
                {showRight && <Check size={16} className="shrink-0 text-ok" />}
                {showWrong && <X size={16} className="shrink-0 text-danger" />}
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
        {question.type !== 'choice' && checked && (
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
