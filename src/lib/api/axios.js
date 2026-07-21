import axios from "axios";
const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
  // IMPORTANT: Para ma-send ang cookies
  headers: {
    "Content-Type": "application/json"
  },
  timeout: 1e4
  // 10 seconds
});
api.interceptors.request.use(
  (config) => {
    console.log(`\u{1F4E4} API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error("\u{1F4E4} Request Error:", error);
    return Promise.reject(error);
  }
);
api.interceptors.response.use(
  (response) => {
    console.log(`\u2705 API Response: ${response.config.url}`, response.status);
    return response;
  },
  (error) => {
    if (error.response) {
      const status = error.response.status;
      const path = typeof window !== "undefined" ? window.location.pathname : "";
      console.error(`\u274C API Error: ${status} - ${error.config?.url}`);
      if (status === 401) {
        console.warn("\u{1F512} Unauthorized - Redirecting to login");
        if (typeof window !== "undefined") {
          localStorage.removeItem("user");
        }
        const onLoginPage = /\/login(?:\/|$)/.test(path);
        if (typeof window !== "undefined" && !onLoginPage) {
          let loginBase = "/admin/login";
          if (path.startsWith("/client")) loginBase = "/client/login";
          else if (path.startsWith("/VirtualAssistant") || path.startsWith("/VAdash")) {
            loginBase = "/VirtualAssistant/login";
          }
          window.location.href = loginBase;
        }
      } else if (status === 403) {
        console.error("\u{1F6AB} Forbidden - No permission to access this resource");
      } else if (status >= 500) {
        console.error("\u26A0\uFE0F Server Error");
      }
    } else if (error.request) {
      console.error("\u{1F4E1} Network Error - No response from server");
    } else {
      console.error("\u274C Error:", error.message);
    }
    return Promise.reject(error);
  }
);
var stdin_default = api;
export {
  stdin_default as default
};
