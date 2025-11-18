import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import doctorService from '@/api/services/doctor.service';

/**
 * Partner Store - Clean state management for partner suggestions
 * 
 * Business Rules:
 * - Doctor can suggest ONE pharmacy AND/OR ONE laboratory
 * - Optimistic updates with automatic rollback on error
 * - Auto-clear success messages after 3 seconds
 * - Parallel fetching for better performance
 * 
 * @store
 */
export const usePartnerStore = create(
  devtools(
    persist(
      (set, get) => ({
        // ==================== State ====================
        
        suggestedPharmacy: null,
        suggestedLaboratory: null,
        availablePharmacies: [],
        availableLaboratories: [],
        
        loading: {
          partner: false,
          pharmacies: false,
          laboratories: false,
          suggesting: false,
          removing: false,
        },
        
        error: {
          partner: null,
          pharmacies: null,
          laboratories: null,
        },
        
        success: {
          partner: null,
        },

        // ==================== Actions ====================
        
        /**
         * Fetch current suggested partner(s)
         * New API returns both pharmacy and laboratory in one response
         */
        fetchSuggestedPartner: async () => {
          set((state) => ({
            loading: { ...state.loading, partner: true },
            error: { ...state.error, partner: null },
          }));

          try {
            const response = await doctorService.getSuggestedPartner();
            const data = response.data || response;
            
            set({
              suggestedPharmacy: data.pharmacy || null,
              suggestedLaboratory: data.laboratory || null,
              loading: { ...get().loading, partner: false },
            });
          } catch (error) {
            set((state) => ({
              loading: { ...state.loading, partner: false },
              error: { 
                ...state.error, 
                partner: error.response?.data?.message || 'فشل تحميل الشريك المقترح' 
              },
            }));
          }
        },

        /**
         * Fetch available pharmacies with pagination
         * @param {number} pageNumber - Page number (default: 1)
         * @param {number} pageSize - Page size (default: 1000)
         */
        fetchAvailablePharmacies: async (pageNumber = 1, pageSize = 1000) => {
          set((state) => ({
            loading: { ...state.loading, pharmacies: true },
            error: { ...state.error, pharmacies: null },
          }));

          try {
            const response = await doctorService.getAvailablePharmacies(pageNumber, pageSize);
            
            // Handle pagination response structure
            let pharmacies = [];
            
            if (Array.isArray(response.data)) {
              // Direct array
              pharmacies = response.data;
            } else if (response.data && typeof response.data === 'object') {
              // Pagination object - check for items in different keys
              pharmacies = response.data.items || 
                          response.data.data || 
                          response.data.pharmacies || 
                          [];
            }
            

            set({
              availablePharmacies: pharmacies,
              loading: { ...get().loading, pharmacies: false },
            });
          } catch (error) {
            set((state) => ({
              loading: { ...state.loading, pharmacies: false },
              error: { 
                ...state.error, 
                pharmacies: error.response?.data?.message || 'فشل تحميل الصيدليات المتاحة' 
              },
            }));
          }
        },

        /**
         * Fetch available laboratories with pagination
         * @param {number} pageNumber - Page number (default: 1)
         * @param {number} pageSize - Page size (default: 1000)
         */
        fetchAvailableLaboratories: async (pageNumber = 1, pageSize = 1000) => {
          set((state) => ({
            loading: { ...state.loading, laboratories: true },
            error: { ...state.error, laboratories: null },
          }));

          try {
            const response = await doctorService.getAvailableLaboratories(pageNumber, pageSize);
            
            // Handle pagination response structure
            let laboratories = [];
            
            if (Array.isArray(response.data)) {
              // Direct array
              laboratories = response.data;
            } else if (response.data && typeof response.data === 'object') {
              // Pagination object - check for items in different keys
              laboratories = response.data.items || 
                            response.data.data || 
                            response.data.laboratories || 
                            [];
            }
            

            set({
              availableLaboratories: laboratories,
              loading: { ...get().loading, laboratories: false },
            });
          } catch (error) {
            set((state) => ({
              loading: { ...state.loading, laboratories: false },
              error: { 
                ...state.error, 
                laboratories: error.response?.data?.message || 'فشل تحميل المعامل المتاحة' 
              },
            }));
          }
        },

        /**
         * Suggest partners (pharmacy and/or laboratory)
         * New API accepts both pharmacyId and laboratoryId in one request
         * 
         * @param {Object} partnerData - Partner data
         * @param {string} [partnerData.pharmacyId] - Pharmacy ID (optional)
         * @param {string} [partnerData.laboratoryId] - Laboratory ID (optional)
         * @param {Object} [options] - Additional options
         * @param {boolean} [options.isRemoving] - Whether this is a removal operation
         * @param {string} [options.removedType] - Type of partner being removed
         */
        suggestPartner: async (partnerData, options = {}) => {
          // Save previous state for rollback
          const previousPharmacy = get().suggestedPharmacy;
          const previousLaboratory = get().suggestedLaboratory;

          set((state) => ({
            loading: { ...state.loading, suggesting: true },
            error: { ...state.error, partner: null },
            success: { ...state.success, partner: null },
          }));

          try {
            await doctorService.suggestPartner(partnerData);
            
            // Refresh to get updated data from server
            await get().fetchSuggestedPartner();

            // Set appropriate success message based on operation type
            let successMessage = 'تم حفظ الشركاء المقترحين بنجاح';
            if (options.isRemoving) {
              const removedTypeArabic = options.removedType === 'pharmacy' ? 'الصيدلية' : 'المعمل';
              successMessage = `تم إزالة ${removedTypeArabic} المقترحة بنجاح`;
            }

            set((state) => ({
              loading: { ...state.loading, suggesting: false },
              success: { 
                ...state.success, 
                partner: successMessage
              },
            }));

            // Auto-clear success message
            setTimeout(() => {
              set((state) => ({ success: { ...state.success, partner: null } }));
            }, 3000);

            return { success: true };
          } catch (error) {
            // Rollback on error
            set({
              suggestedPharmacy: previousPharmacy,
              suggestedLaboratory: previousLaboratory,
              loading: { ...get().loading, suggesting: false },
              error: { 
                ...get().error, 
                partner: error.response?.data?.message || 'فشل اقتراح الشريك' 
              },
            });
            
            throw error;
          }
        },

        /**
         * Remove specific partner type
         * @param {string} partnerType - 'pharmacy' or 'laboratory'
         */
        removeSpecificPartner: async (partnerType) => {
          // Save previous state for rollback
          const previousPharmacy = get().suggestedPharmacy;
          const previousLaboratory = get().suggestedLaboratory;

          // Optimistic update - remove specific partner
          set((state) => ({
            ...(partnerType === 'pharmacy' && { suggestedPharmacy: null }),
            ...(partnerType === 'laboratory' && { suggestedLaboratory: null }),
            loading: { ...state.loading, removing: true },
            error: { ...state.error, partner: null },
          }));

          try {
            await doctorService.removeSpecificPartner(partnerType);

            const partnerTypeArabic = partnerType === 'pharmacy' ? 'الصيدلية' : 'المعمل';
            
            set((state) => ({
              loading: { ...state.loading, removing: false },
              success: { 
                ...state.success, 
                partner: `تم إزالة ${partnerTypeArabic} المقترحة بنجاح` 
              },
            }));

            // Auto-clear success message
            setTimeout(() => {
              set((state) => ({ success: { ...state.success, partner: null } }));
            }, 3000);

            return { success: true };
          } catch (error) {
            // Rollback on error
            set({
              suggestedPharmacy: previousPharmacy,
              suggestedLaboratory: previousLaboratory,
              loading: { ...get().loading, removing: false },
              error: { 
                ...get().error, 
                partner: error.response?.data?.message || `فشل إزالة ${partnerType === 'pharmacy' ? 'الصيدلية' : 'المعمل'} المقترحة` 
              },
            });
            
            throw error;
          }
        },

        /**
         * Remove suggested partner(s)
         * Removes both pharmacy and laboratory
         */
        removePartner: async () => {
          // Save previous state for rollback
          const previousPharmacy = get().suggestedPharmacy;
          const previousLaboratory = get().suggestedLaboratory;

          // Optimistic update - remove both
          set((state) => ({
            suggestedPharmacy: null,
            suggestedLaboratory: null,
            loading: { ...state.loading, removing: true },
            error: { ...state.error, partner: null },
          }));

          try {
            await doctorService.removeSuggestedPartner();

            set((state) => ({
              loading: { ...state.loading, removing: false },
              success: { 
                ...state.success, 
                partner: 'تم إزالة الشركاء المقترحين بنجاح' 
              },
            }));

            // Auto-clear success message
            setTimeout(() => {
              set((state) => ({ success: { ...state.success, partner: null } }));
            }, 3000);

            return { success: true };
          } catch (error) {
            // Rollback on error
            set({
              suggestedPharmacy: previousPharmacy,
              suggestedLaboratory: previousLaboratory,
              loading: { ...get().loading, removing: false },
              error: { 
                ...get().error, 
                partner: error.response?.data?.message || 'فشل إزالة الشركاء المقترحين' 
              },
            });
            
            throw error;
          }
        },

        /**
         * Fetch all partner data in parallel
         * Uses Promise.allSettled to continue even if some requests fail
         */
        fetchAllPartnerData: async () => {
          const results = await Promise.allSettled([
            get().fetchSuggestedPartner(),
            get().fetchAvailablePharmacies(),
            get().fetchAvailableLaboratories(),
          ]);

          // Log any errors (but don't throw)
          const errors = results
            .filter(r => r.status === 'rejected')
            .map(r => r.reason?.message || 'خطأ غير معروف');

          if (errors.length > 0) {
            console.error('Partner data fetch errors:', errors);
          }

          return results;
        },

        /**
         * Clear all errors
         */
        clearErrors: () => {
          set({
            error: {
              partner: null,
              pharmacies: null,
              laboratories: null,
            },
          });
        },

        /**
         * Clear all success messages
         */
        clearSuccess: () => {
          set({
            success: {
              partner: null,
            },
          });
        },

        /**
         * Reset entire store to initial state
         */
        resetPartnerStore: () => {
          set({
            suggestedPharmacy: null,
            suggestedLaboratory: null,
            availablePharmacies: [],
            availableLaboratories: [],
            loading: {
              partner: false,
              pharmacies: false,
              laboratories: false,
              suggesting: false,
              removing: false,
            },
            error: {
              partner: null,
              pharmacies: null,
              laboratories: null,
            },
            success: {
              partner: null,
            },
          });
        },
      }),
      {
        name: 'partner-storage',
        partialize: (state) => ({
          suggestedPharmacy: state.suggestedPharmacy,
          suggestedLaboratory: state.suggestedLaboratory,
        }),
      }
    ),
    { name: 'PartnerStore' }
  )
);
