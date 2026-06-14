import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  // GitHub 仓库名
  base: '/vue3-music-player/',

  // 打包输出到 docs 目录，方便 GitHub Pages 部署
  build: {
    outDir: 'docs'
  },

  plugins: [
    vue({
      template: {
        compilerOptions: {
          preserveWhitespace: false
        }
      }
    })
  ],

  server: {
    hmr: {
      overlay: false
    }
  }
})