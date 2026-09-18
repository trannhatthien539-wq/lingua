import { useCallback, useEffect, useState } from 'react'
import {
  APPEARANCE_STORAGE_KEY,
  applyAppearance,
  defaultAppearance,
  normalizeAppearance,
  normalizeHex,
  readAppearance,
  writeAppearance,
} from '../services/appearanceService'

/**
 * Quản lý tuỳ biến giao diện (màu chủ đề + phông chữ + cỡ chữ).
 * Ghi vào localStorage và áp ngay lên <html> mỗi khi thay đổi.
 */
export default function useAppearance() {
  const [appearance, setAppearance] = useState(() => readAppearance())

  useEffect(() => {
    applyAppearance(appearance)
    writeAppearance(appearance)
  }, [appearance])

  // Đồng bộ khi tab khác đổi giao diện.
  useEffect(() => {
    const onStorage = (event) => {
      if (event.key === APPEARANCE_STORAGE_KEY) setAppearance(readAppearance())
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const update = useCallback((patch) => {
    setAppearance((current) => normalizeAppearance({ ...current, ...patch }))
  }, [])

  const setPalette = useCallback((paletteId) => update({ paletteId }), [update])

  const setCustomColor = useCallback(
    (value) => {
      const hex = normalizeHex(value)
      if (!hex) return
      update({ paletteId: 'custom', customColor: hex })
    },
    [update],
  )

  const setFont = useCallback((fontId) => update({ fontId }), [update])
  const setFontScale = useCallback((fontScale) => update({ fontScale }), [update])
  const resetAppearance = useCallback(() => setAppearance({ ...defaultAppearance }), [])

  return { appearance, setPalette, setCustomColor, setFont, setFontScale, resetAppearance }
}
