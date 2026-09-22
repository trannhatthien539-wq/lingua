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
  sm: { box: 'h-8 w-8 rounded-[10px]', glyph: 16 },
  md: { box: 'h-10 w-10 rounded-xl', glyph: 20 },
  lg: { box: 'h-12 w-12 rounded-2xl', glyph: 24 },
}

export default function NavIcon({ icon: Icon, color = '#58cc02', size = 'md', className = '' }) {
  const current = SIZES[size] || SIZES.md
  return (
    <span
      className={`grid shrink-0 place-items-center ${current.box} ${className}`}
      style={{
        backgroundColor: color,
        color: needsDarkGlyph(color) ? '#3c3c3c' : '#ffffff',
        boxShadow: 'inset 0 -3px 0 rgba(0,0,0,0.18)',
      }}
      aria-hidden="true"
    >
      <Icon size={current.glyph} strokeWidth={2.4} />
    </span>
  )
}
