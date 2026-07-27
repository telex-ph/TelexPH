function getApiBaseUrl() {
  // Absolute URL in production (the backend is a separate deploy); the bare
  // "/api" fallback keeps the Vite dev proxy working locally.
  return import.meta.env.VITE_API_URL || "/api";
}
function getAdminAuthenticateUrl() {
  return `${getApiBaseUrl()}/auth/authenticate`;
}
function getClientAuthenticateUrl() {
  return `${getApiBaseUrl()}/auth/client/authenticate`;
}
function getVaAuthenticateUrl() {
  return `${getApiBaseUrl()}/auth/va/authenticate`;
}
function getVerifyLoginOtpUrl() {
  return `${getApiBaseUrl()}/auth/verify-login-otp`;
}
function getVaVerifyLoginOtpUrl() {
  return `${getApiBaseUrl()}/auth/va/verify-login-otp`;
}
function getForgotPasswordUrl() {
  return `${getApiBaseUrl()}/auth/forgot-password`;
}
function getResetPasswordUrl() {
  return `${getApiBaseUrl()}/auth/reset-password`;
}
export {
  getAdminAuthenticateUrl,
  getApiBaseUrl,
  getClientAuthenticateUrl,
  getForgotPasswordUrl,
  getResetPasswordUrl,
  getVaAuthenticateUrl,
  getVaVerifyLoginOtpUrl,
  getVerifyLoginOtpUrl
};
