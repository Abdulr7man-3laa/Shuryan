import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { 
  User, 
  Stethoscope, 
  Pill, 
  FlaskConical, 
  Check, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  Activity, 
  Languages, 
  ChevronRight,
  AlertCircle,
  Building2,
  Lock
} from 'lucide-react';
import authService from '@/api/services/auth.service';
import { SPECIALTIES } from '@/utils/constants';
import DoctorRegisterImg from '@/assets/DoctorRegister.jpg';
import PatientRegisterImg from '@/assets/PatientRegister.jpg';
import LaboratoryRegisterImg from '@/assets/LaborayoryRegister.jpg';
import PharmacyRegisterImg from '@/assets/PharmacyRegister.jpg';
import LogoIcon from '@/assets/LogoIcon.png';
import GoogleLoginButton from '../components/GoogleLoginButton';

// Validation Schemas
const patientSchema = yup.object().shape({
  firstName: yup.string().min(2, 'الاسم الأول يجب أن يكون حرفين على الأقل').required('الاسم الأول مطلوب'),
  lastName: yup.string().min(2, 'الاسم الأخير يجب أن يكون حرفين على الأقل').required('الاسم الأخير مطلوب'),
  email: yup.string().email('البريد الإلكتروني غير صحيح').required('البريد الإلكتروني مطلوب'),
  password: yup.string().min(8, 'كلمة المرور يجب أن تكون 8 أحرف على الأقل').matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'كلمة المرور يجب أن تحتوي على حرف كبير وصغير ورقم').required('كلمة المرور مطلوبة'),
  confirmPassword: yup.string().oneOf([yup.ref('password')], 'كلمات المرور غير متطابقة').required('تأكيد كلمة المرور مطلوب'),
  terms: yup.boolean().oneOf([true], 'يجب الموافقة على الشروط'),
});

const doctorSchema = patientSchema.shape({
  medicalSpecialty: yup
    .number()
    .transform((value, originalValue) => {
      // If empty string, return undefined to trigger required validation
      return originalValue === '' ? undefined : value;
    })
    .typeError('يرجى اختيار التخصص الطبي من القائمة')
    .positive('يجب اختيار تخصص طبي صحيح')
    .required('التخصص الطبي مطلوب'),
});

const pharmacySchema = yup.object().shape({
  entityName: yup.string().min(3, 'اسم الصيدلية يجب أن يكون 3 أحرف على الأقل').required('اسم الصيدلية مطلوب'),
  email: yup.string().email('البريد الإلكتروني غير صحيح').required('البريد الإلكتروني مطلوب'),
  password: yup.string().min(8, 'كلمة المرور يجب أن تكون 8 أحرف على الأقل').matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'كلمة المرور يجب أن تحتوي على حرف كبير وصغير ورقم').required('كلمة المرور مطلوبة'),
  confirmPassword: yup.string().oneOf([yup.ref('password')], 'كلمات المرور غير متطابقة').required('تأكيد كلمة المرور مطلوب'),
  terms: yup.boolean().oneOf([true], 'يجب الموافقة على الشروط'),
});

const laboratorySchema = yup.object().shape({
  entityName: yup.string().min(3, 'اسم المعمل يجب أن يكون 3 أحرف على الأقل').required('اسم المعمل مطلوب'),
  email: yup.string().email('البريد الإلكتروني غير صحيح').required('البريد الإلكتروني مطلوب'),
  password: yup.string().min(8, 'كلمة المرور يجب أن تكون 8 أحرف على الأقل').matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'كلمة المرور يجب أن تحتوي على حرف كبير وصغير ورقم').required('كلمة المرور مطلوبة'),
  confirmPassword: yup.string().oneOf([yup.ref('password')], 'كلمات المرور غير متطابقة').required('تأكيد كلمة المرور مطلوب'),
  terms: yup.boolean().oneOf([true], 'يجب الموافقة على الشروط'),
});

