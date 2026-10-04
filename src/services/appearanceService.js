/**
 * Tuỳ biến giao diện: chế độ sáng/tối, màu chủ đề toàn diện, phông chữ và ảnh nền riêng biệt.
 *
 * Màu được truyền vào CSS qua biến:
 * - `--accent` (RGB channel): ví dụ "99 102 241"
 * - `--accent-2` (RGB channel): màu bổ trợ cho dải gradient
 * - `--accent-hex`: mã hex trực tiếp
 * - `--accent-2-hex`: mã hex màu phụ
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
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', isDark ? '#0B0F17' : '#F8FAFC')
  return isDark
}

/* ------------------------------------------------------------------ *
 * Tiện ích màu & Palette Derivation
 * ------------------------------------------------------------------ */

export const normalizeHex = (value) => {
  const hex = String(value || '').trim().replace(/^#/, '')
  if (!/^([0-9a-f]{3}|[0-9a-f]{6})$/i.test(hex)) return null
  const full = hex.length === 3 ? hex.split('').map((char) => char + char).join('') : hex
  return `#${full.toLowerCase()}`
}

export const hexToRgb = (value) => {
  const hex = normalizeHex(value) || '#6366f1'
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
 * Tự động tạo dải màu đồng bộ chất lượng cao từ một màu bất kỳ:
 * - accent: màu nhấn chính, cân bằng độ sáng và bão hoà
 * - accent2: màu bổ trợ cho dải gradient cao cấp
 */
export const derivePalette = (input) => {
  const safe = normalizeHex(input) || '#6366f1'
  const { r, g, b } = hexToRgb(safe)
  const { h, s, l } = rgbToHsl(r, g, b)
  return {
    accent: hslToHex(h, clamp(s, 0.5, 0.95), clamp(l, 0.46, 0.64)),
    accent2: hslToHex(h, clamp(s, 0.55, 0.95), clamp(l * 0.78, 0.32, 0.52)),
  }
}

/* ------------------------------------------------------------------ *
 * Bảng màu, Phông chữ & Ảnh nền có sẵn
 * ------------------------------------------------------------------ */

export const PALETTES = [
  { id: 'indigo', name: 'Cyber Indigo', accent: '#6366F1', accent2: '#4F46E5' },
  { id: 'emerald', name: 'Emerald Aurora', accent: '#10B981', accent2: '#059669' },
  { id: 'sky', name: 'Electric Sky', accent: '#0EA5E9', accent2: '#0284C7' },
  { id: 'violet', name: 'Royal Violet', accent: '#8B5CF6', accent2: '#7C3AED' },
  { id: 'rose', name: 'Sunset Rose', accent: '#F43F5E', accent2: '#E11D48' },
  { id: 'amber', name: 'Cosmic Amber', accent: '#F59E0B', accent2: '#D97706' },
  { id: 'teal', name: 'Neon Mint', accent: '#14B8A6', accent2: '#0D9488' },
  { id: 'slate', name: 'Titanium Slate', accent: '#64748B', accent2: '#475569' },
  // Hỗ trợ tương thích ngược với các ID cũ:
  { id: 'lime', name: 'Lime tươi', accent: '#84CC16', accent2: '#65A30D' },
  { id: 'mint', name: 'Bạc hà dịu', accent: '#10B981', accent2: '#059669' },
  { id: 'lavender', name: 'Oải hương', accent: '#A855F7', accent2: '#7E22CE' },
  { id: 'peach', name: 'Đào san hô', accent: '#FB923C', accent2: '#EA580C' },
]

export const WALLPAPER_PRESETS = [
  {
    id: 'aurora',
    name: 'Cực quang Aurora',
    url: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?q=80&w=1920&auto=format&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?q=80&w=300&auto=format&fit=crop',
  },
  {
    id: 'space',
    name: 'Vũ trụ Deep Space',
    url: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=1920&auto=format&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=300&auto=format&fit=crop',
  },
  {
    id: 'cyberpunk',
    name: 'Đêm Cyberpunk',
    url: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=1920&auto=format&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=300&auto=format&fit=crop',
  },
  {
    id: 'study',
    name: 'Góc học tập Cozy',
    url: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0d0?q=80&w=1920&auto=format&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0d0?q=80&w=300&auto=format&fit=crop',
  },
  {
    id: 'fluid',
    name: 'Lụa kính Apple Silk',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1920&auto=format&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=300&auto=format&fit=crop',
  },
]

export const FONTS = [
  {
    id: 'inter',
    name: 'Inter',
    note: 'Chuẩn Apple & Linear, cực kỳ sắc nét',
    sans: "'Inter'",
    display: "'Space Grotesk'",
    google: 'family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700',
  },
  {
    id: 'be-vietnam',
    name: 'Be Vietnam Pro',
    note: 'Tối ưu dấu câu và nét chữ tiếng Việt',
    sans: "'Be Vietnam Pro'",
    display: "'Be Vietnam Pro'",
    google: 'family=Be+Vietnam+Pro:wght@400;500;600;700',
  },
  {
    id: 'dm-sans',
    name: 'DM Sans',
    note: 'Gọn gàng, hình học hiện đại',
    sans: "'DM Sans'",
    display: "'Space Grotesk'",
    google: 'family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700',
  },
  {
    id: 'nunito',
    name: 'Nunito',
    note: 'Bo tròn, thân thiện và năng động',
    sans: "'Nunito'",
    display: "'Nunito'",
    google: 'family=Nunito:wght@400;600;700;800',
  },
  {
    id: 'work-sans',
    name: 'Work Sans',
    note: 'Chắc chắn, chuyên nghiệp',
    sans: "'Work Sans'",
    display: "'Work Sans'",
    google: 'family=Work+Sans:wght@400;500;600;700',
  },
  {
    id: 'lora',
    name: 'Lora',
    note: 'Serif thanh lịch cho bài đọc dài',
    sans: "'Lora'",
    display: "'Lora'",
    google: 'family=Lora:wght@400;500;600;700',
  },
]

export const FONT_SCALES = [
  { id: 'md', name: 'Vừa (100%)', value: 1 },
  { id: 'lg', name: 'Lớn (108%)', value: 1.08 },
  { id: 'xl', name: 'Rất lớn (116%)', value: 1.16 },
]

export const defaultBackground = {
  image: null,
  blur: 0,
  overlay: 25,
  transparency: 55,
}

export const defaultAppearance = {
  paletteId: 'indigo',
  customColor: '#6366F1',
  fontId: 'inter',
  fontScale: 'md',
  background: defaultBackground,
}

/* ------------------------------------------------------------------ *
 * Nén ảnh tải lên an toàn (Canvas Offscreen)
 * ------------------------------------------------------------------ */

export const compressImageFile = (file, maxWidth = 1920, quality = 0.82) => {
  return new Promise((resolve, reject) => {
    if (!file || !file.type?.startsWith('image/')) {
      return reject(new Error('Vui lòng chọn một tệp hình ảnh hợp lệ (JPG, PNG, WEBP).'))
    }
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('Không thể đọc tệp hình ảnh.'))
    reader.onload = (event) => {
      const img = new Image()
      img.onerror = () => reject(new Error('Tệp hình ảnh bị hỏng hoặc không hỗ trợ.'))
      img.onload = () => {
        let width = img.width
        let height = img.height
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width)
          width = maxWidth
        }
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality)
        resolve(compressedDataUrl)
      }
      img.src = event.target.result
    }
    reader.readAsDataURL(file)
  })
}

