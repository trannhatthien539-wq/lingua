import { lazy, Suspense, useEffect, useState } from 'react'
import { Sparkles } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import AuthPage from './components/Auth/AuthPage'
import { auth, onAuthStateChanged, signOut } from './services/firebase'
import { getGoogleRedirectResult, initializeNativeGoogleAuth, isNativeGoogleAuthEnabled } from './services/authService'
import { subscribeGoogleReturn } from './services/googleBrowserAuth'
import { readApiKeyForUser } from './services/apiKeyStorage'
import { readGuestStreak, updateUserStreak } from './services/streakService'
import { clearGuestVocabulary, hasGuestVocabulary, readGuestLibrary } from './services/dataService'
import { openItem } from './services/deepLink'
import { subscribeAppLinks } from './services/appLinks'
import { syncVocabulary } from './services/vocabularySync'
import { syncGuestUserDocs, userDocKeys, whenAuthSettled } from './services/userDocService'
import { refreshRequestedEvent } from './services/syncStatus'
import { resetHistoryCache } from './services/historyService'
import useStudyReminder from './hooks/useStudyReminder'
import useWidgetSummary from './hooks/useWidgetSummary'
import Sidebar from './components/layout/Sidebar'
import Topbar from './components/layout/Topbar'
import { navigationItems } from './data/navigation'
import { useTheme } from './hooks/useTheme'
import { formatDate } from './lib/formatters'
import MobileBottomNav from './components/MobileBottomNav'
import MobileHeader from './components/MobileHeader'
import AppMark from './components/AppMark'
import AccountPanel from './components/AccountPanel'
import AccountDataPanel from './components/AccountDataPanel'
import AppearancePanel from './modules/settings/AppearancePanel'
import SearchPalette from './components/SearchPalette'
import Toaster from './components/ui/Toaster'
import AiTutorPanel from './components/AiTutorPanel'
import ShortcutsHelpModal from './components/ShortcutsHelpModal'
import { toast } from './services/toast'

const VocabularyHub = lazy(() => import('./modules/learning/VocabularyHub'))
const HomeHub = lazy(() => import('./modules/home/HomeHub'))
const WritingChecker = lazy(() => import('./modules/learning/GrammarAndVocabulary').then((module) => ({ default: module.WritingChecker })))
const GrammarHub = lazy(() => import('./modules/grammar/GrammarHub'))
const SkillsHub = lazy(() => import('./modules/skills/SkillsHub'))
const VstepHub = lazy(() => import('./modules/vstep/VstepHub'))
const ProgressHub = lazy(() => import('./modules/progress/ProgressHub'))
const StudyPlanner = lazy(() => import('./modules/planner/StudyPlanner'))
const StudyMindmap = lazy(() => import('./modules/mindmap/StudyMindmap'))
const ApiSettings = lazy(() => import('./modules/settings/ApiSettings'))
const InstallAppPanel = lazy(() => import('./modules/settings/InstallAppPanel'))
const modules = { home: HomeHub, vocabulary: VocabularyHub, grammar: GrammarHub, skills: SkillsHub, vstep: VstepHub, writing: WritingChecker, progress: ProgressHub, planner: StudyPlanner, mindmap: StudyMindmap, settings: ApiSettings }
const tabPaths = { home: '/home', vocabulary: '/vocabulary', grammar: '/grammar', skills: '/skills', vstep: '/vstep', writing: '/writing', progress: '/progress', planner: '/planner', mindmap: '/mindmap', settings: '/settings' }
const pathTabs = Object.fromEntries(Object.entries(tabPaths).map(([tab, path]) => [path, tab]))

