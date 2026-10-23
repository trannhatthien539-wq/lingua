import { Suspense, memo, useCallback, useEffect, useState } from 'react'
import { Settings2, Sparkles } from 'lucide-react'
import ModuleHero from './components/ui/ModuleHero'
import { useLocation, useNavigate } from 'react-router-dom'
import { auth, onAuthStateChanged, signOut } from './services/firebase'
import { getGoogleRedirectResult, initializeNativeGoogleAuth, isNativeGoogleAuthEnabled } from './services/authService'
import { subscribeGoogleReturn } from './services/googleBrowserAuth'
import { clearApiKey, readApiKeyForUser } from './services/apiKeyStorage'
import { readGuestStreak, updateUserStreak } from './services/streakService'
import { clearGuestVocabulary, hasGuestVocabulary, readGuestLibrary } from './services/dataService'
import { openItem } from './services/deepLink'
import { subscribeAppLinks } from './services/appLinks'
import { syncVocabulary } from './services/vocabularySync'
import { cancelAllUserDocs, flushAllUserDocs, syncGuestUserDocs, userDocKeys } from './services/userDocService'
import { refreshRequestedEvent } from './services/syncStatus'
import { resetHistoryCache } from './services/historyService'
import { isCapacitor } from './services/platform'
import useStudyReminder from './hooks/useStudyReminder'
import useWidgetSummary from './hooks/useWidgetSummary'
import Sidebar from './components/layout/Sidebar'
import Topbar from './components/layout/Topbar'
import { navigationItems } from './data/navigation'
import { useTheme } from './hooks/useTheme'
import useAppearance from './hooks/useAppearance'
import { formatDate } from './lib/formatters'
import MobileBottomNav from './components/MobileBottomNav'
import MobileHeader from './components/MobileHeader'
import Toaster from './components/ui/Toaster'
import PageSkeleton from './components/ui/PageSkeleton'
import AppBootSkeleton from './components/ui/AppBootSkeleton'
import { lazyWithPreload, preload } from './lib/lazyWithPreload'
import { toast } from './services/toast'

/**
 * Các module được tách chunk theo tab và có thể nạp trước khi người dùng rê chuột
 * hoặc chạm vào mục điều hướng. Nhờ vậy lần đầu mở app không phải tải toàn bộ
 * 10 tab, nhưng chuyển tab vẫn gần như tức thì.
 */
const VocabularyHub = lazyWithPreload(() => import('./modules/learning/VocabularyHub'))
const HomeHub = lazyWithPreload(() => import('./modules/home/HomeHub'))
const WritingChecker = lazyWithPreload(() => import('./modules/learning/GrammarAndVocabulary').then((module) => ({ default: module.WritingChecker })))
const GrammarHub = lazyWithPreload(() => import('./modules/grammar/GrammarHub'))
const SkillsHub = lazyWithPreload(() => import('./modules/skills/SkillsHub'))
const VstepHub = lazyWithPreload(() => import('./modules/vstep/VstepHub'))
const ProgressHub = lazyWithPreload(() => import('./modules/progress/ProgressHub'))
const StudyPlanner = lazyWithPreload(() => import('./modules/planner/StudyPlanner'))
const StudyMindmap = lazyWithPreload(() => import('./modules/mindmap/StudyMindmap'))
const ApiSettings = lazyWithPreload(() => import('./modules/settings/ApiSettings'))
const InstallAppPanel = lazyWithPreload(() => import('./modules/settings/InstallAppPanel'))
const AccountPanel = lazyWithPreload(() => import('./components/AccountPanel'))
const AccountDataPanel = lazyWithPreload(() => import('./components/AccountDataPanel'))
const AppearancePanel = lazyWithPreload(() => import('./modules/settings/AppearancePanel'))

// Các lớp phủ chỉ tải khi thực sự mở → giảm mạnh gói khởi động (nhất là chỉ mục tìm kiếm).
const AuthPage = lazyWithPreload(() => import('./components/Auth/AuthPage'))
const SearchPalette = lazyWithPreload(() => import('./components/SearchPalette'))
const AiTutorPanel = lazyWithPreload(() => import('./components/AiTutorPanel'))
const ShortcutsHelpModal = lazyWithPreload(() => import('./components/ShortcutsHelpModal'))

