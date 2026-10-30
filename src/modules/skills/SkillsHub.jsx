import { useEffect, useState } from 'react'
import { Headphones, BookOpen, Mic, PenLine, ListChecks, Sparkles } from 'lucide-react'
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

const TABS = [
  { id: 'listening', label: 'Nghe', icon: Headphones },
  { id: 'reading', label: 'Đọc', icon: BookOpen },
  { id: 'speaking', label: 'Nói', icon: Mic },
  { id: 'writing', label: 'Viết', icon: PenLine },
  { id: 'sentence', label: 'Luyện câu', icon: ListChecks },
  { id: 'mock', label: 'Thi thử B1', icon: Sparkles },
]

/** Trung tâm luyện 4 kỹ năng + luyện câu + thi thử B1. */
export default function SkillsHub({ onStudyActivity, apiKey, user, onNavigate }) {
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

  return (
    <div className="space-y-5">
      <ModuleTabs items={TABS} value={tab} onChange={setTab} ariaLabel="Chọn kỹ năng luyện tập" />

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
      {tab === 'writing' && <WritingView apiKey={apiKey} user={user} onStudyActivity={onStudyActivity} onNavigate={onNavigate} />}
      {tab === 'sentence' && <SentenceView onStats={(correct, total) => { recordSentence(correct, total); if (correct > 0) onStudyActivity?.() }} />}
      {tab === 'mock' && <MockTestView history={progress.mock} onFinish={(score, total, details) => { recordMock(score, total); recordMistakes(details, 'mock', 'mock'); onStudyActivity?.() }} />}
    </div>
  )
}
