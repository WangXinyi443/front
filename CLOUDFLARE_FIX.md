# Cloudflare Pages 构建失败修复指南

## 🔍 问题诊断

从你的截图看到：
- Cloudflare Pages 项目名是：**"front"**
- 但 GitHub Actions 配置的项目名是：**"dazuoye"**
- 构建失败，显示来自 "main" 分支

## ✅ 解决方案

### 方案一：修改 Cloudflare Pages 项目设置（推荐）

#### 1. 修改项目名或分支设置

1. **进入 Cloudflare Pages 项目**
   - 访问：https://dash.cloudflare.com
   - 点击左侧 "Workers & Pages"
   - 找到项目 "front"（或你的项目名）

2. **修改分支设置**
   - 点击项目 "front"
   - 点击 "Settings"（设置）标签
   - 找到 "Builds & deployments" 部分
   - 修改 "Production branch"：
     - 如果代码在 `master` 分支 → 改为 `master`
     - 如果代码在 `main` 分支 → 改为 `main`

3. **修改构建设置**（如果还没有）
   - 在同一个页面，找到 "Build configuration"
   - 确保设置如下：
     ```
     Framework preset: Vue
     Build command: npm run build
     Build output directory: dist
     Root directory: /
     ```

#### 2. 或者：修改 GitHub Actions 配置匹配项目名

如果 Cloudflare Pages 项目名是 "front"，需要修改 GitHub Actions：

编辑 `.github/workflows/deploy-cloudflare.yml`，将第 38 行改为：

```yaml
projectName: front  # 改为你的实际项目名
```

---

### 方案二：使用 GitHub Actions 部署（不需要在 Cloudflare 设置分支）

如果你使用 GitHub Actions 自动部署，**不需要在 Cloudflare Pages 设置分支**，因为 GitHub Actions 会直接上传构建产物。

#### 检查清单：

1. ✅ **GitHub Secrets 已设置**
   - `CLOUDFLARE_API_TOKEN`
   - `CLOUDFLARE_ACCOUNT_ID`

2. ✅ **项目名匹配**
   - Cloudflare Pages 项目名：`front`
   - GitHub Actions 中的 `projectName`：`front`

3. ✅ **代码已推送到 GitHub**
   ```bash
   git add .
   git commit -m "修复 Cloudflare Pages 部署"
   git push origin master  # 或 git push origin main
   ```

---

## 🔧 快速修复步骤

### 步骤 1：确认项目名

查看 Cloudflare Pages 项目名：
- 访问：https://dash.cloudflare.com
- Workers & Pages → 查看项目名

### 步骤 2：更新 GitHub Actions 配置

根据实际项目名，修改 `.github/workflows/deploy-cloudflare.yml`：

```yaml
projectName: front  # 改为你的实际项目名
```

### 步骤 3：确认分支

检查你的代码在哪个分支：
```bash
git branch -a
```

如果本地是 `master`，确保推送到 GitHub：
```bash
git push origin master
```

### 步骤 4：重新部署

**方法 A：通过 GitHub Actions（推荐）**
- 直接 push 代码，GitHub Actions 会自动部署

**方法 B：手动触发**
- GitHub 仓库 → Actions → 选择工作流 → "Run workflow"

---

## 📋 常见构建失败原因

### 1. 项目名不匹配
- **错误**：`Project "dazuoye" not found`
- **解决**：修改 `projectName` 为实际项目名

### 2. API Token 权限不足
- **错误**：`Authentication failed`
- **解决**：检查 Token 权限（需要 Pages Edit 权限）

### 3. 构建命令失败
- **错误**：`Build failed: npm run build`
- **解决**：检查本地是否能正常构建
  ```bash
  npm run build
  ```

### 4. 输出目录不存在
- **错误**：`Directory "dist" not found`
- **解决**：确保构建成功生成 `dist` 目录

---

## 🎯 推荐配置

### 使用 GitHub Actions 自动部署（当前方案）

**优点：**
- ✅ 不需要在 Cloudflare 控制台操作
- ✅ 自动部署，每次 push 自动更新
- ✅ 可以查看详细的构建日志

**配置：**
- GitHub Actions 工作流：`.github/workflows/deploy-cloudflare.yml`
- 项目名：根据 Cloudflare Pages 实际项目名修改
- 分支：支持 `main` 和 `master`

---

## ❓ 需要帮助？

如果还是失败，请提供：
1. Cloudflare Pages 项目名
2. GitHub Actions 构建日志（GitHub → Actions → 查看失败的运行）
3. 错误信息截图




