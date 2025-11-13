import apiClient from '../client';

/**
 * Verifier Service
 * Handles all verification-related API calls for admin/verifier role
 * 
 * ⚠️ IMPORTANT - Authorization:
 * - All endpoints in this service require ADMIN/VERIFIER role
 * - These endpoints will NOT work with Doctor token
 * - Doctor can only use: POST /api/Doctors/me/submit-for-review (in doctor.service.js)
 * 
 * Endpoints Summary:
 * - 4 GET endpoints: Fetch doctors by status (sent, under-review, verified, rejected)
 * - 3 POST endpoints: Change doctor status (start-review, verify, reject)
 */
class VerifierService {
  // ==================== GET Endpoints - Fetch Doctors by Status ====================

  /**
   * Get doctors with "Sent" status (waiting for review)
   * GET /api/Doctors/status/sent
   * @param {number} pageNumber - Page number (default: 1)
   * @param {number} pageSize - Page size (default: 10)
   * @returns {Promise<Object>} Paginated list of doctors
   */
  async getDoctorsWithSentStatus(pageNumber = 1, pageSize = 10) {
    const response = await apiClient.get('/Verifier/doctors/status/sent', {
      params: { pageNumber, pageSize }
    });
    console.log('📥 [Verifier Service] Full response:', response.data);
    console.log('📦 [Verifier Service] Pagination object:', response.data?.data);
    console.log('📋 [Verifier Service] Doctors array:', response.data?.data?.data);
    // response.data.data.data contains the actual doctors array
    return response.data?.data || { data: [], totalCount: 0 };
  }

  /**
   * Get doctors under review
   * GET /api/Doctors/status/under-review
   * @param {number} pageNumber - Page number (default: 1)
   * @param {number} pageSize - Page size (default: 10)
   * @returns {Promise<Object>} Paginated list of doctors
   */
  async getDoctorsUnderReview(pageNumber = 1, pageSize = 10) {
    const response = await apiClient.get('/Verifier/doctors/status/under-review', {
      params: { pageNumber, pageSize }
    });
    console.log('📥 [Verifier Service] Under review response:', response.data);
    console.log('📋 [Verifier Service] Doctors array:', response.data?.data?.data);
    return response.data?.data || { data: [], totalCount: 0 };
  }

  /**
   * Get verified doctors (verified by current verifier only)
   * GET /api/Doctors/status/verified
   * ⚠️ Returns only doctors verified by the logged-in verifier
   * @param {number} pageNumber - Page number (default: 1)
   * @param {number} pageSize - Page size (default: 10)
   * @returns {Promise<Object>} Paginated list of doctors verified by current verifier
   */
  async getVerifiedDoctors(pageNumber = 1, pageSize = 10) {
    const response = await apiClient.get('/Verifier/doctors/status/verified', {
      params: { pageNumber, pageSize }
    });
    console.log('📥 [Verifier Service] Verified response:', response.data);
    console.log('📋 [Verifier Service] Doctors array:', response.data?.data?.data);
    return response.data?.data || { data: [], totalCount: 0 };
  }

  /**
   * Get rejected doctors
   * GET /api/Doctors/status/rejected
   * @param {number} pageNumber - Page number (default: 1)
   * @param {number} pageSize - Page size (default: 10)
   * @returns {Promise<Object>} Paginated list of doctors
   */
  async getRejectedDoctors(pageNumber = 1, pageSize = 10) {
    const response = await apiClient.get('/Verifier/doctors/status/rejected', {
      params: { pageNumber, pageSize }
    });
    console.log('📥 [Verifier Service] Rejected response:', response.data);
    console.log('📋 [Verifier Service] Doctors array:', response.data?.data?.data);
    return response.data?.data || { data: [], totalCount: 0 };
  }

  // ==================== POST Endpoints - Change Doctor Status (Verifier Only) ====================

  /**
   * Start review for a doctor (change status to UnderReview)
   * POST /api/Doctors/{doctorId}/start-review
   * @param {string} doctorId - Doctor ID
   * @returns {Promise<Object>} Response with updated status
   */
  async startReview(doctorId) {
    const response = await apiClient.post(`/Verifier/doctors/${doctorId}/start-review`);
    console.log('🔄 [Verifier Service] Start review response:', response.data);
    return response.data;
  }

  /**
   * Verify/Approve a doctor (change status to Verified)
   * POST /api/Verifier/doctors/{doctorId}/verify
   * Response: { isSuccess, message, data: "string", errors, statusCode }
   * @param {string} doctorId - Doctor ID (UUID)
   * @returns {Promise<Object>} Response with success message
   */
  async verifyDoctor(doctorId) {
    const response = await apiClient.post(`/Verifier/doctors/${doctorId}/verify`);
    console.log('✅ [Verifier Service] Verify doctor response:', response.data);
    return response.data;
  }

  /**
   * Reject a doctor (change status to Rejected)
   * POST /api/Doctors/{doctorId}/reject
   * @param {string} doctorId - Doctor ID
   * @returns {Promise<Object>} Response with updated status
   */
  async rejectDoctor(doctorId) {
    const response = await apiClient.post(`/Verifier/doctors/${doctorId}/reject`);
    console.log('❌ [Verifier Service] Reject doctor response:', response.data);
    return response.data;
  }

  // ==================== Document Management ====================

  /**
   * Get doctor's documents
   * GET /api/Verifier/doctors/{doctorId}/documents
   * @param {string} doctorId - Doctor ID
   * @returns {Promise<Array>} List of doctor's documents
   */
  async getDoctorDocuments(doctorId) {
    const response = await apiClient.get(`/Verifier/doctors/${doctorId}/documents`);
    console.log('📄 [Verifier Service] Doctor documents response:', response.data);
    return response.data?.data || [];
  }

  /**
   * Approve a document
   * POST /api/Verifier/documents/{documentId}/approve
   * @param {string} documentId - Document ID
   * @returns {Promise<Object>} Response with success message
   */
  async approveDocument(documentId) {
    const response = await apiClient.post(`/Verifier/documents/${documentId}/approve`);
    console.log('✅ [Verifier Service] Approve document response:', response.data);
    return response.data;
  }

  /**
   * Reject a document
   * POST /api/Verifier/documents/{documentId}/reject
   * @param {string} documentId - Document ID
   * @param {string} rejectionReason - Optional rejection reason
   * @returns {Promise<Object>} Response with success message
   */
  async rejectDocument(documentId, rejectionReason = null) {
    const body = rejectionReason ? { rejectionReason } : {};
    const response = await apiClient.post(`/Verifier/documents/${documentId}/reject`, body);
    console.log('❌ [Verifier Service] Reject document response:', response.data);
    return response.data;
  }

  // ==================== Helper Methods ====================

  /**
   * Get all doctors by status (generic method)
   * @param {string} status - Status: 'sent', 'under-review', 'verified', 'rejected'
   * @param {number} pageNumber - Page number
   * @param {number} pageSize - Page size
   * @returns {Promise<Object>} Paginated list of doctors
   */
  async getDoctorsByStatus(status, pageNumber = 1, pageSize = 10) {
    switch (status) {
      case 'sent':
        return this.getDoctorsWithSentStatus(pageNumber, pageSize);
      case 'under-review':
        return this.getDoctorsUnderReview(pageNumber, pageSize);
      case 'verified':
        return this.getVerifiedDoctors(pageNumber, pageSize);
      case 'rejected':
        return this.getRejectedDoctors(pageNumber, pageSize);
      default:
        throw new Error(`Invalid status: ${status}`);
    }
  }
}

export default new VerifierService();
