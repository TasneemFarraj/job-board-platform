import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // The public Himalayas API doesn't send permissive CORS headers, so in
      // dev we proxy through Vite (server-to-server, no browser CORS rules)
      // rather than hitting himalayas.app directly from the browser.
      "/himalayas-api": {
        target: "https://himalayas.app",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/himalayas-api/, ""),
      },
    },
  },
})
