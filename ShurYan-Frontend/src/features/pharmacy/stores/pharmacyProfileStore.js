import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import pharmacyService from '@/api/services/pharmacy.service';

/**
 * Pharmacy Profile Store
 * Manages pharmacy profile data with auto-save functionality
 */

const usePharmacyProfileStore = create(
  devtools(
    persist(
      (set, get) => ({
        // ==================== State ====================
        
        // Basic Info
        basicInfo: null,
        
        // Address
        address: null,
        
        // Working Hours
        workingHours: null,
        
        // Delivery Settings
        deliverySettings: null,
        
        // Loading States
        loading: {
          basicInfo: false,
          address: false,
          workingHours: false,
          delivery: false,
          profileImage: false,
        },
        
        // Error States
        error: {
          basicInfo: null,
          address: null,
          workingHours: null,
          delivery: null,
          profileImage: null,
        },
        
        // Success States (for auto-clear messages)
        success: {
          basicInfo: null,
          address: null,
          workingHours: null,
          delivery: null,
          profileImage: null,
        },

        // ==================== Basic Info Actions ====================
        
        /**
         * Fetch pharmacy basic info
         */
        fetchBasicInfo: async () => {
          set((state) => ({
            loading: { ...state.loading, basicInfo: true },
            error: { ...state.error, basicInfo: null },
          }));

          try {
            const data = await pharmacyService.getBasicInfo();
            set({ basicInfo: data });
            return { success: true, data };
          } catch (error) {
            const errorMessage = error.response?.data?.message || 'فشل جلب المعلومات الأساسية';
            set((state) => ({
              error: { ...state.error, basicInfo: errorMessage },
            }));
            return { success: false, error: errorMessage };
          } finally {
            set((state) => ({
              loading: { ...state.loading, basicInfo: false },
            }));
          }
        },

        /**
         * Update pharmacy basic info
         * @param {Object} data - { name?, phoneNumber? }
         */
        updateBasicInfo: async (data) => {
          set((state) => ({
            loading: { ...state.loading, basicInfo: true },
            error: { ...state.error, basicInfo: null },
            success: { ...state.success, basicInfo: null },
          }));

          // Optimistic update
          const previousBasicInfo = get().basicInfo;
          set({ basicInfo: { ...previousBasicInfo, ...data } });

          try {
            const updatedData = await pharmacyService.updateBasicInfo(data);
            set({
              basicInfo: updatedData,
              success: (state) => ({ ...state.success, basicInfo: 'تم تحديث المعلومات الأساسية بنجاح' }),
            });

            // Auto-clear success message
            setTimeout(() => {
              set((state) => ({
                success: { ...state.success, basicInfo: null },
              }));
            }, 3000);

            return { success: true, data: updatedData };
          } catch (error) {
            // Rollback on error
            set({ basicInfo: previousBasicInfo });
            
            const errorMessage = error.response?.data?.message || 'فشل تحديث المعلومات الأساسية';
            set((state) => ({
              error: { ...state.error, basicInfo: errorMessage },
            }));
            return { success: false, error: errorMessage };
          } finally {
            set((state) => ({
              loading: { ...state.loading, basicInfo: false },
            }));
          }
        },

        /**
         * Update pharmacy profile image
         * @param {File} imageFile
         */
        updateProfileImage: async (imageFile) => {
          set((state) => ({
            loading: { ...state.loading, profileImage: true },
            error: { ...state.error, profileImage: null },
            success: { ...state.success, profileImage: null },
          }));

          try {
            const result = await pharmacyService.updateProfileImage(imageFile);
            
            // Update basicInfo with new image URL
            set((state) => ({
              basicInfo: {
                ...state.basicInfo,
                profileImageUrl: result.imageUrl,
              },
              success: { ...state.success, profileImage: 'تم تحديث صورة البروفايل بنجاح' },
            }));

            // Auto-clear success message
            setTimeout(() => {
              set((state) => ({
                success: { ...state.success, profileImage: null },
              }));
            }, 3000);

            return { success: true, data: result };
          } catch (error) {
            const errorMessage = error.response?.data?.message || 'فشل رفع صورة البروفايل';
            set((state) => ({
              error: { ...state.error, profileImage: errorMessage },
            }));
            return { success: false, error: errorMessage };
          } finally {
            set((state) => ({
              loading: { ...state.loading, profileImage: false },
            }));
          }
        },

        // ==================== Address Actions ====================
        
        /**
         * Fetch pharmacy address
         */
        fetchAddress: async () => {
          set((state) => ({
            loading: { ...state.loading, address: true },
            error: { ...state.error, address: null },
          }));

          try {
            const data = await pharmacyService.getAddress();
            set({ address: data });
            return { success: true, data };
          } catch (error) {
            const errorMessage = error.response?.data?.message || 'فشل جلب العنوان';
            set((state) => ({
              error: { ...state.error, address: errorMessage },
            }));
            return { success: false, error: errorMessage };
          } finally {
            set((state) => ({
              loading: { ...state.loading, address: false },
            }));
          }
        },

        /**
         * Update pharmacy address
         * @param {Object} data - { governorate?, city?, street?, buildingNumber?, latitude?, longitude? }
         */
        updateAddress: async (data) => {
          set((state) => ({
            loading: { ...state.loading, address: true },
            error: { ...state.error, address: null },
            success: { ...state.success, address: null },
          }));

          // Optimistic update
          const previousAddress = get().address;
          set({ address: { ...previousAddress, ...data } });

          try {
            const updatedData = await pharmacyService.updateAddress(data);
            set({
              address: updatedData,
              success: (state) => ({ ...state.success, address: 'تم تحديث العنوان بنجاح' }),
            });

            // Auto-clear success message
            setTimeout(() => {
              set((state) => ({
                success: { ...state.success, address: null },
              }));
            }, 3000);

            return { success: true, data: updatedData };
          } catch (error) {
            // Rollback on error
            set({ address: previousAddress });
            
            const errorMessage = error.response?.data?.message || 'فشل تحديث العنوان';
            set((state) => ({
              error: { ...state.error, address: errorMessage },
            }));
            return { success: false, error: errorMessage };
          } finally {
            set((state) => ({
              loading: { ...state.loading, address: false },
            }));
          }
        },

        // ==================== Working Hours Actions ====================
        
        /**
         * Fetch pharmacy working hours
         */
        fetchWorkingHours: async () => {
          set((state) => ({
            loading: { ...state.loading, workingHours: true },
            error: { ...state.error, workingHours: null },
          }));

          try {
            const data = await pharmacyService.getWorkingHours();
            set({ workingHours: data });
            return { success: true, data };
          } catch (error) {
            const errorMessage = error.response?.data?.message || 'فشل جلب ساعات العمل';
            set((state) => ({
              error: { ...state.error, workingHours: errorMessage },
            }));
            return { success: false, error: errorMessage };
          } finally {
            set((state) => ({
              loading: { ...state.loading, workingHours: false },
            }));
          }
        },

        /**
         * Update pharmacy working hours
         * @param {Object} data - { weeklySchedule: {...} }
         */
        updateWorkingHours: async (data) => {
          console.log('🕐 [Store] updateWorkingHours called with:', data);
          
          set((state) => ({
            loading: { ...state.loading, workingHours: true },
            error: { ...state.error, workingHours: null },
            success: { ...state.success, workingHours: null },
          }));

          // Optimistic update
          const previousWorkingHours = get().workingHours;
          set({ workingHours: data.weeklySchedule || data });
          console.log('🕐 [Store] Optimistic update applied');

          try {
            console.log('🕐 [Store] Calling pharmacyService.updateWorkingHours...');
            const updatedData = await pharmacyService.updateWorkingHours(data);
            console.log('🕐 [Store] Service returned:', updatedData);
            
            set({
              workingHours: updatedData,
              success: (state) => ({ ...state.success, workingHours: 'تم تحديث ساعات العمل بنجاح' }),
            });
            console.log('✅ [Store] Working hours updated successfully in store');

            // Auto-clear success message
            setTimeout(() => {
              set((state) => ({
                success: { ...state.success, workingHours: null },
              }));
            }, 3000);

            return { success: true, data: updatedData };
          } catch (error) {
            console.error('❌ [Store] Error updating working hours:', error);
            console.error('❌ [Store] Error response:', error.response?.data);
            
            // Rollback on error
            set({ workingHours: previousWorkingHours });
            console.log('🕐 [Store] Rolled back to previous working hours');
            
            const errorMessage = error.response?.data?.message || 'فشل تحديث ساعات العمل';
            set((state) => ({
              error: { ...state.error, workingHours: errorMessage },
            }));
            console.error('❌ [Store] Error message:', errorMessage);
            return { success: false, error: errorMessage };
          } finally {
            set((state) => ({
              loading: { ...state.loading, workingHours: false },
            }));
            console.log('🕐 [Store] Loading state cleared');
          }
        },

        // ==================== Delivery Actions ====================
        
        /**
         * Fetch pharmacy delivery settings
         */
        fetchDeliverySettings: async () => {
          set((state) => ({
            loading: { ...state.loading, delivery: true },
            error: { ...state.error, delivery: null },
          }));

          try {
            const data = await pharmacyService.getDeliverySettings();
            set({ deliverySettings: data });
            return { success: true, data };
          } catch (error) {
            const errorMessage = error.response?.data?.message || 'فشل جلب إعدادات التوصيل';
            set((state) => ({
              error: { ...state.error, delivery: errorMessage },
            }));
            return { success: false, error: errorMessage };
          } finally {
            set((state) => ({
              loading: { ...state.loading, delivery: false },
            }));
          }
        },

        /**
         * Update pharmacy delivery settings
         * @param {Object} data - { offersDelivery: boolean, deliveryFee: number }
         */
        updateDeliverySettings: async (data) => {
          set((state) => ({
            loading: { ...state.loading, delivery: true },
            error: { ...state.error, delivery: null },
            success: { ...state.success, delivery: null },
          }));

          // Optimistic update
          const previousDeliverySettings = get().deliverySettings;
          set({ deliverySettings: { ...previousDeliverySettings, ...data } });

          try {
            const updatedData = await pharmacyService.updateDeliverySettings(data);
            set({
              deliverySettings: updatedData,
              success: (state) => ({ ...state.success, delivery: 'تم تحديث إعدادات التوصيل بنجاح' }),
            });

            // Auto-clear success message
            setTimeout(() => {
              set((state) => ({
                success: { ...state.success, delivery: null },
              }));
            }, 3000);

            return { success: true, data: updatedData };
          } catch (error) {
            // Rollback on error
            set({ deliverySettings: previousDeliverySettings });
            
            const errorMessage = error.response?.data?.message || 'فشل تحديث إعدادات التوصيل';
            set((state) => ({
              error: { ...state.error, delivery: errorMessage },
            }));
            return { success: false, error: errorMessage };
          } finally {
            set((state) => ({
              loading: { ...state.loading, delivery: false },
            }));
          }
        },

        // ==================== Utility Actions ====================
        
        /**
         * Clear all errors
         */
        clearErrors: () => {
          set({
            error: {
              basicInfo: null,
              address: null,
              workingHours: null,
              delivery: null,
              profileImage: null,
            },
          });
        },

        /**
         * Reset store to initial state
         */
        reset: () => {
          set({
            basicInfo: null,
            address: null,
            workingHours: null,
            deliverySettings: null,
            loading: {
              basicInfo: false,
              address: false,
              workingHours: false,
              delivery: false,
              profileImage: false,
            },
            error: {
              basicInfo: null,
              address: null,
              workingHours: null,
              delivery: null,
              profileImage: null,
            },
            success: {
              basicInfo: null,
              address: null,
              workingHours: null,
              delivery: null,
              profileImage: null,
            },
          });
        },
      }),
      {
        name: 'pharmacy-profile-storage',
        partialize: (state) => ({
          basicInfo: state.basicInfo,
          address: state.address,
          workingHours: state.workingHours,
          deliverySettings: state.deliverySettings,
        }),
      }
    ),
    { name: 'PharmacyProfileStore' }
  )
);

export default usePharmacyProfileStore;
