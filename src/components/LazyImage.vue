<template>
  <div ref="wrapperRef" class="lazy-image-wrapper" :class="{ loaded: isLoaded, error: hasError }" :data-src="src">
    <!-- 加载占位符 - 简化版，不显示转圈 -->
    <div v-if="!isLoaded && !hasError" class="image-placeholder">
      <!-- 只显示简单的背景，不显示转圈动画 -->
    </div>
    
    <!-- 错误占位符 -->
    <div v-if="hasError" class="image-error">
      <span>图片加载失败</span>
    </div>
    
    <!-- 实际图片 -->
    <img
      v-show="isLoaded && !hasError"
      :src="imageSrc"
      :alt="alt"
      :class="imageClass"
      @load="onImageLoad"
      @error="onImageError"
      :loading="lazy ? 'lazy' : 'eager'"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'

const props = defineProps({
  src: {
    type: String,
    required: true
  },
  alt: {
    type: String,
    default: ''
  },
  imageClass: {
    type: String,
    default: ''
  },
  lazy: {
    type: Boolean,
    default: true
  },
  showLoadingText: {
    type: Boolean,
    default: false
  },
  // 预加载：立即加载，不等待进入视口
  preload: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['load', 'error'])

const isLoaded = ref(false)
const hasError = ref(false)
const imageSrc = ref('')
const wrapperRef = ref(null)

// 检查元素是否在视口内
const isInViewport = (element) => {
  if (!element) return false
  const rect = element.getBoundingClientRect()
  return (
    rect.top >= -100 &&
    rect.left >= -100 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + 100 &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth) + 100
  )
}

// 初始化图片源
const initImageSrc = () => {
  if (!props.lazy || props.preload) {
    // 不需要懒加载或需要预加载，直接设置
    imageSrc.value = props.src
    return
  }
  
  // 懒加载：检查是否已经在视口内
  nextTick(() => {
    if (wrapperRef.value && isInViewport(wrapperRef.value)) {
      // 已经在视口内，立即加载
      imageSrc.value = props.src
    } else {
      // 不在视口内，等待进入视口
      imageSrc.value = ''
      setupLazyLoad()
    }
  })
}

// 初始状态
imageSrc.value = props.preload ? props.src : ''

let observer = null

const onImageLoad = (e) => {
  isLoaded.value = true
  hasError.value = false
  emit('load', e)
}

const onImageError = (e) => {
  hasError.value = true
  isLoaded.value = false
  
  // 尝试加载备用图片（.jpg）
  const src = e.target.src
  if (src.includes('.png') && !src.includes('.jpg')) {
    const jpgSrc = src.replace('.png', '.jpg')
    imageSrc.value = jpgSrc
    hasError.value = false // 重置错误状态，尝试加载 JPG
  } else {
    emit('error', e)
  }
}

// 懒加载逻辑
const setupLazyLoad = () => {
  if (!props.lazy || props.preload || imageSrc.value) {
    return
  }

  // 使用 Intersection Observer
  if ('IntersectionObserver' in window) {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // 进入视口，开始加载图片
            imageSrc.value = props.src
            if (observer) {
              observer.unobserve(entry.target)
              observer.disconnect()
              observer = null
            }
          }
        })
      },
      {
        rootMargin: '200px' // 提前200px开始加载，减少转圈时间
      }
    )

    // 观察占位符元素
    nextTick(() => {
      if (wrapperRef.value && !imageSrc.value) {
        observer.observe(wrapperRef.value)
      }
    })
  } else {
    // 不支持 Intersection Observer，直接加载
    imageSrc.value = props.src
  }
}

onMounted(() => {
  initImageSrc()
})

// 监听 src 变化
watch(() => props.src, (newSrc) => {
  if (!props.lazy || props.preload) {
    imageSrc.value = newSrc
  }
})
</script>

<style scoped>
.lazy-image-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #f5f5f5;
}

.image-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #f5f5f5;
  /* 移除动画，减少视觉干扰 */
}

/* 移除不再使用的样式 */

.image-error {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  color: #999;
  font-size: 14px;
}

.lazy-image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.lazy-image-wrapper.loaded img {
  opacity: 1;
}

/* 图片加载时立即显示，减少闪烁 */
.lazy-image-wrapper img[src] {
  display: block;
}

.lazy-image-wrapper.error img {
  display: none;
}
</style>

