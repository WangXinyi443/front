<template>
  <transition name="fade">
    <div v-if="visible" class="media-viewer" @click="handleBackdropClick">
      <div class="viewer-content" @click.stop>
        <!-- 关闭按钮 -->
        <button class="close-btn" @click="close" aria-label="关闭">×</button>
        
        <!-- 上一张/下一张按钮 -->
        <button 
          v-if="hasPrev" 
          class="nav-btn prev-btn" 
          @click="prev"
          aria-label="上一张"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </button>
        <button 
          v-if="hasNext" 
          class="nav-btn next-btn" 
          @click="next"
          aria-label="下一张"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </button>
        
        <!-- 媒体内容 -->
        <div class="media-wrapper">
          <img 
            v-if="currentMedia.type === 'image'" 
            :src="currentMedia.src" 
            :alt="currentMedia.caption"
            @load="handleImageLoad"
            @error="handleImageError"
            ref="mediaRef"
          />
          <video 
            v-else-if="currentMedia.type === 'video'"
            :src="currentMedia.src" 
            :poster="currentMedia.poster"
            controls
            autoplay
            ref="mediaRef"
          ></video>
        </div>
        
        <!-- 序号和描述 -->
        <div class="viewer-info">
          <div class="viewer-counter" v-if="mediaList.length > 1">
            {{ currentIndex + 1 }} / {{ mediaList.length }}
          </div>
          <p class="viewer-caption" v-if="currentMedia.caption">
            {{ currentMedia.caption }}
          </p>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  media: {
    type: Object,
    default: null
  },
  mediaList: {
    type: Array,
    default: () => []
  },
  initialIndex: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['close', 'update:visible'])

const currentIndex = ref(props.initialIndex)
const mediaRef = ref(null)

const currentMedia = computed(() => {
  if (props.media) {
    return props.media
  }
  if (props.mediaList.length > 0) {
    return props.mediaList[currentIndex.value] || props.mediaList[0]
  }
  return null
})

const hasPrev = computed(() => {
  return props.mediaList.length > 1 && currentIndex.value > 0
})

const hasNext = computed(() => {
  return props.mediaList.length > 1 && currentIndex.value < props.mediaList.length - 1
})

watch(() => props.visible, (newVal) => {
  if (newVal) {
    currentIndex.value = props.initialIndex
    // 阻止背景滚动
    document.body.style.overflow = 'hidden'
  } else {
    // 恢复背景滚动
    document.body.style.overflow = ''
  }
})

watch(() => props.initialIndex, (newIndex) => {
  currentIndex.value = newIndex
})

const close = () => {
  emit('update:visible', false)
  emit('close')
}

const handleBackdropClick = (e) => {
  if (e.target === e.currentTarget) {
    close()
  }
}

const prev = () => {
  if (hasPrev.value) {
    currentIndex.value--
  }
}

const next = () => {
  if (hasNext.value) {
    currentIndex.value++
  }
}

const handleImageLoad = () => {
  // 图片加载成功
}

const handleImageError = (e) => {
  console.error('图片加载失败:', e.target.src)
}

// 键盘事件
const handleKeydown = (e) => {
  if (!props.visible) return
  
  switch (e.key) {
    case 'Escape':
      close()
      break
    case 'ArrowLeft':
      if (hasPrev.value) prev()
      break
    case 'ArrowRight':
      if (hasNext.value) next()
      break
  }
}

// 触摸滑动支持
let touchStartX = 0
let touchStartY = 0

const handleTouchStart = (e) => {
  touchStartX = e.touches[0].clientX
  touchStartY = e.touches[0].clientY
}

const handleTouchEnd = (e) => {
  if (!props.visible) return
  
  const touchEndX = e.changedTouches[0].clientX
  const touchEndY = e.changedTouches[0].clientY
  const diffX = touchStartX - touchEndX
  const diffY = touchStartY - touchEndY
  
  // 判断是水平滑动还是垂直滑动
  if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
    if (diffX > 0 && hasNext.value) {
      // 向左滑动，显示下一张
      next()
    } else if (diffX < 0 && hasPrev.value) {
      // 向右滑动，显示上一张
      prev()
    }
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
  window.addEventListener('touchstart', handleTouchStart)
  window.addEventListener('touchend', handleTouchEnd)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
  window.removeEventListener('touchstart', handleTouchStart)
  window.removeEventListener('touchend', handleTouchEnd)
  document.body.style.overflow = ''
})
</script>

<style scoped>
.media-viewer {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.viewer-content {
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.close-btn {
  position: absolute;
  top: -50px;
  right: 0;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  font-size: 28px;
  cursor: pointer;
  color: var(--color-text);
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  transition: all 0.3s ease;
  z-index: 1001;
}

.close-btn:hover {
  background: white;
  transform: scale(1.1);
}

.nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.9);
  border: none;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  cursor: pointer;
  color: var(--color-text);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 1001;
}

.nav-btn:hover {
  background: white;
  transform: translateY(-50%) scale(1.1);
}

.prev-btn {
  left: -70px;
}

.next-btn {
  right: -70px;
}

.nav-btn svg {
  width: 24px;
  height: 24px;
}

.media-wrapper {
  max-width: 100%;
  max-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.media-wrapper img,
.media-wrapper video {
  max-width: 100%;
  max-height: 80vh;
  border-radius: 8px;
  object-fit: contain;
}

.viewer-info {
  margin-top: 20px;
  text-align: center;
  color: white;
}

.viewer-counter {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 8px;
}

.viewer-caption {
  font-size: 16px;
  color: white;
  max-width: 600px;
  line-height: 1.5;
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
  .nav-btn {
    width: 40px;
    height: 40px;
  }
  
  .nav-btn svg {
    width: 20px;
    height: 20px;
  }
  
  .prev-btn {
    left: 10px;
  }
  
  .next-btn {
    right: 10px;
  }
  
  .close-btn {
    top: 10px;
    right: 10px;
    width: 36px;
    height: 36px;
    font-size: 24px;
  }
  
  .viewer-caption {
    font-size: 14px;
    padding: 0 20px;
  }
}
</style>

