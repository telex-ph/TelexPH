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
  
  // Public paths that should redirect to admin if already logged in
  const authPaths = ['/login', '/register'];
  const isAuthPath = authPaths.some(authPath => path.startsWith(authPath));
  
  // SCENARIO 1: Trying to access protected route WITHOUT token
  // → Redirect to login
  if (isProtectedPath && !accessToken) {
    const loginUrl = new URL('/login', request.url);
    // Save the original URL para after login, ma-redirect doon
    loginUrl.searchParams.set('redirect', path);
    console.log(`🔒 Blocked access to ${path} - No token, redirecting to login`);
    return NextResponse.redirect(loginUrl);
  }
  
  // SCENARIO 2: Already logged in but trying to access login/register
  // → Redirect to admin dashboard
  if (isAuthPath && accessToken) {
    console.log(`✅ Already authenticated, redirecting from ${path} to /admin/dashboard`);
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }
  
  // SCENARIO 3: Valid request, allow to proceed
  return NextResponse.next();
}

// Config: Specify which routes should use this middleware
// Importante: Define exactly which paths ang mag-trigger ng middleware
export const config = {
  matcher: [
    // Protected admin routes
    '/admin/dashboard/:path*',
    
    // Auth routes (login, register)
    '/login',
    '/register',
    
    // Add other protected routes kung meron
    '/dashboard/:path*',
  ]
};