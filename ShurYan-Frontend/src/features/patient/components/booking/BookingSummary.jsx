import React from 'react';
import {
  FaUser,
  FaStethoscope,
  FaCalendarAlt,
  FaClock,
  FaMoneyBillWave,
  FaEdit,
  FaCheckCircle,
  FaHospital,
  FaMapMarkerAlt,
} from 'react-icons/fa';

/**
 * BookingSummary - Step 4: Review booking details before confirmation
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
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Premium Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-teal-50 to-emerald-50 border-2 border-teal-200 mb-2">
          <FaCheckCircle className="text-teal-600 text-4xl" />
        </div>
        <h2 className="text-3xl font-black text-slate-800">
          مراجعة تفاصيل الحجز
        </h2>
        <p className="text-slate-600 text-lg">
          تأكد من صحة البيانات قبل تأكيد الحجز
        </p>
      </div>

      {/* Doctor Card - Compact & Clean */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center gap-4">
          {/* Doctor Avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-teal-200">
              {doctorImage ? (
                <img
                  src={doctorImage}
                  alt={doctorName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-teal-50 to-emerald-50 flex items-center justify-center">
                  <FaUser className="text-teal-600 text-3xl" />
                </div>
              )}
            </div>
            <div className="absolute -bottom-2 -right-2 bg-teal-500 rounded-lg p-1.5 shadow-lg">
              <FaStethoscope className="text-white text-xs" />
            </div>
          </div>

          {/* Doctor Info */}
          <div className="flex-1">
            <p className="text-xs font-bold text-teal-600 mb-1 uppercase tracking-wide">الطبيب المعالج</p>
            <h3 className="text-2xl font-black text-slate-800">{doctorName}</h3>
            <p className="text-sm text-slate-600 mt-1 font-semibold">{doctorSpecialty}</p>
          </div>
        </div>
      </div>

      {/* Appointment Details - Clean Grid */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-6">
        <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
          <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
            <FaCalendarAlt className="text-teal-600 text-sm" />
          </div>
          تفاصيل الموعد
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Service Type */}
          <div className="group relative bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-5 border-2 border-slate-200 hover:border-teal-300 transition-all">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
                <FaStethoscope className="text-white text-sm" />
              </div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">نوع الكشف</p>
            </div>
            <p className="text-lg font-black text-slate-800 mb-1">
              {serviceDetails?.name}
            </p>
            <p className="text-xs text-slate-600 font-semibold">
              ⏱️ {serviceDetails?.duration} دقيقة
            </p>
            <button
              onClick={() => onEdit(1)}
              className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity text-teal-600 hover:text-teal-700 bg-white rounded-lg p-2 shadow-md"
              title="تعديل"
            >
              <FaEdit className="text-sm" />
            </button>
          </div>

          {/* Date */}
          <div className="group relative bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-5 border-2 border-slate-200 hover:border-blue-300 transition-all">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <FaCalendarAlt className="text-white text-sm" />
              </div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">التاريخ</p>
            </div>
            <p className="text-base font-black text-slate-800 leading-relaxed">
              {formatDateArabic(selectedDate)}
            </p>
            <button
              onClick={() => onEdit(2)}
              className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity text-blue-600 hover:text-blue-700 bg-white rounded-lg p-2 shadow-md"
              title="تعديل"
            >
              <FaEdit className="text-sm" />
            </button>
          </div>

          {/* Time */}
          <div className="group relative bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-5 border-2 border-slate-200 hover:border-purple-300 transition-all">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                <FaClock className="text-white text-sm" />
              </div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">الوقت</p>
            </div>
            <p className="text-2xl font-black text-slate-800">
              {formatTime12h(selectedTime)}
            </p>
            <button
              onClick={() => onEdit(3)}
              className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity text-purple-600 hover:text-purple-700 bg-white rounded-lg p-2 shadow-md"
              title="تعديل"
            >
              <FaEdit className="text-sm" />
            </button>
          </div>
        </div>

        {/* Price Section */}
        <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-xl p-5 border-2 border-teal-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-teal-500 rounded-xl flex items-center justify-center">
                <FaMoneyBillWave className="text-white text-lg" />
              </div>
              <span className="text-base font-bold text-slate-700">
                إجمالي التكلفة
              </span>
            </div>
            <span className="text-3xl font-black text-teal-600">
              {serviceDetails?.price} <span className="text-xl">جنيه</span>
            </span>
          </div>
        </div>
      </div>

      {/* Important Notes - Softer Design */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border-2 border-amber-200">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center">
            <FaHospital className="text-white text-xl" />
          </div>
          <div className="flex-1">
            <p className="text-base font-black text-amber-900 mb-3">
              ملاحظات هامة
            </p>
            <ul className="space-y-2.5 text-sm text-amber-800">
              <li className="flex items-start gap-3">
                <span className="text-amber-500 mt-1 text-lg">•</span>
                <span className="font-semibold">يرجى الحضور قبل الموعد بـ 15 دقيقة</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-500 mt-1 text-lg">•</span>
                <span className="font-semibold">في حالة التأخير، قد يتم إلغاء الموعد</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-amber-500 mt-1 text-lg">•</span>
                <span className="font-semibold">يمكنك إلغاء أو تعديل الموعد قبل 24 ساعة على الأقل</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Action Buttons - Premium Design */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={() => onEdit(1)}
          className="
            py-5 rounded-2xl border-2 border-slate-300 bg-white text-slate-700 font-black text-lg
            hover:bg-slate-50 hover:border-slate-400 hover:scale-105 transition-all duration-200
            flex items-center justify-center gap-3 shadow-sm hover:shadow-md
          "
        >
          <FaEdit className="text-xl" />
          <span>تعديل البيانات</span>
        </button>

        <button
          onClick={onConfirm}
          disabled={loading}
          className="
            py-5 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-500 
            text-white font-black text-lg shadow-lg hover:shadow-2xl hover:scale-105
            transition-all duration-200
            flex items-center justify-center gap-3
            disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
          "
        >
          {loading ? (
            <>
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-3 border-white border-t-transparent"></div>
              <span>جاري التأكيد...</span>
            </>
          ) : (
            <>
              <FaCheckCircle className="text-2xl" />
              <span>تأكيد الحجز</span>
            </>
          )}
        </button>
      </div>

      {/* Terms Notice */}
      <p className="text-sm text-center text-slate-600 leading-relaxed">
        بالضغط على "تأكيد الحجز"، أنت توافق على{' '}
        <span className="text-teal-600 font-bold cursor-pointer hover:underline">
          شروط الاستخدام
        </span>{' '}
        و{' '}
        <span className="text-teal-600 font-bold cursor-pointer hover:underline">
          سياسة الخصوصية
        </span>
      </p>
    </div>
  );
};

export default BookingSummary;
