// src/features/auth/schemas/authSchemas.js
import * as yup from 'yup';

// Login Schema
export const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email('البريد الإلكتروني غير صحيح')
    .required('البريد الإلكتروني مطلوب'),
  password: yup
    .string()
    .min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل')
    .required('كلمة المرور مطلوبة'),
});

// Register Patient Schema
export const registerPatientSchema = yup.object().shape({
  firstName: yup
    .string()
    .min(2, 'الاسم الأول يجب أن يكون حرفين على الأقل')
    .required('الاسم الأول مطلوب'),
  lastName: yup
    .string()
    .min(2, 'الاسم الأخير يجب أن يكون حرفين على الأقل')
    .required('الاسم الأخير مطلوب'),
  email: yup
    .string()
    .email('البريد الإلكتروني غير صحيح')
    .required('البريد الإلكتروني مطلوب'),
  password: yup
    .string()
    .min(8, 'كلمة المرور يجب أن تكون 8 أحرف على الأقل')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'كلمة المرور يجب أن تحتوي على حرف كبير وصغير ورقم'
    )
    .required('كلمة المرور مطلوبة'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'كلمات المرور غير متطابقة')
    .required('تأكيد كلمة المرور مطلوب'),
});

// Register Doctor Schema
export const registerDoctorSchema = registerPatientSchema.shape({
  medicalSpecialty: yup
    .number()
    .positive('يجب اختيار تخصص طبي')
    .required('التخصص الطبي مطلوب'),
});

// Register Pharmacy Schema
export const registerPharmacySchema = yup.object().shape({
  entityName: yup
    .string()
    .min(3, 'اسم الصيدلية يجب أن يكون 3 أحرف على الأقل')
    .required('اسم الصيدلية مطلوب'),
  email: yup
    .string()
    .email('البريد الإلكتروني غير صحيح')
    .required('البريد الإلكتروني مطلوب'),
  password: yup
    .string()
    .min(8, 'كلمة المرور يجب أن تكون 8 أحرف على الأقل')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'كلمة المرور يجب أن تحتوي على حرف كبير وصغير ورقم'
    )
    .required('كلمة المرور مطلوبة'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'كلمات المرور غير متطابقة')
    .required('تأكيد كلمة المرور مطلوب'),
  terms: yup
    .boolean()
    .oneOf([true], 'يجب الموافقة على الشروط'),
});

// Register Laboratory Schema
export const registerLaboratorySchema = yup.object().shape({
  entityName: yup
    .string()
    .min(3, 'اسم المعمل يجب أن يكون 3 أحرف على الأقل')
    .required('اسم المعمل مطلوب'),
  email: yup
    .string()
    .email('البريد الإلكتروني غير صحيح')
    .required('البريد الإلكتروني مطلوب'),
  password: yup
    .string()
    .min(8, 'كلمة المرور يجب أن تكون 8 أحرف على الأقل')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'كلمة المرور يجب أن تحتوي على حرف كبير وصغير ورقم'
    )
    .required('كلمة المرور مطلوبة'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'كلمات المرور غير متطابقة')
    .required('تأكيد كلمة المرور مطلوب'),
  terms: yup
    .boolean()
    .oneOf([true], 'يجب الموافقة على الشروط'),
});

// Forgot Password Schema
export const forgotPasswordSchema = yup.object().shape({
  email: yup
    .string()
    .email('البريد الإلكتروني غير صحيح')
    .required('البريد الإلكتروني مطلوب'),
});

// Reset Password Schema
export const resetPasswordSchema = yup.object().shape({
  email: yup
    .string()
    .email('البريد الإلكتروني غير صحيح')
    .required('البريد الإلكتروني مطلوب'),
  otpCode: yup
    .string()
    .length(6, 'رمز التحقق يجب أن يكون 6 أرقام')
    .required('رمز التحقق مطلوب'),
  newPassword: yup
    .string()
    .min(8, 'كلمة المرور يجب أن تكون 8 أحرف على الأقل')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'كلمة المرور يجب أن تحتوي على حرف كبير وصغير ورقم'
    )
    .required('كلمة المرور الجديدة مطلوبة'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('newPassword')], 'كلمات المرور غير متطابقة')
    .required('تأكيد كلمة المرور مطلوب'),
});

// Verify Email Schema
export const verifyEmailSchema = yup.object().shape({
  email: yup
    .string()
    .email('البريد الإلكتروني غير صحيح')
    .required('البريد الإلكتروني مطلوب'),
  otpCode: yup
    .string()
    .length(6, 'رمز التحقق يجب أن يكون 6 أرقام')
    .required('رمز التحقق مطلوب'),
});

// New Password Schema (without email and OTP)
export const newPasswordSchema = yup.object().shape({
  newPassword: yup
    .string()
    .min(8, 'كلمة المرور يجب أن تكون 8 أحرف على الأقل')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'كلمة المرور يجب أن تحتوي على حرف كبير وصغير ورقم'
    )
    .required('كلمة المرور الجديدة مطلوبة'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('newPassword')], 'كلمات المرور غير متطابقة')
    .required('تأكيد كلمة المرور مطلوب'),
});