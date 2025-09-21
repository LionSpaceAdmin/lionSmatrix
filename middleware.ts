import { NextRequest, NextResponse } from 'next/server';
import { isRTL } from '@/lib/i18n';
import { defaultLocale, locales } from '@/lib/i18n/config';

const PUBLIC_FILE = /\.(.*)$/; // Files

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Ignore public files
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    PUBLIC_FILE.test(pathname)
  ) {
    return;
  }

  // Get locale from cookie or Accept-Language header
  let locale = request.cookies.get('locale')?.value;
  if (!locale) {
    const acceptLanguageHeader = request.headers.get('Accept-Language');
    if (acceptLanguageHeader) {
      const acceptedLocales = acceptLanguageHeader.split(',').map(lang => lang.split(';')[0].trim());
      for (const acceptedLocale of acceptedLocales) {
        if (locales.includes(acceptedLocale)) {
          locale = acceptedLocale;
          break;
        }
      }
    }
  }

  if (!locale || !locales.includes(locale)) {
    locale = defaultLocale;
  }

  // Redirect if locale is not in the pathname
  if (!pathname.startsWith(`/${locale}`) && locale !== defaultLocale) {
    return NextResponse.redirect(new URL(`/${locale}${pathname}`, request.url));
  }

  // If it's the default locale and it's prefixed, remove the prefix
  if (pathname.startsWith(`/${defaultLocale}/`) && locale === defaultLocale) {
    return NextResponse.redirect(new URL(pathname.replace(`/${defaultLocale}`, ''), request.url));
  }

  // Set the `dir` header for RTL languages
  const response = NextResponse.next();
  if (isRTL(locale as string)) {
    response.headers.set('dir', 'rtl');
  } else {
    response.headers.set('dir', 'ltr');
  }
  return response;
}

export const config = {
  // Matcher to run middleware on all paths except static files and API routes
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico$).*)'],
};
