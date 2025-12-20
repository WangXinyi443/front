<template>
  <div class="about-view">
    <!-- 返回按钮 -->
    <button class="back-button" @click="goHome">
      <span class="back-icon">←</span>
      <span>返回首页</span>
    </button>

    <!-- 标题区域 -->
    <header class="about-header">
      <h1 class="main-title">从涟漪到浪潮</h1>
      <p class="subtitle">李富贵的两个温暖行动，在社区中激起温暖的涟漪</p>
    </header>

    <!-- 青年群像墙 -->
    <section class="portrait-wall">
      <h2 class="section-title">李富贵的两个故事</h2>
      <div class="portrait-grid">
        <div 
          v-for="story in stories" 
          :key="story.id"
          class="portrait-card"
          @click="goToStory(story.id)"
        >
          <div class="portrait-image">
            <img :src="story.coverImage" :alt="story.name" />
          </div>
          <div class="portrait-info">
            <h3>{{ story.name }}</h3>
            <p>{{ story.location }}</p>
            <p class="portrait-title">{{ story.title }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 项目数据看板 - ECharts图表 -->
    <section class="stats-board">
      <h2 class="section-title">项目数据可视化</h2>
      <div class="charts-container">
        <!-- 饼图：故事分布 -->
        <div class="chart-wrapper">
          <h3 class="chart-title">故事分布</h3>
          <div ref="pieChartRef" class="chart"></div>
        </div>
        
        <!-- 柱状图：数据对比 -->
        <div class="chart-wrapper">
          <h3 class="chart-title">数据对比</h3>
          <div ref="barChartRef" class="chart"></div>
        </div>
        
        <!-- 柱状图：服务数据 -->
        <div class="chart-wrapper">
          <h3 class="chart-title">服务数据统计</h3>
          <div ref="serviceChartRef" class="chart"></div>
        </div>
      </div>
    </section>

    <!-- 创作团队介绍 -->
    <section class="team-section">
      <h2 class="section-title">创作团队</h2>
      <div class="team-content">
        <div class="team-info">
          <h3>项目成员</h3>
          <p>本项目由青年学生团队创作，致力于记录和传播新时代青年的公益实践故事。</p>
          <h3>指导老师</h3>
          <p>感谢指导老师的悉心指导与支持。</p>
        </div>
      </div>
    </section>

    <!-- 号召与思考 -->
    <section class="call-to-action">
      <div class="cta-content">
        <h2>青年与故乡</h2>
        <p class="cta-text">
          在这个快速变化的时代，越来越多的青年选择回到故乡，用自己的方式反哺社区。
          他们或许没有轰轰烈烈的事迹，但正是这些平凡而温暖的行动，让社区变得更加有温度。
          每一个青年都是故乡的涟漪，当这些涟漪汇聚在一起，就能形成改变社会的浪潮。
        </p>
        <p class="cta-quote">
          "我们不是要改变世界，只是不想让世界改变我们内心的温度。"
        </p>
      </div>
    </section>

    <!-- 评论区域 -->
    <section class="comments-section">
      <h2 class="section-title">留言评论</h2>
      <div class="comments-container">
        <!-- 评论输入框 -->
        <div class="comment-form">
          <div class="form-group">
            <input 
              v-model="newComment.name" 
              type="text" 
              placeholder="您的姓名" 
              class="comment-input"
            />
          </div>
          <div class="form-group">
            <textarea 
              v-model="newComment.content" 
              placeholder="写下您的想法..." 
              class="comment-textarea"
              rows="4"
            ></textarea>
          </div>
          <button class="submit-btn" @click="submitComment">发布评论</button>
        </div>

        <!-- 评论列表 -->
        <div class="comments-list">
          <div 
            v-for="(comment, index) in comments" 
            :key="index"
            class="comment-item"
          >
            <div class="comment-header">
              <span class="comment-author">{{ comment.name }}</span>
              <span class="comment-time">{{ comment.time }}</span>
            </div>
            <div class="comment-content">{{ comment.content }}</div>
            <div class="comment-actions">
              <button 
                class="like-btn" 
                :class="{ liked: comment.liked }"
                @click="toggleLike(index)"
              >
                <span class="like-icon">{{ comment.liked ? '❤️' : '🤍' }}</span>
                <span class="like-count">{{ comment.likes || 0 }}</span>
              </button>
            </div>
          </div>
          <div v-if="comments.length === 0" class="no-comments">
            <p>暂无评论，快来留下第一条评论吧！</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { stories } from '../data/stories.js'
import * as echarts from 'echarts'

const router = useRouter()
const pieChartRef = ref(null)
const barChartRef = ref(null)
const serviceChartRef = ref(null)

let pieChart = null
let barChart = null
let serviceChart = null

// 评论相关
const comments = ref([
  {
    name: '热心网友',
    time: '2024-12-20 10:30',
    content: '这些青年的故事真的很感人，他们用实际行动诠释了什么是责任和担当！',
    likes: 12,
    liked: false
  },
  {
    name: '社区志愿者',
    time: '2024-12-20 14:20',
    content: '看完这些故事，我也想为社区做点什么。每个人都可以成为改变的力量！',
    likes: 8,
    liked: false
  }
])

const newComment = ref({
  name: '',
  content: ''
})

const submitComment = () => {
  if (!newComment.value.name.trim() || !newComment.value.content.trim()) {
    alert('请填写姓名和评论内容')
    return
  }
  
  const comment = {
    name: newComment.value.name,
    time: new Date().toLocaleString('zh-CN', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit', 
      hour: '2-digit', 
      minute: '2-digit' 
    }),
    content: newComment.value.content,
    likes: 0,
    liked: false
  }
  
  comments.value.unshift(comment)
  newComment.value = { name: '', content: '' }
  alert('评论发布成功！')
}

