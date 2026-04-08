<template>
  <div class="detail-page">
    <!-- 加载中 -->
    <div v-if="loading" class="loading-state">
      <span class="loading-emoji">🌀</span>
      <p>{{ $t('page.story.loading') }}</p>
    </div>

    <!-- 404 -->
    <div v-else-if="!story" class="not-found">
      <span class="not-found-emoji">🤷</span>
      <h2>{{ $t('page.story.noStory') }}</h2>
      <NuxtLink to="/" class="back-link">{{ $t('page.story.backHome') }}</NuxtLink>
    </div>

    <template v-else>
      <!-- 返回 + 进度 -->
      <div class="detail-topbar">
        <NuxtLink to="/" class="back-btn">
          <span class="back-arrow">←</span>
          <span>{{ $t('page.story.backHome') }}</span>
        </NuxtLink>

        <div class="story-nav">
          <NuxtLink
            v-if="prevStory"
            :to="`/stories/${prevStory.id}`"
            class="nav-btn"
            :title="$t('page.story.prevStory')"
            >‹ {{ $t('page.story.prevStory') }}</NuxtLink
          >
          <NuxtLink
            v-if="nextStory"
            :to="`/stories/${nextStory.id}`"
            class="nav-btn"
            :title="$t('page.story.nextStory')"
            >{{ $t('page.story.nextStory') }} ›</NuxtLink
          >
        </div>
      </div>

      <!-- 主内容 -->
      <article class="detail-article">
        <!-- 元信息 -->
        <header class="article-header">
          <div class="article-meta">
            <span class="category-badge">
              <span>{{ story.emoji }}</span>
              {{ story.category }}
            </span>
            <span class="meta-date">{{ story.date }}</span>
          </div>
          <h1 class="article-title">{{ story.title }}</h1>
          <div class="article-tags">
            <span v-for="tag in story.tags" :key="tag" class="tag">{{ tag }}</span>
          </div>
        </header>

        <!-- 故事正文 -->
        <div class="article-body">
          <p
            v-for="(paragraph, index) in paragraphs"
            :key="index"
            class="paragraph"
            :class="{
              'is-quote': isQuote(paragraph),
              'is-conclusion': isConclusion(paragraph, index),
            }"
          >
            {{ paragraph }}
          </p>
        </div>

        <!-- 互动区 -->
        <footer class="article-footer">
          <div class="interaction-bar">
            <button
              class="interact-btn btn-like"
              :class="{ active: liked }"
              @click="toggleLike(story.id)"
            >
              <span class="interact-icon">💔</span>
              <span class="interact-label">{{ $t('page.story.likes') }}</span>
              <span class="interact-count">{{ story.likes.toLocaleString('zh-CN') }}</span>
            </button>

            <button
              class="interact-btn btn-baobao"
              :class="{ active: baobaod }"
              @click="togglebaobao(story.id)"
            >
              <span class="interact-icon">🫂</span>
              <span class="interact-label">{{ $t('page.story.baobao') }}</span>
              <span class="interact-count">{{ story.baobao.toLocaleString('zh-CN') }}</span>
            </button>
          </div>

          <p class="interaction-hint">{{ $t('page.create.pageSubtitle') }}</p>
        </footer>

        <!-- 评论区 -->
        <Comments :story-id="String(story.id)" />
      </article>

      <!-- 其他故事推荐 -->
      <section v-if="relatedStories.length > 0" class="related-section">
        <h2 class="related-title">{{ $t('page.story.relatedStories') }}</h2>
        <div class="related-grid">
          <StoryCard
            v-for="s in relatedStories"
            :key="s.id"
            :story="s"
            :liked="isLiked(s.id)"
            :baobaod="isBaobaod(s.id)"
            @like="toggleLike"
            @baobao="togglebaobao"
          />
        </div>
      </section>
    </template>
  </div>
</template>

