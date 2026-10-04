/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Thương hiệu & Nền thế hệ mới (Deep space & Pure clean)
        ink: '#0F172A',
        mist: '#F8FAFC',
        // Dynamic Accent
        sage: 'rgb(var(--accent-2, 99 102 241) / <alpha-value>)',
        lime: 'rgb(var(--accent, 16 185 129) / <alpha-value>)',
        // Bề mặt: Sáng (Apple Frost)
        slab: '#FFFFFF',
        slab2: '#F1F5F9',
        slab3: '#E2E8F0',
        // Bề mặt: Tối (Linear Deep Void)
        dark1: '#0B0F17',
        dark2: '#111827',
        dark3: '#1E293B',
        // Trạng thái hiện đại (Chất lượng cao)
        ok: '#10B981',
        okbg: '#ECFDF5',
        okdark: '#064E3B',
        okfgdark: '#6EE7B7',
        warn: '#F59E0B',
        warnbg: '#FFFBEB',
        danger: '#EF4444',
        dangerbg: '#FEF2F2',
        dangerdark: '#7F1D1D',
        dangerfgdark: '#FCA5A5',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'Inter', 'DM Sans', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'Space Grotesk', 'Inter', 'sans-serif'],
      },
      borderRadius: {
        md: '10px',
        lg: '12px',
        xl: '16px',
        '2xl': '22px',
        '3xl': '28px',
      },
      boxShadow: {
        soft: '0 10px 30px -5px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(0, 0, 0, 0.04)',
        raised: '0 4px 20px -2px rgba(0, 0, 0, 0.06), 0 0 0 1px rgba(0, 0, 0, 0.05)',
        glow: '0 0 25px -5px rgba(99, 102, 241, 0.35)',
        glowGreen: '0 0 25px -5px rgba(16, 185, 129, 0.35)',
        innerGlow: 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)',
      },
    },
  },
  plugins: [],
}
