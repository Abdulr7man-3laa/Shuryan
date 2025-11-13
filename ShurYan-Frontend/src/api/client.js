// src/api/client.js
import axios from 'axios';
import { API_CONFIG } from '@/utils/constants';

// ==========================================
// Create Axios Instance
// ==========================================
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ==========================================
// Request Interceptor
// ==========================================
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token from localStorage (avoid circular dependency)
    const authData = localStorage.getItem('auth-storage');
    if (authData) {
      try {
        const { state } = JSON.parse(authData);
        if (state?.accessToken) {
          config.headers.Authorization = `Bearer ${state.accessToken}`;
        }
      } catch (error) {
        console.error('Failed to parse auth token:', error);
      }
    }

    // Handle FormData - remove Content-Type to let browser set it with boundary
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// ==========================================
// Response Interceptor
// ==========================================
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle token refresh on 401
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Check if this is a login/register/forgot-password request
      const publicEndpoints = ['/Auth/login', '/Auth/register', '/Auth/forgot-password', '/Auth/reset-password', '/Auth/verify-email', '/Auth/resend-verification'];
      const isPublicEndpoint = publicEndpoints.some(endpoint => originalRequest.url?.includes(endpoint));

      // If it's a public endpoint (like login), don't try to refresh token
      // Just return the error so the component can handle it
      if (isPublicEndpoint) {
        return Promise.reject(error);
      }

      try {
        const authData = localStorage.getItem('auth-storage');
        if (!authData) throw new Error('No auth data');

        const { state } = JSON.parse(authData);
        if (!state?.refreshToken) throw new Error('No refresh token');

        // Refresh token
        const { data } = await axios.post(
          `${API_CONFIG.BASE_URL}/Auth/refresh-token`,
          {
            accessToken: state.accessToken,
            refreshToken: state.refreshToken,
          }
        );

        // Update localStorage directly (avoid zustand import)
        const updatedAuth = {
          state: {
            ...state,
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
          },
          version: 0,
        };
        localStorage.setItem('auth-storage', JSON.stringify(updatedAuth));

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Clear auth and redirect to login
        localStorage.removeItem('auth-storage');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// ==========================================
// Helper Functions
// ==========================================
export const setAuthToken = (token) => {
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common['Authorization'];
  }
};

export const clearAuthToken = () => {
  delete apiClient.defaults.headers.common['Authorization'];
};

// ==========================================
// Exports
// ==========================================
export { API_CONFIG };
export default apiClient;