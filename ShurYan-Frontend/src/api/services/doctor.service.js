import apiClient from '../client';

class DoctorService {
  async getProfile() {
    const response = await apiClient.get('/Doctors/profile/personal');
    return response.data;
  }

  async getVerificationStatus() {
    const response = await apiClient.get('/Doctors/me');
    return response.data?.data || response.data;
  }

  async updatePersonalInfo(data) {
    const response = await apiClient.put('/Doctors/profile/personal', {
      firstName: data.firstName,
      lastName: data.lastName,
      phoneNumber: data.phoneNumber || null,
      gender: data.gender || null,
      dateOfBirth: data.dateOfBirth || null,
      biography: data.biography || null,
    });
    return response.data;
  }

  async updateProfileImage(file) {
    const formData = new FormData();
    formData.append('profileImage', file);

    const response = await apiClient.put('/Doctors/me/profile-image', formData);
    return response.data;
  }

  async getProfessionalInfo() {
    const response = await apiClient.get('/Doctors/profile/professional');
    return response.data;
  }

  async updateProfessionalInfo(data) {
    const response = await apiClient.put('/Doctors/profile/professional', {
      specialty: data.specialty,
      experience: data.experience,
      education: data.education || null,
      professionalMemberships: data.professionalMemberships || null,
    });
    return response.data;
  }


  async getSpecialtyExperience() {
    const response = await apiClient.get('/Doctors/profile/specialty-experience');
    return response.data;
  }

  async updateSpecialtyExperience(data) {
    const response = await apiClient.put('/Doctors/profile/specialty-experience', {
      medicalSpecialty: data.medicalSpecialty,
      yearsOfExperience: data.yearsOfExperience,
    });
    return response.data;
  }

  async uploadRequiredDocument(file, type) {
    const formData = new FormData();
    formData.append('documentFile', file);
    formData.append('type', type.toString());

    const response = await apiClient.post('/Doctors/me/documents/required', formData);
    return response.data;
  }

  async uploadResearchDocument(file) {
    const formData = new FormData();
    formData.append('documentFile', file);
    formData.append('type', '7'); // PublishedResearch

    const response = await apiClient.post('/Doctors/me/documents/research', formData);
    return response.data;
  }

  async uploadAwardDocument(file) {
    const formData = new FormData();
    formData.append('documentFile', file);
    formData.append('type', '6'); // AwardsAndRecognitions

    const response = await apiClient.post('/Doctors/me/documents/awards', formData);
    return response.data;
  }

  async getProfessionalDocuments() {
    const response = await apiClient.get('/Doctors/profile/documents');
    return response.data;
  }

  async getRequiredDocuments() {
    const response = await apiClient.get('/Doctors/me/documents/required');
    return response.data;
  }

  async getResearchDocuments() {
    const response = await apiClient.get('/Doctors/me/documents/research');
    return response.data;
  }

  async getAwardDocuments() {
    const response = await apiClient.get('/Doctors/me/documents/awards');
    return response.data;
  }

  /**
   * Submit documents for verifier review
   * Changes document status from 'not_submitted' to 'pending'
   * @returns {Promise} Submission result
   */
  async submitDocumentsForReview() {
    const response = await apiClient.post('/Doctors/me/documents/submit-for-review');
    return response.data;
  }

  // ==================== Clinic Management ====================
  
  /**
   * Get clinic information
   * @returns {Promise} Clinic info (name, phones, services)
   */
  async getClinicInfo() {
    const response = await apiClient.get('/Doctors/me/clinic/info');
    return response.data;
  }

  /**
   * Update clinic information
   * @param {Object} data - Clinic info data
   * @param {string} data.clinicName - Clinic name
   * @param {Array<{number: string, type: number}>} data.phoneNumbers - Phone numbers array
   *   type: 0 = Mobile1, 1 = Mobile2, 2 = Landline
   * @param {Array<{id: number, label: string, value: string}>} data.services - Available services
   * @returns {Promise} Updated clinic info
   */
  async updateClinicInfo(data) {
    const response = await apiClient.put('/Doctors/me/clinic/info', {
      clinicName: data.clinicName,
      phoneNumbers: data.phoneNumbers || [],
      services: data.services || [],
    });
    return response.data;
  }

