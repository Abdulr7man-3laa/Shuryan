// src/features/auth/pages/ResetPasswordPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { FaLock, FaCheckCircle } from 'react-icons/fa';
import { useAuthStore } from '../store/authStore';
import { newPasswordSchema } from '../schemas/authSchemas';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';

const ResetPasswordPage = () => {
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { resetPassword, loading, error, clearError } = useAuthStore();

  const email = location.state?.email;
  const otpCode = location.state?.otpCode;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(newPasswordSchema),
    mode: 'onBlur',
  });

  useEffect(() => {
    if (!email || !otpCode) {
      navigate('/forgot-password');
    }
  }, [email, otpCode, navigate]);

  const onSubmit = async (data) => {
    clearError();
    try {
      await resetPassword(
        email,
        otpCode,
        data.newPassword,
        data.confirmPassword
      );
      
      setSuccess(true);
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login', {
          state: { message: 'تم تغيير كلمة المرور بنجاح. يمكنك الآن تسجيل الدخول' },
        });
      }, 2000);
    } catch (err) {
      // Error handled in store
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <FaCheckCircle className="text-4xl text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            تم تغيير كلمة المرور بنجاح!
          </h1>
          <p className="text-gray-600 mb-8">
            يمكنك الآن تسجيل الدخول باستخدام كلمة المرور الجديدة
          </p>
          <div className="animate-pulse">
            <p className="text-sm text-gray-500">جاري التوجيه لتسجيل الدخول...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-emerald-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-100 rounded-full mb-4">
            <FaLock className="text-2xl text-teal-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            كلمة المرور الجديدة
          </h1>
          <p className="text-gray-600 mb-2">
            أدخل كلمة المرور الجديدة لحسابك
          </p>
          <p className="text-sm text-teal-600 font-semibold">{email}</p>
        </div>

        {error && (
          <Alert variant="error" className="mb-6">
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            label="كلمة المرور الجديدة"
            type="password"
            placeholder="أدخل كلمة المرور الجديدة"
            error={errors.newPassword?.message}
            {...register('newPassword')}
          />

          <Input
            label="تأكيد كلمة المرور"
            type="password"
            placeholder="أعد إدخال كلمة المرور"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />

          <Button
            type="submit"
            variant="primary"
            fullWidth
            disabled={loading}
            loading={loading}
          >
            {!loading && 'تغيير كلمة المرور'}
          </Button>
        </form>

      </div>
    </div>
  );
};

export default ResetPasswordPage;