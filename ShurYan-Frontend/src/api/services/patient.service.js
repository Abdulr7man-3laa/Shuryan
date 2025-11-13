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

  // ==========================================
  // Patient Profile - Personal Info
  // ==========================================

  /**
   * Get patient personal information
   * GET /Patients/me/profile
   */
  async getPersonalInfo() {
    const response = await apiClient.get('/Patients/me/profile');
    return response.data?.data || null;
  }

  /**
   * Update patient personal information
   * PUT /Patients/me/profile
   * 
   * Supports:
   * - Upsert (create if not exists, update if exists)
   * - Partial update (update only sent fields)
   * 
   * @param {Object} data - Personal info data
   */
  async updatePersonalInfo(data) {
    console.log('📝 Updating personal info:', data);
    
    const response = await apiClient.put('/Patients/me/profile', data);
    console.log('✅ Personal info updated:', response.data);
    return response.data;
  }

  /**
   * Get patient address
   * GET /Patients/me/address
   */
  async getAddress() {
    const response = await apiClient.get('/Patients/me/address');
    return response.data?.data || null;
  }

  /**
   * Update patient address
   * PUT /Patients/me/address
   */
  async updateAddress(data) {
    console.log('📍 Updating address:', data);
    const response = await apiClient.put('/Patients/me/address', data);
    console.log('✅ Address updated:', response.data);
    return response.data;
  }

  /**
   * Update patient profile image
   * PUT /Patients/me/profile-image
   * 
   * @param {File} imageFile - Profile image file
   */
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

  /**
   * Get patient medical record
   * GET /Patients/me/medical-record
   */
  async getMedicalRecord() {
    const response = await apiClient.get('/Patients/me/medical-record');
    return response.data?.data || null;
  }

  /**
   * Update patient medical record
   * PUT /Patients/me/medical-record
   * 
   * Supports:
   * - Upsert (create if not exists, update if exists)
   * - Partial update (update only sent sections)
   * - Add/Edit/Delete items within sections
   * 
   * Update Logic:
   * - Item with id → Update existing
   * - Item without id → Add new
   * - Existing item not in request → Delete
   * 
   * @param {Object} data - Medical record data
   * @param {Array} data.drugAllergies - Optional
   * @param {Array} data.chronicDiseases - Optional
   * @param {Array} data.currentMedications - Optional
   * @param {Array} data.previousSurgeries - Optional
   */
  async updateMedicalRecord(data) {
    const response = await apiClient.put('/Patients/me/medical-record', data);
    return response.data;
  }

  /**
   * Get pharmacy response for patient's order
   * GET /api/patients/me/orders/{orderId}/pharmacy-response
   * @param {string} orderId - Order ID
   * @returns {Promise<Object|null>} Pharmacy response data or null
   */
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
  // Nearby Pharmacies
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
