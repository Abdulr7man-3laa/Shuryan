import apiClient from '../client';

/**
 * Session Service
 * Handles all session-related API calls
 * Clean separation of concerns
 */
class SessionService {
  /**
   * Start a new consultation session
   * @param {string} appointmentId - Appointment ID
   * @returns {Promise<Object>} Session data
   * 
   * Note: API returns 200 OK even if session already exists!
   */
  async startSession(appointmentId) {
    try {
      console.log('🔵 Starting session for appointment:', appointmentId);
      const response = await apiClient.post(`/Appointments/${appointmentId}/start-session`);

      console.log('🔵 Start Session Response:', response.data);

      // API always returns 200 OK (even if session exists)
      if (response.data?.isSuccess) {
        console.log('✅ Session started successfully:', response.data.message);
        return {
          success: true,
          data: response.data.data,
          message: response.data.message,
        };
      }

      console.log('⚠️ Session start failed (isSuccess=false):', response.data);
      return {
        success: false,
        error: response.data?.message || 'فشل بدء الجلسة',
      };
    } catch (error) {
      console.log('🔴 Start Session Error:', error);
      console.log('🔴 Error Response:', error.response?.data);
      return {
        success: false,
        error: this._extractError(error),
      };
    }
  }

  /**
   * Get doctor's active session (any appointment)
   * @returns {Promise<Object>} Active session data or null
   */
  async getDoctorActiveSession() {
    try {
      console.log('🔵 Checking for doctor active session...');
      const response = await apiClient.get('/Doctors/me/sessions/active');

      console.log('🔵 Doctor Active Session Response:', response.data);

      if (response.data?.isSuccess) {
        const sessionData = response.data.data;

        console.log('🔍 Session Data:', sessionData);
        console.log('🔍 Session Status:', sessionData?.status, 'Type:', typeof sessionData?.status);

        // Status can be: 3 (InProgress) or 'InProgress' string
        const isInProgress = sessionData?.status === 3 || sessionData?.status === 'InProgress';

        if (sessionData && isInProgress) {
          console.log('✅ Found active InProgress session');
          console.log('✅ Appointment ID:', sessionData.appointmentId);
          console.log('✅ Patient Name:', sessionData.patientName);

          return {
            success: true,
            data: {
              ...sessionData,
              // Ensure appointmentId is available
              appointmentId: sessionData.appointmentId || sessionData.id,
            },
            isActive: true,
          };
        } else {
          console.log('ℹ️ Session exists but not InProgress (status:', sessionData?.status, ')');
        }
      }

      return {
        success: true,
        data: null,
        isActive: false,
      };
    } catch (error) {
      // 404 means no active session - not an error
      if (error.response?.status === 404) {
        console.log('✅ No active session found (404)');
        return {
          success: true,
          data: null,
          isActive: false,
        };
      }

      console.error('❌ Error checking active session:', error);
      console.error('❌ Error response:', error.response?.data);
      return {
        success: false,
        error: this._extractError(error),
      };
    }
  }

  /**
   * Get session for appointment (active or completed)
   * @param {string} appointmentId - Appointment ID
   * @returns {Promise<Object>} Session data or null
   */
  async getActiveSession(appointmentId) {
    try {
      const response = await apiClient.get(`/Appointments/${appointmentId}/session`);

      if (response.data?.isSuccess) {
        const sessionData = response.data.data;

        if (sessionData) {
          // Check if session is in progress
          const isActive = sessionData.status === 'InProgress';

          console.log(`📊 Session status: ${sessionData.status}, isActive: ${isActive}`);

          return {
            success: true,
            data: sessionData,
            isActive: isActive,
            isCompleted: sessionData.status === 'Completed',
          };
        }
      }

      return {
        success: true,
        data: null,
        isActive: false,
      };
    } catch (error) {
      // 404 means no session - not an error
      if (error.response?.status === 404) {
        return {
          success: true,
          data: null,
          isActive: false,
        };
      }

      return {
        success: false,
        error: this._extractError(error),
      };
    }
  }

  /**
   * End current session
   * @param {string} appointmentId - Appointment ID
   * @returns {Promise<Object>} Success response
   */
  async endSession(appointmentId) {
    try {
      console.log('🔴 Ending session for appointment:', appointmentId);
      const response = await apiClient.post(`/Appointments/${appointmentId}/end-session`);
      console.log('📥 End session response:', response.data);

      if (response.data?.isSuccess) {
        console.log('✅ Session ended successfully');
        return {
          success: true,
          data: response.data.data,
          message: response.data.message,
        };
      }

      console.warn('⚠️ Session end failed:', response.data?.message);
      return {
        success: false,
        error: response.data?.message || 'فشل إنهاء الجلسة',
      };
    } catch (error) {
      console.error('❌ Error ending session:', error);
      return {
        success: false,
        error: this._extractError(error),
      };
    }
  }

