import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mkcert from 'vite-plugin-mkcert'
import fs from 'fs';
import path from 'path';
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), mkcert()],
  base: "/AttributionServiceFrontend",
  server: {
    https:{
    key: fs.readFileSync(path.resolve(__dirname, 'cert.key')),
    cert: fs.readFileSync(path.resolve(__dirname, 'cert.crt')),
  },
    host: "0.0.0.0",
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