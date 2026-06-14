import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  // 加上这一行！这里必须和你的仓库名完全一致
  base: '/vue3-music-player/',
  plugins: [
    vue({
      template: {
        compilerOptions: {
          // 忽略 VS Code 的标签闭合检查警告
          preserveWhitespace: false
        }
      }
    })
  ],
  server: {
    // 关闭浏览器上的错误弹窗
    hmr: {
      overlay: false
    }
  }
})