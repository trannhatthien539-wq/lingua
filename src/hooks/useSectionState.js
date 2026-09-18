import { useCallback, useState } from 'react'

const STORAGE_KEY = 'lingua-settings-sections'

const readAll = () => {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
    return stored && typeof stored === 'object' ? stored : {}
  } catch {
    return {}
  }
}

/**
 * Nhớ trạng thái thu gọn/mở rộng của từng thẻ trong trang Cài đặt.
 * Mỗi thẻ tự gọi hook với `id` riêng; khi ghi thì gộp lại nên không ghi đè thẻ khác.
 */
export default function useSectionState(id, defaultOpen = false) {
  const [open, setOpen] = useState(() => {
    const stored = readAll()[id]
    return typeof stored === 'boolean' ? stored : defaultOpen
  })

  const toggle = useCallback(() => {
    setOpen((current) => {
      const next = !current
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...readAll(), [id]: next }))
      } catch {
        // Bỏ qua khi localStorage đầy hoặc bị chặn.
      }
      return next
    })
  }, [id])

  return [open, toggle]
}
