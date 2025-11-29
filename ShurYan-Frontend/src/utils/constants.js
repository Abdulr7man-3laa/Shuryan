export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:5117/api',
  TIMEOUT: Number(import.meta.env.VITE_API_TIMEOUT) || 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
};

// ==========================================
// User Roles & Types
// ==========================================

export const USER_ROLES = {
  PATIENT: 'Patient',
  DOCTOR: 'Doctor',
  LABORATORY: 'Laboratory',
  PHARMACY: 'Pharmacy',
  ADMIN: 'Admin',
};

export const USER_TYPES = {
  PATIENT: 'patient',
  DOCTOR: 'doctor',
  LABORATORY: 'laboratory',
  PHARMACY: 'pharmacy',
};

// ==========================================
// Routes
// ==========================================

export const ROUTES = {
  // Root & Common
  HOME: '/',
  UNAUTHORIZED: '/unauthorized',

  // Auth Routes
  LOGIN: '/login',
  REGISTER: '/register',
  VERIFY_EMAIL: '/verify-email',
  FORGOT_PASSWORD: '/forgot-password',
  VERIFY_RESET_OTP: '/verify-reset-otp',
  RESET_PASSWORD: '/reset-password',

  // Doctor Routes
  DOCTOR: {
    BASE: '/doctor',
    DASHBOARD: '/doctor/dashboard',
    PROFILE: '/doctor/profile',
    PATIENTS: '/doctor/patients',
    APPOINTMENTS: '/doctor/appointments',
    REVIEWS: '/doctor/reviews',
    SESSION: (appointmentId) => `/doctor/session/${appointmentId}`,
  },

  // Patient Routes
  PATIENT: {
    BASE: '/patient',
    SEARCH: '/patient/search',
    APPOINTMENTS: '/patient/appointments',
    PRESCRIPTIONS: '/patient/prescriptions',
    LAB_RESULTS: '/patient/lab-results',
    PROFILE: '/patient/profile',
  },

  // Pharmacy Routes
  PHARMACY: {
    BASE: '/pharmacy',
    DASHBOARD: '/pharmacy/dashboard',
    ORDERS: '/pharmacy/orders',
    PROFILE: '/pharmacy/profile',
  },

  // Verifier Routes
  VERIFIER: {
    BASE: '/verifier',
    STATISTICS: '/verifier/statistics',
    DOCTORS: '/verifier/doctors',
    PHARMACIES: '/verifier/pharmacies',
    LABORATORIES: '/verifier/laboratories',
  },
};

export const AUTH_ROUTES = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  VERIFY_EMAIL: '/auth/verify-email',
  FORGOT_PASSWORD: '/auth/forgot-password',
  VERIFY_RESET_OTP: '/auth/verify-reset-otp',
  RESET_PASSWORD: '/auth/reset-password',
};

// ==========================================
// Local Storage Keys
// ==========================================

export const STORAGE_KEYS = {
  AUTH: 'auth-storage',
  LOCALE: 'locale',
  THEME: 'theme',
  USER_PREFERENCES: 'user-preferences',
};

// ==========================================
// Validation Rules
// ==========================================

export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
  OTP_LENGTH: 6,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^(010|011|012|015)\d{8}$/, // Egyptian phone numbers
};

// ==========================================
// HTTP Status Codes
// ==========================================

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

// ==========================================
// App Info
// ==========================================

export const APP_INFO = {
  NAME: import.meta.env.VITE_APP_NAME || 'شُريان',
  NAME_EN: 'Shuryan',
  DESCRIPTION: 'منصة الرعاية الصحية الذكية',
  DESCRIPTION_EN: 'Smart Healthcare Platform',
  VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
};

// ==========================================
// Feature Flags
// ==========================================

