import { defineConfig } from 'vite'
import path from 'path'
import vue from '@vitejs/plugin-vue'
const pathSrc = path.resolve(__dirname, 'src') 

export default defineConfig({
  base: "./",

  resolve: {
    alias: {
      '@': pathSrc, // 文件系统路径别名
    }
  },
  plugins: [
    vue(),
  ],
})
