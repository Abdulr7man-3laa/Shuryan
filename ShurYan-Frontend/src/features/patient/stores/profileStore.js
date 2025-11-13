import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import patientService from '@/api/services/patient.service';

/**
 * Patient Profile Store
 * 
 * Manages:
 * - Personal information (name, email, phone, gender, birthdate, profile image)
 * - Address (governorate, city, street, building, coordinates)
 * - Medical record (allergies, diseases, medications, surgeries)
 */
export const useProfileStore = create(
  devtools(
    persist(
      (set, get) => ({
        // ==========================================
        // State
        // ==========================================
        
        // Personal Info
        personalInfo: null,
        address: null,
        
        // Medical Record
        medicalRecord: null,
        
        // UI State
        loading: {
          personalInfo: false,
          address: false,
          medicalRecord: false,
          profileImage: false,
        },
        error: {
          personalInfo: null,
          address: null,
          medicalRecord: null,
          profileImage: null,
        },
        success: {
          personalInfo: false,
          address: false,
          medicalRecord: false,
          profileImage: false,
        },

        // ==========================================
        // Personal Info Actions
        // ==========================================

        /**
         * Fetch personal information
         */
        fetchPersonalInfo: async () => {
          set((state) => ({
            loading: { ...state.loading, personalInfo: true },
            error: { ...state.error, personalInfo: null },
          }));

          try {
            const data = await patientService.getPersonalInfo();
            set({
              personalInfo: data,
              loading: { ...get().loading, personalInfo: false },
            });
            return { success: true, data };
          } catch (error) {
            console.error('Error fetching personal info:', error);
            set({
              error: { ...get().error, personalInfo: error.message },
              loading: { ...get().loading, personalInfo: false },
            });
            return { success: false, error: error.message };
          }
        },

        /**
         * Update personal information (without image)
         * @param {Object} data - Personal info data
         */
        updatePersonalInfo: async (data) => {
          const previousData = get().personalInfo;
          
          // Optimistic update
          set({
            personalInfo: { ...previousData, ...data },
            loading: { ...get().loading, personalInfo: true },
            error: { ...get().error, personalInfo: null },
            success: { ...get().success, personalInfo: false },
          });

          try {
            const response = await patientService.updatePersonalInfo(data);
            
            // Update with server response
            set((state) => ({
              personalInfo: {
                ...state.personalInfo,
                ...response?.data,
              },
              loading: { ...state.loading, personalInfo: false },
              success: { ...state.success, personalInfo: true },
            }));

            // Clear success message after 3 seconds
            setTimeout(() => {
              set({ success: { ...get().success, personalInfo: false } });
            }, 3000);

            return { success: true };
          } catch (error) {
            console.error('Error updating personal info:', error);
            
            // Rollback
            set({
              personalInfo: previousData,
              error: { ...get().error, personalInfo: error.message },
              loading: { ...get().loading, personalInfo: false },
            });
            
            return { success: false, error: error.message };
          }
        },

        /**
         * Update profile image
         * @param {File} imageFile - Profile image file
         */
        updateProfileImage: async (imageFile) => {
          set({
            loading: { ...get().loading, profileImage: true },
            error: { ...get().error, profileImage: null },
          });

          try {
            const response = await patientService.updateProfileImage(imageFile);
            
            // Update profile image URL
            set((state) => ({
              personalInfo: {
                ...state.personalInfo,
                profileImageUrl: response?.data?.profileImageUrl,
              },
              loading: { ...state.loading, profileImage: false },
            }));

            return { success: true, data: response?.data };
          } catch (error) {
            console.error('Error updating profile image:', error);
            
            set({
              error: { ...get().error, profileImage: error.message },
              loading: { ...get().loading, profileImage: false },
            });
            
            return { success: false, error: error.message };
          }
        },


        // ==========================================
        // Address Actions
        // ==========================================

        /**
         * Fetch address
         */
        fetchAddress: async () => {
          set((state) => ({
            loading: { ...state.loading, address: true },
            error: { ...state.error, address: null },
          }));

          try {
            const data = await patientService.getAddress();
            set({
              address: data,
              loading: { ...get().loading, address: false },
            });
            return { success: true, data };
          } catch (error) {
            console.error('Error fetching address:', error);
            set({
              error: { ...get().error, address: error.message },
              loading: { ...get().loading, address: false },
            });
            return { success: false, error: error.message };
          }
        },

        /**
         * Update address
         */
        updateAddress: async (data) => {
          const previousData = get().address;
          
          // Optimistic update
          set({
            address: { ...previousData, ...data },
            loading: { ...get().loading, address: true },
            error: { ...get().error, address: null },
            success: { ...get().success, address: false },
          });

          try {
            await patientService.updateAddress(data);
            
            set({
              loading: { ...get().loading, address: false },
              success: { ...get().success, address: true },
            });

            // Clear success message after 3 seconds
            setTimeout(() => {
              set({ success: { ...get().success, address: false } });
            }, 3000);

            return { success: true };
          } catch (error) {
            console.error('Error updating address:', error);
            
            // Rollback
            set({
              address: previousData,
              error: { ...get().error, address: error.message },
              loading: { ...get().loading, address: false },
            });
            
            return { success: false, error: error.message };
          }
        },

        // ==========================================
        // Medical Record Actions
        // ==========================================

        /**
         * Fetch medical record
         */
        fetchMedicalRecord: async () => {
          set((state) => ({
            loading: { ...state.loading, medicalRecord: true },
            error: { ...state.error, medicalRecord: null },
          }));

          try {
            const data = await patientService.getMedicalRecord();
            set({
              medicalRecord: data,
              loading: { ...get().loading, medicalRecord: false },
            });
            return { success: true, data };
          } catch (error) {
            console.error('Error fetching medical record:', error);
            set({
              error: { ...get().error, medicalRecord: error.message },
              loading: { ...get().loading, medicalRecord: false },
            });
            return { success: false, error: error.message };
          }
        },

        /**
         * Update medical record
         * 
         * Supports:
         * - Upsert (create if not exists, update if exists)
         * - Partial update (update only sent sections)
         * - Add/Edit/Delete items within sections
         * 
         * Update logic:
         * - Item with id → Update existing
         * - Item without id → Add new
         * - Existing item not in request → Delete
         */
        updateMedicalRecord: async (data) => {
          const previousData = get().medicalRecord;
          
          // Optimistic update
          set({
            medicalRecord: { ...previousData, ...data },
            loading: { ...get().loading, medicalRecord: true },
            error: { ...get().error, medicalRecord: null },
            success: { ...get().success, medicalRecord: false },
          });

          try {
            await patientService.updateMedicalRecord(data);
            
            // Refresh to get updated data from server
            await get().fetchMedicalRecord();
            
            set({
              loading: { ...get().loading, medicalRecord: false },
              success: { ...get().success, medicalRecord: true },
            });

            // Clear success message after 3 seconds
            setTimeout(() => {
              set({ success: { ...get().success, medicalRecord: false } });
            }, 3000);

            return { success: true };
          } catch (error) {
            console.error('Error updating medical record:', error);
            
            // Rollback
            set({
              medicalRecord: previousData,
              error: { ...get().error, medicalRecord: error.message },
              loading: { ...get().loading, medicalRecord: false },
            });
            
            return { success: false, error: error.message };
          }
        },

        // ==========================================
        // Utility Actions
        // ==========================================

        /**
         * Clear all errors
         */
        clearErrors: () => {
          set({
            error: {
              personalInfo: null,
              address: null,
              medicalRecord: null,
              profileImage: null,
            },
          });
        },

        /**
         * Clear all success messages
         */
        clearSuccess: () => {
          set({
            success: {
              personalInfo: false,
              address: false,
              medicalRecord: false,
              profileImage: false,
            },
          });
        },

        /**
         * Reset store
         */
        resetStore: () => {
          set({
            personalInfo: null,
            address: null,
            medicalRecord: null,
            loading: {
              personalInfo: false,
              address: false,
              medicalRecord: false,
              profileImage: false,
            },
            error: {
              personalInfo: null,
              address: null,
              medicalRecord: null,
              profileImage: null,
            },
            success: {
              personalInfo: false,
              address: false,
              medicalRecord: false,
              profileImage: false,
            },
          });
        },
      }),
      {
        name: 'patient-profile-storage',
        partialize: (state) => ({
          personalInfo: state.personalInfo,
          address: state.address,
        }),
      }
    ),
    { name: 'PatientProfileStore' }
  )
);
