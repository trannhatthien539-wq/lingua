/**
 * Đăng nhập Google cho bản APK bằng cách mở Chrome (trình duyệt hệ thống).
 *
 * Luồng chạy:
 *   1. App mở `accounts.google.com/o/oauth2/v2/auth` trong Chrome.
 *   2. Người dùng chọn tài khoản Google (Chrome thường đã đăng nhập sẵn).
 *   3. Google chuyển về `GOOGLE_REDIRECT_URI` (trang oauth-callback.html trên GitHub Pages).
 *   4. Trang đó chuyển tiếp sang `com.lingua.studyhub://auth#id_token=...`.
 *   5. Chrome mở lại app, `@capacitor/app` bắn sự kiện `appUrlOpen`, app đổi id_token
 *      thành phiên Firebase bằng `signInWithCredential`.
 *
 * Ưu điểm so với Google Sign-In native: chỉ cần 1 Web client ID + 1 redirect URI,
 * không cần SHA-1, không cần đăng ký Android client, và không cần keystore cố định.
 */
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth'
import { auth } from './firebase'
import { APP_URL_SCHEME, GOOGLE_REDIRECT_URI, getGoogleWebClientId } from './googleAuthConfig'
import { isCapacitor } from './platform'

const PENDING_KEY = 'lingua-google-oauth-pending'
const listeners = new Set()

export const MissingClientIdError = () => {
  const error = new Error('Chưa có Google Web Client ID. Vào Cài đặt → Tài khoản để dán client ID.')
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

const openExternal = async (url) => {
  try {
    const { Browser } = await import('@capacitor/browser')
    await Browser.open({ url, presentationStyle: 'fullscreen' })
    return true
  } catch {
    // Dự phòng khi plugin không có sẵn: Capacitor hiểu target `_system` là mở trình duyệt ngoài.
    const opened = window.open(url, '_system')
    if (!opened) window.location.href = url
    return true
  }
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

  const pending = readPending()
  const state = params.get('state')
  if (pending?.state && state && pending.state !== state) {
    clearPending()
    notify('error', 'Phiên đăng nhập không hợp lệ. Vui lòng thử lại.')
    return null
  }

  try {
    const credential = GoogleAuthProvider.credential(idToken, params.get('access_token') || undefined)
    const result = await signInWithCredential(auth, credential)
    clearPending()
    await closeExternalBrowser()
    notify('success', result.user)
    return result.user
  } catch (error) {
    clearPending()
    await closeExternalBrowser()
    notify('error', error?.code === 'auth/invalid-credential'
      ? 'Google từ chối đăng nhập. Kiểm tra client ID có đúng project Firebase và redirect URI đã được thêm chưa.'
      : 'Không thể xác thực với Google. Vui lòng thử lại.')
    return null
  }
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
  const clientId = getGoogleWebClientId()
  if (!clientId) throw MissingClientIdError()
  const nonce = randomId()
  const state = randomId()
  rememberPending({ nonce, state, at: Date.now() })
  await openExternal(buildGoogleAuthUrl({ clientId, nonce, state }))
  return { pending: true }
}

/** Có thể đăng nhập Google qua Chrome không (chỉ dùng cho bản APK). */
export const canUseBrowserGoogleSignIn = () => isCapacitor()
