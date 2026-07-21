import { NextResponse } from 'next/server'

/**
 * Same-origin logout.
 *
 * This shadows the generic `/api/:path*` rewrite in next.config.ts for this one
 * path, because the rewrite alone isn't enough to end the session in the browser:
 *
 * Render runs with NODE_ENV=production, so the backend's cookie-clearing headers
 * come back as `Secure; SameSite=None`. Over plain http://localhost the browser
 * rejects `Secure` cookies outright, so those clear instructions are dropped and
 * the stale accessToken/refreshToken survive in the cookie jar — middleware then
 * still sees a "valid" session and bounces the user back to the dashboard.
 *
 * So we forward the request (to invalidate the session server-side and log the
 * LOGOUT activity), then re-clear the cookies ourselves on this same-origin
 * response, where `secure` tracks the actual protocol.
 */
const BACKEND_URL =
  process.env.ADMIN_API_BASE_URL ?? 'https://telexph-admin.onrender.com'

export async function POST(request: Request) {
  const cookie = request.headers.get('cookie') ?? ''

  let payload: unknown = { message: 'Logged out', isLoggedOut: true }

  try {
    const upstream = await fetch(`${BACKEND_URL}/api/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        cookie,
      },
    })
    payload = await upstream.json().catch(() => payload)
  } catch (error) {
    // The session cookies still get cleared below — a failed upstream call must
    // not leave the user stuck on the dashboard.
    console.error('Logout upstream error:', error)
  }

  const response = NextResponse.json(payload)
  const isHttps = new URL(request.url).protocol === 'https:'

  for (const name of ['accessToken', 'refreshToken']) {
    response.cookies.set(name, '', {
      httpOnly: true,
      secure: isHttps,
      sameSite: 'lax',
      path: '/',
      expires: new Date(0),
    })
  }

  return response
}
