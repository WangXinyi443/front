<template>
  <div class="story-view" v-if="story">
    <!-- 章节头部 -->
    <header class="story-header">
      <div class="header-content">
        <button class="back-btn" @click="goHome">← 返回地图</button>
        <h1 class="story-title">{{ story.name }}</h1>
        <p class="story-subtitle">{{ story.title }}</p>
        <!-- 收藏和分享按钮 -->
        <div class="header-actions">
          <FavoriteButton :story-id="story.id" />
          <ShareButton 
            :title="story.name" 
            :desc="story.title"
            :img-url="story.coverImage"
          />
        </div>
        <div class="scroll-indicator">
          <span>向下滚动</span>
          <div class="arrow-down">↓</div>
        </div>
      </div>
    </header>

    <!-- 故事内容区域 -->
    <main class="story-content">
      <!-- 人物引入 -->
      <section class="intro-section">
        <div class="intro-content">
          <div class="intro-text">
            <p class="intro-paragraph">{{ story.intro }}</p>
          </div>
          <div class="intro-image">
            <img 
              :src="story.coverImage" 
              :alt="story.name"
              loading="eager"
              fetchpriority="high"
              decoding="async"
              @error="handleImageError"
            />
          </div>
        </div>
      </section>

      <!-- 各个章节 -->
      <section 
        v-for="(section, index) in story.sections" 
        :key="index"
        class="story-section"
        :class="`section-${section.type}`"
      >
        <h2 class="section-title">{{ section.title }}</h2>
        
        <!-- 文本图片布局 -->
        <div v-if="section.type === 'text-image'" class="text-image-layout">
          <div class="text-content">
            <p>{{ section.content }}</p>
          </div>
          <div class="image-content">
            <img 
              :src="section.image" 
              :alt="section.title"
              loading="lazy"
              @error="handleImageError"
            />
          </div>
        </div>

        <!-- 媒体画廊 -->
        <div v-if="section.type === 'gallery'" class="media-gallery">
          <div class="gallery-container">
            <!-- 图片网格 -->
            <div class="gallery-grid">
              <div 
                v-for="(item, idx) in section.media.filter(m => m.type === 'image')" 
                :key="idx"
                class="gallery-item"
                @click="openMediaViewer(item)"
              >
                <div class="media-wrapper">
                  <img 
                    :src="item.src" 
                    :alt="item.caption"
                    loading="lazy"
                    @error="handleImageError"
                  />
                  <div class="media-caption">{{ item.caption }}</div>
                </div>
              </div>
            </div>
            
            <!-- 视频区域 - 单独突出显示 -->
            <div 
              v-for="(item, idx) in section.media.filter(m => m.type === 'video')" 
              :key="`video-${idx}`"
              class="video-featured"
            >
              <h3 class="video-title">视频：{{ item.caption }}</h3>
              <div class="video-wrapper">
                <video 
                  :src="item.src" 
                  :poster="item.poster"
                  controls
                  preload="metadata"
                  class="featured-video"
                ></video>
              </div>
            </div>
          </div>
        </div>

        <!-- 影响展示 -->
        <div v-if="section.type === 'impact'" class="impact-section">
          <p class="impact-text">{{ section.content }}</p>
          <div class="impact-images">
            <img 
              v-for="(img, idx) in section.images" 
              :key="idx"
              :src="img" 
              alt="影响展示"
              loading="lazy"
              @error="handleImageError"
            />
          </div>
        </div>
      </section>

      <!-- 人物心声 -->
      <section class="quote-section">
        <div class="quote-content">
          <blockquote class="quote-text">{{ story.quote }}</blockquote>
          <p class="quote-author">—— {{ story.name }}</p>
        </div>
      </section>
    </main>

    <!-- 章节导航栏 -->
    <nav class="story-nav">
      <button class="nav-btn" @click="goHome">返回地图</button>
      <button 
        v-if="prevStory" 
        class="nav-btn" 
        @click="goToStory(prevStory.id)"
      >
        ← 上一个故事
      </button>
      <button 
        v-if="nextStory" 
        class="nav-btn" 
        @click="goToStory(nextStory.id)"
      >
        下一个故事 →
      </button>
      <button class="nav-btn" @click="goToAbout">查看所有故事</button>
    </nav>

    <!-- 媒体查看器 -->
    <MediaViewer
      :visible="showMediaViewer"
      :media-list="allMediaList"
      :initial-index="currentMediaIndex"
      @update:visible="showMediaViewer = $event"
      @close="closeMediaViewer"
    />
    
    <!-- 返回顶部按钮 -->
    <BackToTop />
  </div>
  <div v-else class="loading">
    <p>加载中...</p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { stories } from '../data/stories.js'
