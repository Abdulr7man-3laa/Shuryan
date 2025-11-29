import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import bookingService from '@/api/services/booking.service';

/**
 * Booking Store - Manages appointment booking state
 */
export const useBookingStore = create(
  devtools(
    (set, get) => ({
      // ==================== STATE ====================
      
      // Doctor Info
      selectedDoctorId: null,
      selectedDoctorName: null,
      selectedDoctorSpecialty: null,
      selectedDoctorImage: null,

      // Schedule Data
      weeklySchedule: [], // Array of 7 days
      exceptionalDates: [], // Array of special dates
      services: null, // { regularCheckup, reExamination }
      
      // Booking Selection
      selectedService: null, // 'regular' or 'reExam'
      selectedServiceDetails: null, // { price, duration, type }
      selectedDate: null, // YYYY-MM-DD
      selectedTime: null, // HH:mm
      
      // Available Slots
      bookedSlots: [], // Array of booked times for selected date
      availableSlots: [], // Calculated available slots
      
      // UI State
      currentStep: 1, // 1-5 (Service → Date → Time → Summary → Payment)
      loading: false,
      error: null,
      bookingResult: null, // Final booking confirmation

      // Auto-refresh
      refreshInterval: null,

      // ==================== ACTIONS ====================

      /**
       * Initialize booking for a doctor
       */
      initializeBooking: (doctorId, doctorName, doctorSpecialty, doctorImage) => {
        set({
          selectedDoctorId: doctorId,
          selectedDoctorName: doctorName,
          selectedDoctorSpecialty: doctorSpecialty,
          selectedDoctorImage: doctorImage,
          currentStep: 1,
          selectedService: null,
          selectedServiceDetails: null,
          selectedDate: null,
          selectedTime: null,
          bookedSlots: [],
          availableSlots: [],
          bookingResult: null,
          error: null,
        });
      },

      /**
       * Fetch doctor's availability data
       */
      fetchDoctorAvailability: async (doctorId) => {
        set({ loading: true, error: null, selectedDoctorId: doctorId });
        try {
          // Fetch all data in parallel
          const [scheduleRes, exceptionsRes, servicesRes] = await Promise.all([
            bookingService.getDoctorSchedule(doctorId),
            bookingService.getDoctorExceptions(doctorId),
            bookingService.getDoctorServices(doctorId),
          ]);

          console.log('📅 Schedule Response:', scheduleRes);
          console.log('📆 Exceptions Response:', exceptionsRes);
          console.log('💼 Services Response:', servicesRes);

          set({
            weeklySchedule: scheduleRes || [],
            exceptionalDates: exceptionsRes || [],
            services: servicesRes || null,
            loading: false,
          });
        } catch (error) {
          console.error('Failed to fetch doctor availability:', error);
          set({
            error: error.response?.data?.message || 'فشل تحميل بيانات الطبيب',
            loading: false,
          });
        }
      },

      /**
       * Select service type (Step 1)
       */
      selectService: (serviceType) => {
        const { services } = get();
        
        let serviceDetails = null;
        if (serviceType === 'regular' && services?.regularCheckup) {
          serviceDetails = {
            type: 1, // ✅ Regular = 1 (Backend Enum)
            name: 'كشف جديد',
            price: services.regularCheckup.price,
            duration: services.regularCheckup.duration,
          };
        } else if (serviceType === 'reExam' && services?.reExamination) {
          serviceDetails = {
            type: 2, // ✅ FollowUp = 2 (Backend Enum)
            name: 'كشف متابعة',
            price: services.reExamination.price,
            duration: services.reExamination.duration,
          };
        }

        set({
          selectedService: serviceType,
          selectedServiceDetails: serviceDetails,
          currentStep: 2, // Move to date selection
        });
      },

      /**
       * Select appointment date (Step 2)
       */
      selectDate: async (date) => {
        const { selectedDoctorId } = get();
        set({ loading: true, error: null, selectedDate: date });

        try {
          // Fetch booked slots for this date
          console.log('🔍 Fetching booked slots for:', { doctorId: selectedDoctorId, date });
          
          const bookedSlotsData = await bookingService.getBookedSlots(
            selectedDoctorId,
            date
          );
          
          console.log('📋 Booked Slots Response:', bookedSlotsData);
          console.log('📋 Booked Slots Type:', typeof bookedSlotsData);
          console.log('📋 Booked Slots Length:', bookedSlotsData?.length);
          console.log('📋 Booked Slots Array:', Array.isArray(bookedSlotsData));
          
          if (bookedSlotsData && bookedSlotsData.length > 0) {
            console.log('📋 First Booked Slot:', bookedSlotsData[0]);
            console.log('📋 ALL Booked Slots:');
            bookedSlotsData.forEach((slot, index) => {
              console.log(`   [${index}] time: ${slot.time}, appointmentId: ${slot.appointmentId}`);
            });
          }
          
          set({
            bookedSlots: bookedSlotsData || [],
            loading: false,
            currentStep: 3, // Move to time selection
          });

          // Calculate available slots
          get().calculateAvailableSlots(date);
        } catch (error) {
          console.error('⚠️ Failed to fetch booked slots (continuing with empty list):', error);
          // Continue with empty booked slots (show all as available)
          set({
            bookedSlots: [],
            loading: false,
            currentStep: 3,
          });

          // Calculate available slots with empty booked list
          get().calculateAvailableSlots(date);
        }
      },

      /**
       * Calculate available time slots for selected date
       */
      calculateAvailableSlots: (date) => {
        const {
          weeklySchedule,
          exceptionalDates,
          bookedSlots,
          selectedServiceDetails,
        } = get();

        console.log('🔍 calculateAvailableSlots called for date:', date);
        console.log('🔍 selectedServiceDetails:', selectedServiceDetails);
        console.log('🔍 weeklySchedule:', weeklySchedule);
        console.log('🔍 bookedSlots:', bookedSlots);

        if (!selectedServiceDetails) {
          console.error('❌ No selectedServiceDetails! Cannot calculate slots.');
          return;
        }

        const dateObj = new Date(date);
        const dayOfWeek = dateObj.getDay(); // 0=Sunday, 6=Saturday

        // Check if date has exceptional override
        const exception = exceptionalDates.find((ex) => ex.date === date);
        
        let fromTime = null;
        let toTime = null;
        let isClosed = false;

        if (exception) {
          // Use exceptional schedule
          if (exception.isClosed) {
            isClosed = true;
          } else {
            fromTime = exception.fromTime;
            toTime = exception.toTime;
          }
        } else {
          // Use weekly schedule
          const daySchedule = weeklySchedule.find((d) => d.dayOfWeek === dayOfWeek);
          if (daySchedule && daySchedule.isEnabled) {
            fromTime = daySchedule.fromTime;
            toTime = daySchedule.toTime;
          } else {
            isClosed = true;
          }
        }

        // If closed, no slots available
        if (isClosed || !fromTime || !toTime) {
          set({ availableSlots: [] });
          return;
        }

        // Generate time slots
        const slots = [];
        const duration = selectedServiceDetails.duration;
        const start = get().parseTime(fromTime);
        const end = get().parseTime(toTime);
        
        // Validate parsed times
        if (!start || !end) {
          console.error('calculateAvailableSlots: Failed to parse start or end time');
          set({ availableSlots: [] });
          return;
        }
        
        const now = new Date();

        let current = start;
        while (current < end) {
          const timeStr = get().formatTime(current);
          
          // Check if slot is booked or overlaps with booked slot
          const isBooked = bookedSlots.some((slot) => {
            // Exact match
            if (slot.time === timeStr) {
              console.log('🔴 Found booked slot:', { slotTime: slot.time, timeStr, match: true });
              return true;
            }
            
            // Check overlap in BOTH directions
            const slotStart = get().parseTime(slot.time);
            const slotEnd = new Date(slotStart.getTime() + duration * 60000);
            const ourStart = current;
            const ourEnd = new Date(current.getTime() + duration * 60000);
            
            // Overlap if:
            // 1. Booked slot starts during our appointment
            // 2. Our appointment starts during booked slot
            // 3. They overlap in any way
            const overlaps = (
              (slotStart >= ourStart && slotStart < ourEnd) ||  // Booked starts during ours
              (ourStart >= slotStart && ourStart < slotEnd) ||   // Ours starts during booked
              (slotStart <= ourStart && slotEnd >= ourEnd) ||    // Booked contains ours
              (ourStart <= slotStart && ourEnd >= slotEnd)       // Ours contains booked
            );
            
            if (overlaps) {
              console.log('⚠️ Overlap detected:', { 
                ourSlot: timeStr, 
                ourStart: get().formatTime(ourStart),
                ourEnd: get().formatTime(ourEnd),
                bookedSlot: slot.time,
                bookedEnd: get().formatTime(slotEnd)
              });
              return true;
            }
            
            return false;
          });
          
          // Check if slot is in the past
          const slotDateTime = new Date(`${date}T${timeStr}`);
          const isPast = slotDateTime < now;

          slots.push({
            time: timeStr,
            isAvailable: !isBooked && !isPast,
            isBooked,
            isPast,
          });
          
          if (isBooked) {
            console.log('🚫 Slot marked as booked:', timeStr);
          }

          // Move to next slot
          current = new Date(current.getTime() + duration * 60000);
        }

        console.log('✅ Generated slots:', {
          total: slots.length,
          available: slots.filter(s => s.isAvailable).length,
          booked: slots.filter(s => s.isBooked).length,
          past: slots.filter(s => s.isPast).length,
        });

        set({ availableSlots: slots });
      },

      /**
       * Select appointment time (Step 3)
       */
      selectTime: (time) => {
        set({
          selectedTime: time,
          currentStep: 4, // Move to summary
        });
      },

      /**
       * Confirm booking (Step 4 → 5)
       */
      confirmBooking: async () => {
        const {
          selectedDoctorId,
          selectedDate,
          selectedTime,
          selectedServiceDetails,
        } = get();

        set({ loading: true, error: null });

        try {
          const bookingData = {
            doctorId: selectedDoctorId,
            appointmentDate: selectedDate,
            appointmentTime: selectedTime,
            consultationType: selectedServiceDetails.type,
          };

          console.log('📤 Booking appointment with data:', bookingData);
          console.log('📤 Doctor ID:', selectedDoctorId);
          console.log('📤 Date:', selectedDate);
          console.log('📤 Time:', selectedTime);
          console.log('📤 Consultation Type:', selectedServiceDetails.type);

          const response = await bookingService.bookAppointment(bookingData);
          
          console.log('✅ Booking successful:', response);
          
          set({
            bookingResult: response.data,
            loading: false,
            currentStep: 5, // Move to payment/success
          });
        } catch (error) {
          console.error('❌ Booking failed:', error);
          console.error('❌ Error status:', error.response?.status);
          console.error('❌ Error data:', error.response?.data);
          console.error('❌ Error message:', error.response?.data?.message);
          
          let errorMessage = 'فشل حجز الموعد';
          
          // Handle specific error codes
          if (error.response?.status === 409) {
            console.error('⚠️ Conflict (409): Appointment already booked');
            errorMessage = error.response?.data?.message || 'هذا الموعد محجوز بالفعل. جاري تحديث المواعيد المتاحة...';
            
            // ✅ Refresh booked slots to show updated availability
            try {
              console.log('🔄 Refreshing booked slots after 409...');
              const bookedSlotsData = await bookingService.getBookedSlots(
                selectedDoctorId,
                selectedDate
              );
              set({ bookedSlots: bookedSlotsData || [] });
              get().calculateAvailableSlots(selectedDate);
              console.log('✅ Booked slots refreshed');
            } catch (refreshError) {
              console.error('⚠️ Failed to refresh booked slots:', refreshError);
            }
          } else if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
          } else if (error.message) {
            errorMessage = error.message;
          }
          
          set({
            error: errorMessage,
            loading: false,
          });
        }
      },

      /**
       * Go to specific step
       */
      goToStep: (step) => {
        set({ currentStep: step });
      },

      /**
       * Reset booking state
       */
      resetBooking: () => {
        const { stopAutoRefresh } = get();
        stopAutoRefresh();
        
        set({
          selectedDoctorId: null,
          selectedDoctorName: null,
          selectedDoctorSpecialty: null,
          selectedDoctorImage: null,
          weeklySchedule: [],
          exceptionalDates: [],
          services: null,
          selectedService: null,
          selectedServiceDetails: null,
          selectedDate: null,
          selectedTime: null,
          bookedSlots: [],
          availableSlots: [],
          currentStep: 1,
          loading: false,
          error: null,
          bookingResult: null,
        });
      },

      /**
       * Clear error
       */
      clearError: () => set({ error: null }),

      /**
       * Start auto-refresh for booked slots (every 30 seconds)
       */
      startAutoRefresh: () => {
        const { selectedDate, selectedDoctorId, refreshInterval } = get();
        
        // Clear existing interval
        if (refreshInterval) {
          clearInterval(refreshInterval);
        }

        // Start new interval
        const interval = setInterval(async () => {
          const currentDate = get().selectedDate;
          const doctorId = get().selectedDoctorId;
          
          if (currentDate && doctorId) {
            try {
              const bookedSlotsData = await bookingService.getBookedSlots(
                doctorId,
                currentDate
              );
              set({ bookedSlots: bookedSlotsData || [] });
              get().calculateAvailableSlots(currentDate);
            } catch (error) {
              console.error('⚠️ Auto-refresh failed (continuing with current data):', error);
              // Continue with current booked slots
            }
          }
        }, 30000); // 30 seconds

        set({ refreshInterval: interval });
      },

      /**
       * Stop auto-refresh
       */
      stopAutoRefresh: () => {
        const { refreshInterval } = get();
        if (refreshInterval) {
          clearInterval(refreshInterval);
          set({ refreshInterval: null });
        }
      },

      // ==================== HELPERS ====================

      /**
       * Parse time string to Date object
       * Supports both HH:mm and HH:mm:ss formats
       */
      parseTime: (timeStr) => {
        if (!timeStr) {
          console.error('parseTime: timeStr is null or undefined');
          return null;
        }
        
        try {
          // Split and take only hours and minutes (ignore seconds if present)
          const parts = timeStr.split(':');
          const hours = parseInt(parts[0], 10);
          const minutes = parseInt(parts[1], 10);
          
          // Validate hours and minutes
          if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
            console.error(`parseTime: Invalid time format: ${timeStr}`);
            return null;
          }
          
          const date = new Date();
          date.setHours(hours, minutes, 0, 0);
          return date;
        } catch (error) {
          console.error(`parseTime: Error parsing time ${timeStr}:`, error);
          return null;
        }
      },

      /**
       * Format Date object to HH:mm string
       */
      formatTime: (date) => {
        if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
          console.error('formatTime: Invalid date object');
          return '00:00';
        }
        
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
      },
    }),
    { name: 'BookingStore' }
  )
);
