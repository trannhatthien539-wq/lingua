/**
 * Tuỳ biến giao diện: chế độ sáng/tối, màu chủ đề và phông chữ.
 *
 * Màu được truyền vào CSS qua 2 biến `--accent` (màu nhấn, ví dụ nút chính, tab đang chọn)
 * và `--accent-2` (màu phụ, dùng cho chữ/viền/thanh tiến độ). Tailwind đọc 2 biến này ở
 * `tailwind.config.js` nên mọi class như `bg-lime`, `text-sage`, `bg-lime/20` đều tự đổi theo.
 */

export const APPEARANCE_STORAGE_KEY = 'lingua-appearance'
export const FONT_LINK_ID = 'lingua-font'
export const APPEARANCE_EVENT = 'lingua:appearance'

const clamp = (value, min, max) => Math.min(max, Math.max(min, value))

/* ------------------------------------------------------------------ *
 * Chế độ sáng / tối
 * ------------------------------------------------------------------ */

export const THEME_MODES = ['light', 'dark', 'system']

export const prefersDarkScheme = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches

export const readThemeMode = () => {
  try {
    const saved = localStorage.getItem('lingua-theme')
    if (THEME_MODES.includes(saved)) return saved
  } catch {
    // localStorage có thể bị chặn: dùng mặc định theo hệ thống.
  }
  return 'system'
}

/** Áp chế độ sáng/tối lên <html>. Trả về true nếu đang là giao diện tối. */
export const applyThemeMode = (mode) => {
  const isDark = mode === 'dark' || (mode === 'system' && prefersDarkScheme())
  const root = document.documentElement
  root.classList.toggle('dark', isDark)
  root.style.colorScheme = isDark ? 'dark' : 'light'
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', isDark ? '#141917' : '#f6f7f5')
  return isDark
}

/* ------------------------------------------------------------------ *
 * Tiện ích màu
 * ------------------------------------------------------------------ */

export const normalizeHex = (value) => {
  const hex = String(value || '').trim().replace(/^#/, '')
  if (!/^([0-9a-f]{3}|[0-9a-f]{6})$/i.test(hex)) return null
  const full = hex.length === 3 ? hex.split('').map((char) => char + char).join('') : hex
  return `#${full.toLowerCase()}`
}

const hexToRgb = (value) => {
  const hex = normalizeHex(value) || '#000000'
  return {
    r: parseInt(hex.slice(1, 3), 16),
    g: parseInt(hex.slice(3, 5), 16),
    b: parseInt(hex.slice(5, 7), 16),
  }
}

const rgbToHex = ({ r, g, b }) =>
  `#${[r, g, b].map((channel) => clamp(Math.round(channel), 0, 255).toString(16).padStart(2, '0')).join('')}`

const rgbToHsl = (r, g, b) => {
  const rn = r / 255
  const gn = g / 255
  const bn = b / 255
  const max = Math.max(rn, gn, bn)
  const min = Math.min(rn, gn, bn)
  const l = (max + min) / 2
  if (max === min) return { h: 0, s: 0, l }
  const delta = max - min
  const s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min)
  let h
  if (max === rn) h = ((gn - bn) / delta + (gn < bn ? 6 : 0)) / 6
  else if (max === gn) h = ((bn - rn) / delta + 2) / 6
  else h = ((rn - gn) / delta + 4) / 6
  return { h: h * 360, s, l }
}

const hslToHex = (h, s, l) => {
  const hue = (((h % 360) + 360) % 360) / 360
  if (s === 0) {
    const value = Math.round(l * 255)
    return rgbToHex({ r: value, g: value, b: value })
  }
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s
  const p = 2 * l - q
  const channel = (t) => {
    let tt = t
    if (tt < 0) tt += 1
    if (tt > 1) tt -= 1
    if (tt < 1 / 6) return p + (q - p) * 6 * tt
    if (tt < 1 / 2) return q
    if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6
    return p
  }
  return rgbToHex({
    r: channel(hue + 1 / 3) * 255,
    g: channel(hue) * 255,
    b: channel(hue - 1 / 3) * 255,
  })
}

