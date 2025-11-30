import apiClient from '../client';

class PatientService {
  // ==========================================
  // Doctor Search & Details
  // ==========================================

  async getDoctorsList(params = {}) {
    const response = await apiClient.get('/Doctors/list', { params });
    return response.data;
  }

  async getDoctorDetails(doctorId) {
    const response = await apiClient.get(`/Doctors/${doctorId}/details`);
    return response.data;
  }

  async getDoctorReviews(doctorId, params = {}) {
    const response = await apiClient.get(`/Doctors/${doctorId}/reviews`, { params });
    return response.data?.data || null;
  }

  // ==========================================
  // Patient Profile - Personal Info
  // ==========================================

  async getPersonalInfo() {
    const response = await apiClient.get('/Patients/me/profile');
    return response.data?.data || null;
  }

  async updatePersonalInfo(data) {
    console.log('📝 Updating personal info:', data);

    const response = await apiClient.put('/Patients/me/profile', data);
    console.log('✅ Personal info updated:', response.data);
    return response.data;
  }

  async getAddress() {
    const response = await apiClient.get('/Patients/me/address');
    return response.data?.data || null;
  }

  async updateAddress(data) {
    console.log('📍 Updating address:', {
      ...data,
      governorateType: typeof data.governorate,
      governorateValue: data.governorate,
    });
    const response = await apiClient.put('/Patients/me/address', data);
    console.log('✅ Address updated:', response.data);
    return response.data;
  }

