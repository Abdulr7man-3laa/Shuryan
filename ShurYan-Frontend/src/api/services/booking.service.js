import apiClient from '../client';

class BookingService {
  async getDoctorSchedule(doctorId) {
    const response = await apiClient.get(
      `/Doctors/${doctorId}/appointments/schedule`
    );
    return response.data?.data || [];
  }

  async getDoctorExceptions(doctorId) {
    const response = await apiClient.get(
      `/Doctors/${doctorId}/appointments/exceptions`
    );
    return response.data?.data || [];
  }

  async getDoctorServices(doctorId) {
    const response = await apiClient.get(`/Doctors/${doctorId}/services`);
    return response.data?.data || null;
  }

  async getBookedSlots(doctorId, date) {
    const response = await apiClient.get(
      `/Doctors/${doctorId}/appointments/booked`,
      { params: { date } }
    );
    return response.data?.data || [];
  }

  async bookAppointment(bookingData) {
    const response = await apiClient.post('/Appointments/book', bookingData);
    return response.data?.data || null;
  }

  async getAvailableSlots(doctorId, date, consultationType) {
    const response = await apiClient.get(
      `/Doctors/${doctorId}/appointments/available-slots`,
      { params: { date, consultationType } }
    );
    return response.data?.data || [];
  }
}

export default new BookingService();
