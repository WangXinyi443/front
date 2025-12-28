<template>
  <div class="explore-view">
    <!-- 返回按钮 -->
    <button class="back-button" @click="goHome">
      <span class="back-icon">←</span>
      <span>返回首页</span>
    </button>

    <!-- 标题区域 -->
    <header class="explore-header">
      <h1 class="main-title">探索故事</h1>
      <p class="subtitle">发现更多温暖的故事，感受青年的力量</p>
    </header>

    <!-- 搜索和筛选区域 -->
    <section class="search-section">
      <div class="search-container">
        <div class="search-box">
          <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          <input 
            v-model="searchQuery"
            type="text"
            placeholder="搜索故事、人物、地点..."
            class="search-input"
            @input="handleSearch"
          />
          <button 
            v-if="searchQuery" 
            class="clear-search" 
            @click="clearSearch"
            aria-label="清除搜索"
          >
            ×
          </button>
        </div>
        
        <!-- 标签筛选 -->
        <div class="tags-filter">
          <span class="filter-label">筛选：</span>
          <div class="tags-list">
            <button 
              v-for="tag in tags" 
              :key="tag"
              class="tag-btn"
              :class="{ active: selectedTag === tag }"
              @click="toggleTag(tag)"
            >
              {{ tag }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- 故事列表 -->
    <section class="stories-section">
      <div class="stories-container">
        <div v-if="filteredStories.length === 0" class="empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          <p class="empty-text">没有找到匹配的故事</p>
          <button class="reset-btn" @click="resetFilters">重置筛选</button>
        </div>
        
        <div v-else class="stories-grid">
          <div 
            v-for="story in filteredStories" 
            :key="story.id"
            class="story-card"
            @click="goToStory(story.id)"
          >
            <div class="card-image-wrapper">
              <img 
                :src="story.coverImage" 
                :alt="story.name" 
                class="card-image"
                loading="lazy"
              />
              <div class="card-overlay">
                <div class="card-badge">{{ story.tag || story.title }}</div>
              </div>
            </div>
            <div class="card-content">
              <h3 class="card-title">{{ story.name }}</h3>
              <p class="card-subtitle">{{ story.title }}</p>
              <p class="card-description">{{ story.intro }}</p>
              <div class="card-meta">
                <span class="meta-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                  {{ story.location }}
                </span>
                <span class="meta-item" v-if="story.stats?.volunteers">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                  {{ story.stats.volunteers }} 志愿者
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 时间线视图 -->
    <section class="timeline-section">
      <h2 class="section-title">故事时间线</h2>
      <div class="timeline-container">
        <div 
          v-for="(story, index) in stories" 
          :key="story.id"
          class="timeline-item"
          :class="{ 'reverse': index % 2 === 1 }"
        >
          <div class="timeline-dot"></div>
          <div class="timeline-content">
            <div class="timeline-card" @click="goToStory(story.id)">
              <div class="timeline-image">
                <img :src="story.coverImage" :alt="story.name" loading="lazy" />
              </div>
              <div class="timeline-info">
                <h3 class="timeline-title">{{ story.name }}</h3>
                <p class="timeline-subtitle">{{ story.title }}</p>
                <p class="timeline-location">{{ story.location }}</p>
                <p class="timeline-description">{{ story.intro }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 统计信息 -->
    <section class="stats-section">
      <h2 class="section-title">数据统计</h2>
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
          <div class="stat-value">{{ totalVolunteers }}</div>
          <div class="stat-label">总志愿者数</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
          <div class="stat-value">{{ totalElders }}</div>
          <div class="stat-label">受益老人数</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          <div class="stat-value">{{ stories.length }}</div>
          <div class="stat-label">故事总数</div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
          </div>
          <div class="stat-value">{{ uniqueLocations }}</div>
          <div class="stat-label">覆盖地区</div>
        </div>
      </div>
    </section>

    <!-- 返回顶部按钮 -->
    <BackToTop />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { stories } from '../data/stories.js'
import BackToTop from '../components/BackToTop.vue'

const router = useRouter()
const searchQuery = ref('')
const selectedTag = ref('全部')

// 所有标签
const tags = computed(() => {
  const tagSet = new Set(['全部'])
  stories.forEach(story => {
    if (story.tag) {
      tagSet.add(story.tag)
    }
  })
  return Array.from(tagSet)
})

// 筛选后的故事
const filteredStories = computed(() => {
  let result = stories

  // 搜索筛选
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(story => 
      story.name.toLowerCase().includes(query) ||
      story.title.toLowerCase().includes(query) ||
      story.location.toLowerCase().includes(query) ||
      story.intro.toLowerCase().includes(query)
    )
  }

  // 标签筛选
  if (selectedTag.value !== '全部') {
    result = result.filter(story => story.tag === selectedTag.value)
  }

  return result
})

// 统计数据
const totalVolunteers = computed(() => {
  return stories.reduce((sum, s) => sum + (s.stats?.volunteers || 0), 0)
})

const totalElders = computed(() => {
  return stories.reduce((sum, s) => sum + (s.stats?.elders || 0), 0)
})

const uniqueLocations = computed(() => {
  const locations = new Set(stories.map(s => s.location))
  return locations.size
})

const handleSearch = () => {
  // 搜索逻辑已在 computed 中处理
}

const clearSearch = () => {
  searchQuery.value = ''
}

const toggleTag = (tag) => {
  selectedTag.value = tag
}

const resetFilters = () => {
  searchQuery.value = ''
  selectedTag.value = '全部'
}

const goToStory = (id) => {
  router.push(`/story/${id}`)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const goHome = () => {
  router.push('/')
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
})
</script>

<style scoped>
.explore-view {
  min-height: 100vh;
  background: transparent;
  padding-bottom: 60px;
  position: relative;
}

.back-button {
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 100;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 2px solid var(--color-primary);
  border-radius: 25px;
  cursor: pointer;
  font-size: 16px;
  color: var(--color-primary);
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.back-button:hover {
  background: var(--color-primary);
  color: white;
  transform: translateY(-2px);
}

.back-icon {
  font-size: 20px;
}

.explore-header {
  text-align: center;
  padding: 100px 20px 60px;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
  color: white;
}

.main-title {
  font-size: 48px;
  font-weight: bold;
  margin-bottom: 15px;
  font-family: var(--font-family-serif);
}

.subtitle {
  font-size: 18px;
  opacity: 0.95;
}

/* 搜索区域 */
.search-section {
  max-width: 1200px;
  margin: -40px auto 60px;
  padding: 0 20px;
  position: relative;
  z-index: 10;
}

.search-container {
  background: var(--color-card-bg);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 8px 32px var(--color-card-shadow);
  border: 1px solid rgba(255, 255, 255, 0.8);
}

.search-box {
  position: relative;
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.search-icon {
  position: absolute;
  left: 16px;
  width: 20px;
  height: 20px;
  color: #999;
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 14px 16px 14px 48px;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  font-size: 16px;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: var(--color-primary);
}

.clear-search {
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  font-size: 24px;
  color: #999;
  cursor: pointer;
  padding: 4px;
  line-height: 1;
  transition: color 0.2s ease;
}

.clear-search:hover {
  color: var(--color-text);
}

.tags-filter {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.filter-label {
  font-weight: 500;
  color: var(--color-text);
}

.tags-list {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tag-btn {
  padding: 8px 16px;
  background: var(--color-background);
  border: 2px solid #e0e0e0;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  color: var(--color-text);
  transition: all 0.3s ease;
}

.tag-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.tag-btn.active {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
}

/* 故事列表 */
.stories-section {
  max-width: 1200px;
  margin: 0 auto 80px;
  padding: 0 20px;
}

.stories-container {
  width: 100%;
}

.empty-state {
  text-align: center;
  padding: 80px 20px;
  color: var(--color-text-light);
}

.empty-state svg {
  width: 80px;
  height: 80px;
  margin: 0 auto 20px;
  color: #ddd;
}

.empty-text {
  font-size: 18px;
  margin-bottom: 20px;
  color: var(--color-text);
}

.reset-btn {
  padding: 12px 24px;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s ease;
}

.reset-btn:hover {
  background: var(--color-secondary);
  transform: translateY(-2px);
}

.stories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
}

.story-card {
  background: var(--color-card-bg);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 32px var(--color-card-shadow);
  border: 1px solid rgba(255, 255, 255, 0.8);
  cursor: pointer;
  transition: all 0.3s ease;
}

.story-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 16px 48px rgba(102, 126, 234, 0.2);
  border-color: rgba(102, 126, 234, 0.3);
}

.card-image-wrapper {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
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
  padding: 15px;
}

.card-badge {
  background: rgba(255, 255, 255, 0.9);
  padding: 6px 12px;
  border-radius: 15px;
  font-size: 12px;
  color: var(--color-primary);
  font-weight: 500;
}

.card-content {
  padding: 20px;
}

.card-title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 8px;
  color: var(--color-text);
}

.card-subtitle {
  font-size: 14px;
  color: var(--color-primary);
  margin-bottom: 10px;
}

.card-description {
  font-size: 14px;
  color: var(--color-text-light);
  line-height: 1.6;
  margin-bottom: 15px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-meta {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  padding-top: 15px;
  border-top: 1px solid #eee;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--color-text-light);
}

.meta-item svg {
  width: 14px;
  height: 14px;
}

/* 时间线 */
.timeline-section {
  max-width: 1200px;
  margin: 0 auto 80px;
  padding: 0 20px;
}

.section-title {
  font-size: 36px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 50px;
  color: var(--color-text);
  font-family: var(--font-family-serif);
}

.timeline-container {
  position: relative;
  padding: 20px 0;
}

.timeline-container::before {
  content: '';
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 2px;
  background: var(--color-primary);
  transform: translateX(-50%);
}

.timeline-item {
  position: relative;
  margin-bottom: 60px;
  display: flex;
  align-items: center;
}

.timeline-item.reverse {
  flex-direction: row-reverse;
}

.timeline-dot {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 20px;
  background: var(--color-primary);
  border: 4px solid white;
  border-radius: 50%;
  z-index: 2;
  box-shadow: 0 0 0 4px var(--color-primary);
}

.timeline-content {
  width: calc(50% - 30px);
  padding: 0 20px;
}

.timeline-item.reverse .timeline-content {
  text-align: right;
}

.timeline-card {
  background: var(--color-card-bg);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 8px 32px var(--color-card-shadow);
  border: 1px solid rgba(255, 255, 255, 0.8);
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  gap: 20px;
}

.timeline-item.reverse .timeline-card {
  flex-direction: row-reverse;
}

.timeline-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 16px 48px rgba(102, 126, 234, 0.2);
  border-color: rgba(102, 126, 234, 0.3);
}

.timeline-image {
  width: 120px;
  height: 120px;
  flex-shrink: 0;
  border-radius: 12px;
  overflow: hidden;
  background: #f5f5f5;
}

.timeline-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.timeline-info {
  flex: 1;
}

.timeline-title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 6px;
  color: var(--color-text);
}

.timeline-subtitle {
  font-size: 14px;
  color: var(--color-primary);
  margin-bottom: 6px;
}

.timeline-location {
  font-size: 13px;
  color: var(--color-text-light);
  margin-bottom: 8px;
}

.timeline-description {
  font-size: 14px;
  color: var(--color-text-light);
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 统计信息 */
.stats-section {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 30px;
}

.stat-card {
  background: var(--color-card-bg);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 30px;
  text-align: center;
  box-shadow: 0 8px 32px var(--color-card-shadow);
  border: 1px solid rgba(255, 255, 255, 0.8);
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 16px 48px rgba(102, 126, 234, 0.2);
  border-color: rgba(102, 126, 234, 0.3);
}

.stat-icon {
  width: 60px;
  height: 60px;
  margin: 0 auto 20px;
  color: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-icon svg {
  width: 100%;
  height: 100%;
}

.stat-value {
  font-size: 36px;
  font-weight: bold;
  color: var(--color-primary);
  margin-bottom: 10px;
}

.stat-label {
  font-size: 14px;
  color: var(--color-text-light);
}

/* 移动端适配 */
@media (max-width: 768px) {
  .back-button {
    top: 10px;
    left: 10px;
    padding: 8px 16px;
    font-size: 14px;
  }

  .explore-header {
    padding: 80px 20px 40px;
  }

  .main-title {
    font-size: 32px;
  }

  .subtitle {
    font-size: 16px;
  }

  .search-section {
    margin: -30px auto 40px;
    padding: 0 15px;
  }

  .search-container {
    padding: 20px;
  }

  .search-input {
    padding: 12px 14px 12px 44px;
    font-size: 14px;
  }

  .tags-filter {
    flex-direction: column;
    align-items: flex-start;
  }

  .tags-list {
    width: 100%;
  }

  .tag-btn {
    font-size: 13px;
    padding: 6px 12px;
  }

  .stories-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .section-title {
    font-size: 28px;
    margin-bottom: 30px;
  }

  .timeline-container::before {
    left: 20px;
  }

  .timeline-item {
    flex-direction: row !important;
    padding-left: 50px;
  }

  .timeline-dot {
    left: 20px;
    transform: translateX(-50%);
  }

  .timeline-content {
    width: 100%;
    padding: 0;
  }

  .timeline-item.reverse .timeline-content {
    text-align: left;
  }

  .timeline-card {
    flex-direction: column !important;
    padding: 15px;
  }

  .timeline-image {
    width: 100%;
    height: 200px;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
  }

  .stat-card {
    padding: 20px;
  }

  .stat-icon {
    width: 50px;
    height: 50px;
    margin-bottom: 15px;
  }

  .stat-value {
    font-size: 28px;
  }
}
</style>


