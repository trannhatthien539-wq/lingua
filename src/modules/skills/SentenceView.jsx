import { useMemo, useState } from 'react'
import { ArrowRight, Check, RotateCcw, X } from 'lucide-react'
import { clozeExercises, normalizeSentence, orderExercises, rewriteExercises, shuffleWords } from '../../data/skills/sentencePractice'

const MODES = [
  { id: 'cloze', label: 'Điền khuyết', data: clozeExercises },
  { id: 'order', label: 'Sắp xếp câu', data: orderExercises },
  { id: 'rewrite', label: 'Viết lại câu', data: rewriteExercises },
]

const sameAnswer = (given, accepted) =>
  accepted.some((answer) => normalizeSentence(answer) === normalizeSentence(given))

/** Luyện ở cấp câu: điền khuyết, sắp xếp từ, viết lại câu. */
export default function SentenceView({ onStats }) {
  const [modeId, setModeId] = useState('cloze')
  const [index, setIndex] = useState(0)
  const [input, setInput] = useState('')
  const [picked, setPicked] = useState([])
  const [checked, setChecked] = useState(null)
  const [correctCount, setCorrectCount] = useState(0)
  const [answered, setAnswered] = useState(0)
  const [finished, setFinished] = useState(false)

  const mode = MODES.find((item) => item.id === modeId) || MODES[0]
  const exercise = mode.data[index]
  const options = useMemo(
    () => (modeId === 'order' && exercise ? shuffleWords(exercise.answer) : []),
    [modeId, exercise],
  )

  const reset = (nextMode = modeId) => {
    setModeId(nextMode)
    setIndex(0)
    setInput('')
    setPicked([])
    setChecked(null)
    setCorrectCount(0)
    setAnswered(0)
    setFinished(false)
  }

  const check = () => {
    if (!exercise) return
    const given = modeId === 'order' ? picked.join(' ') : input
    const accepted = modeId === 'cloze' ? exercise.answers : modeId === 'rewrite' ? exercise.accept : [exercise.answer]
    const ok = sameAnswer(given, accepted)
    setChecked({ ok, given, model: modeId === 'cloze' ? exercise.answers[0] : modeId === 'rewrite' ? exercise.accept[0] : exercise.answer })
    setAnswered((value) => value + 1)
    if (ok) setCorrectCount((value) => value + 1)
    onStats?.(ok ? 1 : 0, 1)
  }

  const next = () => {
    const isLast = index + 1 >= mode.data.length
    if (isLast) {
      setFinished(true)
      return
    }
    setIndex((value) => value + 1)
    setInput('')
    setPicked([])
    setChecked(null)
  }

  const pickWord = (word, position) => {
    setPicked((current) => [...current.filter((_, itemIndex) => itemIndex !== position), word])
    setChecked(null)
  }

  const removePicked = (position) => {
    setPicked((current) => current.filter((_, itemIndex) => itemIndex !== position))
    setChecked(null)
  }

  return (
    <div className="space-y-4">
      <nav className="panel p-3" aria-label="Dạng bài luyện câu">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {MODES.map((item) => {
            const active = item.id === mode.id
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => reset(item.id)}
                aria-pressed={active}
                className={`min-h-[44px] min-w-max rounded-xl px-4 text-sm font-bold transition ${active ? 'bg-lime text-ink' : 'text-ink/70 hover:bg-ink/[0.05] dark:text-white/70 dark:hover:bg-white/[0.08]'}`}
              >
                {item.label} ({item.data.length})
              </button>
            )
          })}
        </div>
      </nav>

      <section className="panel p-4 sm:p-5">
        {finished ? (
          <div className="text-center">
            <p className="eyebrow">Hoàn thành {mode.label.toLowerCase()}</p>
            <p className="mt-2 font-display text-2xl font-bold">{correctCount}/{answered} câu đúng</p>
            <p className="mt-2 text-sm text-ink/70 dark:text-white/70">
              {correctCount / Math.max(1, answered) >= 0.8
                ? 'Rất tốt! Bạn đã nắm khá chắc dạng bài này.'
                : 'Nên xem lại phần Ngữ pháp tương ứng rồi luyện lại.'}
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <button type="button" onClick={() => reset()} className="btn-secondary px-4"><RotateCcw size={15} />Luyện lại</button>
              <button type="button" onClick={() => reset(MODES[(MODES.findIndex((item) => item.id === modeId) + 1) % MODES.length].id)} className="btn-primary px-4">Dạng bài khác<ArrowRight size={15} /></button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="eyebrow">{mode.label}</p>
              <span className="chip bg-ink/[0.06] text-ink/70 dark:bg-white/10 dark:text-white/70">Câu {index + 1}/{mode.data.length} · đúng {correctCount}</span>
            </div>

            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-ink/10 dark:bg-white/15">
              <div className="h-full rounded-full bg-sage transition-all" style={{ width: `${(index / mode.data.length) * 100}%` }} />
            </div>

            {modeId === 'cloze' && (
              <>
                <p className="mt-4 text-sm font-bold leading-7">{exercise.text}</p>
                <p className="mt-1 text-xs text-ink/60 dark:text-white/60">Gợi ý: {exercise.hint}</p>
                <input
                  value={input}
                  onChange={(event) => { setInput(event.target.value); setChecked(null) }}
                  onKeyDown={(event) => { if (event.key === 'Enter' && input) check() }}
                  disabled={Boolean(checked)}
                  aria-label="Câu trả lời"
                  placeholder="Nhập phần còn thiếu..."
                  className="field mt-3 max-w-sm"
                />
              </>
            )}

            {modeId === 'order' && (
              <>
                <p className="mt-4 text-xs font-bold uppercase tracking-[0.06em] text-ink/60 dark:text-white/60">Bấm các từ theo thứ tự đúng</p>
                <div className="mt-2 flex min-h-[56px] flex-wrap items-center gap-2 rounded-xl border border-ink/10 p-3 dark:border-white/15">
                  {picked.length === 0 && <span className="text-xs text-ink/50 dark:text-white/50">Câu của bạn sẽ hiện ở đây…</span>}
                  {picked.map((word, position) => (
                    <button key={`${word}-${position}`} type="button" onClick={() => removePicked(position)} className="chip bg-lime text-ink">{word}</button>
                  ))}
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {options.map((word, position) => (
                    <button
                      key={`${word}-${position}`}
                      type="button"
                      onClick={() => pickWord(word, position)}
                      disabled={picked.filter((item) => item === word).length >= options.filter((item) => item === word).length}
                      className="min-h-[44px] rounded-xl border border-ink/10 px-3.5 text-sm font-semibold transition hover:bg-ink/[0.05] disabled:opacity-40 dark:border-white/15 dark:hover:bg-white/10"
                    >
                      {word}
                    </button>
                  ))}
                </div>
              </>
            )}

            {modeId === 'rewrite' && (
              <>
                <p className="mt-4 text-sm font-bold">Câu gốc: {exercise.prompt}</p>
                <p className="mt-1 text-sm text-ink/70 dark:text-white/70">Yêu cầu: {exercise.instruction}</p>
                <input
                  value={input}
                  onChange={(event) => { setInput(event.target.value); setChecked(null) }}
                  onKeyDown={(event) => { if (event.key === 'Enter' && input) check() }}
                  disabled={Boolean(checked)}
                  aria-label="Câu trả lời"
                  placeholder="Viết câu mới..."
                  className="field mt-3"
                />
              </>
            )}

            {checked && (
              <div className={`mt-3 rounded-xl px-3 py-2.5 text-xs leading-5 ${checked.ok ? 'bg-okbg text-ok dark:bg-okdark dark:text-okfgdark' : 'bg-dangerbg text-danger dark:bg-dangerdark dark:text-dangerfgdark'}`}>
                <p className="font-bold">{checked.ok ? 'Chính xác!' : 'Chưa đúng'}</p>
                {!checked.ok && <p className="mt-1">Đáp án: <span className="font-bold">{checked.model}</span></p>}
                {exercise.explain && <p className="mt-1 opacity-90">{exercise.explain}</p>}
              </div>
            )}

            <div className="mt-4 flex flex-wrap gap-2">
              {!checked && (
                <button type="button" onClick={check} disabled={modeId === 'order' ? !picked.length : !input} className="btn-primary px-4">
                  <Check size={15} />Kiểm tra
                </button>
              )}
              {checked && (
                <button type="button" onClick={next} className="btn-primary px-4">
                  {index + 1 >= mode.data.length ? 'Xem kết quả' : 'Câu tiếp theo'}<ArrowRight size={15} />
                </button>
              )}
              {!checked && (
                <button type="button" onClick={next} className="btn-ghost px-3">
                  <X size={15} />Bỏ qua
                </button>
              )}
            </div>
          </>
        )}
      </section>
    </div>
  )
}
