import { lazy, Suspense, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import AuthPage from './components/Auth/AuthPage'
import { auth, onAuthStateChanged, signOut } from './services/firebase'
import { getGoogleRedirectResult, initializeNativeGoogleAuth, signInWithGoogle } from './services/authService'
import { readApiKeyForUser } from './services/apiKeyStorage'
import { readGuestStreak, updateUserStreak } from './services/streakService'
import { clearGuestVocabulary, hasGuestVocabulary, readGuestLibrary } from './services/dataService'
import { syncVocabulary } from './services/vocabularySync'
import { syncGuestUserDocs, userDocKeys } from './services/userDocService'
import { resetHistoryCache } from './services/historyService'
import useStudyReminder from './hooks/useStudyReminder'
import Sidebar from './components/layout/Sidebar'
import Topbar from './components/layout/Topbar'
import { navigationItems } from './data/navigation'
import { useTheme } from './hooks/useTheme'
import { formatDate } from './lib/formatters'
import MobileBottomNav from './components/MobileBottomNav'
import MobileHeader from './components/MobileHeader'
import AccountPanel from './components/AccountPanel'
import SearchPalette from './components/SearchPalette'

const VocabularyHub = lazy(() => import('./modules/learning/VocabularyHub'))
const GrammarChecker = lazy(() => import('./modules/learning/GrammarAndVocabulary').then((module) => ({ default: module.GrammarChecker })))
const StudyPlanner = lazy(() => import('./modules/planner/StudyPlanner'))
const StudyMindmap = lazy(() => import('./modules/mindmap/StudyMindmap'))
const ApiSettings = lazy(() => import('./modules/settings/ApiSettings'))
const modules = { vocabulary: VocabularyHub, grammar: GrammarChecker, planner: StudyPlanner, mindmap: StudyMindmap, settings: ApiSettings }
const tabPaths = { vocabulary: '/vocabulary', grammar: '/grammar', planner: '/planner', mindmap: '/mindmap', settings: '/settings' }
const pathTabs = Object.fromEntries(Object.entries(tabPaths).map(([tab, path]) => [path, tab]))

export default function App() {
  const [user, setUser] = useState(null)
  const [streak, setStreak] = useState(() => readGuestStreak())
  const [apiKey, setApiKey] = useState('')
  const [notice, setNotice] = useState('')
  const [dataVersion, setDataVersion] = useState(0)
  const [searchOpen, setSearchOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const activeTab = pathTabs[location.pathname] || 'vocabulary'
  const isLoginRoute = location.pathname === '/login'
  const { theme, toggleTheme } = useTheme()
  const { settings: reminderSettings, updateSettings: updateReminder } = useStudyReminder(streak)
  const activeItem = navigationItems.find((item) => item.id === activeTab)
  const ActiveModule = modules[activeTab]
  useEffect(() => {
    localStorage.removeItem('lingua-ai-api-key')
    const openPractice = () => navigate(tabPaths.vocabulary)
    window.addEventListener('lingua:open-practice', openPractice)
    return () => window.removeEventListener('lingua:open-practice', openPractice)
  }, [navigate])
  useEffect(() => {
    if (location.pathname === '/') navigate(tabPaths.vocabulary, { replace: true })
    else if (!isLoginRoute && !pathTabs[location.pathname]) navigate(tabPaths.vocabulary, { replace: true })
  }, [isLoginRoute, location.pathname, navigate])
  useEffect(() => {
    const openSearch = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setSearchOpen(true)
      }
    }
    window.addEventListener('keydown', openSearch)
    return () => window.removeEventListener('keydown', openSearch)
  }, [])
  useEffect(() => {
    initializeNativeGoogleAuth().catch((error) => {
      if (error.message?.includes('VITE_GOOGLE_WEB_CLIENT_ID')) return
      setNotice('Không thể khởi tạo đăng nhập Google trên thiết bị.')
    })
    getGoogleRedirectResult().then((result) => {
      if (result?.user) {
        setNotice('Đăng nhập Google thành công.')
        window.setTimeout(() => setNotice(''), 2600)
      }
    }).catch(() => {})
    const syncGuestData = async () => {
      const syncedDocs = await syncGuestUserDocs([
        userDocKeys.planner,
        userDocKeys.mindmap,
        userDocKeys.grammar,
        userDocKeys.reminder,
        userDocKeys.history,
      ]).catch(() => [])
      if (!hasGuestVocabulary()) {
        if (syncedDocs.length) setDataVersion((version) => version + 1)
        return
      }
      try {
        await syncVocabulary(readGuestLibrary())
        setDataVersion((version) => version + 1)
        setNotice('Đã đồng bộ dữ liệu khách lên tài khoản của bạn.')
      } catch (syncError) {
        console.error('Lingua guest vocabulary sync error', syncError)
        setNotice('Chưa thể đồng bộ dữ liệu khách. Dữ liệu vẫn được giữ trên thiết bị này.')
      }
      window.setTimeout(() => setNotice(''), 3200)
    }
    return onAuthStateChanged(auth, (nextUser) => {
      resetHistoryCache()
      setUser(nextUser)
      setApiKey(readApiKeyForUser(nextUser))
      if (nextUser) {
        updateUserStreak(nextUser.uid).then(setStreak).catch(() => setStreak({ currentStreak: 0, lastActiveDate: null, totalSessions: 0 }))
        void syncGuestData()
      } else {
        setStreak(readGuestStreak())
      }
    })
  }, [])
  useEffect(() => {
    if (user && isLoginRoute) navigate(tabPaths.vocabulary, { replace: true })
  }, [isLoginRoute, navigate, user])

  const recordStudyActivity = () =>
    updateUserStreak(user?.uid).then(setStreak).catch(() => {})
  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle()
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
    navigate('/login')
  }

  if (isLoginRoute && !user) return <AuthPage onGuest={() => navigate(tabPaths.vocabulary)} />

  const selectTab = (tab) => navigate(tabPaths[tab] || tabPaths.vocabulary)

  return <div className="min-h-screen bg-mist pt-[env(safe-area-inset-top)] text-ink transition-colors dark:bg-[#18181b] dark:text-white"><MobileHeader user={user} streak={streak} notice={notice} theme={theme} onToggleTheme={toggleTheme} onGoogleLogin={handleGoogleLogin} onSignOut={handleSignOut} /><Sidebar activeTab={activeTab} onTabChange={selectTab} theme={theme} onToggleTheme={toggleTheme} user={user} streak={streak} onOpenAuth={() => navigate('/login')} onSignOut={handleSignOut} /><main className="min-h-screen pb-20 md:pb-0 lg:ml-[272px]"><div className="mx-auto max-w-[1440px] px-4 py-5 sm:px-8 sm:py-8 lg:px-12 lg:py-10"><Topbar title={activeItem.label} eyebrow={activeTab === 'vocabulary' ? `Tuesday · ${formatDate()}` : activeItem.description} onOpenSearch={() => setSearchOpen(true)} user={user} /><div className="animate-[fade-in_400ms_ease-out]" key={`${activeTab}-${user?.uid || 'guest'}-${dataVersion}`}><Suspense fallback={<div className="panel grid min-h-48 place-items-center p-6 text-sm text-ink/50 dark:text-white/50">Đang tải trang...</div>}>{activeTab === 'settings' && <AccountPanel user={user} theme={theme} onToggleTheme={toggleTheme} onGoogleLogin={handleGoogleLogin} onSignOut={handleSignOut} streak={streak} reminderSettings={reminderSettings} onUpdateReminder={updateReminder} />}<ActiveModule onStudyActivity={recordStudyActivity} streak={streak} user={user} apiKey={apiKey} setApiKey={setApiKey} onGoogleLogin={handleGoogleLogin} onSignOut={handleSignOut} /></Suspense></div></div></main><MobileBottomNav activeTab={activeTab} onTabChange={selectTab} />{searchOpen && <SearchPalette onClose={() => setSearchOpen(false)} onSelect={(tab) => { selectTab(tab); setSearchOpen(false) }} />}</div>
}
