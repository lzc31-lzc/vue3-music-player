import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
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