import { useEffect } from 'react';
import usePharmacyStore from '../stores/pharmacyStore';

/**
 * Custom hook for pharmacy operations
 * @param {Object} options - Hook options
 * @param {boolean} options.autoFetch - Auto-fetch nearby pharmacies on mount
 * @returns {Object} Pharmacy state and actions
 */
const usePharmacy = ({ autoFetch = false } = {}) => {
  const {
    // State
    nearbyPharmacies,
    loading,
    error,
    
    // Actions
    fetchNearbyPharmacies,
    sendPrescriptionToPharmacy,
    clearPharmacies,
    clearError,
  } = usePharmacyStore();

  // Auto-fetch on mount if requested
  useEffect(() => {
    if (autoFetch) {
      console.log('🔄 [usePharmacy] Auto-fetching nearby pharmacies...');
      fetchNearbyPharmacies();
    }
  }, [autoFetch, fetchNearbyPharmacies]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Optional: Clear data on unmount
      // clearPharmacies();
    };
  }, []);

  // Computed properties
  const hasPharmacies = nearbyPharmacies && nearbyPharmacies.length > 0;
  const isEmpty = !loading && !hasPharmacies;

  return {
    // State
    nearbyPharmacies,
    loading,
    error,
    hasPharmacies,
    isEmpty,
    
    // Actions
    fetchNearbyPharmacies,
    sendPrescriptionToPharmacy,
    clearPharmacies,
    clearError,
  };
};

export default usePharmacy;