export const FEATURE_FLAGS = {
  GOOGLE_LOGIN: import.meta.env.VITE_ENABLE_GOOGLE_LOGIN === 'true',
  FACEBOOK_LOGIN: import.meta.env.VITE_ENABLE_FACEBOOK_LOGIN === 'true',
  DARK_MODE: import.meta.env.VITE_ENABLE_DARK_MODE === 'true',
  NOTIFICATIONS: import.meta.env.VITE_ENABLE_NOTIFICATIONS === 'true',
  CHAT: import.meta.env.VITE_ENABLE_CHAT === 'true',
  ONLINE_PAYMENT: import.meta.env.VITE_ENABLE_ONLINE_PAYMENT === 'true',
};

// ==========================================
// Languages
// ==========================================

export const LANGUAGES = {
  AR: { code: 'ar', name: 'العربية', nameEn: 'Arabic', dir: 'rtl' },
  EN: { code: 'en', name: 'English', nameEn: 'English', dir: 'ltr' },
};

export const DEFAULT_LANGUAGE = LANGUAGES.AR.code;

// ==========================================
// Google OAuth Configuration
// ==========================================

// Build-time constants
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
const GOOGLE_REDIRECT_URI = import.meta.env.VITE_GOOGLE_REDIRECT_URI || '';

export const GOOGLE_CONFIG = {
  CLIENT_ID: GOOGLE_CLIENT_ID,
  REDIRECT_URI: GOOGLE_REDIRECT_URI,
  SCOPES: [
    'openid',
    'profile',
    'email',
  ].join(' '),

  // Helper methods
  isConfigured() {
    return Boolean(this.CLIENT_ID?.trim());
  },

  getRedirectUri() {
    // Runtime fallback only when needed
    return this.REDIRECT_URI || (typeof window !== 'undefined' ? window.location.origin : '');
  },
};

// Legacy support - keep for backward compatibility
export const isGoogleConfigured = () => {
  return GOOGLE_CONFIG.isConfigured();
};

// ==========================================
// Medical Specialties
// ==========================================

// Medical Specialties - Matching Backend Enum (MedicalSpecialty)
export const SPECIALTIES = [
  { value: 1, label: 'طب عام', nameEn: 'General Medicine' },
  { value: 2, label: 'طب الأطفال', nameEn: 'Pediatrics' },
  { value: 3, label: 'أمراض النساء والتوليد', nameEn: 'Obstetrics & Gynecology' },
  { value: 4, label: 'جراحة عامة', nameEn: 'General Surgery' },
  { value: 5, label: 'طب القلب', nameEn: 'Cardiology' },
  { value: 6, label: 'طب الأعصاب', nameEn: 'Neurology' },
  { value: 7, label: 'طب العظام', nameEn: 'Orthopedics' },
  { value: 8, label: 'طب الجلدية', nameEn: 'Dermatology' },
  { value: 9, label: 'طب العيون', nameEn: 'Ophthalmology' },
  { value: 10, label: 'أنف وأذن وحنجرة', nameEn: 'ENT' },
  { value: 11, label: 'طب نفسي', nameEn: 'Psychiatry' },
  { value: 12, label: 'طب المسالك البولية', nameEn: 'Urology' },
  { value: 13, label: 'طب الصدر', nameEn: 'Pulmonology' },
  { value: 14, label: 'طب الكلى', nameEn: 'Nephrology' },
  { value: 15, label: 'طب الجهاز الهضمي', nameEn: 'Gastroenterology' },
  { value: 16, label: 'طب الغدد الصماء', nameEn: 'Endocrinology' },
  { value: 17, label: 'طب الأورام', nameEn: 'Oncology' },
  { value: 18, label: 'طب الأشعة', nameEn: 'Radiology' },
  { value: 19, label: 'طب التخدير', nameEn: 'Anesthesiology' },
  { value: 20, label: 'طب الطوارئ', nameEn: 'Emergency Medicine' },
];

// Helper functions for specialties
export const getSpecialtyById = (id) => {
  return SPECIALTIES.find(specialty => specialty.value === id) || null;
};

export const getSpecialtyByValue = (value) => {
  return SPECIALTIES.find(specialty => specialty.value === value) || null;
};

