import { useEffect, useCallback } from 'react';
import { useServicesStore } from '../stores/servicesStore';

/**
 * Custom hook for services management
 * 
 * Features:
 * - Auto-fetch services data on mount
 * - Memoized actions
 * - Loading and error states
 * - Success messages
 * 
 * @param {Object} options - Hook options
 * @param {boolean} options.autoFetch - Auto-fetch data on mount (default: true)
 * @returns {Object} Services state and actions
 */
export const useServices = ({ autoFetch = true } = {}) => {
  // Select state from store
  const {
    regularCheckup,
    reExamination,
    loading,
    error,
    success,
    fetchRegularCheckup,
    fetchReExamination,
    fetchAllServices,
    updateRegularCheckup,
    updateReExamination,
    clearErrors,
    clearSuccess,
  } = useServicesStore();

  // Fetch data on mount
  useEffect(() => {
    if (autoFetch) {
      fetchAllServices();
    }
  }, [autoFetch, fetchAllServices]);

  // Memoized actions
  const handleUpdateRegularCheckup = useCallback(
    async (data) => {
      try {
        await updateRegularCheckup(data);
        return { success: true };
      } catch (error) {
        return { success: false, error };
      }
    },
    [updateRegularCheckup]
  );

  const handleUpdateReExamination = useCallback(
    async (data) => {
      try {
        await updateReExamination(data);
        return { success: true };
      } catch (error) {
        return { success: false, error };
      }
    },
    [updateReExamination]
  );

  const handleRefreshAll = useCallback(async () => {
    try {
      await fetchAllServices();
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  }, [fetchAllServices]);

  return {
    // State
    regularCheckup,
    reExamination,
    loading,
    error,
    success,

    // Actions
    updateRegularCheckup: handleUpdateRegularCheckup,
    updateReExamination: handleUpdateReExamination,
    refreshAll: handleRefreshAll,
    clearErrors,
    clearSuccess,

    // Computed
    hasRegularCheckup: regularCheckup.price !== null,
    hasReExamination: reExamination.price !== null,
    isLoading: loading.regularCheckup || loading.reExamination,
    hasError: !!error.regularCheckup || !!error.reExamination,
  };
};
