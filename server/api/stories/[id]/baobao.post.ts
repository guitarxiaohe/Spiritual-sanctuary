import db from '../../../database/index'

interface BaobaoBody {
  action: 'add' | 'remove'
}

export default defineEventHandler(async event => {
  const id = getRouterParam(event, 'id')
  const body = await readBody<BaobaoBody>(event)

  if (!id) {
    return {
      code: 400,
      message: '缺少故事 ID',
      data: null,
    }
  }

  const delta = body?.action === 'remove' ? -1 : 1

  const result = db
    .prepare(
      `
    UPDATE stories SET baobao = MAX(0, baobao + ?) WHERE id = ?
  `
    )
    .run(delta, id)

  if (result.changes === 0) {
    return {
      code: 404,
      message: '故事不存在',
      data: null,
    }
  }

  const story = db.prepare('SELECT baobao FROM stories WHERE id = ?').get(id) as {
    baobao: number
  }

  return {
    code: 200,
    data: {
      baobao: story.baobao,
    },
  }
})
