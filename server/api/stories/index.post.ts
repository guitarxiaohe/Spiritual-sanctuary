import { v4 as uuidv4 } from 'uuid'
import db from '../../database/index'
import { getClientIP, checkRateLimit } from '../../utils/rateLimit'

interface StoryBody {
  category: string
  emoji: string
  title: string
  content: string
  tags: string[]
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

  const body = await readBody<StoryBody>(event)

  if (!body.title || !body.content || !body.category || !body.emoji) {
    return {
      code: 400,
      message: '缺少必填字段',
      data: null,
    }
  }

  if (body.title.length > 100) {
    return {
      code: 400,
      message: '标题不能超过100字',
      data: null,
    }
  }

  if (body.content.length > 5000) {
    return {
      code: 400,
      message: '内容不能超过5000字',
      data: null,
    }
  }

  const id = uuidv4()
  const now = new Date()
  const date = now.toISOString().split('T')[0]
  const createdAt = now.toISOString()
  const preview = body.content.slice(0, 100)
  const tags = JSON.stringify(body.tags || [])

  const stmt = db.prepare(`
    INSERT INTO stories (id, category, emoji, title, preview, content, tags, likes, baobao, date, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, 0, 0, ?, ?)
  `)

  stmt.run(id, body.category, body.emoji, body.title, preview, body.content, tags, date, createdAt)

  return {
    code: 200,
    message: '发布成功',
    data: { id },
  }
})
