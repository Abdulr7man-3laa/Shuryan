import { useEffect, useMemo } from 'react';
import { usePatientsStore } from '../stores/patientsStore';

/**
 * Custom hook for managing patients
 * @param {Object} options - Hook options
 * @param {boolean} options.autoFetch - Auto fetch on mount (default: true)
 * @param {number} options.pageNumber - Page number (default: 1)
 * @param {number} options.pageSize - Page size (default: 20)
 * @returns {Object} Patients data and actions
 */
export const usePatients = ({ 
  autoFetch = true, 
  pageNumber = 1, 
  pageSize = 20 
} = {}) => {
  // Store state
  const {
    patients,
    selectedPatient,
    loading,
    error,
    pagination,
    searchTerm,
    filterStatus,
    sortBy,
    fetchPatients,
    fetchPatientById,
    setSearchTerm,
    setFilterStatus,
    setSortBy,
    selectPatient,
    clearSelectedPatient,
    clearError,
    getFilteredPatients,
    reset,
  } = usePatientsStore();

  // Auto fetch on mount - only once
  useEffect(() => {
    if (autoFetch) {
      fetchPatients(pageNumber, pageSize);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only fetch on mount

  // Memoize filtered patients to prevent unnecessary recalculations
  const filteredPatients = useMemo(() => {
    return getFilteredPatients();
  }, [patients, searchTerm, filterStatus, sortBy, getFilteredPatients]);

  return {
    // State
    patients,
    filteredPatients,
    selectedPatient,
    loading,
    error,
    pagination,
    searchTerm,
    filterStatus,
    sortBy,

    // Actions
    fetchPatients,
    fetchPatientById,
    setSearchTerm,
    setFilterStatus,
    setSortBy,
    selectPatient,
    clearSelectedPatient,
    clearError,
    reset,

    // Computed
    hasPatients: patients.length > 0,
    hasFilteredPatients: filteredPatients.length > 0,
    totalPatients: pagination.totalCount,
  };
};
