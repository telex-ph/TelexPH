/**
 * Absolute base URL of the admin backend.
 *
 * Server-side callers (route handlers under app/api/*) read ADMIN_API_BASE_URL
 * instead — they run in Node and have their own config.
 */
export function getApiBaseUrl(): string {
  return 'https://telexph-admin.onrender.com/api'
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
