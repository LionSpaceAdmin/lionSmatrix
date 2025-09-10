// Unified Security Module
export * from './headers'
export * from './rate-limit'
export * from './csrf'

import { NextRequest, NextResponse } from 'next/server'
import { securityMiddleware } from './headers'
import { rateLimitMiddleware } from './rate-limit'
import { csrfMiddleware } from './csrf'

// Combined security middleware
export async function applySecurityMiddleware(request: NextRequest): Promise<NextResponse> {
  // Apply rate limiting first
  const rateLimitResponse = await rateLimitMiddleware(request)
  if (rateLimitResponse) {
    return rateLimitResponse
  }

  // Apply CSRF protection
  const csrfResponse = await csrfMiddleware(request)
  if (csrfResponse) {
    return csrfResponse
  }

  // Apply security headers
  const response = securityMiddleware(request)
  
  // Configure secure cookies
  configureSecureCookies(response)
  
  return response
}

// Configure secure cookie settings
function configureSecureCookies(response: NextResponse) {
  const isProduction = process.env.NODE_ENV === 'production'
  
  // Get all cookies from response
  const setCookieHeader = response.headers.get('set-cookie')
  if (!setCookieHeader) return
  
  // Parse and update cookie attributes
  const cookies = setCookieHeader.split(',').map(cookie => {
    // Add secure flag in production
    if (isProduction && !cookie.includes('Secure')) {
      cookie += '; Secure'
    }
    
    // Add HttpOnly if not present
    if (!cookie.includes('HttpOnly') && shouldBeHttpOnly(cookie)) {
      cookie += '; HttpOnly'
    }
    
    // Add SameSite if not present
    if (!cookie.includes('SameSite')) {
      cookie += '; SameSite=Lax'
    }
    
    return cookie
  })
  
  // Update the set-cookie header
  response.headers.set('set-cookie', cookies.join(','))
}

// Determine if cookie should be HttpOnly
function shouldBeHttpOnly(cookieName: string): boolean {
  // List of cookies that should not be HttpOnly (need client access)
  const clientCookies = ['locale', 'theme', 'preferences']
  
  const name = cookieName.split('=')[0].trim()
  return !clientCookies.includes(name)
}

// Security configuration
export const securityConfig = {
  // Rate limiting
  rateLimit: {
    api: {
      windowMs: 60 * 1000, // 1 minute
      max: 100, // 100 requests per minute
    },
    auth: {
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 5, // 5 auth attempts
    },
    strict: {
      windowMs: 60 * 60 * 1000, // 1 hour
      max: 10, // 10 requests per hour
    },
  },
  
  // CORS
  cors: {
    origins: (process.env.CORS_ALLOWED_ORIGINS || 'http://localhost:3000').split(','),
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
    credentials: true,
  },
  
  // CSP
  csp: {
    reportUri: process.env.CSP_REPORT_URI || null,
    reportOnly: process.env.NODE_ENV === 'development',
  },
  
  // Session
  session: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  
  // Cookies
  cookies: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax' as const,
    path: '/',
  },
}