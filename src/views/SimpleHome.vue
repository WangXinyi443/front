<template>
  <div style="padding: 50px; text-align: center; min-height: 100vh; background: #F9F5F0;">
    <h1 style="color: #E6A048; font-size: 48px; margin-bottom: 20px;">青年涟漪</h1>
    <p style="font-size: 24px; color: #666; margin-bottom: 40px;">故乡行动者</p>
    <div style="background: white; padding: 30px; border-radius: 10px; max-width: 600px; margin: 0 auto;">
      <h2>测试信息</h2>
      <p>如果你看到这个页面，说明Vue正常工作！</p>
      <p>Stories 数量: {{ storiesCount }}</p>
      <div v-if="storiesCount > 0" style="margin-top: 20px;">
        <button 
          @click="goToRealHome" 
          style="padding: 15px 30px; background: #E6A048; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 16px;"
        >
          进入完整首页
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

let storiesCount = 0
try {
  const storiesModule = await import('../data/stories.js')
  storiesCount = storiesModule.stories?.length || 0
  console.log('数据加载成功，数量:', storiesCount)
} catch (error) {
  console.error('数据加载失败:', error)
}

const goToRealHome = () => {
  router.push('/')
}
</script>