const toggleLike = (index) => {
  const comment = comments.value[index]
  if (comment.liked) {
    comment.likes--
    comment.liked = false
  } else {
    comment.likes++
    comment.liked = true
  }
}

const totalVolunteers = computed(() => {
  return stories.reduce((sum, s) => sum + (s.stats?.volunteers || 0), 0)
})

const totalElders = computed(() => {
  return stories.reduce((sum, s) => sum + (s.stats?.elders || 0), 0)
})

const totalMeals = computed(() => {
  return stories.find(s => s.id === 2)?.stats?.meals || 0
})

const totalHaircuts = computed(() => {
  return stories.find(s => s.id === 1)?.stats?.haircuts || 0
})

const goToStory = (id) => {
  router.push(`/story/${id}`)
  // 跳转到页面顶部
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const goHome = () => {
  router.push('/')
  // 跳转到页面顶部
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(currentUrl.value)
    alert('链接已复制到剪贴板！')
  } catch (err) {
    // 降级方案
    urlInputRef.value?.select()
    document.execCommand('copy')
    alert('链接已复制到剪贴板！')
  }
}

const animateNumber = (target, current, duration = 2000) => {
  const start = Date.now()
  const startValue = current.value
  const endValue = target

  const animate = () => {
    const now = Date.now()
    const progress = Math.min((now - start) / duration, 1)
    const easeOutQuart = 1 - Math.pow(1 - progress, 4)
    current.value = Math.floor(startValue + (endValue - startValue) * easeOutQuart)

    if (progress < 1) {
      requestAnimationFrame(animate)
    } else {
      current.value = endValue
    }
  }

  animate()
}


