import { useEffect, useState } from 'react'
import { Headphones, BookOpen, Mic, PenLine, ListChecks, Sparkles } from 'lucide-react'
import ModuleHero from '../../components/ui/ModuleHero'
import ModuleTabs from '../../components/ui/ModuleTabs'
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
    <div className="space-y-5">
      <ModuleHero
        icon={Headphones}
        eyebrow="Luyện kỹ năng · B1"
        title="Luyện 4 kỹ năng toàn diện"
        description="Nghe, Đọc, Nói, Viết theo chủ đề B1, kèm luyện câu và thi thử có đồng hồ."
        accent="#14b8d4"
        deep="#087f9b"
        illustration="skills"
        compact
        progress={Math.round(((listeningDone + readingDone) / Math.max(1, listeningLessons.length + readingPassages.length)) * 100)}
        progressLabel="Nghe + Đọc đã hoàn thành"
        stats={[{ label: 'Bài nghe', value: `${listeningDone}/${listeningLessons.length}` }, { label: 'Bài đọc', value: `${readingDone}/${readingPassages.length}` }, { label: 'Luyện câu', value: `${sentenceAccuracy}%` }]}
        action="Bắt đầu luyện nghe"
        onAction={() => setTab('listening')}
      >
        <ModuleTabs items={TABS} value={tab} onChange={setTab} ariaLabel="Chọn kỹ năng luyện tập" />
      </ModuleHero>

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
