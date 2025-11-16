import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173, // ✅ Puerto de Vite (diferente a Reverb)
    hmr: {
      port: 5174, // ✅ Puerto de HMR (diferente a Vite y Reverb)
      host: 'localhost',
      protocol: 'ws'
    }
  }
})
