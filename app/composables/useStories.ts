export interface Story {
  id: number
  category: string
  emoji: string
  title: string
  preview: string
  content: string
  tags: string[]
  likes: number
  xiatou: number
  date: string
}

type StoryData = Omit<Story, 'id'>

// 自动扫描 app/data/*.json，按文件名排序后依次赋 id（从 1 开始）
const modules = import.meta.glob<StoryData>('../data/*.json', {
  eager: true,
  import: 'default',
})

const storiesData: Story[] = Object.entries(modules)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([, data], index) => ({ ...data, id: index + 1 }))

export const useStories = () => {
  const stories = useState('stories', () => storiesData.map(s => ({ ...s })))

  // 用户已点赞/下头的 id 集合（session 级别）
  const likedIds = useState<Set<number>>('likedIds', () => new Set<number>())
  const xiatouIds = useState<Set<number>>('xiatouIds', () => new Set<number>())

  const toggleLike = (id: number) => {
    const story = stories.value.find(s => s.id === id)
    if (!story) return
    if (likedIds.value.has(id)) {
      likedIds.value.delete(id)
      story.likes--
    } else {
      likedIds.value.add(id)
      story.likes++
    }
  }

  const toggleXiatou = (id: number) => {
    const story = stories.value.find(s => s.id === id)
    if (!story) return
    if (xiatouIds.value.has(id)) {
      xiatouIds.value.delete(id)
      story.xiatou--
    } else {
      xiatouIds.value.add(id)
      story.xiatou++
    }
  }

  const getStory = (id: number) => stories.value.find(s => s.id === id)

  return {
    stories,
    likedIds,
    xiatouIds,
    toggleLike,
    toggleXiatou,
    getStory,
  }
}
