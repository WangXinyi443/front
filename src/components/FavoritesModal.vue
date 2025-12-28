<template>
  <transition name="modal">
    <div v-if="visible" class="favorites-modal" @click="handleBackdropClick">
      <div class="modal-content" @click.stop>
        <!-- 头部 -->
        <div class="modal-header">
          <h2 class="modal-title">我的收藏</h2>
          <button class="close-btn" @click="close" aria-label="关闭">×</button>
        </div>
        
        <!-- 内容区域 -->
        <div class="modal-body">
          <div v-if="favoriteStories.length === 0" class="empty-state">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
            <p class="empty-text">还没有收藏任何故事</p>
            <p class="empty-hint">去探索页面发现更多精彩故事吧！</p>
          </div>
          
          <div v-else class="favorites-list">
            <div 
              v-for="story in favoriteStories" 
              :key="story.id"
              class="favorite-item"
              @click="goToStory(story.id)"
            >
              <div class="item-image">
                <img :src="story.coverImage" :alt="story.name" loading="lazy" />
              </div>
              <div class="item-info">
                <h3 class="item-title">{{ story.name }}</h3>
                <p class="item-subtitle">{{ story.title }}</p>
                <p class="item-location">{{ story.location }}</p>
                <div class="item-stats">
                  <span class="stat-badge" v-if="story.stats?.volunteers">
                    {{ story.stats.volunteers }} 志愿者
                  </span>
                  <span class="stat-badge" v-if="story.stats?.elders">
                    {{ story.stats.elders }} 受益老人
                  </span>
                </div>
              </div>
              <button 
                class="remove-btn" 
                @click.stop="handleRemoveFavorite(story.id)"
                aria-label="取消收藏"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        <!-- 底部 -->
        <div class="modal-footer" v-if="favoriteStories.length > 0">
          <button class="clear-btn" @click="handleClearAll">清空所有收藏</button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { stories } from '../data/stories.js'
import { getFavorites, removeFavorite, clearFavorites } from '../utils/favorites.js'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:visible', 'close'])

const router = useRouter()
const favoriteIds = ref(getFavorites())

// 监听收藏变化
watch(() => props.visible, (newVal) => {
  if (newVal) {
    favoriteIds.value = getFavorites()
    // 阻止背景滚动
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})

const favoriteStories = computed(() => {
  return stories.filter(s => favoriteIds.value.includes(s.id))
})

const close = () => {
  emit('update:visible', false)
  emit('close')
  document.body.style.overflow = ''
}

const handleBackdropClick = (e) => {
  if (e.target === e.currentTarget) {
    close()
  }
}

const goToStory = (id) => {
  close()
  router.push(`/story/${id}`)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const handleRemoveFavorite = (storyId) => {
  if (confirm('确定要取消收藏这个故事吗？')) {
    removeFavorite(storyId)
    favoriteIds.value = getFavorites()
  }
}

const handleClearAll = () => {
  if (confirm('确定要清空所有收藏吗？此操作不可恢复。')) {
    clearFavorites()
    favoriteIds.value = []
  }
}
</script>

<style scoped>
.favorites-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 20px;
}

.modal-content {
  background: var(--color-card-bg);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 24px 20px;
  border-bottom: 1px solid #eee;
}

.modal-title {
  font-size: 24px;
  font-weight: bold;
  color: var(--color-text);
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 32px;
  color: #999;
  cursor: pointer;
  padding: 0;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: #f5f5f5;
  color: var(--color-text);
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 20px 24px;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
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
  margin-bottom: 10px;
  color: var(--color-text);
}

.empty-hint {
  font-size: 14px;
  color: var(--color-text-light);
}

.favorites-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.favorite-item {
  display: flex;
  gap: 16px;
  padding: 16px;
  background: var(--color-background);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  position: relative;
}

.favorite-item:hover {
  border-color: var(--color-primary);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.item-image {
  width: 100px;
  height: 100px;
  flex-shrink: 0;
  border-radius: 8px;
  overflow: hidden;
  background: #f5f5f5;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-info {
  flex: 1;
  min-width: 0;
}

.item-title {
  font-size: 18px;
  font-weight: bold;
  color: var(--color-text);
  margin: 0 0 6px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-subtitle {
  font-size: 14px;
  color: var(--color-primary);
  margin: 0 0 6px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.item-location {
  font-size: 13px;
  color: var(--color-text-light);
  margin: 0 0 10px;
}

.item-stats {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.stat-badge {
  font-size: 12px;
  padding: 4px 10px;
  background: rgba(230, 160, 72, 0.1);
  color: var(--color-primary);
  border-radius: 12px;
}

.remove-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.remove-btn:hover {
  background: #ff4444;
  color: white;
  transform: scale(1.1);
}

.remove-btn svg {
  width: 18px;
  height: 18px;
}

.modal-footer {
  padding: 16px 24px;
  border-top: 1px solid #eee;
  text-align: center;
}

.clear-btn {
  background: none;
  border: none;
  color: #ff4444;
  cursor: pointer;
  font-size: 14px;
  padding: 8px 16px;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.clear-btn:hover {
  background: rgba(255, 68, 68, 0.1);
}

/* 动画 */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-active .modal-content,
.modal-leave-active .modal-content {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  transform: scale(0.9) translateY(20px);
  opacity: 0;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .favorites-modal {
    padding: 0;
  }
  
  .modal-content {
    max-width: 100%;
    max-height: 100vh;
    border-radius: 0;
  }
  
  .modal-header {
    padding: 20px 16px 16px;
  }
  
  .modal-title {
    font-size: 20px;
  }
  
  .modal-body {
    padding: 16px;
  }
  
  .favorite-item {
    padding: 12px;
    gap: 12px;
  }
  
  .item-image {
    width: 80px;
    height: 80px;
  }
  
  .item-title {
    font-size: 16px;
  }
  
  .item-subtitle {
    font-size: 13px;
  }
  
  .item-location {
    font-size: 12px;
  }
  
  .remove-btn {
    width: 28px;
    height: 28px;
    top: 8px;
    right: 8px;
  }
  
  .remove-btn svg {
    width: 16px;
    height: 16px;
  }
  
  .modal-footer {
    padding: 12px 16px;
  }
}
</style>


