# 白屏问题排查指南

## 快速检查步骤

### 1. 检查浏览器控制台
按 `F12` 打开开发者工具，查看 Console 标签页是否有红色错误信息。

常见错误：
- `Failed to resolve module` - 模块导入错误
- `Cannot read property` - 数据未加载
- `404 Not Found` - 资源文件缺失

### 2. 检查网络请求
在开发者工具的 Network 标签页，查看是否有请求失败（红色）。

### 3. 检查 Vue 是否加载
在控制台输入：
```javascript
console.log(window.Vue)
```
如果显示 `undefined`，说明 Vue 没有正确加载。

### 4. 检查路由
在控制台输入：
```javascript
console.log(this.$router)
```
如果显示 `undefined`，说明路由没有正确配置。

## 常见问题及解决方案

### 问题1: 控制台显示 "Cannot find module"
**解决方案**: 
```bash
# 删除 node_modules 重新安装
rm -rf node_modules
npm install
```

### 问题2: 图片404错误
**解决方案**: 
- 确认图片在 `public/images/` 目录下
- 检查路径是否正确（使用 `/images/...` 而不是 `./images/...`）

### 问题3: 数据文件导入失败
**解决方案**: 
检查 `src/data/stories.js` 文件是否存在且语法正确

### 问题4: 端口被占用
**解决方案**: 
```bash
# 修改 vite.config.js 中的端口号
# 或使用其他端口启动
npm run dev -- --port 3001
```

## 调试步骤

1. **查看控制台输出**
   - 应该看到 "Vue应用已成功挂载"
   - 应该看到 "HomeView 已加载"
   - 应该看到 "Stories 数据: [...]"

2. **检查元素**
   - 按 `F12` -> Elements 标签
   - 查找 `<div id="app">` 元素
   - 查看是否有内容渲染

3. **检查样式**
   - 可能是样式问题导致内容不可见
   - 检查是否有 `display: none` 或 `opacity: 0`

## 如果仍然白屏

请提供以下信息：
1. 浏览器控制台的完整错误信息（截图）
2. Network 标签页的请求状态
3. 使用的浏览器和版本
4. Node.js 版本 (`node --version`)

