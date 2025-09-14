import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Public routes that don't require authentication
  const publicRoutes = [
    '/',
    '/about',
    '/academy',
    '/daily-brief', 
    '/archive',
    '/trust',
    '/api/health'
  ]
  
  // Check if the current path is public
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  )
  
  // For now, allow all routes since auth is mocked
  if (isPublicRoute || pathname.startsWith('/auth') || pathname.startsWith('/api')) {
    return NextResponse.next()
  }
  
  // For protected routes, for now just continue
  // TODO: Implement actual auth check when auth packages are installed
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}