import { useEffect } from 'react';
import { usePartnerStore } from '../stores/partnerStore';

/**
 * Custom hook for partner management
 * 
 * Simplified hook that provides clean access to partner store
 * 
 * Features:
 * - Auto-fetch partner data on mount
 * - Direct access to store state and actions
 * - Computed helper properties
 * 
 * @param {Object} options - Hook options
 * @param {boolean} options.autoFetch - Auto-fetch data on mount (default: true)
 * @returns {Object} Partner state and actions
 */
export const usePartner = ({ autoFetch = true } = {}) => {
  const store = usePartnerStore();

  // Auto-fetch on mount
  useEffect(() => {
    if (autoFetch) {
      store.fetchAllPartnerData();
    }
  }, [autoFetch]); // Remove store from dependencies to prevent infinite re-renders

  return {
    // State
    suggestedPharmacy: store.suggestedPharmacy,
    suggestedLaboratory: store.suggestedLaboratory,
    availablePharmacies: store.availablePharmacies,
    availableLaboratories: store.availableLaboratories,
    loading: store.loading,
    error: store.error,
    success: store.success,

    // Actions
    suggestPartner: store.suggestPartner,
    removePartner: store.removePartner,
    removeSpecificPartner: store.removeSpecificPartner,
    clearErrors: store.clearErrors,
    clearSuccess: store.clearSuccess,
    refreshAll: store.fetchAllPartnerData,

    // Computed
    hasPartner: !!store.suggestedPharmacy || !!store.suggestedLaboratory,
    hasPharmacy: !!store.suggestedPharmacy,
    hasLaboratory: !!store.suggestedLaboratory,
    isLoading: Object.values(store.loading).some(Boolean),
    hasError: Object.values(store.error).some(Boolean),
  };
};
