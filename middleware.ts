// middleware.ts
// I-save ito sa ROOT ng frontend project mo (same level as next.config.ts)
// Path: TELEX_FINAL/middleware.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the accessToken cookie
  const accessToken = request.cookies.get('accessToken');
  
  // Get current path
  const path = request.nextUrl.pathname;
  
  // Define protected routes - base sa structure mo
  const protectedPaths = [
    '/admin',           // lahat ng admin pages
    '/dashboard',       // kung may separate dashboard
  ];
  
  // Check if current path is protected
  const isProtectedPath = protectedPaths.some(protectedPath => 
    path.startsWith(protectedPath)
  );
  
  // Admin auth pages (must run before protected /admin check — /admin/login also starts with /admin)
  const authPaths = ['/admin/login', '/admin/register'];
  const isAuthPath = authPaths.some((authPath) => path.startsWith(authPath));

  if (isAuthPath) {
    if (accessToken) {
      console.log(`✅ Already authenticated, redirecting from ${path} to /admin/dashboard`);
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // Protected route without token → admin login (exclude auth URLs above)
  if (isProtectedPath && !accessToken) {
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('redirect', path);
    console.log(`🔒 Blocked access to ${path} - No token, redirecting to /admin/login`);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}
// Config: Specify which routes should use this middleware
// Importante: Define exactly which paths ang mag-trigger ng middleware
export const config = {
  matcher: [
    '/admin/dashboard/:path*',
    '/admin/login',
    '/admin/register',
    '/dashboard/:path*',
  ],
};