  async updateProfileImage(imageFile) {
    console.log('🖼️ Updating profile image:', imageFile?.name);

    const formData = new FormData();
    formData.append('profileImage', imageFile);

    const response = await apiClient.put('/Patients/me/profile-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    console.log('✅ Profile image updated:', response.data);
    return response.data;
  }

  // ==========================================
  // Patient Medical Record
  // ==========================================

  async getMedicalRecord() {
    const response = await apiClient.get('/Patients/me/medical-record');
    return response.data?.data || null;
  }

  async updateMedicalRecord(data) {
    const response = await apiClient.put('/Patients/me/medical-record', data);
    return response.data;
  }

  async getPharmacyResponse(orderId) {
    try {
      console.log(`📋 Fetching pharmacy response for order: ${orderId}`);
      const response = await apiClient.get(`/patients/me/orders/${orderId}/pharmacy-response`);
      console.log('✅ Pharmacy response fetched:', response.data?.data);
      return response.data?.data || null;
    } catch (error) {
      console.error('❌ Error fetching pharmacy response:', error);
      throw error;
    }
  }

  async confirmPharmacyOrder(orderId, paymentData) {
    try {
      console.log('🧾 Confirming pharmacy order:', { orderId, hasPaymentData: !!paymentData });

      const response = await apiClient.put(`/patients/me/orders/${orderId}/confirm`);

      console.log('✅ Order confirmed:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error confirming pharmacy order:', error);
      throw error;
    }
  }

  /**
   * Get all pharmacy responses for a prescription
   * GET /api/Patients/me/prescriptions/{prescriptionId}/pharmacy-responses
   * @param {string} prescriptionId - Prescription ID
   * @returns {Promise<Object|null>} All pharmacy responses for the prescription
   */
  async getPrescriptionPharmacyResponses(prescriptionId) {
    try {
      console.log(`📋 Fetching pharmacy responses for prescription: ${prescriptionId}`);

      // Try the correct endpoint path (with capital P in Patients)
      const response = await apiClient.get(`/Patients/me/prescriptions/${prescriptionId}/pharmacy-responses`);

      console.log('✅ Raw API response:', response.data);
      console.log('✅ Response structure check:', {
        hasData: !!response.data,
        hasPrescriptionId: !!response.data?.prescriptionId,
        hasPharmacyResponses: !!response.data?.pharmacyResponses,
        pharmacyResponsesLength: response.data?.pharmacyResponses?.length || 0
      });

      // The API returns data directly, not wrapped in a data field
      if (response.data && response.data.prescriptionId) {
        console.log('✅ Valid prescription pharmacy response found');
        return response.data;
      } else {
        console.warn('⚠️ API response does not contain expected prescription data');
        return null;
      }
    } catch (error) {
      console.error('❌ Error fetching prescription pharmacy responses:', error);
      console.error('❌ Error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      });
      throw error;
    }
  }

  // ==========================================
  // Patient Appointments
  // ==========================================

  async getUpcomingAppointments() {
    const response = await apiClient.get('/Patients/me/appointments/upcoming');
    console.log('📅 Upcoming appointments response:', response.data);
    return response.data?.data || response.data || [];
  }

  async getPastAppointments() {
    const response = await apiClient.get('/Patients/me/appointments/past');
    console.log('📅 Past appointments response:', response.data);
    return response.data?.data || response.data || [];
  }

  async getAppointmentDetails(appointmentId) {
    const response = await apiClient.get(`/Appointments/${appointmentId}`);
    return response.data?.data || null;
  }

  async cancelAppointment(appointmentId, cancellationReason) {
    const body = cancellationReason ? { cancellationReason } : {};

    const response = await apiClient.patch(
      `/Patients/me/appointments/${appointmentId}/cancel`,
      body
    );
    return response.data;
  }


  async rescheduleAppointment(appointmentId, data) {
    const response = await apiClient.patch(
      `/Patients/me/appointments/${appointmentId}/reschedule`,
      data
    );
    return response.data;
  }

  // ==========================================
  // Nearby Pharmacies & Laboratories
  // ==========================================

  async getNearbyPharmacies() {
    try {
      const response = await apiClient.get('/Patients/nearby-pharmacies');

      // Extract nearbyPharmacies array from response
      const pharmacies = response.data?.nearbyPharmacies || response.data?.data || response.data || [];
      const safePharmacies = Array.isArray(pharmacies) ? pharmacies : [];

      return safePharmacies;
    }
    catch (error) {
      console.error('Error fetching nearby pharmacies:', error);
      throw error;
    }
  }

  /**
   * Get nearby laboratories for the current patient
   * GET /Patients/me/laboratories/nearby
   * @param {Object} params - Query parameters
   * @param {number} params.latitude - Patient latitude
   * @param {number} params.longitude - Patient longitude
   * @param {number} params.radiusInKm - Search radius in kilometers (default: 10)
   * @param {boolean} params.offersHomeSampleCollection - Filter by home collection service
   * @param {string} params.search - Search term
   * @param {number} params.pageNumber - Page number (default: 1)
   * @param {number} params.pageSize - Page size (default: 20)
   * @returns {Promise<Object>} Object with nearbyLaboratories, totalFound, searchRadiusKm
   */
  async getNearbyLaboratories(params = {}) {
    try {
      console.log('🔍 Fetching nearby laboratories with params:', params);
      const response = await apiClient.get('/Patients/me/laboratories/nearby', { params });

      // Response comes directly in response.data (not nested in response.data.data)
      const data = response.data || {};

      console.log('📦 Raw response:', data);
      console.log(`✅ Found ${data.totalFound || 0} laboratories within ${data.searchRadiusKm || 0}km`);

      return data;
    } catch (error) {
      console.error('❌ Error fetching nearby laboratories:', error);
      throw error;
    }
  }

  /**
   * Create lab order (send lab prescription to laboratory)
   * POST /Patients/me/lab-orders
   * @param {Object} orderData - Order data
   * @param {string} orderData.labPrescriptionId - Lab prescription ID
   * @param {string} orderData.laboratoryId - Laboratory ID
   * @param {number} orderData.sampleCollectionType - 1: Lab Visit, 2: Home Collection
   * @returns {Promise<Object>} Created order details
   */
  async createLabOrder(orderData) {
    try {
      console.log('📝 Creating lab order:', orderData);
      const response = await apiClient.post('/Patients/me/lab-orders', orderData);
      const order = response.data?.data || {};
      console.log('✅ Lab order created successfully:', order);
      return order;
    } catch (error) {
      console.error('❌ Error creating lab order:', error);
      throw error;
    }
  }

  // ==========================================
  // Send Prescription to Pharmacy
  // ==========================================

  /**
   * Send prescription to selected pharmacy
   * POST /api/patients/me/prescriptions/{prescriptionId}/send-to-pharmacy
   * @param {string} prescriptionId - UUID of the prescription
   * @param {string} pharmacyId - UUID of the selected pharmacy
   * @returns {Promise<Object>} Send result
   */
  async sendPrescriptionToPharmacy(prescriptionId, pharmacyId) {
    try {
      console.log(`📤 Sending prescription ${prescriptionId} to pharmacy ${pharmacyId}...`);

      const response = await apiClient.post(
        `/Patients/me/prescriptions/${prescriptionId}/send-to-pharmacy`,
        { pharmacyId }
      );

      console.log('✅ Prescription sent successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error sending prescription to pharmacy:', error);
      throw error;
    }
  }


  /**
   * Get all prescriptions for current patient
   * GET /Patients/me/prescriptions/list
   * @returns {Promise<Array>} List of all patient prescriptions from all doctors
   */
  async getMyPrescriptions() {
    try {
      console.log('💊 Fetching patient prescriptions list...');
      const response = await apiClient.get('/Patients/me/prescriptions/list');
      console.log('✅ Prescriptions list:', response.data);
      return response.data || [];
    } catch (error) {
      console.error('❌ Error fetching prescriptions:', error);
      throw error;
    }
  }

  /**
   * Get prescription details for a specific appointment
   * GET /api/prescriptions/patient/{patientId}/doctor/{doctorId}/prescription/{prescriptionId}
   * 
   * @param {string} patientId - Patient ID
   * @param {string} doctorId - Doctor ID
   * @param {string} prescriptionId - Prescription ID
   * @returns {Promise<Object>} Prescription details with medications
   */
  async getPrescriptionDetails(patientId, doctorId, prescriptionId) {
    try {
      console.log('💊 Fetching prescription details:', { patientId, doctorId, prescriptionId });

      const response = await apiClient.get(
        `/prescriptions/patient/${patientId}/doctor/${doctorId}/prescription/${prescriptionId}`
      );

      console.log('✅ Prescription details:', response.data);

      // Extract data from wrapper
      return {
        success: true,
        data: response.data?.data || response.data,
      };
    } catch (error) {
      console.error('❌ Error fetching prescription:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'فشل تحميل الروشتة',
      };
    }
  }

  async getPrescriptionByAppointment(appointmentId) {
    try {

      const response = await apiClient.get(`/Appointments/${appointmentId}/prescription`);
      return {
        success: true,
        data: response.data?.data || response.data,
      };
    } catch (error) {
      // 404 means no prescription exists
      if (error.response?.status === 404) {
        console.log('No prescription found for appointment');
        return {
          success: true,
          data: null,
        };
      }

      console.error('❌ Error fetching prescription:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'فشل تحميل الروشتة',
      };
    }
  }

  // ==========================================
  // Lab Results
  // ==========================================

  /**
   * Get all lab results for current patient
   * GET /Patients/me/lab-results/list
   * @returns {Promise<Array>} List of all patient lab results from all doctors
   */
  async getMyLabResults() {
    try {
      console.log('🔬 Fetching patient lab results list...');
      const response = await apiClient.get('/Patients/me/lab-results/list');
      console.log('✅ Lab results list:', response.data);
      return response.data || [];
    } catch (error) {
      console.error('❌ Error fetching lab results:', error);
      throw error;
    }
  }

  /**
   * Get lab result details
   * GET /lab-results/patient/{patientId}/doctor/{doctorId}/lab-result/{labResultId}
   * 
   * @param {string} patientId - Patient ID
   * @param {string} doctorId - Doctor ID
   * @param {string} labResultId - Lab Result ID
   * @returns {Promise<Object>} Lab result details with tests
   */
  async getLabResultDetails(patientId, doctorId, labResultId) {
    try {
      console.log('🔬 Fetching lab result details:', { patientId, doctorId, labResultId });

      const response = await apiClient.get(
        `/lab-results/patient/${patientId}/doctor/${doctorId}/lab-result/${labResultId}`
      );

      console.log('✅ Lab result details:', response.data);

      // Extract data from wrapper
      return {
        success: true,
        data: response.data?.data || response.data,
      };
    } catch (error) {
      console.error('❌ Error fetching lab result:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'فشل تحميل نتيجة التحليل',
      };
    }
  }

  /**
   * Get all laboratory responses for a lab result
   * GET /Patients/me/lab-results/{labResultId}/laboratory-responses
   * @param {string} labResultId - Lab Result ID
   * @returns {Promise<Object|null>} All laboratory responses for the lab result
   */
  async getLabResultLaboratoryResponses(labResultId) {
    try {
      console.log(`📋 Fetching laboratory responses for lab result: ${labResultId}`);

      const response = await apiClient.get(`/Patients/me/lab-results/${labResultId}/laboratory-responses`);

      console.log('✅ Raw API response:', response.data);
      console.log('✅ Response structure check:', {
        hasData: !!response.data,
        hasLabResultId: !!response.data?.labResultId,
        hasLaboratoryResponses: !!response.data?.laboratoryResponses,
        laboratoryResponsesLength: response.data?.laboratoryResponses?.length || 0
      });

      // The API returns data directly, not wrapped in a data field
      if (response.data && response.data.labResultId) {
        console.log('✅ Valid lab result laboratory response found');
        return response.data;
      } else {
        console.warn('⚠️ API response does not contain expected lab result data');
        return null;
      }
    } catch (error) {
      console.error('❌ Error fetching lab result laboratory responses:', error);
      console.error('❌ Error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      });
      throw error;
    }
  }

  /**
   * Send lab result to selected laboratory
   * POST /Patients/me/lab-results/{labResultId}/send-to-laboratory
   * @param {string} labResultId - UUID of the lab result
   * @param {string} laboratoryId - UUID of the selected laboratory
   * @returns {Promise<Object>} Send result
   */
  async sendLabResultToLaboratory(labResultId, laboratoryId) {
    try {
      console.log(`📤 Sending lab result ${labResultId} to laboratory ${laboratoryId}...`);

      const response = await apiClient.post(
        `/Patients/me/lab-results/${labResultId}/send-to-laboratory`,
        { laboratoryId }
      );

      console.log('✅ Lab result sent successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error sending lab result to laboratory:', error);
      throw error;
    }
  }

  /**
   * Get laboratory response for patient's lab order
   * GET /patients/me/lab-orders/{orderId}/laboratory-response
   * @param {string} orderId - Lab Order ID
   * @returns {Promise<Object|null>} Laboratory response data or null
   */
  async getLaboratoryResponse(orderId) {
    try {
      console.log(`📋 Fetching laboratory response for order: ${orderId}`);
      const response = await apiClient.get(`/patients/me/lab-orders/${orderId}/laboratory-response`);
      console.log('✅ Laboratory response fetched:', response.data?.data);
      return response.data?.data || null;
    } catch (error) {
      console.error('❌ Error fetching laboratory response:', error);
      throw error;
    }
  }

  /**
   * Confirm laboratory order
   * PUT /patients/me/lab-orders/{orderId}/confirm
   * @param {string} orderId - Lab Order ID
   * @returns {Promise<Object>} Confirmation result
   */
  async confirmLaboratoryOrder(orderId) {
    try {
      console.log('🧾 Confirming laboratory order:', { orderId });

      const response = await apiClient.put(`/patients/me/lab-orders/${orderId}/confirm`);

      console.log('✅ Lab order confirmed:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error confirming laboratory order:', error);
      throw error;
    }
  }

  // ==========================================
  // Doctor Rating
  // ==========================================

  /**
   * Submit rating for doctor and session
   * POST /patients/me/reviews
   * 
   * @param {Object} data - Rating data
   * @param {string} data.appointmentId - Appointment ID
   * @param {number} data.overallSatisfaction - 1-5
   * @param {number} data.waitingTime - 1-5
   * @param {number} data.communicationQuality - 1-5
   * @param {number} data.clinicCleanliness - 1-5
   * @param {number} data.valueForMoney - 1-5
   * @param {string?} data.comment - Optional comment (max 500 chars)
   * @param {boolean} data.isAnonymous - Anonymous flag
   * @returns {Promise<Object>} Rating response
   */
  async submitDoctorRating(data) {
    try {
      console.log('⭐ Submitting doctor rating:', data);

      const response = await apiClient.post(
        '/patients/me/reviews',
        {
          appointmentId: data.appointmentId,
          overallSatisfaction: data.overallSatisfaction,
          waitingTime: data.waitingTime,
          communicationQuality: data.communicationQuality,
          clinicCleanliness: data.clinicCleanliness,
          valueForMoney: data.valueForMoney,
          comment: data.comment || null,
          isAnonymous: data.isAnonymous || false,
        }
      );

      console.log('✅ Rating submitted successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error submitting rating:', error);
      throw error;
    }
  }

  // ==========================================
  // ==========================================
  // Lab Prescriptions
  // ==========================================

  /**
   * Get all lab prescriptions for the current patient
   * GET /Patients/me/lab-prescriptions
   * @returns {Promise<Array>} Array of lab prescriptions
   */
  async getLabPrescriptions() {
    try {
      console.log('🔬 Fetching patient lab prescriptions...');
      const response = await apiClient.get('/Patients/me/lab-prescriptions');
      const prescriptions = response.data?.data || [];
      console.log(`✅ Fetched ${prescriptions.length} lab prescriptions`);
      return prescriptions;
    } catch (error) {
      console.error('❌ Error fetching lab prescriptions:', error);
      throw error;
    }
  }

  /**
   * Get all lab orders for the current patient
   * GET /Patients/me/lab-orders
   * @returns {Promise<Array>} Array of lab orders
   */
  async getMyLabOrders() {
    try {
      console.log('🔬 Fetching patient lab orders...');
      const response = await apiClient.get('/Patients/me/lab-orders');
      const orders = response.data?.data || [];
      console.log(`✅ Fetched ${orders.length} lab orders`);
      return orders;
    } catch (error) {
      console.error('❌ Error fetching lab orders:', error);
      throw error;
    }
  }

  /**
   * Get active lab orders for the current patient
   * GET /Patients/me/lab-orders/active
   * @returns {Promise<Array>} Array of active lab orders
   */
  async getActiveLabOrders() {
    try {
      console.log('🔬 Fetching active lab orders...');
      const response = await apiClient.get('/Patients/me/lab-orders/active');
      const orders = response.data?.data || [];
      console.log(`✅ Fetched ${orders.length} active lab orders`);
      return orders;
    } catch (error) {
      console.error('❌ Error fetching active lab orders:', error);
      throw error;
    }
  }

  /**
   * Get completed lab orders for the current patient
   * GET /Patients/me/lab-orders/completed
   * @returns {Promise<Array>} Array of completed lab orders
   */
  async getCompletedLabOrders() {
    try {
      console.log('🔬 Fetching completed lab orders...');
      const response = await apiClient.get('/Patients/me/lab-orders/completed');
      const orders = response.data?.data || [];
      console.log(`✅ Fetched ${orders.length} completed lab orders`);
      return orders;
    } catch (error) {
      console.error('❌ Error fetching completed lab orders:', error);
      throw error;
    }
  }


  // ==========================================
  // Aliases for backward compatibility
  // ==========================================

  /**
   * Alias for getPrescriptionPharmacyResponses
   * @param {string} prescriptionId - Prescription ID
   * @returns {Promise<Object|null>} All pharmacy responses for the prescription
   */
  async getPharmacyReports(prescriptionId) {
    return this.getPrescriptionPharmacyResponses(prescriptionId);
  }
}

export default new PatientService();
