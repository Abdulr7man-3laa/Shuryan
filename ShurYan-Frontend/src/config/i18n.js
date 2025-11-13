// src/config/i18n.js

/**
 * Internationalization (i18n) Configuration
 * Simple i18n implementation without external libraries
 */

/**
 * Arabic translations (default)
 */
export const translations = {
  ar: {
    // Common
    common: {
      loading: 'جاري التحميل...',
      error: 'حدث خطأ',
      success: 'تم بنجاح',
      cancel: 'إلغاء',
      confirm: 'تأكيد',
      save: 'حفظ',
      delete: 'حذف',
      edit: 'تعديل',
      back: 'رجوع',
      next: 'التالي',
      submit: 'إرسال',
      search: 'بحث',
      filter: 'تصفية',
      close: 'إغلاق',
      yes: 'نعم',
      no: 'لا',
    },

    // Auth
    auth: {
      login: 'تسجيل الدخول',
      register: 'إنشاء حساب',
      logout: 'تسجيل الخروج',
      email: 'البريد الإلكتروني',
      password: 'كلمة المرور',
      confirmPassword: 'تأكيد كلمة المرور',
      firstName: 'الاسم الأول',
      lastName: 'الاسم الأخير',
      forgotPassword: 'نسيت كلمة المرور؟',
      resetPassword: 'إعادة تعيين كلمة المرور',
      verifyEmail: 'تحقق من البريد الإلكتروني',
      resendCode: 'إعادة إرسال الرمز',
      otpCode: 'رمز التحقق',
      loginSuccess: 'تم تسجيل الدخول بنجاح',
      logoutSuccess: 'تم تسجيل الخروج بنجاح',
      registerSuccess: 'تم إنشاء الحساب بنجاح',
      loginError: 'فشل تسجيل الدخول',
      registerError: 'فشل إنشاء الحساب',
      invalidCredentials: 'البريد الإلكتروني أو كلمة المرور غير صحيحة',
      emailAlreadyExists: 'البريد الإلكتروني مستخدم بالفعل',
      weakPassword: 'كلمة المرور ضعيفة',
      passwordMismatch: 'كلمات المرور غير متطابقة',
      haveAccount: 'لديك حساب بالفعل؟',
      noAccount: 'ليس لديك حساب؟',
      createAccount: 'إنشاء حساب جديد',
    },

    // User Types
    userTypes: {
      patient: 'مريض',
      doctor: 'طبيب',
      laboratory: 'مختبر',
      pharmacy: 'صيدلية',
    },

    // Medical Specialties
    specialties: {
      internal: 'باطنة',
      surgery: 'جراحة',
      pediatrics: 'أطفال',
      gynecology: 'نساء وتوليد',
      cardiology: 'قلب',
      orthopedics: 'عظام',
      dermatology: 'جلدية',
      ent: 'أنف وأذن وحنجرة',
      ophthalmology: 'عيون',
      dentistry: 'أسنان',
    },

    // Validation
    validation: {
      required: 'هذا الحقل مطلوب',
      invalidEmail: 'البريد الإلكتروني غير صحيح',
      minLength: 'يجب أن يكون على الأقل {min} أحرف',
      maxLength: 'يجب ألا يتجاوز {max} حرف',
      passwordRequirements: 'كلمة المرور يجب أن تحتوي على حرف كبير وصغير ورقم',
      otpLength: 'رمز التحقق يجب أن يكون 6 أرقام',
    },

    // Errors
    errors: {
      networkError: 'خطأ في الاتصال بالخادم',
      serverError: 'خطأ في الخادم',
      unauthorized: 'غير مصرح لك بالوصول',
      notFound: 'الصفحة غير موجودة',
      somethingWentWrong: 'حدث خطأ غير متوقع',
      tryAgain: 'حاول مرة أخرى',
      backToHome: 'العودة للرئيسية',
    },

    // Dashboard
    dashboard: {
      title: 'لوحة التحكم',
      welcome: 'مرحباً',
      overview: 'نظرة عامة',
      statistics: 'الإحصائيات',
      recentActivity: 'النشاط الأخير',
    },

    // Profile
    profile: {
      title: 'الملف الشخصي',
      editProfile: 'تعديل الملف الشخصي',
      changePassword: 'تغيير كلمة المرور',
      personalInfo: 'المعلومات الشخصية',
      contactInfo: 'معلومات الاتصال',
      settings: 'الإعدادات',
    },
  },

  // English translations (optional - for future)
  en: {
    common: {
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      cancel: 'Cancel',
      confirm: 'Confirm',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      back: 'Back',
      next: 'Next',
      submit: 'Submit',
      search: 'Search',
      filter: 'Filter',
      close: 'Close',
      yes: 'Yes',
      no: 'No',
    },
    // ... add more English translations as needed
  },
};

/**
 * Get translation by key
 * @param {string} key - Translation key (e.g., 'auth.login')
 * @param {string} locale - Locale code (default: 'ar')
 * @param {Object} params - Parameters to replace in translation
 * @returns {string} Translated text
 */
export const t = (key, locale = 'ar', params = {}) => {
  const keys = key.split('.');
  let value = translations[locale];

  for (const k of keys) {
    if (value && typeof value === 'object') {
      value = value[k];
    } else {
      return key; // Return key if translation not found
    }
  }

  // Replace parameters in translation
  if (typeof value === 'string' && Object.keys(params).length > 0) {
    return value.replace(/\{(\w+)\}/g, (match, param) => {
      return params[param] !== undefined ? params[param] : match;
    });
  }

  return value || key;
};

/**
 * Get current locale from localStorage or default
 * @returns {string} Current locale
 */
export const getCurrentLocale = () => {
  return localStorage.getItem('locale') || 'ar';
};

/**
 * Set current locale
 * @param {string} locale - Locale code
 */
export const setCurrentLocale = (locale) => {
  localStorage.setItem('locale', locale);
  // Update document direction
  document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = locale;
};

// Initialize locale on load
setCurrentLocale(getCurrentLocale());
