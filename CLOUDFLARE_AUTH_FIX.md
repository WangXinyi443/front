# Cloudflare Pages 认证错误修复指南

## 🔍 错误分析

**错误信息：**
```
Cloudflare API returned non-200: 400
API returned: {"success":false,"errors":[{"code":10001,"message":"Unable to authenticate request"}]}
```

**原因：**
- `CLOUDFLARE_API_TOKEN` 未设置、无效或权限不足
- `CLOUDFLARE_ACCOUNT_ID` 未设置或错误
- API Token 格式错误

---

## ✅ 解决方案

### 步骤 1：检查 GitHub Secrets

1. **进入 GitHub 仓库设置**
   - 访问：https://github.com/WangXinyi443/front/settings/secrets/actions

2. **检查是否已设置以下 Secrets：**
   - `CLOUDFLARE_API_TOKEN`
   - `CLOUDFLARE_ACCOUNT_ID`

3. **如果未设置或不确定是否正确：**
   - 需要重新设置（见步骤 2 和 3）

---

### 步骤 2：获取 Cloudflare Account ID

1. **登录 Cloudflare Dashboard**
   - 访问：https://dash.cloudflare.com

2. **找到 Account ID**
   - 点击右上角账户图标
   - 在右侧边栏底部找到 "Account ID"
   - 复制这个 ID（格式类似：`a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6`）

---

### 步骤 3：创建新的 Cloudflare API Token

1. **进入 API Tokens 页面**
   - 访问：https://dash.cloudflare.com/profile/api-tokens
   - 或：右上角账户图标 → "My Profile" → "API Tokens" 标签

2. **创建新的 Token**
   - 点击 "Create Token"
   - 点击 "Get started" 旁边的 "Edit Cloudflare Workers" 模板
   - 或者点击 "Create Custom Token"

3. **配置 Token 权限**
   ```
   Token name: GitHub Actions Cloudflare Pages
   
   Permissions:
   - Account: Cloudflare Pages: Edit
   
   Account Resources:
   - Include: All accounts（或选择你的账户）
   ```

4. **继续设置**
   - 点击 "Continue to summary"
   - 点击 "Create Token"
   - **重要：立即复制 Token**（只显示一次！）
   - 格式类似：`xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

---

### 步骤 4：设置 GitHub Secrets

1. **进入 GitHub Secrets 设置**
   - 访问：https://github.com/WangXinyi443/front/settings/secrets/actions

2. **添加或更新 `CLOUDFLARE_API_TOKEN`**
   - 点击 "New repository secret"（如果是新添加）
   - 或点击现有的 `CLOUDFLARE_API_TOKEN` 进行更新
   - Name: `CLOUDFLARE_API_TOKEN`
   - Secret: 粘贴刚才复制的 API Token
   - 点击 "Add secret" 或 "Update secret"

3. **添加或更新 `CLOUDFLARE_ACCOUNT_ID`**
   - 点击 "New repository secret"（如果是新添加）
   - 或点击现有的 `CLOUDFLARE_ACCOUNT_ID` 进行更新
   - Name: `CLOUDFLARE_ACCOUNT_ID`
   - Secret: 粘贴你的 Account ID
   - 点击 "Add secret" 或 "Update secret"

---

### 步骤 5：重新触发部署

1. **推送代码触发部署**
   ```bash
   git commit --allow-empty -m "重新触发 Cloudflare Pages 部署"
   git push origin master
   ```

2. **或手动触发 GitHub Actions**
   - 访问：https://github.com/WangXinyi443/front/actions
   - 点击 "Deploy to Cloudflare Pages" 工作流
   - 点击 "Run workflow" → "Run workflow"

3. **查看部署状态**
   - 等待部署完成
   - 如果成功，会显示 Cloudflare Pages 链接

---

## 🔧 验证 Token 是否正确

### 方法 1：使用 curl 测试（可选）

```bash
curl -X GET "https://api.cloudflare.com/client/v4/accounts/YOUR_ACCOUNT_ID/pages/projects" \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json"
```

如果返回 200 和项目列表，说明 Token 正确。

### 方法 2：查看 GitHub Actions 日志

部署后查看 GitHub Actions 日志：
- 如果认证成功，会显示 "Deploying to Cloudflare Pages..."
- 如果仍然失败，检查错误信息

---

## 📋 检查清单

在重新部署前，确认：

- [ ] `CLOUDFLARE_API_TOKEN` 已设置且正确
- [ ] `CLOUDFLARE_ACCOUNT_ID` 已设置且正确
- [ ] API Token 权限包含 "Cloudflare Pages: Edit"
- [ ] Account ID 格式正确（32 位字符）
- [ ] API Token 格式正确（64+ 位字符）

---

## ❓ 常见问题

### Q1: Token 创建后找不到？
**A**: Token 只显示一次，如果丢失需要重新创建。

### Q2: 权限应该选什么？
**A**: 必须选择 "Account: Cloudflare Pages: Edit"，其他权限不需要。

### Q3: Account ID 在哪里？
**A**: Cloudflare Dashboard → 右上角账户图标 → 右侧边栏底部。

### Q4: 仍然认证失败？
**A**: 
- 检查 Token 是否完整复制（没有多余空格）
- 检查 Account ID 是否正确
- 尝试重新创建 Token

