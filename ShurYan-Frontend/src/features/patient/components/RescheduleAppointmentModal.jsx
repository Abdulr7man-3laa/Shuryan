import { useState, useEffect } from 'react';
import { FaTimes, FaCalendarAlt } from 'react-icons/fa';
import { useBooking } from '../hooks/useBooking';
import { useBookingStore } from '../stores/bookingStore';
import DatePicker from './booking/DatePicker';
import TimeSlotPicker from './booking/TimeSlotPicker';

/**
 * Reschedule Appointment Modal
 * Uses the same booking system (DatePicker + TimeSlotPicker)
 */
const RescheduleAppointmentModal = ({ isOpen, onClose, onConfirm, loading: externalLoading, appointment }) => {
  const {
    selectedDate,
    selectedTime,
    weeklySchedule,
    exceptionalDates,
    availableSlots,
    loading,
    error,
    fetchDoctorAvailability,
    selectDate,
    selectTime,
    resetBooking,
    startAutoRefresh,
    stopAutoRefresh,
  } = useBooking();

  // Initialize when modal opens
  useEffect(() => {
    if (isOpen && appointment) {
      // Extract doctorId from appointment
      const doctorId = appointment.doctorId;
      
      console.log('🔍 Reschedule Modal - Appointment:', appointment);
      console.log('🔍 Doctor ID:', doctorId);
      
      if (doctorId) {
        console.log('✅ Fetching availability for doctor:', doctorId);
        
        // Set service details from appointment (for duration calculation)
        const serviceDetails = {
          type: appointment.consultationType || 1,
          name: appointment.consultationType === 2 ? 'كشف متابعة' : 'كشف جديد',
          duration: appointment.sessionDurationMinutes || 30,
          price: appointment.consultationFee || 0,
        };
        
        console.log('🔍 Setting service details:', serviceDetails);
        
        // Manually set service details in the store
        useBookingStore.setState({
          selectedServiceDetails: serviceDetails,
        });
        
        // Fetch doctor availability
        fetchDoctorAvailability(doctorId);
      } else {
        console.error('❌ No doctor ID found in appointment!');
      }
    }
  }, [isOpen, appointment]);

  // Start auto-refresh when date is selected
  useEffect(() => {
    if (isOpen && selectedDate) {
      startAutoRefresh();
    } else {
      stopAutoRefresh();
    }

    return () => stopAutoRefresh();
  }, [isOpen, selectedDate]);

  const handleSubmit = () => {
    if (!selectedDate || !selectedTime) {
      return;
    }

    // Get service duration from store
    const serviceDuration = useBookingStore.getState().selectedServiceDetails?.duration || 30;
    
    // selectedTime is a string like "14:00"
    // selectedDate is a string like "2025-11-05"
    
    // Parse time to get hours and minutes
    const [hours, minutes] = selectedTime.split(':').map(Number);
    
    // Calculate end time
    const totalMinutes = hours * 60 + minutes + serviceDuration;
    const endHours = Math.floor(totalMinutes / 60);
    const endMinutes = totalMinutes % 60;
    
    // Format as ISO strings WITHOUT timezone conversion
    // Backend expects: "2025-11-22T10:00:00" (no Z, no timezone)
    const startISO = `${selectedDate}T${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;
    const endISO = `${selectedDate}T${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}:00`;

    console.log('🔄 Reschedule - Selected Time:', selectedTime);
    console.log('🔄 Reschedule - Selected Date:', selectedDate);
    console.log('🔄 Reschedule - Duration:', serviceDuration, 'minutes');
    console.log('🔄 Reschedule - Start ISO:', startISO);
    console.log('🔄 Reschedule - End ISO:', endISO);

    onConfirm(startISO, endISO);
  };

  const handleClose = () => {
    if (!loading && !externalLoading) {
      stopAutoRefresh();
      resetBooking();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full my-8 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-500 to-cyan-600 p-6 text-white">
          <div className="flex items-center justify-between gap-6">
            {/* Title */}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <FaCalendarAlt className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold">إعادة جدولة الموعد</h2>
            </div>

            {/* Current Appointment Info */}
            {appointment && (
              <div className="flex-1 flex items-center justify-center">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20">
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-xs text-white/70">الموعد الحالي:</span>
                    <span className="font-medium">
                      {new Date(appointment.scheduledStartTime).toLocaleDateString('ar-EG', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                      })}
                    </span>
                    <span className="text-white/60">•</span>
                    <span className="font-medium">
                      {new Date(appointment.scheduledStartTime).toLocaleTimeString('ar-EG', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Close Button */}
            <button
              onClick={handleClose}
              disabled={loading}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors disabled:opacity-50"
            >
              <FaTimes className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content - Book Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 divide-x-reverse divide-slate-200">
          {/* Right Side - Date Selection */}
          <div className="p-6 space-y-4 bg-slate-50/30">
            {/* Date Picker */}
            <div>
              <DatePicker
                selectedDate={selectedDate}
                onSelectDate={selectDate}
                weeklySchedule={weeklySchedule}
                exceptionalDates={exceptionalDates}
                loading={loading}
              />
            </div>
          </div>

          {/* Left Side - Time Slot Selection */}
          <div className="p-6 space-y-4">
            {selectedDate ? (
              <>
                <div>
                  <TimeSlotPicker
                    selectedDate={selectedDate}
                    selectedTime={selectedTime}
                    onSelectTime={selectTime}
                    availableSlots={availableSlots}
                    loading={loading}
                  />
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-slate-400">
                  <FaCalendarAlt className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <p className="text-sm">اختر التاريخ أولاً لعرض المواعيد المتاحة</p>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-4 flex gap-3">
          <button
            onClick={handleClose}
            disabled={loading}
            className="flex-1 px-4 py-2.5 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            إلغاء
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || externalLoading || !selectedDate || !selectedTime}
            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-medium rounded-lg hover:from-teal-600 hover:to-cyan-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {externalLoading ? 'جاري الحفظ...' : 'تأكيد إعادة الجدولة'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RescheduleAppointmentModal;
