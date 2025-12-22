<template>
  <div class="home-view">
    <!-- 音乐控制按钮 -->
    <div class="music-control" @click="toggleMusic">
      <div class="music-icon" :class="{ playing: isPlaying }">
        <svg v-if="!isPlaying" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polygon points="5 3 19 12 5 21 5 3"></polygon>
        </svg>
        <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="6" y="4" width="4" height="16"></rect>
          <rect x="14" y="4" width="4" height="16"></rect>
        </svg>
      </div>
      <div class="music-waves" v-if="isPlaying">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>

    <!-- Hero区域 - 大背景图 -->
    <section class="hero-section">
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <h1 class="hero-title">青年涟漪</h1>
        <p class="hero-subtitle">李佳欣女士学习李富贵的温暖故事</p>
        <p class="hero-description">一个乡村女性，受到李富贵的启发，用理发和做饭两个行动，在社区中激起温暖的涟漪</p>
      </div>
      <div class="scroll-hint">
        <span>向下探索</span>
        <div class="scroll-arrow">↓</div>
      </div>
    </section>

    <!-- 故事卡片区域 -->
    <section class="stories-section">
      <div class="container">
        <h2 class="section-title">探索故事</h2>
        <p class="section-subtitle">点击卡片，走进他们的世界</p>
        
        <div class="stories-grid">
          <div 
            v-for="story in stories" 
            :key="story.id"
            class="story-card"
            @click="goToStory(story.id)"
          >
            <div class="card-image-wrapper">
              <img 
                :src="story.coverImage" 
                :alt="story.name" 
                class="card-image"
                @error="handleImageError"
                @load="handleImageLoad"
              />
              <div class="card-overlay">
                <div class="card-badge">{{ story.tag || story.title }}</div>
              </div>
            </div>
            <div class="card-content">
              <h3 class="card-title">{{ story.name }}</h3>
              <p class="card-subtitle">{{ story.title }}</p>
              <p class="card-description">{{ story.intro }}</p>
              <div class="card-stats">
                <div class="stat-item">
                  <span class="stat-value">{{ story.stats?.volunteers || 0 }}</span>
                  <span class="stat-label">志愿者</span>
                </div>
                <div class="stat-item">
                  <span class="stat-value">{{ story.stats?.elders || 0 }}</span>
                  <span class="stat-label">受益老人</span>
                </div>
              </div>
              <button class="card-button">查看故事 →</button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 底部导航 -->
    <footer class="home-footer">
      <div class="footer-content">
        <p class="footer-text">从涟漪到浪潮，每一个青年都是故乡的希望</p>
        <button class="footer-button" @click="goToAbout">查看所有故事</button>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { stories } from '../data/stories.js'

// 获取资源路径（支持 GitHub Pages 子路径部署）
function getAssetPath(path) {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }
  const base = import.meta.env.BASE_URL || '/'
  const cleanPath = path.startsWith('/') ? path.slice(1) : path
  const fullPath = base + cleanPath
  return fullPath.replace(/([^:]\/)\/+/g, '$1')
}

const router = useRouter()
const bgmAudio = ref(null)
const isPlaying = ref(false)

onMounted(() => {
  // 初始化BGM（不自动播放）
  initBGM()
  
  // 滚动动画
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

  const cards = document.querySelectorAll('.story-card')
  cards.forEach(card => observer.observe(card))
})

// 页面卸载时停止音乐
onBeforeUnmount(() => {
  if (bgmAudio.value) {
    bgmAudio.value.pause()
    bgmAudio.value.currentTime = 0
    bgmAudio.value = null
    isPlaying.value = false
    console.log('BGM已停止并清理')
  }
})

const initBGM = () => {
  // 如果已经初始化，直接返回
  if (bgmAudio.value) {
    return
  }
  
  // 使用本地音频文件
  const audio = new Audio(getAssetPath('/videos/lifugui/zm.mp3'))
  audio.loop = true
  audio.volume = 0.3
  audio.preload = 'auto'
  
  // 监听播放状态变化
  audio.addEventListener('play', () => {
    isPlaying.value = true
    console.log('音乐开始播放')
  })
  
  audio.addEventListener('pause', () => {
    isPlaying.value = false
    console.log('音乐已暂停')
  })
  
  audio.addEventListener('ended', () => {
    isPlaying.value = false
  })
  
  audio.addEventListener('error', (e) => {
    console.error('音频加载错误:', e)
    isPlaying.value = false
  })
 
  bgmAudio.value = audio
  // 不自动播放，等待用户手动点击
}

const toggleMusic = () => {
  // 确保音频已初始化
  if (!bgmAudio.value) {
    initBGM()
    return
  }
  
  const audio = bgmAudio.value
  
  // 直接检查播放状态并切换
  if (audio.paused) {
    // 如果暂停，则播放
    audio.play().then(() => {
      // 状态会通过play事件监听器自动更新
    }).catch(err => {
      console.error('播放失败:', err)
      isPlaying.value = false
    })
  } else {
    // 如果正在播放，则暂停
    audio.pause()
    // pause事件会触发，状态会自动更新
  }
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

const handleImageError = (e) => {
  console.error('图片加载失败:', e.target.src)
  const src = e.target.src
  if (src.includes('.png')) {
    const jpgSrc = src.replace('.png', '.jpg')
    console.log('尝试加载备用图片:', jpgSrc)
    e.target.src = jpgSrc
  }
}

const handleImageLoad = (e) => {
  console.log('图片加载成功:', e.target.src)
}
</script>

<style scoped>
.home-view {
  min-height: 100vh;
  background: #fafafa;
}

/* Hero区域 */
.hero-section {
  position: relative;
  height: 100vh;
  min-height: 600px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1920&q=80') center/cover;
  opacity: 0.2;
  animation: zoom 20s infinite alternate;
}

@keyframes zoom {
  0% { transform: scale(1); }
  100% { transform: scale(1.1); }
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.8) 0%, rgba(118, 75, 162, 0.8) 100%);
}

