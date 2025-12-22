/**
 * 获取正确的资源路径（支持 GitHub Pages 子路径部署）
 * @param {string} path - 资源路径（如 '/images/xxx.png'）
 * @returns {string} - 处理后的路径
 */
export function getAssetPath(path) {
  // 如果路径已经是完整 URL，直接返回
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }
  
  // 获取 base URL（在 GitHub Pages 上会是 '/front/'）
  const base = import.meta.env.BASE_URL || '/'
  
  // 移除路径开头的斜杠（如果有）
  const cleanPath = path.startsWith('/') ? path.slice(1) : path
  
  // 组合完整路径
  const fullPath = base + cleanPath
  
  // 移除重复的斜杠
  return fullPath.replace(/([^:]\/)\/+/g, '$1')
}

