import { useState } from 'react';
import { useSessionStore } from '../stores/sessionStore';
import { isAppointmentCompleted } from '@/utils/appointmentStatus';

/**
 * useSessionManager Hook
 * Unified hook for managing session start/resume flow
 * Eliminates code duplication across components
 */
export const useSessionManager = () => {
  const { startSession, getActiveSession } = useSessionStore();
  
  const [sessionLoading, setSessionLoading] = useState(null);
  const [sessionError, setSessionError] = useState(null);

  /**
   * Start or resume a consultation session
   * Handles the complete flow:
   * 1. Check for active session
   * 2. Resume if exists, start new if not
   * 3. Return success/error (caller handles navigation/modal)
   * 4. Handle all errors gracefully
   * 
   * @param {Object} appointment - Appointment object
   * @param {string} appointment.id - Appointment ID
   * @param {string} appointment.patientName - Patient name
   * @param {string} appointment.patientId - Patient ID
   * @param {string} appointment.phoneNumber - Patient phone
   * @param {number} appointment.duration - Session duration in minutes
   * @returns {Promise<Object>} Result object with success status
   */
  const startOrResumeSession = async (appointment) => {
    if (!appointment || !appointment.id) {
      setSessionError('معلومات الموعد غير صحيحة');
      return { success: false, error: 'معلومات الموعد غير صحيحة' };
    }

    setSessionLoading(appointment.id);
    setSessionError(null);

    try {
      // Check if session is completed
      const isCompleted = isAppointmentCompleted(appointment.apiStatus);
      
      if (isCompleted) {
        // For completed sessions: Just fetch the data (read-only)
        console.log('📖 Opening completed session for review:', appointment.id);
        const sessionResult = await getActiveSession(appointment.id);
        
        if (!sessionResult.success) {
          throw new Error(sessionResult.error);
        }
        
        console.log('✅ Completed session loaded:', sessionResult.message);
        return {
          success: true,
          data: sessionResult.data,
          message: sessionResult.message || 'تم تحميل بيانات الجلسة المكتملة',
          isCompleted: true
        };
      } else {
        // For pending/active sessions: Check if already started, then resume or start new
        console.log('🚀 Starting/resuming active session:', appointment.id);
        
        const appointmentData = {
          duration: appointment.duration || 30,
          appointmentTime: appointment.appointmentTime,
          appointmentDate: appointment.appointmentDate,
          patient: {
            patientId: appointment.patientId,
            patientFullName: appointment.patientName,
            phoneNumber: appointment.phoneNumber,
          },
        };

        // Check if session is already InProgress (متابعة الكشف)
        const isInProgress = appointment.apiStatus === 'InProgress' || appointment.apiStatus === 3;
        
        if (isInProgress) {
          // Session already started - just fetch it (resume)
          console.log('🔄 Resuming existing session:', appointment.id);
          const resumeResult = await getActiveSession(appointment.id, appointmentData);
          
          if (!resumeResult.success) {
            throw new Error(resumeResult.error);
          }
          
          console.log('✅ Session resumed:', resumeResult.message);
          return { 
            success: true, 
            data: resumeResult.data,
            message: 'تم استئناف الجلسة',
            isCompleted: false
          };
        } else {
          // Session not started yet - start new
          console.log('🆕 Starting new session:', appointment.id);
          const startResult = await startSession(appointment.id, appointmentData);

          if (!startResult.success) {
            throw new Error(startResult.error);
          }

          console.log('✅ Session started:', startResult.message);
          return { 
            success: true, 
            data: startResult.data,
            message: startResult.message,
            isCompleted: false
          };
        }
      }
    } catch (error) {
      console.error('❌ Session Error:', error);
      
      let errorMessage = error.message || 'فشل بدء الجلسة. يرجى المحاولة مرة أخرى.';
      
      // Special handling for active session conflict
      if (errorMessage.includes('جلسة نشطة أخرى') || errorMessage.includes('active session')) {
        errorMessage = 'لديك جلسة نشطة أخرى. يرجى إنهاءها أولاً من الصفحة الرئيسية.';
      }
      
      setSessionError(errorMessage);
      
      return { success: false, error: errorMessage };
    } finally {
      setSessionLoading(null);
    }
  };

  /**
   * Check if a specific appointment is loading
   */
  const isAppointmentLoading = (appointmentId) => {
    return sessionLoading === appointmentId;
  };

  /**
   * Clear session error
   */
  const clearSessionError = () => {
    setSessionError(null);
  };

  return {
    // Main action
    startOrResumeSession,
    
    // State
    sessionLoading,
    sessionError,
    
    // Helpers
    isAppointmentLoading,
    clearSessionError,
  };
};
