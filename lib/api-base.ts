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
