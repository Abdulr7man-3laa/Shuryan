// src/features/auth/hooks/useRegister.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const useRegister = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { register } = useAuthStore();

  const handleRegister = async (userData, userType) => {
    setLoading(true);
    setError(null);

    try {
      await register(userData, userType);
      
      // Navigate to email verification
      navigate('/verify-email', {
        state: { email: userData.email },
      });
      
      return { success: true };
    } catch (err) {
      const errorMessage = err.message || 'فشل إنشاء الحساب';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return { handleRegister, loading, error };
};

export default useRegister;