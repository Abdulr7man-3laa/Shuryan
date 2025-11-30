import apiClient from '../client';

class NotificationsService {
  async getUnreadNotifications() {
    try {
      const response = await apiClient.get('/notifications/unread');
      return response.data?.data || [];
    } catch (error) {
      console.error('[Notifications API] Failed to fetch unread notifications:', error.message);
      throw error;
    }
  }

  async getAllNotifications(pageNumber = 1, pageSize = 20) {
    try {
      const response = await apiClient.get('/notifications', {
        params: { pageNumber, pageSize },
      });
      return response.data?.data || { 
        pageNumber: 1, 
        pageSize: 20, 
        totalCount: 0, 
        totalPages: 0, 
        hasPreviousPage: false, 
        hasNextPage: false, 
        data: [] 
      };
    } catch (error) {
      console.error('[Notifications API] Failed to fetch all notifications:', error.message);
      throw error;
    }
  }

  async markAsRead(notificationId) {
    try {
      const response = await apiClient.put(`/notifications/${notificationId}/mark-as-read`);
      console.log('✅ [Notifications API] Marked as read:', notificationId);
      return response.data;
    } catch (error) {
      console.error('❌ [Notifications API] Failed to mark as read:', error);
      throw error;
    }
  }

  async markAllAsRead() {
    try {
      const response = await apiClient.put('/notifications/mark-all-as-read');
      console.log('✅ [Notifications API] All marked as read');
      return response.data;
    } catch (error) {
      console.error('❌ [Notifications API] Failed to mark all as read:', error);
      throw error;
    }
  }

  async deleteNotification(notificationId) {
    try {
      const response = await apiClient.delete(`/notifications/${notificationId}`);
      console.log('✅ [Notifications API] Deleted:', notificationId);
      return response.data;
    } catch (error) {
      console.error('❌ [Notifications API] Failed to delete:', error);
      throw error;
    }
  }

  async getAppointmentDetails(appointmentId) {
    try {
      const response = await apiClient.get(`/Appointments/${appointmentId}`);
      console.log('📥 [Notifications API] Appointment details:', response.data);
      return response.data?.data || null;
    } catch (error) {
      console.error('❌ [Notifications API] Failed to fetch appointment details:', error);
      throw error;
    }
  }
}

const notificationsService = new NotificationsService();
export default notificationsService;
