import { NextResponse } from 'next/server';

function hasJwtCookie(request) {
  const cookieHeader = request.headers.get('cookie') || '';
  return cookieHeader.split(';').some((c) => c.trim().startsWith('jwt='));
}

export function proxy(request) {
  const { pathname } = request.nextUrl;
  const isAuthenticated = hasJwtCookie(request);

  const isRoot = pathname === '/';
  const isAuthPage =
    pathname === '/auth/login' || pathname === '/auth/register' || pathname === '/login' || pathname === '/register';
  const isDashboardRoute = pathname.startsWith('/dashboard');

  // If user is authenticated and hits the landing page, send them to dashboard selector
  if (isRoot && isAuthenticated) {
    const url = new URL('/dashboard', request.url);
    return NextResponse.redirect(url);
  }

  // Protect dashboard routes
  if (isDashboardRoute && !isAuthenticated) {
    const url = new URL('/auth/login', request.url);
    return NextResponse.redirect(url);
  }

  // Prevent logged-in users from visiting auth pages
  if (isAuthPage && isAuthenticated) {
    const url = new URL('/dashboard', request.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/login', '/register', '/auth/:path*', '/dashboard/:path*'],
};
