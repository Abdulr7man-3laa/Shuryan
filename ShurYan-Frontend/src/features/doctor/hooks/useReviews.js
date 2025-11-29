import { useEffect } from 'react';
import useReviewsStore from '../stores/reviewsStore';

/**
 * Custom hook for reviews management
 * @param {Object} options - Hook options
 * @param {boolean} options.autoFetch - Auto-fetch reviews on mount
 * @param {boolean} options.fetchStatistics - Auto-fetch statistics on mount
 * @returns {Object} Reviews state and actions
 */
const useReviews = ({ 
  autoFetch = true, 
  fetchStatistics = true 
} = {}) => {
  const store = useReviewsStore();

  // Auto-fetch on mount
  useEffect(() => {
    if (autoFetch) {
      store.fetchReviews();
    }
    
    if (fetchStatistics) {
      store.fetchStatistics();
    }

    // Cleanup on unmount
    return () => {
      // Don't reset store on unmount to preserve data
      // store.reset();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoFetch, fetchStatistics]);

  // Computed values
  const hasReviews = store.reviews.length > 0;
  const hasMorePages = store.pagination.hasNextPage;
  const hasPreviousPages = store.pagination.hasPreviousPage;
  const isLoading = store.loading.reviews || store.loading.statistics;
  const isLoadingReviews = store.loading.reviews;
  const isLoadingStatistics = store.loading.statistics;
  const isLoadingReply = store.loading.reply;
  
  // Filter helpers
  const activeFiltersCount = Object.values(store.filters).filter(value => 
    value !== null && value !== false && value !== 'date' && value !== 'desc'
  ).length;

  const hasActiveFilters = activeFiltersCount > 0;

  // Statistics helpers
  const averageRating = store.statistics?.averageRating || 0;
  const totalReviews = store.statistics?.totalReviews || store.pagination.totalCount || 0;
  const verifiedReviews = store.statistics?.verifiedReviews || 0;
  const ratingDistribution = store.statistics?.ratingDistribution || {};

  return {
    // State
    reviews: store.reviews,
    statistics: store.statistics,
    selectedReview: store.selectedReview,
    pagination: store.pagination,
    filters: store.filters,
    loading: store.loading,
    error: store.error,

    // Computed
    hasReviews,
    hasMorePages,
    hasPreviousPages,
    isLoading,
    isLoadingReviews,
    isLoadingStatistics,
    isLoadingReply,
    activeFiltersCount,
    hasActiveFilters,
    averageRating,
    totalReviews,
    verifiedReviews,
    ratingDistribution,

    // Actions
    fetchReviews: store.fetchReviews,
    fetchStatistics: store.fetchStatistics,
    setMinRatingFilter: store.setMinRatingFilter,
    resetFilters: store.resetFilters,
    goToNextPage: store.goToNextPage,
    goToPreviousPage: store.goToPreviousPage,
    fetchReviewDetails: store.fetchReviewDetails,
    setSelectedReview: store.setSelectedReview,
    clearError: store.clearError,
    reset: store.reset
  };
};

export default useReviews;
