// src/features/auth/pages/VerifyResetOtpPage.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { FaShieldAlt, FaArrowLeft, FaRedo } from 'react-icons/fa';
import { useAuthStore } from '../store/authStore';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';

const VerifyResetOtpPage = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { forgotPassword } = useAuthStore();

  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      navigate('/forgot-password');
    }
  }, [email, navigate]);

  const handleInputChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

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
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = pastedData.split('');
    setOtp([...newOtp, ...Array(6 - newOtp.length).fill('')]);
    
    const nextIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleVerify = () => {
    setError(null);
    const otpCode = otp.join('');

    if (otpCode.length !== 6) {
      setError('يرجى إدخال رمز التحقق المكون من 6 أرقام');
      return;
    }

    // Just navigate to reset password page with email and OTP
    // The actual verification will happen when user submits the new password
    navigate('/reset-password', {
      state: { 
        email,
        otpCode,
      },
      replace: true,
    });
  };

  const handleResendOtp = async () => {
    setError(null);
    setLoading(true);
    try {
      await forgotPassword(email);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
      // Show success message (optional)
      console.log('✅ تم إعادة إرسال رمز التحقق');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'فشل إعادة إرسال الرمز';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-emerald-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-100 rounded-full mb-4">
            <FaShieldAlt className="text-2xl text-teal-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            تحقق من بريدك الإلكتروني
          </h1>
          <p className="text-gray-600 mb-2">
            أدخل رمز التحقق المكون من 6 أرقام
          </p>
          <p className="text-sm text-teal-600 font-semibold">{email}</p>
        </div>

        {error && (
          <Alert variant="error" className="mb-6">
            {error}
          </Alert>
        )}

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
              رمز التحقق
            </label>
            <div className="flex justify-center gap-3" dir="ltr">
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
                  onPaste={handlePaste}
                  className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:border-teal-500 focus:outline-none transition-all"
                  disabled={loading}
                  autoFocus={index === 0}
                />
              ))}
            </div>
            {otp.join('').length > 0 && otp.join('').length < 6 && (
              <p className="text-amber-600 text-sm mt-2 text-center">
                يرجى إدخال 6 أرقام
              </p>
            )}
          </div>

          <Button
            type="button"
            variant="primary"
            fullWidth
            disabled={loading || otp.join('').length !== 6}
            loading={loading}
            onClick={handleVerify}
          >
            {!loading && 'التحقق والمتابعة'}
          </Button>

          <div className="text-center">
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={loading}
              className="text-teal-600 font-semibold hover:text-teal-700 inline-flex items-center gap-2 disabled:opacity-50"
            >
              <FaRedo className="text-sm" />
              <span>إعادة إرسال الرمز</span>
            </button>
          </div>
        </div>

        <div className="text-center mt-8 p-4 bg-gray-50 rounded-xl">
          <p className="text-gray-600 mb-2">إذا كان بريدك الإلكتروني موجوداً، ستتلقى رمزاً لإعادة تعيين كلمة المرور</p>
          <Link
            to="/forgot-password"
            className="text-teal-600 font-semibold hover:text-teal-700 inline-flex items-center gap-2"
          >
            <FaArrowLeft className="text-sm" />
            <span>العودة لإدخال البريد</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VerifyResetOtpPage;
