import { randomBytes } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const CSRF_TOKEN_LENGTH = 32
const CSRF_COOKIE_NAME = 'csrf-token'
const CSRF_HEADER_NAME = 'x-csrf-token'
const CSRF_FIELD_NAME = '_csrf'

// Generate a new CSRF token
export function generateCSRFToken(): string {
  return randomBytes(CSRF_TOKEN_LENGTH).toString('hex')
}

// Get CSRF token from request (header, body, or query)
export function getCSRFTokenFromRequest(request: NextRequest): string | null {
  // Check header first (most common for AJAX requests)
  const headerToken = request.headers.get(CSRF_HEADER_NAME)
  if (headerToken) return headerToken

  // Check URL search params
  const { searchParams } = new URL(request.url)
  const queryToken = searchParams.get(CSRF_FIELD_NAME)
  if (queryToken) return queryToken

  // For POST requests, we'd need to parse the body
  // This is handled differently in Next.js App Router
  return null
}

// Verify CSRF token
export function verifyCSRFToken(
  request: NextRequest,
  token?: string
): boolean {
  // Skip CSRF check for safe methods
  const safeMethods = ['GET', 'HEAD', 'OPTIONS']
  if (safeMethods.includes(request.method)) {
    return true
  }

  // Get token from cookie
  const cookieToken = request.cookies.get(CSRF_COOKIE_NAME)?.value
  if (!cookieToken) return false

  // Get token from request
  const requestToken = token || getCSRFTokenFromRequest(request)
  if (!requestToken) return false

  // Compare tokens (constant time comparison to prevent timing attacks)
  return safeCompare(cookieToken, requestToken)
}

// Constant time string comparison
function safeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  
  let result = 0
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return result === 0
}

// CSRF middleware
export async function csrfMiddleware(request: NextRequest): Promise<NextResponse | null> {
  // Skip CSRF for API routes that don't need it
  const skipPaths = [
    '/api/health',
    '/api/auth', // NextAuth handles its own CSRF
  ]
  
  const pathname = request.nextUrl.pathname
  if (skipPaths.some(path => pathname.startsWith(path))) {
    return null
  }

  // Generate and set CSRF token for GET requests
  if (request.method === 'GET') {
    const response = NextResponse.next()
    const token = generateCSRFToken()
    
    response.cookies.set(CSRF_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24, // 24 hours
    })
    
    // Add token to response header for client to use
    response.headers.set('X-CSRF-Token', token)
    
    return response
  }

  // Verify CSRF token for state-changing requests
  if (!verifyCSRFToken(request)) {
    return new NextResponse('Invalid CSRF token', { status: 403 })
  }

  return null
}

// React hook for CSRF token (client-side)
export function useCSRFToken(): {
  token: string | null
  getHeaders: () => Record<string, string>
} {
  if (typeof window === 'undefined') {
    return { token: null, getHeaders: () => ({}) }
  }

  // Get token from meta tag or cookie
  const getToken = (): string | null => {
    // Check meta tag first
    const metaTag = document.querySelector('meta[name="csrf-token"]')
    if (metaTag) {
      return metaTag.getAttribute('content')
    }

    // Check cookie
    const cookies = document.cookie.split(';')
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=')
      if (name === CSRF_COOKIE_NAME) {
        return decodeURIComponent(value)
      }
    }

    return null
  }

  const token = getToken()

  const getHeaders = (): Record<string, string> => {
    if (!token) return {}
    return { [CSRF_HEADER_NAME]: token }
  }

  return { token, getHeaders }
}

// Server component to inject CSRF token
export async function CSRFTokenProvider() {
  const cookieStore = cookies()
  const token = cookieStore.get(CSRF_COOKIE_NAME)?.value || generateCSRFToken()
  
  return (
    <>
      <meta name="csrf-token" content={token} />
      <script
        dangerouslySetInnerHTML={{
          __html: `window.csrfToken = "${token}";`,
        }}
      />
    </>
  )
}

// Helper to add CSRF token to forms
export function CSRFField({ token }: { token: string }) {
  return (
    <input
      type="hidden"
      name={CSRF_FIELD_NAME}
      value={token}
    />
  )
}

// Axios interceptor for automatic CSRF token inclusion
export function setupCSRFInterceptor(axiosInstance: any) {
  axiosInstance.interceptors.request.use((config: any) => {
    const token = typeof window !== 'undefined' 
      ? document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
      : null
    
    if (token && ['post', 'put', 'patch', 'delete'].includes(config.method)) {
      config.headers[CSRF_HEADER_NAME] = token
    }
    
    return config
  })
}