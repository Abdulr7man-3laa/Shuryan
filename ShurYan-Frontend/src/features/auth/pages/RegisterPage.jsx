// src/features/auth/pages/RegisterPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { FaUserPlus, FaHeart } from 'react-icons/fa';
import { useAuthStore } from '../store/authStore';
import { registerPatientSchema, registerDoctorSchema } from '../schemas/authSchemas';
import GoogleLoginButton from '../components/GoogleLoginButton';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { SPECIALTIES } from '@/utils/constants';

const RegisterPage = () => {
  const [userType, setUserType] = useState('patient');
  const navigate = useNavigate();
  
  const { register: registerUser, loading, error, clearError } = useAuthStore();

  const schema = userType === 'doctor' ? registerDoctorSchema : registerPatientSchema;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    mode: 'onBlur',
  });

  const handleUserTypeChange = (type) => {
    setUserType(type);
    reset();
  };

  const onSubmit = async (data) => {
    clearError();
    try {
      await registerUser(data, userType);
      
      // Navigate to email verification
      navigate('/verify-email', {
        state: { email: data.email },
      });
    } catch {
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
              <FaUserPlus className="text-2xl text-teal-600" />
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
              انضم إلينا
            </h1>
            <p className="text-gray-600">
              ابدأ رحلتك مع <span className="text-teal-600 font-semibold">شُريان</span>
            </p>
          </div>

          {error && (
            <Alert variant="error" className="mb-6">
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* User Type Selection */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <button
                type="button"
                onClick={() => handleUserTypeChange('patient')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  userType === 'patient'
                    ? 'border-teal-600 bg-teal-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">👤</div>
                  <div className="font-semibold">مريض</div>
                </div>
              </button>
              <button
                type="button"
                onClick={() => handleUserTypeChange('doctor')}
                className={`p-4 rounded-xl border-2 transition-all ${
                  userType === 'doctor'
                    ? 'border-teal-600 bg-teal-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">⚕️</div>
                  <div className="font-semibold">طبيب</div>
                </div>
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="الاسم الأول"
                placeholder="الاسم الأول"
                error={errors.firstName?.message}
                {...register('firstName')}
              />
              <Input
                label="الاسم الأخير"
                placeholder="الاسم الأخير"
                error={errors.lastName?.message}
                {...register('lastName')}
              />
            </div>

            <Input
              label="البريد الإلكتروني"
              type="email"
              placeholder="البريد الإلكتروني"
              error={errors.email?.message}
              {...register('email')}
            />

            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="كلمة المرور"
                type="password"
                placeholder="كلمة المرور"
                error={errors.password?.message}
                {...register('password')}
              />
              <Input
                label="تأكيد كلمة المرور"
                type="password"
                placeholder="تأكيد كلمة المرور"
                error={errors.confirmPassword?.message}
                {...register('confirmPassword')}
              />
            </div>

            {userType === 'doctor' && (
              <div>
                <Select
                  label="التخصص الطبي"
                  options={SPECIALTIES}
                  placeholder="اختر التخصص"
                  error={errors.medicalSpecialty?.message}
                  {...register('medicalSpecialty')}
                />
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              fullWidth
              disabled={loading}
              loading={loading}
            >
              {!loading && <span>إنشاء حساب والمتابعة</span>}
            </Button>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">أو</span>
              </div>
            </div>

            <GoogleLoginButton userType={userType} />
          </form>

          <div className="text-center mt-8 p-4 bg-gray-50 rounded-xl">
            <p className="text-gray-600">
              لديك حساب بالفعل؟{' '}
              <Link to="/login" className="text-teal-600 font-semibold hover:text-teal-700">
                سجل الدخول
              </Link>
            </p>
          </div>
        </div>

        {/* Welcome Section */}
        <div className="hidden lg:flex flex-col items-center justify-center text-center p-8">
          <div className="mb-8">
            <div className="w-40 h-40 mx-auto bg-gradient-to-br from-teal-400 to-emerald-400 rounded-full flex items-center justify-center shadow-2xl">
              <FaUserPlus className="text-white text-5xl" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            ابدأ رحلتك
          </h2>
          <p className="text-xl text-teal-600 font-semibold mb-8">
            مع منصة <span className="text-emerald-600">شُريان</span>
          </p>
          <p className="text-lg text-gray-600 max-w-md">
            انضم إلى آلاف المرضى والأطباء،
            <br />
            <span className="font-semibold">وابدأ رحلة العلاج الذكي</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;