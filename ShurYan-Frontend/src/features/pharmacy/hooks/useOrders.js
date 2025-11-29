import { useEffect } from 'react';
import useOrdersStore from '../stores/ordersStore';

/**
 * Custom hook for pharmacy orders operations
 * @param {Object} options - Hook options
 * @param {boolean} options.autoFetch - Auto-fetch orders on mount
 * @param {number} options.pageSize - Page size for pagination
 * @param {boolean} options.detailed - Use detailed endpoint (includes doctorName, patientPhone, etc.)
 * @returns {Object} Orders state and actions
 */
const useOrders = ({ autoFetch = true, pageSize = 10, detailed = true } = {}) => {
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
    } = useOrdersStore();

    // Auto-fetch on mount if requested
    useEffect(() => {
        if (autoFetch) {
            console.log('🔄 [useOrders] Auto-fetching orders...');
            fetchOrders(1, pageSize, detailed);
        }
    }, [autoFetch, pageSize, detailed, fetchOrders]);

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
    const statusCounts = {
        pendingResponse: orders.filter(order => order.pharmacyOrderStatus === 1).length,
        waitingConfirmation: orders.filter(order => order.pharmacyOrderStatus === 2).length,
        pendingPayment: orders.filter(order => order.pharmacyOrderStatus === 3).length,
        paidPending: orders.filter(order => order.pharmacyOrderStatus === 4).length,
        confirmed: orders.filter(order => order.pharmacyOrderStatus === 5).length,
        inProgress: orders.filter(order => order.pharmacyOrderStatus === 6).length,
        outForDelivery: orders.filter(order => order.pharmacyOrderStatus === 7).length,
        readyForPickup: orders.filter(order => order.pharmacyOrderStatus === 8).length,
        delivered: orders.filter(order => order.pharmacyOrderStatus === 9).length,
        cancelled: orders.filter(order => order.pharmacyOrderStatus === 10).length,
    };

    // Helper functions
    const getStatusLabel = (status) => {
        const statusMap = {
            1: 'في انتظار رد الصيدلية',
            2: 'في انتظار تأكيد المريض',
            3: 'في انتظار الدفع',
            4: 'تم الدفع - في انتظار تأكيد الصيدلية',
            5: 'تم تأكيد الطلب',
            6: 'جاري تحضير الطلب',
            7: 'خرج للتوصيل',
            8: 'جاهز للاستلام',
            9: 'تم التسليم',
            10: 'ملغي',
        };
        return statusMap[status] || 'غير محدد';
    };

    const getStatusConfig = (status) => {
        const configs = {
            1: { // في انتظار رد الصيدلية
                label: 'في انتظار رد الصيدلية',
                bgColor: 'bg-amber-50',
                textColor: 'text-amber-700',
                borderColor: 'border-amber-200',
            },
            2: { // في انتظار تأكيد المريض
                label: 'في انتظار تأكيد المريض',
                bgColor: 'bg-orange-50',
                textColor: 'text-orange-700',
                borderColor: 'border-orange-200',
            },
            3: { // في انتظار الدفع
                label: 'في انتظار الدفع',
                bgColor: 'bg-red-50',
                textColor: 'text-red-700',
                borderColor: 'border-red-200',
            },
            4: { // تم الدفع - في انتظار تأكيد الصيدلية
                label: 'تم الدفع - في انتظار تأكيد الصيدلية',
                bgColor: 'bg-yellow-50',
                textColor: 'text-yellow-700',
                borderColor: 'border-yellow-200',
            },
            5: { // تم تأكيد الطلب
                label: 'تم تأكيد الطلب',
                bgColor: 'bg-teal-50',
                textColor: 'text-teal-700',
                borderColor: 'border-teal-200',
            },
            6: { // جاري تحضير الطلب
                label: 'جاري تحضير الطلب',
                bgColor: 'bg-blue-50',
                textColor: 'text-blue-700',
                borderColor: 'border-blue-200',
            },
            7: { // خرج للتوصيل
                label: 'خرج للتوصيل',
                bgColor: 'bg-indigo-50',
                textColor: 'text-indigo-700',
                borderColor: 'border-indigo-200',
            },
            8: { // جاهز للاستلام
                label: 'جاهز للاستلام',
                bgColor: 'bg-green-50',
                textColor: 'text-green-700',
                borderColor: 'border-green-200',
            },
            9: { // تم التسليم
                label: 'تم التسليم',
                bgColor: 'bg-emerald-50',
                textColor: 'text-emerald-700',
                borderColor: 'border-emerald-200',
            },
            10: { // ملغي
                label: 'ملغي',
                bgColor: 'bg-gray-50',
                textColor: 'text-gray-700',
                borderColor: 'border-gray-200',
            },
        };
        return configs[status] || {
            label: 'غير محدد',
            bgColor: 'bg-slate-50',
            textColor: 'text-slate-700',
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

export default useOrders;
