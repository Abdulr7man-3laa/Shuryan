// src/features/auth/pages/LoginPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { FaEye, FaEyeSlash, FaHeart, FaArrowRight } from 'react-icons/fa';
import { useAuthStore } from '../store/authStore';
import { loginSchema } from '../schemas/authSchemas';
import GoogleLoginButton from '../components/GoogleLoginButton';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading, error, clearError } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
    mode: 'onBlur',
  });

  const onSubmit = async (data) => {
    clearError();
    try {
      await login(data.email, data.password);
      
      // Get user from store after login
      const { user } = useAuthStore.getState();
      
      // Redirect based on user role
      let redirectPath = '/doctor/dashboard'; // default
      
      if (user?.role === 'patient' || user?.roles?.includes('patient')) {
        redirectPath = '/patient/search';
      } else if (user?.role === 'doctor' || user?.roles?.includes('doctor')) {
        redirectPath = '/doctor/dashboard';
      } else if (user?.role === 'pharmacy' || user?.roles?.includes('pharmacy')) {
        redirectPath = '/pharmacy/dashboard';
      } else if (user?.role === 'verifier' || user?.roles?.includes('verifier')) {
        redirectPath = '/verifier/statistics';
      }
      
      // Use intended page if exists, otherwise use role-based redirect
      const from = location.state?.from || redirectPath;
      navigate(from, { replace: true });
    } catch (err) {
      // Error is handled in store
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-emerald-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Form Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-teal-100 rounded-full mb-4">
              <FaHeart className="text-2xl text-teal-600" />
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
              أهلاً وسهلاً
            </h1>
            <p className="text-gray-600">
              سعداء بعودتك إلى <span className="text-teal-600 font-semibold">شُريان</span>
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

            <Input
              label="كلمة المرور"
              type={showPassword ? 'text' : 'password'}
              placeholder="أدخل كلمة المرور"
              error={errors.password?.message}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                </button>
              }
              {...register('password')}
            />

            <div className="text-left">
              <Link
                to="/forgot-password"
                className="text-sm text-teal-600 hover:text-teal-700 font-medium"
              >
                نسيت كلمة المرور؟
              </Link>
            </div>

            <Button
              type="submit"
              variant="primary"
              fullWidth
              disabled={loading}
              loading={loading}
            >
              {!loading && <span>تسجيل الدخول</span>}
              {!loading && <FaArrowRight className="mr-2" />}
            </Button>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">أو</span>
              </div>
            </div>

            <GoogleLoginButton />
          </form>

          <div className="text-center mt-8 p-4 bg-gray-50 rounded-xl">
            <p className="text-gray-600">
              ليس لديك حساب؟{' '}
              <Link to="/register" className="text-teal-600 font-semibold hover:text-teal-700">
                أنشئ حساباً جديداً
              </Link>
            </p>
          </div>
        </div>

        {/* Welcome Section */}
        <div className="hidden lg:flex flex-col items-center justify-center text-center p-8">
          <div className="mb-8">
            <div className="w-40 h-40 mx-auto bg-gradient-to-br from-teal-400 to-emerald-400 rounded-full flex items-center justify-center shadow-2xl">
              <FaHeart className="text-white text-5xl" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            مرحباً بعودتك
          </h2>
          <p className="text-xl text-teal-600 font-semibold mb-8">
            إلى منصة <span className="text-emerald-600">شُريان</span>
          </p>
          <p className="text-lg text-gray-600 max-w-md">
            نحن نعتني بصحتك وصحة عائلتك،
            <br />
            <span className="font-semibold">خطوة بخطوة نحو حياة أفضل</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;