  /**
   * Get clinic address
   * @returns {Promise} Clinic address with coordinates
   */
  async getClinicAddress() {
    const response = await apiClient.get('/Doctors/me/clinic/address');
    console.log('📥 Service: Raw axios response:', response);
    console.log('📦 Service: response.data:', response.data);
    console.log('📍 Service: Coordinates in response.data:', {
      latitude: response.data?.data?.latitude,
      longitude: response.data?.data?.longitude,
      latType: typeof response.data?.data?.latitude,
      lngType: typeof response.data?.data?.longitude
    });
    return response.data;
  }

  /**
   * Update clinic address
   * @param {Object} data - Address data
   * @param {string} data.governorate - Governorate
   * @param {string} data.city - City
   * @param {string} data.street - Street
   * @param {string} data.buildingNumber - Building number
   * @param {number} data.latitude - Latitude coordinate
   * @param {number} data.longitude - Longitude coordinate
   * @returns {Promise} Updated address
   */
  async updateClinicAddress(data) {
    const response = await apiClient.put('/Doctors/me/clinic/address', {
      governorate: data.governorate,
      city: data.city,
      street: data.street,
      buildingNumber: data.buildingNumber,
      latitude: typeof data.latitude === 'number' ? data.latitude : (parseFloat(data.latitude) || null),
      longitude: typeof data.longitude === 'number' ? data.longitude : (parseFloat(data.longitude) || null),
    });
    return response.data;
  }

  /**
   * Get clinic images
   * @returns {Promise} Array of clinic images
   */
  async getClinicImages() {
    const response = await apiClient.get('/Doctors/me/clinic/images');
    return response.data;
  }

