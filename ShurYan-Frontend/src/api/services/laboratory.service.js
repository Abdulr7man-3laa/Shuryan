import apiClient from '../client';

/**
 * Laboratory Service
 * Handles all laboratory-related API calls
 */

/**
 * Get laboratory statistics
 * @returns {Promise<Object>}
 */
export const getStatistics = async () => {
  try {
    const response = await apiClient.get('/Laboratories/me/statistics');
    return response.data?.data || response.data;
  } catch (error) {
    console.error('Error fetching laboratory statistics:', error);
    throw error;
  }
};

/**
 * Get laboratory orders (detailed - for dashboard)
 * GET /Laboratories/me/orders
 * @param {Object} params - Query parameters
 * @param {number} params.status - Order status filter (optional)
 * @param {number} params.pageNumber - Page number
 * @param {number} params.pageSize - Page size
 * @returns {Promise<Array>} Array of orders
 */
export const getOrders = async (params = {}) => {
  try {
    console.log('🔍 Fetching laboratory orders with params:', params);
    const response = await apiClient.get('/Laboratories/me/orders', { params });

    // Response: { isSuccess, message, data: [...orders], errors, statusCode }
    const orders = response.data?.data || [];

    console.log(`✅ Fetched ${orders.length} orders`);
    return orders;
  } catch (error) {
    console.error('❌ Error fetching laboratory orders:', error);
    throw error;
  }
};

/**
 * Get laboratory orders list (lightweight - for orders page)
 * @param {number} pageNumber - Page number
 * @param {number} pageSize - Page size
 * @returns {Promise<Object>}
 */
export const getOrdersList = async (pageNumber = 1, pageSize = 20) => {
  try {
    const response = await apiClient.get('/Laboratories/me/orders/list', {
      params: { pageNumber, pageSize }
    });

    const data = response.data?.data || response.data;

    return {
      orders: data.orders || data.data || [],
      totalCount: data.totalCount || 0,
      pageNumber: data.pageNumber || pageNumber,
      pageSize: data.pageSize || pageSize,
    };
  } catch (error) {
    console.error('Error fetching laboratory orders list:', error);
    throw error;
  }
};

/**
 * Get order details by ID
 * GET /Laboratories/me/orders/{orderId}
 * @param {string} orderId - Order ID
 * @returns {Promise<Object>} Order details object
 */
export const getOrderDetails = async (orderId) => {
  try {
    console.log(`🔍 Fetching order details for: ${orderId}`);
    const response = await apiClient.get(`/Laboratories/me/orders/${orderId}`);

    // Response: { isSuccess, message, data: {...order}, errors, statusCode }
    const orderDetails = response.data?.data || {};

    console.log('✅ Order details fetched successfully');
    return orderDetails;
  } catch (error) {
    console.error(`❌ Error fetching order details for ${orderId}:`, error);
    throw error;
  }
};

/**
 * Respond to order with test availability and pricing
 * @param {string} orderId - Order ID
 * @param {Object} responseData - Response data
 * @returns {Promise<Object>}
 */
export const respondToOrder = async (orderId, responseData) => {
  try {
    const response = await apiClient.put(`/Laboratories/me/orders/${orderId}/respond`, responseData);
    return response.data?.data || response.data;
  } catch (error) {
    console.error(`Error responding to order ${orderId}:`, error);
    throw error;
  }
};

/**
 * Update order status
 * @param {string} orderId - Order ID
 * @param {number} status - New status
 * @returns {Promise<Object>}
 */
export const updateOrderStatus = async (orderId, status) => {
  try {
    const response = await apiClient.put(`/Laboratories/me/orders/${orderId}/status`, { status });
    return { success: true, data: response.data?.data || response.data };
  } catch (error) {
    console.error(`Error updating order status for ${orderId}:`, error);
    return { success: false, error: error.response?.data?.message || 'فشل في تحديث حالة الطلب' };
  }
};

// ==================== PROFILE MANAGEMENT ====================

/**
 * Get laboratory basic info
 * GET /api/laboratories/me/profile/basic
 */
export const getBasicInfo = async () => {
  try {
    const response = await apiClient.get('/laboratories/me/profile/basic');
    return response.data?.data || null;
  } catch (error) {
    console.error('❌ Error fetching laboratory basic info:', error);
    throw error;
  }
};

