<template>
  <div class="comments-section">
    <div class="comments-header">
      <h3 class="comments-title">{{ $t('page.comments.title') }} ({{ total }})</h3>
    </div>

    <div class="comment-input-wrapper">
      <textarea
        v-model="newComment"
        class="comment-input"
        :placeholder="$t('page.comments.placeholder')"
        rows="3"
        maxlength="500"
      />
      <div class="comment-input-actions">
        <span class="char-count">{{ newComment.length }}/500</span>
        <button
          class="submit-btn"
          :disabled="!newComment.trim() || submitting"
          @click="submitComment"
        >
          {{ submitting ? $t('page.comments.submitting') : $t('page.comments.submit') }}
        </button>
      </div>
    </div>

    <div v-if="replyTo" class="reply-indicator">
      <span>{{ $t('page.comments.replyTo') }} {{ replyTo.nickname }}</span>
      <button class="cancel-reply" @click="cancelReply">×</button>
    </div>

    <div class="comments-list">
      <div v-for="comment in comments" :key="comment.id" class="comment-item">
        <div class="comment-avatar">{{ comment.avatar }}</div>
        <div class="comment-content">
          <div class="comment-header">
            <span class="comment-nickname">{{ comment.nickname }}</span>
            <span class="comment-time">{{ formatTime(comment.created_at) }}</span>
          </div>
          <p class="comment-text">{{ comment.content }}</p>
          <button class="reply-btn" @click="setReplyTo(comment)">
            {{ $t('page.comments.reply') }}
          </button>

          <div v-if="comment.replies && comment.replies.length > 0" class="replies-list">
            <div v-for="reply in comment.replies" :key="reply.id" class="reply-item">
              <span class="reply-avatar">{{ reply.avatar }}</span>
              <div class="reply-content">
                <span class="reply-nickname">{{ reply.nickname }}</span>
                <span class="reply-text">{{ reply.content }}</span>
                <span class="reply-time">{{ formatTime(reply.created_at) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="comments.length === 0" class="empty-comments">
        <span class="empty-emoji">{{ $t('page.comments.emptyEmoji') }}</span>
        <p>{{ $t('page.comments.emptyText') }}</p>
      </div>
    </div>

    <button v-if="hasMore" class="load-more-btn" :disabled="loading" @click="loadMore">
      {{ loading ? $t('page.story.loading') : $t('page.comments.loadMore') }}
    </button>
  </div>
</template>

<script setup lang="ts">
  interface Comment {
    id: string
    story_id: string
    parent_id: string | null
    content: string
    avatar: string
    nickname: string
    created_at: string
    replies?: Comment[]
  }

  const props = defineProps<{
    storyId: string
  }>()

  const { t } = useI18n()

  const comments = ref<Comment[]>([])
  const total = ref(0)
  const page = ref(1)
  const limit = 20
  const loading = ref(false)
  const hasMore = ref(true)
  const newComment = ref('')
  const submitting = ref(false)
  const replyTo = ref<Comment | null>(null)

  const fetchComments = async (pageNum: number) => {
    loading.value = true
    try {
      const response = await $fetch(`/api/stories/${props.storyId}/comments`, {
        query: { page: pageNum, limit },
      })

      if (response.code === 200) {
        if (pageNum === 1) {
          comments.value = response.data.list
        } else {
          comments.value.push(...response.data.list)
        }
        total.value = response.data.total
        hasMore.value = comments.value.length < response.data.total
      }
    } catch (error) {
      console.error('获取评论失败:', error)
    } finally {
      loading.value = false
    }
  }

  const loadMore = () => {
    if (!hasMore.value || loading.value) return
    page.value++
    fetchComments(page.value)
  }

  const submitComment = async () => {
    if (!newComment.value.trim() || submitting.value) return

    submitting.value = true
    try {
      const response = await $fetch(`/api/stories/${props.storyId}/comments`, {
        method: 'POST',
        body: {
          content: newComment.value.trim(),
          parent_id: replyTo.value?.id,
        },
      })

      if (response.code === 200) {
        newComment.value = ''
        replyTo.value = null
        page.value = 1
        await fetchComments(1)
      } else {
        alert(response.message || t('page.comments.failed'))
      }
    } catch (error) {
      console.error('评论失败:', error)
      alert(t('page.comments.failed'))
    } finally {
      submitting.value = false
    }
  }

  const setReplyTo = (comment: Comment) => {
    replyTo.value = comment
  }

  const cancelReply = () => {
    replyTo.value = null
  }

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diff = now.getTime() - date.getTime()

    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return '刚刚'
    if (minutes < 60) return `${minutes}分钟前`
    if (hours < 24) return `${hours}小时前`
    if (days < 7) return `${days}天前`

    return date.toLocaleDateString('zh-CN', {
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  onMounted(() => {
    fetchComments(1)
  })
</script>

<style scoped lang="scss">
  .comments-section {
    margin-top: 2rem;
    padding-top: 2rem;
    border-top: 1px solid rgba(var(--theme-primary-rgb), 0.08);
  }

  .comments-header {
    margin-bottom: 1rem;
  }

  .comments-title {
    font-size: 1rem;
    font-weight: 700;
    color: rgba(var(--theme-primary-rgb), 0.8);
    margin: 0;
  }

  .comment-input-wrapper {
    margin-bottom: 1rem;
  }

  .comment-input {
    width: 100%;
    padding: 0.75rem 1rem;
    border-radius: 12px;
    border: 1.5px solid rgba(var(--theme-primary-rgb), 0.15);
    background: transparent;
    font-size: 0.9rem;
    color: var(--theme-text);
    resize: vertical;
    min-height: 80px;
    line-height: 1.5;
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

  .comment-input-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 0.5rem;
  }

  .char-count {
    font-size: 0.75rem;
    color: rgba(var(--theme-primary-rgb), 0.4);
  }

  .submit-btn {
    padding: 0.5rem 1.25rem;
    border-radius: 8px;
    border: none;
    background: var(--theme-primary);
    color: white;
    font-size: 0.85rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;

    &:hover:not(:disabled) {
      opacity: 0.9;
      transform: translateY(-1px);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  .reply-indicator {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.4rem 0.75rem;
    border-radius: 8px;
    background: rgba(var(--theme-primary-rgb), 0.08);
    font-size: 0.8rem;
    color: rgba(var(--theme-primary-rgb), 0.7);
    margin-bottom: 1rem;
  }

  .cancel-reply {
    background: none;
    border: none;
    font-size: 1rem;
    color: rgba(var(--theme-primary-rgb), 0.5);
    cursor: pointer;
    padding: 0;
    line-height: 1;

    &:hover {
      color: var(--theme-primary);
    }
  }

  .comments-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .comment-item {
    display: flex;
    gap: 0.75rem;
  }

  .comment-avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: rgba(var(--theme-primary-rgb), 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.25rem;
    flex-shrink: 0;
  }

  .comment-content {
    flex: 1;
    min-width: 0;
  }

  .comment-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.25rem;
  }

  .comment-nickname {
    font-size: 0.85rem;
    font-weight: 600;
    color: rgba(var(--theme-primary-rgb), 0.8);
  }

  .comment-time {
    font-size: 0.75rem;
    color: rgba(var(--theme-primary-rgb), 0.4);
  }

  .comment-text {
    font-size: 0.9rem;
    color: rgba(var(--theme-primary-rgb), 0.7);
    line-height: 1.5;
    margin: 0 0 0.5rem;
    word-break: break-word;
  }

  .reply-btn {
    background: none;
    border: none;
    font-size: 0.75rem;
    color: rgba(var(--theme-primary-rgb), 0.5);
    cursor: pointer;
    padding: 0;

    &:hover {
      color: var(--theme-primary);
    }
  }

  .replies-list {
    margin-top: 0.75rem;
    padding-left: 0.75rem;
    border-left: 2px solid rgba(var(--theme-primary-rgb), 0.1);
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .reply-item {
    display: flex;
    gap: 0.5rem;
    align-items: flex-start;
  }

  .reply-avatar {
    font-size: 1rem;
  }

  .reply-content {
    flex: 1;
    font-size: 0.85rem;
  }

  .reply-nickname {
    font-weight: 600;
    color: rgba(var(--theme-primary-rgb), 0.7);
    margin-right: 0.35rem;
  }

  .reply-text {
    color: rgba(var(--theme-primary-rgb), 0.65);
  }

  .reply-time {
    font-size: 0.7rem;
    color: rgba(var(--theme-primary-rgb), 0.35);
    margin-left: 0.5rem;
  }

  .empty-comments {
    text-align: center;
    padding: 2rem;
    color: rgba(var(--theme-primary-rgb), 0.4);
  }

  .empty-emoji {
    font-size: 2rem;
    display: block;
    margin-bottom: 0.5rem;
  }

  .empty-comments p {
    margin: 0;
    font-size: 0.9rem;
  }

  .load-more-btn {
    width: 100%;
    padding: 0.75rem;
    border-radius: 8px;
    border: 1px solid rgba(var(--theme-primary-rgb), 0.15);
    background: transparent;
    font-size: 0.85rem;
    color: rgba(var(--theme-primary-rgb), 0.6);
    cursor: pointer;
    transition: all 0.2s;
    margin-top: 1rem;

    &:hover:not(:disabled) {
      border-color: var(--theme-primary);
      color: var(--theme-primary);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
</style>
