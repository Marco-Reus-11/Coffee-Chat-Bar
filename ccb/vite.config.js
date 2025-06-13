import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())

  return {
    plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => tag.startsWith('emoji-')
        }
      }
    })
  ],

    server: {
      host: '0.0.0.0',
      port: 5173,
      open: true,

      proxy: {
        '/socket.io': {
          target: env.VITE_BASE_URL,
          ws: true,
          changeOrigin: true
        }
      }
    }
  }
})
