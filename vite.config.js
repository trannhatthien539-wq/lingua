import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: process.env.GITHUB_PAGES ? '/lingua/' : '/',
  build: {
    rollupOptions: {
      output: {
        /**
         * Tách Firebase và React khỏi gói chính để: (1) gói khởi động nhỏ hơn, (2) khi chỉ sửa
         * code ứng dụng thì trình duyệt không phải tải lại 2 vendor này (chúng có hash riêng).
         * Các thư viện nặng khác (xyflow, react-player, jszip, sql.js) vẫn do Rollup tự tách theo
         * lazy import — không gộp vào vendor để tránh tải sớm.
         */
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined
          if (/node_modules[\\/]@?firebase/.test(id)) return 'vendor-firebase'
          if (/node_modules[\\/](react|react-dom|react-router|react-router-dom|scheduler)[\\/]/.test(id)) return 'vendor-react'
          return undefined
        },
      },
    },
  },
})
