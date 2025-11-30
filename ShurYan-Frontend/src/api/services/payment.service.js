import apiClient from '../client';

/**
 * Payment Service - Paymob Integration
 * Handles all payment-related API calls
 */

/**
 * Payment Method Enum
 * 1 = Online (دفع إلكتروني)
 * 2 = CashOnDelivery (دفع كاش)
 */
export const PaymentMethod = {
  ONLINE: 1,
  CASH_ON_DELIVERY: 2,
};

/**
 * Payment Type Enum
 * 1 = Card (بطاقة)
 * 2 = MobileWallet (فودافون كاش)
 */
export const PaymentType = {
  CARD: 1,
  MOBILE_WALLET: 2,
};

/**
 * Payment Status Enum
 * 0 = Pending (في الانتظار)
 * 1 = Processing (جاري المعالجة)
 * 2 = Completed (مكتمل)
 * 3 = Failed (فشل)
 * 4 = Cancelled (ملغي)
 * 5 = Refunded (مسترد)
 */
export const PaymentStatus = {
  PENDING: 0,
  PROCESSING: 1,
  COMPLETED: 2,
  FAILED: 3,
  CANCELLED: 4,
  REFUNDED: 5,
};

/**
 * Initiate payment for appointment
 * @param {string} appointmentId - Appointment ID
 * @param {number} paymentMethod - Payment method (1=Online, 2=Cash)
 * @param {number} paymentType - Payment type (1=Card, 2=MobileWallet)
 * @returns {Promise<Object>} Payment initiation response
 */
export const initiateAppointmentPayment = async (appointmentId, paymentMethod, paymentType) => {
  try {
    console.log('💳 [PaymentService] Initiating appointment payment:', {
      appointmentId,
      paymentMethod,
      paymentType,
    });

    const response = await apiClient.post(
      `/Payments/appointments/${appointmentId}/initiate`,
      {
        appointmentId,
        paymentMethod,
        paymentType,
      }
    );

    console.log('✅ [PaymentService] Payment initiated:', response.data);

    return {
      success: true,
      data: response.data?.data || response.data,
    };
  } catch (error) {
    console.error('❌ [PaymentService] Failed to initiate appointment payment:', error);
    throw error;
  }
};

/**
 * Initiate payment for pharmacy order
 * @param {string} pharmacyOrderId - Pharmacy order ID
 * @param {number} paymentMethod - Payment method (1=Online, 2=Cash)
 * @param {number} paymentType - Payment type (1=Card, 2=MobileWallet)
 * @returns {Promise<Object>} Payment initiation response
 */
export const initiatePharmacyOrderPayment = async (pharmacyOrderId, paymentMethod, paymentType) => {
  try {
    console.log('💳 [PaymentService] Initiating pharmacy order payment:', {
      pharmacyOrderId,
      paymentMethod,
      paymentType,
    });

    const response = await apiClient.post(
      `/Payments/pharmacy-orders/${pharmacyOrderId}/initiate`,
      {
        pharmacyOrderId,
        paymentMethod,
        paymentType,
      }
    );

    console.log('✅ [PaymentService] Payment initiated:', response.data);

    return {
      success: true,
      data: response.data?.data || response.data,
    };
  } catch (error) {
    console.error('❌ [PaymentService] Failed to initiate pharmacy order payment:', error);
    throw error;
  }
};

/**
 * Initiate payment for lab order
 * @param {string} labOrderId - Lab order ID
 * @param {number} paymentMethod - Payment method (1=Online, 2=Cash)
 * @param {number} paymentType - Payment type (1=Card, 2=MobileWallet)
 * @returns {Promise<Object>} Payment initiation response
 */
export const initiateLabOrderPayment = async (labOrderId, paymentMethod, paymentType) => {
  try {
    console.log('💳 [PaymentService] Initiating lab order payment:', {
      labOrderId,
      paymentMethod,
      paymentType,
    });

    const response = await apiClient.post(
      `/Payments/lab-orders/${labOrderId}/initiate`,
      {
        labOrderId,
        paymentMethod,
        paymentType,
      }
    );

    console.log('✅ [PaymentService] Payment initiated:', response.data);

    return {
      success: true,
      data: response.data?.data || response.data,
    };
  } catch (error) {
    console.error('❌ [PaymentService] Failed to initiate lab order payment:', error);
    throw error;
  }
};

