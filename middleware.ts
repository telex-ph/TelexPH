// middleware.ts
// I-save ito sa ROOT ng frontend project mo (same level as next.config.ts)
// Path: TELEX_FINAL/middleware.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import * as jose from 'jose';

// Verifies signature + expiry, not just presence — a stale/expired cookie
// (e.g. one the browser failed to clear after a cross-site Set-Cookie, see
// the admin-login redirect-loop incident) must not be treated as a valid
// session or middleware and the backend disagree and bounce the user forever.
async function hasValidAccessToken(request: NextRequest): Promise<boolean> {
  const accessToken = request.cookies.get('accessToken')?.value;
  if (!accessToken) return false;

  const publicPEM = process.env.PUBLIC_KEY;
  if (!publicPEM) return false;

  try {
    const publicKey = await jose.importSPKI(publicPEM, 'RS256');
    await jose.jwtVerify(accessToken, publicKey);
    return true;
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
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

  const isAuthenticated = await hasValidAccessToken(request);

  if (isAuthPath) {
    if (isAuthenticated) {
      console.log(`✅ Already authenticated, redirecting from ${path} to /admin/dashboard`);
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
    // Expired/invalid cookie still on the client — strip it so it stops
    // being sent on every request instead of continuing to look "present".
    const response = NextResponse.next();
    if (request.cookies.get('accessToken')) response.cookies.delete('accessToken');
    return response;
  }

  // Protected route without a valid token → admin login (exclude auth URLs above)
  if (isProtectedPath && !isAuthenticated) {
    // No ?redirect= param — the login URL is kept clean, so sign-in always
    // lands on the dashboard root rather than the originally requested page.
    const loginUrl = new URL('/admin/login', request.url);
    console.log(`🔒 Blocked access to ${path} - No valid token, redirecting to /admin/login`);
    const response = NextResponse.redirect(loginUrl);
    if (request.cookies.get('accessToken')) response.cookies.delete('accessToken');
    return response;
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