<template>
  <button 
    class="favorite-btn" 
    :class="{ active: isFavorite, compact: !showText }"
    @click="handleToggle"
    :aria-label="isFavorite ? '取消收藏' : '收藏'"
  >
    <svg v-if="isFavorite" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
    </svg>
    <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
    </svg>
    <span v-if="showText" class="btn-text">{{ isFavorite ? '已收藏' : '收藏' }}</span>
  </button>
</template>

<script setup>
import { ref, watch } from 'vue'
import { isFavorite as checkFavorite, toggleFavorite } from '../utils/favorites.js'

const props = defineProps({
  storyId: {
    type: Number,
    required: true
  },
  showText: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['toggle'])

const isFavorite = ref(checkFavorite(props.storyId))

watch(() => props.storyId, (newId) => {
  isFavorite.value = checkFavorite(newId)
})

const handleToggle = () => {
  const newState = toggleFavorite(props.storyId)
  isFavorite.value = newState
  emit('toggle', { storyId: props.storyId, isFavorite: newState })
  
  // 显示提示
  if (newState) {
    // 可以添加提示消息
    console.log('已收藏')
  } else {
    console.log('已取消收藏')
  }
}
</script>

<style scoped>
.favorite-btn {
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

.favorite-btn:hover {
  background: var(--color-primary);
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(230, 160, 72, 0.3);
}

.favorite-btn.active {
  background: var(--color-primary);
  color: white;
}

.favorite-btn.active:hover {
  background: var(--color-secondary);
  border-color: var(--color-secondary);
}

.favorite-btn svg {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.btn-text {
  white-space: nowrap;
}

/* 紧凑模式（不显示文字） */
.favorite-btn.compact {
  padding: 8px;
  width: 36px;
  height: 36px;
  justify-content: center;
}

@media (max-width: 768px) {
  .favorite-btn {
    padding: 6px 12px;
    font-size: 12px;
  }
  
  .favorite-btn svg {
    width: 16px;
    height: 16px;
  }
  
  .favorite-btn.compact {
    width: 32px;
    height: 32px;
    padding: 6px;
  }
}
</style>

