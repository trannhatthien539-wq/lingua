import { lazy } from 'react'

/**
 * `React.lazy` + khả năng nạp trước (prefetch).
 *
 * Nhờ `.preload()`, Sidebar/bottom nav có thể tải chunk của tab ngay khi người dùng
 * rê chuột hoặc chạm vào mục điều hướng — bấm sang tab sẽ gần như tức thì thay vì
 * chờ một vòng tải mạng + parse.
 *
 * Module import() được trình duyệt và Vite cache lại, nên gọi preload nhiều lần
 * không tạo thêm request.
 */
export const lazyWithPreload = (factory) => {
  const Component = lazy(factory)
  Component.preload = factory
  return Component
}

/** Nạp trước một component lazy; bỏ qua mọi lỗi (prefetch không được làm hỏng UI). */
export const preload = (Component) => {
  if (typeof Component?.preload !== 'function') return
  Promise.resolve()
    .then(() => Component.preload())
    .catch(() => {})
}

/** Chạy callback khi trình duyệt rảnh (có fallback cho Safari cũ). */
export const whenIdle = (callback, timeout = 2500) => {
  if (typeof window === 'undefined') return () => {}
  if ('requestIdleCallback' in window) {
    const handle = window.requestIdleCallback(callback, { timeout })
    return () => window.cancelIdleCallback?.(handle)
  }
  const handle = window.setTimeout(callback, Math.min(timeout, 1200))
  return () => window.clearTimeout(handle)
}
