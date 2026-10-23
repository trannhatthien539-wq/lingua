import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: process.env.GITHUB_PAGES ? '/lingua/' : '/',
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        /**
         * Tách Firebase, React và icons khỏi gói chính để: (1) gói khởi động nhỏ hơn,
         * (2) tải song song qua HTTP/2 trên mạng di động, (3) trình duyệt tận dụng cache dài hạn.
         */
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined
          if (/node_modules[\\/]@?firebase[\\/](app|auth)/.test(id)) return 'vendor-firebase-auth'
          if (/node_modules[\\/]@?firebase[\\/]firestore/.test(id)) return 'vendor-firebase-db'
          if (/node_modules[\\/]@?firebase/.test(id)) return 'vendor-firebase'
          if (/node_modules[\\/](react|react-dom|react-router|react-router-dom|scheduler)[\\/]/.test(id)) return 'vendor-react'
          if (/node_modules[\\/]lucide-react/.test(id)) return 'vendor-icons'
          return undefined
        },
      },
    },
  },
})
