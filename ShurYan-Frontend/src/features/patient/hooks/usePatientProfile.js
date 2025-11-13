import { useEffect } from 'react';
import { useProfileStore } from '../stores/profileStore';

/**
 * Custom hook for patient profile
 * 
 * @param {Object} options - Hook options
 * @param {boolean} options.autoFetch - Auto-fetch data on mount (default: true)
 * @param {boolean} options.fetchPersonalInfo - Fetch personal info (default: true)
 * @param {boolean} options.fetchAddress - Fetch address (default: true)
 * @param {boolean} options.fetchMedicalRecord - Fetch medical record (default: false)
 * 
 * @returns {Object} Profile state and actions
 */
export const usePatientProfile = ({
  autoFetch = true,
  fetchPersonalInfo = true,
  fetchAddress = true,
  fetchMedicalRecord = false,
} = {}) => {
  // Get store state and actions
  const {
    personalInfo,
    address,
    medicalRecord,
    loading,
    error,
    success,
    fetchPersonalInfo: fetchPersonalInfoAction,
    updatePersonalInfo,
    updateProfileImage,
    fetchAddress: fetchAddressAction,
    updateAddress,
    fetchMedicalRecord: fetchMedicalRecordAction,
    updateMedicalRecord,
    clearErrors,
    clearSuccess,
    resetStore,
  } = useProfileStore();

  // Auto-fetch data on mount
  useEffect(() => {
    if (autoFetch) {
      const fetchData = async () => {
        const promises = [];

        if (fetchPersonalInfo) {
          promises.push(fetchPersonalInfoAction());
        }

        if (fetchAddress) {
          promises.push(fetchAddressAction());
        }

        if (fetchMedicalRecord) {
          promises.push(fetchMedicalRecordAction());
        }

        // Execute all fetches in parallel
        if (promises.length > 0) {
          await Promise.allSettled(promises);
        }
      };

      fetchData();
    }
  }, [
    autoFetch,
    fetchPersonalInfo,
    fetchAddress,
    fetchMedicalRecord,
    fetchPersonalInfoAction,
    fetchAddressAction,
    fetchMedicalRecordAction,
  ]);

  return {
    // State
    personalInfo,
    address,
    medicalRecord,
    loading,
    error,
    success,

    // Actions
    fetchPersonalInfo: fetchPersonalInfoAction,
    updatePersonalInfo,
    updateProfileImage,
    fetchAddress: fetchAddressAction,
    updateAddress,
    fetchMedicalRecord: fetchMedicalRecordAction,
    updateMedicalRecord,
    clearErrors,
    clearSuccess,
    resetStore,
  };
};