const initCharts = () => {
  nextTick(() => {
    // 饼图：故事分布
    if (pieChartRef.value) {
      pieChart = echarts.init(pieChartRef.value)
      const pieOption = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          top: 'middle'
        },
        series: [
          {
            name: '故事分布',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: true,
              formatter: '{b}\n{d}%'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 20,
                fontWeight: 'bold'
              }
            },
            data: stories.map(s => ({
              value: 1, // 每个故事占1份，显示分布
              name: s.title
            }))
          }
        ],
        color: ['#E6A048', '#5B8C5A', '#4A7B9D']
      }
      pieChart.setOption(pieOption)
    }

    // 柱状图：数据对比
    if (barChartRef.value) {
      barChart = echarts.init(barChartRef.value)
      const barOption = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: ['参与青年数', '受益老人数'],
          top: 10
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: stories.map(s => s.title)
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '参与青年数',
            type: 'bar',
            data: stories.map(s => s.stats?.volunteers || 0),
            itemStyle: { color: '#E6A048' }
          },
          {
            name: '受益老人数',
            type: 'bar',
            data: stories.map(s => s.stats?.elders || 0),
            itemStyle: { color: '#5B8C5A' }
          }
        ]
      }
      barChart.setOption(barOption)
    }

    // 柱状图：服务数据统计
    if (serviceChartRef.value) {
      serviceChart = echarts.init(serviceChartRef.value)
      const serviceOption = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          formatter: function(params) {
            let result = params[0].name + '<br/>'
            params.forEach(function(item) {
              result += item.seriesName + ': ' + item.value + '<br/>'
            })
            return result
          }
        },
        legend: {
          data: ['累计服务量'],
          top: 10
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: ['累计义剪', '累计餐数', '服务次数', '受益人数', '志愿者参与']
        },
        yAxis: {
          type: 'value',
          name: '数量'
        },
        series: [
          {
            name: '累计服务量',
            type: 'bar',
            data: [
              totalHaircuts.value,  // 累计义剪
              totalMeals.value,     // 累计餐数
              2500,                  // 服务次数（义剪+做饭的总次数）
              totalElders.value,     // 受益人数
              totalVolunteers.value  // 志愿者参与人数
            ],
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#E6A048' },
                { offset: 1, color: '#5B8C5A' }
              ])
            },
            label: {
              show: true,
              position: 'top',
              formatter: '{c}',
              fontSize: 12
            },
            barWidth: '50%'
          }
        ]
      }
      serviceChart.setOption(serviceOption)
    }

    // 响应式调整
    window.addEventListener('resize', () => {
      pieChart?.resize()
      barChart?.resize()
      serviceChart?.resize()
    })
  })
}

onMounted(() => {
  // 初始化图表
  initCharts()
})
</script>

<style scoped>
.about-view {
  min-height: 100vh;
  background: var(--color-background);
  padding: 40px 20px;
  position: relative;
}

.back-button {
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: rgba(255, 255, 255, 0.95);
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
  transform: translateX(-5px);
  box-shadow: 0 4px 15px rgba(230, 160, 72, 0.3);
}

.back-icon {
  font-size: 20px;
  font-weight: bold;
}

.about-header {
  text-align: center;
  padding: 80px 20px;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
  color: white;
  margin: -40px -20px 60px -20px;
}

.main-title {
  font-size: 48px;
  font-weight: bold;
  margin-bottom: 20px;
  font-family: var(--font-family-serif);
}

.subtitle {
  font-size: 20px;
  opacity: 0.9;
}

.section-title {
  font-size: 36px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 40px;
  color: var(--color-primary);
  font-family: var(--font-family-serif);
}

.portrait-wall {
  max-width: 1200px;
  margin: 0 auto 80px;
}

.portrait-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 40px;
}

.portrait-card {
  background: white;
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.portrait-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}

.portrait-image {
  width: 100%;
  height: 300px;
  overflow: hidden;
}

.portrait-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.portrait-card:hover .portrait-image img {
  transform: scale(1.1);
}

.portrait-info {
  padding: 20px;
}

.portrait-info h3 {
  font-size: 24px;
  color: var(--color-primary);
  margin-bottom: 10px;
}

.portrait-info p {
  color: var(--color-text-light);
  margin-bottom: 5px;
}

.portrait-title {
  color: var(--color-text) !important;
  font-weight: 500;
  margin-top: 10px;
}

.stats-board {
  max-width: 1200px;
  margin: 0 auto 80px;
  background: white;
  padding: 60px 40px;
  border-radius: var(--border-radius);
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
}

.charts-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 40px;
  margin-top: 40px;
}

