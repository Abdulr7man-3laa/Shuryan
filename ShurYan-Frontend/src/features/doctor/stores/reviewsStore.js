import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
// import reviewsService from '../../../api/services/reviews.service'; // TODO: Uncomment when API is ready

// 🗑️ TEMPORARY: Remove when connecting to real API
import { 
  mockReviews, 
  mockStatistics, 
  createMockPaginationResponse,
  filterReviewsByRating,
  sortReviews
} from '../data/mockReviews';

/**
 * Reviews Store - Zustand
 * Manages doctor reviews state and actions
 */
const useReviewsStore = create(
  devtools(
    (set, get) => ({
      // State
      reviews: [],
      statistics: null,
      selectedReview: null,
      
      // Pagination
      pagination: {
        pageNumber: 1,
        pageSize: 20,
        totalCount: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false
      },
      
      // Filters
      filters: {
        minRating: null,
        verifiedOnly: false,
        sortBy: 'date',
        sortOrder: 'desc'
      },
      
      // Loading states
      loading: {
        reviews: false,
        statistics: false,
        reply: false
      },
      
      // Error states
      error: {
        reviews: null,
        statistics: null,
        reply: null
      },

      // Actions
      
      /**
       * Fetch reviews with current filters and pagination
       * 🗑️ TEMPORARY: Using mock data - Replace with real API when ready
       */
      fetchReviews: async () => {
        const { filters, pagination } = get();
        
        set((state) => ({
          loading: { ...state.loading, reviews: true },
          error: { ...state.error, reviews: null }
        }));

        try {
          // 🗑️ MOCK DATA SIMULATION - Remove when API is ready
          await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
          
          // Apply filters
          let filteredReviews = [...mockReviews];
          if (filters.minRating) {
            filteredReviews = filterReviewsByRating(filteredReviews, filters.minRating);
          }
          
          // Apply sorting
          filteredReviews = sortReviews(filteredReviews, filters.sortBy, filters.sortOrder);
          
          // Apply pagination
          const response = createMockPaginationResponse(
            filteredReviews, 
            pagination.pageNumber, 
            pagination.pageSize
          );
          
          set({
            reviews: response.reviews || [],
            pagination: {
              pageNumber: response.pageNumber || 1,
              pageSize: response.pageSize || 20,
              totalCount: response.totalCount || 0,
              totalPages: response.totalPages || 0,
              hasNextPage: response.hasNextPage || false,
              hasPreviousPage: response.hasPreviousPage || false
            },
            loading: { ...get().loading, reviews: false }
          });

          /* TODO: Replace with real API call when ready
          const params = {
            pageNumber: pagination.pageNumber,
            pageSize: pagination.pageSize,
            ...filters
          };

          const response = await reviewsService.getDoctorReviews(params);
          
          if (response) {
            set({
              reviews: response.reviews || [],
              pagination: {
                pageNumber: response.pageNumber || 1,
                pageSize: response.pageSize || 20,
                totalCount: response.totalCount || 0,
                totalPages: response.totalPages || 0,
                hasNextPage: response.hasNextPage || false,
                hasPreviousPage: response.hasPreviousPage || false
              },
              loading: { ...get().loading, reviews: false }
            });
          }
          */
        } catch (error) {
          set((state) => ({
            loading: { ...state.loading, reviews: false },
            error: { ...state.error, reviews: error.message || 'فشل في جلب التقييمات' }
          }));
        }
      },

      /**
       * Fetch review statistics
       * 🗑️ TEMPORARY: Using mock data - Replace with real API when ready
       */
      fetchStatistics: async () => {
        set((state) => ({
          loading: { ...state.loading, statistics: true },
          error: { ...state.error, statistics: null }
        }));

        try {
          // 🗑️ MOCK DATA SIMULATION - Remove when API is ready
          await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API delay
          
          set({
            statistics: mockStatistics,
            loading: { ...get().loading, statistics: false }
          });

          /* TODO: Replace with real API call when ready
          const statistics = await reviewsService.getReviewStatistics();
          
          set({
            statistics,
            loading: { ...get().loading, statistics: false }
          });
          */
        } catch (error) {
          set((state) => ({
            loading: { ...state.loading, statistics: false },
            error: { ...state.error, statistics: error.message || 'فشل في جلب الإحصائيات' }
          }));
        }
      },

      /**
       * Set filter and refresh reviews
       */
      setFilter: (filterKey, value) => {
        set((state) => ({
          filters: { ...state.filters, [filterKey]: value },
          pagination: { ...state.pagination, pageNumber: 1 } // Reset to first page
        }));
        
        // Auto-fetch with new filters
        get().fetchReviews();
      },

      /**
       * Reset all filters
       */
      resetFilters: () => {
        set({
          filters: {
            minRating: null,
            verifiedOnly: false,
            sortBy: 'date',
            sortOrder: 'desc'
          },
          pagination: { ...get().pagination, pageNumber: 1 }
        });
        
        get().fetchReviews();
      },

      /**
       * Go to next page
       */
      goToNextPage: () => {
        const { pagination } = get();
        if (pagination.hasNextPage) {
          set((state) => ({
            pagination: { ...state.pagination, pageNumber: pagination.pageNumber + 1 }
          }));
          get().fetchReviews();
        }
      },

      /**
       * Go to previous page
       */
      goToPreviousPage: () => {
        const { pagination } = get();
        if (pagination.hasPreviousPage) {
          set((state) => ({
            pagination: { ...state.pagination, pageNumber: pagination.pageNumber - 1 }
          }));
          get().fetchReviews();
        }
      },

      /**
       * Reply to a review
       * 🗑️ TEMPORARY: Using mock simulation - Replace with real API when ready
       */
      replyToReview: async (reviewId, reply) => {
        set((state) => ({
          loading: { ...state.loading, reply: true },
          error: { ...state.error, reply: null }
        }));

        try {
          // 🗑️ MOCK DATA SIMULATION - Remove when API is ready
          await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API delay
          
          // Update the review in the list
          set((state) => ({
            reviews: state.reviews.map(review => 
              review.id === reviewId 
                ? { 
                    ...review, 
                    doctorReply: reply, 
                    doctorRepliedAt: new Date().toISOString() 
                  }
                : review
            ),
            loading: { ...state.loading, reply: false }
          }));
          
          console.log('✅ Mock reply sent successfully:', { reviewId, reply });
          return { success: true };

          /* TODO: Replace with real API call when ready
          await reviewsService.replyToReview(reviewId, reply);
          
          // Update the review in the list
          set((state) => ({
            reviews: state.reviews.map(review => 
              review.id === reviewId 
                ? { 
                    ...review, 
                    doctorReply: reply, 
                    doctorRepliedAt: new Date().toISOString() 
                  }
                : review
            ),
            loading: { ...state.loading, reply: false }
          }));
          
          return { success: true };
          */
        } catch (error) {
          set((state) => ({
            loading: { ...state.loading, reply: false },
            error: { ...state.error, reply: error.message || 'فشل في إرسال الرد' }
          }));
          
          return { success: false, error: error.message };
        }
      },

      /**
       * Set selected review for details modal
       */
      setSelectedReview: (review) => {
        set({ selectedReview: review });
      },

      /**
       * Clear errors
       */
      clearError: (errorType) => {
        set((state) => ({
          error: { ...state.error, [errorType]: null }
        }));
      },

      /**
       * Reset store
       */
      reset: () => {
        set({
          reviews: [],
          statistics: null,
          selectedReview: null,
          pagination: {
            pageNumber: 1,
            pageSize: 20,
            totalCount: 0,
            totalPages: 0,
            hasNextPage: false,
            hasPreviousPage: false
          },
          filters: {
            minRating: null,
            verifiedOnly: false,
            sortBy: 'date',
            sortOrder: 'desc'
          },
          loading: {
            reviews: false,
            statistics: false,
            reply: false
          },
          error: {
            reviews: null,
            statistics: null,
            reply: null
          }
        });
      }
    }),
    {
      name: 'reviews-store',
      partialize: (state) => ({
        filters: state.filters,
        pagination: { ...state.pagination, pageNumber: 1 } // Don't persist page number
      })
    }
  )
);

export default useReviewsStore;
