import apiClient from '../client';

/**
 * Pharmacy Profile API Service
 * Base URL: /api/pharmacies/me
 */

// ==================== 1. Basic Info ====================

/**
 * Get pharmacy basic info
 * GET /api/pharmacies/me/profile/basic
 */
export const getBasicInfo = async () => {
  try {
    const response = await apiClient.get('/pharmacies/me/profile/basic');
    return response.data?.data || null;
  } catch (error) {
    console.error('❌ Error fetching pharmacy basic info:', error);
    throw error;
  }
};

/**
 * Update pharmacy basic info
 * PUT /api/pharmacies/me/profile/basic
 * @param {Object} data - { name?, phoneNumber? }
 */
export const updateBasicInfo = async (data) => {
  try {
    console.log('📝 Updating pharmacy basic info:', data);
    const response = await apiClient.put('/pharmacies/me/profile/basic', data);
    console.log('✅ Basic info updated successfully');
    return response.data?.data || null;
  } catch (error) {
    console.error('❌ Error updating pharmacy basic info:', error);
    throw error;
  }
};

/**
 * Update pharmacy profile image
 * PUT /api/pharmacies/me/profile/image
 * @param {File} imageFile - Image file (max 5MB)
 */
export const updateProfileImage = async (imageFile) => {
  try {
    console.log('📸 Uploading pharmacy profile image...');
    
    const formData = new FormData();
    formData.append('profileImage', imageFile);

    const response = await apiClient.put('/pharmacies/me/profile/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('✅ Profile image uploaded successfully');
    return response.data?.data || null;
  } catch (error) {
    console.error('❌ Error uploading pharmacy profile image:', error);
    throw error;
  }
};

// ==================== 2. Address ====================

/**
 * Get pharmacy address
 * GET /api/pharmacies/me/profile/address
 */
export const getAddress = async () => {
  try {
    const response = await apiClient.get('/pharmacies/me/profile/address');
    return response.data?.data || null;
  } catch (error) {
    console.error('❌ Error fetching pharmacy address:', error);
    throw error;
  }
};

/**
 * Update pharmacy address
 * PUT /api/pharmacies/me/profile/address
 * @param {Object} data - { governorate?, city?, street?, buildingNumber?, latitude?, longitude? }
 */
export const updateAddress = async (data) => {
  try {
    console.log('📍 Updating pharmacy address:', data);
    const response = await apiClient.put('/pharmacies/me/profile/address', data);
    console.log('✅ Address updated successfully');
    return response.data?.data || null;
  } catch (error) {
    console.error('❌ Error updating pharmacy address:', error);
    throw error;
  }
};

// ==================== 3. Working Hours ====================

/**
 * Get pharmacy working hours
 * GET /api/pharmacies/me/profile/workinghours
 */
export const getWorkingHours = async () => {
  try {
    const response = await apiClient.get('/pharmacies/me/profile/workinghours');
    return response.data?.data || null;
  } catch (error) {
    console.error('❌ Error fetching pharmacy working hours:', error);
    throw error;
  }
};

/**
 * Update pharmacy working hours
 * PUT /api/pharmacies/me/profile/workinghours
 * @param {Object} data - { weeklySchedule: { saturday: {...}, sunday: {...}, ... } }
 */
export const updateWorkingHours = async (data) => {
  try {
    console.log('🕐 Updating pharmacy working hours:', data);
    const response = await apiClient.put('/pharmacies/me/profile/workinghours', data);
    console.log('✅ Working hours updated successfully:', response.data);
    
    // API returns { success, message, data, statusCode }
    // data contains the weeklySchedule object
    return response.data?.data || data.weeklySchedule || data;
  } catch (error) {
    console.error('❌ Error updating pharmacy working hours:', error);
    throw error;
  }
};

// ==================== 4. Delivery Settings ====================

/**
 * Get pharmacy delivery settings
 * GET /api/pharmacies/me/profile/delivery
 */
export const getDeliverySettings = async () => {
  try {
    const response = await apiClient.get('/pharmacies/me/profile/delivery');
    return response.data?.data || null;
  } catch (error) {
    console.error('❌ Error fetching pharmacy delivery settings:', error);
    throw error;
  }
};

/**
 * Update pharmacy delivery settings
 * POST /api/pharmacies/me/profile/delivery
 * @param {Object} data - { offersDelivery: boolean, deliveryFee: number }
 */
export const updateDeliverySettings = async (data) => {
  try {
    console.log('🚚 Updating pharmacy delivery settings:', data);
    const response = await apiClient.post('/pharmacies/me/profile/delivery', data);
    console.log('✅ Delivery settings updated successfully');
    return response.data?.data || null;
  } catch (error) {
    console.error('❌ Error updating pharmacy delivery settings:', error);
    throw error;
  }
};

// ==================== 5. Orders & Prescriptions ====================

/**
 * Get pharmacy orders with pagination
 * GET /api/pharmacies/me/orders?pageNumber=1&pageSize=10
 * @param {number} pageNumber - Page number (default: 1)
 * @param {number} pageSize - Page size (default: 10)
 * @param {string} status - Filter by status (optional)
 * @returns {Promise<Object>} Orders with pagination info
 */
export const getOrders = async (pageNumber = 1, pageSize = 10, status = null) => {
  try {
    console.log(`📋 Fetching pharmacy orders - Page: ${pageNumber}, Size: ${pageSize}`);
    
    let url = `/pharmacies/me/orders?PageNumber=${pageNumber}&PageSize=${pageSize}`;
    if (status) {
      url += `&status=${status}`;
    }
    
    const response = await apiClient.get(url);
    console.log('✅ Pharmacy orders fetched:', response.data);
    
    // Extract data from the nested structure
    const responseData = response.data?.data;
    const orders = responseData?.data || []; // The actual orders array is in data.data
    
    return {
      orders: orders,
      totalCount: responseData?.totalCount || 0,
      pagination: {
        currentPage: responseData?.pageNumber || 1,
        pageSize: responseData?.pageSize || 10,
        totalCount: responseData?.totalCount || 0,
        totalPages: responseData?.totalPages || 1,
        hasNext: responseData?.hasNextPage || false,
        hasPrevious: responseData?.hasPreviousPage || false,
      },
    };
  } catch (error) {
    console.error('❌ Error fetching pharmacy orders:', error);
    throw error;
  }
};

/**
 * Respond to pharmacy order with medication availability and pricing
 * POST /api/pharmacies/me/orders/{orderId}/respond
 * @param {string} orderId - Order ID
 * @param {Object} responseData - Response data with medications, pricing, and delivery info
 * @returns {Promise<Object>} Response result
 */
export const respondToOrder = async (orderId, responseData) => {
  try {
    console.log(`📋 Responding to order ${orderId}...`);
    console.log('📋 Request payload:', JSON.stringify(responseData, null, 2));
    
    const response = await apiClient.post(`/pharmacies/me/orders/${orderId}/respond`, responseData);
    
    console.log('✅ Order response sent successfully:', response.data);
    
    // Return standardized response
    return {
      success: true,
      data: response.data?.data || response.data,
      message: response.data?.message || 'تم إرسال الرد بنجاح'
    };
  } catch (error) {
    console.error('❌ Error responding to order:', error);
    console.error('❌ Error response:', error.response?.data);
    console.error('❌ Error status:', error.response?.status);
    
    // Return standardized error response
    return {
      success: false,
      error: error.response?.data?.message || 
             error.response?.data?.errors?.[0] || 
             error.message || 
             'فشل في إرسال الرد على الطلب'
    };
  }
};

/**
 * Get pending prescriptions (legacy - kept for backward compatibility)
 * GET /api/pharmacies/me/prescriptions/pending
 */
export const getPendingPrescriptions = async () => {
  try {
    console.log('📋 Fetching pending prescriptions...');
    const response = await apiClient.get('/pharmacies/me/prescriptions/pending');
    console.log('✅ Pending prescriptions fetched:', response.data?.data);
    return response.data?.data || null;
  } catch (error) {
    console.error('❌ Error fetching pending prescriptions:', error);
    throw error;
  }
};

/**
 * Get prescription details
 * GET /api/pharmacies/me/prescriptions/{orderId}/details
 * @param {string} orderId - UUID of the pharmacy order
 */
export const getPrescriptionDetails = async (orderId) => {
  try {
    console.log(`📄 Fetching prescription details for order: ${orderId}`);
    const response = await apiClient.get(`/pharmacies/me/prescriptions/${orderId}/details`);
    console.log('✅ Prescription details fetched:', response.data?.data);
    return response.data?.data || null;
  } catch (error) {
    console.error('❌ Error fetching prescription details:', error);
    throw error;
  }
};

// ==================== Export All ====================

const pharmacyService = {
  // Basic Info
  getBasicInfo,
  updateBasicInfo,
  updateProfileImage,
  
  // Address
  getAddress,
  updateAddress,
  
  // Working Hours
  getWorkingHours,
  updateWorkingHours,
  
  // Delivery
  getDeliverySettings,
  updateDeliverySettings,
  
  // Orders & Prescriptions
  getOrders,
  getPendingPrescriptions,
  getPrescriptionDetails,
  respondToOrder,
};

export default pharmacyService;
