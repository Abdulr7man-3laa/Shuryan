// src/features/auth/pages/ForgotPasswordPage.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { FaEnvelope, FaArrowLeft } from 'react-icons/fa';
import { useAuthStore } from '../store/authStore';
import { forgotPasswordSchema } from '../schemas/authSchemas';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const { forgotPassword, loading, error, clearError } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(forgotPasswordSchema),
    mode: 'onBlur',
  });

  const onSubmit = async (data) => {
    clearError();
    try {
      await forgotPassword(data.email);
      
      // Navigate to OTP verification page
      navigate('/verify-reset-otp', {
        state: { email: data.email },
      });
    } catch (err) {
      // Error handled in store
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-emerald-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-100 rounded-full mb-4">
            <FaEnvelope className="text-2xl text-teal-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            نسيت كلمة المرور؟
          </h1>
          <p className="text-gray-600">
            لا تقلق، سنساعدك في استعادة حسابك على{' '}
            <span className="text-teal-600 font-semibold">شُريان</span>
          </p>
        </div>

        {error && (
          <Alert variant="error" className="mb-6">
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            label="البريد الإلكتروني"
            type="email"
            placeholder="أدخل بريدك الإلكتروني"
            error={errors.email?.message}
            {...register('email')}
          />

          <Button
            type="submit"
            variant="primary"
            fullWidth
            disabled={loading}
            loading={loading}
          >
            {!loading && 'إرسال رمز التحقق'}
          </Button>
        </form>

        <div className="text-center mt-8 p-4 bg-gray-50 rounded-xl">
          <p className="text-gray-600 mb-2">تذكرت كلمة المرور؟</p>
          <Link
            to="/login"
            className="text-teal-600 font-semibold hover:text-teal-700 inline-flex items-center gap-2"
          >
            <FaArrowLeft className="text-sm" />
            <span>العودة لتسجيل الدخول</span>
          </Link>
        </div>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            سيتم إرسال رمز التحقق المكون من 6 أرقام إلى بريدك الإلكتروني
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;