/**
 * Từ một màu bất kỳ, suy ra cặp màu dùng được cho giao diện:
 * - accent: giữ nguyên tông, chỉnh độ sáng vào khoảng an toàn để chữ mực đậm vẫn rõ.
 * - accent2: cùng tông nhưng trầm hơn, dùng làm chữ/viền/thanh tiến độ.
 */
export const derivePalette = (input) => {
  const safe = normalizeHex(input) || '#d9f06d'
  const { r, g, b } = hexToRgb(safe)
  const { h, s, l } = rgbToHsl(r, g, b)
  return {
    accent: hslToHex(h, clamp(s, 0.45, 0.92), clamp(l, 0.64, 0.8)),
    accent2: hslToHex(h, clamp(s * 0.4, 0.14, 0.34), 0.56),
  }
}

/* ------------------------------------------------------------------ *
 * Bảng màu & phông chữ có sẵn
 * ------------------------------------------------------------------ */

export const PALETTES = [
  { id: 'lime', name: 'Chanh', accent: '#d9f06d', accent2: '#86a98f' },
  { id: 'mint', name: 'Bạc hà', accent: '#a9ecd2', accent2: '#6f9c8c' },
  { id: 'sky', name: 'Biển', accent: '#a9d8f5', accent2: '#6f93b2' },
  { id: 'lavender', name: 'Oải hương', accent: '#cfc6f7', accent2: '#7f79ab' },
  { id: 'peach', name: 'Đào', accent: '#ffd2b0', accent2: '#b08265' },
  { id: 'rose', name: 'Hồng', accent: '#ffc6d3', accent2: '#b16f80' },
  { id: 'sand', name: 'Cát', accent: '#f2e3b3', accent2: '#a08f5c' },
  { id: 'stone', name: 'Đá', accent: '#d6dcd8', accent2: '#7c8a84' },
]

export const FONTS = [
  {
    id: 'dm-sans',
    name: 'DM Sans',
    note: 'Mặc định · gọn gàng',
    sans: "'DM Sans'",
    display: "'Space Grotesk'",
    google: 'family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700',
  },
  {
    id: 'be-vietnam',
    name: 'Be Vietnam Pro',
    note: 'Tối ưu cho tiếng Việt',
    sans: "'Be Vietnam Pro'",
    display: "'Be Vietnam Pro'",
    google: 'family=Be+Vietnam+Pro:wght@400;500;600;700',
  },
  {
    id: 'inter',
    name: 'Inter',
    note: 'Trung tính, dễ đọc',
    sans: "'Inter'",
    display: "'Inter'",
    google: 'family=Inter:wght@400;500;600;700',
  },
  {
    id: 'nunito',
    name: 'Nunito',
    note: 'Bo tròn, thân thiện',
    sans: "'Nunito'",
    display: "'Nunito'",
    google: 'family=Nunito:wght@400;600;700;800',
  },
  {
    id: 'work-sans',
    name: 'Work Sans',
    note: 'Chắc chắn, hiện đại',
    sans: "'Work Sans'",
    display: "'Work Sans'",
    google: 'family=Work+Sans:wght@400;500;600;700',
  },
  {
    id: 'lora',
    name: 'Lora',
    note: 'Serif cho người thích đọc',
    sans: "'Lora'",
    display: "'Lora'",
    google: 'family=Lora:wght@400;500;600;700',
  },
]

export const FONT_SCALES = [
  { id: 'md', name: 'Vừa', value: 1 },
  { id: 'lg', name: 'Lớn', value: 1.08 },
  { id: 'xl', name: 'Rất lớn', value: 1.16 },
]

export const defaultAppearance = { paletteId: 'lime', customColor: '#d9f06d', fontId: 'dm-sans', fontScale: 'md' }

