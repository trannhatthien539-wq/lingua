import { useCallback, useEffect, useState } from 'react'
import { dataService, invalidateVocabularyCache } from '../services/dataService'
import { refreshRequestedEvent } from '../services/syncStatus'
import { toast } from '../services/toast'
import { loadCachedLibrary } from '../services/vocabularyStorage'

/**
 * Đọc toàn bộ thẻ từ vựng của người dùng hiện tại.
 *
 * Trước đây mỗi màn hình (Trang chủ, Tiến độ, widget…) tự gọi `getDecks()` rồi
 * `getCards(deckId)` cho từng bộ — với 7 bộ là 8 lượt đọc Firestore. Hook này dùng
 * `dataService.getAllCards()` (một query duy nhất) và nạp tức thì từ cache cục bộ (IndexedDB)
 * trước khi revalidate từ Firestore.
 */
export default function useVocabularyCards({ user } = {}) {
  const [cards, setCards] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [reloadToken, setReloadToken] = useState(0)

  useEffect(() => {
    let active = true

    // Đọc ngay từ IndexedDB để giao diện hiển thị tức thì (20ms)
    loadCachedLibrary(user?.uid || 'guest').then((cached) => {
      if (!active) return
      if (cached?.cards?.length) {
        setCards(cached.cards)
        setLoading(false)
      }
    }).catch(() => {})

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
