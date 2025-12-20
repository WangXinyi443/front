# 部署指南 - 如何获得长期外网可访问的链接

## 🎯 目标

获得一个长期稳定、可公开访问的 HTTPS URL，例如：`https://your-project.vercel.app`

---

## 方法一：Vercel 部署（⭐ 推荐，最简单）

### 为什么选择 Vercel？

- ✅ **完全免费**（个人项目）
- ✅ **自动 HTTPS**（SSL 证书自动配置）
- ✅ **全球 CDN**（访问速度快）
- ✅ **自动部署**（每次 Git push 自动更新）
- ✅ **长期稳定**（只要 GitHub 仓库存在，链接就永久有效）
- ✅ **零配置**（自动检测 Vue 项目）

### 部署步骤

#### 1. 准备 GitHub 仓库

如果你还没有 GitHub 账号，先注册：https://github.com

**在项目目录执行：**

```bash
# 初始化 Git 仓库
git init

# 添加所有文件
git add .

# 提交
git commit -m "Initial commit: 青年涟漪项目"

# 在 GitHub 上创建新仓库（网页操作）
# 然后添加远程仓库
git remote add origin https://github.com/你的用户名/仓库名.git

# 推送代码
git branch -M main
git push -u origin main
```

#### 2. 在 Vercel 部署

1. **访问 Vercel**
   - 打开 https://vercel.com
   - 点击右上角 "Sign Up" 或 "Log In"

2. **使用 GitHub 登录**
   - 选择 "Continue with GitHub"
   - 授权 Vercel 访问你的 GitHub 仓库

3. **导入项目**
   - 登录后，点击 "Add New Project"
   - 在项目列表中找到你的仓库，点击 "Import"

4. **配置项目**（通常自动检测，无需修改）
   - **Framework Preset**: Vue.js（自动检测）
   - **Root Directory**: `./`（默认）
   - **Build Command**: `npm run build`（自动）
   - **Output Directory**: `dist`（自动）
   - **Install Command**: `npm install`（自动）

5. **部署**
   - 点击 "Deploy" 按钮
   - 等待 1-2 分钟，部署完成

6. **获取链接**
   - 部署成功后，你会看到一个绿色的 "Success" 提示
   - 你的网站链接会显示在页面上，格式：`https://your-project-name.vercel.app`
   - **这个链接就是你的长期外网可访问链接！**

#### 3. 后续更新

每次你修改代码并推送到 GitHub：

```bash
git add .
git commit -m "更新内容"
git push
```

Vercel 会自动检测到更新，并在 1-2 分钟内自动重新部署。你的链接保持不变，但内容会自动更新。

---

## 方法二：Netlify 部署

### 部署步骤

1. **准备 GitHub 仓库**（同方法一）

2. **访问 Netlify**
   - 打开 https://netlify.com
   - 使用 GitHub 账号登录

3. **导入项目**
   - 点击 "Add new site" -> "Import an existing project"
   - 选择你的 GitHub 仓库

4. **配置构建设置**
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - 点击 "Deploy site"

5. **获取链接**
   - 部署成功后，你会得到一个链接：`https://random-name.netlify.app`
   - 可以在 "Site settings" -> "Change site name" 中自定义名称

---

## 方法三：GitHub Pages 部署

### 部署步骤

1. **安装 gh-pages**
   ```bash
   npm install -D gh-pages
   ```

2. **修改 vite.config.js**
   ```js
   export default defineConfig({
     base: '/你的仓库名/',
     // ... 其他配置
   })
   ```

3. **添加部署脚本到 package.json**
   ```json
   "scripts": {
     "deploy": "npm run build && gh-pages -d dist"
   }
   ```

4. **部署**
   ```bash
   npm run deploy
   ```

5. **启用 GitHub Pages**
   - 在 GitHub 仓库页面，进入 "Settings" -> "Pages"
   - Source 选择 "gh-pages" 分支
   - 保存后，你的网站地址为：`https://你的用户名.github.io/仓库名/`

---

## 📱 生成二维码

部署完成后，你可以使用以下方式生成二维码：

### 方法一：在线工具（推荐）
1. 访问 https://cli.im 或 https://www.qrcode-monkey.com
2. 输入你的网站 URL
3. 下载二维码图片

### 方法二：项目内生成
项目中的 "关于" 页面已经集成了二维码生成功能，会自动显示当前页面的二维码。

---

## ✅ 验证部署

部署完成后，请验证：

1. **访问链接**：在浏览器中打开你的 URL，确认网站正常显示
2. **测试路由**：点击地图上的热点，确认路由跳转正常
3. **响应式测试**：在手机、平板、电脑上分别测试
4. **媒体加载**：确认图片和视频正常加载

---

## 🔧 常见问题

### Q: 部署后页面空白？
A: 检查 `vite.config.js` 中的 `base` 配置是否正确（Vercel/Netlify 通常不需要设置 base）

### Q: 路由跳转 404？
A: 确保部署平台配置了 SPA 重定向规则（Vercel 的 `vercel.json` 已配置）

### Q: 图片/视频加载失败？
A: 检查 `public` 目录下的资源路径是否正确，确保资源文件已提交到 Git

### Q: 如何自定义域名？
A: 
- **Vercel**: Settings -> Domains -> Add Domain
- **Netlify**: Site settings -> Domain management -> Add custom domain

---

## 📝 最终交付清单

- [x] 完整的源代码仓库（GitHub）
- [ ] 长期稳定的 HTTPS URL（部署后获得）
- [ ] 二维码图片（使用在线工具生成）

---

## 🎉 完成！

部署成功后，你就有了一个长期外网可访问的链接。这个链接会一直有效，除非你：
- 删除 Vercel/Netlify 项目
- 删除 GitHub 仓库

**建议**：将链接和二维码保存好，方便后续展示和分享！

