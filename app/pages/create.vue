<template>
  <div class="create-page">
    <div class="create-container">
      <header class="create-header">
        <NuxtLink to="/" class="back-link">{{ $t('page.create.backHome') }}</NuxtLink>
        <h1 class="create-title">{{ $t('page.create.pageTitle') }}</h1>
        <p class="create-subtitle">{{ $t('page.create.pageSubtitle') }}</p>
        <div v-if="rateLimitInfo" class="rate-limit-info">
          <span class="rate-limit-badge">🛡️</span>
          <span
            >{{ $t('page.create.rateLimit') }}{{ rateLimitInfo.remaining }}/{{
              rateLimitInfo.limit
            }}</span
          >
        </div>
      </header>

      <form class="create-form" @submit.prevent="handleSubmit">
        <div class="form-group">
          <label class="form-label">{{ $t('page.create.category') }}</label>
          <div class="category-grid">
            <button
              v-for="cat in categories"
              :key="cat.value"
              type="button"
              class="category-btn"
              :class="{ active: form.category === cat.value }"
              @click="form.category = cat.value"
            >
              <span class="cat-emoji">{{ cat.emoji }}</span>
              <span class="cat-name">{{ cat.label }}</span>
            </button>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">{{ $t('page.create.mood') }}</label>
          <div class="emoji-grid">
            <button
              v-for="emoji in emojis"
              :key="emoji"
              type="button"
              class="emoji-btn"
              :class="{ active: form.emoji === emoji }"
              @click="form.emoji = emoji"
            >
              {{ emoji }}
            </button>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label">{{ $t('page.create.title') }}</label>
          <input
            v-model="form.title"
            type="text"
            class="form-input"
            :placeholder="$t('page.create.titlePlaceholder')"
            maxlength="50"
          />
          <span class="char-count">{{ form.title.length }}/50</span>
        </div>

        <div class="form-group">
          <label class="form-label">{{ $t('page.create.content') }}</label>
          <textarea
            v-model="form.content"
            class="form-textarea"
            :placeholder="$t('page.create.contentPlaceholder')"
            rows="8"
            maxlength="2000"
          />
          <span class="char-count">{{ form.content.length }}/2000</span>
        </div>

        <div class="form-group">
          <label class="form-label">{{ $t('page.create.tags') }}</label>
          <div class="tags-input-wrapper">
            <div class="selected-tags">
              <span v-for="tag in form.tags" :key="tag" class="selected-tag">
                {{ tag }}
                <button type="button" class="tag-remove" @click="removeTag(tag)">×</button>
              </span>
            </div>
            <input
              v-model="tagInput"
              type="text"
              class="tag-input"
              :placeholder="$t('page.create.tagPlaceholder')"
              @keydown.enter.prevent="addTag"
            />
          </div>
          <div class="suggested-tags">
            <span class="suggest-label">{{ $t('page.create.hotTags') }}</span>
            <button
              v-for="tag in suggestedTags"
              :key="tag"
              type="button"
              class="suggest-tag"
              :class="{ disabled: form.tags.includes(tag) }"
              @click="addSuggestedTag(tag)"
            >
              {{ tag }}
            </button>
          </div>
        </div>

        <div class="form-actions">
          <button type="button" class="btn-cancel" @click="resetForm">
            {{ $t('page.create.clear') }}
          </button>
          <button
            type="submit"
            class="btn-submit"
            :disabled="!isFormValid || submitting || rateLimitInfo?.remaining === 0"
          >
            {{ submitting ? $t('page.create.submitting') : $t('page.create.submit') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
  const { t } = useI18n()

  interface RateLimitInfo {
    remaining: number
    limit: number
    used: number
  }

  const categories = computed(() => [
    { value: 'classic', label: t('page.categories.categories.classic'), emoji: '💔' },
    { value: 'workplace', label: t('page.categories.categories.workplace'), emoji: '💼' },
    { value: 'family', label: t('page.categories.categories.family'), emoji: '🏠' },
    { value: 'friendship', label: t('page.categories.categories.friendship'), emoji: '🤝' },
    { value: 'love', label: t('page.categories.categories.love'), emoji: '💕' },
    { value: 'growth', label: t('page.categories.categories.growth'), emoji: '🌱' },
  ])

  const emojis = ['💔', '😢', '😤', '😔', '🥺', '😭', '😡', '🤦', '😑', '💔', '🫂', '💪']

  const suggestedTags = [
    '分手借口',
    '甩锅大师',
    '另有新欢',
    '职场故事',
    '家庭琐事',
    '友情岁月',
    '恋爱心事',
    '成长感悟',
  ]

  const form = reactive({
    category: '',
    emoji: '',
    title: '',
    content: '',
    tags: [] as string[],
  })

  const tagInput = ref('')
  const submitting = ref(false)
  const rateLimitInfo = ref<RateLimitInfo | null>(null)

  const isFormValid = computed(() => {
    return (
      form.category &&
      form.emoji &&
      form.title.trim() &&
      form.content.trim() &&
      form.tags.length > 0
    )
  })

  const fetchRateLimit = async () => {
    try {
      const response = await $fetch<{ code: number; data: RateLimitInfo }>('/api/rate-limit')
      if (response.code === 200) {
        rateLimitInfo.value = response.data
      }
    } catch {
      // ignore
    }
  }

  onMounted(() => {
    fetchRateLimit()
  })

  const addTag = () => {
    const tag = tagInput.value.trim()
    if (tag && !form.tags.includes(tag) && form.tags.length < 5) {
      form.tags.push(tag)
      tagInput.value = ''
    }
  }

  const removeTag = (tag: string) => {
    form.tags = form.tags.filter((t) => t !== tag)
  }

  const addSuggestedTag = (tag: string) => {
    if (!form.tags.includes(tag) && form.tags.length < 5) {
      form.tags.push(tag)
    }
  }

  const resetForm = () => {
    form.category = ''
    form.emoji = ''
    form.title = ''
    form.content = ''
    form.tags = []
    tagInput.value = ''
  }

  const handleSubmit = async () => {
    if (!isFormValid.value || submitting.value) return

    submitting.value = true
    try {
      const response = await $fetch('/api/stories', {
        method: 'POST',
        body: {
          category: form.category,
          emoji: form.emoji,
          title: form.title,
          content: form.content,
          tags: form.tags,
        },
      })

      if (response.code === 200) {
        alert(t('page.create.success'))
        resetForm()
        const { refresh } = useStories()
        await refresh()
        navigateTo('/')
      } else if (response.code === 429) {
        alert(response.message || t('page.create.rateLimitExceeded'))
        fetchRateLimit()
      } else {
        alert(response.message || t('page.create.failed'))
      }
    } catch (error: any) {
      console.error('发布失败:', error)
      if (error?.response?.status === 429) {
        alert(t('page.create.rateLimitExceeded'))
        fetchRateLimit()
      } else {
        alert(t('page.create.failedRetry'))
      }
    } finally {
      submitting.value = false
    }
  }

  useHead({
    title: '分享故事 — 港湾',
  })
</script>

<style scoped lang="scss">
  .create-page {
    min-height: 100vh;
    padding-top: 70px;
    background: var(--theme-bgc);
  }

  .create-container {
    max-width: 640px;
    margin: 0 auto;
    padding: 2rem;
  }

  .create-header {
    text-align: center;
    margin-bottom: 2rem;
  }

  .back-link {
    display: inline-block;
    color: rgba(var(--theme-primary-rgb), 0.6);
    text-decoration: none;
    font-size: 0.875rem;
    margin-bottom: 1rem;
    transition: color 0.2s;

    &:hover {
      color: var(--theme-primary);
    }
  }

  .create-title {
    font-size: clamp(1.5rem, 4vw, 2rem);
    font-weight: 800;
    margin: 0 0 0.5rem;
    background: linear-gradient(135deg, var(--theme-primary) 0%, var(--theme-secondary) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .create-subtitle {
    font-size: 0.9rem;
    color: rgba(var(--theme-primary-rgb), 0.5);
    margin: 0;
  }

  .rate-limit-info {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 1rem;
    padding: 0.4rem 1rem;
    border-radius: 999px;
    background: rgba(var(--theme-primary-rgb), 0.08);
    font-size: 0.8rem;
    color: rgba(var(--theme-primary-rgb), 0.7);
  }

  .rate-limit-badge {
    font-size: 0.9rem;
  }

  .form-group {
    position: relative;
    margin-bottom: 1.25rem;
  }

  .form-label {
    display: block;
    font-size: 0.875rem;
    font-weight: 600;
    color: rgba(var(--theme-primary-rgb), 0.8);
    margin-bottom: 0.5rem;
  }

  .category-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.5rem;
  }

  .category-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
    padding: 0.75rem 0.5rem;
    border-radius: 12px;
    border: 1.5px solid rgba(var(--theme-primary-rgb), 0.15);
    background: transparent;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      border-color: rgba(var(--theme-primary-rgb), 0.3);
      background: rgba(var(--theme-primary-rgb), 0.05);
    }

    &.active {
      border-color: var(--theme-primary);
      background: rgba(var(--theme-primary-rgb), 0.1);
    }
  }

  .cat-emoji {
    font-size: 1.25rem;
  }

  .cat-name {
    font-size: 0.75rem;
    color: rgba(var(--theme-primary-rgb), 0.7);
  }

  .emoji-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .emoji-btn {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    border: 1.5px solid rgba(var(--theme-primary-rgb), 0.15);
    background: transparent;
    font-size: 1.25rem;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      border-color: rgba(var(--theme-primary-rgb), 0.3);
      background: rgba(var(--theme-primary-rgb), 0.05);
    }

    &.active {
      border-color: var(--theme-primary);
      background: rgba(var(--theme-primary-rgb), 0.1);
      transform: scale(1.1);
    }
  }

  .form-input {
    width: 100%;
    padding: 0.75rem 1rem;
    border-radius: 12px;
    border: 1.5px solid rgba(var(--theme-primary-rgb), 0.15);
    background: transparent;
    font-size: 1rem;
    color: var(--theme-text);
    transition: all 0.2s;

    &:focus {
      outline: none;
      border-color: var(--theme-primary);
      background: rgba(var(--theme-primary-rgb), 0.03);
    }

    &::placeholder {
      color: rgba(var(--theme-primary-rgb), 0.35);
    }
  }

  .form-textarea {
    width: 100%;
    padding: 0.75rem 1rem;
    border-radius: 12px;
    border: 1.5px solid rgba(var(--theme-primary-rgb), 0.15);
    background: transparent;
    font-size: 1rem;
    color: var(--theme-text);
    resize: vertical;
    min-height: 200px;
    line-height: 1.6;
    transition: all 0.2s;

    &:focus {
      outline: none;
      border-color: var(--theme-primary);
      background: rgba(var(--theme-primary-rgb), 0.03);
    }

    &::placeholder {
      color: rgba(var(--theme-primary-rgb), 0.35);
    }
  }

  .char-count {
    position: absolute;
    right: 0.75rem;
    bottom: 0.5rem;
    font-size: 0.75rem;
    color: rgba(var(--theme-primary-rgb), 0.35);
  }

  .tags-input-wrapper {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    padding: 0.5rem;
    border-radius: 12px;
    border: 1.5px solid rgba(var(--theme-primary-rgb), 0.15);
    min-height: 48px;
    transition: all 0.2s;

    &:focus-within {
      border-color: var(--theme-primary);
      background: rgba(var(--theme-primary-rgb), 0.03);
    }
  }

  .selected-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
  }

  .selected-tag {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.25rem 0.6rem;
    border-radius: 999px;
    background: rgba(var(--theme-primary-rgb), 0.1);
    color: var(--theme-primary);
    font-size: 0.8rem;
    font-weight: 500;
  }

  .tag-remove {
    background: none;
    border: none;
    color: inherit;
    font-size: 1rem;
    cursor: pointer;
    padding: 0;
    line-height: 1;
    opacity: 0.6;

    &:hover {
      opacity: 1;
    }
  }

  .tag-input {
    flex: 1;
    min-width: 120px;
    border: none;
    background: transparent;
    font-size: 0.9rem;
    color: var(--theme-text);
    outline: none;

    &::placeholder {
      color: rgba(var(--theme-primary-rgb), 0.35);
    }
  }

  .suggested-tags {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.4rem;
    margin-top: 0.5rem;
  }

  .suggest-label {
    font-size: 0.75rem;
    color: rgba(var(--theme-primary-rgb), 0.45);
  }

  .suggest-tag {
    padding: 0.2rem 0.5rem;
    border-radius: 6px;
    border: 1px solid rgba(var(--theme-primary-rgb), 0.12);
    background: transparent;
    font-size: 0.75rem;
    color: rgba(var(--theme-primary-rgb), 0.6);
    cursor: pointer;
    transition: all 0.2s;

    &:hover:not(.disabled) {
      border-color: var(--theme-primary);
      color: var(--theme-primary);
      background: rgba(var(--theme-primary-rgb), 0.05);
    }

    &.disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
  }

  .form-actions {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
    margin-top: 1rem;
  }

  .btn-cancel {
    padding: 0.75rem 1.5rem;
    border-radius: 12px;
    border: 1.5px solid rgba(var(--theme-primary-rgb), 0.15);
    background: transparent;
    font-size: 0.9rem;
    font-weight: 600;
    color: rgba(var(--theme-primary-rgb), 0.6);
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      border-color: rgba(var(--theme-primary-rgb), 0.3);
      background: rgba(var(--theme-primary-rgb), 0.05);
    }
  }

  .btn-submit {
    padding: 0.75rem 2rem;
    border-radius: 12px;
    border: none;
    background: linear-gradient(135deg, var(--theme-primary) 0%, var(--theme-secondary) 100%);
    font-size: 0.9rem;
    font-weight: 600;
    color: white;
    cursor: pointer;
    transition: all 0.2s;

    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(var(--theme-primary-rgb), 0.3);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  @media (max-width: 640px) {
    .create-container {
      padding: 1.25rem;
    }

    .category-grid {
      grid-template-columns: repeat(2, 1fr);
    }

    .form-actions {
      flex-direction: column;

      button {
        width: 100%;
      }
    }
  }
</style>
