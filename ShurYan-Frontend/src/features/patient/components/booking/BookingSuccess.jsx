import React from 'react';
import {
  FaCheckCircle,
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaMoneyBillWave,
  FaCreditCard,
  FaDownload,
  FaWhatsapp,
} from 'react-icons/fa';

/**
 * BookingSuccess - Step 6: Booking confirmed and paid successfully
 */
const BookingSuccess = ({ bookingResult, onClose, onDownload }) => {
  if (!bookingResult) return null;

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
    <div className="space-y-6">
      {/* Success Animation Header */}
      <div className="text-center">
        <div className="relative inline-block">
          {/* Animated Circles */}
          <div className="absolute inset-0 animate-ping">
            <div className="w-24 h-24 rounded-full bg-teal-400 opacity-20"></div>
          </div>
          <div className="absolute inset-0 animate-pulse">
            <div className="w-24 h-24 rounded-full bg-teal-300 opacity-30"></div>
          </div>
          
          {/* Main Icon */}
          <div className="relative inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-teal-500 to-emerald-500">
            <FaCheckCircle className="text-white text-5xl" />
          </div>
        </div>

        <h2 className="text-3xl font-bold text-slate-800 mt-6 mb-2">
          تم تأكيد الحجز بنجاح! 🎉
        </h2>
        <p className="text-slate-600 text-lg">
          موعدك محجوز ومؤكد. سيتم إرسال تفاصيل الحجز إليك.
        </p>
      </div>

      {/* Booking Details Card */}
      <div className="bg-white border-2 border-teal-200 rounded-2xl overflow-hidden shadow-lg shadow-teal-500/10">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-500 to-emerald-500 p-4 text-white text-center">
          <p className="text-sm text-white/80">رقم الحجز</p>
          <p className="text-2xl font-bold mt-1" dir="ltr">
            #{bookingResult.id?.slice(0, 8).toUpperCase()}
          </p>
        </div>

        {/* Details */}
        <div className="p-6 space-y-4">
          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-blue-600 mb-2">
                <FaCalendarAlt className="text-sm" />
                <span className="text-xs font-semibold">التاريخ</span>
              </div>
              <p className="text-sm font-bold text-slate-800">
                {formatDateArabic(bookingResult.appointmentDate)}
              </p>
            </div>

            <div className="bg-purple-50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-purple-600 mb-2">
                <FaClock className="text-sm" />
                <span className="text-xs font-semibold">الوقت</span>
              </div>
              <p className="text-sm font-bold text-slate-800">
                {formatTime12h(bookingResult.appointmentTime)}
              </p>
            </div>
          </div>

          {/* Status */}
          <div className="bg-teal-50 border border-teal-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-teal-100 rounded-lg p-2">
                  <FaCheckCircle className="text-teal-600" />
                </div>
                <div>
                  <p className="text-xs text-teal-600 font-semibold">حالة الحجز</p>
                  <p className="text-sm font-bold text-teal-700">
                    {bookingResult.status === 'Confirmed' ? 'مؤكد' : bookingResult.status}
                  </p>
                </div>
              </div>
              <div className="bg-teal-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                نشط
              </div>
            </div>
          </div>

          {/* Consultation Type */}
          <div className="bg-slate-50 rounded-xl p-4">
            <p className="text-xs text-slate-500 mb-2">نوع الاستشارة</p>
            <p className="text-sm font-bold text-slate-800">
              {bookingResult.consultationType === 0 ? 'كشف جديد' : 'كشف متابعة'}
            </p>
          </div>

          {/* Payment Status */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 rounded-lg p-2">
                  <FaCheckCircle className="text-green-600 text-xl" />
                </div>
                <div>
                  <p className="text-xs text-green-700 font-semibold">حالة الدفع</p>
                  <p className="text-lg font-bold text-green-900">
                    تم الدفع بنجاح
                  </p>
                </div>
              </div>
              <div className="bg-green-600 text-white px-3 py-1.5 rounded-full text-xs font-bold">
                {bookingResult.totalAmount} جنيه
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Important Notice */}
      <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <div className="bg-blue-100 rounded-lg p-2 mt-0.5">
            <FaCalendarAlt className="text-blue-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-blue-800 font-bold mb-1">
              📌 ملاحظات هامة
            </p>
            <p className="text-xs text-blue-700 leading-relaxed">
              يرجى الحضور قبل الموعد بـ 15 دقيقة. في حالة التأخير، يمكنك إلغاء أو تعديل الموعد قبل 24 ساعة على الأقل.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={onDownload}
          className="
            py-3 rounded-xl border-2 border-slate-300 text-slate-700 font-semibold
            hover:bg-slate-50 transition-all duration-200
            flex items-center justify-center gap-2
          "
        >
          <FaDownload className="text-sm" />
          <span>تحميل الحجز</span>
        </button>

        <button
          className="
            py-3 rounded-xl border-2 border-green-500 bg-green-50 text-green-700 font-semibold
            hover:bg-green-100 transition-all duration-200
            flex items-center justify-center gap-2
          "
        >
          <FaWhatsapp className="text-lg" />
          <span>مشاركة</span>
        </button>
      </div>

      {/* Close Button */}
      <button
        onClick={onClose}
        className="
          w-full py-5 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-500 
          text-white text-lg font-black hover:shadow-2xl hover:scale-105
          transition-all duration-200
          flex items-center justify-center gap-3
        "
      >
        <FaCheckCircle className="text-2xl" />
        <span>تم - إغلاق</span>
      </button>

      {/* Footer Note */}
      <div className="bg-slate-50 rounded-xl p-4 text-center">
        <p className="text-xs text-slate-600 leading-relaxed">
          سيتم إرسال تفاصيل الحجز إلى بريدك الإلكتروني ورقم هاتفك المسجل.
          <br />
          يمكنك إدارة مواعيدك من{' '}
          <span className="text-teal-600 font-semibold cursor-pointer hover:underline">
            صفحة مواعيدي
          </span>
        </p>
      </div>
    </div>
  );
};

export default BookingSuccess;
