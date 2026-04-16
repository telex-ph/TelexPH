/**
 * Build API URLs from NEXT_PUBLIC_API_URL (no trailing slash).
 * Examples: http://localhost:3000, https://host.onrender.com/api
 */
export function getApiBaseUrl(): string {
  const raw = process.env.NEXT_PUBLIC_API_URL?.trim()
  if (!raw) return 'https://telexph-admin.onrender.com/api'
  return raw.replace(/\/$/, '')
}

export function getAdminAuthenticateUrl(): string {
  return `${getApiBaseUrl()}/auth/authenticate`
}

export function getClientAuthenticateUrl(): string {
  return `${getApiBaseUrl()}/auth/client/authenticate`
}
