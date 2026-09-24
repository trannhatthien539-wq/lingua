import { useState } from 'react'
import { AlarmClock, GraduationCap, RotateCcw, Trophy } from 'lucide-react'
import GrammarQuiz from './GrammarQuiz'
import { grammarAllItems } from '../../data/grammarIndex'

const QUESTION_COUNT = 30
const TIME_LIMIT = 20 * 60
const PASS_RATIO_EXAM = 0.7

const shuffle = (items) => {
  const copy = [...items]
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1))
    ;[copy[index], copy[swap]] = [copy[swap], copy[index]]
  }
  return copy
}

/** Trộn 30 câu theo tỉ lệ 12 thì / cấu trúc B1 / cấu trúc C1 để trải đều chương trình. */
const buildExamQuestions = () => {
  const tenses = grammarAllItems.filter((lesson) => lesson.order <= 12)
  const b1 = grammarAllItems.filter((lesson) => lesson.order > 12 && lesson.order < 200)
  const c1 = grammarAllItems.filter((lesson) => lesson.order >= 200)
  const pick = (lessons, count) => {
    const questions = shuffle(lessons.flatMap((lesson) => lesson.questions))
    return questions.slice(0, count)
  }
  return shuffle([...pick(tenses, 14), ...pick(b1, 10), ...pick(c1, 6)])
}

/**
 * Bài thi tổng hợp ngữ pháp: 30 câu trộn mọi chủ điểm, 20 phút, đạt từ 70%.
 * Kết quả (kèm câu sai) được trả về qua `onFinish` để lưu vào sổ câu sai.
 */
export default function GrammarExam({ apiKey, provider, onFinish, onExit }) {
  const [round, setRound] = useState(0)
  const [result, setResult] = useState(null)
  // Đề được tạo trong state (không dùng useMemo theo biến đếm) để "Làm đề mới" đổi câu một cách rõ ràng.
  const [questions, setQuestions] = useState(() => buildExamQuestions().slice(0, QUESTION_COUNT))

  const startNewExam = () => {
    setResult(null)
    setQuestions(buildExamQuestions().slice(0, QUESTION_COUNT))
    setRound((value) => value + 1)
  }

  const handleFinish = (correct, total, advance, details) => {
    if (advance) return
    const percent = total ? Math.round((correct / total) * 100) : 0
    setResult({ correct, total, percent, passed: percent >= PASS_RATIO_EXAM * 100 })
    onFinish?.({ correct, total, details, percent })
  }

  return (
    <div className="space-y-4">
      <section className="panel p-4 sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="eyebrow">Thi tổng hợp ngữ pháp</p>
            <h3 className="mt-1 flex items-center gap-2 font-display text-lg font-bold">
              <GraduationCap size={18} className="text-sage" />
              {QUESTION_COUNT} câu · {QUESTION_COUNT ? TIME_LIMIT / 60 : 0} phút
            </h3>
            <p className="mt-1.5 text-sm text-ink/60 dark:text-white/60">Trộn 12 thì, cấu trúc B1 và C1 · đạt {Math.round(PASS_RATIO_EXAM * 100)}% là nắm chắc.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="chip bg-ink/[0.06] text-ink/70 dark:bg-white/10 dark:text-white/70">
              <AlarmClock size={13} className="mr-1" />{TIME_LIMIT / 60} phút
            </span>
            <button type="button" onClick={onExit} className="btn-ghost px-3 text-xs">Đóng</button>
          </div>
        </div>
      </section>

      {!result ? (
        <GrammarQuiz
          key={`grammar-exam-${round}`}
          questions={questions}
          title="Thi tổng hợp ngữ pháp"
          subtitle="Không xem đáp án trong lúc làm — kết quả hiện sau khi nộp"
          finishLabel="Làm đề khác"
          timeLimit={TIME_LIMIT}
          apiKey={apiKey}
          provider={provider}
          onFinish={handleFinish}
        />
      ) : (
        <section className="panel p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="eyebrow">Kết quả</p>
              <p className="mt-1 flex items-center gap-2 font-display text-2xl font-bold">
                <Trophy size={20} className="text-sage" />
                {result.correct}/{result.total} câu · {result.percent}%
              </p>
              <p className="mt-1 text-sm text-ink/70 dark:text-white/70">
                {result.passed
                  ? 'Nắm chắc kiến thức nền — hãy thử đề VSTEP để kiểm tra trong điều kiện thi thật.'
                  : `Chưa đạt ${Math.round(PASS_RATIO_EXAM * 100)}%. Xem lại sổ câu sai rồi thi lại sau khi ôn.`}
              </p>
            </div>
            <span className={`chip ${result.passed ? 'bg-okbg text-ok dark:bg-okdark dark:text-okfgdark' : 'bg-warnbg text-warn'}`}>
              {result.passed ? 'Đạt' : 'Chưa đạt'}
            </span>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button type="button" onClick={startNewExam} className="btn-primary px-4">
              <RotateCcw size={15} />Làm đề mới
            </button>
            <button type="button" onClick={onExit} className="btn-secondary px-4">Về danh sách bài</button>
          </div>
        </section>
      )}
    </div>
  )
}
