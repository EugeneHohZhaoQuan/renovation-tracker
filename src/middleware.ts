import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  // Get the path the user is trying to access
  const path = request.nextUrl.pathname;

  // Define which paths are considered public (don't require authentication)
  const isPublicPath =
    path === '/' || path === '/login' || path === '/register';

  // Check if the user is authenticated by looking for a session cookie
  // Note: In a real app, you'd verify this token with Firebase Admin SDK
  const sessionCookie = request.cookies.get('session')?.value;
  const isAuthenticated = !!sessionCookie;

  // Redirect logic
  if (!isAuthenticated && !isPublicPath) {
    // If not authenticated and trying to access a protected route, redirect to login
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (isAuthenticated && isPublicPath) {
    // If authenticated and trying to access a public route, redirect to dashboard
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (!isAuthenticated && path === '/') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Otherwise, continue with the request
  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: ['/', '/dashboard/:path*', '/login', '/register'],
};