const modules = {
  home: HomeHub,
  vocabulary: VocabularyHub,
  grammar: GrammarHub,
  skills: SkillsHub,
  vstep: VstepHub,
  writing: WritingChecker,
  progress: ProgressHub,
  planner: StudyPlanner,
  mindmap: StudyMindmap,
  settings: ApiSettings,
}
const tabPaths = { home: '/home', vocabulary: '/vocabulary', grammar: '/grammar', skills: '/skills', vstep: '/vstep', writing: '/writing', progress: '/progress', planner: '/planner', mindmap: '/mindmap', settings: '/settings' }
const pathTabs = Object.fromEntries(Object.entries(tabPaths).map(([tab, path]) => [path, tab]))
const preloadTab = (tab) => preload(modules[tab])

/**
 * Chỉ re-render module đang mở khi props của nó thay đổi. Trước đây mỗi lần mở
 * hộp tìm kiếm/gia sư AI (state của App) là toàn bộ module nặng bên dưới render lại.
 */
const Workspace = memo(function Workspace({ activeTab, ActiveModule, user, streak, apiKey, setApiKey, onStudyActivity, onNavigate, onSignOut }) {
  return (
    <div key={activeTab} className="animate-rise">
      <Suspense fallback={<PageSkeleton />}>
        <ActiveModule
          onStudyActivity={onStudyActivity}
          streak={streak}
          user={user}
          apiKey={apiKey}
          setApiKey={setApiKey}
          onSignOut={onSignOut}
          onNavigate={onNavigate}
        />
      </Suspense>
    </div>
  )
})

/**
 * Widget chỉ tồn tại trong APK/WebView Capacitor. Tách thành component con để trên web
 * không mount các hook đọc grammar/goal/thư viện thẻ chỉ phục vụ widget.
 */
function WidgetSummaryBridge({ streak, user }) {
  useWidgetSummary({ streak, user })
  return null
}

