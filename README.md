# 青年涟漪：故乡行动者

全媒体H5作品《青年涟漪：故乡行动者》- 展现新时代青年对社区的反哺与联结

## 项目简介

本项目是一个响应式、可交互的单页应用(SPA)，讲述多位城镇青年在家乡的公益实践故事。以陕西省乡村青年李富贵的"送餐"故事为切入点，平行展示其他城镇青年的公益实践。

## 技术栈

- **框架**: Vue 3.4+ (Composition API + `<script setup>`)
- **路由**: Vue Router 4
- **构建工具**: Vite
- **样式**: CSS3 (Flexbox/Grid布局，CSS Variables)
- **部署**: Vercel (推荐) / Netlify / GitHub Pages

## 项目结构

```
dazuoye/
├── public/
│   ├── images/          # 图片资源
│   │   ├── lifugui/    # 李富贵故事图片
│   │   └── sister/      # 王姐姐故事图片
│   └── videos/          # 视频资源
├── src/
│   ├── components/      # 组件
│   ├── views/          # 页面视图
│   │   ├── HomeView.vue      # 首页-地图索引
│   │   ├── StoryView.vue     # 故事章节页
│   │   └── AboutView.vue     # 聚合尾声页
│   ├── router/         # 路由配置
│   ├── data/           # 数据文件
│   │   └── stories.js  # 故事数据
│   ├── App.vue         # 根组件
│   ├── main.js         # 入口文件
│   └── style.css       # 全局样式
├── index.html
├── vite.config.js
└── package.json
```

## 开发指南

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

访问 http://localhost:3000

### 构建生产版本

```bash
npm run build
```

构建产物在 `dist` 目录

### 预览生产版本

```bash
npm run preview
```

## 部署指南

### 方式一：Vercel（推荐）

1. **将代码推送到 GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **在 Vercel 部署**
   - 访问 [vercel.com](https://vercel.com)
   - 使用 GitHub 账号登录
   - 点击 "Add New Project"
   - 选择你的仓库
   - Vercel 会自动检测 Vue 项目并配置
   - 点击 "Deploy"

3. **获取访问链接**
   - 部署成功后，Vercel 会提供一个 URL：`https://your-project-name.vercel.app`
   - 这个链接会长期有效，除非你删除项目
   - 每次推送代码到 GitHub，Vercel 会自动重新部署

### 方式二：Netlify

1. 将代码推送到 GitHub（同上）
2. 访问 [netlify.com](https://netlify.com)
3. 使用 GitHub 账号登录
4. 点击 "Add new site" -> "Import an existing project"
5. 选择你的仓库
6. 构建设置：
   - Build command: `npm run build`
   - Publish directory: `dist`
7. 点击 "Deploy site"

### 方式三：GitHub Pages

1. 安装 gh-pages：
   ```bash
   npm install -D gh-pages
   ```

2. 在 `package.json` 添加脚本：
   ```json
   "scripts": {
     "deploy": "npm run build && gh-pages -d dist"
   }
   ```

3. 在 `vite.config.js` 设置 base：
   ```js
   export default defineConfig({
     base: '/your-repo-name/',
     // ...
   })
   ```

4. 部署：
   ```bash
   npm run deploy
   ```

## 功能特性

- ✅ 响应式设计（手机、平板、桌面完美适配）
- ✅ 交互式地图导航
- ✅ 沉浸式滚动叙事
- ✅ 媒体画廊（图片/视频）
- ✅ 数据可视化动画
- ✅ 二维码生成与链接分享
- ✅ 路由导航

## 浏览器支持

- Chrome (最新版)
- Firefox (最新版)
- Safari (最新版)
- Edge (最新版)
- 移动端浏览器

## 许可证

ISC

## 联系方式

如有问题，请提交 Issue 或联系项目维护者。

