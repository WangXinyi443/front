# Cloudflare Pages 404 错误修复指南

## 🔍 问题诊断

**错误现象：**
- 页面白屏
- 控制台报错：`index-GVd2D1O7.js:1 Failed to load resource: the server responded with a status of 404`
- 构建日志显示：`Executing user deploy command: npx wrangler deploy`

**根本原因：**
Cloudflare Pages 的构建配置使用了错误的部署命令 `npx wrangler deploy`，而不是正确的 `npm run build`。

---

## ✅ 解决方案（两种方式）

### 方案一：修改 Cloudflare Dashboard 构建设置（推荐，最简单）

#### 步骤 1：进入项目设置

1. **登录 Cloudflare Dashboard**
   - 访问：https://dash.cloudflare.com
   - 登录你的账号

2. **进入 Pages 项目**
   - 点击左侧菜单 "Workers & Pages"
   - 找到项目 "front"（或你的项目名）
   - 点击项目名称进入

#### 步骤 2：修改构建设置

1. **点击 "Settings"（设置）标签**

2. **找到 "Builds & deployments" 部分**

3. **修改 "Build configuration"**
   - 点击 "Edit configuration" 或 "Configure build"
   - 设置以下内容：
     ```
     Framework preset: Vue
     Build command: npm run build
     Build output directory: dist
     Root directory: /（默认，留空也可以）
     Node.js version: 18（或自动检测）
     ```

4. **重要：删除或修改 "Deploy command"**
   - 如果看到 "Deploy command" 或 "Custom deploy command"
   - **必须删除** `npx wrangler deploy` 这个命令
   - 留空即可（Cloudflare Pages 会自动部署 dist 目录）

5. **保存设置**
   - 点击 "Save" 按钮

#### 步骤 3：重新部署

1. **返回 "Deployments" 标签**
2. **找到最新的部署记录**
3. **点击 "Retry deployment"（重新部署）**
   - 或者点击右上角 "Create deployment" → "Retry latest deployment"
4. **等待构建完成**（约 2-5 分钟）

#### 步骤 4：验证修复

构建完成后：
- ✅ 构建日志应该显示：`npm run build` 而不是 `npx wrangler deploy`
- ✅ 页面应该正常显示
- ✅ 控制台没有 404 错误

---

### 方案二：使用 GitHub Actions 自动部署（更可靠）

如果你希望使用 GitHub Actions 自动部署（推荐），需要：

#### 步骤 1：设置 GitHub Secrets

1. **进入 GitHub 仓库**
   - https://github.com/WangXinyi443/front

2. **设置 Secrets**
   - Settings → Secrets and variables → Actions → New repository secret
   - 添加两个 secrets：
     - `CLOUDFLARE_API_TOKEN`：你的 Cloudflare API Token
     - `CLOUDFLARE_ACCOUNT_ID`：你的 Cloudflare Account ID

#### 步骤 2：禁用 Cloudflare Pages 的 Git 连接

1. **进入 Cloudflare Pages 项目设置**
2. **Settings → Builds & deployments**
3. **找到 "Source" 部分**
4. **点击 "Disconnect" 断开 Git 连接**
   - 这样 Cloudflare 就不会自动构建了
   - GitHub Actions 会负责构建和部署

#### 步骤 3：触发 GitHub Actions 部署

1. **推送代码到 GitHub**
   ```bash
   git push origin master
   ```

2. **查看部署状态**
   - GitHub → Actions → "Deploy to Cloudflare Pages"
   - 等待部署完成

---

## 🔧 如果方案一不起作用

### 检查清单：

1. ✅ **确认构建命令正确**
   - Build command: `npm run build`
   - Build output directory: `dist`

2. ✅ **确认没有自定义 Deploy command**
   - 如果有 `npx wrangler deploy`，必须删除

3. ✅ **确认 Node.js 版本**
   - 建议使用 Node.js 18

4. ✅ **检查构建日志**
   - 应该看到：`npm run build` 成功执行
   - 应该看到：`dist` 目录中有 `index.html` 和 `assets` 文件夹

5. ✅ **清除构建缓存**
   - Settings → Builds & deployments → Clear build cache
   - 然后重新部署

---

## 📝 正确的构建日志示例

构建成功后，日志应该类似这样：

```
Installing project dependencies: npm clean-install --progress=false
...
Executing build command: npm run build
...
✓ built in 5.98s
Deploying to Cloudflare Pages...
Success: Deployment complete
```

**不应该看到：**
- ❌ `Executing user deploy command: npx wrangler deploy`
- ❌ `Failed: error occurred while running deploy command`

---

## 🆘 仍然有问题？

如果按照上述步骤操作后仍然有问题，请提供：

1. Cloudflare Pages 构建日志（完整）
2. 浏览器控制台错误信息
3. Cloudflare Pages 项目设置截图（Build configuration 部分）




