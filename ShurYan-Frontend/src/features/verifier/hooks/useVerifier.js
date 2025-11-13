import { useEffect } from 'react';
import useVerifierStore from '../stores/verifierStore';

/**
 * Custom Hook for Verifier Feature
 * 
 * Encapsulates store logic and provides clean API
 * 
 * @param {Object} options - Hook options
 * @param {boolean} options.autoFetch - Auto-fetch data on mount (default: true)
 * @param {boolean} options.fetchApplications - Fetch applications (default: true)
 * @param {boolean} options.fetchStats - Fetch stats (default: true)
 */
const useVerifier = ({
  autoFetch = true,
  fetchApplications = true,
  fetchStats = true,
} = {}) => {
  // Store state - using individual selectors for better reactivity
  const applications = useVerifierStore((state) => state.applications);
  const selectedApplication = useVerifierStore((state) => state.selectedApplication);
  const stats = useVerifierStore((state) => state.stats);
  const loading = useVerifierStore((state) => state.loading);
  const error = useVerifierStore((state) => state.error);
  const filters = useVerifierStore((state) => state.filters);

  // Store actions
  const fetchApplicationsAction = useVerifierStore((state) => state.fetchApplications);
  const fetchStatsAction = useVerifierStore((state) => state.fetchStats);
  const setActiveTab = useVerifierStore((state) => state.setActiveTab);
  const setActiveStatus = useVerifierStore((state) => state.setActiveStatus);
  const selectApplication = useVerifierStore((state) => state.selectApplication);
  const clearSelectedApplication = useVerifierStore((state) => state.clearSelectedApplication);
  const fetchDoctorDocuments = useVerifierStore((state) => state.fetchDoctorDocuments);
  const approveApplication = useVerifierStore((state) => state.approveApplication);
  const rejectApplication = useVerifierStore((state) => state.rejectApplication);
  const startReview = useVerifierStore((state) => state.startReview);
  const requestClarification = useVerifierStore((state) => state.requestClarification);
  const updateDocumentStatus = useVerifierStore((state) => state.updateDocumentStatus);
  const approveDocument = useVerifierStore((state) => state.approveDocument);
  const rejectDocument = useVerifierStore((state) => state.rejectDocument);
  const getDocumentStatus = useVerifierStore((state) => state.getDocumentStatus);
  const clearErrors = useVerifierStore((state) => state.clearErrors);
  const reset = useVerifierStore((state) => state.reset);
  
  // Compute filtered applications directly in the hook for reactivity
  const getFilteredApplications = () => {
    const tabKeyMap = {
      doctor: 'doctors',
      pharmacy: 'pharmacies',
      laboratory: 'laboratories',
    };
    
    const tabKey = tabKeyMap[filters.activeTab];
    const appList = applications[tabKey] || [];
    
    return appList.filter(app => app.verificationStatus === filters.activeStatus);
  };

  // Auto-fetch on mount
  useEffect(() => {
    if (autoFetch) {
      const promises = [];
      
      if (fetchApplications) {
        promises.push(fetchApplicationsAction());
      }
      
      if (fetchStats) {
        promises.push(fetchStatsAction());
      }

      Promise.allSettled(promises);
    }
  }, [autoFetch, fetchApplications, fetchStats, fetchApplicationsAction, fetchStatsAction]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearErrors();
    };
  }, [clearErrors]);

  // Computed values - recalculate when applications or filters change
  const filteredApplications = getFilteredApplications();
  console.log('🎯 [useVerifier] Filtered applications:', filteredApplications.length, filteredApplications);
  
  const isLoading = loading.applications || loading.stats;
  const hasError = error.applications || error.stats;

  return {
    // State
    applications,
    selectedApplication,
    stats,
    loading,
    error,
    filters,
    filteredApplications,
    
    // Computed
    isLoading,
    hasError,
    
    // Actions
    fetchApplications: fetchApplicationsAction,
    fetchStats: fetchStatsAction,
    setActiveTab,
    setActiveStatus,
    selectApplication,
    clearSelectedApplication,
    fetchDoctorDocuments,
    approveApplication,
    rejectApplication,
    startReview,
    requestClarification,
    updateDocumentStatus,
    approveDocument,
    rejectDocument,
    getDocumentStatus,
    clearErrors,
    reset,
  };
};

export default useVerifier;
