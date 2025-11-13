import { useEffect, useCallback } from 'react';
import { useAppointmentStore } from '../stores/appointmentStore';

/**
 * Custom hook for appointment management
 * 
 * Features:
 * - Auto-fetch appointment data on mount
 * - Memoized actions
 * - Loading and error states
 * - Success messages
 * 
 * @param {Object} options - Hook options
 * @param {boolean} options.autoFetch - Auto-fetch data on mount (default: true)
 * @returns {Object} Appointment state and actions
 */
export const useAppointment = ({ autoFetch = true } = {}) => {
  // Select state from store
  const {
    weeklySchedule,
    exceptionalDates,
    loading,
    error,
    success,
    fetchWeeklySchedule,
    fetchExceptionalDates,
    fetchAllAppointmentData,
    updateWeeklySchedule,
    addExceptionalDate,
    removeExceptionalDate,
    clearErrors,
    clearSuccess,
  } = useAppointmentStore();

  // Fetch data on mount
  useEffect(() => {
    if (autoFetch) {
      fetchAllAppointmentData();
    }
  }, [autoFetch, fetchAllAppointmentData]);

  // Memoized actions
  const handleUpdateSchedule = useCallback(
    async (scheduleData) => {
      try {
        await updateWeeklySchedule(scheduleData);
        return { success: true };
      } catch (error) {
        return { success: false, error };
      }
    },
    [updateWeeklySchedule]
  );

  const handleAddException = useCallback(
    async (exceptionData) => {
      try {
        await addExceptionalDate(exceptionData);
        return { success: true };
      } catch (error) {
        return { success: false, error };
      }
    },
    [addExceptionalDate]
  );

  const handleRemoveException = useCallback(
    async (exceptionId) => {
      try {
        await removeExceptionalDate(exceptionId);
        return { success: true };
      } catch (error) {
        return { success: false, error };
      }
    },
    [removeExceptionalDate]
  );

  const handleRefreshAll = useCallback(async () => {
    try {
      await fetchAllAppointmentData();
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  }, [fetchAllAppointmentData]);

  // Computed properties
  const enabledDays = Object.entries(weeklySchedule)
    .filter(([_, schedule]) => schedule.enabled)
    .map(([day, _]) => day);

  const hasSchedule = enabledDays.length > 0;
  const hasExceptions = exceptionalDates.length > 0;

  return {
    // State
    weeklySchedule,
    exceptionalDates,
    loading,
    error,
    success,

    // Actions
    updateSchedule: handleUpdateSchedule,
    addException: handleAddException,
    removeException: handleRemoveException,
    refreshAll: handleRefreshAll,
    clearErrors,
    clearSuccess,

    // Computed
    enabledDays,
    hasSchedule,
    hasExceptions,
    isLoading: loading.schedule || loading.exceptions,
    hasError: !!error.schedule || !!error.exceptions,
  };
};
