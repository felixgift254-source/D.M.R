import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'Digital Metabolic Reversal',
        short_name: 'DMR Tracker',
        description: 'T2D Reversal using the Personal Fat Threshold',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        runtimeCaching: [
          {
            // Never cache authentication endpoints
            urlPattern: /\/api\/auth\/.*/i,
            handler: 'NetworkOnly'
          },
          {
            // Cache data endpoints with NetworkFirst for offline support
            urlPattern: /\/api\/(?!auth).*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 7 // Cache for 1 week for offline usage
              },
              networkTimeoutSeconds: 5 // Fallback to cache quickly on poor networks
            }
          }
        ]
      }
    })
  ]
});
