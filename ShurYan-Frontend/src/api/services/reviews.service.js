import apiClient from '../client';

/**
 * Reviews API Service
 * Handles all review-related API calls for doctors
 */
class ReviewsService {
  /**
   * Get doctor reviews with pagination and filtering
   * @param {Object} params - Query parameters
   * @param {number} params.pageNumber - Page number (default: 1)
   * @param {number} params.pageSize - Page size (default: 20)
   * @param {number} params.minRating - Minimum overall satisfaction rating (1-5)
   * @param {boolean} params.verifiedOnly - Show only verified reviews
   * @param {string} params.sortBy - Sort field (date, rating, overallSatisfaction)
   * @param {string} params.sortOrder - Sort order (asc, desc)
   * @returns {Promise} API response with reviews data
   */
  async getDoctorReviews(params = {}) {
    try {
      console.log('📊 Fetching doctor reviews with params:', params);
      
      const response = await apiClient.get('/Doctors/me/reviews', { params });
      
      console.log('✅ Reviews fetched successfully:', response.data);
      return response.data?.data || null;
    } catch (error) {
      console.error('❌ Error fetching reviews:', error);
      throw error;
    }
  }

  /**
   * Get review statistics for the doctor
   * @returns {Promise} API response with statistics
   */
  async getReviewStatistics() {
    try {
      console.log('📈 Fetching review statistics');
      
      const response = await apiClient.get('/Doctors/me/reviews/statistics');
      
      console.log('✅ Statistics fetched successfully:', response.data);
      return response.data?.data || null;
    } catch (error) {
      console.error('❌ Error fetching statistics:', error);
      throw error;
    }
  }

  /**
   * Reply to a patient review
   * @param {string} reviewId - Review ID
   * @param {string} reply - Doctor's reply text (max 300 chars)
   * @returns {Promise} API response
   */
  async replyToReview(reviewId, reply) {
    try {
      console.log('💬 Replying to review:', reviewId);
      
      const response = await apiClient.post(`/Reviews/${reviewId}/reply`, {
        doctorReply: reply
      });
      
      console.log('✅ Reply sent successfully');
      return response.data;
    } catch (error) {
      console.error('❌ Error sending reply:', error);
      throw error;
    }
  }

  /**
   * Get detailed review by ID
   * @param {string} reviewId - Review ID
   * @returns {Promise} API response with detailed review
   */
  async getReviewDetails(reviewId) {
    try {
      console.log('🔍 Fetching review details:', reviewId);
      
      const response = await apiClient.get(`/Reviews/${reviewId}`);
      
      console.log('✅ Review details fetched successfully');
      return response.data?.data || null;
    } catch (error) {
      console.error('❌ Error fetching review details:', error);
      throw error;
    }
  }
}

export default new ReviewsService();
