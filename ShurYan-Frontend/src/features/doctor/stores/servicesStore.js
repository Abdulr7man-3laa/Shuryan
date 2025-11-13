import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import doctorService from '@/api/services/doctor.service';

/**
 * Services Store - Manages doctor services and pricing
 * 
 * Features:
 * - Regular checkup service (الكشف العادي)
 * - Re-examination service (إعادة الكشف)
 * - Parallel data fetching
 * - Optimistic updates with rollback
 */
export const useServicesStore = create(
  devtools(
    persist(
      (set, get) => ({
        // ==================== State ====================
        
        // Regular Checkup Service
        regularCheckup: {
          price: null,
          duration: null, // in minutes
        },
        
        // Re-examination Service
        reExamination: {
          price: null,
          duration: null, // in minutes
        },
        
        // Loading States
        loading: {
          regularCheckup: false,
          reExamination: false,
        },
        
        // Error States
        error: {
          regularCheckup: null,
          reExamination: null,
        },
        
        // Success Messages
        success: {
          regularCheckup: null,
          reExamination: null,
        },

        // ==================== Actions ====================
        
        /**
         * Fetch regular checkup service
         */
        fetchRegularCheckup: async () => {
          set((state) => ({
            loading: { ...state.loading, regularCheckup: true },
            error: { ...state.error, regularCheckup: null },
          }));

          try {
            const response = await doctorService.getRegularCheckup();
            const data = response.data || response;

            set({
              regularCheckup: {
                price: data.price || null,
                duration: data.duration || null,
              },
              loading: { ...get().loading, regularCheckup: false },
            });
          } catch (error) {
            set((state) => ({
              loading: { ...state.loading, regularCheckup: false },
              error: { 
                ...state.error, 
                regularCheckup: error.response?.data?.message || 'فشل تحميل بيانات الكشف العادي' 
              },
            }));
            throw error;
          }
        },

        /**
         * Update regular checkup service
         * @param {Object} data - Service data
         */
        updateRegularCheckup: async (data) => {
          const previousData = get().regularCheckup;

          // Optimistic update
          set((state) => ({
            regularCheckup: { ...state.regularCheckup, ...data },
            loading: { ...state.loading, regularCheckup: true },
            error: { ...state.error, regularCheckup: null },
            success: { ...state.success, regularCheckup: null },
          }));

          try {
            await doctorService.updateRegularCheckup(data);

            set((state) => ({
              loading: { ...state.loading, regularCheckup: false },
              success: { ...state.success, regularCheckup: 'تم حفظ بيانات الكشف العادي بنجاح' },
            }));

            // Auto-clear success message
            setTimeout(() => {
              set((state) => ({
                success: { ...state.success, regularCheckup: null },
              }));
            }, 3000);

            return { success: true };
          } catch (error) {
            // Rollback
            set((state) => ({
              regularCheckup: previousData,
              loading: { ...state.loading, regularCheckup: false },
              error: { 
                ...state.error, 
                regularCheckup: error.response?.data?.message || 'فشل حفظ بيانات الكشف العادي' 
              },
            }));
            return { success: false, error };
          }
        },

        /**
         * Fetch re-examination service
         */
        fetchReExamination: async () => {
          set((state) => ({
            loading: { ...state.loading, reExamination: true },
            error: { ...state.error, reExamination: null },
          }));

          try {
            const response = await doctorService.getReExamination();
            const data = response.data || response;

            set({
              reExamination: {
                price: data.price || null,
                duration: data.duration || null,
              },
              loading: { ...get().loading, reExamination: false },
            });
          } catch (error) {
            set((state) => ({
              loading: { ...state.loading, reExamination: false },
              error: { 
                ...state.error, 
                reExamination: error.response?.data?.message || 'فشل تحميل بيانات إعادة الكشف' 
              },
            }));
            throw error;
          }
        },

        /**
         * Update re-examination service
         * @param {Object} data - Service data
         */
        updateReExamination: async (data) => {
          const previousData = get().reExamination;

          // Optimistic update
          set((state) => ({
            reExamination: { ...state.reExamination, ...data },
            loading: { ...state.loading, reExamination: true },
            error: { ...state.error, reExamination: null },
            success: { ...state.success, reExamination: null },
          }));

          try {
            await doctorService.updateReExamination(data);

            set((state) => ({
              loading: { ...state.loading, reExamination: false },
              success: { ...state.success, reExamination: 'تم حفظ بيانات إعادة الكشف بنجاح' },
            }));

            // Auto-clear success message
            setTimeout(() => {
              set((state) => ({
                success: { ...state.success, reExamination: null },
              }));
            }, 3000);

            return { success: true };
          } catch (error) {
            // Rollback
            set((state) => ({
              reExamination: previousData,
              loading: { ...state.loading, reExamination: false },
              error: { 
                ...state.error, 
                reExamination: error.response?.data?.message || 'فشل حفظ بيانات إعادة الكشف' 
              },
            }));
            return { success: false, error };
          }
        },

        /**
         * Fetch all services in parallel
         */
        fetchAllServices: async () => {
          const results = await Promise.allSettled([
            get().fetchRegularCheckup(),
            get().fetchReExamination(),
          ]);

          // Check for errors
          const errors = results
            .filter(r => r.status === 'rejected')
            .map(r => r.reason?.message || 'خطأ غير معروف');

          if (errors.length > 0) {
            console.error('Errors fetching services:', errors);
          }
        },

        /**
         * Clear errors
         */
        clearErrors: () => {
          set({
            error: {
              regularCheckup: null,
              reExamination: null,
            },
          });
        },

        /**
         * Clear success messages
         */
        clearSuccess: () => {
          set({
            success: {
              regularCheckup: null,
              reExamination: null,
            },
          });
        },

        /**
         * Reset services store
         */
        resetServicesStore: () => {
          set({
            regularCheckup: {
              price: null,
              duration: null,
            },
            reExamination: {
              price: null,
              duration: null,
            },
            loading: {
              regularCheckup: false,
              reExamination: false,
            },
            error: {
              regularCheckup: null,
              reExamination: null,
            },
            success: {
              regularCheckup: null,
              reExamination: null,
            },
          });
        },
      }),
      {
        name: 'services-storage',
        partialize: (state) => ({
          regularCheckup: state.regularCheckup,
          reExamination: state.reExamination,
        }),
      }
    ),
    { name: 'ServicesStore' }
  )
);
