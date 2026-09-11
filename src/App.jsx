import { useEffect, useState } from 'react'
import AuthPage from './components/Auth/AuthPage'
import { auth, googleProvider, onAuthStateChanged, signInWithPopup, signOut } from './services/firebase'
import { readApiKeyForUser } from './services/apiKeyStorage'
import { readGuestStreak, updateUserStreak } from './services/streakService'
import { clearGuestVocabulary } from './services/dataService'
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
import MobileBottomNav from './components/MobileBottomNav'
import MobileHeader from './components/MobileHeader'
import AccountPanel from './components/AccountPanel'

const modules = { vocabulary: VocabularyHub, grammar: GrammarChecker, planner: StudyPlanner, mindmap: StudyMindmap, settings: ApiSettings }

export default function App() {
  const [activeTab, setActiveTab] = useState('vocabulary')
  const [user, setUser] = useState(null)
  const [showAuthPage, setShowAuthPage] = useState(false)
  const [streak, setStreak] = useState(() => readGuestStreak())
  const [apiKey, setApiKey] = useState('')
  const [notice, setNotice] = useState('')
  const { theme, toggleTheme } = useTheme()
  const activeItem = navigationItems.find((item) => item.id === activeTab)
  const ActiveModule = modules[activeTab]
  useEffect(() => {
    localStorage.removeItem('lingua-ai-api-key')
    const openPractice = () => setActiveTab('vocabulary')
    window.addEventListener('lingua:open-practice', openPractice)
    return () => window.removeEventListener('lingua:open-practice', openPractice)
  }, [])
  useEffect(() => {
    return onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser)
      setApiKey(readApiKeyForUser(nextUser))
      if (nextUser) {
        setActiveTab('vocabulary')
        setShowAuthPage(false)
        updateUserStreak(nextUser.uid).then(setStreak).catch(() => setStreak({ currentStreak: 0, lastActiveDate: null, totalSessions: 0 }))
      } else {
        setStreak(readGuestStreak())
      }
    })
  }, [])

  const recordStudyActivity = () =>
    updateUserStreak(user?.uid).then(setStreak).catch(() => {})
  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider)
      setNotice('Đăng nhập Google thành công.')
      window.setTimeout(() => setNotice(''), 2600)
    } catch (authError) {
      setNotice(authError.code === 'auth/popup-closed-by-user' ? 'Bạn đã đóng cửa sổ đăng nhập.' : 'Không thể đăng nhập Google. Vui lòng thử lại.')
      window.setTimeout(() => setNotice(''), 3200)
    }
  }
  const handleSignOut = async () => {
    setApiKey('')
    clearGuestVocabulary()
    localStorage.removeItem('lingua-ai-api-key')
    await signOut(auth)
    setShowAuthPage(true)
  }

  if (showAuthPage && !user) return <AuthPage onGuest={() => setShowAuthPage(false)} />

  return <div className="min-h-screen bg-mist pt-[env(safe-area-inset-top)] text-ink transition-colors dark:bg-[#151a18] dark:text-white"><MobileHeader user={user} streak={streak} notice={notice} onGoogleLogin={handleGoogleLogin} onSignOut={handleSignOut} /><Sidebar activeTab={activeTab} onTabChange={setActiveTab} theme={theme} onToggleTheme={toggleTheme} user={user} streak={streak} onOpenAuth={() => setShowAuthPage(true)} onSignOut={handleSignOut} /><main className="min-h-screen pb-20 md:pb-0 lg:ml-[272px]"><div className="mx-auto max-w-[1440px] px-4 py-5 sm:px-8 sm:py-8 lg:px-12 lg:py-10"><Topbar title={activeItem.label} eyebrow={activeTab === 'vocabulary' ? `Tuesday · ${formatDate()}` : activeItem.description} /><div className="animate-[fade-in_400ms_ease-out]" key={`${activeTab}-${user?.uid || 'guest'}`}>{activeTab === 'settings' && <AccountPanel user={user} onGoogleLogin={handleGoogleLogin} onSignOut={handleSignOut} />}<ActiveModule onStudyActivity={recordStudyActivity} streak={streak} user={user} apiKey={apiKey} setApiKey={setApiKey} onGoogleLogin={handleGoogleLogin} onSignOut={handleSignOut} /></div></div></main><MobileBottomNav activeTab={activeTab} onTabChange={setActiveTab} /></div>
}