<script setup lang="ts">
  const route = useRoute()
  const { stories, loading, toggleLike, togglebaobao, getStory, fetchStories, isLiked, isBaobaod } =
    useStories()

  const id = computed(() => {
    const param = route.params.id as string
    return isNaN(Number(param)) ? param : Number(param)
  })
  const story = computed(() => getStory(id.value))

  const liked = computed(() => isLiked(id.value))
  const baobaod = computed(() => isBaobaod(id.value))

  onMounted(async () => {
    await fetchStories()
  })

  // 正文段落拆分
  const paragraphs = computed(
    () =>
      story.value?.content
        .split('\n')
        .map((p) => p.trim())
        .filter((p) => p.length > 0) ?? []
  )

  // 判断是否为引用段落（用「」包裹）
  const isQuote = (p: string) => /^[「『]/.test(p)

  // 判断是否为结语（以 —— 开头，通常是最后一段）
  const isConclusion = (p: string, index: number) =>
    p.startsWith('——') || (index === paragraphs.value.length - 1 && p.startsWith('——'))

  // 上一篇 / 下一篇
  const currentIndex = computed(() => stories.value.findIndex((s) => s.id === id.value))
  const prevStory = computed(() =>
    currentIndex.value > 0 ? stories.value[currentIndex.value - 1] : null
  )
  const nextStory = computed(() =>
    currentIndex.value < stories.value.length - 1 ? stories.value[currentIndex.value + 1] : null
  )

  // 相关推荐（取其他故事前 3 篇）
  const relatedStories = computed(() => stories.value.filter((s) => s.id !== id.value).slice(0, 3))

  // SEO
  useHead({
    title: computed(() => (story.value ? `${story.value.title} — 心灵港湾` : '心灵港湾')),
  })
</script>

