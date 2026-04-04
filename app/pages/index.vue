<template>
  <div class="stories-page">
    <!-- Hero 区域 -->
    <section class="hero">
      <div class="hero-inner">
        <div class="hero-badge">🫧 匿名港湾</div>
        <h1 class="hero-title">
          <span class="title-main">港湾</span>
          <span class="title-sub">不知道找谁说的时候，说给陌生人听</span>
        </h1>
        <p class="hero-desc">
          这里大家互不相识，没有评判，只有倾听。<br />你的故事不会消失，总有人懂你。
        </p>
        <div class="hero-stats">
          <div class="stat-item">
            <span class="stat-num">{{ stories.length }}</span>
            <span class="stat-label">个故事</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-num">{{ totalXiatou }}</span>
            <span class="stat-label">声抱抱</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-num">{{ totalLikes }}</span>
            <span class="stat-label">次共鸣</span>
          </div>
        </div>
      </div>

      <!-- 装饰背景 -->
      <div class="hero-decoration" aria-hidden="true">
        <span v-for="emoji in decorEmojis" :key="emoji.id" class="deco-emoji" :style="emoji.style">
          {{ emoji.char }}
        </span>
      </div>
    </section>

    <!-- 筛选栏 -->
    <section class="filter-bar">
      <div class="filter-inner">
        <!-- 可见标签 -->
        <button
          v-for="tag in visibleTags"
          :key="tag"
          class="filter-btn"
          :class="{ active: activeTag === tag }"
          @click="toggleTag(tag)"
        >
          {{ tag }}
        </button>

        <!-- 展开按钮 -->
        <button
          v-if="!filterExpanded && hiddenCount > 0"
          class="filter-btn filter-expand-btn"
          @click="filterExpanded = true"
        >
          <span>···</span>
          <span class="expand-badge">+{{ hiddenCount }}</span>
        </button>

        <!-- 收起按钮 -->
        <button
          v-if="filterExpanded && hiddenCount > 0"
          class="filter-btn filter-collapse-btn"
          @click="filterExpanded = false"
        >
          收起 ↑
        </button>
      </div>
    </section>

    <!-- 故事网格 -->
    <section class="stories-section">
      <div class="stories-grid">
        <TransitionGroup name="card-fade">
          <StoryCard
            v-for="story in filteredStories"
            :key="story.id"
            :story="story"
            :liked="likedIds.has(story.id)"
            :xiatoud="xiatouIds.has(story.id)"
            @like="toggleLike"
            @xiatou="toggleXiatou"
          />
        </TransitionGroup>
      </div>

      <div v-if="filteredStories.length === 0" class="empty-state">
        <span class="empty-emoji">🤔</span>
        <p>没有找到相关故事</p>
        <button class="clear-filter-btn" @click="activeTag = null">清除筛选</button>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const { stories, likedIds, xiatouIds, toggleLike, toggleXiatou } = useStories()

// 标签筛选
const activeTag = ref<string | null>(null)
const filterExpanded = ref(false)
const FILTER_LIMIT = 20

const allTags = computed(() => {
  const tagSet = new Set<string>()
  stories.value.forEach(s => s.tags.forEach(t => tagSet.add(t)))
  return ['全部', ...tagSet]
})

const visibleTags = computed(() =>
  filterExpanded.value ? allTags.value : allTags.value.slice(0, FILTER_LIMIT)
)

const hiddenCount = computed(() =>
  Math.max(0, allTags.value.length - FILTER_LIMIT)
)

const filteredStories = computed(() => {
  if (!activeTag.value || activeTag.value === '全部') return stories.value
  return stories.value.filter(s => s.tags.includes(activeTag.value!))
})

const toggleTag = (tag: string) => {
  if (tag === '全部') {
    activeTag.value = null
    return
  }
  activeTag.value = activeTag.value === tag ? null : tag
}

// 统计数据
const totalXiatou = computed(() =>
  stories.value.reduce((acc, s) => acc + s.xiatou, 0).toLocaleString('zh-CN')
)
const totalLikes = computed(() =>
  stories.value.reduce((acc, s) => acc + s.likes, 0).toLocaleString('zh-CN')
)

// 装饰 emoji
const decorEmojis = [
  {
    id: 1,
    char: '🌊',
    style: 'top:15%;left:8%;font-size:2.5rem;opacity:0.1;transform:rotate(-15deg)',
  },
  {
    id: 2,
    char: '🕯️',
    style: 'top:30%;right:6%;font-size:2rem;opacity:0.09;transform:rotate(10deg)',
  },
  {
    id: 3,
    char: '🍃',
    style: 'top:60%;left:4%;font-size:1.8rem;opacity:0.1;transform:rotate(5deg)',
  },
  {
    id: 4,
    char: '💙',
    style: 'top:75%;right:8%;font-size:2rem;opacity:0.08;transform:rotate(-20deg)',
  },
  {
    id: 5,
    char: '💬',
    style: 'top:50%;left:50%;font-size:6rem;opacity:0.03;transform:translate(-50%,-50%)',
  },
]
</script>

<style scoped lang="scss">
.stories-page {
  min-height: 100vh;
  padding-top: 70px; /* header 高度 */
  background: var(--theme-bgc);
}

/* ====== Hero ====== */
.hero {
  position: relative;
  padding: 4rem 2rem 3rem;
  overflow: hidden;
  border-bottom: 1px solid rgba(var(--theme-primary-rgb), 0.08);
}

