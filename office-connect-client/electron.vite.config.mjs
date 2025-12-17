import { resolve } from 'path'
import { defineConfig } from 'electron-vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  main: {},
  preload: {},
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src')
      }
    },
    plugins: [react(), tailwindcss()]
  },
  server: {
  proxy: {
    '/api': {
      target: 'http://192.168.1.3:5171',
      changeOrigin: true,
      secure: false
    }
  }
}
})