export const getSpecialtyByName = (name) => {
  return SPECIALTIES.find(specialty => specialty.label === name || specialty.nameEn === name) || null;
};

export const getSpecialtyNames = () => {
  return SPECIALTIES.map(specialty => specialty.label);
};

// ==========================================
// Gender
// ==========================================

export const GENDER = {
  MALE: { id: 1, nameEn: 'Male', nameAr: 'ذكر' },
  FEMALE: { id: 2, nameEn: 'Female', nameAr: 'أنثى' },
};

export const GENDER_OPTIONS = [
  { id: 'male', name: GENDER.MALE.nameAr, value: GENDER.MALE.id },
  { id: 'female', name: GENDER.FEMALE.nameAr, value: GENDER.FEMALE.id },
];

export const mapGenderToArabic = (genderName) => {
  if (!genderName) return '';

  if (genderName === 'Male' || genderName === GENDER.MALE.nameEn) {
    return GENDER.MALE.nameAr;
  }
  if (genderName === 'Female' || genderName === GENDER.FEMALE.nameEn) {
    return GENDER.FEMALE.nameAr;
  }
  if (genderName === GENDER.MALE.nameAr) {
    return GENDER.MALE.nameAr;
  }
  if (genderName === GENDER.FEMALE.nameAr) {
    return GENDER.FEMALE.nameAr;
  }

  return genderName;
};

export const mapGenderToNumber = (genderName) => {
  if (!genderName) return null;

  if (
    genderName === 'Male' ||
    genderName === GENDER.MALE.nameAr ||
    genderName === GENDER.MALE.nameEn
  ) {
    return GENDER.MALE.id;
  }

  if (
    genderName === 'Female' ||
    genderName === GENDER.FEMALE.nameAr ||
    genderName === GENDER.FEMALE.nameEn
  ) {
    return GENDER.FEMALE.id;
  }

  return null;
};

// ==========================================
// Document Types
// ==========================================

export const DOCUMENT_TYPES = {
  // Required Documents (0-4)
  NATIONAL_ID: 0,
  MEDICAL_PRACTICE_LICENSE: 1,
  SYNDICATE_MEMBERSHIP_CARD: 2,
  MEDICAL_GRADUATION_CERTIFICATE: 3,
  SPECIALTY_CERTIFICATE: 4,

  // Optional Documents (5-8)
  ADDITIONAL_CERTIFICATES: 5,
  AWARDS_AND_RECOGNITIONS: 6,
  PUBLISHED_RESEARCH: 7,
  PROFESSIONAL_MEMBERSHIPS: 8,
};

export const DOCUMENT_TYPE_NAMES = {
  [DOCUMENT_TYPES.NATIONAL_ID]: 'البطاقة الشخصية',
  [DOCUMENT_TYPES.MEDICAL_PRACTICE_LICENSE]: 'رخصة مزاولة المهنة',
  [DOCUMENT_TYPES.SYNDICATE_MEMBERSHIP_CARD]: 'عضوية النقابة',
  [DOCUMENT_TYPES.MEDICAL_GRADUATION_CERTIFICATE]: 'شهادة التخرج من كلية الطب',
  [DOCUMENT_TYPES.SPECIALTY_CERTIFICATE]: 'شهادة التخصص',
  [DOCUMENT_TYPES.ADDITIONAL_CERTIFICATES]: 'شهادات مهنية إضافية',
  [DOCUMENT_TYPES.AWARDS_AND_RECOGNITIONS]: 'جوائز وتقديرات',
  [DOCUMENT_TYPES.PUBLISHED_RESEARCH]: 'أبحاث منشورة',
  [DOCUMENT_TYPES.PROFESSIONAL_MEMBERSHIPS]: 'عضويات مهنية',
};

export const getDocumentTypeName = (documentType) => {
  return DOCUMENT_TYPE_NAMES[documentType] || 'مستند غير معروف';
};

export const isDocumentRequired = (documentType) => {
  return documentType >= 0 && documentType <= 4;
};

