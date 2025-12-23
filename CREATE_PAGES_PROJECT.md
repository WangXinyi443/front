# 创建 Cloudflare Pages 项目指南

## 🔍 问题

你创建的是 Workers 项目，但我们需要 Pages 项目来部署静态网站。

---

## ✅ 正确的创建步骤

### 步骤 1：找到 Pages 创建入口

1. **进入 Cloudflare Dashboard**
   - 访问：https://dash.cloudflare.com
   - 点击左侧 "Workers & Pages"

2. **切换到 Pages 标签**
   - 在页面顶部，应该能看到 "Workers" 和 "Pages" 两个标签
   - 点击 **"Pages"** 标签（不是 Workers）

3. **如果看不到 Pages 标签**
   - 尝试直接访问：https://dash.cloudflare.com/pages
   - 或者点击 "Create application" → 选择 "Pages"（不是 Workers）

---

### 步骤 2：创建 Pages 项目

1. **点击 "Create application" 或 "Create project"**

2. **选择创建方式**
   - 选择 "Upload assets" 或 "Upload your static files"
   - **不要选择** "Continue with GitHub"（我们使用 GitHub Actions 部署）

3. **填写项目信息**
   - 项目名称：尝试以下名字（如果 `front` 不合法）：
     - `front-pages`
     - `front-site`
     - `front-project`
     - `my-front`
     - 或其他合法的名字

4. **上传占位文件**
   - 上传一个简单的 `index.html` 文件
   - 内容可以是：
     ```html
     <!DOCTYPE html>
     <html>
     <head><title>临时占位</title></head>
     <body><h1>项目创建中...</h1></body>
     </html>
     ```

5. **创建项目**
   - 点击 "Deploy" 或 "Create project"

---

### 步骤 3：更新 GitHub Actions 配置

创建成功后，告诉我你使用的项目名，我会更新 GitHub Actions 配置。

---

## 📋 项目名建议

如果 `front` 不合法，可以使用：
- `front-pages`（推荐）
- `front-site`
- `front-project`
- `my-front`

创建后告诉我项目名，我会更新配置。