  /**
   * Upload clinic image
   * @param {File} file - Image file
   * @param {number} order - Display order (0-5)
   * @returns {Promise} Uploaded image data
   */
  async uploadClinicImage(file, order) {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('order', order.toString());

    const response = await apiClient.post('/Doctors/me/clinic/images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  /**
   * Delete clinic image
   * @param {string} imageId - Image ID to delete
   * @returns {Promise} Deletion confirmation
   */
  async deleteClinicImage(imageId) {
    const response = await apiClient.delete(`/Doctors/me/clinic/images/${imageId}`);
    return response.data;
  }

  // ==================== Services & Pricing ====================
  
  /**
   * Get regular checkup service
   * @returns {Promise} Regular checkup data (price, duration)
   */
  async getRegularCheckup() {
    const response = await apiClient.get('/Doctors/me/services/regular-checkup');
    return response.data;
  }

  /**
   * Update regular checkup service
   * @param {Object} data - Service data
   * @param {number} data.price - Service price in EGP
   * @param {number} data.duration - Session duration in minutes
   * @returns {Promise} Updated service data
   */
  async updateRegularCheckup(data) {
    const response = await apiClient.put('/Doctors/me/services/regular-checkup', {
      price: data.price,
      duration: data.duration,
    });
    return response.data;
  }

  /**
   * Get re-examination service
   * @returns {Promise} Re-examination data (price, duration)
   */
  async getReExamination() {
    const response = await apiClient.get('/Doctors/me/services/re-examination');
    return response.data;
  }

  /**
   * Update re-examination service
   * @param {Object} data - Service data
   * @param {number} data.price - Service price in EGP
   * @param {number} data.duration - Session duration in minutes
   * @returns {Promise} Updated service data
   */
  async updateReExamination(data) {
    const response = await apiClient.put('/Doctors/me/services/re-examination', {
      price: data.price,
      duration: data.duration,
    });
    return response.data;
  }

  // ==================== Appointment Settings ====================
  
  /**
   * Get weekly schedule
   * @returns {Promise} Weekly schedule data
   */
  async getWeeklySchedule() {
    const response = await apiClient.get('/Doctors/me/appointments/schedule');
    return response.data;
  }

  /**
   * Update weekly schedule
   * @param {Object} scheduleData - Weekly schedule data
   * @returns {Promise} Updated schedule
   */
  async updateWeeklySchedule(scheduleData) {
    const response = await apiClient.put('/Doctors/me/appointments/schedule', {
      weeklySchedule: scheduleData,
    });
    return response.data;
  }

  /**
   * Get exceptional dates
   * @returns {Promise} Exceptional dates array
   */
  async getExceptionalDates() {
    const response = await apiClient.get('/Doctors/me/appointments/exceptions');
    return response.data;
  }

  /**
   * Add exceptional date
   * @param {Object} exceptionData - Exception data
   * @param {string} exceptionData.date - Date in YYYY-MM-DD format
   * @param {string} exceptionData.fromTime - Start time
   * @param {string} exceptionData.toTime - End time
   * @param {string} exceptionData.fromPeriod - AM/PM
   * @param {string} exceptionData.toPeriod - AM/PM
   * @param {boolean} exceptionData.isClosed - Is closed day
   * @returns {Promise} Created exception
   */
  async addExceptionalDate(exceptionData) {
    const response = await apiClient.post('/Doctors/me/appointments/exceptions', exceptionData);
    return response.data;
  }

  /**
   * Remove exceptional date
   * @param {string|number} exceptionId - Exception ID
   * @returns {Promise} Deletion confirmation
   */
  async removeExceptionalDate(exceptionId) {
    const response = await apiClient.delete(`/Doctors/me/appointments/exceptions/${exceptionId}`);
    return response.data;
  }

  // ==================== Partner Suggestion ====================
  
  /**
   * Get current suggested partner
   * @returns {Promise} Suggested partner data
   */
  async getSuggestedPartner() {
    const response = await apiClient.get('/Doctors/me/partner/suggested');
    return response.data;
  }

  /**
   * Get available pharmacies with pagination
   * @param {number} pageNumber - Page number (default: 1)
   * @param {number} pageSize - Page size (default: 10)
   * @returns {Promise} Paginated array of available pharmacies
   */
  async getAvailablePharmacies(pageNumber = 1, pageSize = 10) {
    const response = await apiClient.get('/Doctors/me/partner/pharmacies', {
      params: { pageNumber, pageSize }
    });
    return response.data;
  }

  /**
   * Get available laboratories with pagination
   * @param {number} pageNumber - Page number (default: 1)
   * @param {number} pageSize - Page size (default: 10)
   * @returns {Promise} Paginated array of available laboratories
   */
  async getAvailableLaboratories(pageNumber = 1, pageSize = 10) {
    const response = await apiClient.get('/Doctors/me/partner/laboratories', {
      params: { pageNumber, pageSize }
    });
    return response.data;
  }

  /**
   * Suggest partners (pharmacy and/or laboratory)
   * Can suggest one or both independently
   * @param {Object} partnerData - Partner data
   * @param {string} [partnerData.pharmacyId] - Pharmacy ID (optional)
   * @param {string} [partnerData.laboratoryId] - Laboratory ID (optional)
   * @returns {Promise} Suggested partner data
   */
  async suggestPartner(partnerData) {
    const payload = {};
    if (partnerData.pharmacyId) payload.pharmacyId = partnerData.pharmacyId;
    if (partnerData.laboratoryId) payload.laboratoryId = partnerData.laboratoryId;
    
    const response = await apiClient.post('/Doctors/me/partner/suggest', payload);
    return response.data;
  }

  /**
   * Remove suggested partner
   * @returns {Promise} Deletion confirmation
   */
  async removeSuggestedPartner() {
    const response = await apiClient.delete('/Doctors/me/partner/suggested');
    return response.data;
  }

  // ==================== Dashboard APIs ====================

  /**
   * Get dashboard statistics
   * @returns {Promise<Object>} Dashboard stats
   */
  async getDashboardStats() {
    const response = await apiClient.get('/Doctors/me/dashboard/stats');
    return response.data;
  }

  /**
   * Get today's appointments for the logged-in doctor
   * @param {number} pageNumber - Page number (default: 1)
   * @param {number} pageSize - Page size (default: 10)
   * @returns {Promise<Object>} Today's appointments with pagination
   */
  async getTodayAppointments(params = {}) {
    const { pageNumber = 1, pageSize = 10, date } = params;
    
    // Get today's date in YYYY-MM-DD format if not provided
    const today = date || (() => {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    })();
    
    console.log('📅 Fetching appointments for date:', today);
    
    const response = await apiClient.get('/Doctors/me/dashboard/appointments/today', {
      params: { 
        pageNumber, 
        pageSize,
        date: today  // Send date to backend
      }
    });
    return response.data;
  }

  /**
   * Get ALL appointments (past, today, future)
   * @param {Object} params - Query parameters
   * @param {number} params.pageNumber - Page number (default: 1)
   * @param {number} params.pageSize - Page size (default: 50)
   * @param {string} params.startDate - Start date filter (YYYY-MM-DD) - Optional
   * @param {string} params.endDate - End date filter (YYYY-MM-DD) - Optional
   * @param {number} params.status - Status filter (0-5) - Optional
   * @param {string} params.sortBy - Sort by field - Optional
   * @param {string} params.sortOrder - Sort order (asc/desc) - Optional
   * @returns {Promise<Object>} All appointments with pagination
   */
  async getAllAppointments(params = {}) {
    const { 
      pageNumber = 1, 
      pageSize = 50,
      startDate = null,
      endDate = null,
      status = null,
      sortBy = 'appointmentDate',
      sortOrder = 'desc'
    } = params;
    
    const response = await apiClient.get('/Doctors/me/dashboard/appointments', {
      params: { 
        pageNumber, 
        pageSize,
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
        ...(status !== null && { status }),
        sortBy,
        sortOrder
      }
    });
    return response.data;
  }

  // ==================== Patients Management ====================

  /**
   * Get all patients who have completed appointments with the doctor
   * @param {Object} params - Query parameters
   * @param {number} params.pageNumber - Page number (default: 1)
   * @param {number} params.pageSize - Page size (default: 20)
   * @returns {Promise<Object>} Patients list with pagination
   */
  async getPatients(params = {}) {
    const { pageNumber = 1, pageSize = 20 } = params;
    const response = await apiClient.get('/Doctors/me/patients', {
      params: { pageNumber, pageSize }
    });
    return response.data;
  }

  async getPatientMedicalRecord(patientId) {
    const response = await apiClient.get(`/Doctors/me/patients/${patientId}/medical-record`);
    return response.data;
  }

  async getPatientSessionDocumentations(patientId) {
    const response = await apiClient.get(`/Doctors/me/patients/${patientId}/session-documentations`);
    return response.data;
  }

  async getPatientPrescriptions(patientId, doctorId) {
    const response = await apiClient.get(`/Prescriptions/patient/${patientId}/doctor/${doctorId}/list`);
    return response.data;
  }

  /**
   * Get prescription details
   * @param {string} patientId - Patient ID
   * @param {string} doctorId - Doctor ID
   * @param {string} prescriptionId - Prescription ID
   * @returns {Promise<Object>} Prescription details with medications
   */
  async getPrescriptionDetails(patientId, doctorId, prescriptionId) {
    const response = await apiClient.get(`/Prescriptions/patient/${patientId}/doctor/${doctorId}/prescription/${prescriptionId}`);
    return response.data;
  }

  // ==================== SESSION MANAGEMENT ====================

  async startSession(appointmentId) {
    const response = await apiClient.post(`/Appointments/${appointmentId}/start-session`);
    return response.data;
  }

  async getActiveSession(appointmentId) {
    const response = await apiClient.get(`/Appointments/${appointmentId}/session`);
    return response.data?.data || null;
  }

  async endSession(appointmentId) {
    const response = await apiClient.post(`/Appointments/${appointmentId}/end-session`);
    return response.data;
  }

  async getSessionDocumentation(appointmentId) {
    const response = await apiClient.get(`/Appointments/${appointmentId}/documentation`);
    return response.data;
  }

  async createPrescription(appointmentId, prescriptionData) {
    const response = await apiClient.post(`/Appointments/${appointmentId}/prescription`, prescriptionData);
    return response.data;
  }

  async getPrescription(appointmentId) {
    const response = await apiClient.get(`/Appointments/${appointmentId}/prescription`);
    return response.data;
  }

  async addSessionDocumentation(appointmentId, documentationData) {
    const response = await apiClient.post(`/Appointments/${appointmentId}/documentation`, documentationData);
    return response.data;
  }

  // ==================== Verification Endpoints ====================
  
  /**
   * Submit doctor profile for review
   * POST /api/Doctors/me/submit-for-review
   */
  async submitForReview() {
    const response = await apiClient.post('/Doctors/me/submit-for-review');
    return response.data;
  }
}

export default new DoctorService();
