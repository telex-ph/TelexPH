// lib/axios.ts
// API configuration with proper TypeScript types

import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

// Create axios instance with default config.
//
// baseURL is the RELATIVE '/api' so browser calls are same-origin to the
// Next.js app and get proxied to the backend via the rewrite in
// next.config.ts. Using the absolute backend URL here makes every call
// cross-site, and the auth cookies are SameSite=Lax in dev — which the
// browser refuses to attach to cross-site XHR/fetch. That mismatch made
// /users/me 401 in the browser (no cookie sent) even though the token was
// valid, which triggered the admin-dashboard ↔ login redirect loop.
const api = axios.create({
  baseURL: '/api',
  withCredentials: true, // IMPORTANT: Para ma-send ang cookies
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
});

// Request interceptor with proper types
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Log requests for debugging
    console.log(`📤 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error: AxiosError) => {
    console.error('📤 Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor with proper types - This handles 401 errors
api.interceptors.response.use(
  (response: AxiosResponse) => {
    // Kung successful ang response, return as is
    console.log(`✅ API Response: ${response.config.url}`, response.status);
    return response;
  },
  (error: AxiosError) => {
    // Handle specific error cases
    if (error.response) {
      const status = error.response.status;
      const path = typeof window !== 'undefined' ? window.location.pathname : '';
      
      console.error(`❌ API Error: ${status} - ${error.config?.url}`);
      
      // SCENARIO 1: 401 Unauthorized - Token invalid or missing
      if (status === 401) {
        console.warn('🔒 Unauthorized - Redirecting to login');
        
        // Clear any client-side auth state
        if (typeof window !== 'undefined') {
          localStorage.removeItem('user');
          // You can also clear other auth-related data here
        }
        
        const onLoginPage = /\/login(?:\/|$)/.test(path);
        if (typeof window !== 'undefined' && !onLoginPage) {
          let loginBase = '/admin/login';
          if (path.startsWith('/client')) loginBase = '/client/login';
          else if (path.startsWith('/VirtualAssistant') || path.startsWith('/VAdash')) {
            loginBase = '/VirtualAssistant/login';
          }
          // No ?redirect= param — keeps the login URL clean.
          window.location.href = loginBase;
        }
      }
      
      // SCENARIO 2: 403 Forbidden - No permission
      else if (status === 403) {
        console.error('🚫 Forbidden - No permission to access this resource');
        // Optionally redirect to a "no permission" page
        // window.location.href = '/403';
      }
      
      // SCENARIO 3: 500 Server Error
      else if (status >= 500) {
        console.error('⚠️ Server Error');
        // Optionally show a global error toast
      }
    } else if (error.request) {
      // Request was made but no response received
      console.error('📡 Network Error - No response from server');
    } else {
      // Something else happened
      console.error('❌ Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api;

// ============================================
// USAGE EXAMPLES:
// ============================================

// 1. GET request
// import api from '@/lib/axios';
// 
// const fetchDashboard = async () => {
//   try {
//     const response = await api.get('/dashboard/stats');
//     return response.data;
//   } catch (error) {
//     console.error('Failed to fetch dashboard:', error);
//   }
// };

// 2. POST request
// const createBlog = async (blogData: any) => {
//   try {
//     const response = await api.post('/blogs', blogData);
//     return response.data;
//   } catch (error) {
//     console.error('Failed to create blog:', error);
//   }
// };

// 3. File upload with FormData
// const uploadImage = async (formData: FormData) => {
//   try {
//     const response = await api.post('/upload', formData, {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//       },
//     });
//     return response.data;
//   } catch (error) {
//     console.error('Failed to upload:', error);
//   }
// };