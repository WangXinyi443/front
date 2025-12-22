// Cloudflare Pages 专用配置
// 使用方法：将 vite.config.js 的内容替换为此文件的内容

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  base: '/', // Cloudflare Pages 部署在根路径
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    port: 3000,
    open: true,
    host: '0.0.0.0',
    strictPort: false
  },
  preview: {
    port: 4173,
    host: '0.0.0.0',
    open: true
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    commonjsOptions: {
      transformMixedEsModules: true
    }
  },
  optimizeDeps: {
    include: ['vue', 'vue-router']
  }
})






