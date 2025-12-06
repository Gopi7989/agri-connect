import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa'; // <--- 1. Import the plugin

export default defineConfig({
  plugins: [
    react(),
    // <--- 2. Add the PWA configuration block
    VitePWA({
      registerType: 'autoUpdate', // Apps update automatically when you deploy new code
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      devOptions: {
        enabled: true // Allows you to test the PWA in "npm run dev" mode
      },
      manifest: {
        name: 'Agri-Connect Marketplace', // Full name on splash screen
        short_name: 'Agri-Connect',      // Name under the app icon
        description: 'Connect directly with buyers and get fair prices.',
        theme_color: '#2E7D32',          // Matches your green Navbar
        background_color: '#ffffff',
        display: 'standalone',           // Removes the browser URL bar so it looks like an app
        orientation: 'portrait',
        icons: [
          {
            src: 'pwa-64x64.png',
            sizes: '64x64',
            type: 'image/png'
          },
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
      }
    })
  ],
  // Keep the dedupe setting we added earlier to prevent React errors
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
  // Ensure public folder files (including _redirects) are copied to dist
  publicDir: 'public',
});