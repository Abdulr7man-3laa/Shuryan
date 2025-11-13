import { useEffect, useCallback } from 'react';
import { useClinicStore } from '../stores/clinicStore';

/**
 * Custom hook for clinic management
 * 
 * Features:
 * - Auto-fetch clinic data on mount
 * - Memoized actions
 * - Loading and error states
 * - Success messages
 * 
 * @param {Object} options - Hook options
 * @param {boolean} options.autoFetch - Auto-fetch data on mount (default: true)
 * @param {boolean} options.fetchInfo - Fetch clinic info (default: true)
 * @param {boolean} options.fetchAddress - Fetch clinic address (default: true)
 * @param {boolean} options.fetchImages - Fetch clinic images (default: true)
 * @returns {Object} Clinic state and actions
 */
export const useClinic = ({
  autoFetch = true,
  fetchInfo = true,
  fetchAddress = true,
  fetchImages = true,
} = {}) => {
  // Select state from store
  const {
    clinicInfo,
    clinicAddress,
    clinicImages,
    loading,
    error,
    success,
    fetchClinicInfo,
    fetchClinicAddress,
    fetchClinicImages,
    fetchAllClinicData,
    updateClinicInfo,
    updateClinicAddress,
    uploadClinicImage,
    deleteClinicImage,
    reorderClinicImages,
    clearErrors,
    clearSuccess,
  } = useClinicStore();

  // Fetch data on mount
  useEffect(() => {
    if (autoFetch) {
      const fetchData = async () => {
        const promises = [];

        if (fetchInfo) promises.push(fetchClinicInfo());
        if (fetchAddress) promises.push(fetchClinicAddress());
        if (fetchImages) promises.push(fetchClinicImages());

        if (promises.length > 0) {
          await Promise.allSettled(promises);
        }
      };

      fetchData();
    }
  }, [autoFetch, fetchInfo, fetchAddress, fetchImages]);

  // Memoized actions
  const handleUpdateInfo = useCallback(
    async (data) => {
      try {
        await updateClinicInfo(data);
        return { success: true };
      } catch (error) {
        return { success: false, error };
      }
    },
    [updateClinicInfo]
  );

  const handleUpdateAddress = useCallback(
    async (data) => {
      try {
        await updateClinicAddress(data);
        return { success: true };
      } catch (error) {
        return { success: false, error };
      }
    },
    [updateClinicAddress]
  );

  const handleUploadImage = useCallback(
    async (file, order) => {
      try {
        const result = await uploadClinicImage(file, order);
        return { success: true, data: result };
      } catch (error) {
        return { success: false, error };
      }
    },
    [uploadClinicImage]
  );

  const handleDeleteImage = useCallback(
    async (imageId) => {
      try {
        await deleteClinicImage(imageId);
        return { success: true };
      } catch (error) {
        return { success: false, error };
      }
    },
    [deleteClinicImage]
  );

  const handleReorderImages = useCallback(
    async (newOrder) => {
      try {
        await reorderClinicImages(newOrder);
        return { success: true };
      } catch (error) {
        return { success: false, error };
      }
    },
    [reorderClinicImages]
  );

  const handleRefreshAll = useCallback(async () => {
    try {
      await fetchAllClinicData();
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  }, [fetchAllClinicData]);

  return {
    // State
    clinicInfo,
    clinicAddress,
    clinicImages,
    loading,
    error,
    success,

    // Actions
    updateInfo: handleUpdateInfo,
    updateAddress: handleUpdateAddress,
    uploadImage: handleUploadImage,
    deleteImage: handleDeleteImage,
    reorderImages: handleReorderImages,
    refreshAll: handleRefreshAll,
    clearErrors,
    clearSuccess,

    // Computed
    hasInfo: !!clinicInfo.clinicName,
    hasAddress: !!clinicAddress.governorate,
    hasImages: clinicImages.length > 0,
    canAddMoreImages: clinicImages.length < 6,
    isLoading:
      loading.info ||
      loading.address ||
      loading.images ||
      loading.uploading ||
      loading.deleting ||
      loading.reordering,
    hasError: !!error.info || !!error.address || !!error.images,
  };
};
