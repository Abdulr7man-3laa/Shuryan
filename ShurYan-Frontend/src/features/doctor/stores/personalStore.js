import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import doctorService from '@/api/services/doctor.service';

/**
 * Personal Info Store - Manages doctor's personal information
 * 
 * Features:
 * - Personal data management (name, phone, DOB, gender, bio)
 * - Profile image upload
 * - Parallel execution with Promise.allSettled
 * - Optimistic updates with rollback
 * - Auto-clear success messages
 */
export const usePersonalStore = create(
  devtools(
    persist(
      (set, get) => ({
        // ==================== State ====================
        
        // Personal Info
        personalInfo: {
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          dateOfBirth: '',
          gender: '',
          bio: '',
          profilePicture: null,
        },
        
        // Profile Image Preview
        profileImagePreview: null,
        
        // Loading States
        loading: {
          fetching: false,
          saving: false,
          uploadingImage: false,
        },
        
        // Error State
        error: null,
        
        // Success Message
        success: null,

        // ==================== Actions ====================
        
        /**
         * Fetch personal information
         */
        fetchPersonalInfo: async () => {
          set({ loading: { ...get().loading, fetching: true }, error: null });

          try {
            const response = await doctorService.getProfile();
            const data = response.data || response;

            set({
              personalInfo: {
                firstName: data.firstName || '',
                lastName: data.lastName || '',
                email: data.email || '',
                phone: data.phoneNumber || '',
                dateOfBirth: data.dateOfBirth ? data.dateOfBirth.split('T')[0] : '',
                gender: data.genderName || '',
                bio: data.biography || '',
                profilePicture: null,
              },
              profileImagePreview: data.profilePictureUrl || null,
              loading: { ...get().loading, fetching: false },
            });
          } catch (error) {
            set({
              loading: { ...get().loading, fetching: false },
              error: error.response?.data?.message || 'فشل تحميل المعلومات الشخصية',
            });
            throw error;
          }
        },

        /**
         * Update personal information (with optional profile image)
         * @param {Object} data - Personal info data
         * @param {File} profileImage - Profile image file (optional)
         */
        updatePersonalInfo: async (data, profileImage = null) => {
          const previousInfo = get().personalInfo;
          const previousPreview = get().profileImagePreview;

          // Optimistic update
          set({
            personalInfo: { ...previousInfo, ...data },
            loading: { ...get().loading, saving: true },
            error: null,
            success: null,
          });

          try {
            // Prepare promises for parallel execution
            const promises = [
              doctorService.updatePersonalInfo({
                firstName: data.firstName,
                lastName: data.lastName,
                phoneNumber: data.phone || null,
                dateOfBirth: data.dateOfBirth || null,
                gender: data.gender,
                biography: data.bio || null,
              })
            ];

            // Add profile image upload if provided
            if (profileImage instanceof File) {
              promises.push(doctorService.updateProfileImage(profileImage));
            }

            // Execute all requests in parallel
            const results = await Promise.allSettled(promises);

            // Check results
            const infoResult = results[0];
            const imageResult = results[1];

            let hasError = false;
            let errorMessage = '';

            if (infoResult.status === 'rejected') {
              hasError = true;
              errorMessage = infoResult.reason?.response?.data?.message || 'فشل حفظ المعلومات';
            }

            if (imageResult && imageResult.status === 'rejected') {
              hasError = true;
              errorMessage += (errorMessage ? '\n' : '') + 'فشل رفع الصورة';
            }

            if (hasError) {
              // Rollback on error
              set({
                personalInfo: previousInfo,
                profileImagePreview: previousPreview,
                loading: { ...get().loading, saving: false },
                error: errorMessage,
              });
              throw new Error(errorMessage);
            }

            // Update with server response
            const updatedData = infoResult.value?.data || infoResult.value;
            
            set({
              personalInfo: {
                firstName: updatedData.firstName || data.firstName,
                lastName: updatedData.lastName || data.lastName,
                email: updatedData.email || data.email,
                phone: updatedData.phoneNumber || data.phone,
                dateOfBirth: updatedData.dateOfBirth ? updatedData.dateOfBirth.split('T')[0] : data.dateOfBirth,
                gender: updatedData.genderName || data.gender,
                bio: updatedData.biography || data.bio,
                profilePicture: null,
              },
              profileImagePreview: imageResult?.value?.data?.profilePictureUrl || previousPreview,
              loading: { ...get().loading, saving: false },
              success: 'تم حفظ المعلومات الشخصية بنجاح',
            });

            // Auto-clear success message after 3 seconds
            setTimeout(() => {
              set({ success: null });
            }, 3000);

            // Refresh data from server
            await get().fetchPersonalInfo();
          } catch (error) {
            // Rollback already done above
            throw error;
          }
        },

        /**
         * Update profile image only
         * @param {File} file - Image file
         */
        updateProfileImage: async (file) => {
          const previousPreview = get().profileImagePreview;

          set({
            loading: { ...get().loading, uploadingImage: true },
            error: null,
          });

          try {
            const response = await doctorService.updateProfileImage(file);
            const imageUrl = response.data?.profilePictureUrl || response.profilePictureUrl;

            set({
              profileImagePreview: imageUrl,
              loading: { ...get().loading, uploadingImage: false },
              success: 'تم تحديث الصورة الشخصية بنجاح',
            });

            // Auto-clear success message
            setTimeout(() => {
              set({ success: null });
            }, 3000);
          } catch (error) {
            set({
              profileImagePreview: previousPreview,
              loading: { ...get().loading, uploadingImage: false },
              error: error.response?.data?.message || 'فشل رفع الصورة',
            });
            throw error;
          }
        },

        /**
         * Set profile image preview (for local preview before upload)
         * @param {string} preview - Image preview URL
         */
        setProfileImagePreview: (preview) => {
          set({ profileImagePreview: preview });
        },

        /**
         * Clear error message
         */
        clearError: () => {
          set({ error: null });
        },

        /**
         * Clear success message
         */
        clearSuccess: () => {
          set({ success: null });
        },

        /**
         * Reset personal store
         */
        resetPersonalStore: () => {
          set({
            personalInfo: {
              firstName: '',
              lastName: '',
              email: '',
              phone: '',
              dateOfBirth: '',
              gender: '',
              bio: '',
              profilePicture: null,
            },
            profileImagePreview: null,
            loading: {
              fetching: false,
              saving: false,
              uploadingImage: false,
            },
            error: null,
            success: null,
          });
        },
      }),
      {
        name: 'personal-storage',
        partialize: (state) => ({
          personalInfo: state.personalInfo,
          profileImagePreview: state.profileImagePreview,
        }),
      }
    ),
    { name: 'PersonalStore' }
  )
);
