import apiClient from '../client';

/**
 * Chat API Service - Refactored
 * يتعامل مع 3 endpoints فقط:
 * 1. SendMessage - إرسال رسالة
 * 2. ChatHistory - جلب تاريخ المحادثة مع pagination
 * 3. ClearChat - مسح المحادثة
 */
const chatService = {
  /**
   * إرسال رسالة للـ AI Bot
   * @param {Object} data - بيانات الرسالة
   * @param {string} data.message - الرسالة من المستخدم
   * @param {Object} data.context - Context إضافي (currentPage, doctorId, appointmentId, specialty, etc.)
   * @returns {Promise<Object>} رد الـ AI Bot
   */
  async sendMessage(data) {
    try {
      console.log('📤 [SendMessage] Sending message to AI Bot:', data);
      
      const response = await apiClient.post('/Chat/send-message', {
        message: data.message,
        context: data.context || {}
      });

      console.log('✅ [SendMessage] AI Bot response:', response.data);
      
      // استخراج data من wrapper
      return response.data?.data || null;
    } catch (error) {
      console.error('❌ [SendMessage] Error:', error);
      throw error;
    }
  },

  /**
   * جلب تاريخ المحادثة مع pagination
   * @param {number} pageNumber - رقم الصفحة (default: 1)
   * @param {number} pageSize - عدد الرسائل في الصفحة (default: 50)
   * @returns {Promise<Object>} بيانات المحادثة مع pagination
   */
  async getChatHistory(pageNumber = 1, pageSize = 50) {
    try {
      console.log(`📥 [ChatHistory] Fetching page ${pageNumber} (size: ${pageSize})`);
      
      const response = await apiClient.get('/Chat/history', {
        params: { pageNumber, pageSize }
      });
      
      console.log('✅ [ChatHistory] Data received:', response.data);
      
      // استخراج data من wrapper
      return response.data?.data || null;
    } catch (error) {
      console.error('❌ [ChatHistory] Error:', error);
      throw error;
    }
  },

  /**
   * مسح المحادثة بالكامل (البدء من جديد)
   * @returns {Promise<Object>} رسالة النجاح
   */
  async clearChat() {
    try {
      console.log('🧹 [ClearChat] Clearing entire chat history');
      
      const response = await apiClient.delete('/Chat/clear');
      
      console.log('✅ [ClearChat] Chat cleared successfully:', response.data);
      
      return response.data;
    } catch (error) {
      console.error('❌ [ClearChat] Error:', error);
      throw error;
    }
  }
};

export default chatService;
