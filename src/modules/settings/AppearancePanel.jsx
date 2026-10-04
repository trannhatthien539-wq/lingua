import { useRef, useState } from 'react'
import {
  Check,
  Eye,
  Image as ImageIcon,
  MonitorSmartphone,
  Moon,
  Palette,
  RotateCcw,
  Sliders,
  Sun,
  Trash2,
  Type,
  Upload,
} from 'lucide-react'
import CollapsibleCard from '../../components/ui/CollapsibleCard'
import useAppearance from '../../hooks/useAppearance'
import useSectionState from '../../hooks/useSectionState'
import {
  FONTS,
  FONT_SCALES,
  PALETTES,
  THEME_MODES,
  WALLPAPER_PRESETS,
  resolveAppearance,
} from '../../services/appearanceService'
import { toast } from '../../services/toast'

const MODE_META = {
  light: { label: 'Sáng', icon: Sun },
  dark: { label: 'Tối', icon: Moon },
  system: { label: 'Theo hệ thống', icon: MonitorSmartphone },
}

const optionClass = (active) =>
  `flex min-h-[44px] items-center justify-center gap-2 rounded-xl border px-3 text-sm font-bold transition ${
    active
      ? 'border-indigo-500/40 bg-indigo-50/80 text-indigo-600 shadow-sm dark:border-indigo-400/40 dark:bg-indigo-500/15 dark:text-indigo-400'
      : 'border-slate-200/80 text-slate-700 hover:bg-slate-100/70 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/[0.05]'
  }`

