import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/AttributionServiceFrontend",
  server: {
    port: 3000,
    proxy: {
      '/images': {
        target: 'http://192.168.1.67:9000', // Замените на ваш IP
        changeOrigin: true,
      },
      
      '/api': {
        target: 'http://192.168.1.67:8000', // Замените на ваш IP
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