export const getDocumentTypeFromFieldName = (fieldName) => {
  const mapping = {
    nationalId: DOCUMENT_TYPES.NATIONAL_ID,
    nationalIdPhoto: DOCUMENT_TYPES.NATIONAL_ID,
    medicalLicense: DOCUMENT_TYPES.MEDICAL_PRACTICE_LICENSE,
    medicalLicensePhoto: DOCUMENT_TYPES.MEDICAL_PRACTICE_LICENSE,
    syndicateMembership: DOCUMENT_TYPES.SYNDICATE_MEMBERSHIP_CARD,
    syndicateMembershipPhoto: DOCUMENT_TYPES.SYNDICATE_MEMBERSHIP_CARD,
    graduationCertificate: DOCUMENT_TYPES.MEDICAL_GRADUATION_CERTIFICATE,
    graduationCertificatePhoto: DOCUMENT_TYPES.MEDICAL_GRADUATION_CERTIFICATE,
    specializationCertificate: DOCUMENT_TYPES.SPECIALTY_CERTIFICATE,
    specializationCertificatePhoto: DOCUMENT_TYPES.SPECIALTY_CERTIFICATE,
  };

  const documentType = mapping[fieldName];

  if (documentType === undefined) {
    console.error(`Unknown field name: ${fieldName}. Available fields:`, Object.keys(mapping));
    throw new Error(`نوع المستند غير معروف: ${fieldName}`);
  }

  return documentType;
};

// ==========================================
// UI Constants
// ==========================================

export const APPOINTMENT_DURATIONS = [
  { value: '15', label: '15 دقيقة' },
  { value: '30', label: '30 دقيقة' },
  { value: '45', label: '45 دقيقة' },
  { value: '60', label: 'ساعة' },
];

export const DAYS_OF_WEEK = [
  { id: 'sunday', name: 'الأحد', nameEn: 'Sunday' },
  { id: 'monday', name: 'الاثنين', nameEn: 'Monday' },
  { id: 'tuesday', name: 'الثلاثاء', nameEn: 'Tuesday' },
  { id: 'wednesday', name: 'الأربعاء', nameEn: 'Wednesday' },
  { id: 'thursday', name: 'الخميس', nameEn: 'Thursday' },
  { id: 'friday', name: 'الجمعة', nameEn: 'Friday' },
  { id: 'saturday', name: 'السبت', nameEn: 'Saturday' },
];

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
};

export const DATE_FORMATS = {
  DISPLAY: 'DD/MM/YYYY',
  DISPLAY_WITH_TIME: 'DD/MM/YYYY HH:mm',
  API: 'YYYY-MM-DD',
  API_WITH_TIME: 'YYYY-MM-DDTHH:mm:ss',
};

export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_SIZE_MB: 5,
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'],
  ALLOWED_DOCUMENT_TYPES: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ],
  ALLOWED_ALL_TYPES: [
    'image/jpeg',
    'image/png',
    'image/jpg',
    'image/webp',
    'application/pdf',
  ],
};

// ==========================================
// Clinic Services
// ==========================================

