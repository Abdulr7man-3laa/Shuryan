import React from 'react';
import {
  FaUser,
  FaCalendarAlt,
  FaClock,
  FaMoneyBillWave,
  FaCheckCircle,
  FaChevronLeft,
} from 'react-icons/fa';

/**
 * BookingSummary - Simplified booking confirmation
 */
const BookingSummary = ({
  doctorName,
  doctorSpecialty,
  doctorImage,
  serviceDetails,
  selectedDate,
  selectedTime,
  onEdit,
  onConfirm,
  loading,
}) => {
  // Format date to Arabic
  const formatDateArabic = (dateStr) => {
    const date = new Date(dateStr);
    const dayNames = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    const monthNames = [
      'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
      'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
    ];
    return `${dayNames[date.getDay()]}، ${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
  };

  // Format time from 24h to 12h
  // Supports both HH:mm and HH:mm:ss formats
  const formatTime12h = (time24) => {
    if (!time24) return '--:--';
    
    try {
      // Split and take only hours and minutes (ignore seconds if present)
      const parts = time24.split(':');
      const hours = parseInt(parts[0], 10);
      const minutes = parseInt(parts[1], 10);
      
      if (isNaN(hours) || isNaN(minutes)) {
        console.error('formatTime12h: Invalid time format:', time24);
        return '--:--';
      }
      
      const period = hours >= 12 ? 'م' : 'ص';
      const hours12 = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
      return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
    } catch (error) {
      console.error('formatTime12h: Error formatting time:', error);
      return '--:--';
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* Booking Summary Card */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {/* Header with Doctor, Service & Price - All in One Line */}
        <div className="bg-gradient-to-r from-teal-500 to-teal-600 p-4">
          <div className="flex items-center gap-4 text-white">
            {/* Doctor Info */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white">
                {doctorImage ? (
                  <img src={doctorImage} alt={doctorName} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-white/20 flex items-center justify-center">
                    <FaUser className="text-white text-lg" />
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <h3 className="font-bold truncate">{doctorName}</h3>
                <p className="text-xs opacity-75 truncate">{doctorSpecialty}</p>
              </div>
            </div>

            {/* Vertical Divider */}
            <div className="h-12 w-px bg-white/30 flex-shrink-0"></div>

            {/* Service Info */}
            <div className="flex-1 min-w-0">
              <p className="text-xs opacity-75">نوع الكشف</p>
              <p className="font-bold truncate">{serviceDetails?.name}</p>
              <p className="text-xs opacity-75">⏱️ {serviceDetails?.duration} دقيقة</p>
            </div>

            {/* Vertical Divider */}
            <div className="h-12 w-px bg-white/30 flex-shrink-0"></div>

            {/* Price Info */}
            <div className="text-center flex-shrink-0">
              <p className="text-xs opacity-75">التكلفة</p>
              <p className="text-2xl font-black leading-tight">{serviceDetails?.price}</p>
              <p className="text-xs opacity-75">جنيه</p>
            </div>
          </div>
        </div>

        {/* Date & Time */}
        <div className="p-4 space-y-3">
          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
            <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <FaCalendarAlt className="text-teal-600" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-slate-500">التاريخ</p>
              <p className="font-bold text-slate-800">{formatDateArabic(selectedDate)}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
            <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <FaClock className="text-teal-600" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-slate-500">الوقت</p>
              <p className="text-lg font-black text-slate-800">{formatTime12h(selectedTime)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Important Notes */}
      <div className="bg-amber-50 rounded-xl border border-amber-200 p-4">
        <p className="font-bold text-amber-900 text-sm mb-2">ملاحظات هامة</p>
        <ul className="space-y-1.5 text-xs text-amber-800">
          <li className="flex items-start gap-2">
            <span className="text-amber-500 mt-0.5">•</span>
            <span>يرجى الحضور قبل الموعد بـ 15 دقيقة</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-500 mt-0.5">•</span>
            <span>في حالة التأخير، قد يتم إلغاء الموعد</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-amber-500 mt-0.5">•</span>
            <span>يمكنك إلغاء أو تعديل الموعد قبل 24 ساعة</span>
          </li>
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <button
          onClick={onConfirm}
          disabled={loading}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 text-white font-bold hover:from-teal-600 hover:to-teal-700 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <div className="inline-block animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              <span>جاري التأكيد...</span>
            </>
          ) : (
            <>
              <FaCheckCircle className="text-lg" />
              <span>تأكيد الحجز</span>
            </>
          )}
        </button>

        <button
          onClick={() => onEdit(1)}
          className="w-full py-3 rounded-xl bg-white border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
        >
          <FaChevronLeft className="text-sm" />
          <span>رجوع للتعديل</span>
        </button>
      </div>

      {/* Terms Notice */}
      <p className="text-xs text-center text-slate-500 leading-relaxed">
        بتأكيد الحجز، أنت توافق على{' '}
        <span className="text-teal-600 font-semibold">شروط الاستخدام</span>
        {' '}و{' '}
        <span className="text-teal-600 font-semibold">سياسة الخصوصية</span>
      </p>
    </div>
  );
};

export default BookingSummary;