.hero-inner {
  max-width: 720px;
  margin: 0 auto;
  text-align: center;
  position: relative;
  z-index: 1;
}

.hero-badge {
  display: inline-block;
  padding: 0.3rem 1rem;
  border-radius: 999px;
  background: rgba(var(--theme-primary-rgb), 0.1);
  color: var(--theme-primary);
  font-size: 0.8rem;
  font-weight: 600;
  margin-bottom: 1.25rem;
  border: 1px solid rgba(var(--theme-primary-rgb), 0.2);
}

.hero-title {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  margin-bottom: 1rem;
}

.title-main {
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 900;
  background: linear-gradient(135deg, var(--theme-primary) 0%, var(--theme-secondary) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.1;
  letter-spacing: -0.02em;
}

.title-sub {
  font-size: clamp(0.9rem, 2.5vw, 1.15rem);
  font-weight: 400;
  color: rgba(var(--theme-primary-rgb), 0.6);
  -webkit-text-fill-color: initial;
  background: none;
}

.hero-desc {
  font-size: 0.95rem;
  color: rgba(var(--theme-primary-rgb), 0.55);
  line-height: 1.8;
  margin-bottom: 2rem;
  max-width: 520px;
  margin-inline: auto;
  margin-bottom: 2rem;
}

.hero-stats {
  display: inline-flex;
  align-items: center;
  gap: 1.5rem;
  padding: 0.75rem 2rem;
  border-radius: 999px;
  background: rgba(var(--theme-primary-rgb), 0.06);
  border: 1px solid rgba(var(--theme-primary-rgb), 0.12);
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.1rem;
}

.stat-num {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--theme-primary);
  font-variant-numeric: tabular-nums;
}

.stat-label {
  font-size: 0.7rem;
  color: rgba(var(--theme-primary-rgb), 0.5);
}

.stat-divider {
  width: 1px;
  height: 2rem;
  background: rgba(var(--theme-primary-rgb), 0.12);
}

.hero-decoration {
  position: absolute;
  inset: 0;
  pointer-events: none;
  user-select: none;
}

.deco-emoji {
  position: absolute;
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0) rotate(var(--r, 0deg));
  }
  50% {
    transform: translateY(-10px) rotate(var(--r, 0deg));
  }
}

/* ====== 筛选栏 ====== */
.filter-bar {
  padding: 1.25rem 2rem;
  border-bottom: 1px solid rgba(var(--theme-primary-rgb), 0.06);
  position: sticky;
  top: 0px;
  z-index: 10;
  backdrop-filter: blur(12px);
}

.filter-inner {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.filter-btn {
  padding: 0.3rem 0.9rem;
  border-radius: 999px;
  border: 1px solid rgba(var(--theme-primary-rgb), 0.18);
  background: transparent;
  color: rgba(var(--theme-primary-rgb), 0.65);
  font-size: 0.78rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.filter-btn:hover {
  background: rgba(var(--theme-primary-rgb), 0.07);
  border-color: rgba(var(--theme-primary-rgb), 0.3);
  color: var(--theme-primary);
}

/* 展开按钮 */
.filter-expand-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  border-style: dashed;
  color: rgba(var(--theme-primary-rgb), 0.5);
}

.filter-expand-btn:hover {
  border-style: solid;
}

.expand-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 18px;
  height: 18px;
  padding: 0 4px;
  border-radius: 999px;
  background: rgba(var(--theme-primary-rgb), 0.12);
  color: var(--theme-primary);
  font-size: 0.65rem;
  font-weight: 700;
  line-height: 1;
}

/* 收起按钮 */
.filter-collapse-btn {
  color: rgba(var(--theme-primary-rgb), 0.45);
  border-style: dashed;
}

.filter-collapse-btn:hover {
  border-style: solid;
  color: var(--theme-primary);
}

.filter-btn.active {
  background: var(--theme-primary);
  border-color: var(--theme-primary);
  color: white;
}

/* ====== 故事网格 ====== */
.stories-section {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.stories-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

@media (max-width: 1024px) {
  .stories-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .stories-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .stories-section {
    padding: 1.25rem;
  }
}

/* 卡片入场动画 */
.card-fade-enter-active {
  transition: all 0.3s ease;
}
.card-fade-leave-active {
  transition: all 0.25s ease;
}
.card-fade-enter-from,
.card-fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

/* 空状态 */
.empty-state {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 4rem 2rem;
  color: rgba(var(--theme-primary-rgb), 0.4);
  font-size: 0.9rem;
}

.empty-emoji {
  font-size: 2.5rem;
}

.clear-filter-btn {
  padding: 0.4rem 1rem;
  border-radius: 8px;
  border: 1px solid rgba(var(--theme-primary-rgb), 0.2);
  background: transparent;
  color: var(--theme-primary);
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
}

.clear-filter-btn:hover {
  background: rgba(var(--theme-primary-rgb), 0.1);
}

/* 响应式 Hero */
@media (max-width: 640px) {
  .hero {
    padding: 3rem 1.25rem 2rem;
  }

  .hero-stats {
    gap: 1rem;
    padding: 0.6rem 1.2rem;
  }

  .filter-bar {
    padding: 0.875rem 1.25rem;
  }
}
</style>
