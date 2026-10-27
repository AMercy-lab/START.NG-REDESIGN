import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// /sng/* is forwarded to api.start.ng so the page can read live public data
// without CORS. vercel.json does the same in production.
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/sng': {
        target: 'https://api.start.ng',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/sng/, ''),
      },
    },
  },
})
