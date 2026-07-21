import { NextResponse } from 'next/server'

/**
 * Same-origin OTP verification — the second step of the 2FA login.
 *
 * Issues the session cookies just like /auth/authenticate, so it needs the same
 * dev-safe cookie rewriting. See app/api/auth/authenticate/route.ts for why the
 * plain `/api/:path*` rewrite isn't enough.
 */
const BACKEND_URL =
  process.env.ADMIN_API_BASE_URL ?? 'https://telexph-admin.onrender.com'

const SESSION_COOKIES = ['accessToken', 'refreshToken']

export async function POST(request: Request) {
  const body = await request.text()

  const upstream = await fetch(`${BACKEND_URL}/api/auth/verify-login-otp`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      cookie: request.headers.get('cookie') ?? '',
    },
    body,
  })

  const payload = await upstream.json().catch(() => ({}))
  const response = NextResponse.json(payload, { status: upstream.status })

  const isHttps = new URL(request.url).protocol === 'https:'

  for (const raw of upstream.headers.getSetCookie()) {
    const [pair] = raw.split(';')
    const eq = pair?.indexOf('=') ?? -1
    if (eq <= 0) continue

    const name = pair!.slice(0, eq).trim()
    const value = pair!.slice(eq + 1).trim()
    if (!SESSION_COOKIES.includes(name)) continue

    response.cookies.set(name, value, {
      httpOnly: true,
      secure: isHttps,
      sameSite: 'lax',
      path: '/',
      ...(value ? {} : { expires: new Date(0) }),
    })
  }

  return response
}
