import { useEffect, useState } from 'react'

const getInitialTheme = () => {
  const savedTheme = localStorage.getItem('lingua-theme')
  if (savedTheme) return savedTheme
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function useTheme() {
  const [theme, setTheme] = useState(getInitialTheme)

  useEffect(() => {
    const isDark = theme === 'dark'
    document.documentElement.classList.toggle('dark', isDark)
    // Đồng bộ thanh trạng thái của trình duyệt/PWA và màu nền vùng overscroll.
    document.documentElement.style.colorScheme = isDark ? 'dark' : 'light'
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', isDark ? '#141917' : '#f6f7f5')
    localStorage.setItem('lingua-theme', theme)
  }, [theme])

  return { theme, toggleTheme: () => setTheme((current) => current === 'dark' ? 'light' : 'dark') }
}