  /**
   * Get session documentation
   * @param {string} appointmentId - Appointment ID
   * @returns {Promise<Object>} Documentation data
   */
  async getSessionDocumentation(appointmentId) {
    try {
      const response = await apiClient.get(`/Appointments/${appointmentId}/documentation`);
      return {
        success: true,
        data: response.data?.data || response.data,
      };
    } catch (error) {
      return {
        success: false,
        error: this._extractError(error),
      };
    }
  }

  /**
   * Save/Update session documentation (Upsert)
   * POST if new, PUT if exists
   * @param {string} appointmentId - Appointment ID
   * @param {Object} documentationData - Documentation data
   * @param {boolean} isUpdate - Whether to update existing documentation
   * @returns {Promise<Object>} Created/Updated documentation
   */
  async addSessionDocumentation(appointmentId, documentationData, isUpdate = false) {
    try {
      console.log(`📝 ${isUpdate ? 'Updating' : 'Creating'} documentation for appointment:`, appointmentId);
      console.log('📝 Documentation data:', documentationData);

      // ✅ Ensure sessionType is included (required by backend)
      // sessionType: 1 = كشف عادي (RegularCheckup), 2 = متابعة (ReExamination)
      const payload = {
        ...documentationData,
        sessionType: documentationData.sessionType || 1, // Default to RegularCheckup if not provided
      };

      console.log('📤 Sending payload with sessionType:', payload);

      const response = isUpdate
        ? await apiClient.put(`/Appointments/${appointmentId}/documentation`, payload)
        : await apiClient.post(`/Appointments/${appointmentId}/documentation`, payload);

      console.log('✅ Documentation saved:', response.data);

      return {
        success: true,
        data: response.data?.data || response.data,
        message: response.data?.message,
      };
    } catch (error) {
      console.error('❌ Error saving documentation:', error);
      return {
        success: false,
        error: this._extractError(error),
      };
    }
  }

