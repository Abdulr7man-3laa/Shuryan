import { useEffect } from 'react';
import useLabOrdersStore from '../stores/labOrdersStore';
import { LAB_ORDER_STATUS, LAB_STATUS_CONFIG } from '../constants/labConstants';

/**
 * Custom hook for laboratory orders operations
 * @param {Object} options - Hook options
 * @param {boolean} options.autoFetch - Auto-fetch orders on mount
 * @param {number} options.pageSize - Page size for pagination
 * @returns {Object} Orders state and actions
 */
const useLabOrders = ({ autoFetch = true, pageSize = 10 } = {}) => {
    const {
        // State
        orders,
        totalCount,
        pagination,
        loading,
        error,
        currentPage,
        statusFilter,

        // Actions
        fetchOrders,
        refreshOrders,
        goToPage,
        filterByStatus,
        clearFilters,
        getOrderById,
        updateOrderStatus,
        respondToOrder,
        clearOrders,
        clearError,
    } = useLabOrdersStore();

    // Auto-fetch on mount if requested
    useEffect(() => {
        if (autoFetch) {
            console.log('🔄 [useLabOrders] Auto-fetching orders...');
            fetchOrders(1, pageSize, null); // Pass null for status to fetch all
        }
    }, [autoFetch, pageSize, fetchOrders]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            // Optional: Clear data on unmount
            // clearOrders();
        };
    }, []);

    // Computed properties
    const hasOrders = orders && orders.length > 0;
    const isEmpty = !loading && !hasOrders;
    const hasNextPage = pagination?.hasNext || false;
    const hasPreviousPage = pagination?.hasPrevious || false;
    const totalPages = pagination?.totalPages || 0;

    // Status counts (for dashboard stats)
    // Status counts (for dashboard stats)
    const statusCounts = {
        pendingResponse: orders.filter(order => order.laboratoryOrderStatus === LAB_ORDER_STATUS.NEW_REQUEST).length,
        waitingConfirmation: orders.filter(order => order.laboratoryOrderStatus === LAB_ORDER_STATUS.AWAITING_LAB_REVIEW).length,
        pendingPayment: orders.filter(order => order.laboratoryOrderStatus === LAB_ORDER_STATUS.AWAITING_PAYMENT).length,
        paidPending: orders.filter(order => order.laboratoryOrderStatus === LAB_ORDER_STATUS.PAID).length,
        confirmed: orders.filter(order => order.laboratoryOrderStatus === LAB_ORDER_STATUS.CONFIRMED_BY_LAB).length,
        inProgress: orders.filter(order => order.laboratoryOrderStatus === LAB_ORDER_STATUS.IN_PROGRESS_AT_LAB).length,
        outForDelivery: orders.filter(order => order.laboratoryOrderStatus === LAB_ORDER_STATUS.AWAITING_SAMPLES).length, // Note: AWAITING_SAMPLES might not map directly to "outForDelivery" in old logic, but based on enum: 6 is AwaitingSamples. 7 is InProgress.
        // Wait, let's look at the old mapping:
        // 6: 'جاري تجهيز العينات' (InProgress / Preparing Samples?) -> Enum 6 is AwaitingSamples. Enum 7 is InProgressAtLab.
        // Old code: 6: 'جاري تجهيز العينات'
        // New Enum: 6: AwaitingSamples ("في انتظار العينات")
        // New Enum: 7: InProgressAtLab ("قيد التنفيذ في المعمل")

        // Let's map based on the NEW enum meanings.
        // pendingResponse (1) -> NEW_REQUEST
        // waitingConfirmation (2) -> AWAITING_LAB_REVIEW
        // pendingPayment (3) -> CONFIRMED_BY_LAB (Wait, old 3 was "Waiting Payment")
        // New Enum: 3 is ConfirmedByLab. 4 is AwaitingPayment.

        // I should be careful here. The user provided a NEW enum. I should trust the NEW enum.
        // 1: NewRequest
        // 2: AwaitingLabReview
        // 3: ConfirmedByLab
        // 4: AwaitingPayment
        // 5: Paid
        // 6: AwaitingSamples
        // 7: InProgressAtLab
        // 8: ResultsReady
        // 9: Completed
        // 10: CancelledByPatient
        // 11: RejectedByLab

        pendingResponse: orders.filter(order => order.laboratoryOrderStatus === LAB_ORDER_STATUS.NEW_REQUEST).length,
        waitingConfirmation: orders.filter(order => order.laboratoryOrderStatus === LAB_ORDER_STATUS.AWAITING_LAB_REVIEW).length,
        confirmed: orders.filter(order => order.laboratoryOrderStatus === LAB_ORDER_STATUS.CONFIRMED_BY_LAB).length,
        pendingPayment: orders.filter(order => order.laboratoryOrderStatus === LAB_ORDER_STATUS.AWAITING_PAYMENT).length,
        paid: orders.filter(order => order.laboratoryOrderStatus === LAB_ORDER_STATUS.PAID).length,
        awaitingSamples: orders.filter(order => order.laboratoryOrderStatus === LAB_ORDER_STATUS.AWAITING_SAMPLES).length,
        inProgress: orders.filter(order => order.laboratoryOrderStatus === LAB_ORDER_STATUS.IN_PROGRESS_AT_LAB).length,
        resultsReady: orders.filter(order => order.laboratoryOrderStatus === LAB_ORDER_STATUS.RESULTS_READY).length,
        completed: orders.filter(order => order.laboratoryOrderStatus === LAB_ORDER_STATUS.COMPLETED).length,
        cancelled: orders.filter(order => order.laboratoryOrderStatus === LAB_ORDER_STATUS.CANCELLED_BY_PATIENT).length,
        rejected: orders.filter(order => order.laboratoryOrderStatus === LAB_ORDER_STATUS.REJECTED_BY_LAB).length,
    };

    // Helper functions
    // Helper functions
    const getStatusLabel = (status) => {
        return LAB_STATUS_CONFIG[status]?.label || 'غير محدد';
    };

    const getStatusConfig = (status) => {
        return LAB_STATUS_CONFIG[status] || {
            label: 'غير محدد',
            bgColor: 'bg-slate-50',
            color: 'text-slate-700', // Changed from textColor to color to match constants
            borderColor: 'border-slate-200',
        };
    };

    return {
        // State
        orders,
        totalCount,
        pagination,
        loading,
        error,
        currentPage,
        statusFilter,
        hasOrders,
        isEmpty,
        hasNextPage,
        hasPreviousPage,
        totalPages,
        statusCounts,

        // Actions
        fetchOrders,
        refreshOrders,
        goToPage,
        filterByStatus,
        clearFilters,
        getOrderById,
        updateOrderStatus,
        respondToOrder,
        clearOrders,
        clearError,

        // Helpers
        getStatusLabel,
        getStatusConfig,
    };
};

export default useLabOrders;
