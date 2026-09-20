import { useEffect, useMemo, useRef, useState } from 'react'
import { AlertTriangle, BadgeCheck, GraduationCap, Layers, PlayCircle, Sparkles, Table2, Trash2 } from 'lucide-react'
import CollapsibleCard from '../../components/ui/CollapsibleCard'
import useSectionState from '../../hooks/useSectionState'
import useGrammarProgress from '../../hooks/useGrammarProgress'
import GrammarLesson from './GrammarLesson'
import GrammarQuiz from './GrammarQuiz'
import GrammarExam from './GrammarExam'
import { grammarCheatSheet } from '../../data/grammarCurriculum'
import { grammarAllItems, grammarSections, grammarTopicCheatSheet } from '../../data/grammarIndex'
import { grammarConfusingPairs } from '../../data/grammarConfusingPairs'
import { consumePendingItem } from '../../services/deepLink'
import { dataService } from '../../services/dataService'
import { toast } from '../../services/toast'

const MISTAKE_DECK_TITLE = 'Ngữ pháp · câu hay sai'

/** Module Ngữ pháp: 30 bài (12 thì + cấu trúc B1 + chủ điểm mở rộng + C1), sổ câu sai và bài thi tổng hợp. */
export default function GrammarHub({ onStudyActivity, apiKey }) {
  const {
    progress,
    total,
    completedCount,
    mistakes,
    examHistory,
    setLastLesson,
    recordResult,
    recordExam,
    recordMistakes,
    removeMistake,
    clearMistakes,
  } = useGrammarProgress()
  const provider = typeof localStorage !== 'undefined' ? localStorage.getItem('lingua-ai-provider') || 'gemini' : 'gemini'
  const [cheatOpen, toggleCheat] = useSectionState('grammar-cheatsheet', false)
  const [sheetTopicsOpen, toggleSheetTopics] = useSectionState('grammar-sheet-topics', false)
  const [pairsOpen, togglePairs] = useSectionState('grammar-pairs', false)
  const [mistakesOpen, toggleMistakes] = useSectionState('grammar-mistakes', true)
  const [examOpen, setExamOpen] = useState(false)
  const [mistakeQuizOpen, setMistakeQuizOpen] = useState(false)
  const [busy, setBusy] = useState('')
  const lessonAreaRef = useRef(null)

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
    if (pending?.itemId && grammarAllItems.some((item) => item.id === pending.itemId)) setActiveId(pending.itemId)
  }, [])

  const activeIndex = Math.max(0, grammarAllItems.findIndex((lesson) => lesson.id === activeId))
  const lesson = grammarAllItems[activeIndex] || grammarAllItems[0]
  const percent = Math.round((completedCount / total) * 100)
  const mistakeIds = useMemo(() => mistakes.map((entry) => entry.questionId), [mistakes])
  const mistakeQuestions = useMemo(() => mistakes.map((entry) => entry.question).slice(0, 20), [mistakes])
  const bestExam = examHistory.reduce((best, item) => (!best || item.percent > best.percent ? item : best), null)

  const scrollToLesson = () => {
    window.setTimeout(() => lessonAreaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60)
  }

  const selectLesson = (id) => {
    setActiveId(id)
    setLastLesson(id)
    scrollToLesson()
  }

  const goTo = (offset) => {
    const next = grammarAllItems[activeIndex + offset]
    if (!next) return
    selectLesson(next.id)
  }

  const handleResult = (correct, totalQuestions, details = []) => {
    // Chỉ tính vào chuỗi ngày học khi bài kiểm tra đạt yêu cầu.
    if (totalQuestions > 0 && correct / totalQuestions >= 0.8) onStudyActivity?.()
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
      <section className="panel p-4 sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="eyebrow">Ngữ pháp nền tảng</p>
            <h2 className="mt-1 flex items-center gap-2 font-display text-xl font-bold">
              <GraduationCap size={20} className="text-sage" /> 12 thì &amp; cấu trúc B1
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-ink/70 dark:text-white/70">
              30 bài: 12 thì, cấu trúc B1 (điều kiện, bị động, mệnh đề quan hệ, giới từ, liên từ, cấu tạo từ…), chủ điểm mở rộng
              và cấu trúc C1 (câu chẻ, đảo ngữ, mệnh đề phân từ, danh hoá). Mỗi bài có cấu trúc – cách dùng – dấu hiệu – lỗi thường gặp
              – luyện tập nhanh – bài kiểm tra cuối bài. Câu làm sai được lưu vào sổ câu sai để ôn lại.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => selectLesson(initialLesson.id)} className="btn-primary px-4">
              <PlayCircle size={16} />
              {completedCount ? 'Tiếp tục học' : 'Bắt đầu học'}
            </button>
            <button type="button" onClick={() => setExamOpen((value) => !value)} className="btn-secondary px-4">
              <GraduationCap size={16} />{examOpen ? 'Về danh sách bài' : 'Thi tổng hợp'}
            </button>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-ink/10 dark:bg-white/15">
            <div className="h-full rounded-full bg-lime transition-all" style={{ width: `${percent}%` }} />
          </div>
          <span className="metric shrink-0 text-sm">
            {completedCount}/{total} bài
          </span>
        </div>
      </section>

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
          <p className="text-sm text-ink/60 dark:text-white/60">Chưa có câu sai nào. Làm luyện tập nhanh hoặc bài kiểm tra cuối bài — câu sai sẽ tự động vào đây.</p>
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
                    <button type="button" onClick={() => selectLesson(entry.lessonId)} className="inline-flex min-h-[36px] items-center gap-1.5 rounded-lg border border-ink/10 px-2.5 font-bold text-ink/70 transition hover:bg-ink/[0.05] dark:border-white/15 dark:text-white/70">
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
        id="grammar-cheatsheet"
        icon={Table2}
        eyebrow="Tra cứu nhanh"
        title="Bảng cấu trúc 12 thì"
        description="Công thức khẳng định và dấu hiệu nhận biết của cả 12 thì"
        open={cheatOpen}
        onToggle={toggleCheat}
      >
        <div className="-mx-1 overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-[0.06em] text-ink/60 dark:text-white/60">
                <th className="px-2 py-2 font-bold">#</th>
                <th className="px-2 py-2 font-bold">Thì</th>
                <th className="px-2 py-2 font-bold">Cấu trúc khẳng định</th>
                <th className="px-2 py-2 font-bold">Ví dụ</th>
                <th className="px-2 py-2 font-bold">Dấu hiệu</th>
              </tr>
            </thead>
            <tbody>
              {grammarCheatSheet.map((row) => (
                <tr key={row.id} className="border-t border-ink/[0.08] align-top dark:border-white/[0.08]">
                  <td className="px-2 py-2.5 tabular-nums text-ink/60 dark:text-white/60">{row.order}</td>
                  <td className="px-2 py-1">
                    <button type="button" onClick={() => selectLesson(row.id)} className="flex min-h-[44px] w-full flex-col justify-center text-left font-bold hover:underline">
                      {row.title}
                      <span className="text-xs font-normal text-ink/60 dark:text-white/60">{row.en}</span>
                    </button>
                  </td>
                  <td className="px-2 py-2.5 font-mono text-xs text-sage">{row.pattern}</td>
                  <td className="px-2 py-2.5 text-xs italic text-ink/80 dark:text-white/80">{row.example}</td>
                  <td className="px-2 py-2.5 text-xs text-ink/60 dark:text-white/60">{row.signal}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CollapsibleCard>

      <CollapsibleCard
        id="grammar-sheet-topics"
        icon={Table2}
        eyebrow="Tra cứu nhanh"
        title="Bảng cấu trúc chủ điểm & C1"
        description="Công thức và dấu hiệu của 10 chủ điểm ngoài 12 thì"
        open={sheetTopicsOpen}
        onToggle={toggleSheetTopics}
      >
        <div className="-mx-1 overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-[0.06em] text-ink/60 dark:text-white/60">
                <th className="px-2 py-2 font-bold">Nhóm</th>
                <th className="px-2 py-2 font-bold">Chủ điểm</th>
                <th className="px-2 py-2 font-bold">Cấu trúc mẫu</th>
                <th className="px-2 py-2 font-bold">Ví dụ</th>
                <th className="px-2 py-2 font-bold">Dấu hiệu</th>
              </tr>
            </thead>
            <tbody>
              {grammarTopicCheatSheet.map((row) => (
                <tr key={row.id} className="border-t border-ink/[0.08] align-top dark:border-white/[0.08]">
                  <td className="px-2 py-2.5 text-xs text-ink/60 dark:text-white/60">{row.group}</td>
                  <td className="px-2 py-1">
                    <button type="button" onClick={() => selectLesson(row.id)} className="flex min-h-[44px] w-full flex-col justify-center text-left font-bold hover:underline">
                      {row.title}
                      <span className="text-xs font-normal text-ink/60 dark:text-white/60">{row.en}</span>
                    </button>
                  </td>
                  <td className="px-2 py-2.5 font-mono text-xs text-sage">{row.pattern}</td>
                  <td className="px-2 py-2.5 text-xs italic text-ink/80 dark:text-white/80">{row.example}</td>
                  <td className="px-2 py-2.5 text-xs text-ink/60 dark:text-white/60">{row.signal}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
      ) : (
      <div className="space-y-4 lg:grid lg:grid-cols-[272px_1fr] lg:items-start lg:gap-5 lg:space-y-0">
        <nav className="panel p-3 lg:sticky lg:top-4" aria-label="Danh sách bài ngữ pháp">
          <p className="eyebrow hidden px-2 pb-2 lg:block">Danh sách bài</p>
          <div className="flex gap-2 overflow-x-auto pb-1 lg:block lg:space-y-1 lg:overflow-visible lg:pb-0">
            {grammarSections.map((section) => (
              <div key={section.id} className="min-w-max lg:min-w-0">
                <p className="eyebrow min-w-max whitespace-nowrap px-2 pb-1 pt-2">{section.title}</p>
                <div className="flex gap-2 lg:block lg:space-y-1">
                  {section.items.map((item) => {
                    const active = item.id === lesson.id
                    const done = progress.completed?.[item.id]?.passed
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => selectLesson(item.id)}
                        aria-current={active ? 'true' : undefined}
                        className={`flex min-h-[44px] min-w-max items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm transition lg:w-full ${active ? 'bg-lime text-ink' : 'text-ink/70 hover:bg-ink/[0.05] dark:text-white/70 dark:hover:bg-white/[0.08]'}`}
                      >
                        <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg text-xs font-bold ${active ? 'bg-ink/10' : 'bg-ink/[0.06] dark:bg-white/10'}`}>
                          {item.order > 100 ? '+' : item.order}
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate font-bold">{item.title}</span>
                          <span className={`block truncate text-xs ${active ? 'text-ink/70' : 'text-ink/60 dark:text-white/60'}`}>{item.en}</span>
                        </span>
                        {done && <BadgeCheck size={16} className={`ml-auto shrink-0 ${active ? 'text-ink/70' : 'text-ok dark:text-okfgdark'}`} />}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </nav>

        <div ref={lessonAreaRef} className="scroll-mt-4">
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
      </div>
      )}
    </div>
  )
}
