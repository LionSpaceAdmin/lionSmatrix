import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const { pathname } = req.nextUrl
  const isLoggedIn = !!req.auth
  
  // Public routes that don't require authentication
  const publicRoutes = [
    '/',
    '/about',
    '/contact',
    '/pricing',
    '/features',
    '/api/health'
  ]
  
  // Auth pages
  const authPages = [
    '/auth/login',
    '/auth/register',
    '/auth/error',
    '/auth/verify-request'
  ]
  
  // Protected routes that require authentication
  const protectedRoutes = [
    '/dashboard',
    '/intelligence',
    '/war-room',
    '/analytics',
    '/settings',
    '/profile',
    '/command-center',
    '/matrix',
    '/cognitive-warfare',
    '/platform'
  ]

  const isPublicRoute = publicRoutes.includes(pathname)
  const isAuthPage = authPages.includes(pathname)
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  )

  // Redirect to login if not authenticated and accessing protected route
  if (!isLoggedIn && isProtectedRoute) {
    const loginUrl = new URL('/auth/login', req.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Redirect to dashboard if authenticated and accessing auth pages
  if (isLoggedIn && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  // Admin routes protection
  if (pathname.startsWith('/admin')) {
    if (!isLoggedIn || req.auth?.user?.role !== 'admin') {
      return NextResponse.redirect(new URL('/auth/login', req.url))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes) except auth
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!_next/static|_next/image|favicon.ico|public|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
