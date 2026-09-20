import { useEffect, useMemo, useRef } from 'react'
import { ArrowLeft, ArrowRight, BadgeCheck, CircleAlert, Lightbulb, Quote, Volume2 } from 'lucide-react'
import GrammarQuiz from './GrammarQuiz'
import { PASS_RATIO } from '../../data/grammarCurriculum'
import { speakText } from '../../utils/speech'

const Section = ({ icon: Icon, title, children, hint }) => (
  <section className="panel-flat p-4 sm:p-5">
    <div className="flex flex-wrap items-center justify-between gap-2">
      <p className="flex items-center gap-2 text-sm font-bold">
        <Icon size={16} className="text-sage" />
        {title}
      </p>
      {hint && <span className="text-xs text-ink/60 dark:text-white/60">{hint}</span>}
    </div>
    <div className="mt-3">{children}</div>
  </section>
)

export default function GrammarLesson({ lesson, completed, onResult, onNext, onPrev, hasNext, hasPrev, mistakeIds = [], onMistake, apiKey, provider }) {
  const topRef = useRef(null)

  // Luyện tập ưu tiên câu từng làm sai của chính bài này (kèm các câu còn lại).
  const practiceQuestions = useMemo(() => {
    if (!mistakeIds.length) return lesson.questions
    const wrong = lesson.questions.filter((question) => mistakeIds.includes(question.id))
    const rest = lesson.questions.filter((question) => !mistakeIds.includes(question.id))
    return wrong.length ? [...wrong, ...rest] : lesson.questions
  }, [lesson.questions, mistakeIds])

  // Đổi bài thì đưa người học về đầu nội dung bài mới.
  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [lesson.id])

  return (
    <div className="space-y-4">
      <div ref={topRef} className="scroll-mt-4" />
      <header className="panel p-4 sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="eyebrow">Bài {lesson.order} · {lesson.level}</p>
            <h2 className="mt-1 font-display text-xl font-bold">
              {lesson.title} <span className="text-ink/50 dark:text-white/50">· {lesson.en}</span>
            </h2>
            <p className="mt-2 text-sm leading-6 text-ink/70 dark:text-white/70">{lesson.summary}</p>
          </div>
          {completed?.passed && (
            <span className="chip bg-okbg text-ok dark:bg-okdark dark:text-okfgdark">
              <BadgeCheck size={14} className="mr-1" /> Đạt {completed.best}/{completed.total}
            </span>
          )}
        </div>
      </header>

      <Section icon={Quote} title="Cấu trúc" hint="Học kỹ bảng này trước khi làm bài tập">
        <div className="space-y-2">
          {lesson.forms.map((form) => (
            <div key={form.label} className="rounded-xl border border-ink/[0.08] p-3 dark:border-white/[0.08] sm:grid sm:grid-cols-[130px_1fr] sm:gap-3">
              <p className="text-xs font-bold uppercase tracking-[0.06em] text-ink/60 dark:text-white/60">{form.label}</p>
              <div className="mt-1 sm:mt-0">
                <p className="font-mono text-sm font-semibold text-sage">{form.pattern}</p>
                {form.note && <p className="mt-1 text-xs text-ink/60 dark:text-white/60">{form.note}</p>}
                <p className="mt-1 text-sm italic text-ink/80 dark:text-white/80">{form.example}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section icon={Lightbulb} title="Cách dùng">
        <ul className="space-y-2">
          {lesson.usage.map((item) => (
            <li key={item} className="flex gap-2.5 text-sm leading-6">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-lime" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs font-bold uppercase tracking-[0.06em] text-ink/60 dark:text-white/60">Dấu hiệu nhận biết</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {lesson.signals.map((signal) => (
            <span key={signal} className="chip bg-sage/15 text-ink dark:text-white">{signal}</span>
          ))}
        </div>
      </Section>

      <Section icon={Quote} title="Ví dụ" hint="Bấm loa để nghe">
        <ul className="space-y-2">
          {lesson.examples.map((example) => (
            <li key={example.en} className="flex items-start gap-2.5 rounded-xl border border-ink/[0.08] p-3 dark:border-white/[0.08]">
              <button
                type="button"
                onClick={() => speakText(example.en)}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-ink/60 transition hover:bg-ink/[0.06] hover:text-ink dark:text-white/60 dark:hover:bg-white/10 dark:hover:text-white"
                aria-label={`Nghe ví dụ: ${example.en}`}
              >
                <Volume2 size={16} />
              </button>
              <span className="min-w-0">
                <span className="block text-sm font-semibold">{example.en}</span>
                <span className="mt-0.5 block text-xs text-ink/60 dark:text-white/60">{example.vi}</span>
              </span>
            </li>
          ))}
        </ul>
      </Section>

      <Section icon={CircleAlert} title="Lỗi thường gặp">
        <div className="space-y-3">
          {lesson.mistakes.map((mistake) => (
            <div key={mistake.wrong} className="rounded-xl border border-ink/[0.08] p-3 dark:border-white/[0.08]">
              <p className="text-sm text-danger line-through decoration-danger/60">{mistake.wrong}</p>
              <p className="mt-1 text-sm font-bold text-ok dark:text-okfgdark">{mistake.right}</p>
              <p className="mt-1 text-xs text-ink/60 dark:text-white/60">{mistake.note}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section icon={Lightbulb} title="Luyện tập nhanh" hint="Có đáp án ngay sau mỗi câu">
        <GrammarQuiz key={`${lesson.id}-practice`} questions={practiceQuestions} immediate title="Luyện tập" subtitle={mistakeIds.length ? 'Ưu tiên câu bạn từng làm sai' : '4 câu đầu của bài'} finishLabel="Sang bài kiểm tra" onFinish={() => {}} onAnswerResult={onMistake} apiKey={apiKey} provider={provider} />
      </Section>

      <Section icon={BadgeCheck} title="Kiểm tra cuối bài" hint={`Cần đạt ${Math.round(PASS_RATIO * 100)}% để hoàn thành`}>
        <GrammarQuiz
          key={`${lesson.id}-test`}
          questions={lesson.questions}
          title="Bài kiểm tra"
          subtitle={`${lesson.questions.length} câu · đảo thứ tự mỗi lần làm`}
          finishLabel="Bài tiếp theo"
          apiKey={apiKey}
          provider={provider}
          onFinish={(correct, total, advance, details) => {
            if (!advance) onResult(correct, total, details)
            if (advance && hasNext) onNext()
          }}
        />
      </Section>

      <div className="flex flex-wrap items-center justify-between gap-2 pb-2">
        <button type="button" onClick={onPrev} disabled={!hasPrev} className="btn-secondary px-4">
          <ArrowLeft size={15} />Bài trước
        </button>
        <button type="button" onClick={onNext} disabled={!hasNext} className="btn-secondary px-4">
          Bài tiếp theo<ArrowRight size={15} />
        </button>
      </div>
    </div>
  )
}
