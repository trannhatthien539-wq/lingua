import { useCallback, useEffect, useState } from 'react'
import { dataService, invalidateVocabularyCache } from '../services/dataService'
import { refreshRequestedEvent } from '../services/syncStatus'
import { toast } from '../services/toast'

/**
 * Đọc toàn bộ thẻ từ vựng của người dùng hiện tại.
 *
 * Trước đây mỗi màn hình (Trang chủ, Tiến độ, widget…) tự gọi `getDecks()` rồi
 * `getCards(deckId)` cho từng bộ — với 7 bộ là 8 lượt đọc Firestore. Hook này dùng
 * `dataService.getAllCards()` (một query duy nhất) và tự nạp lại khi:
 * - đổi tài khoản (`user.uid`)
 * - có sự kiện `lingua:data-refresh` (đồng bộ dữ liệu khách, đăng nhập/đăng xuất)
 */
export default function useVocabularyCards({ user } = {}) {
  const [cards, setCards] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [reloadToken, setReloadToken] = useState(0)

  useEffect(() => {
    let active = true
    setLoading(true)
    dataService
      .getAllCards()
      .then((list) => {
        if (!active) return
        setCards(Array.isArray(list) ? list : [])
        setError(null)
      })
      .catch((loadError) => {
        if (!active) return
        setError(loadError)
        toast.error(loadError.message || 'Không thể tải dữ liệu từ vựng.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [user?.uid, reloadToken])

  useEffect(() => {
    const refresh = () => {
      invalidateVocabularyCache()
      setReloadToken((value) => value + 1)
    }
    window.addEventListener(refreshRequestedEvent, refresh)
    return () => window.removeEventListener(refreshRequestedEvent, refresh)
  }, [])

  const reload = useCallback(() => {
    invalidateVocabularyCache()
    setReloadToken((value) => value + 1)
  }, [])

  return { cards, loading, error, reload }
}
