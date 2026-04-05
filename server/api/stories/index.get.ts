import db from '../../database/index'

export default defineEventHandler(event => {
  const query = getQuery(event)
  const page = Number(query.page) || 1
  const limit = Number(query.limit) || 10
  const tag = query.tag as string | undefined
  const offset = (page - 1) * limit

  let countSql = 'SELECT COUNT(*) as total FROM stories'
  let listSql = `
    SELECT id, category, emoji, title, preview, content, tags, likes, baobao, date
    FROM stories
  `
  const params: string[] = []

  if (tag) {
    countSql += ' WHERE tags LIKE ?'
    listSql += ' WHERE tags LIKE ?'
    params.push(`%"${tag}"%`)
  }

  listSql += ' ORDER BY date DESC LIMIT ? OFFSET ?'

  const totalResult = db.prepare(countSql).get(...params) as { total: number }
  const total = totalResult.total

  const list = db.prepare(listSql).all(...params, limit, offset) as Array<{
    id: string
    category: string
    emoji: string
    title: string
    preview: string
    content: string
    tags: string
    likes: number
    baobao: number
    date: string
  }>

  const stories = list.map(story => ({
    ...story,
    tags: JSON.parse(story.tags),
  }))

  return {
    code: 200,
    data: {
      list: stories,
      total,
      page,
      limit,
    },
  }
})
