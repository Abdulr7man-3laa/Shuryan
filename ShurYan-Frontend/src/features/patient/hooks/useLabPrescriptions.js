import { useEffect } from 'react';
import useLabPrescriptionsStore from '../stores/labPrescriptionsStore';

/**
 * Custom hook for lab prescriptions
 * @param {Object} options - Hook options
 * @param {boolean} options.autoFetch - Auto-fetch on mount (default: true)
 * @returns {Object} Lab prescriptions state and actions
 */
const useLabPrescriptions = ({ autoFetch = true } = {}) => {
  const {
    labPrescriptions,
    selectedPrescription,
    loading,
    error,
    fetchLabPrescriptions,
    selectPrescription,
    clearSelection,
    reset,
  } = useLabPrescriptionsStore();

  useEffect(() => {
    if (autoFetch) {
      fetchLabPrescriptions();
    }

    // Cleanup on unmount
    return () => {
      // Don't reset on unmount to preserve data
    };
  }, [autoFetch, fetchLabPrescriptions]);

  return {
    labPrescriptions,
    selectedPrescription,
    loading,
    error,
    fetchLabPrescriptions,
    selectPrescription,
    clearSelection,
    reset,
  };
};

export default useLabPrescriptions;
