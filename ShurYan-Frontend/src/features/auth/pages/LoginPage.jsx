// src/features/auth/pages/LoginPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Eye, EyeOff, ChevronRight, AlertCircle, ShieldCheck, Check } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { loginSchema } from '../schemas/authSchemas';
import GoogleLoginButton from '../components/GoogleLoginButton';
import PatientRegisterImg from '@/assets/PatientRegister.jpg';
import LogoIcon from '@/assets/LogoIcon.png';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading, error, clearError } = useAuthStore();
  
  // Get success message from location state
  const successMessage = location.state?.message;
  const messageType = location.state?.messageType;

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
      
      console.log('🔍 User after login:', user);
      console.log('📧 Email verified?', user?.isEmailVerified);
      
      // ✅ CHECK 1: Email Verification
      // If user's email is not verified, redirect to warning page
      if (user && !user.isEmailVerified) {
        console.log('⚠️ Email not verified, redirecting to /email-not-verified');
        navigate('/email-not-verified', { 
          state: { email: data.email },
          replace: true 
        });
        return;
      }
      
      // ✅ CHECK 2: Role-based Redirect (after email is verified)
      console.log('✅ Email verified, redirecting to dashboard');
      
      let redirectPath = '/doctor/dashboard'; // default
      
      if (user?.role === 'patient' || user?.roles?.includes('patient')) {
        redirectPath = '/patient/search';
      } else if (user?.role === 'doctor' || user?.roles?.includes('doctor')) {
        redirectPath = '/doctor/dashboard';
      } else if (user?.role === 'pharmacy' || user?.roles?.includes('pharmacy')) {
        redirectPath = '/pharmacy/dashboard';
      } else if (user?.role === 'laboratory' || user?.roles?.includes('laboratory')) {
        redirectPath = '/laboratory/dashboard';
      } else if (user?.role === 'verifier' || user?.roles?.includes('verifier')) {
        redirectPath = '/verifier/statistics';
      }
      
      console.log('🎯 Navigating to:', redirectPath);
      
      // Use intended page if exists, otherwise use role-based redirect
      const from = location.state?.from || redirectPath;
      navigate(from, { replace: true });
    } catch (error) {
      // Check if error is "Email not verified"
      console.error('Login error:', error);
      
      const errorMessage = error.message || '';
      const errorLower = errorMessage.toLowerCase();
      
      console.log('🔍 Error Message:', errorMessage);
      
      // If email not verified, redirect to warning page
      if (errorLower.includes('email not verified') || 
          errorLower.includes('البريد الإلكتروني غير مفعل') ||
          errorLower.includes('not verified')) {
        console.log('⚠️ Email verification error detected, redirecting to /email-not-verified');
        navigate('/email-not-verified', { 
          state: { email: data.email },
          replace: true 
        });
      }
      // Otherwise, error is already handled in store and displayed in UI
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 lg:p-8" dir="rtl">
      {/* Main Container */}
      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-6xl overflow-hidden flex flex-col lg:flex-row-reverse min-h-[650px]">

        {/* Right Side: Welcome Section with Image */}
        <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 overflow-hidden rounded-r-[2rem]" dir="ltr">
          {/* Background Image with Gradient Overlay */}
          <div className="absolute inset-0">
            <img 
              src={PatientRegisterImg}
              alt="Healthcare" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 to-teal-900/40 mix-blend-multiply" />
          </div>

          {/* Content */}
          <div className="relative z-10 flex flex-col justify-between p-10 text-white w-full text-left">
            {/* Logo & Brand */}
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 flex items-center justify-center">
                <img src={LogoIcon} alt="Shuryan Logo" className="w-full h-full object-contain" />
              </div>
              <span className="text-2xl font-bold tracking-wide">SHURYAN</span>
            </div>

            {/* Main Content */}
            <div className="space-y-6 translate-y-15">
              <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
                Welcome Back to<br /> 
                Your Health Journey.
              </h1>
              <p className="text-slate-300 text-lg leading-relaxed max-w-md">
                Your wellness is our priority. Access your personalized healthcare dashboard securely.
              </p>
            </div>

            {/* Badges */}
            <div className="flex gap-4">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
                <ShieldCheck size={20} className="text-teal-400" />
                <span className="text-sm font-medium">Secure Login</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
                <Check size={20} className="text-teal-400" />
                <span className="text-sm font-medium">24/7 Access</span>
              </div>
            </div>

            {/* Footer Text */}
            <p className="text-slate-400 text-xs">
              © 2024 Shuryan Healthcare Platform. All rights reserved.
            </p>
          </div>
        </div>

        {/* Left Side: Login Form */}
        <div className="lg:w-1/2 w-full p-6 lg:p-12 bg-white relative overflow-y-auto">
          
          {/* Header */}
          <div className="mb-8">
            <h3 className="text-3xl font-bold text-slate-800 mb-2">مرحباً بعودتك</h3>
            <p className="text-slate-600 text-lg">سجل دخولك للوصول إلى حسابك</p>
          </div>

          {/* Success Message (from redirect) */}
          {successMessage && messageType === 'success' && (
            <div className="mb-6 bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-start gap-3">
              <Check className="text-emerald-500 shrink-0 mt-0.5" size={18} />
              <p className="text-sm text-emerald-700">{successMessage}</p>
            </div>
          )}
          
          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={18} />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Email Field */}
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">
                البريد الإلكتروني <span className="text-rose-500">*</span>
              </label>
              <input 
                type="email" 
                placeholder="name@example.com"
                {...register('email')}
                className={`w-full px-4 py-3.5 rounded-xl border-2 ${
                  errors.email 
                    ? 'border-rose-300 focus:ring-rose-100 focus:border-rose-400' 
                    : 'border-slate-200/80 focus:ring-teal-50 focus:border-teal-400'
                } focus:outline-none focus:ring-4 transition-all bg-white hover:border-slate-300`}
              />
              {errors.email && (
                <p className="text-xs text-rose-500 flex items-center gap-1 mt-1">
                  <AlertCircle size={10} /> {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">
                كلمة المرور <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"}
                  placeholder="أدخل كلمة المرور"
                  {...register('password')}
                  className={`w-full px-4 py-3.5 rounded-xl border-2 ${
                    errors.password 
                      ? 'border-rose-300 focus:border-rose-400' 
                      : 'border-slate-200/80 focus:border-teal-400'
                  } focus:ring-4 focus:ring-teal-50 focus:outline-none bg-white hover:border-slate-300 transition-all`}
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)} 
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 rtl:left-4 rtl:right-auto"
                >
                  {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-rose-500 flex items-center gap-1 mt-1">
                  <AlertCircle size={10} /> {errors.password.message}
                </p>
              )}
            </div>

            {/* Forgot Password Link */}
            <div className="text-left">
              <Link
                to="/forgot-password"
                className="text-sm text-teal-600 hover:text-teal-700 font-semibold hover:underline inline-flex items-center gap-1"
              >
                نسيت كلمة المرور؟
                <ChevronRight size={14} className="rotate-180" />
              </Link>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-slate-900 hover:bg-teal-600 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-teal-500/30 transform transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
                  جاري تسجيل الدخول...
                </>
              ) : (
                <>
                  تسجيل الدخول
                  <ChevronRight size={20} className="rotate-180"/>
                </>
              )}
            </button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-slate-500">أو</span>
              </div>
            </div>

            {/* Google Login Button */}
            <GoogleLoginButton />

            {/* Register Link */}
            <div className="text-center mt-8 p-4 bg-slate-50 rounded-xl">
              <p className="text-slate-600">
                ليس لديك حساب؟{' '}
                <Link to="/register" className="text-teal-600 font-semibold hover:text-teal-700 hover:underline">
                  أنشئ حساباً جديداً
                </Link>
              </p>
            </div>

          </form>
        </div>
      </div>

    </div>
  );
};

export default LoginPage;