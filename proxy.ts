import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Exclude static files, API routes, and admin routes
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/_next') ||
    pathname.includes('.') || // matches files like favicon.ico, images, etc.
    pathname === '/robots.txt'
  ) {
    return NextResponse.next();
  }

  const hasTh = pathname.startsWith('/th');
  const hasEn = pathname.startsWith('/en');

  // If already prefixed with /th or /en
  if (hasTh || hasEn) {
    const locale = hasTh ? 'th' : 'en';
    
    // Internal rewrite: /th/articles/cat -> /articles/cat
    const newPathname = pathname.replace(/^\/(th|en)/, '') || '/';
    const response = NextResponse.rewrite(new URL(newPathname, request.url));
    
    // Set a cookie so we remember the language choice
    response.cookies.set('lang', locale, { path: '/' });
    return response;
  }

  // If no prefix, check cookie or default to 'th'
  const cookieLang = request.cookies.get('lang')?.value;
  const locale = cookieLang === 'en' ? 'en' : 'th';

  // Redirect /articles/cat -> /th/articles/cat
  const redirectUrl = new URL(`/${locale}${pathname}`, request.url);
  // Copy search params if any
  redirectUrl.search = request.nextUrl.search;
  
  return NextResponse.redirect(redirectUrl);
}

export const config = {
  matcher: [
    // Match all paths except those starting with api, admin, _next, or having a dot (files)
    '/((?!api|admin|_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
};
