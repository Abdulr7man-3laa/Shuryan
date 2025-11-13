// src/features/auth/components/GoogleLoginButton.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { useAuthStore } from '../store/authStore';
import authService from '@/api/services/auth.service';
import { GOOGLE_CONFIG, isGoogleConfigured } from '@/utils/constants';
import { useToast } from '@/hooks';
import Button from '@/components/ui/Button';

const GoogleLoginButton = ({ userType = 'patient' }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();
  const { login } = useAuthStore();

  // Check if Google OAuth is configured
  const isConfigured = isGoogleConfigured();

  useEffect(() => {
    if (!isConfigured) {
      console.warn('⚠️ Google OAuth is not configured. Please add VITE_GOOGLE_CLIENT_ID to .env');
    }
  }, [isConfigured]);

  /**
   * Handle successful Google login
   * @param {Object} credentialResponse - Google credential response
   */
  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    try {
      console.log('🔐 Google login successful, sending to backend...');
      console.log('📦 Credential:', credentialResponse);
      
      // Get ID token from Google response
      const idToken = credentialResponse.credential;
      
      // Send to backend
      console.log('📤 Sending to backend:', { idToken, userType });
      const response = await authService.googleLogin(idToken, userType);
      
      console.log('📥 Backend response:', response);
      
      // Handle response format: { isSuccess, data, message }
      const data = response.data || response;
      
      // Update auth store directly (don't use login function)
      useAuthStore.setState({
        user: data.user,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        isAuthenticated: true,
        loading: false,
      });
      
      toast.success('تم تسجيل الدخول بنجاح!');
      
      // Navigate based on user role
      navigate('/doctor/dashboard');
      
    } catch (error) {
      console.error('❌ Google login failed:', error);
      console.error('📋 Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      
      const errorMessage = error.response?.data?.message || 'فشل تسجيل الدخول باستخدام جوجل';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle Google login error
   */
  const handleGoogleError = () => {
    console.error('❌ Google login error');
    toast.error('فشل تسجيل الدخول باستخدام جوجل');
  };

  // If Google is not configured, show disabled button
  if (!isConfigured) {
    return (
      <Button
        type="button"
        variant="outline"
        fullWidth
        disabled
        className="flex items-center justify-center gap-3 opacity-50"
        title="Google OAuth غير مفعل"
      >
        <svg className="w-5 h-5" viewBox="0 0 48 48">
          <path
            fill="#FFC107"
            d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
          />
          <path
            fill="#FF3D00"
            d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
          />
          <path
            fill="#4CAF50"
            d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
          />
          <path
            fill="#1976D2"
            d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
          />
        </svg>
        <span>المتابعة باستخدام جوجل</span>
      </Button>
    );
  }

  return (
    <div className="w-full">
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={handleGoogleError}
        useOneTap={false}
        theme="outline"
        size="large"
        text="continue_with"
        shape="rectangular"
        width="100%"
      />
      
      {loading && (
        <div className="mt-2 text-center text-sm text-gray-500">
          جاري تسجيل الدخول...
        </div>
      )}
    </div>
  );
};

/**
 * Wrapper component with GoogleOAuthProvider
 */
const GoogleLoginButtonWrapper = (props) => {
  if (!isGoogleConfigured()) {
    return <GoogleLoginButton {...props} />;
  }

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CONFIG.CLIENT_ID}>
      <GoogleLoginButton {...props} />
    </GoogleOAuthProvider>
  );
};

export default GoogleLoginButtonWrapper;