import { lazy, Suspense, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import AuthPage from './components/Auth/AuthPage'
import { auth, onAuthStateChanged, signOut } from './services/firebase'
import { getGoogleRedirectResult, initializeNativeGoogleAuth, isNativeGoogleAuthEnabled, signInWithGoogle } from './services/authService'
import { subscribeGoogleReturn } from './services/googleBrowserAuth'
import { readApiKeyForUser } from './services/apiKeyStorage'
import { readGuestStreak, updateUserStreak } from './services/streakService'
import { clearGuestVocabulary, hasGuestVocabulary, readGuestLibrary } from './services/dataService'
import { openItem } from './services/deepLink'
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
import AppLoginPanel from './components/AppLoginPanel'
import AccountDataPanel from './components/AccountDataPanel'
import AppearancePanel from './modules/settings/AppearancePanel'
import SearchPalette from './components/SearchPalette'
import Toaster from './components/ui/Toaster'
import AiTutorPanel from './components/AiTutorPanel'
import ShortcutsHelpModal from './components/ShortcutsHelpModal'
import { toast } from './services/toast'

const VocabularyHub = lazy(() => import('./modules/learning/VocabularyHub'))
const WritingChecker = lazy(() => import('./modules/learning/GrammarAndVocabulary').then((module) => ({ default: module.WritingChecker })))
const GrammarHub = lazy(() => import('./modules/grammar/GrammarHub'))
const SkillsHub = lazy(() => import('./modules/skills/SkillsHub'))
const VstepHub = lazy(() => import('./modules/vstep/VstepHub'))
const ProgressHub = lazy(() => import('./modules/progress/ProgressHub'))
const StudyPlanner = lazy(() => import('./modules/planner/StudyPlanner'))
const StudyMindmap = lazy(() => import('./modules/mindmap/StudyMindmap'))
const ApiSettings = lazy(() => import('./modules/settings/ApiSettings'))
const InstallAppPanel = lazy(() => import('./modules/settings/InstallAppPanel'))
const modules = { vocabulary: VocabularyHub, grammar: GrammarHub, skills: SkillsHub, vstep: VstepHub, writing: WritingChecker, progress: ProgressHub, planner: StudyPlanner, mindmap: StudyMindmap, settings: ApiSettings }
const tabPaths = { vocabulary: '/vocabulary', grammar: '/grammar', skills: '/skills', vstep: '/vstep', writing: '/writing', progress: '/progress', planner: '/planner', mindmap: '/mindmap', settings: '/settings' }
const pathTabs = Object.fromEntries(Object.entries(tabPaths).map(([tab, path]) => [path, tab]))

export default function App() {
  const [user, setUser] = useState(null)
  const [streak, setStreak] = useState(() => readGuestStreak())
  const [apiKey, setApiKey] = useState('')
  const [dataVersion, setDataVersion] = useState(0)
  const [searchOpen, setSearchOpen] = useState(false)
  const [tutorOpen, setTutorOpen] = useState(false)
  const [shortcutsOpen, setShortcutsOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const activeTab = pathTabs[location.pathname] || 'vocabulary'
  const isLoginRoute = location.pathname === '/login'
  const { theme, themeMode, setThemeMode, toggleTheme } = useTheme()
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
        return
      }
      const target = event.target
      const typing = target instanceof HTMLElement && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)
      if (!typing && event.key === '?') {
        event.preventDefault()
        setShortcutsOpen(true)
      }
      if (event.key === 'Escape') setShortcutsOpen(false)
    }
    window.addEventListener('keydown', openSearch)
    return () => window.removeEventListener('keydown', openSearch)
  }, [])
  useEffect(() => {
    if (isNativeGoogleAuthEnabled()) {
      initializeNativeGoogleAuth().catch(() => toast.error('Không thể khởi tạo đăng nhập Google trên thiết bị.'))
    }
    getGoogleRedirectResult().then((result) => {
      if (result?.user) toast.success('Đăng nhập Google thành công.')
    }).catch(() => {})
    // Bản APK: kết quả đăng nhập Google quay về qua deep link com.lingua.studyhub://auth.
    let stopGoogleReturn = () => {}
    subscribeGoogleReturn((type, payload) => {
      if (type === 'success') toast.success(`Đăng nhập Google thành công${payload?.displayName ? ` — ${payload.displayName}` : ''}.`)
      else toast.error(payload || 'Không thể đăng nhập Google. Vui lòng thử lại.', { duration: 8000 })
    }).then((stop) => { stopGoogleReturn = stop || (() => {}) })
    const syncGuestData = async () => {
      const syncedDocs = await syncGuestUserDocs([
        userDocKeys.planner,
        userDocKeys.mindmap,
        userDocKeys.grammar,
        userDocKeys.writing,
        userDocKeys.skills,
        userDocKeys.reminder,
        userDocKeys.history,
        userDocKeys.goal,
        userDocKeys.vstep,
        userDocKeys.mistakes,
      ]).catch(() => [])
      if (!hasGuestVocabulary()) {
        if (syncedDocs.length) setDataVersion((version) => version + 1)
        return
      }
      try {
        await syncVocabulary(readGuestLibrary())
        setDataVersion((version) => version + 1)
        toast.success('Đã đồng bộ dữ liệu khách lên tài khoản của bạn.')
      } catch (syncError) {
        console.error('Lingua guest vocabulary sync error', syncError)
        toast.error('Chưa thể đồng bộ dữ liệu khách. Dữ liệu vẫn được giữ trên thiết bị này.')
      }
    }
    const unsubscribeAuth = onAuthStateChanged(auth, (nextUser) => {
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
    return () => {
      stopGoogleReturn()
      unsubscribeAuth()
    }
  }, [])
  useEffect(() => {
    if (user && isLoginRoute) navigate(tabPaths.vocabulary, { replace: true })
  }, [isLoginRoute, navigate, user])

  const recordStudyActivity = () =>
    updateUserStreak(user?.uid).then(setStreak).catch(() => {})
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithGoogle()
      if (result?.pending) {
        toast.info('Đã mở Chrome. Hãy chọn tài khoản Google rồi quay lại app — đăng nhập sẽ tự hoàn tất.', { duration: 9000 })
        return
      }
      toast.success('Đăng nhập Google thành công.')
    } catch (authError) {
      if (authError.code === 'lingua/missing-client-id') {
        toast.error('Chế độ “client ID riêng” cần một Web client ID. Mở Cài đặt → Tài khoản để dán, hoặc chuyển về chế độ Tự động.', { duration: 10000 })
        return
      }
      const messages = {
        'auth/popup-closed-by-user': 'Bạn đã đóng cửa sổ đăng nhập.',
        'auth/invalid-credential': 'Client ID không thuộc cùng project Firebase.',
        'auth/network-request-failed': 'Mạng không ổn định, vui lòng thử lại.',
      }
      toast.error(messages[authError.code] || 'Không thể đăng nhập Google. Vui lòng thử lại.')
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

  return <div className="min-h-screen bg-mist pt-[env(safe-area-inset-top)] text-ink transition-colors dark:bg-dark1 dark:text-white"><MobileHeader user={user} streak={streak} theme={theme} onToggleTheme={toggleTheme} onGoogleLogin={handleGoogleLogin} onSignOut={handleSignOut} /><Sidebar activeTab={activeTab} onTabChange={selectTab} theme={theme} onToggleTheme={toggleTheme} user={user} streak={streak} onOpenAuth={() => navigate('/login')} onSignOut={handleSignOut} /><main className="min-h-screen pb-20 md:pb-0 lg:ml-[264px]"><div className="mx-auto max-w-[1360px] px-4 py-6 sm:px-8 sm:py-9 lg:px-12"><Topbar title={activeItem.label} eyebrow={activeTab === 'vocabulary' ? `Hôm nay · ${formatDate()}` : activeItem.description} onOpenSearch={() => setSearchOpen(true)} onOpenTutor={() => setTutorOpen(true)} onOpenShortcuts={() => setShortcutsOpen(true)} user={user} /><div className="animate-[fade-in_400ms_ease-out]" key={`${activeTab}-${user?.uid || 'guest'}-${dataVersion}`}><Suspense fallback={<div className="panel grid min-h-48 place-items-center p-6 text-sm text-ink/50 dark:text-white/50">Đang tải trang...</div>}>{activeTab === 'settings' ? <div className="max-w-3xl space-y-4"><AccountPanel user={user} onGoogleLogin={handleGoogleLogin} onSignOut={handleSignOut} /><AppLoginPanel user={user} /><AppearancePanel themeMode={themeMode} onThemeMode={setThemeMode} /><InstallAppPanel /><AccountDataPanel user={user} streak={streak} reminderSettings={reminderSettings} onUpdateReminder={updateReminder} /><ActiveModule onStudyActivity={recordStudyActivity} streak={streak} user={user} apiKey={apiKey} setApiKey={setApiKey} onGoogleLogin={handleGoogleLogin} onSignOut={handleSignOut} onNavigate={selectTab} /></div> : <ActiveModule onStudyActivity={recordStudyActivity} streak={streak} user={user} apiKey={apiKey} setApiKey={setApiKey} onGoogleLogin={handleGoogleLogin} onSignOut={handleSignOut} onNavigate={selectTab} />}</Suspense></div></div></main><MobileBottomNav activeTab={activeTab} onTabChange={selectTab} />{searchOpen && <SearchPalette onClose={() => setSearchOpen(false)} onOpenTutor={() => { setSearchOpen(false); setTutorOpen(true) }} onSelect={(item) => { selectTab(item.tab); if (item.type && item.type !== 'tab') openItem({ tab: item.tab, itemId: item.itemId, type: item.type }); setSearchOpen(false) }} />}{tutorOpen && <AiTutorPanel apiKey={apiKey} user={user} onClose={() => setTutorOpen(false)} onOpenSettings={() => { setTutorOpen(false); selectTab('settings') }} />}{shortcutsOpen && <ShortcutsHelpModal onClose={() => setShortcutsOpen(false)} />}<Toaster /></div>
}
