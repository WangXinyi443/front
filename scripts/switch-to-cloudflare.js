#!/usr/bin/env node
/**
 * 切换到 Cloudflare Pages 配置的脚本
 * 使用方法: node scripts/switch-to-cloudflare.js
 */

import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')

async function switchToCloudflare() {
  try {
    console.log('🔄 切换到 Cloudflare Pages 配置...\n')

    // 读取 vite.config.js
    const viteConfigPath = path.join(rootDir, 'vite.config.js')
    let viteConfig = await fs.readFile(viteConfigPath, 'utf-8')

    // 替换 base 路径
    const oldBase = "base: '/front/', // GitHub Pages 子路径部署"
    const newBase = "base: '/', // Cloudflare Pages 根路径部署"
    
    if (viteConfig.includes("base: '/front/'")) {
      viteConfig = viteConfig.replace(
        /base:\s*['"]\/front\/['"],?\s*\/\/.*/,
        newBase
      )
      await fs.writeFile(viteConfigPath, viteConfig, 'utf-8')
      console.log('✅ 已更新 vite.config.js: base 改为 "/"')
    } else {
      console.log('ℹ️  vite.config.js 中的 base 已经是 "/" 或已配置')
    }

    console.log('\n✨ 配置切换完成！')
    console.log('\n📋 下一步：')
    console.log('1. 访问 https://dash.cloudflare.com')
    console.log('2. 点击 "Workers & Pages" → "Create application" → "Pages"')
    console.log('3. 连接 GitHub 仓库')
    console.log('4. 配置构建设置：')
    console.log('   - Build command: npm run build')
    console.log('   - Build output directory: dist')
    console.log('5. 点击 "Save and Deploy"')
    console.log('\n📖 详细文档：查看 CLOUDFLARE_DEPLOY.md')
  } catch (error) {
    console.error('❌ 切换失败:', error.message)
    process.exit(1)
  }
}

switchToCloudflare()











