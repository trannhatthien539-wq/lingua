import { useCallback, useState } from 'react'
import { Clock3, GraduationCap, ListChecks, PlayCircle, RotateCcw, X } from 'lucide-react'
import QuestionSet from '../grammar/GrammarQuiz'
import { grammarAllItems } from '../../data/grammarIndex'
import { listeningLessons } from '../../data/skills/listening'
import { readingPassages } from '../../data/skills/reading'

const GRAMMAR_COUNT = 12
const VOCAB_COUNT = 8
const TIME_LIMIT = 30 * 60

const shuffle = (items) => {
  const copy = [...items]
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1))
    ;[copy[index], copy[swap]] = [copy[swap], copy[index]]
  }
  return copy
}

const bandFor = (percent) => {
  if (percent >= 85) return { band: 'B1+ / B2', note: 'Vượt mức B1, có thể luyện lên B2.' }
  if (percent >= 70) return { band: 'B1', note: 'Đang ở mức B1 — đủ để giao tiếp và làm bài thi B1.' }
  if (percent >= 50) return { band: 'A2+ (gần B1)', note: 'Cần củng cố ngữ pháp và từ vựng để chắc B1.' }
  return { band: 'A2', note: 'Nên học lại ngữ pháp cơ bản và 1000 từ thông dụng trước.' }
}

const buildVocabQuestions = (words, count) => {
  const pool = shuffle(words).slice(0, count * 4)
  return pool.slice(0, count).map((entry) => {
    const others = shuffle(pool.filter((item) => item.word !== entry.word && item.meaning !== entry.meaning))
    const options = shuffle([entry.meaning, ...others.slice(0, 3).map((item) => item.meaning)])
    return {
      type: 'choice',
      prompt: `“${entry.word}” nghĩa là gì?`,
      options,
      answer: entry.meaning,
      explain: `${entry.word} = ${entry.meaning}`,
    }
  })
}

/**
 * Bài thi thử B1: trộn ngữ pháp (12 thì + cấu trúc), từ vựng, đọc và nghe.
 * Có đồng hồ đếm ngược và ước lượng trình độ theo điểm.
 */
export default function MockTestView({ history, onFinish }) {
  const [questions, setQuestions] = useState(null)
  const [loading, setLoading] = useState(false)
  const [score, setScore] = useState(null)

  const start = useCallback(async () => {
    setLoading(true)
    setScore(null)
    try {
      const { commonWords } = await import('../../data/commonWords.js')
      const grammarPool = grammarAllItems.flatMap((lesson) => lesson.questions)
      const reading = shuffle(readingPassages)[0]
      const listening = shuffle(listeningLessons)[0]
      const built = shuffle([
        ...shuffle(grammarPool).slice(0, GRAMMAR_COUNT),
        ...buildVocabQuestions(commonWords, VOCAB_COUNT),
        ...reading.questions.slice(0, 4),
        ...listening.questions.slice(0, 4),
      ])
      setQuestions(built)
    } finally {
      setLoading(false)
    }
  }, [])

  const restart = () => {
    setQuestions(null)
    setScore(null)
  }

  const best = history?.length
    ? history.reduce((top, item) => (item.score / item.total > top.score / top.total ? item : top), history[0])
    : null

  return (
    <div className="space-y-4">
      <section className="panel p-4 sm:p-5">
        <p className="eyebrow">Thi thử</p>
        <h2 className="mt-1 flex items-center gap-2 font-display text-xl font-bold">
          <GraduationCap size={20} className="text-sage" /> Bài thi thử B1
        </h2>
        <p className="mt-1.5 text-sm text-ink/60 dark:text-white/60">Trộn ngữ pháp, từ vựng, đọc hiểu và nghe hiểu. Kết quả chỉ là ước lượng để học.</p>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {[
            { icon: ListChecks, text: `${GRAMMAR_COUNT + VOCAB_COUNT} câu ngữ pháp & từ vựng` },
            { icon: ListChecks, text: '4 câu đọc hiểu + 4 câu nghe hiểu' },
            { icon: Clock3, text: 'Thời gian: 30 phút' },
            { icon: GraduationCap, text: 'Ước lượng kết quả: A2 → B2' },
          ].map((item) => (
            <li key={item.text} className="flex items-center gap-2 rounded-xl border border-ink/[0.08] p-3 text-sm dark:border-white/[0.08]">
              <item.icon size={16} className="shrink-0 text-sage" />{item.text}
            </li>
          ))}
        </ul>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button type="button" onClick={start} disabled={loading} className="btn-primary px-4">
            <PlayCircle size={16} />{loading ? 'Đang chuẩn bị đề…' : questions ? 'Làm đề mới' : 'Bắt đầu thi thử'}
          </button>
          {best && <span className="chip bg-okbg text-ok dark:bg-okdark dark:text-okfgdark">Cao nhất {best.score}/{best.total}</span>}
        </div>
      </section>

      {questions && (
        <section className="panel p-4 sm:p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="eyebrow">Đang làm bài</p>
              <h3 className="mt-1 font-display text-lg font-bold">{questions.length} câu · 30 phút</h3>
            </div>
            <button
              type="button"
              onClick={() => { if (window.confirm('Huỷ bài thi đang làm? Kết quả sẽ không được lưu.')) restart(); }}
              className="btn-ghost px-3"
            >
              <X size={16} />Huỷ bài thi
            </button>
          </div>
          <div className="mt-3">
            <QuestionSet
              key={`mock-${questions.length}-${questions[0]?.prompt || ''}`}
              questions={questions}
              title="Thi thử B1"
              subtitle="Không có đáp án trong lúc làm — kết quả hiện sau khi nộp"
              finishLabel="Làm đề khác"
              timeLimit={TIME_LIMIT}
              onFinish={(correct, total, advance, details) => {
                const percent = Math.round((correct / total) * 100)
                setScore({ correct, total, percent, ...bandFor(percent) })
                if (!advance) onFinish?.(correct, total, details)
                else restart()
              }}
            />
          </div>
        </section>
      )}

      {score && (
        <section className="panel p-4 sm:p-5">
          <p className="eyebrow">Ước lượng trình độ</p>
          <p className="mt-1 font-display text-2xl font-bold">{score.band}</p>
          <p className="mt-2 text-sm text-ink/70 dark:text-white/70">{score.note}</p>
          <p className="mt-3 text-xs text-ink/60 dark:text-white/60">
            Số câu đúng: {score.correct}/{score.total} ({score.percent}%). Nên xem lại phần sai ở tab Ngữ pháp và Đọc để vá lỗ hổng trước khi luyện tiếp.
          </p>
          <button type="button" onClick={restart} className="btn-secondary mt-4 px-4"><RotateCcw size={15} />Đóng kết quả</button>
        </section>
      )}

      {history?.length > 0 && (
        <section className="panel p-4 sm:p-5">
          <p className="eyebrow">Lịch sử thi thử</p>
          <ul className="mt-3 space-y-2">
            {[...history].reverse().map((item) => (
              <li key={item.at} className="flex items-center justify-between gap-3 rounded-xl border border-ink/[0.08] p-3 text-sm dark:border-white/[0.08]">
                <span>{new Date(item.at).toLocaleString('vi-VN')}</span>
                <span className="font-bold">{item.score}/{item.total} · {Math.round((item.score / item.total) * 100)}%</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
