import { useEffect, useState } from 'react'
import { applyThemeMode, prefersDarkScheme, readThemeMode } from '../services/appearanceService'

const resolveIsDark = (mode) => mode === 'dark' || (mode === 'system' && prefersDarkScheme())

/**
 * Chế độ sáng/tối. Giá trị lưu là 'light' | 'dark' | 'system'.
 * `theme` trả về giá trị đã quy đổi ('light' | 'dark') để các component cũ dùng như trước.
 */
export function useTheme() {
  const [themeMode, setThemeMode] = useState(readThemeMode)
  const [isDark, setIsDark] = useState(() => resolveIsDark(readThemeMode()))

  useEffect(() => {
    setIsDark(applyThemeMode(themeMode))
    try {
      localStorage.setItem('lingua-theme', themeMode)
    } catch {
      // Bỏ qua khi localStorage bị chặn.
    }
  }, [themeMode])

  // Ở chế độ "Theo hệ thống", cập nhật ngay khi cài đặt của máy thay đổi.
  useEffect(() => {
    if (themeMode !== 'system') return undefined
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => setIsDark(applyThemeMode('system'))
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [themeMode])

  return {
    theme: isDark ? 'dark' : 'light',
    themeMode,
    setThemeMode,
    isDark,
    toggleTheme: () => setThemeMode(isDark ? 'light' : 'dark'),
  }
}
