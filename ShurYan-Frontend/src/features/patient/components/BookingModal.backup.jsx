/**
 * BookingModal Component - Premium Medical Booking Wizard
 * Modern, clean, and user-friendly step-by-step booking
 * With smooth animations and professional medical design
 */

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DayPicker } from 'react-day-picker';
import { format, isAfter, isBefore, startOfDay, addMonths, isSameDay } from 'date-fns';
import { ar } from 'date-fns/locale';
import { 
  X,
  Stethoscope,
  CalendarDays,
  Clock,
  ChevronLeft,
  ChevronRight,
  Check,
  Heart,
  Sparkles,
  DollarSign,
} from 'lucide-react';
import { useBooking } from '../hooks/useBooking';
import 'react-day-picker/dist/style.css';

const BookingModal = ({ doctorInfo }) => {
  const {
    isBookingModalOpen,
    scheduleLoading,
    slotsLoading,
    error,
    services,
    selectedDate,
    selectedTime,
    selectedConsultationType,
    availableSlots,
    currentStep,
    selectDate,
    selectTimeSlot,
    selectConsultationType,
    proceedToSummary,
    goToNextStep,
    goToPreviousStep,
    closeBookingModal,
    clearError,
  } = useBooking();
  
  const [month, setMonth] = useState(new Date());
  
  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') closeBookingModal();
    };
    if (isBookingModalOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isBookingModalOpen, closeBookingModal]);
  
  // Animation variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };
  
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { type: 'spring', damping: 25, stiffness: 300 }
    },
    exit: { opacity: 0, scale: 0.95, y: 20 }
  };
  
  const stepVariants = {
    enter: { opacity: 0, x: 50 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };
  
  if (!isBookingModalOpen) return null;
  
  // Generate calendar days
  const generateCalendarDays = () => {
    const year = selectedMonth.getFullYear();
    const month = selectedMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay(); // 0=Sunday
    
    const days = [];
    
    // Add empty slots for days before month starts
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };
  
  const calendarDays = generateCalendarDays();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Format time to 12-hour with AM/PM
  const formatTimeTo12Hour = (time24) => {
    const [hours, minutes] = time24.split(':').map(Number);
    const period = hours >= 12 ? 'م' : 'ص';
    const hour12 = hours % 12 || 12;
    return `${hour12}:${String(minutes).padStart(2, '0')} ${period}`;
  };
  
  // Step titles
  const stepTitles = [
    { number: 1, title: 'اختر نوع الكشف', icon: FaStethoscope },
    { number: 2, title: 'اختر التاريخ', icon: FaCalendarAlt },
    { number: 3, title: 'اختر الوقت', icon: FaClock },
  ];
  
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={closeBookingModal}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Premium Header with Gradient */}
        <div className="relative bg-gradient-to-br from-[#00d5be] via-[#00c9b5] to-[#00bda8] p-8 text-white overflow-hidden">
          {/* Decorative Background Elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
          
          <div className="relative flex items-start justify-between">
            <div className="flex items-start gap-5">
              {/* Doctor Avatar */}
              {doctorInfo?.profileImageUrl ? (
                <img
                  src={doctorInfo.profileImageUrl}
                  alt={doctorInfo.fullName}
                  className="w-20 h-20 rounded-2xl object-cover border-4 border-white/30 shadow-xl"
                />
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center text-3xl font-black border-4 border-white/30 shadow-xl">
                  {doctorInfo?.fullName?.charAt(doctorInfo.fullName.indexOf(' ') + 1) || 'د'}
                </div>
              )}
              
              <div>
                <h2 className="text-3xl font-black mb-2 drop-shadow-lg">
                  احجز موعدك مع {doctorInfo?.fullName}
                </h2>
                <p className="text-xl font-bold text-white/90 drop-shadow">
                  {doctorInfo?.medicalSpecialtyName}
                </p>
                {doctorInfo?.clinic?.name && (
                  <p className="text-sm font-semibold text-white/80 mt-2">
                    {doctorInfo.clinic.name}
                  </p>
                )}
              </div>
            </div>
            
            {/* Close Button */}
            <button
              onClick={closeBookingModal}
              className="w-12 h-12 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-xl transition-all duration-300 hover:rotate-90 shadow-lg backdrop-blur-sm"
            >
              <FaTimes className="text-2xl" />
            </button>
          </div>
        </div>
        
        {/* Stepper Progress */}
        <div className="px-8 pt-6 pb-4">
          <div className="flex items-center justify-between relative">
            {/* Progress Bar */}
            <div className="absolute top-6 right-0 left-0 h-1 bg-slate-200 rounded-full">
              <div 
                className="h-full bg-gradient-to-r from-[#00d5be] to-[#00bda8] rounded-full transition-all duration-500"
                style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
              />
            </div>
            
            {/* Steps */}
            {stepTitles.map((step) => {
              const Icon = step.icon;
              const isCompleted = currentStep > step.number;
              const isCurrent = currentStep === step.number;
              
              return (
                <div key={step.number} className="relative flex flex-col items-center z-10 bg-white px-2">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-lg transition-all duration-300 ${
                    isCompleted
                      ? 'bg-gradient-to-br from-[#00d5be] to-[#00bda8] text-white shadow-lg'
                      : isCurrent
                      ? 'bg-gradient-to-br from-[#00d5be] to-[#00bda8] text-white shadow-xl scale-110'
                      : 'bg-slate-200 text-slate-500'
                  }`}>
                    {isCompleted ? <FaCheck /> : <Icon />}
                  </div>
                  <span className={`text-xs font-bold mt-2 text-center whitespace-nowrap transition-colors ${
                    isCurrent ? 'text-[#00d5be]' : isCompleted ? 'text-emerald-600' : 'text-slate-500'
                  }`}>
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Content Area */}
        <div className="p-8 overflow-y-auto max-h-[calc(95vh-240px)]">
          {scheduleLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-16 h-16 border-4 border-slate-200 border-t-[#00d5be] rounded-full animate-spin mb-4"></div>
              <p className="text-xl font-bold text-slate-600">جاري تحميل المواعيد المتاحة...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 flex items-center justify-between">
                  <p className="text-red-700 font-semibold">{error}</p>
                  <button
                    onClick={clearError}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <FaTimes />
                  </button>
                </div>
              )}
              
              {/* Step 1: Select Consultation Type */}
              {currentStep === 1 && (
                <div className="animate-fadeIn">
                  <h3 className="text-2xl font-black text-slate-800 mb-6 text-center">اختر نوع الكشف المناسب</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Regular Checkup */}
                  <button
                    onClick={() => selectConsultationType(1)}
                    className={`group relative p-6 rounded-2xl border-3 transition-all duration-300 ${
                      selectedConsultationType === 1
                        ? 'border-[#00d5be] bg-gradient-to-br from-[#00d5be]/10 to-[#00bda8]/10 shadow-xl scale-105'
                        : 'border-slate-200 bg-white hover:border-[#00d5be]/50 hover:shadow-lg'
                    }`}
                  >
                    {selectedConsultationType === 1 && (
                      <div className="absolute top-4 left-4">
                        <FaCheckCircle className="text-2xl text-[#00d5be] drop-shadow-lg" />
                      </div>
                    )}
                    
                    <div className="flex items-start gap-4">
                      <div className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300 ${
                        selectedConsultationType === 1
                          ? 'bg-gradient-to-br from-[#00d5be] to-[#00bda8] text-white shadow-xl'
                          : 'bg-slate-100 text-slate-600 group-hover:bg-[#00d5be]/20 group-hover:text-[#00d5be]'
                      }`}>
                        <FaStethoscope className="text-2xl" />
                      </div>
                      
                      <div className="flex-1 text-right">
                        <h4 className="text-xl font-black text-slate-800 mb-2">كشف جديد</h4>
                        <p className="text-sm text-slate-600 mb-3">
                          كشف شامل وتقييم حالة جديدة
                        </p>
                        
                        {services?.regularCheckup && (
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-2 text-slate-600">
                              <FaClock className="text-sm" />
                              <span className="text-sm font-semibold">
                                {services.regularCheckup.duration} دقيقة
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <FaMoneyBillWave className={`text-lg ${
                                selectedConsultationType === 1 ? 'text-[#00d5be]' : 'text-emerald-600'
                              }`} />
                              <span className="text-2xl font-black text-slate-800">
                                {services.regularCheckup.price}
                              </span>
                              <span className="text-sm font-bold text-slate-600">جنيه</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                  
                  {/* Re-examination */}
                  <button
                    onClick={() => selectConsultationType(2)}
                    className={`group relative p-6 rounded-2xl border-3 transition-all duration-300 ${
                      selectedConsultationType === 2
                        ? 'border-[#00d5be] bg-gradient-to-br from-[#00d5be]/10 to-[#00bda8]/10 shadow-xl scale-105'
                        : 'border-slate-200 bg-white hover:border-[#00d5be]/50 hover:shadow-lg'
                    }`}
                  >
                    {selectedConsultationType === 2 && (
                      <div className="absolute top-4 left-4">
                        <FaCheckCircle className="text-2xl text-[#00d5be] drop-shadow-lg" />
                      </div>
                    )}
                    
                    <div className="flex items-start gap-4">
                      <div className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300 ${
                        selectedConsultationType === 2
                          ? 'bg-gradient-to-br from-[#00d5be] to-[#00bda8] text-white shadow-xl'
                          : 'bg-slate-100 text-slate-600 group-hover:bg-[#00d5be]/20 group-hover:text-[#00d5be]'
                      }`}>
                        <FaStethoscope className="text-2xl" />
                      </div>
                      
                      <div className="flex-1 text-right">
                        <h4 className="text-xl font-black text-slate-800 mb-2">إعادة كشف</h4>
                        <p className="text-sm text-slate-600 mb-3">
                          متابعة حالة سابقة أو تقييم نتائج
                        </p>
                        
                        {services?.reExamination && (
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-2 text-slate-600">
                              <FaClock className="text-sm" />
                              <span className="text-sm font-semibold">
                                {services.reExamination.duration} دقيقة
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <FaMoneyBillWave className={`text-lg ${
                                selectedConsultationType === 2 ? 'text-[#00d5be]' : 'text-emerald-600'
                              }`} />
                              <span className="text-2xl font-black text-slate-800">
                                {services.reExamination.price}
                              </span>
                              <span className="text-sm font-bold text-slate-600">جنيه</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                </div>
                </div>
              )}
              
              {/* Step 2: Select Date */}
              {currentStep === 2 && (
                <div className="animate-fadeIn">
                  <h3 className="text-2xl font-black text-slate-800 mb-6 text-center">اختر التاريخ المناسب</h3>
                
                <div className="bg-gradient-to-br from-slate-50 to-white rounded-2xl p-6 border-2 border-slate-200 shadow-lg">
                  {/* Month Selector */}
                  <div className="flex items-center justify-between mb-6">
                    <button
                      onClick={() => setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1))}
                      className="w-10 h-10 rounded-xl bg-white hover:bg-[#00d5be] hover:text-white border-2 border-slate-200 hover:border-[#00d5be] flex items-center justify-center transition-all duration-300 shadow-sm hover:shadow-lg"
                    >
                      <FaArrowLeft />
                    </button>
                    
                    <h4 className="text-xl font-black text-slate-800">
                      {selectedMonth.toLocaleDateString('ar-EG', { month: 'long', year: 'numeric' })}
                    </h4>
                    
                    <button
                      onClick={() => {
                        const prevMonth = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() - 1);
                        if (prevMonth >= new Date(today.getFullYear(), today.getMonth())) {
                          setSelectedMonth(prevMonth);
                        }
                      }}
                      className="w-10 h-10 rounded-xl bg-white hover:bg-[#00d5be] hover:text-white border-2 border-slate-200 hover:border-[#00d5be] flex items-center justify-center transition-all duration-300 shadow-sm hover:shadow-lg rotate-180"
                      disabled={selectedMonth.getMonth() === today.getMonth() && selectedMonth.getFullYear() === today.getFullYear()}
                    >
                      <FaArrowLeft />
                    </button>
                  </div>
                  
                  {/* Days of Week */}
                  <div className="grid grid-cols-7 gap-3 mb-4">
                    {['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'].map((day) => (
                      <div key={day} className="text-center text-sm font-black text-slate-600">
                        {day}
                      </div>
                    ))}
                  </div>
                  
                  {/* Calendar Grid */}
                  <div className="grid grid-cols-7 gap-3">
                    {calendarDays.map((date, index) => {
                      if (!date) {
                        return <div key={`empty-${index}`} />;
                      }
                      
                      const isPast = date < today;
                      const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
                      const isToday = date.toDateString() === today.toDateString();
                      
                      return (
                        <button
                          key={date.toISOString()}
                          onClick={() => !isPast && selectDate(date)}
                          disabled={isPast}
                          className={`relative aspect-square rounded-xl font-bold text-base transition-all duration-300 ${
                            isPast
                              ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                              : isSelected
                              ? 'bg-gradient-to-br from-[#00d5be] to-[#00bda8] text-white shadow-xl scale-110 z-10'
                              : isToday
                              ? 'bg-blue-50 text-blue-600 border-2 border-blue-300 hover:bg-blue-100'
                              : 'bg-white text-slate-700 border-2 border-slate-200 hover:border-[#00d5be] hover:bg-[#00d5be]/10 hover:scale-105 shadow-sm hover:shadow-lg'
                          }`}
                        >
                          {date.getDate()}
                          {isToday && !isSelected && (
                            <span className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
                </div>
              )}
              
              {/* Step 3: Select Time Slot */}
              {currentStep === 3 && (
                <div className="animate-fadeIn">
                  <h3 className="text-2xl font-black text-slate-800 mb-2 text-center">اختر الوقت المناسب</h3>
                  {selectedDate && (
                    <p className="text-center text-sm font-semibold text-slate-600 bg-slate-100 px-4 py-2 rounded-lg inline-block mx-auto mb-6">
                      {selectedDate.toLocaleDateString('ar-EG', { weekday: 'long', day: 'numeric', month: 'long' })}
                    </p>
                  )}
                  
                  {slotsLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="w-12 h-12 border-4 border-slate-200 border-t-[#00d5be] rounded-full animate-spin"></div>
                    </div>
                  ) : availableSlots.length === 0 ? (
                    <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-8 text-center">
                      <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
                        <FaCalendarAlt className="text-3xl text-amber-600" />
                      </div>
                      <p className="text-xl font-bold text-amber-800 mb-2">لا توجد مواعيد متاحة</p>
                      <p className="text-amber-600">الرجاء اختيار تاريخ آخر</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                      {availableSlots.map((slot) => (
                        <button
                          key={slot.time}
                          onClick={() => slot.isAvailable && selectTimeSlot(slot.time)}
                          disabled={!slot.isAvailable}
                          className={`relative p-4 rounded-xl font-bold text-sm transition-all duration-300 ${
                            !slot.isAvailable
                              ? 'bg-slate-100 text-slate-400 cursor-not-allowed line-through'
                              : selectedTime === slot.time
                              ? 'bg-gradient-to-br from-[#00d5be] to-[#00bda8] text-white shadow-xl scale-110 z-10'
                              : 'bg-white text-slate-700 border-2 border-slate-200 hover:border-[#00d5be] hover:bg-[#00d5be]/10 hover:scale-105 shadow-sm hover:shadow-lg'
                          }`}
                        >
                          <FaClock className={`text-xs mx-auto mb-1 ${
                            selectedTime === slot.time ? 'text-white' : 'text-slate-500'
                          }`} />
                          {formatTimeTo12Hour(slot.time)}
                          {slot.isPast && (
                            <span className="absolute top-1 left-1 text-[10px] text-red-500">✕</span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Footer with Navigation Buttons */}
        <div className="border-t-2 border-slate-200 p-6 bg-gradient-to-r from-slate-50 to-white">
          <div className="flex items-center justify-between gap-4">
            {/* Right Side: Cancel or Back */}
            {currentStep === 1 ? (
              <button
                onClick={closeBookingModal}
                className="px-8 py-4 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-bold transition-all duration-300 hover:shadow-lg"
              >
                إلغاء
              </button>
            ) : (
              <button
                onClick={goToPreviousStep}
                className="flex items-center gap-2 px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 border-2 border-slate-300 hover:border-slate-400 rounded-xl font-bold transition-all duration-300 hover:shadow-lg"
              >
                <FaArrowRight />
                السابق
              </button>
            )}
            
            {/* Left Side: Next or Confirm */}
            {currentStep < 3 ? (
              <button
                onClick={goToNextStep}
                className="relative flex items-center gap-2 px-12 py-4 rounded-xl font-black text-lg transition-all duration-300 overflow-hidden group bg-gradient-to-r from-[#00d5be] via-[#00c9b5] to-[#00bda8] hover:from-[#00c9b5] hover:via-[#00bda8] hover:to-[#00b199] text-white shadow-xl hover:shadow-2xl hover:scale-105"
              >
                <span className="relative z-10 flex items-center gap-3">
                  التالي
                  <FaArrowLeft className="group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-full group-hover:translate-x-[-100%] transition-transform duration-700"></div>
              </button>
            ) : (
              <button
                onClick={proceedToSummary}
                className="relative flex items-center gap-2 px-12 py-4 rounded-xl font-black text-lg transition-all duration-300 overflow-hidden group bg-gradient-to-r from-[#00d5be] via-[#00c9b5] to-[#00bda8] hover:from-[#00c9b5] hover:via-[#00bda8] hover:to-[#00b199] text-white shadow-xl hover:shadow-2xl hover:scale-105"
              >
                <span className="relative z-10 flex items-center gap-3">
                  تأكيد الحجز
                  <FaCheckCircle className="group-hover:scale-110 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-full group-hover:translate-x-[-100%] transition-transform duration-700"></div>
              </button>
            )}
          </div>
          
          {/* Step Indicator */}
          <p className="text-center text-sm text-slate-500 mt-4">
            الخطوة {currentStep} من 3
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