  /**
   * Create prescription for session
   * POST /Prescriptions
   * @param {Object} prescriptionData - Prescription data
   * @param {string} prescriptionData.appointmentId - Appointment ID
   * @param {string} prescriptionData.doctorId - Doctor ID
   * @param {string} prescriptionData.patientId - Patient ID
   * @param {Array} prescriptionData.medications - Array of medications
   * @returns {Promise<Object>} Created prescription
   */
  async createPrescription(prescriptionData) {
    try {
      console.log('💊 Creating prescription:', prescriptionData);

      // Validate medications array
      if (!prescriptionData.medications || !Array.isArray(prescriptionData.medications)) {
        console.error('❌ Invalid medications data:', prescriptionData.medications);
        return {
          success: false,
          error: 'قائمة الأدوية غير صحيحة',
        };
      }

      if (prescriptionData.medications.length === 0) {
        return {
          success: false,
          error: 'يرجى إضافة دواء واحد على الأقل',
        };
      }

      // Transform medications to match API structure
      const requestBody = {
        appointmentId: prescriptionData.appointmentId,
        doctorId: prescriptionData.doctorId,
        patientId: prescriptionData.patientId,
        // Backend requires these fields with specific length constraints
        prescriptionNumber: prescriptionData.prescriptionNumber || `RX-${Date.now()}`, // 3-100 chars
        digitalSignature: prescriptionData.digitalSignature || `DIGITAL_SIGNATURE_${Date.now()}`, // 10-1000 chars
        generalInstructions: prescriptionData.generalInstructions || '',
        prescribedMedications: prescriptionData.medications.map(med => ({
          medicationId: med.medicationId || '00000000-0000-0000-0000-000000000000', // Placeholder if no medication ID
          dosage: med.dosage,
          frequency: med.frequency,
          durationDays: parseInt(med.durationDays),
          specialInstructions: med.specialInstructions || '',
        })),
      };

      console.log('💊 Request body:', JSON.stringify(requestBody, null, 2));

      const response = await apiClient.post('/Prescriptions', requestBody);

      console.log('✅ Prescription created:', response.data);

      return {
        success: true,
        data: response.data?.data || response.data,
        message: response.data?.message || 'تم حفظ الروشتة بنجاح',
      };
    } catch (error) {
      console.error('❌ Error creating prescription:', error);
      console.error('❌ Error response:', error.response?.data);
      console.error('❌ Error status:', error.response?.status);
      console.error('❌ Error message:', error.response?.data?.message);
      console.error('❌ Validation errors:', error.response?.data?.errors);

      // Extract detailed error message
      let errorMessage = 'حدث خطأ أثناء حفظ الروشتة';

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.errors) {
        // Handle validation errors
        const errors = Object.entries(error.response.data.errors)
          .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
          .join('\n');
        errorMessage = `أخطاء في البيانات:\n${errors}`;
      } else if (error.response?.data?.title) {
        errorMessage = error.response.data.title;
      }

      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * Get patient medical record
   * @param {string} patientId - Patient ID
   * @returns {Promise<Object>} Medical record data
   */
  async getPatientMedicalRecord(patientId) {
    try {
      const response = await apiClient.get(`/Doctors/me/patients/${patientId}/medical-record`);

      console.log('🔍 [Session] Medical Record Response:', response.data);

      const rawData = response.data?.data || response.data;

      // Check if data has medicalHistory array (new API structure)
      if (rawData.medicalHistory && Array.isArray(rawData.medicalHistory)) {
        console.log('🔄 [Session] Converting medicalHistory array to structured format');
        console.log('🔍 [Session] medicalHistory array:', rawData.medicalHistory);
        console.log('🔍 [Session] medicalHistory length:', rawData.medicalHistory.length);
        console.log('🔍 [Session] First item:', rawData.medicalHistory[0]);
        console.log('🔍 [Session] First item keys:', Object.keys(rawData.medicalHistory[0] || {}));

        // Transform medicalHistory array to structured format
        const transformedData = {
          patientId: rawData.patientId,
          patientFullName: rawData.patientFullName,
          lastUpdatedAt: rawData.lastUpdatedAt,
          drugAllergies: [],
          chronicDiseases: [],
          currentMedications: [],
          previousSurgeries: [],
        };

        // Group by type (API uses "type" not "recordType")
        rawData.medicalHistory.forEach(item => {
          const recordType = parseInt(item.type); // Convert string to number

          switch (recordType) {
            case 0: // DrugAllergy
              transformedData.drugAllergies.push({
                id: item.id,
                drugName: item.text,
                reaction: '', // API doesn't provide reaction field
                createdAt: item.createdAt,
              });
              break;
            case 1: // ChronicDisease
              transformedData.chronicDiseases.push({
                id: item.id,
                diseaseName: item.text,
                createdAt: item.createdAt,
              });
              break;
            case 2: // CurrentMedication
              transformedData.currentMedications.push({
                id: item.id,
                medicationName: item.text,
                dosage: '', // API doesn't provide dosage
                frequency: '', // API doesn't provide frequency
                startDate: item.createdAt,
                reason: '', // API doesn't provide reason
              });
              break;
            case 3: // PreviousSurgery
              transformedData.previousSurgeries.push({
                id: item.id,
                surgeryName: item.text,
                surgeryDate: item.createdAt,
                createdAt: item.createdAt,
              });
              break;
          }
        });

        console.log('✅ [Session] Transformed data:', transformedData);

        return {
          success: true,
          data: transformedData,
        };
      }

      // If already in correct format, return as is
      return {
        success: true,
        data: rawData,
      };
    } catch (error) {
      return {
        success: false,
        error: this._extractError(error),
      };
    }
  }

  /**
   * Extract error message from API response
   * @private
   */
  _extractError(error) {
    // Log full error for debugging
    console.error('🔴 API Error:', error);
    console.error('🔴 Response:', error.response);

    // Check for response data message (most common)
    if (error.response?.data?.message) {
      return error.response.data.message;
    }

    // Check for validation errors
    if (error.response?.data?.errors) {
      const errors = Object.values(error.response.data.errors).flat();
      return errors.join(', ');
    }

    // Check for error string in data
    if (typeof error.response?.data === 'string') {
      return error.response.data;
    }

    // Check for title (some APIs use this)
    if (error.response?.data?.title) {
      return error.response.data.title;
    }

    // Handle specific status codes
    if (error.response?.status === 409) {
      return 'يوجد تعارض: قد تكون هناك جلسة نشطة بالفعل أو الموعد في حالة غير صالحة';
    }

    if (error.response?.status === 404) {
      return 'الموعد غير موجود';
    }

    if (error.response?.status === 401) {
      return 'غير مصرح لك بالوصول';
    }

    if (error.response?.status === 403) {
      return 'ليس لديك صلاحية لتنفيذ هذا الإجراء';
    }

    // Fallback to error message
    if (error.message) {
      return error.message;
    }

    return 'حدث خطأ غير متوقع';
  }
}

export default new SessionService();
