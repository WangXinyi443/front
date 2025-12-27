# Cloudflare Pages 部署指南（无需在控制台连接 GitHub）

## 🎯 方案说明

由于网络问题无法在 Cloudflare 控制台连接 GitHub，我们使用 **GitHub Actions** 自动部署到 Cloudflare Pages。

**优势：**
- ✅ 不需要在 Cloudflare 控制台操作（避免白屏）
- ✅ 自动部署：每次 push 代码自动部署
- ✅ 完全自动化，无需手动操作

---

## 📋 你需要做的 3 个步骤

### 步骤 1：获取 Cloudflare API Token 和 Account ID

#### 1.1 注册/登录 Cloudflare
- 访问：https://dash.cloudflare.com/sign-up
- 使用邮箱注册（不需要连接 GitHub）

#### 1.2 获取 Account ID
1. 登录后，点击右上角你的账户图标
2. 在右侧边栏找到 **Account ID**（一串字符，类似：`abc123def456...`）
3. **复制保存**，后面要用

#### 1.3 创建 API Token
1. 访问：https://dash.cloudflare.com/profile/api-tokens
2. 点击 **"Create Token"**
3. 点击 **"Create Custom Token"**
4. 填写：
   - **Token name**: `GitHub Actions Deploy`
   - **Permissions**:
     - **Account** → **Cloudflare Pages** → **Edit**
   - **Account Resources**:
     - **Include** → 选择你的账户
5. 点击 **"Continue to summary"** → **"Create Token"**
6. **复制 Token**（只显示一次，务必保存！）

---

### 步骤 2：在 GitHub 仓库设置 Secrets

#### 2.1 进入 GitHub 仓库设置
1. 打开你的 GitHub 仓库页面
2. 点击 **Settings**（设置）
3. 左侧菜单找到 **Secrets and variables** → **Actions**
4. 点击 **"New repository secret"**

#### 2.2 添加两个 Secret

**第一个 Secret：**
- **Name**: `CLOUDFLARE_API_TOKEN`
- **Secret**: 粘贴步骤 1.3 复制的 API Token
- 点击 **"Add secret"**

**第二个 Secret：**
- **Name**: `CLOUDFLARE_ACCOUNT_ID`
- **Secret**: 粘贴步骤 1.2 复制的 Account ID
- 点击 **"Add secret"**

---

### 步骤 3：创建 Cloudflare Pages 项目（一次性）

#### 方法 A：使用 Wrangler CLI（推荐，命令行操作）

1. **安装 Wrangler**（如果还没安装）：
   ```bash
   npm install -g wrangler
   ```

2. **登录 Cloudflare**：
   ```bash
   wrangler login
   ```
   - 会自动打开浏览器，授权登录

3. **创建 Pages 项目**：
   ```bash
   wrangler pages project create dazuoye
   ```
   - 将 `dazuoye` 替换为你的项目名
   - 成功后会有输出，记住项目名

#### 方法 B：手动创建（如果命令行也不行）

1. 访问：https://dash.cloudflare.com
2. 点击左侧 **"Workers & Pages"**
3. 点击 **"Create application"** → **"Pages"**
4. 点击 **"Upload assets"**（不是 Connect to Git）
5. 项目名称填写：`dazuoye`（或自定义）
6. 点击 **"Create project"**
7. **不需要上传文件**，创建项目即可

---

## 🚀 自动部署

完成以上步骤后：

1. **提交代码**：
   ```bash
   git add .
   git commit -m "配置 Cloudflare Pages 自动部署"
   git push
   ```

2. **查看部署状态**：
   - 进入 GitHub 仓库 → **Actions** 标签
   - 查看工作流运行状态
   - 部署成功后，会显示 Cloudflare Pages 链接

3. **获取访问链接**：
   - 部署成功后，访问：`https://dazuoye.pages.dev`
   - 或查看 GitHub Actions 日志中的链接

---

## 🔧 如果项目名不是 `dazuoye`

编辑 `.github/workflows/deploy-cloudflare.yml`，修改第 38 行：

```yaml
projectName: 你的项目名
```

---

## ❓ 常见问题

### Q1: 找不到 Account ID？
**A**: 登录 Cloudflare → 右上角账户图标 → 右侧边栏底部

### Q2: API Token 创建失败？
**A**: 确保权限选择正确：Account → Cloudflare Pages → Edit

### Q3: GitHub Actions 部署失败？
**A**: 
- 检查 Secrets 是否正确设置
- 检查项目名是否匹配
- 查看 Actions 日志中的错误信息

### Q4: 如何更新项目？
**A**: 直接 push 代码到 GitHub，GitHub Actions 会自动部署

---

## 📊 部署流程

```
你 push 代码到 GitHub
    ↓
GitHub Actions 自动触发
    ↓
构建项目 (npm run build)
    ↓
部署到 Cloudflare Pages
    ↓
自动获得全球 CDN 加速链接
```

---

## ✅ 检查清单

- [ ] 已注册 Cloudflare 账户
- [ ] 已获取 Account ID
- [ ] 已创建 API Token
- [ ] 已在 GitHub 设置 Secrets
- [ ] 已创建 Cloudflare Pages 项目
- [ ] 已提交代码并 push
- [ ] GitHub Actions 部署成功
- [ ] 可以访问网站链接

完成以上步骤后，你的网站就会自动部署到 Cloudflare Pages，享受全球 CDN 加速！