export default function App() {
  const [user, setUser] = useState(null)
  const [streak, setStreak] = useState(() => readGuestStreak())
  const [apiKey, setApiKey] = useState('')
  // Firebase khôi phục phiên đăng nhập bất đồng bộ: chờ biết chắc là khách hay tài khoản rồi mới
  // render, để module không bị remount ngay sau khi mở app (trước đây trông như "tải lại trang").
  const [authReady, setAuthReady] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [tutorOpen, setTutorOpen] = useState(false)
  const [shortcutsOpen, setShortcutsOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const activeTab = pathTabs[location.pathname] || 'home'
  const isLoginRoute = location.pathname === '/login'
  const { theme, themeMode, setThemeMode, toggleTheme } = useTheme()
  const { settings: reminderSettings, updateSettings: updateReminder, native: reminderNative } = useStudyReminder(streak, user)
  // Widget màn hình chính (APK): đẩy thẻ đến hạn / chuỗi ngày / chủ điểm ngữ pháp ra widget.
  useWidgetSummary({ streak, user })
  const activeItem = navigationItems.find((item) => item.id === activeTab)
  const ActiveModule = modules[activeTab]
  useEffect(() => {
    let active = true
    whenAuthSettled().finally(() => { if (active) setAuthReady(true) })
    return () => { active = false }
  }, [])
  useEffect(() => {
    localStorage.removeItem('lingua-ai-api-key')
    const openPractice = () => navigate(tabPaths.vocabulary)
    window.addEventListener('lingua:open-practice', openPractice)
    return () => window.removeEventListener('lingua:open-practice', openPractice)
  }, [navigate])
  useEffect(() => {
    if (location.pathname === '/') navigate(tabPaths.home, { replace: true })
    else if (!isLoginRoute && !pathTabs[location.pathname]) navigate(tabPaths.home, { replace: true })
  }, [isLoginRoute, location.pathname, navigate])
  // Widget / shortcut trên Android mở app bằng deep link `…://tab/<tab>`.
  useEffect(() => {
    let stopLinks = () => {}
    subscribeAppLinks((link) => {
      // `…://practice` = vào thẳng phiên ôn thẻ đến hạn (nút "Ôn ngay" trên widget).
      if (link?.type === 'practice') openItem({ tab: 'vocabulary', type: 'practice' })
      if (link?.path) navigate(link.path)
    }).then((stop) => { stopLinks = stop || (() => {}) })
    return () => stopLinks()
  }, [navigate])
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
        if (syncedDocs.length) window.dispatchEvent(new Event(refreshRequestedEvent))
        return
      }
      try {
        await syncVocabulary(readGuestLibrary())
        // Nạp lại dữ liệu TẠI CHỖ (không remount module) — tránh cảm giác "tải lại trang" lần 2.
        window.dispatchEvent(new Event(refreshRequestedEvent))
        toast.success('Đã đồng bộ dữ liệu khách lên tài khoản của bạn.')
      } catch (syncError) {
        console.error('Lingua guest vocabulary sync error', syncError)
        toast.error('Chưa thể đồng bộ dữ liệu khách. Dữ liệu vẫn được giữ trên thiết bị này.')
      }
    }
    // Callback đầu tiên chỉ là khôi phục phiên (khách ⇄ tài khoản), không tính là đổi tài khoản.
    let lastUid
    const unsubscribeAuth = onAuthStateChanged(auth, (nextUser) => {
      resetHistoryCache()
      const uid = nextUser?.uid || null
      // Đổi tài khoản (đăng nhập/đăng xuất) mới cần nạp lại dữ liệu; lần khôi phục phiên đầu tiên thì không.
      const identityChanged = lastUid !== undefined && lastUid !== uid
      lastUid = uid
      setUser(nextUser)
      setApiKey(readApiKeyForUser(nextUser))
      if (nextUser) {
        updateUserStreak(nextUser.uid).then(setStreak).catch(() => setStreak({ currentStreak: 0, lastActiveDate: null, totalSessions: 0 }))
        void syncGuestData()
      } else {
        setStreak(readGuestStreak())
      }
      if (identityChanged) window.dispatchEvent(new Event(refreshRequestedEvent))
    })
    return () => {
      stopGoogleReturn()
      unsubscribeAuth()
    }
  }, [])
  useEffect(() => {
    if (user && isLoginRoute) navigate(tabPaths.home, { replace: true })
  }, [isLoginRoute, navigate, user])

  const recordStudyActivity = () =>
    updateUserStreak(user?.uid).then(setStreak).catch(() => {})
  const handleSignOut = async () => {
    setApiKey('')
    clearGuestVocabulary()
    localStorage.removeItem('lingua-ai-api-key')
    await signOut(auth)
    navigate('/login')
  }

  if (!authReady) {
    return (
      <div className="grid min-h-screen place-items-center bg-mist p-6 text-ink dark:bg-dark1 dark:text-white">
        <div className="text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-lime/25 dark:bg-lime/20"><AppMark className="h-10 w-10" /></div>
          <p className="mt-3 font-display text-xl font-bold text-[#58cc02]">lingua<span className="text-ink/50 dark:text-white/45">.</span></p>
          <p className="mt-1 text-sm text-ink/55 dark:text-white/55">Đang tải…</p>
        </div>
      </div>
    )
  }

  if (isLoginRoute && !user) return <AuthPage onGuest={() => navigate(tabPaths.home)} />

  const selectTab = (tab) => navigate(tabPaths[tab] || tabPaths.vocabulary)

  return <div className="min-h-screen bg-mist pt-[env(safe-area-inset-top)] text-ink transition-colors dark:bg-dark1 dark:text-white"><MobileHeader user={user} streak={streak} theme={theme} onToggleTheme={toggleTheme} onOpenAuth={() => navigate('/login')} onSignOut={handleSignOut} /><Sidebar activeTab={activeTab} onTabChange={selectTab} theme={theme} onToggleTheme={toggleTheme} user={user} streak={streak} onOpenAuth={() => navigate('/login')} onSignOut={handleSignOut} /><main className="min-h-screen pb-28 md:pb-0 lg:ml-[264px]"><div className="mx-auto max-w-[1360px] px-4 py-6 sm:px-8 sm:py-9 lg:px-12"><Topbar title={activeItem.label} eyebrow={activeTab === 'home' || activeTab === 'vocabulary' ? `Hôm nay · ${formatDate()}` : activeItem.description} onOpenSearch={() => setSearchOpen(true)} onOpenTutor={() => setTutorOpen(true)} onOpenShortcuts={() => setShortcutsOpen(true)} user={user} /><div className="animate-[fade-in_400ms_ease-out]" key={activeTab}><Suspense fallback={<div className="panel grid min-h-48 place-items-center p-6 text-sm text-ink/50 dark:text-white/50">Đang tải trang...</div>}>{activeTab === 'settings' ? <div className="max-w-3xl space-y-4"><AccountPanel user={user} onOpenAuth={() => navigate('/login')} onSignOut={handleSignOut} /><AppearancePanel themeMode={themeMode} onThemeMode={setThemeMode} /><InstallAppPanel /><AccountDataPanel user={user} streak={streak} reminderSettings={reminderSettings} onUpdateReminder={updateReminder} reminderNative={reminderNative} /><ActiveModule onStudyActivity={recordStudyActivity} streak={streak} user={user} apiKey={apiKey} setApiKey={setApiKey} onSignOut={handleSignOut} onNavigate={selectTab} /></div> : <ActiveModule onStudyActivity={recordStudyActivity} streak={streak} user={user} apiKey={apiKey} setApiKey={setApiKey} onSignOut={handleSignOut} onNavigate={selectTab} />}</Suspense></div></div></main><MobileBottomNav activeTab={activeTab} onTabChange={selectTab} />
    {/* Gia sư AI: một nút nổi duy nhất, dùng được ở mọi tab (thay cho nút “Thêm từ” cũ). */}
    <button
      type="button"
      onClick={() => setTutorOpen(true)}
      className="no-print fixed bottom-24 right-4 z-40 grid h-14 w-14 place-items-center rounded-full bg-[#58cc02] text-white shadow-[0_5px_0_0_#3f9c02] transition hover:-translate-y-0.5 md:bottom-6 md:right-6"
      aria-label="Mở gia sư AI"
      title="Gia sư AI — hỏi bất cứ lúc nào"
    >
      <Sparkles size={22} />
    </button>{searchOpen && <SearchPalette onClose={() => setSearchOpen(false)} onOpenTutor={() => { setSearchOpen(false); setTutorOpen(true) }} onSelect={(item) => { selectTab(item.tab); if (item.type && item.type !== 'tab') openItem({ tab: item.tab, itemId: item.itemId, type: item.type }); setSearchOpen(false) }} />}{tutorOpen && <AiTutorPanel apiKey={apiKey} user={user} onClose={() => setTutorOpen(false)} onOpenSettings={() => { setTutorOpen(false); selectTab('settings') }} />}{shortcutsOpen && <ShortcutsHelpModal onClose={() => setShortcutsOpen(false)} />}<Toaster /></div>
}
