<template>
  <div class="share-container">
    <button 
      class="share-btn" 
      :class="{ compact: !showText }"
      @click="toggleMenu"
      aria-label="分享"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="18" cy="5" r="3"/>
        <circle cx="6" cy="12" r="3"/>
        <circle cx="18" cy="19" r="3"/>
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
      </svg>
      <span v-if="showText" class="btn-text">分享</span>
    </button>
    
    <!-- 分享菜单 -->
    <transition name="menu">
      <div v-if="showMenu" class="share-menu" @click.stop>
        <div class="menu-header">
          <span>分享到</span>
          <button class="close-menu" @click="closeMenu">×</button>
        </div>
        <div class="menu-items">
          <button 
            v-if="isWeChat" 
            class="menu-item" 
            @click="handleShare('wechat')"
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.747c1.33 0 2.42 1.088 2.42 2.424 0 1.338-1.09 2.425-2.42 2.425-1.331 0-2.42-1.087-2.42-2.425 0-1.336 1.089-2.424 2.42-2.424zm-5.34 4.13c1.33 0 2.42 1.088 2.42 2.424 0 1.338-1.09 2.425-2.42 2.425-1.331 0-2.42-1.087-2.42-2.425 0-1.336 1.089-2.424 2.42-2.424zm-5.813 0c1.33 0 2.42 1.088 2.42 2.424 0 1.338-1.09 2.425-2.42 2.425-1.331 0-2.42-1.087-2.42-2.425 0-1.336 1.089-2.424 2.42-2.424z"/>
            </svg>
            <span>微信</span>
          </button>
          <button class="menu-item" @click="handleShare('weibo')">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M9.839 18.761c-.057 0-.113-.005-.17-.014-.677-.116-1.326-.38-1.9-.78-1.004-.7-1.628-1.75-1.628-2.9 0-1.04.524-1.97 1.344-2.53.82-.56 1.888-.88 3.02-.88.057 0 .113.004.17.01.677.116 1.326.38 1.9.78 1.004.7 1.628 1.75 1.628 2.9 0 1.04-.524 1.97-1.344 2.53-.82.56-1.888.88-3.02.88zm-1.76-3.8c.057 0 .113.004.17.01.34.058.67.19.95.39.28.2.5.46.64.75.14.3.2.62.2.94 0 .52-.26.99-.67 1.28-.41.29-.94.45-1.51.45-.057 0-.113-.004-.17-.01-.34-.058-.67-.19-.95-.39-.28-.2-.5-.46-.64-.75-.14-.3-.2-.62-.2-.94 0-.52.26-.99.67-1.28.41-.29.94-.45 1.51-.45zm8.842 0c.057 0 .113.004.17.01.677.116 1.326.38 1.9.78 1.004.7 1.628 1.75 1.628 2.9 0 1.04-.524 1.97-1.344 2.53-.82.56-1.888.88-3.02.88-.057 0-.113-.005-.17-.014-.677-.116-1.326-.38-1.9-.78-1.004-.7-1.628-1.75-1.628-2.9 0-1.04.524-1.97 1.344-2.53.82-.56 1.888-.88 3.02-.88zm-1.76 3.8c-.057 0-.113-.004-.17-.01-.34-.058-.67-.19-.95-.39-.28-.2-.5-.46-.64-.75-.14-.3-.2-.62-.2-.94 0-.52.26-.99.67-1.28.41-.29.94-.45 1.51-.45.057 0 .113.004.17.01.34.058.67.19.95.39.28.2.5.46.64.75.14.3.2.62.2.94 0 .52-.26.99-.67 1.28-.41.29-.94.45-1.51.45z"/>
            </svg>
            <span>微博</span>
          </button>
          <button class="menu-item" @click="handleShare('qq')">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            <span>QQ</span>
          </button>
          <button class="menu-item" @click="handleShare('copy')">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
            </svg>
            <span>复制链接</span>
          </button>
        </div>
      </div>
    </transition>
    
    <!-- 遮罩层 -->
    <transition name="fade">
      <div v-if="showMenu" class="share-overlay" @click="closeMenu"></div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { share, isWeChat } from '../utils/share.js'

const props = defineProps({
  title: {
    type: String,
    default: '青年涟漪：故乡行动者'
  },
  desc: {
    type: String,
    default: '一个关于青年公益故事的H5作品'
  },
  url: {
    type: String,
    default: ''
  },
  imgUrl: {
    type: String,
    default: ''
  },
  showText: {
    type: Boolean,
    default: false
  }
})

const showMenu = ref(false)
const isWeChatEnv = ref(false)

onMounted(() => {
  isWeChatEnv.value = isWeChat()
})

const toggleMenu = () => {
  showMenu.value = !showMenu.value
}

const closeMenu = () => {
  showMenu.value = false
}

const handleShare = async (platform) => {
  const options = {
    title: props.title,
    desc: props.desc,
    url: props.url || window.location.href,
    imgUrl: props.imgUrl
  }
  
  const success = await share(platform, options)
  
  if (platform === 'copy' && success) {
    alert('链接已复制到剪贴板！')
  }
  
  closeMenu()
}

// 点击外部关闭菜单
onMounted(() => {
  const handleClickOutside = (e) => {
    if (showMenu.value && !e.target.closest('.share-container')) {
      closeMenu()
    }
  }
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', () => {})
})
</script>

<style scoped>
.share-container {
  position: relative;
  display: inline-block;
}

.share-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.9);
  border: 2px solid var(--color-primary);
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  color: var(--color-primary);
  font-weight: 500;
}

.share-btn:hover {
  background: var(--color-primary);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(230, 160, 72, 0.3);
}

.share-btn svg {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.btn-text {
  white-space: nowrap;
}

/* 紧凑模式 */
.share-btn.compact {
  padding: 8px;
  width: 36px;
  height: 36px;
  justify-content: center;
}

.share-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 998;
}

.share-menu {
  position: absolute;
  bottom: calc(100% + 10px);
  right: 0;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  z-index: 999;
  min-width: 200px;
  padding: 12px;
}

.menu-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 8px;
  margin-bottom: 8px;
  border-bottom: 1px solid #eee;
  font-weight: 500;
  color: var(--color-text);
}

.close-menu {
  background: none;
  border: none;
  font-size: 24px;
  color: #999;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

.close-menu:hover {
  color: var(--color-text);
}

.menu-items {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: none;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  color: var(--color-text);
  font-size: 14px;
}

.menu-item:hover {
  background: #f5f5f5;
}

.menu-item svg {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  color: var(--color-primary);
}

.menu-enter-active,
.menu-leave-active {
  transition: all 0.3s ease;
}

.menu-enter-from,
.menu-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .share-btn {
    padding: 6px 12px;
    font-size: 12px;
  }
  
  .share-btn svg {
    width: 16px;
    height: 16px;
  }
  
  .share-btn.compact {
    width: 32px;
    height: 32px;
    padding: 6px;
  }
  
  .share-menu {
    min-width: 180px;
  }
}
</style>

