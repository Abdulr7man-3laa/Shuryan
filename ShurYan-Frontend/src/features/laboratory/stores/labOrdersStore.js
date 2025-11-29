import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import laboratoryService, { respondToOrder } from '../../../api/services/laboratory.service';
import { LAB_ORDER_STATUS } from '../constants/labConstants';

/**
 * Laboratory Orders Store
 * Manages laboratory orders data and operations
 */
const useLabOrdersStore = create(
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
             * Fetch laboratory orders with pagination and filtering
             * @param {number} page - Page number
             * @param {number} size - Page size
             * @param {number} status - Status filter (optional)
             */
            fetchOrders: async (page = null, size = null, status = null) => {
                const state = get();
                const pageNumber = page || state.currentPage;
                const pageSize = size || state.pageSize;
                const statusFilter = status !== null ? status : state.statusFilter;

                console.log(`🔬 [LabOrdersStore] Fetching orders - Page: ${pageNumber}, Size: ${pageSize}, Status: ${statusFilter || 'all'}`);

                set({ loading: true, error: null });

                try {
                    // Use API endpoint with params
                    const params = {
                        pageNumber,
                        pageSize
                    };
                    if (statusFilter) {
                        params.status = statusFilter;
                    }

                    const orders = await laboratoryService.getOrders(params);
                    console.log('✅ [LabOrdersStore] Orders fetched:', orders);

                    set({
                        orders: orders || [],
                        totalCount: orders?.length || 0,
                        currentPage: pageNumber,
                        pageSize: pageSize,
                        statusFilter: statusFilter,
                        loading: false,
                        error: null,
                    });

                    return { success: true, data: orders };
                } catch (error) {
                    console.error('❌ [LabOrdersStore] Error fetching orders:', error);

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
                console.log(`📋 [LabOrdersStore] Fetching order details for: ${orderId}`);

                set({ orderDetailsLoading: true, orderDetailsError: null });

                try {
                    const result = await laboratoryService.getOrderDetails(orderId);
                    console.log('✅ [LabOrdersStore] Order details fetched:', result);

                    set({
                        selectedOrder: result,
                        orderDetailsLoading: false,
                        orderDetailsError: null,
                    });

                    return { success: true, data: result };
                } catch (error) {
                    console.error('❌ [LabOrdersStore] Error fetching order details:', error);

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
             * Update order status locally
             */
            updateOrderStatus: (orderId, newStatus) => {
                set((state) => ({
                    orders: state.orders.map(order =>
                        order.orderId === orderId
                            ? { ...order, laboratoryOrderStatus: newStatus }
                            : order
                    ),
                    selectedOrder: state.selectedOrder && state.selectedOrder.orderId === orderId
                        ? { ...state.selectedOrder, laboratoryOrderStatus: newStatus }
                        : state.selectedOrder,
                }));
            },

            /**
             * Clear orders data
             */
            clearOrders: () => {
                console.log('🧹 [LabOrdersStore] Clearing orders data');
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
             * Respond to order with test availability and pricing
             * @param {string} orderId - Order ID
             * @param {Object} responseData - Response data
             */
            respondToOrder: async (orderId, responseData) => {
                console.log(`📋 [LabOrdersStore] Responding to order ${orderId}...`);

                try {
                    const result = await respondToOrder(orderId, responseData);

                    console.log('✅ [LabOrdersStore] Order response sent successfully:', result);

                    // Update the order status in the local state (optimistic update)
                    set((state) => ({
                        orders: state.orders.map(order =>
                            order.orderId === orderId
                                ? {
                                    ...order,
                                    laboratoryOrderStatus: responseData.accept
                                        ? LAB_ORDER_STATUS.CONFIRMED_BY_LAB
                                        : LAB_ORDER_STATUS.REJECTED_BY_LAB
                                }
                                : order
                        )
                    }));

                    return { success: true, data: result };
                } catch (error) {
                    console.error('❌ [LabOrdersStore] Error responding to order:', error);

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
            name: 'laboratory-orders-store',
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

export default useLabOrdersStore;