export const CLINIC_SERVICES = [
  { id: 1, label: 'كشف', value: 'Examination' },
  { id: 2, label: 'سونار', value: 'Ultrasound' },
  { id: 3, label: 'رسم قلب', value: 'ECG' },
  { id: 4, label: 'تحاليل', value: 'LabTests' },
  { id: 5, label: 'أشعة', value: 'Radiology' },
  { id: 6, label: 'علاج طبيعي', value: 'PhysicalTherapy' },
  { id: 7, label: 'تطعيمات', value: 'Vaccinations' },
  { id: 8, label: 'عمليات جراحية صغرى', value: 'MinorSurgery' },
  { id: 9, label: 'تضميد جروح', value: 'WoundDressing' },
  { id: 10, label: 'قياس ضغط', value: 'BloodPressureCheck' },
  { id: 11, label: 'قياس سكر', value: 'BloodSugarCheck' },
  { id: 12, label: 'حقن', value: 'Injections' },
  { id: 13, label: 'خياطة جروح', value: 'Suturing' },
  { id: 14, label: 'إزالة غرز', value: 'StitchRemoval' },
  { id: 15, label: 'جبائر', value: 'Splinting' },
  { id: 16, label: 'استنشاق (بخار)', value: 'Nebulization' },
  { id: 17, label: 'غسيل أذن', value: 'EarWashing' },
  { id: 18, label: 'كي', value: 'Cauterization' },
  { id: 19, label: 'ختان', value: 'Circumcision' },
  { id: 20, label: 'تركيب قسطرة', value: 'CatheterInsertion' },
  { id: 21, label: 'سحب عينات', value: 'SampleCollection' },
  { id: 22, label: 'فحص نظر', value: 'VisionTest' },
  { id: 23, label: 'قياس سمع', value: 'HearingTest' },
  { id: 24, label: 'علاج تنفسي', value: 'RespiratoryTherapy' },
  { id: 25, label: 'علاج بالأكسجين', value: 'OxygenTherapy' },
  { id: 26, label: 'تخطيط عضلات', value: 'EMG' },
  { id: 27, label: 'تخطيط أعصاب', value: 'NerveConduction' },
];

// ==========================================
// Egyptian Governorates
// ==========================================

export const GOVERNORATES = [
  { id: 1, name: 'القاهرة', nameEn: 'Cairo' },
  { id: 2, name: 'الجيزة', nameEn: 'Giza' },
  { id: 3, name: 'الإسكندرية', nameEn: 'Alexandria' },
  { id: 4, name: 'الدقهلية', nameEn: 'Dakahlia' },
  { id: 5, name: 'البحر الأحمر', nameEn: 'Red Sea' },
  { id: 6, name: 'البحيرة', nameEn: 'Beheira' },
  { id: 7, name: 'الفيوم', nameEn: 'Fayoum' },
  { id: 8, name: 'الغربية', nameEn: 'Gharbia' },
  { id: 9, name: 'الإسماعيلية', nameEn: 'Ismailia' },
  { id: 10, name: 'المنوفية', nameEn: 'Menofia' },
  { id: 11, name: 'المنيا', nameEn: 'Minya' },
  { id: 12, name: 'القليوبية', nameEn: 'Qaliubiya' },
  { id: 13, name: 'الوادي الجديد', nameEn: 'New Valley' },
  { id: 14, name: 'شمال سيناء', nameEn: 'North Sinai' },
  { id: 15, name: 'بورسعيد', nameEn: 'Port Said' },
  { id: 16, name: 'قنا', nameEn: 'Qena' },
  { id: 17, name: 'الشرقية', nameEn: 'Sharqia' },
  { id: 18, name: 'سوهاج', nameEn: 'Sohag' },
  { id: 19, name: 'جنوب سيناء', nameEn: 'South Sinai' },
  { id: 20, name: 'السويس', nameEn: 'Suez' },
  { id: 21, name: 'أسوان', nameEn: 'Aswan' },
  { id: 22, name: 'أسيوط', nameEn: 'Assiut' },
  { id: 23, name: 'بني سويف', nameEn: 'Beni Suef' },
  { id: 24, name: 'دمياط', nameEn: 'Damietta' },
  { id: 25, name: 'كفر الشيخ', nameEn: 'Kafr El Sheikh' },
  { id: 26, name: 'الأقصر', nameEn: 'Luxor' },
  { id: 27, name: 'مرسى مطروح', nameEn: 'Matrouh' },
];

// Helper functions for governorates
export const getGovernorateById = (id) => {
  return GOVERNORATES.find(gov => gov.id === id) || null;
};

export const getGovernorateByName = (name) => {
  return GOVERNORATES.find(gov => gov.name === name || gov.nameEn === name) || null;
};

// Legacy support - keeping old format for backward compatibility
export const EGYPTIAN_GOVERNORATES = GOVERNORATES.map(gov => ({
  id: gov.id,
  label: gov.name,
  value: gov.nameEn.toLowerCase().replace(/\s+/g, '_'),
}));
