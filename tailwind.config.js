/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ink: '#18201d',
        mist: '#f6f7f5',
        sage: '#86a98f',
        lime: '#d9f06d',
      },
      fontFamily: {
        sans: ['DM Sans', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'DM Sans', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 12px 40px rgba(24, 32, 29, 0.08)',
      },
    },
  },
  plugins: [],
}