/**
 * Update laboratory basic info
 * PUT /api/laboratories/me/profile/basic
 * @param {Object} data - { name?, phoneNumber? }
 */
export const updateBasicInfo = async (data) => {
  try {
    console.log('📝 Updating laboratory basic info:', data);
    const response = await apiClient.put('/laboratories/me/profile/basic', data);
    console.log('✅ Basic info updated successfully');
    return response.data?.data || null;
  } catch (error) {
    console.error('❌ Error updating laboratory basic info:', error);
    throw error;
  }
};

/**
 * Update laboratory profile image
 * PUT /api/laboratories/me/profile/image
 * @param {File} imageFile - Image file (max 5MB)
 */
export const updateProfileImage = async (imageFile) => {
  try {
    console.log('📸 Uploading laboratory profile image...');

    const formData = new FormData();
    formData.append('profileImage', imageFile);

    const response = await apiClient.put('/laboratories/me/profile/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('✅ Profile image uploaded successfully');
    return response.data?.data || null;
  } catch (error) {
    console.error('❌ Error uploading laboratory profile image:', error);
    throw error;
  }
};

/**
 * Get laboratory address
 * GET /api/laboratories/me/profile/address
 */
export const getAddress = async () => {
  try {
    const response = await apiClient.get('/laboratories/me/profile/address');
    return response.data?.data || null;
  } catch (error) {
    console.error('❌ Error fetching laboratory address:', error);
    throw error;
  }
};

/**
 * Update laboratory address
 * PUT /api/laboratories/me/profile/address
 * @param {Object} data - { governorate?, city?, street?, buildingNumber?, latitude?, longitude? }
 */
export const updateAddress = async (data) => {
  try {
    console.log('📍 Updating laboratory address:', data);
    const response = await apiClient.put('/laboratories/me/profile/address', data);
    console.log('✅ Address updated successfully');
    return response.data?.data || null;
  } catch (error) {
    console.error('❌ Error updating laboratory address:', error);
    throw error;
  }
};

/**
 * Get laboratory working hours
 * GET /api/laboratories/me/profile/workinghours
 */
export const getWorkingHours = async () => {
  try {
    const response = await apiClient.get('/laboratories/me/profile/workinghours');
    return response.data?.data || null;
  } catch (error) {
    console.error('❌ Error fetching laboratory working hours:', error);
    throw error;
  }
};

/**
 * Update laboratory working hours
 * PUT /api/laboratories/me/profile/workinghours
 * @param {Object} data - { weeklySchedule: {...} }
 */
export const updateWorkingHours = async (data) => {
  try {
    console.log('🕐 Updating laboratory working hours:', data);
    const response = await apiClient.put('/laboratories/me/profile/workinghours', data);
    console.log('✅ Working hours updated successfully');
    return response.data?.data || null;
  } catch (error) {
    console.error('❌ Error updating laboratory working hours:', error);
    throw error;
  }
};

/**
 * Get laboratory sample collection settings
 * GET /api/laboratories/me/profile/home-collection
 */
export const getSampleCollectionSettings = async () => {
  try {
    const response = await apiClient.get('/laboratories/me/home-collection');
    return response.data?.data || null;
  } catch (error) {
    console.error('❌ Error fetching laboratory sample collection settings:', error);
    throw error;
  }
};

/**
 * Update laboratory sample collection settings
 * PUT /api/laboratories/me/profile/home-collection
 * @param {Object} data - { offersHomeSampleCollection?: boolean, homeSampleCollectionFee?: number }
 */
export const updateSampleCollectionSettings = async (data) => {
  try {
    console.log('🩸 Updating laboratory sample collection settings:', data);
    const response = await apiClient.put('/laboratories/me/home-collection', data);
    console.log('✅ Sample collection settings updated successfully');
    return response.data?.data || null;
  } catch (error) {
    console.error('❌ Error updating laboratory sample collection settings:', error);
    throw error;
  }
};

// ==================== SERVICES MANAGEMENT ====================

/**
 * Get laboratory services
 * GET /api/laboratories/me/services
 * @returns {Promise<Array>} Array of laboratory services
 */
export const getServices = async () => {
  try {
    console.log('🔬 Fetching laboratory services...');
    const response = await apiClient.get('/laboratories/me/services');
    const services = response.data?.data || [];
    console.log(`✅ Fetched ${services.length} laboratory services`);
    return services;
  } catch (error) {
    console.error('❌ Error fetching laboratory services:', error);
    throw error;
  }
};

/**
 * Create a new laboratory service
 * POST /api/laboratories/me/services
 * @param {Object} serviceData - { labTestId, price, isAvailable, labSpecificNotes }
 * @returns {Promise<Object>} Created service object
 */
export const createService = async (serviceData) => {
  try {
    console.log('➕ Creating new laboratory service:', serviceData);
    const response = await apiClient.post('/laboratories/me/services', serviceData);
    const service = response.data?.data || {};
    console.log('✅ Service created successfully');
    return service;
  } catch (error) {
    console.error('❌ Error creating service:', error);
    throw error;
  }
};

/**
 * Update laboratory service price and notes
 * PUT /api/laboratories/me/services/{serviceId}
 * @param {string} serviceId - Service ID
 * @param {Object} updateData - { price, labSpecificNotes }
 * @returns {Promise<Object>} Updated service object
 */
export const updateService = async (serviceId, updateData) => {
  try {
    console.log(`📝 Updating service ${serviceId}:`, updateData);
    const response = await apiClient.put(`/laboratories/me/services/${serviceId}`, updateData);
    const service = response.data?.data || {};
    console.log('✅ Service updated successfully');
    return service;
  } catch (error) {
    console.error(`❌ Error updating service ${serviceId}:`, error);
    throw error;
  }
};

/**
 * Delete laboratory service
 * DELETE /api/laboratories/me/services/{serviceId}
 * @param {string} serviceId - Service ID
 * @returns {Promise<Object>} Deletion response
 */
export const deleteService = async (serviceId) => {
  try {
    console.log(`🗑️ Deleting service ${serviceId}...`);
    const response = await apiClient.delete(`/laboratories/me/services/${serviceId}`);
    console.log('✅ Service deleted successfully');
    return response.data?.data || {};
  } catch (error) {
    console.error(`❌ Error deleting service ${serviceId}:`, error);
    throw error;
  }
};

/**
 * Update laboratory service availability
 * PUT /api/laboratories/me/services/{serviceId}/availability
 * @param {string} serviceId - Service ID
 * @param {boolean} isAvailable - Service availability status
 * @returns {Promise<Object>} Updated service object
 */
export const updateServiceAvailability = async (serviceId, isAvailable) => {
  try {
    console.log(`🔄 Updating service ${serviceId} availability to: ${isAvailable}`);
    const response = await apiClient.put(`/laboratories/me/services/${serviceId}/availability`, { isAvailable });
    const service = response.data?.data || {};
    console.log('✅ Service availability updated successfully');
    return service;
  } catch (error) {
    console.error(`❌ Error updating service availability ${serviceId}:`, error);
    throw error;
  }
};

/**
 * Get all available lab tests in the system
 * GET /api/laboratories/me/available-tests
 * @returns {Promise<Array>} Array of available lab tests
 */
export const getAvailableTests = async () => {
  try {
    console.log('🔬 Fetching available lab tests...');
    const response = await apiClient.get('/laboratories/me/available-tests');
    const tests = response.data?.data || [];
    console.log(`✅ Fetched ${tests.length} available lab tests`);
    return tests;
  } catch (error) {
    console.error('❌ Error fetching available lab tests:', error);
    throw error;
  }
};

const laboratoryService = {
  getStatistics,
  getOrders,
  getOrdersList,
  getOrderDetails,
  respondToOrder,
  updateOrderStatus,
  // Profile management
  getBasicInfo,
  updateBasicInfo,
  updateProfileImage,
  getAddress,
  updateAddress,
  getWorkingHours,
  updateWorkingHours,
  getSampleCollectionSettings,
  updateSampleCollectionSettings,
  // Services management
  getServices,
  createService,
  updateService,
  deleteService,
  updateServiceAvailability,
  // Available tests
  getAvailableTests,
};

export default laboratoryService;
