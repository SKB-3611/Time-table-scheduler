import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,  // Optional: Change to your desired port
  },
  build: {
    outDir: 'dist',
  },
  base: '/',   // Ensure base path is correctly set
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  // Fix 404 on refresh issue
  esbuild: {
    define: {
      global: 'window'
    }
  }
})
