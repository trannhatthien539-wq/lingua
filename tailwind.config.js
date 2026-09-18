/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Thương hiệu
        ink: '#18201d',
        mist: '#f6f7f5',
        sage: '#86a98f',
        lime: '#d9f06d',
        // Bề mặt: sáng
        slab: '#ffffff',
        slab2: '#f1f3ef',
        slab3: '#e8ebe6',
        // Bề mặt: tối
        dark1: '#141917',
        dark2: '#1b211f',
        dark3: '#242b28',
        // Trạng thái
        ok: '#3f6b4b',
        okbg: '#e7f2e9',
        okdark: '#22322a',
        okfgdark: '#a9d5af',
        warn: '#8a5a12',
        warnbg: '#fdf1de',
        danger: '#b4423a',
        dangerbg: '#fdeceb',
        dangerdark: '#3b2321',
        dangerfgdark: '#f2a9a3',
      },
      fontFamily: {
        sans: ['DM Sans', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'DM Sans', 'sans-serif'],
      },
      // Một thang bán kính duy nhất: 10 / 14 / 20 / 24 + pill
      borderRadius: {
        md: '10px',
        lg: '10px',
        xl: '14px',
        '2xl': '20px',
        '3xl': '24px',
      },
      boxShadow: {
        soft: '0 8px 28px rgba(24, 32, 29, 0.07)',
        raised: '0 1px 2px rgba(24, 32, 29, 0.04), 0 1px 10px rgba(24, 32, 29, 0.05)',
      },
    },
  },
  plugins: [],
}
