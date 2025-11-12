import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

const basePath = process.env.VITE_PUBLIC_BASE_PATH || '/';

export default defineConfig({
  base: basePath,
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8888',
        changeOrigin: true,
      },
    },
  },
})
