import { LRUCache } from 'lru-cache'
import { NextRequest, NextResponse } from 'next/server'

type RateLimitOptions = {
  interval: number // Time window in milliseconds
  uniqueTokenPerInterval?: number // Max number of unique tokens per interval
}

type RateLimitResult = {
  success: boolean
  limit: number
  remaining: number
  reset: Date
}

// Create rate limiter instance
export class RateLimiter {
  private tokenCache: LRUCache<string, number[]>

  constructor(options: RateLimitOptions) {
    this.tokenCache = new LRUCache<string, number[]>({
      max: options.uniqueTokenPerInterval || 500,
      ttl: options.interval,
    })
  }

  check(token: string, limit: number): RateLimitResult {
    const now = Date.now()
    const tokenCount = this.tokenCache.get(token) || []
    const relevantRequests = tokenCount.filter(
      timestamp => now - timestamp < this.tokenCache.ttl
    )

    if (relevantRequests.length >= limit) {
      const oldestRelevant = relevantRequests[0]
      const reset = new Date(oldestRelevant + this.tokenCache.ttl)
      
      return {
        success: false,
        limit,
        remaining: 0,
        reset,
      }
    }

    relevantRequests.push(now)
    this.tokenCache.set(token, relevantRequests)

    return {
      success: true,
      limit,
      remaining: limit - relevantRequests.length,
      reset: new Date(now + this.tokenCache.ttl),
    }
  }
}

// Default rate limiters for different endpoints
const rateLimiters = {
  api: new RateLimiter({
    interval: 60 * 1000, // 1 minute
    uniqueTokenPerInterval: 500,
  }),
  auth: new RateLimiter({
    interval: 15 * 60 * 1000, // 15 minutes
    uniqueTokenPerInterval: 100,
  }),
  strict: new RateLimiter({
    interval: 60 * 60 * 1000, // 1 hour
    uniqueTokenPerInterval: 50,
  }),
}

// Get client identifier (IP or user ID)
export function getClientIdentifier(request: NextRequest): string {
  // Try to get user ID from auth session
  const sessionToken = request.cookies.get('next-auth.session-token')?.value
  if (sessionToken) {
    return `user:${sessionToken.slice(0, 16)}` // Use part of session token
  }

  // Fall back to IP address
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0] : request.ip || 'unknown'
  return `ip:${ip}`
}

// Rate limit middleware
export async function rateLimitMiddleware(
  request: NextRequest,
  type: 'api' | 'auth' | 'strict' = 'api',
  customLimit?: number
): Promise<NextResponse | null> {
  const identifier = getClientIdentifier(request)
  const limiter = rateLimiters[type]
  
  // Default limits based on type
  const limits = {
    api: 100,      // 100 requests per minute
    auth: 5,       // 5 auth attempts per 15 minutes
    strict: 10,    // 10 requests per hour
  }
  
  const limit = customLimit || limits[type]
  const result = limiter.check(identifier, limit)

  // Add rate limit headers to response
  const headers = {
    'X-RateLimit-Limit': limit.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': result.reset.toISOString(),
  }

  if (!result.success) {
    return new NextResponse('Too Many Requests', {
      status: 429,
      headers: {
        ...headers,
        'Retry-After': Math.ceil((result.reset.getTime() - Date.now()) / 1000).toString(),
      },
    })
  }

  // Add headers to successful response
  const response = NextResponse.next()
  Object.entries(headers).forEach(([key, value]) => {
    response.headers.set(key, value)
  })

  return null // Continue to next middleware
}

// Rate limit decorator for API routes
export function withRateLimit(
  handler: Function,
  options: {
    type?: 'api' | 'auth' | 'strict'
    limit?: number
  } = {}
) {
  return async (request: NextRequest, ...args: any[]) => {
    const rateLimitResponse = await rateLimitMiddleware(
      request,
      options.type || 'api',
      options.limit
    )
    
    if (rateLimitResponse) {
      return rateLimitResponse
    }
    
    return handler(request, ...args)
  }
}

// Sliding window rate limiter for more accurate limiting
export class SlidingWindowRateLimiter {
  private windows: Map<string, { count: number; resetAt: number }[]>

  constructor(
    private windowMs: number,
    private maxRequests: number
  ) {
    this.windows = new Map()
  }

  async isAllowed(key: string): Promise<boolean> {
    const now = Date.now()
    const userWindows = this.windows.get(key) || []
    
    // Remove expired windows
    const activeWindows = userWindows.filter(w => w.resetAt > now)
    
    // Calculate total requests in active windows
    const totalRequests = activeWindows.reduce((sum, w) => sum + w.count, 0)
    
    if (totalRequests >= this.maxRequests) {
      return false
    }
    
    // Add or update current window
    const currentWindow = activeWindows.find(
      w => w.resetAt > now && w.resetAt - this.windowMs <= now
    )
    
    if (currentWindow) {
      currentWindow.count++
    } else {
      activeWindows.push({
        count: 1,
        resetAt: now + this.windowMs
      })
    }
    
    this.windows.set(key, activeWindows)
    return true
  }

  getRemainingRequests(key: string): number {
    const now = Date.now()
    const userWindows = this.windows.get(key) || []
    const activeWindows = userWindows.filter(w => w.resetAt > now)
    const totalRequests = activeWindows.reduce((sum, w) => sum + w.count, 0)
    return Math.max(0, this.maxRequests - totalRequests)
  }
}