import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '')
  // In dev: proxy /api → local backend (no CORS issues)
  // In production build: VITE_API_BASE_URL in .env.production points to Render
  const backendTarget = env.VITE_DEV_PROXY_TARGET || 'http://localhost:5000'

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api':     { target: backendTarget, changeOrigin: true, secure: false },
        '/uploads': { target: backendTarget, changeOrigin: true, secure: false },
      },
    },
  }
})
