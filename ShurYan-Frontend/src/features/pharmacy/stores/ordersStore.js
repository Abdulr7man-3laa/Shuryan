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

            // Order details
            selectedOrder: null,
            orderDetailsLoading: false,
            orderDetailsError: null,

            // Current page and filters
            currentPage: 1,
            pageSize: 20,
            statusFilter: null,

            // ==========================================
            // Actions
            // ==========================================

            /**
             * Fetch pharmacy orders with pagination
             * @param {number} page - Page number
             * @param {number} size - Page size
             * @param {boolean} detailed - Use detailed endpoint (includes doctorName, patientPhone, etc.)
             */
            fetchOrders: async (page = null, size = null, detailed = false) => {
                const state = get();
                const pageNumber = page || state.currentPage;
                const pageSize = size || state.pageSize;

                console.log(`🏪 [OrdersStore] Fetching orders - Page: ${pageNumber}, Size: ${pageSize}, Detailed: ${detailed}`);

                set({ loading: true, error: null });

                try {
                    let result;

                    if (detailed) {
                        // Use old detailed endpoint for dashboard
                        result = await pharmacyService.getOrders(pageNumber, pageSize);
                    } else {
                        // Use new lightweight endpoint for orders page
                        result = await pharmacyService.getOrdersList(pageNumber, pageSize);
                    }

                    console.log('✅ [OrdersStore] Orders fetched:', result);

                    set({
                        orders: result.orders,
                        totalCount: result.totalCount,
                        currentPage: result.pageNumber || pageNumber,
                        pageSize: result.pageSize || pageSize,
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
                return state.fetchOrders(state.currentPage, state.pageSize);
            },

            /**
             * Go to specific page
             * @param {number} page - Page number
             */
            goToPage: async (page) => {
                return get().fetchOrders(page);
            },

            /**
             * Filter by status (removed - not supported by new API)
             */

            /**
             * Clear filters (removed - not supported by new API)
             */

            /**
             * Get order by ID from local state
             * @param {string} orderId - Order ID
             */
            getOrderById: (orderId) => {
                const state = get();
                return state.orders.find(order => order.orderId === orderId) || null;
            },

            /**
             * Fetch order details from API
             * @param {string} orderId - Order ID
             */
            fetchOrderDetails: async (orderId) => {
                console.log(`📋 [OrdersStore] Fetching order details for: ${orderId}`);

                set({ orderDetailsLoading: true, orderDetailsError: null });

                try {
                    const result = await pharmacyService.getOrderDetails(orderId);

                    console.log('✅ [OrdersStore] Order details fetched:', result);

                    set({
                        selectedOrder: result,
                        orderDetailsLoading: false,
                        orderDetailsError: null,
                    });

                    return { success: true, data: result };
                } catch (error) {
                    console.error('❌ [OrdersStore] Error fetching order details:', error);

                    const errorMessage = error.response?.data?.message || 'فشل في جلب تفاصيل الطلب';

                    set({
                        selectedOrder: null,
                        orderDetailsLoading: false,
                        orderDetailsError: errorMessage,
                    });

                    return { success: false, error: errorMessage };
                }
            },

            /**
             * Clear selected order details
             */
            clearOrderDetails: () => {
                set({
                    selectedOrder: null,
                    orderDetailsLoading: false,
                    orderDetailsError: null,
                });
            },

            /**
             * Update order status locally (removed - not needed)
             */
            updateOrderStatus: (orderId, newStatus) => {
                set((state) => ({
                    orders: state.orders.map(order =>
                        order.orderId === orderId
                            ? { ...order, pharmacyOrderStatus: newStatus }
                            : order
                    ),
                    selectedOrder: state.selectedOrder && state.selectedOrder.orderId === orderId
                        ? { ...state.selectedOrder, pharmacyOrderStatus: newStatus }
                        : state.selectedOrder,
                }));
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
                    selectedOrder: null,
                    orderDetailsLoading: false,
                    orderDetailsError: null,
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
