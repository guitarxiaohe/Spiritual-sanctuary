interface IpRecord {
  count: number
  firstRequest: number
  blockedUntil: number
}

const ipStore = new Map<string, IpRecord>()

const LIMITS = {
  WINDOW_MS: 60 * 60 * 1000,
  MAX_REQUESTS: 5,
  BLOCK_DURATION_MS: 60 * 60 * 1000,
}

setInterval(() => {
  const now = Date.now()
  for (const [ip, record] of ipStore.entries()) {
    if (now - record.firstRequest > LIMITS.WINDOW_MS && record.blockedUntil < now) {
      ipStore.delete(ip)
    }
  }
}, 5 * 60 * 1000)

export function getClientIP(event: any): string {
  const headers = getHeaders(event)

  const forwarded = headers['x-forwarded-for']
  if (forwarded) {
    const ips = Array.isArray(forwarded) ? forwarded[0] : forwarded.split(',')[0]
    return ips.trim()
  }

  const realIP = headers['x-real-ip']
  if (realIP) {
    return Array.isArray(realIP) ? realIP[0] : realIP
  }

  const cfIP = headers['cf-connecting-ip']
  if (cfIP) {
    return Array.isArray(cfIP) ? cfIP[0] : cfIP
  }

  return 'unknown'
}

export function checkRateLimit(ip: string): {
  allowed: boolean
  remaining: number
  resetTime: number
  message?: string
} {
  const now = Date.now()
  const record = ipStore.get(ip)

  if (record) {
    if (record.blockedUntil > now) {
      const remainingMinutes = Math.ceil((record.blockedUntil - now) / 60000)
      return {
        allowed: false,
        remaining: 0,
        resetTime: record.blockedUntil,
        message: `操作过于频繁，请 ${remainingMinutes} 分钟后再试`,
      }
    }

    if (now - record.firstRequest < LIMITS.WINDOW_MS) {
      if (record.count >= LIMITS.MAX_REQUESTS) {
        record.blockedUntil = now + LIMITS.BLOCK_DURATION_MS
        return {
          allowed: false,
          remaining: 0,
          resetTime: record.blockedUntil,
          message: '发布次数过多，已被暂时限制，请 1 小时后再试',
        }
      }

      record.count++
      return {
        allowed: true,
        remaining: LIMITS.MAX_REQUESTS - record.count,
        resetTime: record.firstRequest + LIMITS.WINDOW_MS,
      }
    }
  }

  ipStore.set(ip, {
    count: 1,
    firstRequest: now,
    blockedUntil: 0,
  })

  return {
    allowed: true,
    remaining: LIMITS.MAX_REQUESTS - 1,
    resetTime: now + LIMITS.WINDOW_MS,
  }
}

export function getRateLimitStatus(ip: string): {
  used: number
  remaining: number
  resetTime: number
} {
  const record = ipStore.get(ip)
  const now = Date.now()

  if (!record || now - record.firstRequest > LIMITS.WINDOW_MS) {
    return {
      used: 0,
      remaining: LIMITS.MAX_REQUESTS,
      resetTime: now + LIMITS.WINDOW_MS,
    }
  }

  return {
    used: record.count,
    remaining: Math.max(0, LIMITS.MAX_REQUESTS - record.count),
    resetTime: record.firstRequest + LIMITS.WINDOW_MS,
  }
}