import FavoriteButton from '../components/FavoriteButton.vue'
import ShareButton from '../components/ShareButton.vue'
import MediaViewer from '../components/MediaViewer.vue'
import BackToTop from '../components/BackToTop.vue'

const router = useRouter()
const route = useRoute()
const showMediaViewer = ref(false)
const currentMediaIndex = ref(0)

// 使用computed使storyId响应路由变化
const storyId = computed(() => {
  return parseInt(route.params.id) || 1
})

const story = computed(() => {
  return stories.find(s => s.id === storyId.value)
})

const currentIndex = computed(() => {
  return stories.findIndex(s => s.id === storyId.value)
})

const prevStory = computed(() => {
  const index = currentIndex.value
  return index > 0 ? stories[index - 1] : null
})

const nextStory = computed(() => {
  const index = currentIndex.value
  return index < stories.length - 1 ? stories[index + 1] : null
})

const goHome = () => {
  router.push('/')
  // 跳转到页面顶部
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const goToStory = (id) => {
  router.push(`/story/${id}`)
  // 跳转到页面顶部
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const goToAbout = () => {
  router.push('/about')
  // 跳转到页面顶部
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// 监听路由变化，确保切换故事时滚动到顶部
watch(() => route.params.id, () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
})

// 收集所有媒体（用于查看器滑动）
const allMediaList = computed(() => {
  if (!story.value) return []
  const mediaList = []
  story.value.sections.forEach(section => {
    if (section.type === 'gallery' && section.media) {
      section.media.forEach(item => {
        if (item.type === 'image') {
          mediaList.push(item)
        }
      })
    }
  })
  return mediaList
})

const openMediaViewer = (media) => {
  // 找到当前媒体在列表中的索引
  const index = allMediaList.value.findIndex(m => 
    m.src === media.src || (m.caption === media.caption && m.type === media.type)
  )
  currentMediaIndex.value = index >= 0 ? index : 0
  showMediaViewer.value = true
}

const closeMediaViewer = () => {
  showMediaViewer.value = false
}

const handleImageError = (e) => {
  console.error('图片加载失败:', e.target.src)
  const src = e.target.src
  if (src.includes('.png')) {
    // 如果PNG加载失败，尝试JPG
    const jpgSrc = src.replace('.png', '.jpg')
    console.log('尝试加载备用图片:', jpgSrc)
    e.target.src = jpgSrc
  } else {
    e.target.style.opacity = '0.5'
    e.target.alt = '图片加载失败'
  }
}

const handleImageLoad = (e) => {
  console.log('图片加载成功:', e.target.src)
}

onMounted(() => {
  // 页面加载时滚动到顶部
  window.scrollTo({ top: 0, behavior: 'auto' })
  
  // 预加载当前故事的图片
  if (story.value) {
    import('../utils/imagePreload.js').then(({ addPreloadLink, preloadImages }) => {
      // 预加载封面图
      addPreloadLink(story.value.coverImage, 'image')
      
      // 预加载章节图片（后台）
      const sectionImages = story.value.sections
        .filter(s => s.image)
        .map(s => s.image)
      
      const galleryImages = story.value.sections
        .filter(s => s.type === 'gallery')
        .flatMap(s => s.media.filter(m => m.type === 'image').map(m => m.src))
      
      const allImages = [...sectionImages, ...galleryImages]
      preloadImages(allImages)
    })
  }
  
  // 滚动动画观察器
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible')
      }
    })
  }, observerOptions)

  const sections = document.querySelectorAll('.story-section')
  sections.forEach(section => observer.observe(section))
})
</script>

<style scoped>
.story-view {
  min-height: 100vh;
  background: transparent;
  position: relative;
}

.story-header {
  position: relative;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
  color: white;
  text-align: center;
  padding: 20px;
}

.header-content {
  max-width: 800px;
}

.back-btn {
  position: absolute;
  top: 30px;
  left: 30px;
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid white;
  color: white;
  padding: 10px 20px;
  border-radius: 25px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateX(-5px);
}

.story-title {
  font-size: 48px;
  font-weight: bold;
  margin-bottom: 10px;
  font-family: var(--font-family-serif);
}

.story-subtitle {
  font-size: 20px;
  opacity: 0.9;
  margin-bottom: 40px;
}

.scroll-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin-top: 40px;
  opacity: 0.8;
}

.arrow-down {
  font-size: 32px;
  animation: bounce 2s infinite;
}

