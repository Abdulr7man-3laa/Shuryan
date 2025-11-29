import { useEffect } from 'react';
import useLaboratoryProfileStore from '../stores/laboratoryProfileStore';

/**
 * Custom hook for laboratory profile management
 * Encapsulates store logic and provides auto-fetch functionality
 * 
 * @param {Object} options - Configuration options
 * @param {boolean} options.autoFetch - Auto-fetch data on mount (default: true)
 * @param {boolean} options.fetchBasicInfo - Fetch basic info (default: true)
 * @param {boolean} options.fetchAddress - Fetch address (default: true)
 * @param {boolean} options.fetchWorkingHours - Fetch working hours (default: false)
 * @param {boolean} options.fetchSampleCollection - Fetch sample collection settings (default: false)
 * 
 * @returns {Object} Store state and actions
 */
const useLaboratoryProfile = ({
  autoFetch = true,
  fetchBasicInfo = true,
  fetchAddress = true,
  fetchWorkingHours = false,
  fetchSampleCollection = false,
} = {}) => {
  // Get all store state and actions
  const store = useLaboratoryProfileStore();

  // Auto-fetch data on mount
  useEffect(() => {
    if (!autoFetch) return;

    const fetchData = async () => {
      const promises = [];

      if (fetchBasicInfo) {
        promises.push(store.fetchBasicInfo());
      }

      if (fetchAddress) {
        promises.push(store.fetchAddress());
      }

      if (fetchWorkingHours) {
        promises.push(store.fetchWorkingHours());
      }

      if (fetchSampleCollection) {
        promises.push(store.fetchSampleCollectionSettings());
      }

      // Fetch all in parallel
      if (promises.length > 0) {
        await Promise.allSettled(promises);
      }
    };

    fetchData();
  }, [autoFetch, fetchBasicInfo, fetchAddress, fetchWorkingHours, fetchSampleCollection]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Optional: Clear errors on unmount
      // store.clearErrors();
    };
  }, []);

  return {
    // State
    basicInfo: store.basicInfo,
    address: store.address,
    workingHours: store.workingHours,
    sampleCollectionSettings: store.sampleCollectionSettings,
    loading: store.loading,
    error: store.error,
    success: store.success,

    // Actions - Basic Info
    fetchBasicInfo: store.fetchBasicInfo,
    updateBasicInfo: store.updateBasicInfo,
    updateProfileImage: store.updateProfileImage,

    // Actions - Address
    fetchAddress: store.fetchAddress,
    updateAddress: store.updateAddress,

    // Actions - Working Hours
    fetchWorkingHours: store.fetchWorkingHours,
    updateWorkingHours: store.updateWorkingHours,

    // Actions - Sample Collection
    fetchSampleCollectionSettings: store.fetchSampleCollectionSettings,
    updateSampleCollectionSettings: store.updateSampleCollectionSettings,

    // Utility Actions
    clearErrors: store.clearErrors,
    reset: store.reset,
  };
};

export default useLaboratoryProfile;