// Translation Dictionary
const translations = {
  ar: {
    brandName: 'شُريان',
    brandSlogan: 'نبض الرعاية الصحية',
    welcomeTitle: 'انضم إلى شبكتنا',
    welcomeSubtitle: 'تواصل مع أفضل نظام رعاية صحية في مصر.',
    types: {
      patient: 'مريض',
      doctor: 'طبيب',
      pharmacy: 'صيدلية',
      lab: 'مختبر'
    },
    fields: {
      firstName: 'الاسم الأول',
      lastName: 'اسم العائلة',
      entityName: 'اسم المنشأة/العمل',
      email: 'البريد الإلكتروني',
      password: 'كلمة المرور',
      confirmPassword: 'تأكيد كلمة المرور',
      specialty: 'التخصص الطبي',
      specialtyPlaceholder: 'اختر التخصص',
      terms: 'أوافق على الشروط وسياسة الخصوصية'
    },
    placeholders: {
      email: 'name@example.com',
      entityPharmacy: 'صيدلية الأمل',
      entityLab: 'معامل القاهرة'
    },
    passwordStrength: ['ضعيف', 'مقبول', 'جيد', 'قوي', 'ممتاز'],
    buttons: {
      submit: 'إنشاء حساب',
      submitting: 'جارِ المعالجة...',
      login: 'لديك حساب بالفعل؟ تسجيل الدخول'
    },
    messages: {
      verificationDoc: 'ملاحظة: سيتم التحقق من الترخيص خلال ٣-٥ أيام عمل.',
      verificationBiz: 'ملاحظة: الوثائق الرسمية مطلوبة للموافقة.',
      instantAccess: 'احصل على وصول فوري للوحة التحكم الصحية.',
      successTitle: 'تم التسجيل بنجاح!',
      successBody: 'مرحبًا بك في شُريان. يرجى التحقق من بريدك الإلكتروني لتفعيل الحساب.',
      successVerified: 'سيتم تحويلك إلى صفحة التحقق...'
    }
  }
};

