# 快速启动指南

## 🚀 立即开始

### 1. 安装依赖
```bash
npm install
```

### 2. 启动开发服务器
```bash
npm run dev
```

访问 http://localhost:3000 查看项目

### 3. 构建生产版本
```bash
npm run build
```

### 4. 预览生产版本
```bash
npm run preview
```

---

## 📁 项目结构说明

```
dazuoye/
├── public/                    # 静态资源目录
│   ├── images/
│   │   ├── lifugui/          # 李富贵故事图片（已处理）
│   │   └── sister/            # 王姐姐故事图片（已处理）
│   └── videos/
│       └── lifugui/          # 视频资源
├── src/
│   ├── views/                # 页面视图
│   │   ├── HomeView.vue     # 首页（地图索引）
│   │   ├── StoryView.vue    # 故事页（滚动叙事）
│   │   └── AboutView.vue    # 关于页（聚合尾声）
│   ├── data/
│   │   └── stories.js       # 故事数据配置
│   ├── router/              # 路由配置
│   └── style.css            # 全局样式
└── vercel.json              # Vercel 部署配置
```

---

## 🎨 已实现的功能

✅ **首页地图导航**
- 交互式地图背景
- 涟漪动画热点标记
- 点击跳转到故事页

✅ **故事章节页**
- 沉浸式滚动叙事
- 文本图片布局
- 媒体画廊（图片/视频）
- 人物心声展示
- 章节导航

✅ **关于页**
- 青年群像墙
- 数据看板（数字动画）
- 创作团队介绍
- 二维码生成
- 链接分享

✅ **响应式设计**
- 完美适配手机、平板、桌面
- 媒体查询断点优化

---

## 🖼️ 图片素材处理

所有图片已从 `image/` 文件夹分类处理：

**李富贵故事** (`public/images/lifugui/`):
- cover.jpg - 封面图
- section1.jpg - 章节1图片
- step1.jpg ~ step5.jpg - 送餐步骤图片

**王姐姐故事** (`public/images/sister/`):
- cover.jpg - 封面图
- shop.jpg - 理发店
- haircut1.jpg, haircut2.jpg - 义剪现场
- meal.jpg - 共餐场景
- group.jpg - 团队合照

**视频** (`public/videos/lifugui/`):
- cooking.mp4 - 烹饪过程视频

---

## 🌐 部署获取外网链接

详细步骤请查看 `DEPLOY.md` 文件。

**快速部署（Vercel）：**

1. 将代码推送到 GitHub
2. 访问 https://vercel.com
3. 用 GitHub 登录
4. 导入项目
5. 点击部署
6. 获得链接：`https://your-project.vercel.app`

---

## 📝 修改内容

### 修改故事内容
编辑 `src/data/stories.js` 文件

### 修改样式
编辑 `src/style.css` 或各组件内的 `<style>` 标签

### 添加新故事
在 `src/data/stories.js` 的 `stories` 数组中添加新对象

### 更换图片
将新图片放入对应的 `public/images/` 目录，更新数据文件中的路径

---

## ⚠️ 注意事项

1. **Node 版本**: 项目使用 Vite 5，需要 Node.js 18+（推荐 20+）
2. **图片路径**: 所有图片路径使用 `/images/...` 格式（相对于 public 目录）
3. **路由模式**: 使用 History 模式，部署时需要配置 SPA 重定向（已配置在 vercel.json）
4. **视频格式**: 建议使用 MP4 格式，确保浏览器兼容性

---

## 🐛 问题排查

### 开发服务器无法启动
- 检查 Node 版本：`node --version`（需要 18+）
- 删除 `node_modules` 和 `package-lock.json`，重新 `npm install`

### 图片不显示
- 确认图片在 `public/images/` 目录下
- 检查路径是否正确（使用 `/images/...` 而不是 `./images/...`）

### 路由跳转 404
- 确认已配置 SPA 重定向（vercel.json 已配置）
- 检查路由配置是否正确

---

## 📞 需要帮助？

查看详细文档：
- `README.md` - 项目说明
- `DEPLOY.md` - 部署指南

祝开发顺利！🎉

