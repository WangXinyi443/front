# GitHub 与 Cloudflare Pages 关联方式详解

## 🎯 两种关联方式

GitHub 与 Cloudflare Pages 有两种关联方式，我们使用的是**方式二**。

---

## 方式一：Cloudflare Pages 直接连接 GitHub（Git 连接）

### 工作原理

1. **在 Cloudflare Dashboard 中连接 GitHub 仓库**
   - Cloudflare Pages 直接访问你的 GitHub 仓库
   - 当代码推送到指定分支时，Cloudflare 自动触发构建和部署

2. **构建流程**
   ```
   GitHub 推送代码 
   → Cloudflare 检测到变化 
   → Cloudflare 自动拉取代码 
   → Cloudflare 执行构建命令（npm run build）
   → Cloudflare 部署 dist 目录
   ```

3. **优点**
   - ✅ 配置简单，在 Cloudflare Dashboard 中一键连接
   - ✅ 自动触发，推送代码即自动部署
   - ✅ 不需要 GitHub Actions

4. **缺点**
   - ❌ 需要在 Cloudflare Dashboard 配置构建命令
   - ❌ 构建在 Cloudflare 服务器上进行，可能较慢
   - ❌ 如果构建失败，需要到 Cloudflare Dashboard 查看日志

---

## 方式二：GitHub Actions 部署到 Cloudflare Pages（当前方案）

### 工作原理

1. **GitHub Actions 工作流**
   - 当代码推送到 GitHub 时，GitHub Actions 自动运行
   - 在 GitHub 的服务器上构建项目（npm run build）
   - 将构建产物（dist 目录）上传到 Cloudflare Pages

2. **构建流程**
   ```
   GitHub 推送代码 
   → GitHub Actions 触发 
   → GitHub 服务器拉取代码 
   → GitHub 服务器执行构建（npm run build）
   → GitHub Actions 将 dist 目录上传到 Cloudflare Pages
   → Cloudflare Pages 部署
   ```

3. **优点**
   - ✅ 构建在 GitHub 服务器上进行，通常更快
   - ✅ 可以在 GitHub Actions 中查看详细的构建日志
   - ✅ 可以添加更多的构建步骤（如测试、代码检查等）
   - ✅ 不需要在 Cloudflare Dashboard 配置构建命令
   - ✅ 更灵活，可以控制整个构建和部署流程

4. **缺点**
   - ❌ 需要配置 GitHub Actions 工作流文件
   - ❌ 需要设置 GitHub Secrets（API Token 和 Account ID）

---

## 📋 当前项目的配置

### GitHub Actions 工作流配置

文件：`.github/workflows/deploy-cloudflare.yml`

```yaml
name: Deploy to Cloudflare Pages

on:
  push:
    branches:
      - main
      - master  # 你的代码在这个分支
  workflow_dispatch:  # 可以手动触发

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4  # 拉取代码
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci  # 安装依赖
      
      - name: Build
        run: npm run build  # 构建项目，生成 dist 目录
      
      - name: Deploy to Cloudflare Pages
        uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}  # 使用 GitHub Secret
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}  # 使用 GitHub Secret
          projectName: front  # Cloudflare Pages 项目名
          directory: dist  # 要部署的目录
```

### GitHub Secrets 配置

在 GitHub 仓库中设置：
- `CLOUDFLARE_API_TOKEN`：Cloudflare API Token（用于认证）
- `CLOUDFLARE_ACCOUNT_ID`：Cloudflare Account ID（用于识别账户）

### Cloudflare Pages 项目配置

- **项目名**：`front`
- **域名**：`front-6ew.pages.dev`
- **部署方式**：通过 GitHub Actions API 上传（不是 Git 连接）

---

## 🔄 完整部署流程

### 当你推送代码时：

1. **本地推送代码**
   ```bash
   git push origin master
   ```

2. **GitHub 接收推送**
   - GitHub 检测到 `master` 分支有新的提交
   - 触发 GitHub Actions 工作流

3. **GitHub Actions 运行**
   - 在 GitHub 服务器上拉取代码
   - 安装 Node.js 和依赖
   - 执行 `npm run build` 构建项目
   - 生成 `dist` 目录

4. **部署到 Cloudflare Pages**
   - 使用 Cloudflare API Token 认证
   - 将 `dist` 目录上传到 Cloudflare Pages 项目 `front`
   - Cloudflare Pages 自动部署

5. **网站更新**
   - 部署完成后，网站 `https://front-6ew.pages.dev` 自动更新
   - 通常需要 1-2 分钟

---

## 🎯 关键概念

### 1. GitHub Actions
- GitHub 提供的 CI/CD 服务
- 通过 `.github/workflows/` 目录下的 YAML 文件配置
- 当满足触发条件时（如推送代码），自动运行

### 2. GitHub Secrets
- 用于存储敏感信息（如 API Token）
- 在 GitHub 仓库的 Settings → Secrets and variables → Actions 中设置
- 在工作流中通过 `${{ secrets.NAME }}` 使用

### 3. Cloudflare Pages API
- Cloudflare 提供的 API，用于上传和部署网站
- 需要 API Token 和 Account ID 进行认证
- `cloudflare/pages-action` 是封装好的 GitHub Actions，简化了使用

### 4. 项目名匹配
- GitHub Actions 中的 `projectName: front` 必须与 Cloudflare Pages 中的项目名完全一致
- 如果项目名不匹配，会报错 "Project not found"

---

## 📝 总结

**当前方案（GitHub Actions）：**
- ✅ 构建在 GitHub 服务器上进行
- ✅ 部署通过 Cloudflare API 上传
- ✅ 不需要在 Cloudflare Dashboard 连接 Git
- ✅ 更灵活，可以控制整个流程

**如果使用 Git 连接：**
- 构建在 Cloudflare 服务器上进行
- 需要在 Cloudflare Dashboard 配置构建命令
- 更简单，但灵活性较低

---

## 🔧 常用操作

### 查看部署状态
- **GitHub Actions**：https://github.com/WangXinyi443/front/actions
- **Cloudflare Dashboard**：https://dash.cloudflare.com/pages

### 手动触发部署
- 在 GitHub Actions 页面点击 "Run workflow"

### 查看部署日志
- GitHub Actions：点击运行记录查看详细日志
- Cloudflare Dashboard：在 Deployments 标签查看部署记录


