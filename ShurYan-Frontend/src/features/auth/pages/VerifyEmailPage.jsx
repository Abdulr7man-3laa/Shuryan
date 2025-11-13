// src/features/auth/pages/VerifyEmailPage.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { FaShieldAlt, FaCheckCircle, FaRedo } from 'react-icons/fa';
import { useAuthStore } from '../store/authStore';
import { verifyEmailSchema } from '../schemas/authSchemas';
import authService from '@/api/services/auth.service';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';

const VerifyEmailPage = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [timer, setTimer] = useState(300); // 5 minutes
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyEmail, loading, error, clearError } = useAuthStore();

  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      navigate('/register');
      return;
    }

    // Timer countdown
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [email, navigate]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handleInputChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    clearError();

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newOtp = [...otp];
    
    for (let i = 0; i < pastedData.length; i++) {
      newOtp[i] = pastedData[i];
    }
    
    setOtp(newOtp);
    inputRefs.current[Math.min(pastedData.length, 5)]?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpCode = otp.join('');

    if (otpCode.length !== 6) {
      return;
    }

    clearError();
    try {
      await verifyEmail(email, otpCode);
      navigate('/doctor/dashboard', { replace: true });
    } catch (err) {
      // Error handled in store
    }
  };

  const handleResendOTP = async () => {
    setResendLoading(true);
    setResendSuccess(false);
    try {
      await authService.resendVerification(email);
      setResendSuccess(true);
      setTimer(300); // Reset timer
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (err) {
      console.error('Resend failed:', err);
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <FaShieldAlt className="text-2xl text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            تأكيد حسابك
          </h1>
          <p className="text-gray-600 mb-2">
            تم إرسال رمز التحقق إلى بريدك الإلكتروني
          </p>
          <p className="text-sm text-blue-600 font-semibold">{email}</p>
        </div>

        {error && (
          <Alert variant="error" className="mb-6">
            {error}
          </Alert>
        )}

        {resendSuccess && (
          <Alert variant="success" className="mb-6">
            تم إرسال رمز التحقق بنجاح
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
              أدخل رمز التحقق المكون من 6 أرقام
            </label>
            <div className="flex justify-center gap-3" dir="ltr" onPaste={handlePaste}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition-all"
                  disabled={loading}
                />
              ))}
            </div>
          </div>

          <div className="text-center">
            {timer > 0 ? (
              <p className="text-sm text-gray-500">
                انتهاء صلاحية الرمز خلال:{' '}
                <span className="font-mono font-bold text-red-500">{formatTime(timer)}</span>
              </p>
            ) : (
              <p className="text-sm text-red-500 font-medium">
                انتهت صلاحية الرمز. يرجى طلب رمز جديد
              </p>
            )}
          </div>

          <Button
            type="submit"
            variant="primary"
            fullWidth
            disabled={loading || otp.join('').length !== 6}
            loading={loading}
          >
            {!loading && 'تأكيد الرمز'}
          </Button>

          <div className="text-center">
            <button
              type="button"
              onClick={handleResendOTP}
              disabled={resendLoading || timer > 240}
              className="text-sm font-medium text-blue-600 hover:text-blue-700 disabled:text-gray-400 disabled:cursor-not-allowed inline-flex items-center gap-2"
            >
              <FaRedo className={resendLoading ? 'animate-spin' : ''} />
              {resendLoading ? 'جاري الإرسال...' : 'إعادة إرسال الرمز'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VerifyEmailPage;