const RegisterPage = () => {
  const [lang] = useState('ar');
  const [userType, setUserType] = useState('patient');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const t = translations[lang];
  const isRTL = lang === 'ar';

  // Get schema based on user type
  const getSchema = () => {
    switch (userType) {
      case 'doctor': return doctorSchema;
      case 'pharmacy': return pharmacySchema;
      case 'lab': return laboratorySchema;
      default: return patientSchema;
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    resolver: yupResolver(getSchema()),
    mode: 'onBlur',
  });

  const password = watch('password', '');

  // Password strength calculation
  useEffect(() => {
    let strength = 0;
    if (password.length > 5) strength++;
    if (password.length > 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    setPasswordStrength(Math.min(strength, 4));
  }, [password]);

  const handleUserTypeChange = (type) => {
    setUserType(type);
    reset();
    setError('');
  };

  const onSubmit = async (data) => {
    setError('');
    setIsSubmitting(true);

    try {
      let response;
      
      switch (userType) {
        case 'patient':
          response = await authService.registerPatient(data);
          break;
        case 'doctor':
          response = await authService.registerDoctor(data);
          break;
        case 'pharmacy':
          response = await authService.registerPharmacy({ 
            name: data.entityName, 
            email: data.email, 
            password: data.password, 
            confirmPassword: data.confirmPassword 
          });
          break;
        case 'lab':
          response = await authService.registerLaboratory({ 
            name: data.entityName, 
            email: data.email, 
            password: data.password, 
            confirmPassword: data.confirmPassword 
          });
          break;
        default:
          throw new Error('نوع مستخدم غير صحيح');
      }

      if (response.isSuccess) {
        setIsSuccess(true);
        setTimeout(() => {
          navigate('/verify-email', { state: { email: data.email } });
        }, 2000);
      } else {
        setError(response.message || 'حدث خطأ أثناء التسجيل');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError(
        err.response?.data?.message ||
        err.response?.data?.errors?.[0] ||
        'حدث خطأ أثناء التسجيل. يرجى المحاولة مرة أخرى.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success Screen
  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center space-y-6 border-t-4 border-teal-500 animate-in fade-in zoom-in duration-300">
          <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check size={40} className="text-teal-600" />
          </div>
          <h2 className="text-3xl font-bold text-slate-800">{t.messages.successTitle}</h2>
          <p className="text-slate-600 leading-relaxed">
            {(userType === 'doctor' || userType === 'pharmacy' || userType === 'lab') 
              ? t.messages.successVerified 
              : t.messages.successBody}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 lg:p-8" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Main Container */}
      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-6xl overflow-hidden flex flex-col lg:flex-row-reverse min-h-[700px]">

        {/* Right Side: Welcome Section with Image (All Types) */}
        {(userType === 'doctor' || userType === 'patient' || userType === 'lab' || userType === 'pharmacy') && (
          <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 overflow-hidden rounded-r-[2rem]" dir="ltr">
            {/* Background Image with Gradient Overlay */}
            <div className="absolute inset-0">
              <img 
                src={
                  userType === 'doctor' ? DoctorRegisterImg : 
                  userType === 'patient' ? PatientRegisterImg : 
                  userType === 'lab' ? LaboratoryRegisterImg :
                  PharmacyRegisterImg
                } 
                alt={
                  userType === 'doctor' ? 'Doctor' : 
                  userType === 'patient' ? 'Patient' : 
                  userType === 'lab' ? 'Laboratory' :
                  'Pharmacy'
                } 
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
                  {userType === 'doctor' 
                    ? 'The Digital Bloodline' 
                    : userType === 'patient'
                    ? 'Your Health Journey'
                    : userType === 'lab'
                    ? 'Precision in Every'
                    : 'Your Trusted Partner'}
                  <br /> 
                  {userType === 'doctor' 
                    ? 'of Healthcare.' 
                    : userType === 'patient'
                    ? 'Starts Here.'
                    : userType === 'lab'
                    ? 'Test Result.'
                    : 'in Wellness.'}
                </h1>
                <p className="text-slate-300 text-lg leading-relaxed max-w-md">
                  Join Egypt's most trusted healthcare network. Secure, efficient, and dedicated to your well-being.
                </p>
              </div>

              {/* Badges */}
              <div className="flex gap-4">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
                  <ShieldCheck size={20} className="text-teal-400" />
                  <span className="text-sm font-medium">HIPAA Compliant</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
                  <Check size={20} className="text-teal-400" />
                  <span className="text-sm font-medium">Verified Network</span>
                </div>
              </div>

              {/* Footer Text */}
              <p className="text-slate-400 text-xs">
                © 2024 Shuryan Healthcare Platform. All rights reserved.
              </p>
            </div>
          </div>
        )}

        {/* Left Side: Registration Form */}
        <div className="lg:w-1/2 w-full p-6 lg:p-12 bg-white relative overflow-y-auto">
          
          {/* Header Actions */}
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-bold text-slate-800 hidden lg:block">{t.welcomeTitle}</h3>
            {/* Helper Message / Verification Notice */}
            <div className="bg-slate-50 p-3 rounded-lg flex items-start gap-3 text-xs text-slate-500 border border-slate-100">
              <ShieldCheck className="shrink-0 text-teal-500" size={16} />
              <p>
                {userType === 'patient' 
                  ? t.messages.instantAccess 
                  : (userType === 'doctor' ? t.messages.verificationDoc : t.messages.verificationBiz)}
              </p>
            </div>
            <span className="lg:hidden text-xl font-bold text-slate-800">{t.brandName}</span>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={18} />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* User Type Selection (Tabs) */}
          <div className="grid grid-cols-4 gap-2 mb-8 p-1.5 bg-slate-50/80 rounded-2xl border border-slate-200/60 shadow-sm">
            {[
              { id: 'patient', icon: User, label: t.types.patient },
              { id: 'doctor', icon: Stethoscope, label: t.types.doctor },
              { id: 'pharmacy', icon: Pill, label: t.types.pharmacy },
              { id: 'lab', icon: FlaskConical, label: t.types.lab }
            ].map((type) => (
              <button
                key={type.id}
                type="button"
                onClick={() => handleUserTypeChange(type.id)}
                className={`
                  flex flex-col items-center justify-center py-3 rounded-xl transition-all duration-300 text-sm
                  ${userType === type.id ? 'bg-white shadow-lg border border-teal-100 text-teal-600 font-bold scale-[1.02]' : 'text-slate-500 hover:bg-white/50 border border-transparent'}
                `}
              >
                <type.icon size={20} className={`mb-1 ${userType === type.id ? 'text-teal-500' : 'text-slate-400'}`} />
                <span className="text-[10px] sm:text-xs truncate w-full px-1">{type.label}</span>
              </button>
            ))}
          </div>

          {/* Dynamic Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

            {/* Name Fields Logic */}
            {(userType === 'patient' || userType === 'doctor') ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-700">{t.fields.firstName} <span className="text-rose-500">*</span></label>
                  <input 
                    type="text" 
                    {...register('firstName')}
                    className={`w-full px-4 py-3.5 rounded-xl border-2 ${errors.firstName ? 'border-rose-300 focus:ring-rose-100 focus:border-rose-400' : 'border-slate-200/80 focus:ring-teal-50 focus:border-teal-400'} focus:outline-none focus:ring-4 transition-all bg-white hover:border-slate-300`}
                  />
                  {errors.firstName && <p className="text-xs text-rose-500 flex items-center gap-1 mt-1"><AlertCircle size={10} /> {errors.firstName.message}</p>}
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-slate-700">{t.fields.lastName} <span className="text-rose-500">*</span></label>
                  <input 
                    type="text" 
                    {...register('lastName')}
                    className={`w-full px-4 py-3.5 rounded-xl border-2 ${errors.lastName ? 'border-rose-300 focus:ring-rose-100 focus:border-rose-400' : 'border-slate-200/80 focus:ring-teal-50 focus:border-teal-400'} focus:outline-none focus:ring-4 transition-all bg-white hover:border-slate-300`}
                  />
                  {errors.lastName && <p className="text-xs text-rose-500 flex items-center gap-1 mt-1"><AlertCircle size={10} /> {errors.lastName.message}</p>}
                </div>
              </div>
            ) : (
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700">{t.fields.entityName} <span className="text-rose-500">*</span></label>
                <div className="relative">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 rtl:right-4 rtl:left-auto" size={18} />
                  <input 
                    type="text" 
                    {...register('entityName')}
                    placeholder={userType === 'pharmacy' ? t.placeholders.entityPharmacy : t.placeholders.entityLab}
                    className={`w-full pl-11 pr-4 rtl:pr-11 rtl:pl-4 py-3.5 rounded-xl border-2 ${errors.entityName ? 'border-rose-300 focus:ring-rose-100 focus:border-rose-400' : 'border-slate-200/80 focus:ring-teal-50 focus:border-teal-400'} focus:outline-none focus:ring-4 transition-all bg-white hover:border-slate-300`}
                  />
                </div>
                {errors.entityName && <p className="text-xs text-rose-500 flex items-center gap-1 mt-1"><AlertCircle size={10} /> {errors.entityName.message}</p>}
              </div>
            )}

            {/* Specialty Dropdown (Doctor Only) */}
            {userType === 'doctor' && (
              <div className="space-y-1 animate-in slide-in-from-top-2 fade-in">
                <label className="text-sm font-semibold text-slate-700">{t.fields.specialty} <span className="text-rose-500">*</span></label>
                <select
                  {...register('medicalSpecialty')}
                  className={`w-full px-4 py-3.5 rounded-xl border-2 ${errors.medicalSpecialty ? 'border-rose-300 focus:border-rose-400' : 'border-slate-200/80 focus:border-teal-400'} focus:ring-4 focus:ring-teal-50 focus:outline-none bg-white hover:border-slate-300 transition-all`}
                >
                  <option value="">{t.fields.specialtyPlaceholder}</option>
                  {SPECIALTIES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
                {errors.medicalSpecialty && <p className="text-xs text-rose-500 flex items-center gap-1 mt-1"><AlertCircle size={10} /> {errors.medicalSpecialty.message}</p>}
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">{t.fields.email} <span className="text-rose-500">*</span></label>
              <input 
                type="email" 
                {...register('email')}
                placeholder={t.placeholders.email}
                className={`w-full px-4 py-3.5 rounded-xl border-2 ${errors.email ? 'border-rose-300 focus:ring-rose-100 focus:border-rose-400' : 'border-slate-200/80 focus:ring-teal-50 focus:border-teal-400'} focus:outline-none focus:ring-4 transition-all bg-white hover:border-slate-300`}
              />
              {errors.email && <p className="text-xs text-rose-500 flex items-center gap-1 mt-1"><AlertCircle size={10} /> {errors.email.message}</p>}
            </div>

            {/* Password Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700">{t.fields.password} <span className="text-rose-500">*</span></label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"}
                    {...register('password')}
                    className={`w-full px-4 py-3.5 rounded-xl border-2 ${errors.password ? 'border-rose-300 focus:border-rose-400' : 'border-slate-200/80 focus:border-teal-400'} focus:ring-4 focus:ring-teal-50 focus:outline-none bg-white hover:border-slate-300 transition-all`}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 rtl:left-4 rtl:right-auto">
                    {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
                  </button>
                </div>
                {/* Password Strength Indicator */}
                <div className="flex gap-1 mt-2 h-1.5">
                  {[0, 1, 2, 3].map((level) => (
                    <div 
                      key={level} 
                      className={`flex-1 rounded-full transition-all duration-300 ${passwordStrength > level ? 
                        (passwordStrength < 2 ? 'bg-rose-400' : passwordStrength < 3 ? 'bg-yellow-400' : 'bg-green-500') 
                        : 'bg-slate-200'}`}
                    />
                  ))}
                </div>
                {password && <span className="text-[10px] text-slate-500 text-right block">{t.passwordStrength[passwordStrength]}</span>}
                {errors.password && <p className="text-xs text-rose-500 flex items-center gap-1 mt-1"><AlertCircle size={10} /> {errors.password.message}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700">{t.fields.confirmPassword} <span className="text-rose-500">*</span></label>
                <input 
                  type="password" 
                  {...register('confirmPassword')}
                  className={`w-full px-4 py-3.5 rounded-xl border-2 ${errors.confirmPassword ? 'border-rose-300 focus:border-rose-400' : 'border-slate-200/80 focus:border-teal-400'} focus:ring-4 focus:ring-teal-50 focus:outline-none bg-white hover:border-slate-300 transition-all`}
                />
                {errors.confirmPassword && <p className="text-xs text-rose-500 flex items-center gap-1 mt-1"><AlertCircle size={10} /> {errors.confirmPassword.message}</p>}
              </div>
            </div>

            {/* Terms */}
            <label className="flex items-center gap-3 cursor-pointer group p-2 rounded-lg hover:bg-slate-50">
              <div className="relative flex items-center">
                <input 
                  type="checkbox" 
                  {...register('terms')}
                  className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-slate-300 transition-all checked:border-teal-500 checked:bg-teal-500" 
                />
                <Check size={14} className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 transition-opacity peer-checked:opacity-100" />
              </div>
              <span className={`text-sm ${errors.terms ? 'text-rose-500' : 'text-slate-600'} group-hover:text-slate-900 transition-colors`}>{t.fields.terms}</span>
            </label>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-slate-900 hover:bg-teal-600 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-teal-500/30 transform transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
                  {t.buttons.submitting}
                </>
              ) : (
                <>
                  {t.buttons.submit}
                  {isRTL ? <ChevronRight size={20} className="rotate-180"/> : <ChevronRight size={20}/>}
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
            <GoogleLoginButton userType={userType} />

            <div className="text-center flex justify-center mt-6">
              <p className="text-sm text-slate-600 mb-2">لديك حساب بالفعل؟</p>
              <Link to="/login" className="text-sm font-semibold text-teal-600 hover:text-teal-700 hover:underline">
                تسجيل الدخول
              </Link>
            </div>

          </form>
        </div>
      </div>

    </div>
  );
};

export default RegisterPage;