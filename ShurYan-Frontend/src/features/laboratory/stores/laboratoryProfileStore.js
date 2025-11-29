import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import * as laboratoryService from '@/api/services/laboratory.service';

/**
 * Laboratory Profile Store
 * Manages laboratory profile data with Zustand
 */
const useLaboratoryProfileStore = create(
  devtools(
    persist(
      (set, get) => ({
        // ==================== STATE ====================
        basicInfo: null,
        address: null,
        workingHours: null,
        sampleCollectionSettings: null,

        loading: {
          basicInfo: false,
          profileImage: false,
          address: false,
          workingHours: false,
          sampleCollection: false,
        },

        error: {
          basicInfo: null,
          profileImage: null,
          address: null,
          workingHours: null,
          sampleCollection: null,
        },

        success: {
          basicInfo: null,
          profileImage: null,
          address: null,
          workingHours: null,
          sampleCollection: null,
        },

        // ==================== ACTIONS - Basic Info ====================

        fetchBasicInfo: async () => {
          set((state) => ({
            loading: { ...state.loading, basicInfo: true },
            error: { ...state.error, basicInfo: null },
          }));

          try {
            const data = await laboratoryService.getBasicInfo();
            set({ basicInfo: data });
            return { success: true, data };
          } catch (error) {
            const errorMsg = error.response?.data?.message || 'فشل في جلب البيانات الأساسية';
            set((state) => ({
              error: { ...state.error, basicInfo: errorMsg },
            }));
            return { success: false, error: errorMsg };
          } finally {
            set((state) => ({
              loading: { ...state.loading, basicInfo: false },
            }));
          }
        },

        updateBasicInfo: async (data) => {
          set((state) => ({
            loading: { ...state.loading, basicInfo: true },
            error: { ...state.error, basicInfo: null },
            success: { ...state.success, basicInfo: null },
          }));

          try {
            const result = await laboratoryService.updateBasicInfo(data);
            set({
              basicInfo: result,
              success: { ...get().success, basicInfo: 'تم تحديث البيانات بنجاح' },
            });

            setTimeout(() => {
              set((state) => ({
                success: { ...state.success, basicInfo: null },
              }));
            }, 3000);

            return { success: true, data: result };
          } catch (error) {
            const errorMsg = error.response?.data?.message || 'فشل في تحديث البيانات';
            set((state) => ({
              error: { ...state.error, basicInfo: errorMsg },
            }));
            return { success: false, error: errorMsg };
          } finally {
            set((state) => ({
              loading: { ...state.loading, basicInfo: false },
            }));
          }
        },

        updateProfileImage: async (imageFile) => {
          set((state) => ({
            loading: { ...state.loading, profileImage: true },
            error: { ...state.error, profileImage: null },
            success: { ...state.success, profileImage: null },
          }));

          try {
            const result = await laboratoryService.updateProfileImage(imageFile);
            
            if (get().basicInfo) {
              set((state) => ({
                basicInfo: {
                  ...state.basicInfo,
                  profileImageUrl: result.profileImageUrl || result.url,
                },
                success: { ...state.success, profileImage: 'تم تحديث الصورة بنجاح' },
              }));
            }

            setTimeout(() => {
              set((state) => ({
                success: { ...state.success, profileImage: null },
              }));
            }, 3000);

            return { success: true, data: result };
          } catch (error) {
            const errorMsg = error.response?.data?.message || 'فشل في تحديث الصورة';
            set((state) => ({
              error: { ...state.error, profileImage: errorMsg },
            }));
            return { success: false, error: errorMsg };
          } finally {
            set((state) => ({
              loading: { ...state.loading, profileImage: false },
            }));
          }
        },

        // ==================== ACTIONS - Address ====================

        fetchAddress: async () => {
          set((state) => ({
            loading: { ...state.loading, address: true },
            error: { ...state.error, address: null },
          }));

          try {
            const data = await laboratoryService.getAddress();
            set({ address: data });
            return { success: true, data };
          } catch (error) {
            const errorMsg = error.response?.data?.message || 'فشل في جلب العنوان';
            set((state) => ({
              error: { ...state.error, address: errorMsg },
            }));
            return { success: false, error: errorMsg };
          } finally {
            set((state) => ({
              loading: { ...state.loading, address: false },
            }));
          }
        },

        updateAddress: async (data) => {
          set((state) => ({
            loading: { ...state.loading, address: true },
            error: { ...state.error, address: null },
            success: { ...state.success, address: null },
          }));

          try {
            const result = await laboratoryService.updateAddress(data);
            set({
              address: result,
              success: { ...get().success, address: 'تم تحديث العنوان بنجاح' },
            });

            setTimeout(() => {
              set((state) => ({
                success: { ...state.success, address: null },
              }));
            }, 3000);

            return { success: true, data: result };
          } catch (error) {
            const errorMsg = error.response?.data?.message || 'فشل في تحديث العنوان';
            set((state) => ({
              error: { ...state.error, address: errorMsg },
            }));
            return { success: false, error: errorMsg };
          } finally {
            set((state) => ({
              loading: { ...state.loading, address: false },
            }));
          }
        },

        // ==================== ACTIONS - Working Hours ====================

        fetchWorkingHours: async () => {
          set((state) => ({
            loading: { ...state.loading, workingHours: true },
            error: { ...state.error, workingHours: null },
          }));

          try {
            const data = await laboratoryService.getWorkingHours();
            set({ workingHours: data });
            return { success: true, data };
          } catch (error) {
            const errorMsg = error.response?.data?.message || 'فشل في جلب ساعات العمل';
            set((state) => ({
              error: { ...state.error, workingHours: errorMsg },
            }));
            return { success: false, error: errorMsg };
          } finally {
            set((state) => ({
              loading: { ...state.loading, workingHours: false },
            }));
          }
        },

        updateWorkingHours: async (data) => {
          set((state) => ({
            loading: { ...state.loading, workingHours: true },
            error: { ...state.error, workingHours: null },
            success: { ...state.success, workingHours: null },
          }));

          try {
            const result = await laboratoryService.updateWorkingHours(data);
            set({
              workingHours: result,
              success: { ...get().success, workingHours: 'تم تحديث ساعات العمل بنجاح' },
            });

            setTimeout(() => {
              set((state) => ({
                success: { ...state.success, workingHours: null },
              }));
            }, 3000);

            return { success: true, data: result };
          } catch (error) {
            const errorMsg = error.response?.data?.message || 'فشل في تحديث ساعات العمل';
            set((state) => ({
              error: { ...state.error, workingHours: errorMsg },
            }));
            return { success: false, error: errorMsg };
          } finally {
            set((state) => ({
              loading: { ...state.loading, workingHours: false },
            }));
          }
        },

        // ==================== ACTIONS - Sample Collection ====================

        fetchSampleCollectionSettings: async () => {
          set((state) => ({
            loading: { ...state.loading, sampleCollection: true },
            error: { ...state.error, sampleCollection: null },
          }));

          try {
            const data = await laboratoryService.getSampleCollectionSettings();
            set({ sampleCollectionSettings: data });
            return { success: true, data };
          } catch (error) {
            const errorMsg = error.response?.data?.message || 'فشل في جلب إعدادات أخذ العينات';
            set((state) => ({
              error: { ...state.error, sampleCollection: errorMsg },
            }));
            return { success: false, error: errorMsg };
          } finally {
            set((state) => ({
              loading: { ...state.loading, sampleCollection: false },
            }));
          }
        },

        updateSampleCollectionSettings: async (data) => {
          set((state) => ({
            loading: { ...state.loading, sampleCollection: true },
            error: { ...state.error, sampleCollection: null },
            success: { ...state.success, sampleCollection: null },
          }));

          try {
            const result = await laboratoryService.updateSampleCollectionSettings(data);
            set({
              sampleCollectionSettings: result,
              success: { ...get().success, sampleCollection: 'تم تحديث إعدادات أخذ العينات بنجاح' },
            });

            setTimeout(() => {
              set((state) => ({
                success: { ...state.success, sampleCollection: null },
              }));
            }, 3000);

            return { success: true, data: result };
          } catch (error) {
            const errorMsg = error.response?.data?.message || 'فشل في تحديث إعدادات أخذ العينات';
            set((state) => ({
              error: { ...state.error, sampleCollection: errorMsg },
            }));
            return { success: false, error: errorMsg };
          } finally {
            set((state) => ({
              loading: { ...state.loading, sampleCollection: false },
            }));
          }
        },

        // ==================== UTILITY ACTIONS ====================

        clearErrors: () => {
          set({
            error: {
              basicInfo: null,
              profileImage: null,
              address: null,
              workingHours: null,
              sampleCollection: null,
            },
          });
        },

        reset: () => {
          set({
            basicInfo: null,
            address: null,
            workingHours: null,
            sampleCollectionSettings: null,
            loading: {
              basicInfo: false,
              profileImage: false,
              address: false,
              workingHours: false,
              sampleCollection: false,
            },
            error: {
              basicInfo: null,
              profileImage: null,
              address: null,
              workingHours: null,
              sampleCollection: null,
            },
            success: {
              basicInfo: null,
              profileImage: null,
              address: null,
              workingHours: null,
              sampleCollection: null,
            },
          });
        },
      }),
      {
        name: 'laboratory-profile-store',
        partialize: (state) => ({
          basicInfo: state.basicInfo,
          address: state.address,
        }),
      }
    ),
    { name: 'LaboratoryProfileStore' }
  )
);

export default useLaboratoryProfileStore;
