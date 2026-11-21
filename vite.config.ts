import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import path from 'node:path'
import { defineConfig } from 'vite'

const host = process.env.TAURI_DEV_HOST
const src = (dir = '') => path.resolve(import.meta.dirname, 'src', dir)

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      '@': src(),
      '@views': src('views'),
      '@components': src('components'),
      '@composables': src('composables'),
      '@utils': src('utils'),
      '@models': src('types'),
      '@stores': src('stores'),
    },
  },
  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  // 1. prevent Vite from obscuring rust errors
  clearScreen: false,
  // 2. tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
    strictPort: true,
    host: host || false,
    hmr: host ? { protocol: 'ws', host, port: 1421 } : undefined,
    // 3. tell Vite to ignore watching `src-tauri`
    watch: { ignored: ['**/src-tauri/**'] },
  },
  build: {
    // Tauri ships a modern WebView (WebView2 / WebKit)
    target: 'es2022',
    sourcemap: true,
    // Desktop app loaded from disk – a single larger vendor bundle is fine
    chunkSizeWarningLimit: 2000,
  },
})
