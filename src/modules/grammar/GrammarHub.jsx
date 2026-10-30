import { useEffect, useMemo, useState } from 'react'
import { AlertTriangle, ArrowLeft, ClipboardCheck, GraduationCap, Layers, PlayCircle, X } from 'lucide-react'
import CollapsibleCard from '../../components/ui/CollapsibleCard'
import SectionHeader from '../../components/ui/SectionHeader'
import useSectionState from '../../hooks/useSectionState'
import useGrammarProgress from '../../hooks/useGrammarProgress'
import GrammarLesson from './GrammarLesson'
import GrammarQuiz from './GrammarQuiz'
import GrammarExam from './GrammarExam'
import { grammarAllItems, grammarSections } from '../../data/grammarIndex'
import { grammarConfusingPairs } from '../../data/grammarConfusingPairs'
import { consumePendingItem } from '../../services/deepLink'
import GrammarLessonCard from '../../components/learning/GrammarLessonCard'

/** Module Ngữ pháp: 30 bài (12 thì + cấu trúc B1 + chủ điểm mở rộng + C1) và bài thi tổng hợp. */
export default function GrammarHub({ onStudyActivity, apiKey }) {
  const {
    progress,
    total,
    completedCount,
    mistakes,
    setLastLesson,
    recordResult,
    recordExam,
    recordMistakes,
  } = useGrammarProgress()
  const provider = typeof localStorage !== 'undefined' ? localStorage.getItem('lingua-ai-provider') || 'gemini' : 'gemini'
  const [pairsOpen, togglePairs] = useSectionState('grammar-pairs', false)
  const [examOpen, setExamOpen] = useState(false)
  const [mistakeQuizOpen, setMistakeQuizOpen] = useState(false)
  // 'list' = danh sách thẻ bài học, 'lesson' = đang học một bài.
  const [view, setView] = useState('list')

  const initialLesson = useMemo(() => {
    const saved = grammarAllItems.find((lesson) => lesson.id === progress.lastLesson)
    if (saved && !progress.completed?.[saved.id]?.passed) return saved
    const nextIncomplete = grammarAllItems.find((lesson) => !progress.completed?.[lesson.id]?.passed)
    return nextIncomplete || saved || grammarAllItems[0]
  }, [progress])
  const [activeId, setActiveId] = useState(initialLesson.id)

  const lesson = useMemo(() => grammarAllItems.find((item) => item.id === activeId) || grammarAllItems[0], [activeId])
  const activeIndex = useMemo(() => grammarAllItems.findIndex((item) => item.id === activeId), [activeId])
  const nextLesson = useMemo(() => grammarAllItems.find((item) => !progress.completed?.[item.id]?.passed) || null, [progress])
  const percent = total ? Math.round((completedCount / total) * 100) : 0
  const mistakeIds = useMemo(() => new Set(mistakes.map((entry) => entry.questionId)), [mistakes])

  const mistakeQuestions = useMemo(
    () => mistakes.map((entry) => entry.question).filter(Boolean),
    [mistakes],
  )

  useEffect(() => {
    const pending = consumePendingItem('grammar')
    if (pending?.itemId) {
      const match = grammarAllItems.find((item) => item.id === pending.itemId)
      if (match) {
        setActiveId(match.id)
        setView('lesson')
      }
    }
  }, [])

  const openLesson = (id) => {
    setActiveId(id)
    setLastLesson(id)
    setView('lesson')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const backToList = () => {
    setView('list')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const goTo = (offset) => {
    const nextIndex = activeIndex + offset
    if (nextIndex < 0 || nextIndex >= grammarAllItems.length) return
    openLesson(grammarAllItems[nextIndex].id)
  }

  const handleResult = (score, totalQuestions, passed, answers) => {
    recordResult(lesson.id, score, totalQuestions, passed, answers)
    onStudyActivity?.()
  }

  return (
    <div className="space-y-5">
      {!examOpen && view !== 'lesson' && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-lg font-black tracking-tight text-slate-900 dark:text-white sm:text-xl">
              30 chủ điểm ngữ pháp
            </h2>
            <p className="mt-0.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              {completedCount}/{total} bài hoàn thành ({percent}%){nextLesson ? ` · Kế tiếp: ${nextLesson.title}` : ''}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {mistakes.length > 0 && (
              <button
                type="button"
                onClick={() => setMistakeQuizOpen((v) => !v)}
                className={`btn-secondary h-10 px-3 text-xs font-semibold ${mistakeQuizOpen ? 'border-amber-500 bg-amber-500/10 text-amber-700 dark:text-amber-300' : ''}`}
                title={`${mistakes.length} câu làm sai cần luyện lại`}
              >
                <AlertTriangle size={14} className="text-amber-500" />
                <span>Ôn {mistakes.length} câu sai</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => setExamOpen(true)}
              className="btn-secondary h-10 px-3.5 text-xs font-semibold"
            >
              <ClipboardCheck size={14} />
              <span>Thi tổng hợp</span>
            </button>
            {nextLesson && (
              <button
                type="button"
                onClick={() => openLesson(initialLesson.id)}
                className="btn-primary h-10 px-4 text-xs font-bold shadow-md shadow-indigo-500/20"
              >
                <PlayCircle size={15} />
                <span>{completedCount ? 'Học tiếp' : 'Bắt đầu học'}</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Panel luyện lại câu sai nhanh khi bấm nút */}
      {view !== 'lesson' && mistakeQuizOpen && mistakeQuestions.length > 0 && (
        <section className="panel p-4 sm:p-5 animate-rise border border-amber-500/30 bg-amber-500/[0.04]">
          <div className="flex items-center justify-between border-b border-amber-500/20 pb-3">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-700 dark:text-amber-300">
              <AlertTriangle size={15} />
              <span>Luyện lại {mistakeQuestions.length} câu sai ngữ pháp</span>
            </div>
            <button
              type="button"
              onClick={() => setMistakeQuizOpen(false)}
              className="btn-ghost h-7 w-7 p-0 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              aria-label="Đóng"
            >
              <X size={15} />
            </button>
          </div>
          <div className="mt-4">
            <GrammarQuiz
              key={`mistakes-${mistakeQuestions.length}`}
              questions={mistakeQuestions}
              immediate
              title="Luyện câu sai"
              subtitle={`${mistakeQuestions.length} câu · đáp án hiện ngay sau mỗi câu`}
              finishLabel="Xong"
              onFinish={() => setMistakeQuizOpen(false)}
              onAnswerResult={(detail) => recordMistakes([detail])}
              apiKey={apiKey}
              provider={provider}
            />
          </div>
        </section>
      )}

      {view !== 'lesson' && (
        <CollapsibleCard
          id="grammar-pairs"
          icon={Layers}
          eyebrow="Hay bị lẫn"
          title="Cặp cấu trúc dễ lẫn"
          description={`${grammarConfusingPairs.length} cặp cấu trúc kèm cách phân biệt và ví dụ`}
          open={pairsOpen}
          onToggle={togglePairs}
        >
          <ul className="grid gap-2 lg:grid-cols-2">
            {grammarConfusingPairs.map((pair) => (
              <li key={pair.id} className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-3 dark:border-white/[0.08] dark:bg-white/[0.03]">
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  <span className="text-indigo-600 dark:text-indigo-400">{pair.left}</span>
                  <span className="mx-2 text-slate-400">vs</span>
                  <span className="text-amber-600 dark:text-amber-400">{pair.right}</span>
                </p>
                <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-300">{pair.point}</p>
                <p className="mt-1 text-xs italic leading-relaxed text-slate-500 dark:text-slate-400">{pair.example}</p>
              </li>
            ))}
          </ul>
        </CollapsibleCard>
      )}

      {examOpen ? (
        <GrammarExam
          apiKey={apiKey}
          provider={provider}
          onExit={() => setExamOpen(false)}
          onFinish={({ correct, total: totalQuestions, details }) => {
            recordExam(correct, totalQuestions, details)
            onStudyActivity?.()
          }}
        />
      ) : view === 'lesson' ? (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <button type="button" onClick={backToList} className="btn-ghost px-3">
              <ArrowLeft size={16} />Danh sách bài
            </button>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Bài {activeIndex + 1}/{grammarAllItems.length}
            </span>
          </div>
          <GrammarLesson
            key={lesson.id}
            lesson={lesson}
            completed={progress.completed?.[lesson.id]}
            onResult={handleResult}
            onPrev={() => goTo(-1)}
            onNext={() => goTo(1)}
            hasPrev={activeIndex > 0}
            hasNext={activeIndex < grammarAllItems.length - 1}
            mistakeIds={mistakeIds}
            onMistake={(detail) => recordMistakes([detail])}
            apiKey={apiKey}
            provider={provider}
          />
        </div>
      ) : (
        <div className="space-y-6">
          <SectionHeader
            title="Bài học của bạn"
            meta={`${grammarAllItems.length} bài · hoàn thành khi đạt từ 80%`}
          />
          <div className="space-y-8">
            {grammarSections.map((section) => {
              const sectionDone = section.items.filter((item) => progress.completed?.[item.id]?.passed).length
              return (
                <section key={section.id} className="space-y-3.5">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200/80 pb-2 dark:border-white/[0.08]">
                    <div className="flex items-center gap-2">
                      <span className="grid h-7 w-7 place-items-center rounded-lg bg-indigo-500/15 text-indigo-600 dark:text-indigo-400">
                        <GraduationCap size={15} />
                      </span>
                      <h3 className="font-display text-sm font-bold text-slate-900 dark:text-white">
                        {section.title}
                      </h3>
                    </div>
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      {sectionDone}/{section.items.length} bài
                    </span>
                  </div>
                  <div className="grid gap-3.5 sm:grid-cols-2 xl:grid-cols-3">
                    {section.items.map((item, index) => (
                      <GrammarLessonCard
                        key={item.id}
                        lesson={item}
                        result={progress.completed?.[item.id]}
                        index={index}
                        onOpen={openLesson}
                      />
                    ))}
                  </div>
                </section>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
