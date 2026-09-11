import { useEffect, useState } from 'react'
import AuthModal from './components/AuthModal'
import { supabase } from './services/supabaseClient'
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
    supabase.auth.getSession().then(({ data: { session } }) => { if (active) setUser(session?.user || null) })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setUser(session?.user || null))
    return () => { active = false; subscription.unsubscribe() }
  }, [])

  return <div className="min-h-screen bg-mist text-ink transition-colors dark:bg-[#151a18] dark:text-white"><Sidebar activeTab={activeTab} onTabChange={setActiveTab} theme={theme} onToggleTheme={toggleTheme} user={user} onOpenAuth={() => setIsAuthModalOpen(true)} /><main className="min-h-screen lg:ml-[272px]"><div className="mx-auto max-w-[1440px] px-5 py-6 sm:px-8 sm:py-8 lg:px-12 lg:py-10"><Topbar title={activeItem.label} eyebrow={activeTab === 'vocabulary' ? `Tuesday · ${formatDate()}` : activeItem.description} /><div className="animate-[fade-in_400ms_ease-out]" key={activeTab}><ActiveModule /></div></div></main><AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} onAuthSuccess={() => setIsAuthModalOpen(false)} /></div>
}
