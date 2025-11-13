import React from 'react';
import { FaClock, FaCheckCircle, FaTimes, FaCalendarDay, FaLock } from 'react-icons/fa';

/**
 * TimeSlotPicker - Step 3: Choose appointment time
 */
const TimeSlotPicker = ({
  selectedDate,
  availableSlots,
  selectedTime,
  onSelectTime,
  loading,
}) => {
  // Format time - just display as is (HH:mm)
  const formatTime = (time24) => {
    if (!time24) return '--:--';
    
    try {
      // Split and take only hours and minutes (ignore seconds if present)
      const parts = time24.split(':');
      const hours = parts[0].padStart(2, '0');
      const minutes = parts[1].padStart(2, '0');
      return `${hours}:${minutes}`;
    } catch (error) {
      console.error('formatTime: Error formatting time:', error);
      return '--:--';
    }
  };

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

  // No grouping - show all slots in one grid

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-teal-600 border-t-transparent"></div>
        <p className="mt-4 text-slate-600">جاري تحميل المواعيد المتاحة...</p>
      </div>
    );
  }

  if (!availableSlots.length) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 mb-4">
          <FaTimes className="text-red-500 text-3xl" />
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">
          لا توجد مواعيد متاحة
        </h3>
        <p className="text-slate-600">
          عذراً، لا توجد مواعيد متاحة في هذا اليوم. يرجى اختيار يوم آخر.
        </p>
      </div>
    );
  }

  const availableCount = availableSlots.filter((s) => s.isAvailable).length;
  const bookedCount = availableSlots.filter((s) => s.isBooked).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          اختر موعد الحجز
        </h2>
        <p className="text-slate-600">حدد الوقت المناسب لك</p>
      </div>

      {/* Selected Date Display */}
      <div className="bg-gradient-to-r from-teal-500 to-emerald-500 rounded-xl p-4 text-white">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2.5">
            <FaCalendarDay className="text-xl" />
          </div>
          <div>
            <p className="text-xs text-white/80 mb-0.5">التاريخ المحدد</p>
            <p className="text-sm font-bold">{formatDateArabic(selectedDate)}</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-teal-600">{availableCount}</div>
          <div className="text-xs text-teal-700 mt-1">موعد متاح</div>
        </div>
        <div className="bg-slate-100 border border-slate-200 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-slate-600">{bookedCount}</div>
          <div className="text-xs text-slate-700 mt-1">موعد محجوز</div>
        </div>
      </div>

      {/* Time Slots Grid - All slots in one grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
        {availableSlots.map((slot) => {
                  const isSelected = selectedTime === slot.time;

                  return (
                    <button
                      key={slot.time}
                      onClick={() => slot.isAvailable && onSelectTime(slot.time)}
                      disabled={!slot.isAvailable}
                      className={`
                        relative rounded-xl p-3 transition-all duration-200
                        ${
                          isSelected
                            ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/30 scale-105'
                            : slot.isAvailable
                            ? 'bg-white border-2 border-slate-200 text-slate-800 hover:border-teal-300 hover:shadow-md hover:scale-105'
                            : slot.isBooked
                            ? 'bg-slate-200 text-slate-500 cursor-not-allowed border-2 border-slate-300 opacity-60'
                            : 'bg-red-50 text-red-300 cursor-not-allowed border-2 border-red-100 opacity-60'
                        }
                      `}
                    >
                      {/* Selected Indicator */}
                      {isSelected && (
                        <div className="absolute -top-1 -left-1">
                          <FaCheckCircle className="text-white text-xs bg-teal-600 rounded-full" />
                        </div>
                      )}

                      {/* Time Display */}
                      <div className="flex flex-col items-center gap-1">
                        <FaClock
                          className={`text-sm ${
                            isSelected
                              ? 'text-white'
                              : slot.isAvailable
                              ? 'text-teal-600'
                              : slot.isBooked
                              ? 'text-slate-400'
                              : 'text-red-300'
                          }`}
                        />
                        <span className={`text-xs font-bold ${
                          slot.isBooked ? 'line-through' : ''
                        }`}>
                          {formatTime(slot.time)}
                        </span>
                      </div>

                      {/* Status Indicator */}
                      {slot.isBooked && (
                        <div className="mt-1 flex items-center gap-1">
                          <FaLock className="text-[8px] text-slate-500" />
                          <span className="text-[10px] bg-slate-400 text-white px-2 py-0.5 rounded-full font-bold">
                            محجوز
                          </span>
                        </div>
                      )}

                      {slot.isPast && !slot.isBooked && (
                        <div className="mt-1">
                          <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full">
                            فات
                          </span>
                        </div>
                      )}
                    </button>
                  );
        })}
      </div>

      {/* Auto-refresh Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-start gap-3">
        <div className="bg-blue-100 rounded-lg p-2 mt-0.5">
          <FaClock className="text-blue-600 text-sm" />
        </div>
        <div className="flex-1">
          <p className="text-xs text-blue-800 font-semibold mb-1">
            تحديث تلقائي
          </p>
          <p className="text-xs text-blue-700 leading-relaxed">
            يتم تحديث المواعيد المتاحة تلقائياً كل 30 ثانية لضمان الدقة.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TimeSlotPicker;