.story-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.intro-section {
  padding: 80px 0;
  min-height: 100vh;
  display: flex;
  align-items: center;
}

.intro-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
  background: var(--color-card-bg);
  backdrop-filter: blur(10px);
  border-radius: var(--border-radius);
  padding: 40px;
  box-shadow: 0 8px 32px var(--color-card-shadow);
  border: 1px solid rgba(255, 255, 255, 0.8);
}

.intro-text {
  font-size: 18px;
  line-height: 1.8;
  color: var(--color-text);
}

.intro-image {
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.intro-image img {
  width: 100%;
  height: auto;
  display: block;
}

.story-section {
  padding: 100px 0;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s ease;
  background: var(--color-card-bg);
  backdrop-filter: blur(10px);
  border-radius: var(--border-radius);
  margin: 30px 0;
  padding: 60px 40px;
  box-shadow: 0 8px 32px var(--color-card-shadow);
  border: 1px solid rgba(255, 255, 255, 0.8);
}

.story-section.visible {
  opacity: 1;
  transform: translateY(0);
}

.section-title {
  font-size: 36px;
  font-weight: bold;
  margin-bottom: 40px;
  text-align: center;
  color: var(--color-primary);
  font-family: var(--font-family-serif);
}

.text-image-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
}

.text-content {
  font-size: 16px;
  line-height: 1.8;
  color: var(--color-text);
}

.image-content img {
  width: 100%;
  border-radius: var(--border-radius);
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
}

.media-gallery {
  margin-top: 40px;
}

.gallery-container {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
}

.video-featured {
  margin: 40px 0;
  padding: 30px;
  background: var(--color-card-bg);
  backdrop-filter: blur(10px);
  border-radius: var(--border-radius);
  box-shadow: 0 8px 32px var(--color-card-shadow);
  border: 1px solid rgba(255, 255, 255, 0.8);
}

.video-title {
  font-size: 20px;
  font-weight: bold;
  color: var(--color-primary);
  margin-bottom: 20px;
  text-align: center;
}

.video-wrapper {
  position: relative;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

.featured-video {
  width: 100%;
  height: auto;
  display: block;
  background: #000;
}

.gallery-item {
  cursor: pointer;
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.gallery-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.media-wrapper {
  position: relative;
}

.media-wrapper img,
.media-wrapper video {
  width: 100%;
  height: auto;
  display: block;
}

.media-caption {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
  color: white;
  padding: 15px;
  font-size: 14px;
}

.impact-section {
  text-align: center;
}

.impact-text {
  font-size: 18px;
  line-height: 1.8;
  margin-bottom: 40px;
  color: var(--color-text);
}

.impact-images {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.impact-images img {
  width: 100%;
  border-radius: var(--border-radius);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.quote-section {
  padding: 150px 0;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-card-bg);
  backdrop-filter: blur(10px);
  border-radius: var(--border-radius);
  text-align: center;
  box-shadow: 0 8px 32px var(--color-card-shadow);
  border: 1px solid rgba(255, 255, 255, 0.8);
  margin: 30px 0;
  padding: 60px 40px;
}

.quote-content {
  max-width: 800px;
  padding: 60px;
}

.quote-text {
  font-size: 32px;
  font-style: italic;
  line-height: 1.6;
  color: var(--color-text);
  margin-bottom: 30px;
  font-family: var(--font-family-serif);
}

.quote-author {
  font-size: 18px;
  color: var(--color-text-light);
}

.story-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(249, 245, 240, 0.95);
  backdrop-filter: blur(10px);
  padding: 20px;
  display: flex;
  justify-content: center;
  gap: 15px;
  flex-wrap: wrap;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  z-index: 50;
}

.nav-btn {
  padding: 12px 24px;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.nav-btn:hover {
  background: var(--color-secondary);
  transform: translateY(-2px);
}


.loading {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: var(--color-text-light);
}

@media (max-width: 768px) {
  .story-title {
    font-size: 32px;
  }
  
  .intro-content,
  .text-image-layout {
    grid-template-columns: 1fr;
  }
  
  .gallery-grid {
    grid-template-columns: 1fr;
  }
  
  .video-featured {
    padding: 20px;
    margin: 30px 0;
  }
  
  .video-title {
    font-size: 18px;
  }
  
  .video-wrapper {
    max-width: 100%;
  }
  
  .quote-text {
    font-size: 24px;
  }
  
  .story-nav {
    flex-direction: column;
  }
  
  .nav-btn {
    width: 100%;
  }
}
</style>

