export const handleApiError = (error) => {
  if (error.message === 'Network Error' || error.code === 'ERR_NETWORK') {
    return 'خطأ في الاتصال بالخادم. تأكد من تشغيل الـ Backend';
  }

  // CORS error
  if (error.message?.includes('CORS')) {
    return 'خطأ في إعدادات الخادم (CORS)';
  }

  // Timeout error
  if (error.code === 'ECONNABORTED') {
    return 'انتهت مهلة الاتصال. حاول مرة أخرى';
  }

  // Backend returned an error message
  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  // Backend returned validation errors
  if (error.response?.data?.errors) {
    const errors = error.response.data.errors;
    const errorMessages = Object.values(errors).flat();
    return errorMessages.join(', ');
  }

  // HTTP status code errors
  if (error.response?.status) {
    switch (error.response.status) {
      case 400:
        return 'طلب غير صحيح. تحقق من البيانات المدخلة';
      case 401:
        return 'غير مصرح. يرجى تسجيل الدخول مرة أخرى';
      case 403:
        return 'ممنوع. ليس لديك صلاحية للوصول';
      case 404:
        return 'المورد غير موجود';
      case 409:
        return 'تعارض في البيانات. قد يكون الحساب موجوداً بالفعل';
      case 422:
        return 'بيانات غير صالحة';
      case 429:
        return 'تم تجاوز عدد المحاولات. حاول بعد قليل';
      case 500:
        return 'خطأ في الخادم. حاول مرة أخرى لاحقاً';
      case 502:
        return 'الخادم غير متاح مؤقتاً';
      case 503:
        return 'الخدمة غير متاحة حالياً';
      default:
        return `خطأ في الخادم (${error.response.status})`;
    }
  }

  // Default error message
  return 'حدث خطأ غير متوقع. حاول مرة أخرى';
};


export const logError = (error, context = '') => {
  if (import.meta.env.DEV) {
    console.error(`❌ Error${context ? ` in ${context}` : ''}:`, {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      code: error.code,
    });
  }
};

export const handleError = (error, context = '') => {
  logError(error, context);
  return handleApiError(error);
};

export default handleApiError;
