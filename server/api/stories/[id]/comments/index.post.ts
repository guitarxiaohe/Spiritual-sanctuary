import { v4 as uuidv4 } from 'uuid'
import db from '../../../../database/index'
import { getRandomIdentity } from '../../../../utils/random'
import { getClientIP, checkRateLimit } from '../../../../utils/rateLimit'

interface CommentBody {
  content: string
  parent_id?: string
}

export default defineEventHandler(async event => {
  const ip = getClientIP(event)
  const rateLimit = checkRateLimit(ip)

  if (!rateLimit.allowed) {
    return {
      code: 429,
      message: rateLimit.message || '请求过于频繁',
      data: null,
    }
  }

  const storyId = getRouterParam(event, 'id')
  const body = await readBody<CommentBody>(event)

  if (!storyId) {
    return {
      code: 400,
      message: '缺少故事 ID',
      data: null,
    }
  }

  if (!body.content || body.content.trim() === '') {
    return {
      code: 400,
      message: '评论内容不能为空',
      data: null,
    }
  }

  if (body.content.length > 1000) {
    return {
      code: 400,
      message: '评论内容不能超过1000字',
      data: null,
    }
  }

  const story = db.prepare('SELECT id FROM stories WHERE id = ?').get(storyId)
  if (!story) {
    return {
      code: 404,
      message: '故事不存在',
      data: null,
    }
  }

  if (body.parent_id) {
    const parent = db.prepare('SELECT id FROM comments WHERE id = ?').get(body.parent_id)
    if (!parent) {
      return {
        code: 404,
        message: '父评论不存在',
        data: null,
      }
    }
  }

  const id = uuidv4()
  const { avatar, nickname } = getRandomIdentity()
  const createdAt = new Date().toISOString()

  const stmt = db.prepare(`
    INSERT INTO comments (id, story_id, parent_id, content, avatar, nickname, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `)

  stmt.run(id, storyId, body.parent_id || null, body.content, avatar, nickname, createdAt)

  return {
    code: 200,
    message: '评论成功',
    data: {
      id,
      avatar,
      nickname,
    },
  }
})
