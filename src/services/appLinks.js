import { APP_URL_SCHEME } from './googleAuthConfig.js'
import { isCapacitor } from './platform.js'

/**
 * Deep link nội bộ của app — dùng cho widget màn hình chính và shortcut khi giữ icon.
 *
 * - `com.lingua.studyhub://tab/vocabulary` → mở tab Từ vựng
 * - `com.lingua.studyhub://grammar/present-simple` → mở bài ngữ pháp cụ thể (itemId)
 * - `com.lingua.studyhub://auth#id_token=…` → đăng nhập Google, xử lý riêng ở
 *   `googleBrowserAuth.subscribeGoogleReturn` nên ở đây chỉ trả `{ type: 'auth' }` để bỏ qua.
 */
export const TAB_PATHS = {
  vocabulary: '/vocabulary',
  grammar: '/grammar',
  skills: '/skills',
  vstep: '/vstep',
  writing: '/writing',
  progress: '/progress',
  planner: '/planner',
  mindmap: '/mindmap',
  settings: '/settings',
}

/** Link mở một tab (dùng cho widget/shortcut phía Android). */
export const appLinkFor = (tab) => `${APP_URL_SCHEME}://tab/${tab}`

/** Chuẩn hoá deep link thành hành động cho UI; trả `null` nếu không phải link của app. */
export const parseAppLink = (url) => {
  if (typeof url !== 'string') return null
  const prefix = `${APP_URL_SCHEME}://`
  if (!url.startsWith(prefix)) return null
  const head = url.slice(prefix.length).split(/[?#]/)[0]
  const [host, ...segments] = head.split('/').filter(Boolean)
  if (!host) return null
  if (host === 'auth') return { type: 'auth' }
  if (host === 'tab') {
    const tab = String(segments[0] || 'vocabulary').toLowerCase()
    return { type: 'tab', tab, path: TAB_PATHS[tab] || TAB_PATHS.vocabulary, itemId: segments[1] || null }
  }
  if (TAB_PATHS[host]) {
    return { type: 'item', tab: host, path: TAB_PATHS[host], itemId: segments[0] || null }
  }
  return null
}

/**
 * Nghe deep link của app (widget/shortcut). Không xử lý link `auth` để không giẫm vào
 * luồng đăng nhập Google. Trả về hàm huỷ đăng ký.
 */
export const subscribeAppLinks = async (onLink) => {
  if (!isCapacitor()) return () => {}
  let handler = null
  try {
    const { App } = await import('@capacitor/app')
    const launch = await App.getLaunchUrl().catch(() => null)
    const fromLaunch = parseAppLink(launch?.url)
    if (fromLaunch && fromLaunch.type !== 'auth') onLink(fromLaunch)
    handler = await App.addListener('appUrlOpen', (event) => {
      const link = parseAppLink(event?.url)
      if (link && link.type !== 'auth') onLink(link)
    })
  } catch (error) {
    console.error('Lingua app link listener error', error)
  }
  return () => {
    try {
      handler?.remove?.()
    } catch {
      /* bỏ qua */
    }
  }
}
