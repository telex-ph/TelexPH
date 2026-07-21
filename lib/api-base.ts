/**
 * Base URL of the admin backend for BROWSER callers.
 *
 * Relative '/api' on purpose: it makes these calls same-origin, so they're
 * proxied to the backend by the rewrite in next.config.ts. Calling the absolute
 * backend URL from the browser makes every request cross-site, and the auth
 * cookies then don't survive — the backend (running NODE_ENV=production on
 * Render) issues them as `Secure; SameSite=None`, which browsers reject over
 * plain http://localhost. Login appeared to hang at "Processing..." because the
 * session cookie was never stored.
 *
 * Server-side callers (route handlers under app/api/*) read ADMIN_API_BASE_URL
 * instead — they run in Node, where a relative URL has no origin to resolve
 * against. See lib/api/server.ts.
 */
export function getApiBaseUrl(): string {
  return '/api'
}

export function getAdminAuthenticateUrl(): string {
  return `${getApiBaseUrl()}/auth/authenticate`
}

export function getClientAuthenticateUrl(): string {
  return `${getApiBaseUrl()}/auth/client/authenticate`
}

export function getVaAuthenticateUrl(): string {
  return `${getApiBaseUrl()}/auth/va/authenticate`
}

// Login OTP (2FA) — second step of login, called when the password-check
// response comes back with { requiresOtp: true, email }.
export function getVerifyLoginOtpUrl(): string {
  return `${getApiBaseUrl()}/auth/verify-login-otp`
}

export function getVaVerifyLoginOtpUrl(): string {
  return `${getApiBaseUrl()}/auth/va/verify-login-otp`
}

// Shared by Admin, Client, and VA logins — the request body carries
// accountType: "admin" | "client" | "va" so the backend knows which
// account collection to check.
export function getForgotPasswordUrl(): string {
  return `${getApiBaseUrl()}/auth/forgot-password`
}

export function getResetPasswordUrl(): string {
  return `${getApiBaseUrl()}/auth/reset-password`
}
