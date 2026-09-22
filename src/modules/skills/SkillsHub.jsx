import { useEffect, useState } from 'react'
import { Headphones, BookOpen, Mic, PenLine, ListChecks, Sparkles } from 'lucide-react'
import ListeningView from './ListeningView'
import ReadingView from './ReadingView'
import SpeakingView from './SpeakingView'
import WritingView from './WritingView'
import SentenceView from './SentenceView'
import MockTestView from './MockTestView'
import useSkillsProgress from '../../hooks/useSkillsProgress'
import useMistakeBank from '../../hooks/useMistakeBank'
import { consumePendingItem } from '../../services/deepLink'
import { listeningLessons } from '../../data/skills/listening'
import { readingPassages } from '../../data/skills/reading'

const TABS = [
  { id: 'listening', label: 'Nghe', icon: Headphones },
  { id: 'reading', label: 'Đọc', icon: BookOpen },
  { id: 'speaking', label: 'Nói', icon: Mic },
  { id: 'writing', label: 'Viết', icon: PenLine },
  { id: 'sentence', label: 'Luyện câu', icon: ListChecks },
  { id: 'mock', label: 'Thi thử B1', icon: Sparkles },
]

/** Trung tâm luyện 4 kỹ năng + luyện câu + thi thử B1. */
export default function SkillsHub({ onStudyActivity }) {
  const [tab, setTab] = useState('listening')
  const [focusId, setFocusId] = useState(null)
  const { progress, recordSection, recordMock, recordSentence } = useSkillsProgress()
  const { record: recordMistakes } = useMistakeBank()

  // Mở đúng tab/bài khi đến từ tìm kiếm toàn cục (Ctrl/⌘+K).
  useEffect(() => {
    const pending = consumePendingItem('skills')
    if (!pending) return
    if (TABS.some((item) => item.id === pending.type)) setTab(pending.type)
    if (pending.itemId && pending.type !== 'sentence') setFocusId(pending.itemId)
  }, [])

  const listeningDone = Object.keys(progress.listening || {}).length
  const readingDone = Object.keys(progress.reading || {}).length
  const sentenceAccuracy = progress.sentence?.attempted
    ? Math.round((progress.sentence.correct / progress.sentence.attempted) * 100)
    : 0

  return (
    <div className="space-y-4">
      <nav className="panel p-3" aria-label="Kỹ năng luyện tập">
        <div className="flex flex-wrap gap-1.5 pb-0.5 sm:flex-nowrap sm:overflow-x-auto">
          {TABS.map((item) => {
            const active = item.id === tab
            const Icon = item.icon
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                aria-pressed={active}
                className={`flex min-h-[40px] min-w-max items-center gap-1.5 rounded-xl px-3 text-xs font-bold transition ${active ? 'bg-lime text-ink' : 'text-ink/70 hover:bg-ink/[0.05] dark:text-white/70 dark:hover:bg-white/[0.08]'}`}
              >
                <Icon size={15} />{item.label}
              </button>
            )
          })}
        </div>
      </nav>

      <section className="panel p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <h2 className="font-display text-base font-bold">Luyện 4 kỹ năng · B1</h2>
            <p className="mt-0.5 text-xs text-ink/60 dark:text-white/60">Nghe · Đọc · Nói · Viết theo chủ đề B1, kèm luyện câu và thi thử có đồng hồ.</p>
          </div>
          <ul className="grid w-full grid-cols-3 gap-2 sm:w-auto">
            <li className="panel-flat px-3 py-2">
              <p className="text-xs text-ink/60 dark:text-white/60">Bài nghe</p>
              <p className="metric text-base">{listeningDone}/{listeningLessons.length}</p>
            </li>
            <li className="panel-flat px-3 py-2">
              <p className="text-xs text-ink/60 dark:text-white/60">Bài đọc</p>
              <p className="metric text-base">{readingDone}/{readingPassages.length}</p>
            </li>
            <li className="panel-flat px-3 py-2">
              <p className="text-xs text-ink/60 dark:text-white/60">Luyện câu</p>
              <p className="metric text-base">{sentenceAccuracy}%</p>
            </li>
          </ul>
        </div>
      </section>

      {tab === 'listening' && (
        <ListeningView
          progress={progress}
          focusId={focusId}
          onResult={(id, correct, total, details) => {
            recordSection('listening', id, correct, total)
            recordMistakes(details, 'listening', id)
            onStudyActivity?.()
          }}
        />
      )}
      {tab === 'reading' && (
        <ReadingView
          progress={progress}
          focusId={focusId}
          onResult={(id, correct, total, details) => {
            recordSection('reading', id, correct, total)
            recordMistakes(details, 'reading', id)
            onStudyActivity?.()
          }}
        />
      )}
      {tab === 'speaking' && <SpeakingView focusId={focusId} />}
      {tab === 'writing' && <WritingView />}
      {tab === 'sentence' && <SentenceView onStats={(correct, total) => { recordSentence(correct, total); if (correct > 0) onStudyActivity?.() }} />}
      {tab === 'mock' && <MockTestView history={progress.mock} onFinish={(score, total, details) => { recordMock(score, total); recordMistakes(details, 'mock', 'mock'); onStudyActivity?.() }} />}
    </div>
  )
}
