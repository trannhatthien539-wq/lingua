import { useEffect, useState } from 'react'
import AuthModal from './components/AuthModal'
import { auth, authPersistence } from './services/firebase'
import { getRedirectResult, onAuthStateChanged } from 'firebase/auth'
import Sidebar from './components/layout/Sidebar'
import Topbar from './components/layout/Topbar'
import { navigationItems } from './data/navigation'
import { useTheme } from './hooks/useTheme'
import { formatDate } from './lib/formatters'
import StudyPlanner from './modules/planner/StudyPlanner'
import StudyMindmap from './modules/mindmap/StudyMindmap'
import ApiSettings from './modules/settings/ApiSettings'
import { GrammarChecker } from './modules/learning/GrammarAndVocabulary'
import VocabularyHub from './modules/learning/VocabularyHub'

const modules = { vocabulary: VocabularyHub, grammar: GrammarChecker, planner: StudyPlanner, mindmap: StudyMindmap, settings: ApiSettings }

export default function App() {
  const [activeTab, setActiveTab] = useState('vocabulary')
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const activeItem = navigationItems.find((item) => item.id === activeTab)
  const ActiveModule = modules[activeTab]
  useEffect(() => {
    const openPractice = () => setActiveTab('vocabulary')
    window.addEventListener('lingua:open-practice', openPractice)
    return () => window.removeEventListener('lingua:open-practice', openPractice)
  }, [])
  useEffect(() => {
    let active = true
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => { if (active) { setUser(currentUser); setAuthLoading(false) } })
    authPersistence.then(() => getRedirectResult(auth)).then((result) => { if (active && result?.user) setUser(result.user) }).catch(() => {})
    return () => { active = false; unsubscribe() }
  }, [])

  if (authLoading) return <div className="grid min-h-screen place-items-center bg-[#151a18] text-white"><div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-lime" /></div>
  if (!user) return <div className="min-h-screen bg-[#151a18]"><AuthModal isOpen onClose={() => {}} onAuthSuccess={() => {}} /></div>

  return <div className="min-h-screen bg-mist text-ink transition-colors dark:bg-[#151a18] dark:text-white"><Sidebar activeTab={activeTab} onTabChange={setActiveTab} theme={theme} onToggleTheme={toggleTheme} user={user} onOpenAuth={() => setIsAuthModalOpen(true)} /><main className="min-h-screen lg:ml-[272px]"><div className="mx-auto max-w-[1440px] px-5 py-6 sm:px-8 sm:py-8 lg:px-12 lg:py-10"><Topbar title={activeItem.label} eyebrow={activeTab === 'vocabulary' ? `Tuesday · ${formatDate()}` : activeItem.description} /><div className="animate-[fade-in_400ms_ease-out]" key={activeTab}><ActiveModule /></div></div></main><AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} onAuthSuccess={() => setIsAuthModalOpen(false)} /></div>
}
