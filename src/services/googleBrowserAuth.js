/**
 * Đăng nhập Google cho bản APK bằng cách mở Chrome (trình duyệt hệ thống).
 *
 * Có 2 chế độ, mặc định là chế độ **không cần cấu hình gì**:
 *
 * 1. `auto` (khuyên dùng) — dùng trang handler có sẵn của chính project Firebase:
 *    `https://<authDomain>/__/auth/handler?authType=signInViaRedirect&providerId=google.com&redirectUrl=…`
 *    Handler này tự biết client ID của project (chính là "Web client ID" Firebase tạo sẵn) và
 *    `redirect_uri` của nó đã được Google đăng ký sẵn → không phải vào Google Cloud Console,
 *    không cần SHA-1, không cần dán client ID.
 *
 * 2. `direct` — mở thẳng `accounts.google.com/o/oauth2/v2/auth` bằng client ID riêng
 *    (chỉ dùng khi bạn đã thêm redirect URI vào Google Cloud Console).
 *
 * Cả hai chế độ kết thúc giống nhau: Google → trang `oauth-callback.html` trên GitHub Pages
 * → deep link `com.lingua.studyhub://auth#id_token=…` → app đổi thành phiên Firebase.
 */
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth'
import { auth } from './firebase'
import { APP_URL_SCHEME, GOOGLE_REDIRECT_URI, getGoogleLoginMode, getGoogleWebClientId } from './googleAuthConfig'
import { isCapacitor } from './platform'

const PENDING_KEY = 'lingua-google-oauth-pending'
const listeners = new Set()

export const MissingClientIdError = () => {
  const error = new Error('Bản cài này chưa có Google Client ID nên chưa đăng nhập Google được. Hãy dùng Email + mật khẩu.')
  error.code = 'lingua/missing-client-id'
  return error
}

const randomId = () => {
  const bytes = new Uint8Array(16)
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) crypto.getRandomValues(bytes)
  else for (let index = 0; index < bytes.length; index += 1) bytes[index] = Math.floor(Math.random() * 256)
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('')
}

const rememberPending = (payload) => {
  try {
    sessionStorage.setItem(PENDING_KEY, JSON.stringify(payload))
  } catch {
    /* không lưu được thì bỏ qua, luồng vẫn chạy */
  }
}

