import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: { port: 3000 },
  plugins: [react()],
  css: {
    modules: {
      // Включить CSS Modules для всех .css файлов
      scopeBehaviour: 'local'
    }
  }
})