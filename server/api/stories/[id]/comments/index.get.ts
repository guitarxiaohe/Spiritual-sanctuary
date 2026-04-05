import db from '../../../../database/index'

export default defineEventHandler(event => {
  const storyId = getRouterParam(event, 'id')
  const query = getQuery(event)
  const page = Number(query.page) || 1
  const limit = Number(query.limit) || 20
  const offset = (page - 1) * limit

  if (!storyId) {
    return {
      code: 400,
      message: '缺少故事 ID',
      data: null,
    }
  }

  const countResult = db
    .prepare(
      `
    SELECT COUNT(*) as total FROM comments WHERE story_id = ? AND parent_id IS NULL
  `
    )
    .get(storyId) as { total: number }

  const total = countResult.total

  const comments = db
    .prepare(
      `
    SELECT id, story_id, parent_id, content, avatar, nickname, created_at
    FROM comments
    WHERE story_id = ? AND parent_id IS NULL
    ORDER BY created_at DESC
    LIMIT ? OFFSET ?
  `
    )
    .all(storyId, limit, offset) as Array<{
    id: string
    story_id: string
    parent_id: string | null
    content: string
    avatar: string
    nickname: string
    created_at: string
  }>

  const commentsWithReplies = comments.map(comment => {
    const replies = db
      .prepare(
        `
      SELECT id, story_id, parent_id, content, avatar, nickname, created_at
      FROM comments
      WHERE parent_id = ?
      ORDER BY created_at ASC
    `
      )
      .all(comment.id) as Array<{
      id: string
      story_id: string
      parent_id: string | null
      content: string
      avatar: string
      nickname: string
      created_at: string
    }>

    return {
      ...comment,
      replies,
    }
  })

  return {
    code: 200,
    data: {
      list: commentsWithReplies,
      total,
    },
  }
})
