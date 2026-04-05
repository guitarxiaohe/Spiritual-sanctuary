import { getClientIP, getRateLimitStatus } from '../utils/rateLimit'

export default defineEventHandler(event => {
  const ip = getClientIP(event)
  const status = getRateLimitStatus(ip)

  return {
    code: 200,
    data: {
      ip: ip === 'unknown' ? null : ip.slice(0, 3) + '***',
      used: status.used,
      remaining: status.remaining,
      limit: 5,
      resetTime: status.resetTime,
    },
  }
})
