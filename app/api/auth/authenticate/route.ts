import { NextResponse } from 'next/server'

/**
 * Same-origin login.
 *
 * This shadows the generic `/api/:path*` rewrite for this one path, because the
 * rewrite forwards the backend's Set-Cookie headers verbatim. Render runs with
 * NODE_ENV=production, so the session cookies come back as `Secure; SameSite=None`
 * — and browsers reject `Secure` cookies over plain http://localhost. The cookie
 * was therefore never stored in local dev, so login hung at "Processing..." and
 * the dashboard immediately 401'd.
 *
 * So we forward the request, then re-issue the returned cookies on this
 * same-origin response with `secure` tracking the actual protocol. In production
 * (https) this is a no-op in effect; in local dev it's what makes login work.
 */
const BACKEND_URL =
  process.env.ADMIN_API_BASE_URL ?? 'https://telexph-admin.onrender.com'

/** Cookies the auth flow issues; re-set with dev-safe attributes. */
const SESSION_COOKIES = ['accessToken', 'refreshToken']

export async function POST(request: Request) {
  const body = await request.text()

  const upstream = await fetch(`${BACKEND_URL}/api/auth/authenticate`, {
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

  // getSetCookie() returns each Set-Cookie separately (a plain get() would
  // fold them into one comma-joined string and corrupt the JWT values).
  for (const raw of upstream.headers.getSetCookie()) {
    const [pair] = raw.split(';')
    const eq = pair?.indexOf('=') ?? -1
    if (eq <= 0) continue

    const name = pair!.slice(0, eq).trim()
    const value = pair!.slice(eq + 1).trim()
    if (!SESSION_COOKIES.includes(name)) continue

    // An empty value means the backend is clearing it.
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
