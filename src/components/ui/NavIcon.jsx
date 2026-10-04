/**
 * Icon nhiều màu kiểu Duolingo: một ô bo tròn nền đặc theo màu nhận diện của tab,
 * glyph bên trong màu trắng (tự đổi sang màu tối nếu nền quá sáng) và một vệt
 * bóng đậm ở mép dưới để ô trông “nổi” như nút bấm.
 *
 * Tailwind không sinh class động nên màu truyền qua style inline.
 */

/** Nền sáng quá thì glyph phải là màu tối, nếu không sẽ khó đọc. */
const needsDarkGlyph = (hex) => {
  const value = String(hex).replace('#', '')
  if (value.length !== 6) return false
  const red = parseInt(value.slice(0, 2), 16)
  const green = parseInt(value.slice(2, 4), 16)
  const blue = parseInt(value.slice(4, 6), 16)
  return 0.299 * red + 0.587 * green + 0.114 * blue > 186
}

const SIZES = {
  sm: { box: 'h-8 w-8 rounded-xl', glyph: 15 },
  md: { box: 'h-10 w-10 rounded-xl', glyph: 19 },
  lg: { box: 'h-12 w-12 rounded-2xl', glyph: 23 },
}

export default function NavIcon({ icon: Icon, color = '#6366F1', size = 'md', active = false, className = '' }) {
  const current = SIZES[size] || SIZES.md
  return (
    <span
      className={`relative grid shrink-0 place-items-center border backdrop-blur-md transition-all duration-200 ${current.box} ${className}`}
      style={
        active
          ? {
              background: `linear-gradient(135deg, ${color}, ${color}ee)`,
              color: needsDarkGlyph(color) ? '#0F172A' : '#FFFFFF',
              borderColor: 'rgba(255,255,255,0.35)',
              boxShadow: `0 4px 16px -2px ${color}66, inset 0 1px 1px 0 rgba(255,255,255,0.45)`,
            }
          : {
              backgroundColor: `${color}18`,
              borderColor: `${color}35`,
              color: color,
              boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.08)',
            }
      }
      aria-hidden="true"
    >
      <Icon size={current.glyph} strokeWidth={2.2} />
    </span>
  )
}
