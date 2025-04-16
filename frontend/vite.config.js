import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "./src/app.css";`,
      },
    },
  },
  server: {
    host: '0.0.0.0',
    port: 5173, // Optional: you can change this if needed
  },
})
