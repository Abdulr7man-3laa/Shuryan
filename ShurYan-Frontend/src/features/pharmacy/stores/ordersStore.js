import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import pharmacyService, { respondToOrder } from '../../../api/services/pharmacy.service';

/**
 * Pharmacy Orders Store
 * Manages pharmacy orders data and operations
 */
const useOrdersStore = create(
  devtools(
    (set, get) => ({
      // ==========================================
      // State
      // ==========================================
      orders: [],
      totalCount: 0,
      pagination: null,
      loading: false,
      error: null,
      
      // Current page and filters
      currentPage: 1,
      pageSize: 10,
      statusFilter: null,

      // ==========================================
      // Actions
      // ==========================================

      /**
       * Fetch pharmacy orders with pagination
       * @param {number} page - Page number
       * @param {number} size - Page size
       * @param {string} status - Status filter
       */
      fetchOrders: async (page = null, size = null, status = null) => {
        const state = get();
        const pageNumber = page || state.currentPage;
        const pageSize = size || state.pageSize;
        const statusFilter = status !== undefined ? status : state.statusFilter;
        
        console.log(`🏪 [OrdersStore] Fetching orders - Page: ${pageNumber}, Size: ${pageSize}, Status: ${statusFilter}`);
        
        set({ loading: true, error: null });
        
        try {
          const result = await pharmacyService.getOrders(pageNumber, pageSize, statusFilter);
          
          console.log('✅ [OrdersStore] Orders fetched:', result);
          
          set({
            orders: result.orders,
            totalCount: result.totalCount,
            pagination: result.pagination,
            currentPage: pageNumber,
            pageSize: pageSize,
            statusFilter: statusFilter,
            loading: false,
            error: null,
          });
          
          return { success: true, data: result };
        } catch (error) {
          console.error('❌ [OrdersStore] Error fetching orders:', error);
          
          const errorMessage = error.response?.data?.message || 'فشل في جلب الطلبات';
          
          set({
            orders: [],
            totalCount: 0,
            pagination: null,
            loading: false,
            error: errorMessage,
          });
          
          return { success: false, error: errorMessage };
        }
      },

      /**
       * Refresh current page
       */
      refreshOrders: async () => {
        const state = get();
        return state.fetchOrders(state.currentPage, state.pageSize, state.statusFilter);
      },

      /**
       * Go to specific page
       * @param {number} page - Page number
       */
      goToPage: async (page) => {
        return get().fetchOrders(page);
      },

      /**
       * Filter by status
       * @param {string} status - Status filter
       */
      filterByStatus: async (status) => {
        return get().fetchOrders(1, null, status); // Reset to page 1 when filtering
      },

      /**
       * Clear filters
       */
      clearFilters: async () => {
        return get().fetchOrders(1, null, null);
      },

      /**
       * Get order by ID
       * @param {string} orderId - Order ID
       */
      getOrderById: (orderId) => {
        const state = get();
        return state.orders.find(order => order.orderId === orderId) || null;
      },

      /**
       * Update order status locally (optimistic update)
       * @param {string} orderId - Order ID
       * @param {number} newStatus - New status
       */
      updateOrderStatus: (orderId, newStatus) => {
        const state = get();
        const updatedOrders = state.orders.map(order => 
          order.orderId === orderId 
            ? { ...order, pharmacyOrderStatus: newStatus }
            : order
        );
        
        set({ orders: updatedOrders });
      },

      /**
       * Clear orders data
       */
      clearOrders: () => {
        console.log('🧹 [OrdersStore] Clearing orders data');
        set({
          orders: [],
          totalCount: 0,
          pagination: null,
          loading: false,
          error: null,
          currentPage: 1,
          statusFilter: null,
        });
      },

      /**
       * Respond to order with medication availability and pricing
       * @param {string} orderId - Order ID
       * @param {Object} responseData - Response data
       */
      respondToOrder: async (orderId, responseData) => {
        console.log(`📋 [OrdersStore] Responding to order ${orderId}...`);
        
        try {
          const result = await respondToOrder(orderId, responseData);
          
          console.log('✅ [OrdersStore] Order response sent successfully:', result);
          
          // Update the order status in the local state (optimistic update)
          set((state) => ({
            orders: state.orders.map(order => 
              order.orderId === orderId 
                ? { ...order, pharmacyOrderStatus: 2 } // WaitingForPatientConfirmation
                : order
            )
          }));
          
          return { success: true, data: result };
        } catch (error) {
          console.error('❌ [OrdersStore] Error responding to order:', error);
          
          const errorMessage = error.response?.data?.message || 'فشل في إرسال الرد على الطلب';
          set({ error: errorMessage });
          
          return { success: false, error: errorMessage };
        }
      },

      /**
       * Clear error
       */
      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'pharmacy-orders-store',
      partialize: (state) => ({
        // Don't persist loading states or errors
        orders: state.orders,
        currentPage: state.currentPage,
        pageSize: state.pageSize,
        statusFilter: state.statusFilter,
      }),
    }
  )
);

export default useOrdersStore;
