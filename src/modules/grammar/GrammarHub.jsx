import { useEffect, useMemo, useState } from 'react'
import { AlertTriangle, ArrowLeft, BadgeCheck, GraduationCap, Layers, Sparkles, Trash2 } from 'lucide-react'
import CollapsibleCard from '../../components/ui/CollapsibleCard'
import useSectionState from '../../hooks/useSectionState'
import useGrammarProgress from '../../hooks/useGrammarProgress'
import GrammarLesson from './GrammarLesson'
import GrammarQuiz from './GrammarQuiz'
import GrammarExam from './GrammarExam'
import { grammarAllItems, grammarSections } from '../../data/grammarIndex'
import { grammarConfusingPairs } from '../../data/grammarConfusingPairs'
import { consumePendingItem } from '../../services/deepLink'
import { dataService } from '../../services/dataService'
import { toast } from '../../services/toast'
import GrammarOverviewBanner from '../../components/learning/GrammarOverviewBanner'
import GrammarLessonCard from '../../components/learning/GrammarLessonCard'

const MISTAKE_DECK_TITLE = 'Ngữ pháp · câu hay sai'

/** Module Ngữ pháp: 30 bài (12 thì + cấu trúc B1 + chủ điểm mở rộng + C1), sổ câu sai và bài thi tổng hợp. */
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
    removeMistake,
    clearMistakes,
  } = useGrammarProgress()
  const provider = typeof localStorage !== 'undefined' ? localStorage.getItem('lingua-ai-provider') || 'gemini' : 'gemini'
  const [pairsOpen, togglePairs] = useSectionState('grammar-pairs', false)
  const [mistakesOpen, toggleMistakes] = useSectionState('grammar-mistakes', true)
  const [examOpen, setExamOpen] = useState(false)
  const [mistakeQuizOpen, setMistakeQuizOpen] = useState(false)
  const [busy, setBusy] = useState('')
  // 'list' = danh sách thẻ bài học (giống danh sách đề VSTEP), 'lesson' = đang học một bài.
  const [view, setView] = useState('list')

  const initialLesson = useMemo(() => {
    const saved = grammarAllItems.find((lesson) => lesson.id === progress.lastLesson)
    if (saved && !progress.completed?.[saved.id]?.passed) return saved
    const nextIncomplete = grammarAllItems.find((lesson) => !progress.completed?.[lesson.id]?.passed)
    return nextIncomplete || saved || grammarAllItems[0]
  }, [progress])
  const [activeId, setActiveId] = useState(initialLesson.id)

  // Mở đúng bài khi người dùng chọn kết quả từ tìm kiếm toàn cục (Ctrl/⌘+K).
  useEffect(() => {
    const pending = consumePendingItem('grammar')
    if (pending?.itemId && grammarAllItems.some((item) => item.id === pending.itemId)) {
      setActiveId(pending.itemId)
      setView('lesson')
    }
  }, [])

  const activeIndex = Math.max(0, grammarAllItems.findIndex((lesson) => lesson.id === activeId))
  const lesson = grammarAllItems[activeIndex] || grammarAllItems[0]
  const percent = total ? Math.round((completedCount / total) * 100) : 0
  const nextLesson = initialLesson
  const mistakeIds = useMemo(() => mistakes.map((entry) => entry.questionId), [mistakes])
  const mistakeQuestions = useMemo(() => mistakes.map((entry) => entry.question).slice(0, 20), [mistakes])

  const scrollToTop = () => {
    window.setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 60)
  }

  /** Mở nội dung một bài: từ danh sách thẻ chuyển sang màn hình học của bài đó. */
  const openLesson = (id, { open = true } = {}) => {
    setActiveId(id)
    setLastLesson(id)
    if (open) setView('lesson')
    scrollToTop()
  }

  /** Về danh sách thẻ bài học. */
  const backToList = () => {
    setView('list')
    scrollToTop()
  }

  const goTo = (offset) => {
    const next = grammarAllItems[activeIndex + offset]
    if (!next) return
    openLesson(next.id)
  }

  const handleResult = (correct, totalQuestions, details = []) => {
    const passed = totalQuestions > 0 && correct / totalQuestions >= 0.8
    // Chỉ tính vào chuỗi ngày học khi bài kiểm tra đạt yêu cầu.
    if (passed) onStudyActivity?.()
    // Đạt ≥80% bài kiểm tra cuối bài = hoàn thành bài học (đánh dấu ✓ trong danh sách).
    if (passed && !progress.completed?.[lesson.id]?.passed) {
      toast.success(`Đã hoàn thành bài “${lesson.title}”.`)
    }
    recordResult(lesson.id, correct, totalQuestions, details)
  }

  /** Chuyển các câu sai thành bộ flashcard để ôn bằng SRS trong tab Từ vựng. */
  const createMistakeDeck = async () => {
    if (!mistakes.length) return
    setBusy('deck')
    try {
      const decks = await dataService.getDecks()
      let deck = decks.find((item) => item.title === MISTAKE_DECK_TITLE)
      if (!deck) deck = await dataService.createDeck(MISTAKE_DECK_TITLE)
      const existing = await dataService.getCards(deck.id)
      const seen = new Set(existing.map((card) => card.word))
      const cards = mistakes
        .filter((entry) => !seen.has(entry.prompt.slice(0, 70)))
        .map((entry) => ({
          deckId: deck.id,
          word: entry.prompt.length > 70 ? `${entry.prompt.slice(0, 67)}…` : entry.prompt,
          ipa: '',
          meaning: `Đáp án: ${entry.answer}`,
          example: `${entry.prompt}${entry.explain ? `\n(${entry.explain})` : ''}`,
          level: 'B1',
          status: 'new',
          reviewDate: null,
          interval: 0,
          nextReviewDate: null,
          repetition: 0,
        }))
      if (!cards.length) {
        toast.info('Các câu sai này đã có trong bộ thẻ ngữ pháp.')
        return
      }
      await dataService.addCards(cards)
      toast.success(`Đã thêm ${cards.length} câu vào bộ “${MISTAKE_DECK_TITLE}” ở tab Từ vựng.`)
    } catch (error) {
      toast.error(error.message || 'Không thể tạo bộ thẻ ngữ pháp.')
    } finally {
      setBusy('')
    }
  }

  return (
    <div className="space-y-4">
      {!examOpen && view === 'list' && (
        <GrammarOverviewBanner
          completedCount={completedCount}
          total={total}
          percent={percent}
          nextLesson={nextLesson}
          mistakesCount={mistakes.length}
          onStart={() => openLesson(initialLesson.id)}
          onExam={() => setExamOpen(true)}
        />
      )}

      <CollapsibleCard
        id="grammar-mistakes"
        icon={AlertTriangle}
        eyebrow="Ôn tập cá nhân"
        title="Sổ câu sai"
        description={mistakes.length ? `${mistakes.length} câu bạn từng làm sai — luyện lại hoặc chuyển thành flashcard` : 'Câu làm sai sẽ được lưu tự động ở đây'}
        badge={<span className={`chip ${mistakes.length ? 'bg-warnbg text-warn' : 'bg-ink/[0.06] text-ink/60 dark:bg-white/10 dark:text-white/60'}`}>{mistakes.length} câu</span>}
        open={mistakesOpen}
        onToggle={toggleMistakes}
      >
        {!mistakes.length ? (
          <p className="text-sm text-ink/60 dark:text-white/60">Chưa có câu sai. Câu làm sai ở luyện tập hoặc bài kiểm tra sẽ tự động vào đây.</p>
        ) : (
          <>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={() => setMistakeQuizOpen((value) => !value)} className="btn-primary px-4">
                <Sparkles size={16} />{mistakeQuizOpen ? 'Ấn luyện lại' : `Luyện lại ${Math.min(mistakes.length, 20)} câu sai`}
              </button>
              <button type="button" onClick={createMistakeDeck} disabled={busy === 'deck'} className="btn-secondary px-4">
                <Layers size={16} />{busy === 'deck' ? 'Đang tạo…' : 'Tạo bộ flashcard'}
              </button>
              <button
                type="button"
                onClick={() => { if (window.confirm('Xoá toàn bộ sổ câu sai?')) { clearMistakes(); toast.success('Đã xoá sổ câu sai.') } }}
                className="btn-ghost px-3 text-xs text-danger dark:text-dangerfgdark"
              >
                <Trash2 size={14} />Xoá sổ
              </button>
            </div>

            {mistakeQuizOpen && mistakeQuestions.length > 0 && (
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
            )}

            <ul className="mt-4 space-y-2">
              {mistakes.slice(0, 20).map((entry) => (
                <li key={entry.questionId} className="rounded-xl border border-ink/[0.08] p-3 dark:border-white/[0.08]">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <p className="min-w-0 flex-1 text-sm font-semibold leading-6">{entry.prompt}</p>
                    <span className="chip shrink-0 bg-warnbg text-warn">sai {entry.count} lần</span>
                  </div>
                  <p className="mt-1.5 text-xs text-ink/70 dark:text-white/70">Bạn trả lời: <span className="font-bold">{entry.response || '(bỏ trống)'}</span></p>
                  <p className="mt-0.5 text-xs text-ink/70 dark:text-white/70">Đáp án: <span className="font-bold text-sage">{entry.answer}</span></p>
                  {entry.explain && <p className="mt-1 text-xs text-ink/60 dark:text-white/60">{entry.explain}</p>}
                  <div className="mt-2 flex flex-wrap gap-2 text-xs">
                    <button type="button" onClick={() => openLesson(entry.lessonId)} className="inline-flex min-h-[36px] items-center gap-1.5 rounded-lg border border-ink/10 px-2.5 font-bold text-ink/70 transition hover:bg-ink/[0.05] dark:border-white/15 dark:text-white/70">
                      <BadgeCheck size={13} />{entry.lessonTitle || 'Xem bài'}
                    </button>
                    <button type="button" onClick={() => removeMistake(entry.questionId)} className="inline-flex min-h-[36px] items-center gap-1.5 rounded-lg px-2.5 font-bold text-danger transition hover:bg-danger/10 dark:text-dangerfgdark">
                      <Trash2 size={13} />Đã hiểu, xoá
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            {mistakes.length > 20 && <p className="mt-2 text-xs text-ink/55 dark:text-white/55">Còn {mistakes.length - 20} câu khác trong sổ.</p>}
          </>
        )}
      </CollapsibleCard>

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
            <li key={pair.id} className="rounded-xl border border-ink/[0.08] p-3 dark:border-white/[0.08]">
              <p className="text-sm font-bold">
                <span className="text-sage">{pair.left}</span>
                <span className="mx-2 text-ink/40 dark:text-white/40">vs</span>
                <span className="text-warn">{pair.right}</span>
              </p>
              <p className="mt-1.5 text-xs leading-5 text-ink/70 dark:text-white/70">{pair.point}</p>
              <p className="mt-1.5 text-xs italic leading-5 text-ink/60 dark:text-white/60">{pair.example}</p>
            </li>
          ))}
        </ul>
      </CollapsibleCard>

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
            <span className="text-xs font-semibold text-ink/55 dark:text-white/55">
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
        <div className="space-y-8">
          <section className="space-y-4">
            <div className="flex flex-wrap items-end justify-between gap-2">
              <div><p className="eyebrow">Lộ trình từng bước</p><h2 className="mt-1 font-display text-xl font-bold tracking-tight">Bài học của bạn</h2></div>
              <span className="text-xs font-semibold text-ink/55 dark:text-white/55">{grammarAllItems.length} bài · hoàn thành khi đạt từ 80%</span>
            </div>
            <div className="space-y-8">
              {grammarSections.map((section) => {
                const sectionDone = section.items.filter((item) => progress.completed?.[item.id]?.passed).length
                return (
                  <section key={section.id} className="space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-ink/[0.08] pb-2 dark:border-white/[0.08]">
                      <div className="flex items-center gap-2.5"><span className="grid h-8 w-8 place-items-center rounded-xl bg-[#ce82ff]/20 text-[#7652b8] dark:bg-[#ce82ff]/20 dark:text-[#e6c9ff]"><GraduationCap size={16} /></span><h3 className="font-display text-base font-bold">{section.title}</h3></div>
                      <span className="text-xs font-semibold text-ink/55 dark:text-white/55">{sectionDone}/{section.items.length} bài</span>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                      {section.items.map((item, index) => <GrammarLessonCard key={item.id} lesson={item} result={progress.completed?.[item.id]} index={index} onOpen={openLesson} />)}
                    </div>
                  </section>
                )
              })}
            </div>
          </section>
        </div>
      )}
    </div>
  )
}
