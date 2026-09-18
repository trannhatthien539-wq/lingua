import { Check, MonitorSmartphone, Moon, Palette, RotateCcw, Sun, Type } from 'lucide-react'
import CollapsibleCard from '../../components/ui/CollapsibleCard'
import useAppearance from '../../hooks/useAppearance'
import useSectionState from '../../hooks/useSectionState'
import { FONTS, FONT_SCALES, PALETTES, THEME_MODES, resolveAppearance } from '../../services/appearanceService'

const MODE_META = {
  light: { label: 'Sáng', icon: Sun },
  dark: { label: 'Tối', icon: Moon },
  system: { label: 'Theo hệ thống', icon: MonitorSmartphone },
}

const optionClass = (active) =>
  `flex min-h-[44px] items-center justify-center gap-2 rounded-xl border px-3 text-sm font-bold transition ${
    active
      ? 'border-sage bg-sage/15 text-ink dark:text-white'
      : 'border-ink/10 text-ink/70 hover:bg-ink/[0.05] dark:border-white/15 dark:text-white/70 dark:hover:bg-white/10'
  }`

/**
 * Khu vực "Màu sắc & Phông chữ" trong trang Cài đặt.
 * Màu và phông chữ được lưu theo thiết bị (giống chế độ sáng/tối).
 */
export default function AppearancePanel({ themeMode, onThemeMode }) {
  const [open, toggleSection] = useSectionState('appearance', false)
  const { appearance, setPalette, setCustomColor, setFont, setFontScale, resetAppearance } = useAppearance()
  const activeFont = FONTS.find((font) => font.id === appearance.fontId) || FONTS[0]
  const accentColor = resolveAppearance(appearance).colors.accent

  return (
    <CollapsibleCard
      id="settings-appearance"
      icon={Palette}
      eyebrow="Giao diện"
      title="Màu sắc & phông chữ"
      description="Chế độ sáng tối, màu chủ đề, phông chữ và cỡ chữ"
      badge={
        <span className="hidden items-center gap-2 sm:flex">
          <span className="h-5 w-5 shrink-0 rounded-full border border-ink/15 dark:border-white/25" style={{ background: accentColor }} aria-hidden="true" />
          <span className="chip bg-ink/[0.06] text-ink/70 dark:bg-white/10 dark:text-white/70">{activeFont.name}</span>
        </span>
      }
      open={open}
      onToggle={toggleSection}
    >

      {/* Chế độ sáng / tối */}
      <div className="mt-6">
        <p className="mb-2 text-xs font-bold text-ink/60 dark:text-white/60">Chế độ hiển thị</p>
        <div className="grid grid-cols-3 gap-2" role="group" aria-label="Chế độ hiển thị">
          {THEME_MODES.map((mode) => {
            const meta = MODE_META[mode]
            const Icon = meta.icon
            return (
              <button
                key={mode}
                type="button"
                onClick={() => onThemeMode(mode)}
                aria-pressed={themeMode === mode}
                className={optionClass(themeMode === mode)}
              >
                <Icon size={16} />
                <span className="truncate">{meta.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Màu chủ đề */}
      <div className="mt-6">
        <div className="mb-2 flex items-center justify-between gap-3">
          <p className="text-xs font-bold text-ink/60 dark:text-white/60">Màu chủ đề</p>
          <p className="text-xs text-ink/60 dark:text-white/60">Tự cân độ sáng để chữ luôn rõ</p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5" role="group" aria-label="Màu chủ đề">
          {PALETTES.map((palette) => {
            const active = appearance.paletteId === palette.id
            return (
              <button
                key={palette.id}
                type="button"
                onClick={() => setPalette(palette.id)}
                aria-pressed={active}
                aria-label={`Màu ${palette.name}`}
                title={palette.name}
                className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl border transition ${
                  active ? 'border-ink/25 ring-2 ring-ink/20 dark:border-white/40 dark:ring-white/25' : 'border-ink/10 hover:scale-[1.05] dark:border-white/15'
                }`}
                style={{ background: palette.accent }}
              >
                {active && <Check size={18} className="text-ink" strokeWidth={3} />}
              </button>
            )
          })}
          <label
            className={`flex h-11 min-w-[132px] cursor-pointer items-center gap-2 rounded-xl border px-3 text-xs font-bold transition ${
              appearance.paletteId === 'custom'
                ? 'border-sage bg-sage/15 text-ink dark:text-white'
                : 'border-ink/10 text-ink/70 hover:bg-ink/[0.05] dark:border-white/15 dark:text-white/70 dark:hover:bg-white/10'
            }`}
          >
            <input
              type="color"
              value={appearance.customColor}
              onChange={(event) => setCustomColor(event.target.value)}
              aria-label="Chọn màu tuỳ thích"
              className="h-7 w-7 shrink-0 cursor-pointer rounded-lg border border-ink/15 bg-transparent p-0 dark:border-white/20"
            />
            <span className="truncate">Màu tuỳ chọn</span>
            <span className="ml-auto font-mono text-[11px] uppercase text-ink/60 dark:text-white/60">{appearance.customColor}</span>
          </label>
        </div>
      </div>

      {/* Phông chữ */}
      <div className="mt-6">
        <p className="mb-2 flex items-center gap-2 text-xs font-bold text-ink/60 dark:text-white/60">
          <Type size={14} /> Phông chữ
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
                className={`flex min-h-[56px] items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition ${
                  active
                    ? 'border-sage bg-sage/15'
                    : 'border-ink/10 hover:bg-ink/[0.05] dark:border-white/15 dark:hover:bg-white/10'
                }`}
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-ink/[0.06] text-base font-bold dark:bg-white/10" style={{ fontFamily: font.sans }}>
                  Aa
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-bold" style={{ fontFamily: font.sans }}>
                    {font.name}
                  </span>
                  <span className="block truncate text-xs text-ink/60 dark:text-white/60">{font.note}</span>
                </span>
                {active && <Check size={17} className="ml-auto shrink-0 text-sage" strokeWidth={3} />}
              </button>
            )
          })}
        </div>
      </div>

      {/* Cỡ chữ */}
      <div className="mt-6">
        <p className="mb-2 text-xs font-bold text-ink/60 dark:text-white/60">Cỡ chữ</p>
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

      {/* Xem trước */}
      <div className="panel-flat mt-6 p-4">
        <p className="eyebrow">Xem trước</p>
        <p className="mt-2 text-sm text-ink/80 dark:text-white/80">
          Hôm nay bạn có <span className="font-bold text-sage">12 từ</span> cần ôn lại.
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="chip bg-lime text-ink">Đang học</span>
          <span className="chip bg-sage/20 text-ink dark:text-white">Ôn tập</span>
          <button type="button" className="btn-primary">
            Bắt đầu học
          </button>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between gap-3 border-t border-ink/[0.08] pt-5 dark:border-white/[0.08]">
        <p className="text-xs text-ink/60 dark:text-white/60">
          Đang dùng: <span className="font-bold">{activeFont.name}</span>
        </p>
        <button type="button" onClick={resetAppearance} className="btn-ghost">
          <RotateCcw size={15} /> Đặt lại mặc định
        </button>
      </div>
    </CollapsibleCard>
  )
}
