import { useEffect } from 'react';
import { useSessionStore } from '../stores/sessionStore';

/**
 * Custom hook for session management
 * Encapsulates session store logic
 */
export const useSession = () => {
  const {
    // State
    currentSession,
    sessionDetails,
    patientInfo,
    patientMedicalRecord,
    prescriptions,
    labTests,
    documentation,
    loading,
    error,
    timeRemaining,

    // Actions
    startSession,
    getActiveSession,
    endSession,
    fetchSessionDetails,
    fetchPatientMedicalRecord,
    createPrescription,
    requestLabTest,
    addDocumentation,
    fetchDocumentation,
    clearError,
    resetSession,
  } = useSessionStore();

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Don't reset session on unmount - session persists across navigation
      // Only reset when explicitly ended
    };
  }, []);

  // Format time remaining for display
  const formatTimeRemaining = () => {
    if (timeRemaining === null) return '--:--';
    
    const hours = Math.floor(timeRemaining / 3600);
    const minutes = Math.floor((timeRemaining % 3600) / 60);
    const seconds = timeRemaining % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Check if session is active
  const isSessionActive = currentSession !== null;

  // Check if session is about to expire (less than 5 minutes)
  const isSessionExpiring = timeRemaining !== null && timeRemaining < 300;

  return {
    // State
    currentSession,
    sessionDetails,
    patientInfo,
    patientMedicalRecord,
    prescriptions,
    labTests,
    documentation,
    loading,
    error,
    timeRemaining,

    // Computed
    isSessionActive,
    isSessionExpiring,
    formattedTimeRemaining: formatTimeRemaining(),

    // Actions
    startSession,
    getActiveSession,
    endSession,
    fetchSessionDetails,
    fetchPatientMedicalRecord,
    createPrescription,
    requestLabTest,
    addDocumentation,
    fetchDocumentation,
    clearError,
    resetSession,
  };
};