.hero-content {
  position: relative;
  z-index: 2;
  text-align: center;
  color: white;
  padding: 0 20px;
  animation: fadeInUp 1s ease;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.hero-title {
  font-size: 72px;
  font-weight: bold;
  margin-bottom: 20px;
  text-shadow: 2px 2px 10px rgba(0, 0, 0, 0.3);
  font-family: var(--font-family-serif);
}

.hero-subtitle {
  font-size: 32px;
  margin-bottom: 30px;
  opacity: 0.95;
  font-weight: 300;
}

.hero-description {
  font-size: 20px;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.8;
  opacity: 0.9;
}

.scroll-hint {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
  color: white;
  text-align: center;
  animation: bounce 2s infinite;
}

.scroll-hint span {
  display: block;
  font-size: 14px;
  margin-bottom: 10px;
  opacity: 0.8;
}

.scroll-arrow {
  font-size: 24px;
}

@keyframes bounce {
  0%, 100% { transform: translateX(-50%) translateY(0); }
  50% { transform: translateX(-50%) translateY(10px); }
}

/* 故事卡片区域 */
.stories-section {
  padding: 100px 20px;
  background: #fafafa;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.section-title {
  font-size: 48px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 15px;
  color: #333;
  font-family: var(--font-family-serif);
}

.section-subtitle {
  font-size: 18px;
  text-align: center;
  color: #666;
  margin-bottom: 60px;
}

.stories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 40px;
  margin-top: 60px;
}

.story-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  opacity: 0;
  transform: translateY(30px);
}

.story-card.visible {
  opacity: 1;
  transform: translateY(0);
}

.story-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
}

.card-image-wrapper {
  position: relative;
  width: 100%;
  height: 300px;
  overflow: hidden;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.story-card:hover .card-image {
  transform: scale(1.1);
}

.card-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.3) 100%);
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  padding: 20px;
}

.card-badge {
  background: rgba(255, 255, 255, 0.9);
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  color: var(--color-primary);
  font-weight: 500;
}

.card-content {
  padding: 30px;
}

.card-title {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #333;
}

.card-subtitle {
  font-size: 16px;
  color: var(--color-primary);
  margin-bottom: 15px;
  font-weight: 500;
}

.card-description {
  font-size: 15px;
  color: #666;
  line-height: 1.6;
  margin-bottom: 20px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-stats {
  display: flex;
  gap: 30px;
  margin-bottom: 25px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.stat-item {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: var(--color-primary);
  margin-bottom: 5px;
}

.stat-label {
  font-size: 12px;
  color: #999;
  text-transform: uppercase;
}

.card-button {
  width: 100%;
  padding: 14px;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.card-button:hover {
  background: var(--color-secondary);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(230, 160, 72, 0.3);
}

/* 底部 */
.home-footer {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 80px 20px;
  text-align: center;
  color: white;
}

.footer-content {
  max-width: 600px;
  margin: 0 auto;
}

.footer-text {
  font-size: 20px;
  margin-bottom: 30px;
  line-height: 1.6;
}

.footer-button {
  padding: 16px 40px;
  background: white;
  color: #667eea;
  border: none;
  border-radius: 30px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.footer-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}

/* 音乐控制按钮 */
.music-control {
  position: fixed;
  top: 30px;
  right: 30px;
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 12px 20px;
  border-radius: 50px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  transition: all 0.3s ease;
  user-select: none;
}

.music-control:hover {
  background: rgba(255, 255, 255, 1);
  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.2);
  transform: translateY(-2px);
}

.music-icon {
  width: 24px;
  height: 24px;
  color: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;
}

.music-control:hover .music-icon {
  transform: scale(1.1);
}

.music-icon svg {
  width: 100%;
  height: 100%;
}

.music-waves {
  display: flex;
  align-items: center;
  gap: 4px;
  height: 20px;
}

.music-waves span {
  width: 3px;
  background: var(--color-primary);
  border-radius: 2px;
  animation: wave 1.2s ease-in-out infinite;
}

.music-waves span:nth-child(1) {
  height: 8px;
  animation-delay: 0s;
}

.music-waves span:nth-child(2) {
  height: 16px;
  animation-delay: 0.2s;
}

.music-waves span:nth-child(3) {
  height: 12px;
  animation-delay: 0.4s;
}

@keyframes wave {
  0%, 100% {
    transform: scaleY(0.5);
    opacity: 0.7;
  }
  50% {
    transform: scaleY(1);
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .music-control {
    top: 20px;
    right: 20px;
    padding: 10px 16px;
  }
  
  .music-icon {
    width: 20px;
    height: 20px;
  }
  
  .music-waves {
    height: 16px;
  }
  
  .music-waves span {
    width: 2px;
  }
  
  .hero-title {
    font-size: 48px;
  }
  
  .hero-subtitle {
    font-size: 24px;
  }
  
  .hero-description {
    font-size: 16px;
  }
  
  .section-title {
    font-size: 36px;
  }
  
  .stories-grid {
    grid-template-columns: 1fr;
    gap: 30px;
  }
  
  .card-image-wrapper {
    height: 250px;
  }
}
</style>