/* ------------------------------------------------------------------ *
 * Đọc / ghi / áp dụng
 * ------------------------------------------------------------------ */

export const normalizeAppearance = (input) => {
  const paletteId = PALETTES.some((item) => item.id === input?.paletteId)
    ? input.paletteId
    : input?.paletteId === 'custom'
      ? 'custom'
      : defaultAppearance.paletteId
  const font = FONTS.find((item) => item.id === input?.fontId)
  const scale = FONT_SCALES.find((item) => item.id === input?.fontScale)
  return {
    paletteId,
    customColor: normalizeHex(input?.customColor) || defaultAppearance.customColor,
    fontId: font ? font.id : defaultAppearance.fontId,
    fontScale: scale ? scale.id : defaultAppearance.fontScale,
  }
}

export const readAppearance = () => {
  try {
    const stored = JSON.parse(localStorage.getItem(APPEARANCE_STORAGE_KEY) || 'null')
    return normalizeAppearance(stored || defaultAppearance)
  } catch {
    return { ...defaultAppearance }
  }
}

export const writeAppearance = (appearance) => {
  try {
    localStorage.setItem(APPEARANCE_STORAGE_KEY, JSON.stringify(normalizeAppearance(appearance)))
  } catch {
    // Bỏ qua khi localStorage đầy hoặc bị chặn.
  }
}

export const resolveAppearance = (appearance) => {
  const normalized = normalizeAppearance(appearance)
  const font = FONTS.find((item) => item.id === normalized.fontId) || FONTS[0]
  const scale = FONT_SCALES.find((item) => item.id === normalized.fontScale) || FONT_SCALES[0]
  const preset = PALETTES.find((item) => item.id === normalized.paletteId)
  const colors = preset && normalized.paletteId !== 'custom'
    ? { accent: preset.accent, accent2: preset.accent2 }
    : derivePalette(normalized.customColor)
  return { ...normalized, font, scale, colors }
}

const toChannels = (hex) => {
  const { r, g, b } = hexToRgb(hex)
  return `${r} ${g} ${b}`
}

/** Nạp stylesheet của phông chữ đang chọn (chỉ tải khi thật sự cần). */
const ensureFontStylesheet = (font) => {
  if (!font?.google) return
  const href = `https://fonts.googleapis.com/css2?${font.google}&display=swap`
  let link = document.getElementById(FONT_LINK_ID)
  if (!link) {
    link = document.createElement('link')
    link.id = FONT_LINK_ID
    link.rel = 'stylesheet'
    document.head.appendChild(link)
  }
  if (link.getAttribute('href') !== href) link.setAttribute('href', href)
}

/** Áp cấu hình giao diện lên <html>. Trả về cấu hình đã chuẩn hoá. */
export const applyAppearance = (appearance) => {
  const resolved = resolveAppearance(appearance)
  const root = document.documentElement
  root.style.setProperty('--accent', toChannels(resolved.colors.accent))
  root.style.setProperty('--accent-2', toChannels(resolved.colors.accent2))
  root.style.setProperty('--font-sans', resolved.font.sans)
  root.style.setProperty('--font-display', resolved.font.display)
  root.style.fontSize = resolved.scale.value === 1 ? '' : `${Math.round(resolved.scale.value * 100)}%`
  ensureFontStylesheet(resolved.font)
  return resolved
}

/** Gọi trước khi React render để tránh nháy màu/phông chữ mặc định. */
export const bootstrapAppearance = () => {
  applyThemeMode(readThemeMode())
  applyAppearance(readAppearance())
  // Tab khác đổi giao diện thì tab này cũng đổi theo.
  if (typeof window === 'undefined' || window.__linguaAppearanceBound) return
  window.__linguaAppearanceBound = true
  window.addEventListener('storage', (event) => {
    if (event.key === APPEARANCE_STORAGE_KEY) applyAppearance(readAppearance())
    if (event.key === 'lingua-theme') applyThemeMode(readThemeMode())
  })
}
