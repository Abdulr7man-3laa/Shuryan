// src/features/auth/hooks/useLogin.js
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuthStore();

  const handleLogin = async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      await login(email, password);
      
      const from = location.state?.from || '/doctor/dashboard';
      navigate(from, { replace: true });
      
      return { success: true };
    } catch (err) {
      const errorMessage = err.message || 'فشل تسجيل الدخول';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return { handleLogin, loading, error };
};

export default useLogin;
