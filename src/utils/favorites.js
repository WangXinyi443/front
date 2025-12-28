/**
 * 收藏功能工具函数
 * 使用 localStorage 存储收藏的故事ID列表
 */

const STORAGE_KEY = 'youth_ripples_favorites'

/**
 * 获取所有收藏的故事ID
 * @returns {number[]} 收藏的故事ID数组
 */
export function getFavorites() {
  try {
    const favorites = localStorage.getItem(STORAGE_KEY)
    return favorites ? JSON.parse(favorites) : []
  } catch (error) {
    console.error('获取收藏列表失败:', error)
    return []
  }
}

/**
 * 检查故事是否已收藏
 * @param {number} storyId - 故事ID
 * @returns {boolean} 是否已收藏
 */
export function isFavorite(storyId) {
  const favorites = getFavorites()
  return favorites.includes(storyId)
}

/**
 * 切换收藏状态
 * @param {number} storyId - 故事ID
 * @returns {boolean} 操作后的收藏状态（true=已收藏，false=未收藏）
 */
export function toggleFavorite(storyId) {
  try {
    const favorites = getFavorites()
    const index = favorites.indexOf(storyId)
    
    if (index > -1) {
      // 已收藏，取消收藏
      favorites.splice(index, 1)
    } else {
      // 未收藏，添加收藏
      favorites.push(storyId)
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
    return !isFavorite(storyId) // 返回新的状态（取反因为上面已经修改了）
  } catch (error) {
    console.error('切换收藏状态失败:', error)
    return isFavorite(storyId) // 出错时返回原状态
  }
}

/**
 * 添加收藏
 * @param {number} storyId - 故事ID
 * @returns {boolean} 是否成功
 */
export function addFavorite(storyId) {
  try {
    const favorites = getFavorites()
    if (!favorites.includes(storyId)) {
      favorites.push(storyId)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
    }
    return true
  } catch (error) {
    console.error('添加收藏失败:', error)
    return false
  }
}

/**
 * 移除收藏
 * @param {number} storyId - 故事ID
 * @returns {boolean} 是否成功
 */
export function removeFavorite(storyId) {
  try {
    const favorites = getFavorites()
    const index = favorites.indexOf(storyId)
    if (index > -1) {
      favorites.splice(index, 1)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
    }
    return true
  } catch (error) {
    console.error('移除收藏失败:', error)
    return false
  }
}

/**
 * 清空所有收藏
 */
export function clearFavorites() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error('清空收藏失败:', error)
  }
}

/**
 * 获取收藏数量
 * @returns {number} 收藏数量
 */
export function getFavoriteCount() {
  return getFavorites().length
}


