import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/AttributionServiceFrontend",
  server: {
    port:3000,
    proxy: {
       '/images': {  // Добавляем прокси для изображений
        target: 'http://localhost:9000',
        changeOrigin: true,
      },
      
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Received Response from Target:', proxyRes.statusCode, req.url);
          });
          
        },

        
      },
    },
  },
})