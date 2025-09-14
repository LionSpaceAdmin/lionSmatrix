import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const hasConsent = request.cookies.has('lions-consent')

  // Prevent redirect loops for the opening page itself
  if (pathname === '/opening') {
    return NextResponse.next()
  }

  // If user has not consented, and they are trying to access a public-facing page,
  // redirect them to the opening page.
  if (!hasConsent) {
    // These are pages a user might try to access directly that should be gated by the pledge.
    const gatedPublicPaths = [
      '/',
      '/daily-brief',
      '/about',
      '/contact',
      '/faq',
      '/demo',
      '/archive',
      '/legal',
      '/search',
      '/impact',
    ]

    const requiresPledge = gatedPublicPaths.some(path => pathname === path || (path !== '/' && pathname.startsWith(path + '/')))

    if (requiresPledge) {
      const url = request.nextUrl.clone()
      url.pathname = '/opening'
      return NextResponse.redirect(url)
    }
  }
  
  // Existing logic for auth and other routes can continue below.
  // For now, allow all other routes.
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