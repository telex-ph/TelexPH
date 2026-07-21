function getApiBaseUrl() {
  return "/api";
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
