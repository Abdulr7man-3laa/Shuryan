import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import sessionService from '@/api/services/session.service';

export const useSessionStore = create(
  devtools(
    (set, get) => ({
      // ==================== STATE ====================
      
      // Current session data
      currentSession: null,
      sessionDetails: null,
      
      // Patient data for current session
      patientInfo: null,
      patientMedicalRecord: null,
      
      // Session actions data
      prescriptions: [],
      labTests: [],
      documentation: null,
      
      // UI states
      loading: false,
      error: null,
      
      // Timer state
      timeRemaining: null,
      timerInterval: null,

      // ==================== ACTIONS ====================

      /**
       * Start a new consultation session
       * @param {string} appointmentId - Appointment ID
       * @param {Object} appointmentData - Appointment details (patient info, etc.)
       */
      startSession: async (appointmentId, appointmentData) => {
        set({ loading: true, error: null });
        
        const result = await sessionService.startSession(appointmentId);
        
        if (!result.success) {
          set({ error: result.error, loading: false });
          return { success: false, error: result.error };
        }

        const sessionData = result.data;
        
        console.log('🔍 [startSession] Session Data:', sessionData);
        console.log('🔍 [startSession] appointmentData:', appointmentData);
        
        // New API structure: duration (not sessionDurationMinutes)
        const durationMinutes = sessionData.duration || appointmentData.duration || 30;
        
        console.log('🔍 [startSession] Duration Minutes:', durationMinutes);
        console.log('🔍 [startSession] sessionData.startTime:', sessionData.startTime);
        console.log('🔍 [startSession] sessionData.duration:', sessionData.duration);
        
        // Calculate start time from appointment date + time
        let startTime;
        if (sessionData.startTime) {
          startTime = new Date(sessionData.startTime);
        } else if (appointmentData.appointmentDate && appointmentData.appointmentTime) {
          // Combine date + time: "2025-11-05" + "09:30" → "2025-11-05T09:30:00"
          const dateTimeStr = `${appointmentData.appointmentDate}T${appointmentData.appointmentTime}:00`;
          startTime = new Date(dateTimeStr);
          console.log('✅ [startSession] Calculated startTime from appointment:', dateTimeStr);
        } else {
          startTime = new Date();
          console.warn('⚠️ [startSession] No startTime found, using current time');
        }
        
        const endTime = new Date(startTime.getTime() + durationMinutes * 60 * 1000);
        const now = new Date();
        const timeRemaining = Math.max(0, Math.floor((endTime - now) / 1000));
        
        console.log('⏱️ [startSession] Timer Calculation:', {
          appointmentDate: appointmentData.appointmentDate,
          appointmentTime: appointmentData.appointmentTime,
          startTimeParsed: startTime.toISOString(),
          durationMinutes,
          endTime: endTime.toISOString(),
          now: now.toISOString(),
          timeRemainingSeconds: timeRemaining,
          timeRemainingMinutes: Math.floor(timeRemaining / 60)
        });

        set({
          currentSession: {
            ...sessionData,
            appointmentId,
            // Store calculated endTime
            calculatedEndTime: endTime.toISOString(),
            durationMinutes,
          },
          patientInfo: {
            patientId: sessionData.patientId,
            patientFullName: sessionData.patientName,
            patientAge: sessionData.patientAge,
            patientProfileImageUrl: sessionData.patientProfileImageUrl,
            // New API: patientPhone (not patient.phoneNumber)
            phoneNumber: sessionData.patientPhone || appointmentData.patient?.phoneNumber,
          },
          timeRemaining,
          loading: false,
        });

        // Start timer
        get().startTimer();

        return { success: true, data: sessionData };
      },

      /**
       * Get active session for appointment
       * @param {string} appointmentId - Appointment ID
       * @param {Object} appointmentData - Appointment details (optional)
       */
      getActiveSession: async (appointmentId, appointmentData = {}) => {
        set({ loading: true, error: null });
        
        const result = await sessionService.getActiveSession(appointmentId);
        
        if (!result.success) {
          set({ error: result.error, loading: false });
          return { success: false, error: result.error };
        }

        // No session data found
        if (!result.data) {
          set({ loading: false });
          return { success: true, isActive: false, data: null };
        }

        const sessionData = result.data;
        
        // Check if session is completed
        const isCompleted = sessionData.status === 'Completed';
        
        // New API structure: duration (not sessionDurationMinutes)
        const durationMinutes = sessionData.duration || appointmentData?.duration || 30;
        
        // Calculate time remaining
        // Parse startTime correctly (handle timezone)
        let startTime;
        if (sessionData.startTime) {
          let timeStr = sessionData.startTime;
          
          // If no timezone indicator, add Z to treat as UTC
          if (!timeStr.endsWith('Z') && !timeStr.includes('+') && !timeStr.includes('-', 10)) {
            timeStr = timeStr + 'Z';
          }
          
          startTime = new Date(timeStr);
          
          // If invalid, try original string
          if (isNaN(startTime.getTime())) {
            startTime = new Date(sessionData.startTime);
          }
        } else {
          startTime = new Date();
        }
        
        const endTime = new Date(startTime.getTime() + durationMinutes * 60 * 1000);
        const now = new Date();
        const timeRemaining = Math.max(0, Math.floor((endTime - now) / 1000));
        
        console.log('⏱️ [getActiveSession] Timer Calculation:', {
          startTimeRaw: sessionData.startTime,
          startTimeParsed: startTime.toISOString(),
          startTimeLocal: startTime.toLocaleString('ar-EG'),
          durationMinutes,
          endTime: endTime.toISOString(),
          now: now.toISOString(),
          nowLocal: now.toLocaleString('ar-EG'),
          timeRemainingSeconds: timeRemaining,
          timeRemainingMinutes: Math.floor(timeRemaining / 60)
        });

        set({
          currentSession: {
            ...sessionData,
            appointmentId,
            // Store calculated endTime
            calculatedEndTime: endTime.toISOString(),
            durationMinutes,
          },
          patientInfo: {
            patientId: sessionData.patientId,
            patientFullName: sessionData.patientName,
            patientAge: sessionData.patientAge,
            patientProfileImageUrl: sessionData.patientProfileImageUrl,
            // New API: patientPhone (not patient.phoneNumber)
            phoneNumber: sessionData.patientPhone || appointmentData?.patient?.phoneNumber || null,
          },
          timeRemaining,
          loading: false,
        });

        // Start timer only if session is active
        if (!isCompleted) {
          get().startTimer();
        }

        return { 
          success: true, 
          isActive: result.isActive, 
          isCompleted: isCompleted,
          data: sessionData 
        };
      },

      /**
       * End current session
       */
      endSession: async () => {
        const { currentSession } = get();
        console.log('🔴 Store: Ending session...', currentSession);
        
        if (!currentSession) {
          console.warn('⚠️ Store: No active session');
          return { success: false, error: 'لا توجد جلسة نشطة' };
        }

        set({ loading: true, error: null });
        
        const result = await sessionService.endSession(currentSession.appointmentId);
        console.log('📥 Store: End session result:', result);
        
        if (!result.success) {
          console.error('❌ Store: Failed to end session:', result.error);
          set({ error: result.error, loading: false });
          return { success: false, error: result.error };
        }

        console.log('✅ Store: Session ended successfully, clearing data...');
        
        // Stop timer
        get().stopTimer();

        // Clear session data
        set({
          currentSession: null,
          sessionDetails: null,
          patientInfo: null,
          patientMedicalRecord: null,
          prescriptions: [],
          labTests: [],
          documentation: null,
          timeRemaining: null,
          loading: false,
        });

        return { success: true };
      },

      /**
       * Fetch session documentation
       */
      fetchSessionDocumentation: async () => {
        const { currentSession } = get();
        if (!currentSession) return { success: false, error: 'لا توجد جلسة نشطة' };

        const result = await sessionService.getSessionDocumentation(currentSession.appointmentId);
        
        if (result.success) {
          set({ documentation: result.data });
        }
        
        return result;
      },

      /**
       * Fetch patient medical record
       */
      fetchPatientMedicalRecord: async () => {
        const { patientInfo } = get();
        if (!patientInfo) return { success: false, error: 'لا توجد معلومات مريض' };

        console.log('🔍 [Store] Fetching medical record for patient:', patientInfo.patientId);
        const result = await sessionService.getPatientMedicalRecord(patientInfo.patientId);
        
        console.log('🔍 [Store] Medical record result:', result);
        console.log('🔍 [Store] result.success:', result.success);
        console.log('🔍 [Store] result.data:', result.data);
        
        if (result.success) {
          console.log('✅ [Store] Setting medical record:', result.data);
          set({ patientMedicalRecord: result.data });
        } else {
          console.error('❌ [Store] Failed to fetch medical record:', result.error);
        }
        
        return result;
      },

      /**
       * Create prescription
       * @param {Object} prescriptionData - Prescription data
       */
      createPrescription: async (prescriptionData) => {
        const { currentSession, prescriptions } = get();
        if (!currentSession) return { success: false, error: 'لا توجد جلسة نشطة' };

        set({ loading: true, error: null });
        
        console.log('🏪 Store - Creating prescription with data:', prescriptionData);
        
        // sessionService.createPrescription expects a single object with all data
        const result = await sessionService.createPrescription(prescriptionData);
        
        if (!result.success) {
          set({ error: result.error, loading: false });
          return result;
        }

        set({
          prescriptions: [...prescriptions, result.data],
          loading: false,
        });

        return result;
      },

      /**
       * Request lab test
       * @param {Object} labTestData - Lab test data
       */
      requestLabTest: async (labTestData) => {
        const { currentSession, labTests } = get();
        if (!currentSession) return { success: false, error: 'لا توجد جلسة نشطة' };

        set({ loading: true, error: null });
        
        const result = await sessionService.requestLabTest(
          currentSession.appointmentId,
          labTestData
        );
        
        if (!result.success) {
          set({ error: result.error, loading: false });
          return result;
        }

        set({
          labTests: [...labTests, result.data],
          loading: false,
        });

        return result;
      },

      /**
       * Save/Update session documentation (Upsert)
       * @param {Object} documentationData - Documentation data
       * @param {boolean} silent - If true, don't show loading state (for auto-save)
       */
      addDocumentation: async (documentationData, silent = false) => {
        const { currentSession, documentation } = get();
        if (!currentSession) return { success: false, error: 'لا توجد جلسة نشطة' };

        if (!silent) {
          set({ loading: true, error: null });
        }
        
        // Check if documentation exists (for update vs create)
        const isUpdate = documentation !== null;
        
        const result = await sessionService.addSessionDocumentation(
          currentSession.appointmentId,
          documentationData,
          isUpdate
        );
        
        if (!result.success) {
          if (!silent) {
            set({ error: result.error, loading: false });
          }
          return result;
        }

        set({
          documentation: result.data,
          loading: false,
        });

        return result;
      },

      /**
       * Fetch existing documentation
       */
      fetchDocumentation: async () => {
        const { currentSession } = get();
        if (!currentSession) return { success: false, error: 'لا توجد جلسة نشطة' };

        set({ loading: true, error: null });
        
        const result = await sessionService.getSessionDocumentation(
          currentSession.appointmentId
        );
        
        if (!result.success) {
          set({ error: result.error, loading: false });
          return result;
        }

        set({
          documentation: result.data,
          loading: false,
        });

        return result;
      },

      /**
       * Start countdown timer
       */
      startTimer: () => {
        const { timerInterval } = get();
        
        // Clear existing interval
        if (timerInterval) {
          clearInterval(timerInterval);
        }

        // Start new interval
        const interval = setInterval(() => {
          const { timeRemaining } = get();
          
          if (timeRemaining > 0) {
            set({ timeRemaining: timeRemaining - 1 });
          } else {
            // Time's up - auto end session
            get().stopTimer();
            console.log('⏰ Session Time Expired');
          }
        }, 1000);

        set({ timerInterval: interval });
      },

      /**
       * Stop countdown timer
       */
      stopTimer: () => {
        const { timerInterval } = get();
        if (timerInterval) {
          clearInterval(timerInterval);
          set({ timerInterval: null });
        }
      },

      /**
       * Clear error
       */
      clearError: () => set({ error: null }),

      /**
       * Reset session store
       */
      resetSession: () => {
        get().stopTimer();
        set({
          currentSession: null,
          sessionDetails: null,
          patientInfo: null,
          patientMedicalRecord: null,
          prescriptions: [],
          labTests: [],
          documentation: null,
          loading: false,
          error: null,
          timeRemaining: null,
          timerInterval: null,
        });
      },
    }),
    { name: 'SessionStore' }
  )
);
