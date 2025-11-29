/**
 * useDoctors Hook
 * Encapsulates doctors store logic and provides auto-fetch on mount
 */

import { useEffect } from 'react';
import { useDoctorsStore } from '../stores/doctorsStore';

export const useDoctors = ({ autoFetch = true } = {}) => {
  const {
    // State
    doctors,
    filteredDoctors,
    selectedDoctor,
    loading,
    error,

    // Pagination
    pageNumber,
    pageSize,
    totalCount,
    totalPages,
    hasPreviousPage,
    hasNextPage,

    // Filters
    searchTerm,
    selectedSpecialties,
    selectedCities,
    minRating,
    priceRange,
    availableToday,

    // Actions
    fetchDoctors,
    fetchDoctorDetails,
    goToNextPage,
    goToPreviousPage,
    setSearchTerm,
    setSelectedSpecialties,
    setSelectedCities,
    setMinRating,
    setPriceRange,
    setAvailableToday,
    resetFilters,
    clearSelectedDoctor,
    clearError,
  } = useDoctorsStore();

  // Auto-fetch doctors on mount
  useEffect(() => {
    if (autoFetch) {
      console.log('🔄 useDoctors: Auto-fetching doctors on mount');
      fetchDoctors();
    }
  }, [autoFetch, fetchDoctors]);

  return {
    // State
    doctors,
    filteredDoctors,
    selectedDoctor,
    loading,
    error,

    // Pagination
    pageNumber,
    pageSize,
    totalCount,
    totalPages,
    hasPreviousPage,
    hasNextPage,

    // Filters
    searchTerm,
    selectedSpecialties,
    selectedCities,
    minRating,
    priceRange,
    availableToday,

    // Actions
    fetchDoctors,
    fetchDoctorDetails,
    goToNextPage,
    goToPreviousPage,
    setSearchTerm,
    setSelectedSpecialties,
    setSelectedCities,
    setMinRating,
    setPriceRange,
    setAvailableToday,
    resetFilters,
    clearSelectedDoctor,
    clearError,
  };
};
