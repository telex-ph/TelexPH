import { cookies } from 'next/headers'

/**
 * Backend fetch for route handlers under app/api/*.
 *
 * These run in Node, not the browser, so they can't use lib/api/axios — that
 * client's baseURL is the relative '/api' (same-origin so the browser attaches
 * the SameSite=Lax auth cookies), and a relative URL has no origin to resolve
 * against on the server.
 *
 * It also forwards the incoming request's cookies: the backend page-view routes
 * sit behind verifyJwt, and a server-side fetch carries no cookie jar of its own.
 */
const BACKEND_URL =
  process.env.ADMIN_API_BASE_URL ?? 'https://telexph-admin.onrender.com'

export async function backendGet<T = unknown>(path: string): Promise<T> {
  const cookieHeader = (await cookies()).toString()

  const response = await fetch(`${BACKEND_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(cookieHeader ? { cookie: cookieHeader } : {}),
    },
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error(`Backend responded ${response.status} for ${path}`)
  }

  return response.json() as Promise<T>
}
