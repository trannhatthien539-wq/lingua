import { useEffect, useMemo, useState } from 'react'
import { BookMarked, Clock3, Volume2 } from 'lucide-react'
import QuestionSet from '../grammar/GrammarQuiz'
import { readingPassages } from '../../data/skills/reading'
import { speakText } from '../../utils/speech'

/** Luyện đọc B1: đoạn văn theo chủ đề, từ khoá, câu hỏi đọc hiểu. */
export default function ReadingView({ progress, onResult, focusId }) {
  const [passageId, setPassageId] = useState(readingPassages[0].id)
  const [showGlossary, setShowGlossary] = useState(true)

  // Mở đúng bài khi đến từ tìm kiếm toàn cục.
  useEffect(() => {
    if (focusId && readingPassages.some((passage) => passage.id === focusId)) setPassageId(focusId)
  }, [focusId])

  const passage = readingPassages.find((item) => item.id === passageId) || readingPassages[0]
  const best = progress?.reading?.[passage.id]
  const paragraphs = useMemo(() => passage.text.split('\n').filter(Boolean), [passage])

  return (
    <div className="space-y-4">
      <nav className="panel p-3" aria-label="Danh sách bài đọc">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {readingPassages.map((item) => {
            const active = item.id === passage.id
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => { setPassageId(item.id); setShowGlossary(true) }}
                aria-current={active ? 'true' : undefined}
                className={`flex min-h-[44px] min-w-max flex-col items-start rounded-xl px-3 py-2 text-left text-sm transition ${active ? 'bg-lime text-ink' : 'text-ink/70 hover:bg-ink/[0.05] dark:text-white/70 dark:hover:bg-white/[0.08]'}`}
              >
                <span className="max-w-[220px] truncate font-bold">{item.title}</span>
                <span className={`text-xs ${active ? 'text-ink/70' : 'text-ink/60 dark:text-white/60'}`}>{item.level} · {item.topic}</span>
              </button>
            )
          })}
        </div>
      </nav>

      <section className="panel p-4 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="eyebrow">Đọc · {passage.level}</p>
            <h2 className="mt-1 font-display text-xl font-bold">{passage.title}</h2>
            <p className="mt-1 flex items-center gap-2 text-xs text-ink/60 dark:text-white/60">
              <Clock3 size={13} /> Khoảng {passage.minutes} phút · {passage.topic}
            </p>
          </div>
          {best && <span className="chip bg-okbg text-ok dark:bg-okdark dark:text-okfgdark">Điểm cao nhất {best.best}/{best.total}</span>}
        </div>

        <article className="mt-4 space-y-3 text-[15px] leading-7">
          {paragraphs.map((paragraph) => <p key={paragraph.slice(0, 24)}>{paragraph}</p>)}
        </article>

        <div className="mt-5 border-t border-ink/[0.08] pt-4 dark:border-white/[0.08]">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.06em] text-ink/60 dark:text-white/60">
              <BookMarked size={14} /> Từ khoá
            </p>
            <button type="button" onClick={() => setShowGlossary((value) => !value)} className="btn-ghost px-3">
              {showGlossary ? 'Ẩn nghĩa' : 'Hiện nghĩa'}
            </button>
          </div>
          <ul className="mt-2 grid gap-2 sm:grid-cols-2">
            {passage.glossary.map((item) => (
              <li key={item.word} className="flex items-start gap-2 rounded-xl border border-ink/[0.08] p-3 dark:border-white/[0.08]">
                <button type="button" onClick={() => speakText(item.word)} className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-ink/60 transition hover:bg-ink/[0.06] hover:text-ink dark:text-white/60 dark:hover:bg-white/10" aria-label={`Nghe ${item.word}`}>
                  <Volume2 size={14} />
                </button>
                <span>
                  <span className="block text-sm font-bold">{item.word}</span>
                  {showGlossary && <span className="block text-xs text-ink/60 dark:text-white/60">{item.meaning}</span>}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="panel p-4 sm:p-5">
        <p className="eyebrow">Kiểm tra đọc hiểu</p>
        <h3 className="mt-1 font-display text-lg font-bold">Câu hỏi</h3>
        <div className="mt-3">
          <QuestionSet
            key={`${passage.id}-quiz`}
            questions={passage.questions}
            title="Đọc hiểu"
            subtitle={`${passage.questions.length} câu · chấm điểm sau khi trả lời hết`}
            finishLabel="Đọc bài khác"
            onFinish={(correct, total) => onResult(passage.id, correct, total)}
          />
        </div>
      </section>
    </div>
  )
}
