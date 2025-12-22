# Cloudflare Pages 构建失败修复指南

## 🔍 错误分析

错误信息显示：
```
If are uploading a directory of assets, you can either:
- Specify the path to the directory of assets via the command line
- Or create a "wrangler.jsonc" file containing assets directory
```

**原因：**
- Cloudflare Pages 通过 Git 连接部署时，自动运行了 Wrangler
- 但找不到正确的 assets 目录配置
- `wrangler.toml` 文件配置不正确或缺失

---

## ✅ 解决方案

### 方案一：使用 GitHub Actions 部署（推荐，最简单）

**优点：**
- ✅ 不需要 wrangler 配置
- ✅ 不需要在 Cloudflare 控制台操作
- ✅ 自动部署，每次 push 自动更新

**步骤：**

1. **确保 GitHub Secrets 已设置**
   - `CLOUDFLARE_API_TOKEN`
   - `CLOUDFLARE_ACCOUNT_ID`

2. **删除 wrangler.toml**（已删除）
   - 这个文件会干扰 GitHub Actions 部署

3. **提交代码**
   ```bash
   git add .
   git commit -m "修复 Cloudflare Pages 构建配置"
   git push origin master
   ```

4. **查看部署状态**
   - GitHub → Actions → 查看工作流运行
   - 部署成功后访问：`https://front.pages.dev`

---

### 方案二：修复 Cloudflare Pages Git 连接部署

如果你坚持使用 Cloudflare Pages 的 Git 连接：

#### 步骤 1：在 Cloudflare Dashboard 配置构建设置

1. **进入项目设置**
   - 访问：https://dash.cloudflare.com
   - Workers & Pages → 项目 "front" → Settings

2. **配置构建设置**
   - 找到 "Build configuration"
   - 设置：
     ```
     Framework preset: Vue
     Build command: npm run build
     Build output directory: dist
     Root directory: /
     Node.js version: 18
     ```

3. **保存并重新部署**
   - 点击 "Save"
   - 返回 Deployments，点击 "Retry deployment"

#### 步骤 2：删除或忽略 wrangler.toml

`wrangler.toml` 文件会干扰 Cloudflare Pages 的自动构建，已删除。

---

## 🔧 如果方案二还是失败

### 创建 `wrangler.jsonc` 文件（备选方案）

如果 Cloudflare Pages 仍然需要 wrangler 配置，创建 `wrangler.jsonc`：

```jsonc
{
  "name": "front",
  "compatibility_date": "2025-12-22",
  "pages_build_output_dir": "./dist"
}
```

**注意：** 这个文件只在使用 Cloudflare Pages Git 连接时需要。如果使用 GitHub Actions，不需要这个文件。

---

## 📋 推荐配置对比

| 方案 | 优点 | 缺点 | 推荐度 |
|------|------|------|--------|
| **GitHub Actions** | ✅ 简单<br>✅ 不需要配置<br>✅ 详细日志 | 需要设置 Secrets | ⭐⭐⭐⭐⭐ |
| **Cloudflare Git 连接** | ✅ 在 Cloudflare 控制台操作 | ❌ 需要配置<br>❌ 可能网络问题 | ⭐⭐⭐ |

---

## 🚀 立即修复（推荐）

**使用 GitHub Actions 部署：**

1. **已删除 `wrangler.toml`**（避免干扰）

2. **提交代码**
   ```bash
   git add .
   git commit -m "修复 Cloudflare Pages 构建：删除 wrangler.toml"
   git push origin master
   ```

3. **等待 GitHub Actions 自动部署**
   - 查看：GitHub → Actions
   - 成功后访问：`https://front.pages.dev`

---

## ❓ 常见问题

### Q1: 为什么删除 wrangler.toml？
**A**: 
- `wrangler.toml` 主要用于 Cloudflare Workers
- Cloudflare Pages 有自己的构建配置系统
- 这个文件会干扰 Pages 的自动构建

### Q2: GitHub Actions 部署失败怎么办？
**A**: 
1. 检查 GitHub Secrets 是否正确设置
2. 检查项目名是否匹配（`front`）
3. 查看 GitHub Actions 日志中的错误信息

### Q3: 可以同时使用两种方案吗？
**A**: 可以，但推荐只使用一种，避免冲突。

---

## ✅ 检查清单

- [x] 已删除 `wrangler.toml`
- [ ] GitHub Secrets 已设置
- [ ] 代码已推送到 GitHub
- [ ] GitHub Actions 部署成功
- [ ] 可以访问网站

完成以上步骤后，构建应该会成功！



