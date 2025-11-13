// src/features/auth/hooks/useAuth.js
import { useAuthStore } from '../store/authStore';

const useAuth = () => {
  const store = useAuthStore();

  return {
    user: store.user,
    isAuthenticated: store.isAuthenticated,
    loading: store.loading,
    error: store.error,
    accessToken: store.accessToken,        // مطلوب للـ token refresh
    refreshToken: store.refreshToken,      // مطلوب للـ token refresh
    setTokens: store.setTokens,            // مطلوب للـ token refresh
    login: store.login,
    logout: store.logout,
    register: store.register,
    verifyEmail: store.verifyEmail,
    forgotPassword: store.forgotPassword,
    resetPassword: store.resetPassword,
    clearError: store.clearError,
  };
};

export default useAuth;