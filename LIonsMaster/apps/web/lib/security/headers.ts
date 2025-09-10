import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Content Security Policy directives
const getCSP = () => {
  const isDev = process.env.NODE_ENV === 'development'
  
  const csp = `
    default-src 'self';
    script-src 'self' ${isDev ? "'unsafe-eval' 'unsafe-inline'" : "'nonce-{{nonce}}'"} https://www.googletagmanager.com https://www.google-analytics.com;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    font-src 'self' https://fonts.gstatic.com data:;
    img-src 'self' data: blob: https://*.googleapis.com https://*.googleusercontent.com;
    media-src 'self';
    connect-src 'self' https://api.github.com https://accounts.google.com https://www.googleapis.com wss://localhost:* ws://localhost:*;
    frame-src 'self' https://accounts.google.com https://www.google.com;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    block-all-mixed-content;
    upgrade-insecure-requests;
  `.replace(/\s{2,}/g, ' ').trim()
  
  return csp
}

// Generate a nonce for CSP
export function generateNonce(): string {
  const array = new Uint8Array(16)
  crypto.getRandomValues(array)
  return Buffer.from(array).toString('base64')
}

// Apply security headers to response
export function applySecurityHeaders(response: NextResponse, nonce?: string) {
  const csp = getCSP().replace('{{nonce}}', nonce || '')
  
  // Content Security Policy
  response.headers.set('Content-Security-Policy', csp)
  
  // Strict Transport Security
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains; preload'
  )
  
  // X-Frame-Options - Prevent clickjacking
  response.headers.set('X-Frame-Options', 'DENY')
  
  // X-Content-Type-Options - Prevent MIME sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff')
  
  // X-XSS-Protection - Enable XSS filter
  response.headers.set('X-XSS-Protection', '1; mode=block')
  
  // Referrer-Policy
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  
  // Permissions-Policy (formerly Feature-Policy)
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=()'
  )
  
  // X-DNS-Prefetch-Control
  response.headers.set('X-DNS-Prefetch-Control', 'on')
  
  // X-Permitted-Cross-Domain-Policies
  response.headers.set('X-Permitted-Cross-Domain-Policies', 'none')
  
  return response
}

// CORS configuration
export const corsHeaders = {
  'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-CSRF-Token',
  'Access-Control-Max-Age': '86400',
  'Access-Control-Allow-Credentials': 'true'
}

// Apply CORS headers
export function applyCORSHeaders(response: NextResponse, origin?: string) {
  const allowedOrigins = (process.env.CORS_ALLOWED_ORIGINS || 'http://localhost:3000').split(',')
  
  if (origin && allowedOrigins.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin)
  } else {
    response.headers.set('Access-Control-Allow-Origin', allowedOrigins[0])
  }
  
  response.headers.set('Access-Control-Allow-Methods', corsHeaders['Access-Control-Allow-Methods'])
  response.headers.set('Access-Control-Allow-Headers', corsHeaders['Access-Control-Allow-Headers'])
  response.headers.set('Access-Control-Max-Age', corsHeaders['Access-Control-Max-Age'])
  response.headers.set('Access-Control-Allow-Credentials', corsHeaders['Access-Control-Allow-Credentials'])
  
  return response
}

// Security middleware
export function securityMiddleware(request: NextRequest) {
  const response = NextResponse.next()
  const nonce = generateNonce()
  
  // Apply security headers
  applySecurityHeaders(response, nonce)
  
  // Apply CORS headers for API routes
  if (request.nextUrl.pathname.startsWith('/api')) {
    const origin = request.headers.get('origin')
    applyCORSHeaders(response, origin || undefined)
  }
  
  // Store nonce in response for use in scripts
  response.headers.set('X-Nonce', nonce)
  
  return response
}