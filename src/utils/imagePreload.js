/**
 * 图片预加载工具
 * 在页面加载时预加载关键图片
 */

// 获取资源路径
function getAssetPath(path) {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }
  const base = import.meta.env.BASE_URL || '/'
  const cleanPath = path.startsWith('/') ? path.slice(1) : path
  const fullPath = base + cleanPath
  return fullPath.replace(/([^:]\/)\/+/g, '$1')
}

/**
 * 预加载图片
 * @param {string} src - 图片路径
 */
export function preloadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = getAssetPath(src)
  })
}

/**
 * 批量预加载图片
 * @param {string[]} srcs - 图片路径数组
 */
export async function preloadImages(srcs) {
  const promises = srcs.map(src => 
    preloadImage(src).catch(err => {
      console.warn(`预加载图片失败: ${src}`, err)
      return null
    })
  )
  return Promise.all(promises)
}

/**
 * 添加 preload link 到 head
 * @param {string} href - 资源路径
 * @param {string} as - 资源类型
 */
export function addPreloadLink(href, as = 'image') {
  const link = document.createElement('link')
  link.rel = 'preload'
  link.as = as
  link.href = getAssetPath(href)
  if (as === 'image') {
    link.fetchPriority = 'high'
  }
  document.head.appendChild(link)
  return link
}