/* ------------------------------------------------------------------ *
 * Đọc / Ghi / Chuẩn hóa / Áp dụng Appearance
 * ------------------------------------------------------------------ */

export const normalizeAppearance = (input) => {
  const paletteId = PALETTES.some((item) => item.id === input?.paletteId)
    ? input.paletteId
    : input?.paletteId === 'custom'
      ? 'custom'
      : defaultAppearance.paletteId
  const font = FONTS.find((item) => item.id === input?.fontId)
  const scale = FONT_SCALES.find((item) => item.id === input?.fontScale)

  const background = {
    image: typeof input?.background?.image === 'string' && input.background.image.trim() ? input.background.image : null,
    blur: typeof input?.background?.blur === 'number' ? clamp(input.background.blur, 0, 30) : defaultBackground.blur,
    overlay: typeof input?.background?.overlay === 'number' ? clamp(input.background.overlay, 0, 85) : defaultBackground.overlay,
    transparency: typeof input?.background?.transparency === 'number' ? clamp(input.background.transparency, 15, 95) : defaultBackground.transparency,
  }

  return {
    paletteId,
    customColor: normalizeHex(input?.customColor) || defaultAppearance.customColor,
    fontId: font ? font.id : defaultAppearance.fontId,
    fontScale: scale ? scale.id : defaultAppearance.fontScale,
    background,
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
    if (appearance?.background?.image) {
      try {
        const withoutImage = { ...appearance, background: { ...appearance.background, image: null } }
        localStorage.setItem(APPEARANCE_STORAGE_KEY, JSON.stringify(normalizeAppearance(withoutImage)))
      } catch {
        // bỏ qua
      }
    }
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

/** Nạp stylesheet của phông chữ đang chọn (chỉ tải khi cần). */
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
  root.style.setProperty('--accent-hex', resolved.colors.accent)
  root.style.setProperty('--accent-2-hex', resolved.colors.accent2)
  root.style.setProperty('--font-sans', resolved.font.sans)
  root.style.setProperty('--font-display', resolved.font.display)
  root.style.fontSize = resolved.scale.value === 1 ? '' : `${Math.round(resolved.scale.value * 100)}%`

  // Thiết lập biến nhìn xuyên và lớp nền
  const hasBg = Boolean(resolved.background?.image)
  root.classList.toggle('has-custom-bg', hasBg)
  root.style.setProperty('--panel-opacity', `${(resolved.background?.transparency ?? 55) / 100}`)
  root.style.setProperty('--bg-blur', `${resolved.background?.blur ?? 0}px`)
  root.style.setProperty('--bg-overlay', `${(resolved.background?.overlay ?? 25) / 100}`)

  ensureFontStylesheet(resolved.font)
  return resolved
}

/** Khởi động cài đặt giao diện trước khi React render để tránh giật/nháy giao diện. */
export const bootstrapAppearance = () => {
  applyThemeMode(readThemeMode())
  applyAppearance(readAppearance())
  if (typeof window === 'undefined' || window.__linguaAppearanceBound) return
  window.__linguaAppearanceBound = true
  window.addEventListener('storage', (event) => {
    if (event.key === APPEARANCE_STORAGE_KEY) applyAppearance(readAppearance())
    if (event.key === 'lingua-theme') applyThemeMode(readThemeMode())
  })
}
