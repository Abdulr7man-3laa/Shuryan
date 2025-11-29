// src/features/auth/pages/EmailNotVerifiedPage.jsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaShieldAlt, FaExclamationTriangle, FaEnvelope, FaArrowRight } from 'react-icons/fa';
import authService from '@/api/services/auth.service';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';

const EmailNotVerifiedPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  // Redirect to login if no email
  React.useEffect(() => {
    if (!email) {
      navigate('/login');
    }
  }, [email, navigate]);

  const handleVerifyNow = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Send new OTP to user's email
      await authService.resendVerification(email);
      
      // Navigate to verification page
      navigate('/verify-email', { 
        state: { email },
        replace: true 
      });
    } catch (err) {
      console.error('Failed to send verification:', err);
      
      const errorMessage = err.response?.data?.message || '';
      const errorLower = errorMessage.toLowerCase();
      
      // ✅ CRITICAL FIX: Check if email is already verified
      if (errorLower.includes('already verified') || 
          errorLower.includes('مفعّل بالفعل') ||
          errorLower.includes('تم التفعيل')) {
        
        console.log('✅ Email already verified, redirecting to login...');
        
        // Navigate to login with success message
        navigate('/login', {
          state: { 
            message: 'حسابك مفعّل بالفعل! يمكنك الآن تسجيل الدخول.',
            messageType: 'success'
          },
          replace: true
        });
        return;
      }
      
      // Otherwise, show error
      setError(errorMessage || 'فشل إرسال رمز التحقق. يرجى المحاولة مرة أخرى.');
      setLoading(false);
    }
  };

  if (!email) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border-t-4 border-teal-500">
          {/* Warning Icon */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full mb-4 relative">
              <FaExclamationTriangle className="text-4xl text-amber-600" />
              {/* Pulse animation */}
              <div className="absolute inset-0 bg-amber-400 rounded-full animate-ping opacity-20"></div>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              البريد الإلكتروني غير مفعّل
            </h1>
            
            <p className="text-gray-600 text-lg mb-1">
              يجب تفعيل حسابك للمتابعة
            </p>
            
            <div className="flex items-center justify-center gap-2 mt-4 bg-amber-50 rounded-lg p-3 border border-amber-100">
              <FaEnvelope className="text-amber-600" />
              <p className="text-sm font-semibold text-amber-800">{email}</p>
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert variant="error" className="mb-6">
              {error}
            </Alert>
          )}

          {/* Action Button */}
          <Button
            type="button"
            variant="primary"
            fullWidth
            onClick={handleVerifyNow}
            disabled={loading}
            loading={loading}
            className="bg-gradient-to-r from-amber-500 to-teal-500 hover:from-amber-600 hover:to-teal-600 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transform transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {!loading && (
              <>
                <FaEnvelope className="text-lg" />
                <span>إرسال رمز التحقق الآن</span>
                <FaArrowRight className="text-lg" />
              </>
            )}
          </Button>

          {/* Footer Info */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              سيتم إرسال رمز مكون من 6 أرقام إلى بريدك الإلكتروني
            </p>
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">أو</span>
            </div>
          </div>

          {/* Back to Login */}
          <div className="text-center">
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="text-sm font-semibold text-gray-600 hover:text-gray-900 hover:underline transition-colors"
            >
              العودة إلى تسجيل الدخول
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailNotVerifiedPage;