export default function App() {
  const [user, setUser] = useState(null)
  const [streak, setStreak] = useState(() => readGuestStreak())
  const [apiKey, setApiKey] = useState('')
  // Chỉ dùng để hiện skeleton ở vùng nội dung trong lúc Firebase khôi phục phiên.
  // App Shell (sidebar/header) được render ngay, không chặn toàn bộ trang.
  const [authResolved, setAuthResolved] = useState(() => Boolean(auth.currentUser))
  const [searchOpen, setSearchOpen] = useState(false)
  const [tutorOpen, setTutorOpen] = useState(false)
  const [shortcutsOpen, setShortcutsOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const activeTab = pathTabs[location.pathname] || 'home'
  const isLoginRoute = location.pathname === '/login'
  const { theme, themeMode, setThemeMode, toggleTheme } = useTheme()
  const { appearance } = useAppearance()
  const { settings: reminderSettings, updateSettings: updateReminder, native: reminderNative } = useStudyReminder(streak, user)
  const activeItem = navigationItems.find((item) => item.id === activeTab) || navigationItems[0]
  const ActiveModule = modules[activeTab]

  const selectTab = useCallback((tab) => {
    navigate(tabPaths[tab] || tabPaths.home)
  }, [navigate])
  const openAuth = useCallback(() => navigate('/login'), [navigate])
  const recordStudyActivity = useCallback(
    () => updateUserStreak(user?.uid).then(setStreak).catch(() => {}),
    [user?.uid],
  )
  const handleSignOut = useCallback(async () => {
    // Bắt buộc ghi nốt mọi thay đổi đang debounce TRƯỚC khi đăng xuất. Owner đã được
    // khóa lúc xếp hàng nên dữ liệu luôn về đúng uid cũ, không trôi sang tài khoản khác.
    await flushAllUserDocs().catch(() => {})
    cancelAllUserDocs()
    setApiKey('')
    clearGuestVocabulary()
    clearApiKey(user)
    localStorage.removeItem('lingua-ai-api-key')
    await signOut(auth)
    navigate('/login')
  }, [navigate, user])
  const handleSearchSelect = useCallback((item) => {
    selectTab(item.tab)
    if (item.type && item.type !== 'tab') openItem({ tab: item.tab, itemId: item.itemId, type: item.type })
    setSearchOpen(false)
  }, [selectTab])
  const openTutorFromSearch = useCallback(() => {
    setSearchOpen(false)
    setTutorOpen(true)
  }, [])

  // Nếu Firebase không trả callback (mạng chập chờn), mở khoá nội dung sau 3 giây
  // thay vì treo toàn app như trước. Shell vẫn hiển thị ngay từ đầu.
  useEffect(() => {
    if (authResolved) return undefined
    const timer = window.setTimeout(() => setAuthResolved(true), 3000)
    return () => window.clearTimeout(timer)
  }, [authResolved])

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
      // Ghi nốt các thay đổi khách đang debounce xuống local trước khi đọc để chuyển lên tài khoản.
      await flushAllUserDocs().catch(() => {})
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
      setAuthResolved(true)
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
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [location.pathname])

  useEffect(() => {
    if (user && isLoginRoute) navigate(tabPaths.home, { replace: true })
  }, [isLoginRoute, navigate, user])

  // Route đăng nhập cần biết chắc trạng thái phiên để không nháy form login cho người
  // đã đăng nhập; các route chính thì render shell ngay và chỉ chờ ở vùng nội dung.
  if (isLoginRoute && !authResolved) return <AppBootSkeleton />

  if (isLoginRoute && !user) {
    return (
      <Suspense fallback={<AppBootSkeleton />}>
        <AuthPage onGuest={() => navigate(tabPaths.home)} />
      </Suspense>
    )
  }

  const bgImage = appearance?.background?.image
  const bgBlur = appearance?.background?.blur ?? 0
  const bgOverlay = appearance?.background?.overlay ?? 25

  return (
    <div className={`relative min-h-screen ${bgImage ? 'bg-transparent' : 'app-ambient bg-mist dark:bg-dark1'} pt-[env(safe-area-inset-top)] text-ink transition-colors dark:text-white`}>
      {isCapacitor() && <WidgetSummaryBridge streak={streak} user={user} />}
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-xl focus:bg-slate-900 focus:px-4 focus:py-3 focus:text-sm focus:font-bold focus:text-white focus:shadow-xl">
        Bỏ qua điều hướng
      </a>

      {/* Lớp hiển thị ảnh nền tuỳ chỉnh riêng biệt */}
      {bgImage && (
        <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
          <div
            className="absolute inset-0 bg-cover bg-center transition-all duration-700"
            style={{
              backgroundImage: `url(${bgImage})`,
              filter: bgBlur > 0 ? `blur(${bgBlur}px)` : 'none',
              transform: bgBlur > 0 ? 'scale(1.06)' : 'scale(1)',
            }}
          />
          <div
            className="absolute inset-0 transition-colors duration-300"
            style={{
              backgroundColor: theme === 'dark'
                ? `rgba(11, 15, 23, ${bgOverlay / 100})`
                : `rgba(248, 250, 252, ${bgOverlay / 100})`,
            }}
          />
        </div>
      )}

      <div className="relative z-10">
        <MobileHeader user={user} streak={streak} theme={theme} onToggleTheme={toggleTheme} onOpenAuth={openAuth} onSignOut={handleSignOut} />
        <Sidebar
          activeTab={activeTab}
          onTabChange={selectTab}
          onPrefetch={preloadTab}
          theme={theme}
          onToggleTheme={toggleTheme}
          user={user}
          streak={streak}
          onOpenAuth={openAuth}
          onSignOut={handleSignOut}
        />
        <main id="main-content" tabIndex={-1} className="min-h-screen pb-28 outline-none md:pb-0 lg:ml-[272px]">
          <div className="mx-auto max-w-[1360px] px-4 py-6 sm:px-8 sm:py-9 lg:px-12">
            <Topbar
              title={activeItem.label}
              eyebrow={activeTab === 'home' || activeTab === 'vocabulary' ? `Hôm nay · ${formatDate()}` : activeItem.description}
              accent={activeItem.color}
              activeTab={activeTab}
              onOpenSearch={() => setSearchOpen(true)}
              onPrefetchSearch={() => preload(SearchPalette)}
              onOpenTutor={() => setTutorOpen(true)}
              onPrefetchTutor={() => preload(AiTutorPanel)}
              onOpenShortcuts={() => setShortcutsOpen(true)}
              user={user}
              streak={streak}
            />
            {!authResolved ? (
              <PageSkeleton />
            ) : activeTab === 'settings' ? (
              <div className="max-w-3xl animate-rise space-y-4">
                <Suspense fallback={<PageSkeleton />}>
                  <ModuleHero
                    icon={Settings2}
                    eyebrow="Cài đặt"
                    title="Tùy chỉnh không gian học"
                    accent="#64748B"
                    deep="#334155"
                    illustration="settings"
                    stats={[{ label: 'Tài khoản', value: user ? 'Đã đăng nhập' : 'Khách' }, { label: 'Đồng bộ', value: user ? 'Đang bật' : 'Thiết bị' }]}
                  />
                  <AccountPanel user={user} onOpenAuth={openAuth} onSignOut={handleSignOut} />
                  <AppearancePanel themeMode={themeMode} onThemeMode={setThemeMode} />
                  <InstallAppPanel />
                  <AccountDataPanel user={user} streak={streak} reminderSettings={reminderSettings} onUpdateReminder={updateReminder} reminderNative={reminderNative} />
                  <ActiveModule onStudyActivity={recordStudyActivity} streak={streak} user={user} apiKey={apiKey} setApiKey={setApiKey} onSignOut={handleSignOut} onNavigate={selectTab} />
                </Suspense>
              </div>
            ) : (
              <Workspace
                activeTab={activeTab}
                ActiveModule={ActiveModule}
                user={user}
                streak={streak}
                apiKey={apiKey}
                setApiKey={setApiKey}
                onStudyActivity={recordStudyActivity}
                onNavigate={selectTab}
                onSignOut={handleSignOut}
              />
            )}
          </div>
        </main>
        <MobileBottomNav activeTab={activeTab} onTabChange={selectTab} onPrefetch={preloadTab} />

        {/* Gia sư AI: nút nổi kính thích ứng theo màu chủ đề.
            Đặt trong lớp z-10 để mọi hộp thoại (z-90) luôn nằm trên nút này. */}
        <button
          type="button"
          onClick={() => setTutorOpen(true)}
          onMouseEnter={() => preload(AiTutorPanel)}
          onFocus={() => preload(AiTutorPanel)}
          className="no-print fixed bottom-24 right-4 z-40 grid h-12 w-12 place-items-center rounded-2xl border border-white/25 text-white backdrop-blur-xl transition hover:scale-105 active:scale-95 md:bottom-6 md:right-6"
          style={{
            background: 'linear-gradient(135deg, rgb(var(--accent)), rgb(var(--accent-2)))',
            boxShadow: '0 8px 25px -4px rgba(var(--accent), 0.45)',
          }}
          aria-label="Mở gia sư AI"
          title="Gia sư AI — hỏi bất cứ lúc nào"
        >
          <Sparkles size={22} />
        </button>
      </div>

      {searchOpen && (
        <Suspense fallback={null}>
          <SearchPalette onClose={() => setSearchOpen(false)} onOpenTutor={openTutorFromSearch} onSelect={handleSearchSelect} />
        </Suspense>
      )}
      {tutorOpen && (
        <Suspense fallback={null}>
          <AiTutorPanel apiKey={apiKey} user={user} onClose={() => setTutorOpen(false)} onOpenSettings={() => { setTutorOpen(false); selectTab('settings') }} />
        </Suspense>
      )}
      {shortcutsOpen && (
        <Suspense fallback={null}>
          <ShortcutsHelpModal onClose={() => setShortcutsOpen(false)} />
        </Suspense>
      )}
      <Toaster />
    </div>
  )
}
