<template>
  <article class="story-card" @click="navigateToDetail">
    <!-- 卡片头部 -->
    <div class="card-header">
      <span class="category-badge">
        <span class="category-emoji">{{ story.emoji }}</span>
        {{ story.category }}
      </span>
      <span class="card-date">{{ story.date }}</span>
    </div>

    <!-- 标题 + 预览 -->
    <div class="card-body">
      <h3 class="card-title">{{ story.title }}</h3>
      <p class="card-preview">{{ story.preview }}</p>
    </div>

    <!-- 标签 -->
    <div class="card-tags">
      <span v-for="tag in story.tags" :key="tag" class="tag">{{ tag }}</span>
    </div>

    <!-- 交互按钮 -->
    <div class="card-footer" @click.stop>
      <button
        class="action-btn btn-like"
        :class="{ active: liked }"
        @click="$emit('like', story.id)"
        :title="liked ? '取消点赞' : '共鸣'"
      >
        <span class="btn-icon">💔</span>
        <span class="btn-label">共鸣</span>
        <span class="btn-count">{{ formatCount(story.likes) }}</span>
      </button>

      <button
        class="action-btn btn-baobao"
        :class="{ active: baobaod }"
        @click="$emit('baobao', story.id)"
        :title="baobaod ? '取消抱抱' : '给一个抱抱'"
      >
        <span class="btn-icon">🫂</span>
        <span class="btn-label">抱抱</span>
        <span class="btn-count">{{ formatCount(story.baobao) }}</span>
      </button>

      <span class="read-more">阅读全文 →</span>
    </div>
  </article>
</template>

<script setup lang="ts">
  import type { Story } from '~/composables/useStories'

  const props = defineProps<{
    story: Story
    liked: boolean
    baobaod: boolean
  }>()

  defineEmits<{
    like: [id: number]
    baobao: [id: number]
  }>()

  const router = useRouter()

  const navigateToDetail = () => {
    router.push(`/stories/${props.story.id}`)
  }

  const formatCount = (n: number) => {
    if (n >= 10000) return (n / 10000).toFixed(1) + 'w'
    if (n >= 1000) return (n / 1000).toFixed(1) + 'k'
    return n
  }
</script>

<style scoped>
  .story-card {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1.5rem;
    border-radius: 16px;
    background: rgba(var(--theme-primary-rgb), 0.04);
    border: 1px solid rgba(var(--theme-primary-rgb), 0.12);
    backdrop-filter: blur(8px);
    cursor: pointer;
    transition:
      transform 0.25s ease,
      box-shadow 0.25s ease,
      border-color 0.25s ease;
    overflow: hidden;
  }

  .story-card::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 16px;
    background: linear-gradient(
      135deg,
      rgba(var(--theme-primary-rgb), 0.06) 0%,
      rgba(var(--theme-secondary-rgb), 0.03) 100%
    );
    opacity: 0;
    transition: opacity 0.25s ease;
    pointer-events: none;
  }

  .story-card:hover {
    transform: translateY(-4px);
    box-shadow:
      0 12px 32px -8px rgba(var(--theme-primary-rgb), 0.2),
      0 4px 12px -4px rgba(var(--theme-secondary-rgb), 0.1);
    border-color: rgba(var(--theme-primary-rgb), 0.3);
  }

  .story-card:hover::before {
    opacity: 1;
  }

  /* 头部 */
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 0.5rem;
  }

  .category-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    padding: 0.25rem 0.75rem;
    border-radius: 999px;
    background: rgba(var(--theme-primary-rgb), 0.1);
    color: var(--theme-primary);
    font-size: 0.75rem;
    font-weight: 600;
    white-space: nowrap;
  }

  .category-emoji {
    font-size: 0.9rem;
  }

  .card-date {
    font-size: 0.75rem;
    color: rgba(var(--theme-primary-rgb), 0.5);
    white-space: nowrap;
  }

  /* 主体 */
  .card-body {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
  }

  .card-title {
    font-size: 1.05rem;
    font-weight: 700;
    color: var(--theme-primary);
    line-height: 1.4;
    margin: 0;
    transition: color 0.2s;
  }

  .story-card:hover .card-title {
    background: linear-gradient(90deg, var(--theme-primary), var(--theme-secondary));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .card-preview {
    font-size: 0.875rem;
    line-height: 1.7;
    color: rgba(var(--theme-primary-rgb), 0.7);
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    margin: 0;
  }

  /* 标签 */
  .card-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
  }

  .tag {
    display: inline-block;
    padding: 0.2rem 0.6rem;
    border-radius: 6px;
    background: rgba(var(--theme-secondary-rgb), 0.08);
    color: var(--theme-secondary);
    font-size: 0.7rem;
    font-weight: 500;
    border: 1px solid rgba(var(--theme-secondary-rgb), 0.15);
    transition: all 0.2s;
  }

  .tag:hover {
    background: rgba(var(--theme-secondary-rgb), 0.15);
  }

  /* 底部操作区 */
  .card-footer {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding-top: 0.75rem;
    border-top: 1px solid rgba(var(--theme-primary-rgb), 0.08);
  }

  .action-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    padding: 0.35rem 0.75rem;
    border-radius: 8px;
    border: 1px solid rgba(var(--theme-primary-rgb), 0.15);
    background: transparent;
    cursor: pointer;
    font-size: 0.78rem;
    font-weight: 500;
    transition: all 0.2s;
    white-space: nowrap;
  }

  .btn-like {
    color: rgba(var(--theme-primary-rgb), 0.7);
  }

  .btn-like:hover,
  .btn-like.active {
    background: rgba(var(--theme-primary-rgb), 0.1);
    border-color: var(--theme-primary);
    color: var(--theme-primary);
  }

  .btn-baobao {
    color: rgba(var(--theme-secondary-rgb), 0.7);
    border-color: rgba(var(--theme-secondary-rgb), 0.15);
  }

  .btn-baobao:hover,
  .btn-baobao.active {
    background: rgba(var(--theme-secondary-rgb), 0.1);
    border-color: var(--theme-secondary);
    color: var(--theme-secondary);
  }

  .btn-icon {
    font-size: 0.9rem;
  }

  .btn-count {
    font-weight: 700;
    font-variant-numeric: tabular-nums;
  }

  .read-more {
    margin-left: auto;
    font-size: 0.78rem;
    color: rgba(var(--theme-primary-rgb), 0.4);
    transition: color 0.2s;
    white-space: nowrap;
  }

  .story-card:hover .read-more {
    color: var(--theme-primary);
  }

  /* 暗色模式适配 */
  [data-theme='dark'] .story-card {
    background: rgba(var(--theme-primary-rgb), 0.06);
    border-color: rgba(var(--theme-primary-rgb), 0.15);
  }

  [data-theme='dark'] .card-preview {
    color: rgba(255, 255, 255, 0.55);
  }
</style>