.chart-wrapper {
  background: var(--color-background);
  padding: 20px;
  border-radius: var(--border-radius);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.chart-title {
  font-size: 18px;
  font-weight: bold;
  color: var(--color-primary);
  margin-bottom: 15px;
  text-align: center;
}

.chart {
  width: 100%;
  height: 400px;
  min-height: 300px;
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 48px;
  font-weight: bold;
  color: var(--color-primary);
  margin-bottom: 10px;
  font-family: var(--font-family-serif);
}

.stat-label {
  font-size: 18px;
  color: var(--color-text-light);
}

.team-section {
  max-width: 1200px;
  margin: 0 auto 80px;
  padding: 60px 40px;
  background: white;
  border-radius: var(--border-radius);
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
}

.team-content {
  text-align: center;
}

.team-info h3 {
  font-size: 24px;
  color: var(--color-primary);
  margin: 30px 0 15px;
}

.team-info p {
  font-size: 16px;
  line-height: 1.8;
  color: var(--color-text);
}

.call-to-action {
  max-width: 1200px;
  margin: 0 auto 80px;
  padding: 80px 40px;
  background: linear-gradient(135deg, var(--color-background) 0%, #F0E8D8 100%);
  border-radius: var(--border-radius);
  text-align: center;
}

.cta-content h2 {
  font-size: 36px;
  color: var(--color-primary);
  margin-bottom: 30px;
  font-family: var(--font-family-serif);
}

.cta-text {
  font-size: 18px;
  line-height: 1.8;
  color: var(--color-text);
  margin-bottom: 30px;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

.cta-quote {
  font-size: 20px;
  font-style: italic;
  color: var(--color-accent);
  font-family: var(--font-family-serif);
}

.comments-section {
  max-width: 1200px;
  margin: 0 auto;
  padding: 60px 40px;
  background: white;
  border-radius: var(--border-radius);
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
}

.comments-container {
  margin-top: 40px;
}

.comment-form {
  background: var(--color-background);
  padding: 30px;
  border-radius: var(--border-radius);
  margin-bottom: 40px;
}

.form-group {
  margin-bottom: 20px;
}

.comment-input,
.comment-textarea {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: var(--border-radius);
  font-size: 16px;
  font-family: var(--font-family-sans);
  transition: border-color 0.3s ease;
}

.comment-input:focus,
.comment-textarea:focus {
  outline: none;
  border-color: var(--color-primary);
}

.comment-textarea {
  resize: vertical;
  min-height: 100px;
}

.submit-btn {
  padding: 12px 30px;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.submit-btn:hover {
  background: var(--color-secondary);
  transform: translateY(-2px);
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.comment-item {
  background: var(--color-background);
  padding: 20px;
  border-radius: var(--border-radius);
  border-left: 4px solid var(--color-primary);
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.comment-author {
  font-weight: bold;
  color: var(--color-primary);
  font-size: 16px;
}

.comment-time {
  font-size: 12px;
  color: var(--color-text-light);
}

.comment-content {
  color: var(--color-text);
  line-height: 1.6;
  font-size: 15px;
  margin-bottom: 15px;
}

.comment-actions {
  display: flex;
  align-items: center;
  padding-top: 15px;
  border-top: 1px solid #eee;
  margin-top: 15px;
}

.like-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: #f5f5f5;
  border: 1px solid #e0e0e0;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  color: #666;
  transition: all 0.3s ease;
}

.like-btn:hover {
  background: #fff0f0;
  border-color: #ff6b6b;
  color: #ff6b6b;
}

.like-btn.liked {
  background: #fff0f0;
  border-color: #ff6b6b;
  color: #ff6b6b;
}

.like-icon {
  font-size: 18px;
  line-height: 1;
}

.like-count {
  font-weight: 500;
  font-size: 14px;
}

.no-comments {
  text-align: center;
  padding: 40px;
  color: var(--color-text-light);
  font-style: italic;
}

@media (max-width: 768px) {
  .main-title {
    font-size: 32px;
  }
  
  .portrait-grid {
    grid-template-columns: 1fr;
  }
  
  .charts-container {
    grid-template-columns: 1fr;
  }
  
  .chart {
    height: 300px;
  }
  
  .comments-section {
    padding: 40px 20px;
  }
  
  .comment-form {
    padding: 20px;
  }
}
</style>

