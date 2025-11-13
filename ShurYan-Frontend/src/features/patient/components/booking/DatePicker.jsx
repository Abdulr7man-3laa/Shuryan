import React, { useState, useEffect, useMemo } from 'react';
import { FaCalendarAlt, FaChevronLeft, FaChevronRight, FaTimes } from 'react-icons/fa';

/**
 * DatePicker - Step 2: Choose appointment date (30 days ahead)
 * Refactored for better performance and cleaner logic
 */
const DatePicker = ({
  weeklySchedule = [],
  exceptionalDates = [],
  selectedDate,
  onSelectDate,
}) => {
  const today = useMemo(() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
  }, []);

  const [currentMonth, setCurrentMonth] = useState(today);

  // Arabic month names
  const monthNames = [
    'يناير',
    'فبراير',
    'مارس',
    'أبريل',
    'مايو',
    'يونيو',
    'يوليو',
    'أغسطس',
    'سبتمبر',
    'أكتوبر',
    'نوفمبر',
    'ديسمبر',
  ];

  // Arabic day names
  const dayNames = ['أحد', 'اثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'];

  // Helper: Format date to YYYY-MM-DD
  const formatDateToYYYYMMDD = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Helper: Check day availability
  const getDayStatus = (date, dateStr, dayOfWeek) => {
    // Check if in past
    if (date < today) {
      return { isAvailable: false, status: 'disabled', hasException: false };
    }

    // Check if within 30 days
    const maxDate = new Date(today);
    maxDate.setDate(today.getDate() + 30);
    if (date > maxDate) {
      return { isAvailable: false, status: 'disabled', hasException: false };
    }

    // Check exceptional dates first (higher priority)
    const exception = exceptionalDates.find((ex) => ex.date === dateStr);
    if (exception) {
      if (exception.isClosed) {
        return { isAvailable: false, status: 'closed', hasException: true };
      } else {
        // Has exceptional hours
        return { isAvailable: true, status: 'exceptional', hasException: true };
      }
    }

    // Check weekly schedule
    const weeklyDay = weeklySchedule.find((d) => d.dayOfWeek === dayOfWeek);
    if (weeklyDay?.isEnabled) {
      return { isAvailable: true, status: 'available', hasException: false };
    }

    // Not available (day is disabled in weekly schedule)
    return { isAvailable: false, status: 'closed', hasException: false };
  };

  // Generate calendar days (memoized for performance)
  const days = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();

    const calendarDays = [];
    
    // Add empty cells for days before month start
    for (let i = 0; i < startDayOfWeek; i++) {
      calendarDays.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      date.setHours(0, 0, 0, 0);
      const dateStr = formatDateToYYYYMMDD(date);
      const dayOfWeek = date.getDay();

      const { isAvailable, status, hasException } = getDayStatus(date, dateStr, dayOfWeek);

      calendarDays.push({
        day,
        date,
        dateStr,
        isAvailable,
        status,
        hasException,
      });
    }

    return calendarDays;
  }, [currentMonth, weeklySchedule, exceptionalDates, today]);

  // Debug logs
  useEffect(() => {
    console.log('📅 DatePicker - Weekly Schedule:', weeklySchedule);
    console.log('📆 DatePicker - Exceptional Dates:', exceptionalDates);
    console.log('🗓️ DatePicker - Generated Days:', days.filter(d => d).length, 'days');
  }, [weeklySchedule, exceptionalDates, days]);


  // Format date to Arabic
  const formatDateArabic = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const day = date.getDate();
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();
    const dayName = dayNames[date.getDay()];
    return `${dayName}، ${day} ${month} ${year}`;
  };

  // Go to previous month
  const goToPreviousMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  // Go to next month
  const goToNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  // Check if can go to previous/next month (memoized)
  const { canGoPrevious, canGoNext } = useMemo(() => {
    const currentYear = currentMonth.getFullYear();
    const currentMonthNum = currentMonth.getMonth();
    const todayYear = today.getFullYear();
    const todayMonth = today.getMonth();

    // Can't go before current month
    const canGoPrev = 
      currentYear > todayYear || 
      (currentYear === todayYear && currentMonthNum > todayMonth);

    // Can go up to 2 months ahead (to cover 30 days)
    const maxDate = new Date(today);
    maxDate.setDate(today.getDate() + 30);
    const maxYear = maxDate.getFullYear();
    const maxMonth = maxDate.getMonth();

    const canGoNxt = 
      currentYear < maxYear || 
      (currentYear === maxYear && currentMonthNum < maxMonth);

    return { canGoPrevious: canGoPrev, canGoNext: canGoNxt };
  }, [currentMonth, today]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          اختر موعد الكشف
        </h2>
        <p className="text-slate-600">حدد اليوم المناسب لك</p>
      </div>

      {/* Selected Date Display */}
      {selectedDate && (
        <div className="bg-gradient-to-r from-teal-500 to-emerald-500 rounded-xl p-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2.5">
              <FaCalendarAlt className="text-xl" />
            </div>
            <div>
              <p className="text-xs text-white/80 mb-0.5">التاريخ المحدد</p>
              <p className="text-sm font-bold">{formatDateArabic(selectedDate)}</p>
            </div>
          </div>
          <button
            onClick={() => onSelectDate(null)}
            className="bg-white/20 hover:bg-white/30 rounded-lg p-2 transition-colors"
            title="إلغاء التحديد"
          >
            <FaTimes className="text-sm" />
          </button>
        </div>
      )}

      {/* Calendar */}
      <div className="bg-white border-2 border-slate-200 rounded-2xl overflow-hidden">
        {/* Month Navigation */}
        <div className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white p-4 flex items-center justify-between">
          <button
            onClick={goToNextMonth}
            disabled={!canGoNext}
            className={`p-2 rounded-lg transition-colors ${
              canGoNext
                ? 'hover:bg-white/20'
                : 'opacity-30 cursor-not-allowed'
            }`}
          >
            <FaChevronLeft />
          </button>

          <h3 className="text-lg font-bold">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </h3>

          <button
            onClick={goToPreviousMonth}
            disabled={!canGoPrevious}
            className={`p-2 rounded-lg transition-colors ${
              canGoPrevious
                ? 'hover:bg-white/20'
                : 'opacity-30 cursor-not-allowed'
            }`}
          >
            <FaChevronRight />
          </button>
        </div>

        {/* Day Names */}
        <div className="grid grid-cols-7 border-b border-slate-200">
          {dayNames.map((dayName, index) => (
            <div
              key={index}
              className="text-center py-3 text-sm font-bold text-slate-600 bg-slate-50"
            >
              {dayName}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 p-2 gap-1">
          {days.map((dayData, index) => {
            if (!dayData) {
              return <div key={index} className="aspect-square"></div>;
            }

            const isSelected = selectedDate === dayData.dateStr;

            return (
              <button
                key={index}
                onClick={() => {
                  if (dayData.isAvailable) {
                    console.log('📅 Selected Date:', dayData.dateStr, '- Status:', dayData.status);
                    onSelectDate(dayData.dateStr);
                  }
                }}
                disabled={!dayData.isAvailable}
                title={
                  dayData.status === 'available' ? 'متاح للحجز' :
                  dayData.status === 'exceptional' ? 'موعد استثنائي' :
                  dayData.status === 'closed' ? 'مغلق' :
                  dayData.status === 'disabled' ? 'غير متاح' : ''
                }
                className={`
                  aspect-square rounded-xl flex flex-col items-center justify-center
                  transition-all duration-200 text-sm font-bold relative
                  ${
                    isSelected
                      ? 'bg-gradient-to-br from-teal-500 to-emerald-500 text-white shadow-xl scale-110 ring-4 ring-teal-200'
                      : dayData.status === 'available'
                      ? 'bg-white text-slate-800 hover:bg-teal-50 hover:text-teal-600 border-2 border-slate-200 hover:border-teal-400 hover:scale-105 shadow-sm hover:shadow-md'
                      : dayData.status === 'exceptional'
                      ? 'bg-gradient-to-br from-blue-50 to-indigo-50 text-blue-800 hover:bg-blue-100 border-2 border-blue-300 hover:scale-105 shadow-sm hover:shadow-md'
                      : dayData.status === 'closed'
                      ? 'bg-red-50 text-red-400 cursor-not-allowed line-through opacity-60'
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed opacity-50'
                  }
                `}
              >
                <span className="relative z-10">{dayData.day}</span>
                {dayData.hasException && dayData.isAvailable && (
                  <div className="absolute top-1 left-1 w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                )}
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
};

export default DatePicker;
