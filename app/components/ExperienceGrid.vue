<template>
  <section class="experience-section">
    <div class="experience-section__header">
      <h2 class="experience-section__title">开发经历</h2>
      <p class="experience-section__subtitle">每一段经历都是一次成长</p>
    </div>
    <div ref="gridRef" class="experience-grid">
      <!-- 轨迹线 SVG -->
      <svg
        class="trace-lines"
        :class="{ active: linesVisible }"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <line
          v-for="(line, i) in traceLines"
          :key="i"
          class="trace-line"
          :x1="line.x1"
          :y1="line.y1"
          :x2="line.x2"
          :y2="line.y2"
          :style="{ '--line-delay': `${300 + i * 200}ms` }"
        />
        <circle
          v-for="(dot, i) in traceDots"
          :key="`dot-${i}`"
          class="trace-dot"
          :cx="dot.cx"
          :cy="dot.cy"
          r="1.2"
          :style="{ '--dot-delay': `${200 + i * 200}ms` }"
        />
      </svg>
      <ExperienceCard
        v-for="(item, index) in experiences"
        :key="item.id"
        :company="item.company"
        :role="item.role"
        :period="item.period"
        :description="item.description"
        :tags="item.tags"
        :index="index"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface Experience {
  id: number
  company: string
  role: string
  period: string
  description: string
  tags: string[]
}

const experiences: Experience[] = [
  {
    id: 1,
    company: 'TechVision 科技',
    role: '高级前端工程师',
    period: '2024.03 - 至今',
    description:
      '负责公司核心 SaaS 平台的前端架构设计与开发，主导微前端架构落地，推动团队 TypeScript 全面覆盖，平台性能提升 40%。',
    tags: ['Vue 3', 'TypeScript', 'Vite', 'Pinia', '微前端'],
  },
  {
    id: 2,
    company: 'CloudNine 互联网',
    role: '前端工程师',
    period: '2022.07 - 2024.02',
    description:
      '参与电商中台系统开发，独立完成商品管理、订单系统等核心模块，封装了 30+ 通用业务组件，大幅提高团队开发效率。',
    tags: ['React', 'Next.js', 'Ant Design', 'Node.js', 'Docker'],
  },
  {
    id: 3,
    company: 'DataFlow 数据',
    role: '初级前端工程师',
    period: '2021.03 - 2022.06',
    description:
      '负责数据可视化大屏的开发与维护，使用 ECharts 和 D3.js 构建实时数据看板，独立完成多个 ToB 定制化项目交付。',
    tags: ['Vue 2', 'ECharts', 'D3.js', 'SCSS', 'WebSocket'],
  },
  {
    id: 4,
    company: '开源贡献 & 个人项目',
    role: '独立开发者',
    period: '2020 - 至今',
    description:
      '活跃于 GitHub 开源社区，维护多个前端工具库，累计获得 500+ Stars。持续输出技术博客，分享 Vue/React 最佳实践。',
    tags: ['Open Source', 'Nuxt', 'GitHub Actions', '技术写作'],
  },
]

// 轨迹线连接点（4 张卡片，3 条连线 + 4 个节点）
const traceLines = [
  { x1: 25, y1: 25, x2: 75, y2: 25 },
  { x1: 75, y1: 25, x2: 25, y2: 75 },
  { x1: 25, y1: 75, x2: 75, y2: 75 },
]

const traceDots = [
  { cx: 25, cy: 25 },
  { cx: 75, cy: 25 },
  { cx: 25, cy: 75 },
  { cx: 75, cy: 75 },
]

const gridRef = ref<HTMLElement | null>(null)
const linesVisible = ref(false)
let observer: IntersectionObserver | null = null

onMounted(() => {
  const el = gridRef.value
  if (!el) return
  observer = new IntersectionObserver(
    entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          linesVisible.value = true
          observer?.unobserve(entry.target)
        }
      }
    },
    { threshold: 0.1 }
  )
  observer.observe(el)
})

onUnmounted(() => {
  observer?.disconnect()
})
</script>
