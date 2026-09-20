import { useEffect, useRef, useState } from 'react'
import { Headphones, ListMusic, Pause, Play, RotateCcw, Volume2 } from 'lucide-react'
import QuestionSet from '../grammar/GrammarQuiz'
import { listeningLessons } from '../../data/skills/listening'
import { speakText, stopSpeech } from '../../utils/speech'

const RATES = [
  { id: 0.8, label: '0.8x' },
  { id: 1, label: '1x' },
  { id: 1.2, label: '1.2x' },
]

/** Luyện nghe: phát hội thoại bằng giọng tiếng Anh của thiết bị, chép chính tả, làm câu hỏi. */
export default function ListeningView({ progress, onResult, onLines, focusId }) {
  const [lessonId, setLessonId] = useState(listeningLessons[0].id)
  const [playing, setPlaying] = useState(false)
  const [currentLine, setCurrentLine] = useState(-1)
  const [rate, setRate] = useState(1)
  const [showTranscript, setShowTranscript] = useState(false)
  const stoppedRef = useRef(false)

  const lesson = listeningLessons.find((item) => item.id === lessonId) || listeningLessons[0]
  const best = progress?.listening?.[lesson.id]

  // Mở đúng bài khi đến từ tìm kiếm toàn cục.
  useEffect(() => {
    if (focusId && listeningLessons.some((item) => item.id === focusId)) setLessonId(focusId)
  }, [focusId])

  const stop = () => {
    stoppedRef.current = true
    stopSpeech()
    setPlaying(false)
    setCurrentLine(-1)
  }

  // Dừng audio khi đổi bài hoặc rời trang.
  useEffect(() => {
    stop()
    setShowTranscript(false)
    return stop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson.id])

  const playFrom = (index) => {
    if (stoppedRef.current) return
    if (index >= lesson.transcript.length) {
      setPlaying(false)
      setCurrentLine(-1)
      return
    }
    setCurrentLine(index)
    speakText(lesson.transcript[index].line, {
      rate,
      onEnd: () => playFrom(index + 1),
      onError: () => { setPlaying(false); setCurrentLine(-1) },
    })
  }

  const start = () => {
    stoppedRef.current = false
    setPlaying(true)
    playFrom(currentLine >= 0 ? currentLine : 0)
  }

  const pause = () => {
    stopSpeech()
    setPlaying(false)
  }

  const restart = () => {
    stopSpeech()
    stoppedRef.current = false
    setPlaying(true)
    setCurrentLine(0)
    playFrom(0)
  }

  const playLine = (index) => {
    stopSpeech()
    stoppedRef.current = false
    setCurrentLine(index)
    speakText(lesson.transcript[index].line, { rate, onEnd: () => setCurrentLine(-1) })
  }

  const fullText = lesson.transcript.map((item) => item.line).join(' ')

  return (
    <div className="space-y-4">
      <nav className="panel p-3" aria-label="Danh sách bài nghe">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {listeningLessons.map((item) => {
            const active = item.id === lesson.id
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setLessonId(item.id)}
                aria-current={active ? 'true' : undefined}
                className={`flex min-h-[44px] min-w-max flex-col items-start rounded-xl px-3 py-2 text-left text-sm transition ${active ? 'bg-lime text-ink' : 'text-ink/70 hover:bg-ink/[0.05] dark:text-white/70 dark:hover:bg-white/[0.08]'}`}
              >
                <span className="font-bold">{item.title}</span>
                <span className={`text-xs ${active ? 'text-ink/70' : 'text-ink/60 dark:text-white/60'}`}>{item.level} · {item.topic}</span>
              </button>
            )
          })}
        </div>
      </nav>

      <section className="panel p-4 sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="eyebrow">Nghe · {lesson.level}</p>
            <h2 className="mt-1 font-display text-xl font-bold">{lesson.title}</h2>
            <p className="mt-1 text-xs text-ink/60 dark:text-white/60">{lesson.topic} · khoảng {lesson.seconds} giây</p>
          </div>
          {best && <span className="chip bg-okbg text-ok dark:bg-okdark dark:text-okfgdark">Điểm cao nhất {best.best}/{best.total}</span>}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          {playing
            ? <button type="button" onClick={pause} className="btn-primary px-4"><Pause size={16} />Tạm dừng</button>
            : <button type="button" onClick={start} className="btn-primary px-4"><Play size={16} />{currentLine > 0 ? 'Nghe tiếp' : 'Nghe bài'}</button>}
          <button type="button" onClick={restart} className="btn-secondary px-4"><RotateCcw size={15} />Nghe lại</button>
          <div className="flex items-center gap-2 rounded-xl border border-ink/10 px-3 dark:border-white/15">
            <Volume2 size={15} className="text-ink/50 dark:text-white/50" />
            <select
              value={rate}
              onChange={(event) => { const next = Number(event.target.value); setRate(next); if (playing) { stopSpeech(); stoppedRef.current = false; playFrom(currentLine) } }}
              className="min-h-[44px] bg-transparent text-sm outline-none"
              aria-label="Tốc độ đọc"
            >
              {RATES.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
            </select>
          </div>
          <button type="button" onClick={() => setShowTranscript((value) => !value)} className="btn-secondary px-4">
            <ListMusic size={15} />{showTranscript ? 'Ẩn transcript' : 'Xem transcript'}
          </button>
        </div>

        <p className="mt-3 text-xs text-ink/60 dark:text-white/60">
          Mẹo: nghe lần 1 không nhìn transcript, ghi lại từ khoá; lần 2 vừa nghe vừa nhìn transcript để kiểm tra.
        </p>

        {showTranscript && (
          <div className="mt-4 space-y-2">
            {lesson.transcript.map((item, index) => (
              <div key={`${item.speaker}-${index}`} className={`flex items-start gap-2.5 rounded-xl border p-3 transition ${currentLine === index ? 'border-sage bg-sage/10' : 'border-ink/[0.08] dark:border-white/[0.08]'}`}>
                <button type="button" onClick={() => playLine(index)} className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-ink/60 transition hover:bg-ink/[0.06] hover:text-ink dark:text-white/60 dark:hover:bg-white/10" aria-label={`Nghe câu của ${item.speaker}`}>
                  <Volume2 size={15} />
                </button>
                <span className="min-w-0">
                  <span className="block text-xs font-bold text-sage">{item.speaker}</span>
                  <span className="block text-sm">{item.line}</span>
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4">
          <p className="text-xs font-bold uppercase tracking-[0.06em] text-ink/60 dark:text-white/60">Từ khoá trong bài</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {lesson.glossary.map((item) => (
              <button key={item.word} type="button" onClick={() => speakText(item.word)} className="chip bg-sage/15 text-ink dark:text-white" title="Bấm để nghe">
                <Headphones size={12} className="mr-1" />{item.word} — {item.meaning}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="panel p-4 sm:p-5">
        <p className="eyebrow">Kiểm tra hiểu bài</p>
        <h3 className="mt-1 font-display text-lg font-bold">Câu hỏi</h3>
        <div className="mt-3">
          <QuestionSet
            key={`${lesson.id}-quiz`}
            questions={lesson.questions}
            title="Nghe hiểu"
            subtitle={`${lesson.questions.length} câu · chấm điểm sau khi trả lời hết`}
            finishLabel="Nghe bài khác"
            onFinish={(correct, total, _advance, details) => {
              onResult(lesson.id, correct, total, details)
              onLines?.(lesson.transcript.length)
            }}
          />
        </div>
        {!showTranscript && (
          <button type="button" onClick={() => speakText(fullText, { rate })} className="btn-ghost mt-3 px-3">
            <Play size={15} />Nghe toàn bài liền mạch
          </button>
        )}
      </section>
    </div>
  )
}