export default function AppearancePanel({ themeMode, onThemeMode }) {
  const [open, toggleSection] = useSectionState('appearance', false)
  const fileInputRef = useRef(null)
  const [uploading, setUploading] = useState(false)

  const {
    appearance,
    setPalette,
    setCustomColor,
    setFont,
    setFontScale,
    setBackground,
    uploadCustomWallpaper,
    removeCustomWallpaper,
    resetAppearance,
  } = useAppearance()

  const activeFont = FONTS.find((font) => font.id === appearance.fontId) || FONTS[0]
  const resolved = resolveAppearance(appearance)
  const accentColor = resolved.colors.accent
  const background = appearance.background || { image: null, blur: 10, overlay: 70 }

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return
    try {
      setUploading(true)
      await uploadCustomWallpaper(file)
      toast.success('Đã tải lên và tối ưu ảnh nền thành công!')
    } catch (error) {
      toast.error(error.message || 'Không thể tải ảnh nền lên.')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handlePresetSelect = (preset) => {
    setBackground({ image: preset.url })
    toast.success(`Đã áp dụng ảnh nền: ${preset.name}`)
  }

  return (
    <CollapsibleCard
      id="settings-appearance"
      icon={Palette}
      eyebrow="Giao diện"
      title="Màu sắc, phông chữ & ảnh nền"
      description="Tuỳ chỉnh màu chủ đề toàn diện, tải ảnh nền riêng và hiệu ứng kính mờ"
      badge={
        <span className="hidden items-center gap-2 sm:flex">
          <span
            className="h-5 w-5 shrink-0 rounded-full border border-white/20 shadow-sm"
            style={{ background: accentColor }}
            aria-hidden="true"
          />
          <span className="chip bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-slate-300">
            {activeFont.name}
          </span>
        </span>
      }
      open={open}
      onToggle={toggleSection}
    >
      {/* 1. Chế độ sáng / tối */}
      <div className="mt-6">
        <p className="mb-2 text-xs font-bold text-slate-500 dark:text-slate-400">Chế độ hiển thị</p>
        <div className="grid grid-cols-3 gap-2" role="group" aria-label="Chế độ hiển thị">
          {THEME_MODES.map((mode) => {
            const meta = MODE_META[mode]
            const Icon = meta.icon
            const active = themeMode === mode
            return (
              <button
                key={mode}
                type="button"
                onClick={() => onThemeMode(mode)}
                aria-pressed={active}
                className={optionClass(active)}
              >
                <Icon size={16} />
                <span className="truncate">{meta.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* 2. Màu chủ đề toàn diện (Nâng cấp) */}
      <div className="mt-6 border-t border-slate-200/60 pt-6 dark:border-white/[0.08]">
        <div className="mb-2.5 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold text-slate-900 dark:text-white">Màu chủ đề toàn web</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Đồng bộ lên nút bấm, thanh tiến độ, quầng sáng và các phân hệ
            </p>
          </div>
          <span className="font-mono text-xs font-bold uppercase" style={{ color: accentColor }}>
            {accentColor}
          </span>
        </div>

        <div className="grid grid-cols-4 gap-2.5 sm:grid-cols-8" role="group" aria-label="Màu chủ đề">
          {PALETTES.slice(0, 8).map((palette) => {
            const active = appearance.paletteId === palette.id
            return (
              <button
                key={palette.id}
                type="button"
                onClick={() => setPalette(palette.id)}
                aria-pressed={active}
                aria-label={`Màu ${palette.name}`}
                title={palette.name}
                className={`relative flex h-12 flex-col items-center justify-center rounded-xl border p-1 transition-all duration-200 hover:scale-105 ${
                  active
                    ? 'border-white/40 ring-2 ring-indigo-500/50 shadow-md scale-105'
                    : 'border-white/10 opacity-90 hover:opacity-100'
                }`}
                style={{ background: `linear-gradient(135deg, ${palette.accent}, ${palette.accent2})` }}
              >
                {active && <Check size={18} className="text-white drop-shadow-md" strokeWidth={3} />}
              </button>
            )
          })}
        </div>

        {/* Bộ chọn màu tuỳ thích (Custom Hex Color Picker) */}
        <div className="mt-3 flex items-center gap-3">
          <label className="flex h-11 flex-1 cursor-pointer items-center gap-3 rounded-xl border border-slate-200/80 bg-slate-50/80 px-3.5 backdrop-blur-md transition hover:border-slate-300 dark:border-white/10 dark:bg-white/[0.04] dark:hover:border-white/20">
            <input
              type="color"
              value={appearance.customColor}
              onChange={(event) => setCustomColor(event.target.value)}
              aria-label="Chọn màu tuỳ thích"
              className="h-7 w-7 shrink-0 cursor-pointer rounded-lg border-0 bg-transparent p-0"
            />
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
              Màu tuỳ chọn linh hoạt
            </span>
            <span className="ml-auto font-mono text-xs font-bold uppercase text-slate-500 dark:text-slate-400">
              {appearance.customColor}
            </span>
          </label>
        </div>
      </div>

      {/* 3. Tải ảnh nền riêng & Hiệu ứng kính mờ (Tính năng mới) */}
      <div className="mt-6 border-t border-slate-200/60 pt-6 dark:border-white/[0.08]">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
              <ImageIcon size={15} style={{ color: accentColor }} /> Ảnh nền riêng & Kính mờ
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Tải ảnh từ máy hoặc chọn ảnh mẫu, các thẻ kính mờ sẽ nổi trên hình nền
            </p>
          </div>
          {background.image && (
            <button
              type="button"
              onClick={removeCustomWallpaper}
              className="inline-flex items-center gap-1.5 rounded-lg border border-rose-500/30 bg-rose-500/10 px-2.5 py-1 text-xs font-semibold text-rose-500 transition hover:bg-rose-500/20"
            >
              <Trash2 size={13} /> Xóa ảnh nền
            </button>
          )}
        </div>

        {/* Nút upload ảnh từ thiết bị */}
        <div className="mt-3.5">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
            id="custom-wallpaper-input"
          />
          <button
            type="button"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
            className="flex min-h-[48px] w-full items-center justify-center gap-2.5 rounded-xl border border-dashed border-indigo-400/40 bg-indigo-50/50 px-4 text-xs font-bold text-indigo-600 transition hover:bg-indigo-50 hover:border-indigo-500 active:scale-[0.99] disabled:opacity-50 dark:border-indigo-400/30 dark:bg-indigo-500/10 dark:text-indigo-400 dark:hover:bg-indigo-500/15"
          >
            <Upload size={16} />
            {uploading ? 'Đang nén và áp dụng ảnh...' : 'Tải ảnh từ thiết bị của bạn (JPG, PNG, WEBP)'}
          </button>
        </div>

        {/* Bộ sưu tập ảnh nền mẫu */}
        <div className="mt-4">
          <p className="mb-2 text-[11px] font-bold text-slate-500 dark:text-slate-400">Hoặc chọn ảnh nền mẫu:</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
            {WALLPAPER_PRESETS.map((preset) => {
              const active = background.image === preset.url
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handlePresetSelect(preset)}
                  className={`group relative h-20 overflow-hidden rounded-xl border transition-all ${
                    active
                      ? 'border-white ring-2 ring-indigo-500 shadow-lg scale-[1.02]'
                      : 'border-white/10 hover:border-white/30 opacity-80 hover:opacity-100'
                  }`}
                >
                  <img
                    src={preset.thumbnail}
                    alt={preset.name}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-1.5 flex flex-col justify-end">
                    <span className="truncate text-[10px] font-bold text-white">{preset.name}</span>
                  </div>
                  {active && (
                    <div className="absolute top-1.5 right-1.5 grid h-5 w-5 place-items-center rounded-full bg-indigo-600 text-white shadow-md">
                      <Check size={12} strokeWidth={3} />
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Tuỳ chỉnh Blur, Độ tối (Overlay) và Độ nhìn xuyên khi đã chọn ảnh */}
        {background.image && (
          <div className="mt-4 grid gap-3.5 rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4 backdrop-blur-xl dark:border-white/[0.08] dark:bg-white/[0.03] sm:grid-cols-3">
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                <span className="flex items-center gap-1.5"><Sliders size={13} /> Độ mờ ảnh (Blur)</span>
                <span className="font-mono text-indigo-500">{background.blur ?? 0}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="25"
                step="1"
                value={background.blur ?? 0}
                onChange={(event) => setBackground({ blur: Number(event.target.value) })}
                className="mt-2.5 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-indigo-500 dark:bg-white/10"
              />
              <span className="mt-1 block text-[10px] text-slate-400">0px = Nét căng gốc</span>
            </div>
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                <span className="flex items-center gap-1.5"><Moon size={13} /> Độ tối phủ nền</span>
                <span className="font-mono text-indigo-500">{background.overlay ?? 25}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="85"
                step="5"
                value={background.overlay ?? 25}
                onChange={(event) => setBackground({ overlay: Number(event.target.value) })}
                className="mt-2.5 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-indigo-500 dark:bg-white/10"
              />
              <span className="mt-1 block text-[10px] text-slate-400">Càng thấp càng sáng</span>
            </div>
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                <span className="flex items-center gap-1.5"><Eye size={13} /> Nhìn xuyên qua thẻ</span>
                <span className="font-mono text-indigo-500">{background.transparency ?? 55}%</span>
              </div>
              <input
                type="range"
                min="20"
                max="95"
                step="5"
                value={background.transparency ?? 55}
                onChange={(event) => setBackground({ transparency: Number(event.target.value) })}
                className="mt-2.5 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-indigo-500 dark:bg-white/10"
              />
              <span className="mt-1 block text-[10px] text-slate-400">Càng thấp càng trong suốt</span>
            </div>
          </div>
        )}
      </div>

      {/* 4. Phông chữ */}
      <div className="mt-6 border-t border-slate-200/60 pt-6 dark:border-white/[0.08]">
        <p className="mb-2 flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
          <Type size={14} style={{ color: accentColor }} /> Phông chữ
        </p>
        <div className="grid gap-2 sm:grid-cols-2" role="group" aria-label="Phông chữ">
          {FONTS.map((font) => {
            const active = appearance.fontId === font.id
            return (
              <button
                key={font.id}
                type="button"
                onClick={() => setFont(font.id)}
                aria-pressed={active}
                className={`flex min-h-[56px] items-center gap-3 rounded-xl border px-3 py-2 text-left transition ${
                  active
                    ? 'border-indigo-500/40 bg-indigo-50/80 dark:border-indigo-400/40 dark:bg-indigo-500/15'
                    : 'border-slate-200/70 hover:bg-slate-100/60 dark:border-white/10 dark:hover:bg-white/[0.04]'
                }`}
              >
                <span
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-slate-100 text-base font-bold dark:bg-white/10"
                  style={{ fontFamily: font.sans }}
                >
                  Aa
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-bold" style={{ fontFamily: font.sans }}>
                    {font.name}
                  </span>
                  <span className="block truncate text-xs text-slate-500 dark:text-slate-400">{font.note}</span>
                </span>
                {active && <Check size={17} className="ml-auto shrink-0 text-indigo-500" strokeWidth={3} />}
              </button>
            )
          })}
        </div>
      </div>

      {/* 5. Cỡ chữ */}
      <div className="mt-6 border-t border-slate-200/60 pt-6 dark:border-white/[0.08]">
        <p className="mb-2 text-xs font-bold text-slate-500 dark:text-slate-400">Cỡ chữ hiển thị</p>
        <div className="grid grid-cols-3 gap-2" role="group" aria-label="Cỡ chữ">
          {FONT_SCALES.map((scale) => (
            <button
              key={scale.id}
              type="button"
              onClick={() => setFontScale(scale.id)}
              aria-pressed={appearance.fontScale === scale.id}
              className={optionClass(appearance.fontScale === scale.id)}
            >
              {scale.name}
            </button>
          ))}
        </div>
      </div>

      {/* 6. Live Preview */}
      <div className="panel mt-6 p-4 border border-white/20 shadow-md">
        <p className="eyebrow" style={{ color: accentColor }}>Xem trước giao diện thực tế</p>
        <p className="mt-2 text-sm text-slate-800 dark:text-slate-200">
          Hôm nay bạn có <span className="font-bold" style={{ color: accentColor }}>12 từ vựng</span> cần ôn lại theo chu kỳ SRS.
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2.5">
          <span className="chip-brand">Đang áp dụng</span>
          <span className="chip border border-slate-200 bg-white/50 text-slate-700 dark:border-white/10 dark:bg-white/10 dark:text-white">
            Phông: {activeFont.name}
          </span>
          <button type="button" className="btn-primary">
            Nút học thử nghiệm
          </button>
        </div>
      </div>

      {/* Footer đặt lại mặc định */}
      <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-200/80 pt-4 dark:border-white/[0.08]">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Chủ đề: <span className="font-bold text-slate-800 dark:text-slate-200">{resolved.colors.accent}</span>
        </p>
        <button type="button" onClick={resetAppearance} className="btn-ghost">
          <RotateCcw size={15} /> Đặt lại mặc định ban đầu
        </button>
      </div>
    </CollapsibleCard>
  )
}
