/**
 * 分享功能工具函数
 * 支持微信、微博、QQ、复制链接等分享方式
 */

/**
 * 获取当前页面的完整URL
 * @returns {string} 当前页面URL
 */
function getCurrentUrl() {
  return window.location.href
}

/**
 * 复制文本到剪贴板
 * @param {string} text - 要复制的文本
 * @returns {Promise<boolean>} 是否成功
 */
async function copyToClipboard(text) {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text)
      return true
    } else {
      // 降级方案：使用传统方法
      const textArea = document.createElement('textarea')
      textArea.value = text
      textArea.style.position = 'fixed'
      textArea.style.opacity = '0'
      document.body.appendChild(textArea)
      textArea.select()
      const success = document.execCommand('copy')
      document.body.removeChild(textArea)
      return success
    }
  } catch (error) {
    console.error('复制失败:', error)
    return false
  }
}

/**
 * 分享到微信
 * @param {object} options - 分享选项
 * @param {string} options.title - 分享标题
 * @param {string} options.desc - 分享描述
 * @param {string} options.url - 分享链接（可选，默认当前页）
 * @param {string} options.imgUrl - 分享图片（可选）
 */
export function shareToWeChat(options = {}) {
  const { title, desc, url, imgUrl } = options
  const shareUrl = url || getCurrentUrl()
  
  // 在微信中，可以通过提示用户点击右上角分享
  // 或者使用微信JS-SDK（需要配置）
  if (window.wx && window.wx.ready) {
    // 如果已配置微信JS-SDK
    window.wx.updateTimelineShareData({
      title: title || '青年涟漪：故乡行动者',
      link: shareUrl,
      imgUrl: imgUrl || ''
    })
    window.wx.updateAppMessageShareData({
      title: title || '青年涟漪：故乡行动者',
      desc: desc || '一个关于青年公益故事的H5作品',
      link: shareUrl,
      imgUrl: imgUrl || ''
    })
  } else {
    // 提示用户手动分享
    alert('请点击右上角菜单，选择"分享到朋友圈"或"发送给朋友"')
  }
}

/**
 * 分享到微博
 * @param {object} options - 分享选项
 * @param {string} options.title - 分享标题
 * @param {string} options.url - 分享链接（可选，默认当前页）
 */
export function shareToWeibo(options = {}) {
  const { title, url } = options
  const shareUrl = encodeURIComponent(url || getCurrentUrl())
  const shareTitle = encodeURIComponent(title || '青年涟漪：故乡行动者')
  
  const weiboUrl = `https://service.weibo.com/share/share.php?url=${shareUrl}&title=${shareTitle}`
  window.open(weiboUrl, '_blank', 'width=600,height=400')
}

/**
 * 分享到QQ
 * @param {object} options - 分享选项
 * @param {string} options.title - 分享标题
 * @param {string} options.desc - 分享描述
 * @param {string} options.url - 分享链接（可选，默认当前页）
 */
export function shareToQQ(options = {}) {
  const { title, desc, url } = options
  const shareUrl = encodeURIComponent(url || getCurrentUrl())
  const shareTitle = encodeURIComponent(title || '青年涟漪：故乡行动者')
  const shareDesc = encodeURIComponent(desc || '一个关于青年公益故事的H5作品')
  
  const qqUrl = `https://connect.qq.com/widget/shareqq/index.html?url=${shareUrl}&title=${shareTitle}&summary=${shareDesc}`
  window.open(qqUrl, '_blank', 'width=600,height=400')
}

/**
 * 复制链接
 * @param {object} options - 分享选项
 * @param {string} options.url - 要复制的链接（可选，默认当前页）
 * @returns {Promise<boolean>} 是否成功
 */
export async function copyLink(options = {}) {
  const url = options.url || getCurrentUrl()
  const success = await copyToClipboard(url)
  
  if (success) {
    // 可以显示提示消息
    return true
  } else {
    // 降级：显示链接让用户手动复制
    const userConfirmed = confirm(`链接：${url}\n\n请手动复制上面的链接`)
    return false
  }
}

/**
 * 通用分享函数
 * @param {string} platform - 分享平台：'wechat' | 'weibo' | 'qq' | 'copy'
 * @param {object} options - 分享选项
 * @returns {Promise<boolean>} 是否成功（仅copy返回Promise）
 */
export function share(platform, options = {}) {
  switch (platform) {
    case 'wechat':
      shareToWeChat(options)
      return Promise.resolve(true)
    case 'weibo':
      shareToWeibo(options)
      return Promise.resolve(true)
    case 'qq':
      shareToQQ(options)
      return Promise.resolve(true)
    case 'copy':
      return copyLink(options)
    default:
      console.warn('不支持的分享平台:', platform)
      return Promise.resolve(false)
  }
}

/**
 * 检测是否在微信环境中
 * @returns {boolean} 是否在微信中
 */
export function isWeChat() {
  const ua = navigator.userAgent.toLowerCase()
  return /micromessenger/.test(ua)
}

/**
 * 检测是否在移动设备上
 * @returns {boolean} 是否在移动设备上
 */
export function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}