const readPending = () => {
  try {
    const raw = sessionStorage.getItem(PENDING_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

const clearPending = () => {
  try {
    sessionStorage.removeItem(PENDING_KEY)
  } catch {
    /* bỏ qua */
  }
}

export const buildGoogleAuthUrl = ({ clientId, nonce, state }) => {
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: GOOGLE_REDIRECT_URI,
    response_type: 'id_token token',
    scope: 'openid email profile',
    nonce,
    state,
    prompt: 'select_account',
  })
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
}

/** Chế độ 1: trang handler của Firebase (không cần cấu hình gì). */
export const buildFirebaseHandlerUrl = ({ apiKey, authDomain, redirectUrl, eventId }) => {
  const params = new URLSearchParams({
    apiKey,
    authType: 'signInViaRedirect',
    providerId: 'google.com',
    redirectUrl,
    eventId,
    lang: 'vi',
    v: '10.14.1',
  })
  return `https://${authDomain}/__/auth/handler?${params.toString()}`
}

const DIAG_KEY = 'lingua-google-auth-log'

/** Ghi lại nhật ký đăng nhập Google để hiển thị trong Cài đặt khi cần chẩn đoán. */
const recordDiagnostics = (patch) => {
  try {
    const previous = JSON.parse(localStorage.getItem(DIAG_KEY) || '{}')
    localStorage.setItem(DIAG_KEY, JSON.stringify({ ...previous, ...patch, at: Date.now() }))
  } catch {
    /* bỏ qua */
  }
}

export const readGoogleAuthDiagnostics = () => {
  try {
    return JSON.parse(localStorage.getItem(DIAG_KEY) || 'null')
  } catch {
    return null
  }
}

export const clearGoogleAuthDiagnostics = () => {
  try {
    localStorage.removeItem(DIAG_KEY)
  } catch {
    /* bỏ qua */
  }
}

/** Plugin Browser của Capacitor đã được nhúng vào APK chưa. */
export const canUseBrowserPlugin = () =>
  typeof window !== 'undefined' && Boolean(window.Capacitor?.isPluginAvailable?.('Browser'))

/**
 * Mở URL bằng trình duyệt hệ thống. Thử lần lượt 3 cách để chắc chắn Chrome mở:
 *  1. plugin `@capacitor/browser` (Chrome Custom Tabs);
 *  2. `window.open(..., '_system')`;
 *  3. điều hướng WebView — Capacitor sẽ bắt và mở bằng ACTION_VIEW (trình duyệt ngoài).
 */
const openExternal = async (url) => {
  if (canUseBrowserPlugin()) {
    try {
      const { Browser } = await import('@capacitor/browser')
      await Browser.open({ url })
      return 'browser-plugin'
    } catch (error) {
      console.warn('Lingua: không mở được bằng plugin Browser, thử cách khác.', error)
    }
  }
  try {
    const opened = window.open(url, '_system')
    if (opened) return 'window-open'
  } catch (error) {
    console.warn('Lingua: window.open(_system) không dùng được.', error)
  }
  try {
    window.location.href = url
    return 'location'
  } catch (error) {
    console.error('Lingua: không mở được trình duyệt.', error)
    return 'failed'
  }
}

/** Mở lại trang đăng nhập Google (nút dự phòng khi Chrome không tự mở). */
export const openGoogleAuthUrlInBrowser = async (url) => {
  if (!url) return 'failed'
  const method = await openExternal(url)
  recordDiagnostics({ reopenedWith: method })
  return method
}

export const closeExternalBrowser = async () => {
  if (!isCapacitor()) return
  try {
    const { Browser } = await import('@capacitor/browser')
    await Browser.close()
  } catch {
    /* trình duyệt có thể đã đóng sẵn */
  }
}

const parseFragment = (urlString) => {
  const hashIndex = urlString.indexOf('#')
  const queryIndex = urlString.indexOf('?')
  const raw = hashIndex >= 0 ? urlString.slice(hashIndex + 1) : queryIndex >= 0 ? urlString.slice(queryIndex + 1) : ''
  return new URLSearchParams(raw)
}

const notify = (type, payload) => {
  listeners.forEach((listener) => {
    try {
      listener(type, payload)
    } catch (listenerError) {
      console.error('Lingua Google return listener error', listenerError)
    }
  })
}

/** Đổi URL deep link trả về thành phiên đăng nhập Firebase. */
export const completeGoogleBrowserSignIn = async (urlString) => {
  if (typeof urlString !== 'string' || !urlString.startsWith(`${APP_URL_SCHEME}://`)) return null
  const params = parseFragment(urlString)
  const idToken = params.get('id_token')
  const oauthError = params.get('error')
  if (oauthError) {
    clearPending()
    await closeExternalBrowser()
    notify('error', oauthError === 'access_denied' ? 'Bạn đã huỷ đăng nhập Google.' : `Google báo lỗi: ${oauthError}`)
    return null
  }
  if (!idToken) return null

  // Chế độ client ID riêng: kiểm tra `state` để tránh deep link giả.
  // Chế độ tự động: handler của Firebase sinh state riêng nên chỉ ghi log.
  const returnedState = params.get('state') || params.get('eventId')
  const pending = readPending()
  if (pending?.state && pending.mode !== 'auto' && returnedState && pending.state !== returnedState) {
    clearPending()
    notify('error', 'Phiên đăng nhập không hợp lệ. Vui lòng thử lại.')
    return null
  }
  if (pending?.mode === 'auto' && pending.state && returnedState && pending.state !== returnedState) {
    console.warn('Lingua Google sign-in: state trả về không khớp (chế độ tự động).')
  }

  try {
    const user = await signInWithIdToken(idToken, params.get('access_token') || undefined)
    clearPending()
    await closeExternalBrowser()
    recordDiagnostics({ returnStatus: 'ok', account: user?.email || '' })
    notify('success', user)
    return user
  } catch (error) {
    clearPending()
    await closeExternalBrowser()
    console.error('Lingua Google credential error', error)
    recordDiagnostics({ returnStatus: 'error', errorCode: error?.code || '', errorMessage: String(error?.message || '').slice(0, 200) })
    notify('error', error?.code === 'auth/invalid-credential'
      ? 'Google từ chối đăng nhập. Kiểm tra lại cấu hình đăng nhập Google trong Cài đặt.'
      : 'Không thể xác thực với Google. Vui lòng thử lại.')
    return null
  }
}

/**
 * Đổi một Google ID token thành phiên Firebase.
 * Dùng chung cho deep link và cho đường dự phòng “dán mã đăng nhập”.
 */
export const signInWithIdToken = async (idToken, accessToken) => {
  if (!idToken) throw new Error('Thiếu mã đăng nhập Google.')
  const credential = GoogleAuthProvider.credential(idToken.trim(), accessToken || undefined)
  const result = await signInWithCredential(auth, credential)
  return result.user
}

/**
 * Nghe deep link quay về app. Trả về hàm huỷ đăng ký.
 * `onResult` nhận `(type, payload)` với type là 'success' | 'error'.
 */
export const subscribeGoogleReturn = async (onResult) => {
  listeners.add(onResult)
  const unsubscribeListener = () => listeners.delete(onResult)
  if (!isCapacitor()) return unsubscribeListener

  let handler = null
  try {
    const { App } = await import('@capacitor/app')
    const launch = await App.getLaunchUrl().catch(() => null)
    if (launch?.url) void completeGoogleBrowserSignIn(launch.url)
    handler = await App.addListener('appUrlOpen', (event) => {
      void completeGoogleBrowserSignIn(event?.url)
    })
  } catch (error) {
    console.error('Lingua Google deep link listener error', error)
  }

  return () => {
    unsubscribeListener()
    try {
      handler?.remove?.()
    } catch {
      /* bỏ qua */
    }
  }
}

/** Mở Chrome để đăng nhập Google. Trả về `{ pending: true }` vì kết quả tới sau qua deep link. */
export const startGoogleBrowserSignIn = async () => {
  const mode = getGoogleLoginMode()
  const state = randomId()
  let url

  if (mode === 'direct') {
    const clientId = getGoogleWebClientId()
    if (!clientId) throw MissingClientIdError()
    rememberPending({ mode: 'direct', state, at: Date.now() })
    url = buildGoogleAuthUrl({ clientId, nonce: randomId(), state })
  } else {
    const apiKey = auth.app?.options?.apiKey
    const authDomain = auth.app?.options?.authDomain
    if (!apiKey || !authDomain) throw new Error('Không đọc được cấu hình Firebase để đăng nhập Google.')
    rememberPending({ mode: 'auto', state, at: Date.now() })
    url = buildFirebaseHandlerUrl({ apiKey, authDomain, redirectUrl: GOOGLE_REDIRECT_URI, eventId: state })
  }

  const openedWith = await openExternal(url)
  recordDiagnostics({
    mode,
    openedWith,
    hasBrowserPlugin: canUseBrowserPlugin(),
    isNativeApp: isCapacitor(),
    url,
    eventId: state,
    returnStatus: 'waiting',
  })
  return { pending: true, mode, url, openedWith }
}

/** Có thể đăng nhập Google qua Chrome không (chỉ dùng cho bản APK). */
export const canUseBrowserGoogleSignIn = () => isCapacitor()
