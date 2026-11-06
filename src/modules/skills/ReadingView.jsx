import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, BookMarked, BookOpen, Clock3 } from 'lucide-react'
import QuestionSet from '../grammar/GrammarQuiz'
import SkillLessonList from '../../components/learning/SkillLessonList'
import { readingPassages } from '../../data/skills/reading'
import TappableText, { GlossaryList } from '../../components/ui/TappableText'
import { getSkillCover } from '../../data/lessonCovers'

/** Luyện đọc B1: đoạn văn theo chủ đề, từ khoá, câu hỏi đọc hiểu. */
export default function ReadingView({ progress, onResult, focusId }) {
  const [view, setView] = useState('list')
  const [passageId, setPassageId] = useState(readingPassages[0].id)
  const [showGlossary, setShowGlossary] = useState(true)

  // Mở đúng bài khi đến từ tìm kiếm toàn cục.
  useEffect(() => {
    if (focusId && readingPassages.some((passage) => passage.id === focusId)) {
      setPassageId(focusId)
      setView('lesson')
    }
  }, [focusId])

  const passage = readingPassages.find((item) => item.id === passageId) || readingPassages[0]
  const best = progress?.reading?.[passage.id]
  const paragraphs = useMemo(() => passage.text.split('\n').filter(Boolean), [passage])
  const passageIndex = Math.max(0, readingPassages.findIndex((item) => item.id === passage.id))

  const openLesson = (id) => {
    setPassageId(id)
    setShowGlossary(true)
    setView('lesson')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Chỉ hiện danh sách bài; nội dung bài đọc mở ra khi bấm vào một thẻ.
  if (view === 'list') {
    return (
      <SkillLessonList
        icon={BookOpen}
        color="#14d4f4"
        actionLabel="Đọc bài"
        items={readingPassages.map((item, index) => ({
          id: item.id,
          index: index + 1,
          title: item.title,
          level: item.level,
          tag: item.topic,
          meta: `~${item.minutes} phút · ${item.text.trim().split(/\s+/).length} từ · ${item.questions.length} câu hỏi`,
          summary: item.text.split('\n')[0],
          result: progress?.reading?.[item.id],
        }))}
        onOpen={openLesson}
      />
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <button type="button" onClick={() => setView('list')} className="btn-ghost px-3">
          <ArrowLeft size={16} />Danh sách bài
        </button>
        <span className="text-xs font-semibold text-ink/55 dark:text-white/55">Bài {passageIndex + 1}/{readingPassages.length}</span>
      </div>

      <section className="panel relative overflow-hidden p-0">
        <div className="relative aspect-[28/9] w-full min-h-[140px] sm:min-h-[170px]">
          <img
            src={getSkillCover(passage.id, passage.topic, passageIndex + 1)}
            alt={passage.title}
            className="h-full w-full object-cover"
            loading="eager"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/40 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-end justify-between gap-3 text-white sm:bottom-5 sm:left-5 sm:right-5">
            <div className="min-w-0">
              <span className="inline-block rounded-full border border-white/20 bg-slate-900/80 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md">
                Đọc · {passage.level}
              </span>
              <h2 className="mt-1 font-display text-xl font-bold sm:text-2xl text-white">{passage.title}</h2>
              <p className="mt-1 flex items-center gap-2 text-xs text-white/80">
                <Clock3 size={13} /> Khoảng {passage.minutes} phút · {passage.topic}
              </p>
            </div>
            {best && <span className="chip border border-white/20 bg-emerald-500/85 text-white shadow-sm backdrop-blur-md">Điểm cao nhất {best.best}/{best.total}</span>}
          </div>
        </div>

        <div className="p-4 sm:p-6">
          <article className="space-y-3 text-[15px] leading-7">
            {paragraphs.map((paragraph) => <TappableText key={paragraph.slice(0, 24)} text={paragraph} />)}
            <p className="text-xs text-ink/45 dark:text-white/45">Mẹo: bấm vào một từ tiếng Anh bất kỳ để tra nghĩa và lưu vào bộ thẻ.</p>
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
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            <GlossaryList items={passage.glossary} showMeaning={showGlossary} />
          </div>
        </div>
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
            onFinish={(correct, total, _advance, details) => onResult(passage.id, correct, total, details)}
          />
        </div>
      </section>
    </div>
  )
}
