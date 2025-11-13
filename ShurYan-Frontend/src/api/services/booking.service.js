import apiClient from '../client';

/**
 * Booking Service - Patient Appointment Booking
 * Handles all booking-related API calls
 */
class BookingService {
  /**
   * Get doctor's weekly schedule (static schedule)
   * @param {string} doctorId - Doctor UUID
   * @returns {Promise<Array>} Array of 7 days with schedule
   */
  async getDoctorSchedule(doctorId) {
    const response = await apiClient.get(
      `/Doctors/${doctorId}/appointments/schedule`
    );
    // API returns { success, message, data }
    return response.data?.data || [];
  }

  /**
   * Get doctor's exceptional dates (overrides)
   * @param {string} doctorId - Doctor UUID
   * @returns {Promise<Array>} Array of exceptional dates
   */
  async getDoctorExceptions(doctorId) {
    const response = await apiClient.get(
      `/Doctors/${doctorId}/appointments/exceptions`
    );
    // API returns { success, message, data }
    return response.data?.data || [];
  }

  /**
   * Get doctor's services and pricing
   * @param {string} doctorId - Doctor UUID
   * @returns {Promise<Object>} Services with price and duration
   */
  async getDoctorServices(doctorId) {
    const response = await apiClient.get(`/Doctors/${doctorId}/services`);
    // API returns { success, message, data }
    return response.data?.data || null;
  }

  /**
   * Get booked appointments for specific date
   * @param {string} doctorId - Doctor UUID
   * @param {string} date - Date in YYYY-MM-DD format
   * @returns {Promise<Array>} Array of booked time slots
   */
  async getBookedSlots(doctorId, date) {
    const response = await apiClient.get(
      `/Doctors/${doctorId}/appointments/booked`,
      { params: { date } }
    );
    // API returns { success, message, data }
    return response.data?.data || [];
  }

  async bookAppointment(bookingData) {
    const response = await apiClient.post('/Appointments/book', bookingData);
    return response.data?.data || null;
  }

  /**
   * Get available time slots (optional endpoint)
   * @param {string} doctorId - Doctor UUID
   * @param {string} date - Date in YYYY-MM-DD format
   * @param {number} consultationType - 0 or 1
   * @returns {Promise<Array>} Array of time slots with availability
   */
  async getAvailableSlots(doctorId, date, consultationType) {
    const response = await apiClient.get(
      `/Doctors/${doctorId}/appointments/available-slots`,
      { params: { date, consultationType } }
    );
    // API returns { success, message, data }
    return response.data?.data || [];
  }
}

export default new BookingService();