<style scoped>
  .detail-page {
    min-height: 100vh;
    padding-top: 70px;
  }

  /* 加载中 */
  .loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    min-height: calc(100vh - 70px);
    color: rgba(var(--theme-primary-rgb), 0.5);
  }

  .loading-emoji {
    font-size: 3rem;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  .loading-state p {
    font-size: 1rem;
  }

  /* 404 */
  .not-found {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    min-height: calc(100vh - 70px);
    color: rgba(var(--theme-primary-rgb), 0.5);
  }

  .not-found-emoji {
    font-size: 3rem;
  }

  .not-found h2 {
    font-size: 1.25rem;
    font-weight: 600;
  }

  .back-link {
    color: var(--theme-primary);
    text-decoration: none;
    font-size: 0.9rem;
    padding: 0.4rem 1rem;
    border-radius: 8px;
    border: 1px solid rgba(var(--theme-primary-rgb), 0.2);
    transition: all 0.2s;
  }

  .back-link:hover {
    background: rgba(var(--theme-primary-rgb), 0.08);
  }

  /* 顶部导航栏 */
  .detail-topbar {
    max-width: 720px;
    margin: 0 auto;
    padding: 1.25rem 2rem 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }

  .back-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    color: rgba(var(--theme-primary-rgb), 0.6);
    text-decoration: none;
    font-size: 0.875rem;
    font-weight: 500;
    padding: 0.35rem 0.75rem;
    border-radius: 8px;
    border: 1px solid rgba(var(--theme-primary-rgb), 0.12);
    transition: all 0.2s;
  }

  .back-btn:hover {
    color: var(--theme-primary);
    background: rgba(var(--theme-primary-rgb), 0.07);
    border-color: rgba(var(--theme-primary-rgb), 0.25);
  }

  .back-arrow {
    font-size: 1rem;
  }

  .story-nav {
    display: flex;
    gap: 0.5rem;
  }

  .nav-btn {
    padding: 0.3rem 0.75rem;
    border-radius: 8px;
    border: 1px solid rgba(var(--theme-primary-rgb), 0.12);
    color: rgba(var(--theme-primary-rgb), 0.5);
    text-decoration: none;
    font-size: 0.78rem;
    font-weight: 500;
    transition: all 0.2s;
    white-space: nowrap;
  }

  .nav-btn:hover {
    border-color: var(--theme-primary);
    color: var(--theme-primary);
    background: rgba(var(--theme-primary-rgb), 0.06);
  }

  /* 文章主体 */
  .detail-article {
    max-width: 720px;
    margin: 0 auto;
    padding: 2rem 2rem 3rem;
  }

  .article-header {
    margin-bottom: 2.5rem;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid rgba(var(--theme-primary-rgb), 0.08);
  }

  .article-meta {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1rem;
  }

  .category-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.25rem 0.75rem;
    border-radius: 999px;
    background: rgba(var(--theme-primary-rgb), 0.1);
    color: var(--theme-primary);
    font-size: 0.78rem;
    font-weight: 600;
  }

  .meta-date {
    font-size: 0.78rem;
    color: rgba(var(--theme-primary-rgb), 0.45);
  }

  .article-title {
    font-size: clamp(1.5rem, 4vw, 2rem);
    font-weight: 800;
    line-height: 1.3;
    margin: 0 0 1.25rem;
    background: linear-gradient(135deg, var(--theme-primary) 0%, var(--theme-secondary) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .article-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
  }

  .tag {
    padding: 0.2rem 0.65rem;
    border-radius: 6px;
    background: rgba(var(--theme-secondary-rgb), 0.08);
    color: var(--theme-secondary);
    font-size: 0.72rem;
    font-weight: 500;
    border: 1px solid rgba(var(--theme-secondary-rgb), 0.15);
  }

  /* 正文 */
  .article-body {
    display: flex;
    flex-direction: column;
    gap: 1.2rem;
    margin-bottom: 3rem;
  }

  .paragraph {
    font-size: 1rem;
    line-height: 1.9;
    color: rgba(var(--theme-primary-rgb), 0.75);
    margin: 0;
  }

  [data-theme='dark'] .paragraph {
    color: rgba(255, 255, 255, 0.65);
  }

  /* 引用段落（「…」） */
  .paragraph.is-quote {
    padding: 1rem 1.25rem;
    border-left: 3px solid var(--theme-primary);
    background: rgba(var(--theme-primary-rgb), 0.04);
    border-radius: 0 10px 10px 0;
    font-style: italic;
    color: rgba(var(--theme-primary-rgb), 0.85);
  }

  [data-theme='dark'] .paragraph.is-quote {
    color: rgba(255, 255, 255, 0.8);
  }

  /* 结语（—— 开头） */
  .paragraph.is-conclusion {
    padding: 1.25rem 1.5rem;
    border-radius: 12px;
    background: linear-gradient(
      135deg,
      rgba(var(--theme-primary-rgb), 0.06),
      rgba(var(--theme-secondary-rgb), 0.04)
    );
    border: 1px solid rgba(var(--theme-primary-rgb), 0.1);
    font-size: 0.9rem;
    color: var(--theme-primary);
    font-weight: 500;
    line-height: 1.8;
  }

  /* 互动区 */
  .article-footer {
    text-align: center;
    padding-top: 2rem;
    border-top: 1px solid rgba(var(--theme-primary-rgb), 0.08);
  }

  .interaction-bar {
    display: inline-flex;
    gap: 1rem;
    margin-bottom: 0.75rem;
  }

  .interact-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.6rem 1.5rem;
    border-radius: 12px;
    border: 1.5px solid rgba(var(--theme-primary-rgb), 0.18);
    background: transparent;
    cursor: pointer;
    font-size: 0.9rem;
    font-weight: 600;
    transition: all 0.25s;
  }

  .btn-like {
    color: rgba(var(--theme-primary-rgb), 0.7);
  }

  .btn-like:hover,
  .btn-like.active {
    background: rgba(var(--theme-primary-rgb), 0.1);
    border-color: var(--theme-primary);
    color: var(--theme-primary);
    transform: scale(1.04);
  }

  .btn-baobao {
    color: rgba(var(--theme-secondary-rgb), 0.7);
    border-color: rgba(var(--theme-secondary-rgb), 0.18);
  }

  .btn-baobao:hover,
  .btn-baobao.active {
    background: rgba(var(--theme-secondary-rgb), 0.1);
    border-color: var(--theme-secondary);
    color: var(--theme-secondary);
    transform: scale(1.04);
  }

  .interact-icon {
    font-size: 1.1rem;
  }

  .interact-count {
    font-variant-numeric: tabular-nums;
  }

  .interaction-hint {
    font-size: 0.78rem;
    color: rgba(var(--theme-primary-rgb), 0.35);
    margin: 0;
  }

  /* 相关推荐 */
  .related-section {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem 3rem;
    border-top: 1px solid rgba(var(--theme-primary-rgb), 0.06);
  }

  .related-title {
    font-size: 1rem;
    font-weight: 700;
    color: rgba(var(--theme-primary-rgb), 0.5);
    margin: 2rem 0 1.25rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-size: 0.8rem;
  }

  .related-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.25rem;
  }

  /* 响应式 */
  @media (max-width: 768px) {
    .detail-article {
      padding: 1.5rem 1.25rem 2.5rem;
    }

    .detail-topbar {
      padding: 1rem 1.25rem 0;
    }

    .related-section {
      padding: 0 1.25rem 2.5rem;
    }

    .related-grid {
      grid-template-columns: 1fr;
      gap: 1rem;
    }

    .interaction-bar {
      flex-direction: column;
      width: 100%;
      max-width: 280px;
    }

    .interact-btn {
      justify-content: center;
    }
  }

  @media (max-width: 1024px) and (min-width: 641px) {
    .related-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
</style>
