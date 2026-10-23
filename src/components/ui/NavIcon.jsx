/**
 * Icon nhiều màu kiểu Duolingo: một ô bo tròn nền đặc theo màu nhận diện của tab,
 * glyph bên trong màu trắng (tự đổi sang màu tối nếu nền quá sáng) và một vệt
 * bóng đậm ở mép dưới để ô trông “nổi” như nút bấm.
 *
 * Tailwind không sinh class động nên màu truyền qua style inline.
 */


const SIZES = {
  sm: { box: 'h-8 w-8 rounded-xl', glyph: 15 },
  md: { box: 'h-10 w-10 rounded-xl', glyph: 19 },
  lg: { box: 'h-12 w-12 rounded-2xl', glyph: 23 },
}

export default function NavIcon({ icon: Icon, color = '#4F46E5', darkColor = color, size = 'md', active = false, className = '' }) {
  const current = SIZES[size] || SIZES.md
  const tone = { '--tone': color, '--tone-dark': darkColor }
  return (
    <span
      className={`relative grid shrink-0 place-items-center border backdrop-blur-md transition-all duration-200 ${current.box} ${active ? '' : 'tone-text'} ${className}`}
      style={
        active
          ? {
              background: 'linear-gradient(135deg, rgb(var(--accent)), rgb(var(--accent-2)))',
              color: '#FFFFFF',
              borderColor: 'rgba(255,255,255,0.4)',
              boxShadow: '0 4px 14px -2px rgba(var(--accent), 0.4), inset 0 1px 1px 0 rgba(255,255,255,0.45)',
            }
          : {
              ...tone,
              backgroundColor: `${color}14`,
              borderColor: `${color}28`,
              boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.06)',
            }
      }
      aria-hidden="true"
    >
      <Icon size={current.glyph} strokeWidth={2.2} />
    </span>
  )
}