/**
 * Get payment details by ID
 * @param {string} paymentId - Payment ID
 * @returns {Promise<Object>} Payment details
 */
export const getPaymentDetails = async (paymentId) => {
  try {
    console.log('🔍 [PaymentService] Fetching payment details:', paymentId);

    const response = await apiClient.get(`/Payments/${paymentId}`);

    console.log('✅ [PaymentService] Payment details fetched:', response.data);

    return {
      success: true,
      data: response.data?.data || response.data,
    };
  } catch (error) {
    console.error('❌ [PaymentService] Failed to fetch payment details:', error);
    throw error;
  }
};

/**
 * Cancel payment
 * @param {string} paymentId - Payment ID
 * @returns {Promise<Object>} Cancellation response
 */
export const cancelPayment = async (paymentId) => {
  try {
    console.log('🚫 [PaymentService] Cancelling payment:', paymentId);

    const response = await apiClient.post(`/Payments/${paymentId}/cancel`);

    console.log('✅ [PaymentService] Payment cancelled:', response.data);

    return {
      success: true,
      data: response.data?.data || response.data,
    };
  } catch (error) {
    console.error('❌ [PaymentService] Failed to cancel payment:', error);
    throw error;
  }
};

/**
 * Simulate payment success for lab order (Testing only)
 * @param {string} labOrderId - Lab Order ID
 * @returns {Promise<Object>} Simulation response
 */
export const simulateLabOrderPaymentSuccess = async (labOrderId) => {
  try {
    console.log('🧪 [PaymentService] Simulating payment success for lab order:', labOrderId);

    const response = await apiClient.post(`/Payments/lab-orders/${labOrderId}/simulate-payment-success`);

    console.log('✅ [PaymentService] Payment simulation successful:', response.data);

    return {
      success: true,
      data: response.data?.data || response.data,
    };
  } catch (error) {
    console.error('❌ [PaymentService] Failed to simulate payment:', error);
    throw error;
  }
};

/**
 * Get payment status name in Arabic
 * @param {number} status - Payment status enum
 * @returns {string} Status name in Arabic
 */
export const getPaymentStatusName = (status) => {
  const statusMap = {
    [PaymentStatus.PENDING]: 'في الانتظار',
    [PaymentStatus.PROCESSING]: 'جاري المعالجة',
    [PaymentStatus.COMPLETED]: 'مكتمل',
    [PaymentStatus.FAILED]: 'فشل',
    [PaymentStatus.CANCELLED]: 'ملغي',
    [PaymentStatus.REFUNDED]: 'مسترد',
  };
  return statusMap[status] || 'غير معروف';
};

/**
 * Get payment method name in Arabic
 * @param {number} method - Payment method enum
 * @returns {string} Method name in Arabic
 */
export const getPaymentMethodName = (method) => {
  const methodMap = {
    [PaymentMethod.ONLINE]: 'دفع إلكتروني',
    [PaymentMethod.CASH_ON_DELIVERY]: 'دفع كاش',
  };
  return methodMap[method] || 'غير معروف';
};

/**
 * Get payment type name in Arabic
 * @param {number} type - Payment type enum
 * @returns {string} Type name in Arabic
 */
export const getPaymentTypeName = (type) => {
  const typeMap = {
    [PaymentType.CARD]: 'بطاقة ائتمان/خصم',
    [PaymentType.MOBILE_WALLET]: 'فودافون كاش',
  };
  return typeMap[type] || 'غير معروف';
};

const paymentService = {
  initiateAppointmentPayment,
  initiatePharmacyOrderPayment,
  initiateLabOrderPayment,
  getPaymentDetails,
  cancelPayment,
  simulateLabOrderPaymentSuccess,
  getPaymentStatusName,
  getPaymentMethodName,
  getPaymentTypeName,
  PaymentMethod,
  PaymentType,
  PaymentStatus,
};

export default paymentService;
