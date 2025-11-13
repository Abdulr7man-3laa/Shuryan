import { useEffect } from 'react';
import { useBookingStore } from '../stores/bookingStore';

/**
 * Custom hook for appointment booking
 * @param {Object} options - Hook options
 * @param {boolean} options.autoFetch - Auto-fetch doctor availability
 * @param {string} options.doctorId - Doctor ID to fetch
 * @returns {Object} Booking state and actions
 */
export const useBooking = ({ autoFetch = false, doctorId = null } = {}) => {
  const {
    // State
    selectedDoctorId,
    selectedDoctorName,
    selectedDoctorSpecialty,
    selectedDoctorImage,
    weeklySchedule,
    exceptionalDates,
    services,
    selectedService,
    selectedServiceDetails,
    selectedDate,
    selectedTime,
    bookedSlots,
    availableSlots,
    currentStep,
    loading,
    error,
    bookingResult,

    // Actions
    initializeBooking,
    fetchDoctorAvailability,
    selectService,
    selectDate,
    selectTime,
    confirmBooking,
    goToStep,
    resetBooking,
    clearError,
    startAutoRefresh,
    stopAutoRefresh,
    calculateAvailableSlots,
  } = useBookingStore();

  // Auto-fetch doctor availability on mount
  useEffect(() => {
    if (autoFetch && doctorId) {
      fetchDoctorAvailability(doctorId);
    }
  }, [autoFetch, doctorId]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAutoRefresh();
    };
  }, []);

  return {
    // State
    selectedDoctorId,
    selectedDoctorName,
    selectedDoctorSpecialty,
    selectedDoctorImage,
    weeklySchedule,
    exceptionalDates,
    services,
    selectedService,
    selectedServiceDetails,
    selectedDate,
    selectedTime,
    bookedSlots,
    availableSlots,
    currentStep,
    loading,
    error,
    bookingResult,

    // Actions
    initializeBooking,
    fetchDoctorAvailability,
    selectService,
    selectDate,
    selectTime,
    confirmBooking,
    goToStep,
    resetBooking,
    clearError,
    startAutoRefresh,
    stopAutoRefresh,
    calculateAvailableSlots,
  };
};
