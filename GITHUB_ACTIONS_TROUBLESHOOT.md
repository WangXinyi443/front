# GitHub Actions Cloudflare Pages 部署问题排查

## 🔍 常见错误和解决方案

### 1. Authentication failed（认证失败）

**错误信息：**
```
Error: Authentication failed
```

**原因：**
- `CLOUDFLARE_API_TOKEN` 未设置或无效
- `CLOUDFLARE_ACCOUNT_ID` 未设置或无效
- API Token 权限不足

**解决方案：**
1. 检查 GitHub Secrets：
   - 进入：https://github.com/WangXinyi443/front/settings/secrets/actions
   - 确认已设置：
     - `CLOUDFLARE_API_TOKEN`
     - `CLOUDFLARE_ACCOUNT_ID`

2. 重新生成 API Token：
   - 访问：https://dash.cloudflare.com/profile/api-tokens
   - 创建新的 Token，权限选择：
     - Account: Cloudflare Pages: Edit
     - Zone: 不需要
   - 复制 Token，更新 GitHub Secret

### 2. Project not found（项目不存在）

**错误信息：**
```
Error: Project "front" not found
```

**原因：**
- Cloudflare Pages 项目名不匹配
- 项目不存在

**解决方案：**
1. 检查 Cloudflare Pages 项目名：
   - 访问：https://dash.cloudflare.com
   - Workers & Pages → 查看项目名

2. 修改 GitHub Actions 配置：
   - 编辑 `.github/workflows/deploy-cloudflare.yml`
   - 修改 `projectName: front` 为实际项目名

### 3. Directory not found（目录不存在）

**错误信息：**
```
Error: Directory "dist" not found
```

**原因：**
- 构建失败，没有生成 `dist` 目录
- 构建命令错误

**解决方案：**
1. 检查构建步骤是否成功：
   - 查看 GitHub Actions 日志中的 "Build" 步骤
   - 确认 `npm run build` 是否成功

2. 本地测试构建：
   ```bash
   npm run build
   ```
   - 如果本地构建失败，先修复构建问题

### 4. Build failed（构建失败）

**错误信息：**
```
Error: Build failed: npm run build
```

**原因：**
- 依赖安装失败
- 代码错误
- Node.js 版本不匹配

**解决方案：**
1. 检查构建日志：
   - 查看 "Install dependencies" 步骤
   - 查看 "Build" 步骤的详细错误

2. 本地测试：
   ```bash
   npm ci
   npm run build
   ```

---

## ✅ 检查清单

在报告错误前，请确认：

- [ ] GitHub Secrets 已设置：
  - [ ] `CLOUDFLARE_API_TOKEN`
  - [ ] `CLOUDFLARE_ACCOUNT_ID`
- [ ] Cloudflare Pages 项目已创建
- [ ] 项目名匹配（GitHub Actions 中的 `projectName`）
- [ ] 本地可以正常构建（`npm run build`）
- [ ] 代码已推送到 GitHub

---

## 📋 如何查看详细错误

1. **进入 GitHub Actions**
   - 访问：https://github.com/WangXinyi443/front/actions

2. **查看失败的运行**
   - 点击失败的运行记录（红色叉号）

3. **查看详细日志**
   - 点击 "Deploy to Cloudflare Pages" 步骤
   - 展开查看完整错误信息

4. **复制错误信息**
   - 复制完整的错误日志
   - 发给我进行分析





