/**
 * Cấu hình Google dùng chung cho web (popup) và app APK (mở Chrome).
 *
 * QUAN TRỌNG: client ID phải là **Web client ID** nằm trong **cùng project với Firebase**.
 * Lấy nhanh: Firebase Console → Authentication → Sign-in method → Google →
 * Web SDK configuration → Web client ID (dạng `xxxx.apps.googleusercontent.com`).
 *
 * Với bản APK, sau khi có client ID cần thêm đúng `GOOGLE_REDIRECT_URI` bên dưới vào
 * Google Cloud Console → APIs & Services → Credentials → OAuth client đó →
 * Authorized redirect URIs. Cách này KHÔNG cần SHA-1, KHÔNG cần Android client.
 *
 * Thứ tự ưu tiên: giá trị nhập trong app (Cài đặt → Tài khoản) → biến môi trường khi build
 * → hằng số `GOOGLE_WEB_CLIENT_ID` trong `src/config/googleAuth.js`.
 */
import { GOOGLE_WEB_CLIENT_ID } from '../config/googleAuth'

const CLIENT_ID_KEY = 'lingua-google-client-id'

/** Trang trung gian trên GitHub Pages: nhận id_token rồi chuyển tiếp về app. */
export const GOOGLE_REDIRECT_URI = 'https://trannhatthien539-wq.github.io/lingua/oauth-callback.html'

/** URI scheme đã đăng ký trong AndroidManifest để Chrome mở lại app. */
export const APP_URL_SCHEME = 'com.lingua.studyhub'

export const normalizeClientId = (value) => String(value || '').trim()

export const isGoogleClientId = (value) => /^\d+-[a-z0-9-]+\.apps\.googleusercontent\.com$/i.test(normalizeClientId(value))

export const readStoredClientId = () => {
  try {
    return normalizeClientId(localStorage.getItem(CLIENT_ID_KEY))
  } catch {
    return ''
  }
}

export const storeClientId = (value) => {
  const clean = normalizeClientId(value)
  try {
    if (clean) localStorage.setItem(CLIENT_ID_KEY, clean)
    else localStorage.removeItem(CLIENT_ID_KEY)
  } catch {
    /* Bỏ qua khi trình duyệt chặn localStorage. */
  }
  return clean
}

/** Web client ID đang có hiệu lực. */
export const getGoogleWebClientId = () =>
  readStoredClientId() || normalizeClientId(import.meta.env.VITE_GOOGLE_WEB_CLIENT_ID) || normalizeClientId(GOOGLE_WEB_CLIENT_ID)

export const hasGoogleClientId = () => Boolean(getGoogleWebClientId())
