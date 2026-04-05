export interface Story {
  id: string | number
  category: string
  emoji: string
  title: string
  preview: string
  content: string
  tags: string[]
  likes: number
  baobao: number
  date: string
}

type StoryData = Omit<Story, 'id'>

const modules = import.meta.glob<StoryData>('../data/*.json', {
  eager: true,
  import: 'default',
})

const staticStories: Story[] = Object.entries(modules)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([, data], index) => ({ ...data, id: index + 1 }))

export const useStories = () => {
  const stories = useState<Story[]>('stories', () => [])
  const likedIds = useState<Set<string | number>>('likedIds', () => new Set())
  const baobaoIds = useState<Set<string | number>>('baobaoIds', () => new Set())
  const loaded = useState('storiesLoaded', () => false)
  const loading = useState('storiesLoading', () => false)
  const hydrated = useState('storiesHydrated', () => false)

  const loadStorage = () => {
    if (hydrated.value || !import.meta.client) return

    try {
      const storedLikes = localStorage.getItem('likedIds')
      const storedBaobao = localStorage.getItem('baobaoIds')

      if (storedLikes) {
        likedIds.value = new Set(JSON.parse(storedLikes))
      }
      if (storedBaobao) {
        baobaoIds.value = new Set(JSON.parse(storedBaobao))
      }
    } catch {
      // ignore
    }

    hydrated.value = true
  }

  const saveStorage = () => {
    if (!import.meta.client) return
    localStorage.setItem('likedIds', JSON.stringify([...likedIds.value]))
    localStorage.setItem('baobaoIds', JSON.stringify([...baobaoIds.value]))
  }

  const fetchStories = async () => {
    if (loaded.value || loading.value) return

    loading.value = true
    try {
      const response = await $fetch('/api/stories', {
        query: { limit: 1000 },
      })

      if (response.code === 200 && response.data.list.length > 0) {
        stories.value = response.data.list
        loaded.value = true
      } else {
        stories.value = staticStories
        loaded.value = true
      }
    } catch {
      stories.value = staticStories
      loaded.value = true
    } finally {
      loading.value = false
    }
  }

  const refresh = async () => {
    loaded.value = false
    loading.value = false
    await fetchStories()
  }

  const toggleLike = async (id: string | number) => {
    const story = stories.value.find(s => s.id === id)
    if (!story) return

    const isLiked = likedIds.value.has(id)

    if (typeof id === 'string') {
      try {
        const response = await $fetch<{ code: number; data: { likes: number } }>(
          `/api/stories/${id}/like`,
          {
            method: 'POST',
            body: { action: isLiked ? 'remove' : 'add' },
          }
        )
        if (response.code === 200) {
          story.likes = response.data.likes
          if (isLiked) {
            likedIds.value.delete(id)
          } else {
            likedIds.value.add(id)
          }
          saveStorage()
        }
      } catch {
        // ignore
      }
    } else {
      if (isLiked) {
        likedIds.value.delete(id)
        story.likes--
      } else {
        likedIds.value.add(id)
        story.likes++
      }
    }
  }

  const togglebaobao = async (id: string | number) => {
    const story = stories.value.find(s => s.id === id)
    if (!story) return

    const isBaobaod = baobaoIds.value.has(id)

    if (typeof id === 'string') {
      try {
        const response = await $fetch<{ code: number; data: { baobao: number } }>(
          `/api/stories/${id}/baobao`,
          {
            method: 'POST',
            body: { action: isBaobaod ? 'remove' : 'add' },
          }
        )
        if (response.code === 200) {
          story.baobao = response.data.baobao
          if (isBaobaod) {
            baobaoIds.value.delete(id)
          } else {
            baobaoIds.value.add(id)
          }
          saveStorage()
        }
      } catch {
        // ignore
      }
    } else {
      if (isBaobaod) {
        baobaoIds.value.delete(id)
        story.baobao--
      } else {
        baobaoIds.value.add(id)
        story.baobao++
      }
    }
  }

  const getStory = (id: string | number) => stories.value.find(s => s.id === id)

  const isLiked = (id: string | number) => hydrated.value && likedIds.value.has(id)
  const isBaobaod = (id: string | number) => hydrated.value && baobaoIds.value.has(id)

  if (import.meta.client) {
    onMounted(() => {
      loadStorage()
    })
  }

  if (!loaded.value && !loading.value) {
    fetchStories()
  }

  return {
    stories,
    likedIds,
    baobaoIds,
    loading,
    hydrated,
    toggleLike,
    togglebaobao,
    getStory,
    fetchStories,
    refresh,
    isLiked,
    isBaobaod,
  }
}
