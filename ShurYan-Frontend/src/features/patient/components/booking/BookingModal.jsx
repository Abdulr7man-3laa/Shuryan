import React, { useEffect } from 'react';
import { 
  FaTimes, 
  FaChevronRight, 
  FaChevronLeft,
  FaStethoscope,
  FaCalendarAlt,
  FaClock,
  FaCheckCircle,
  FaCreditCard,
  FaCheckDouble
} from 'react-icons/fa';
import { useBooking } from '../../hooks/useBooking';
import ServiceSelection from './ServiceSelection';
import DatePicker from './DatePicker';
import TimeSlotPicker from './TimeSlotPicker';
import BookingSummary from './BookingSummary';
import PaymentStep from './PaymentStep';
import BookingSuccess from './BookingSuccess';

/**
 * BookingModal - Multi-step booking flow
 * Steps: 1-Service → 2-Date → 3-Time → 4-Summary → 5-Payment → 6-Success
 */
const BookingModal = ({ isOpen, onClose, doctor }) => {
  const {
    // State
    currentStep,
    services,
    selectedService,
    selectedServiceDetails,
    selectedDate,
    selectedTime,
    weeklySchedule,
    exceptionalDates,
    availableSlots,
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
  } = useBooking();

  // Initialize booking when modal opens
  useEffect(() => {
    if (isOpen && doctor) {
      initializeBooking(
        doctor.id,
        doctor.fullName,
        doctor.medicalSpecialtyName,
        doctor.profileImageUrl
      );
      fetchDoctorAvailability(doctor.id);
    }
  }, [isOpen, doctor]);

  // Start auto-refresh when on time selection step
  useEffect(() => {
    if (isOpen && currentStep === 3 && selectedDate) {
      startAutoRefresh();
    } else {
      stopAutoRefresh();
    }

    return () => stopAutoRefresh();
  }, [isOpen, currentStep, selectedDate]);

  // Close handler
  const handleClose = () => {
    stopAutoRefresh();
    resetBooking();
    onClose();
  };

  // Handle payment completion
  const handlePaymentComplete = (paymentData) => {
    // Store payment info and proceed to success
    console.log('Payment completed:', paymentData);
    goToStep(6);
  };

  // Download booking (placeholder)
  const handleDownload = () => {
    alert('سيتم تحميل تفاصيل الحجز قريباً...');
  };

  if (!isOpen) return null;

  // Step configuration
  const steps = [
    { number: 1, title: 'نوع الكشف', icon: <FaStethoscope /> },
    { number: 2, title: 'التاريخ', icon: <FaCalendarAlt /> },
    { number: 3, title: 'الوقت', icon: <FaClock /> },
    { number: 4, title: 'المراجعة', icon: <FaCheckCircle /> },
    { number: 5, title: 'الدفع', icon: <FaCreditCard /> },
    { number: 6, title: 'تاكيد', icon: <FaCheckDouble /> },
  ];

  // Can go back
  const canGoBack = currentStep > 1 && currentStep < 6;

  // Go back handler
  const handleGoBack = () => {
    if (currentStep === 2) {
      goToStep(1);
    } else if (currentStep === 3) {
      goToStep(2);
    } else if (currentStep === 4) {
      goToStep(3);
    } else if (currentStep === 5) {
      goToStep(4);
    }
  };

  // Can go forward
  const canGoForward =
    (currentStep === 1 && selectedService) ||
    (currentStep === 2 && selectedDate) ||
    (currentStep === 3 && selectedTime);

  // Go forward handler
  const handleGoForward = () => {
    if (currentStep === 1 && selectedService) {
      // Already handled by selectService
    } else if (currentStep === 2 && selectedDate) {
      // Already handled by selectDate
    } else if (currentStep === 3 && selectedTime) {
      goToStep(4);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 to-emerald-600 p-6 text-white flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">حجز موعد</h2>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <FaTimes className="text-xl" />
            </button>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <React.Fragment key={step.number}>
                {/* Step Circle */}
                <div className="flex flex-col items-center gap-2">
                  <div
                    className={`
                      w-12 h-12 rounded-full flex items-center justify-center
                      transition-all duration-300 text-xl
                      ${
                        currentStep >= step.number
                          ? 'bg-white text-teal-600 shadow-lg scale-110'
                          : 'bg-white/20 text-white/60'
                      }
                    `}
                  >
                    {step.icon}
                  </div>
                  <span
                    className={`
                      text-xs font-semibold transition-all duration-300
                      ${currentStep >= step.number ? 'text-white' : 'text-white/60'}
                    `}
                  >
                    {step.title}
                  </span>
                </div>

                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div
                    className={`
                      flex-1 h-1 mx-2 rounded-full transition-all duration-500
                      ${
                        currentStep > step.number
                          ? 'bg-white'
                          : 'bg-white/20'
                      }
                    `}
                  ></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {error && (
            <div className="mb-6 bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-start gap-3">
              <div className="bg-red-100 rounded-lg p-2">
                <FaTimes className="text-red-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-red-800 mb-1">حدث خطأ</p>
                <p className="text-xs text-red-700">{error}</p>
              </div>
              <button
                onClick={clearError}
                className="text-red-600 hover:text-red-700 p-1"
              >
                <FaTimes className="text-sm" />
              </button>
            </div>
          )}

          {/* Step 1: Service Selection */}
          {currentStep === 1 && (
            <ServiceSelection
              services={services}
              selectedService={selectedService}
              onSelectService={selectService}
            />
          )}

          {/* Step 2: Date Selection */}
          {currentStep === 2 && (
            <DatePicker
              weeklySchedule={weeklySchedule}
              exceptionalDates={exceptionalDates}
              selectedDate={selectedDate}
              onSelectDate={selectDate}
            />
          )}

          {/* Step 3: Time Selection */}
          {currentStep === 3 && (
            <TimeSlotPicker
              selectedDate={selectedDate}
              availableSlots={availableSlots}
              selectedTime={selectedTime}
              onSelectTime={selectTime}
              loading={loading}
            />
          )}

          {/* Step 4: Summary */}
          {currentStep === 4 && (
            <BookingSummary
              doctorName={doctor?.fullName}
              doctorSpecialty={doctor?.medicalSpecialtyName}
              doctorImage={doctor?.profileImageUrl}
              serviceDetails={selectedServiceDetails}
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              onEdit={goToStep}
              onConfirm={() => {
                confirmBooking();
                goToStep(5);
              }}
              loading={loading}
            />
          )}

          {/* Step 5: Payment */}
          {currentStep === 5 && (
            <PaymentStep
              doctorName={doctor?.fullName}
              serviceDetails={selectedServiceDetails}
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              onPaymentComplete={handlePaymentComplete}
              loading={loading}
            />
          )}

          {/* Step 6: Success */}
          {currentStep === 6 && (
            <BookingSuccess
              bookingResult={bookingResult}
              onClose={handleClose}
              onDownload={handleDownload}
            />
          )}
        </div>

        {/* Footer Navigation */}
        {currentStep < 4 && currentStep !== 5 && (
          <div className="border-t border-slate-200 p-4 bg-slate-50 flex-shrink-0">
            <div className="flex items-center justify-between gap-4">
              {/* Back Button */}
              <button
                onClick={handleGoBack}
                disabled={!canGoBack}
                className={`
                  flex items-center gap-2 px-6 py-3 rounded-xl font-semibold
                  transition-all duration-200
                  ${
                    canGoBack
                      ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }
                `}
              >
                <FaChevronRight className="text-sm" />
                <span>رجوع</span>
              </button>

              {/* Forward Button */}
              <button
                onClick={handleGoForward}
                disabled={!canGoForward}
                className={`
                  flex items-center gap-2 px-6 py-3 rounded-xl font-semibold
                  transition-all duration-200
                  ${
                    canGoForward
                      ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white hover:shadow-lg'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }
                `}
              >
                <span>التالي</span>
                <FaChevronLeft className="text-sm" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingModal;
