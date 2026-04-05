import db from '../../database/index'

export default defineEventHandler(() => {
  const stories = db.prepare(`
    SELECT tags FROM stories
  `).all() as Array<{ tags: string }>

  const tagSet = new Set<string>()

  stories.forEach(story => {
    try {
      const tags = JSON.parse(story.tags) as string[]
      tags.forEach(tag => tagSet.add(tag))
    } catch {
      // ignore parse errors
    }
  })

  const tags = Array.from(tagSet).sort()

  return {
    code: 200,
    data: tags
  }
})
