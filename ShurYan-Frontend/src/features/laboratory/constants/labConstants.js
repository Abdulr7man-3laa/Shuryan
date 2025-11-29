/**
 * Laboratory Order Status Enum
 * Matches backend LabOrderStatus enum
 */
export const LAB_ORDER_STATUS = {
    NEW_REQUEST: 1,
    AWAITING_LAB_REVIEW: 2,
    CONFIRMED_BY_LAB: 3,
    AWAITING_PAYMENT: 4,
    PAID: 5,
    AWAITING_SAMPLES: 6,
    IN_PROGRESS_AT_LAB: 7,
    RESULTS_READY: 8,
    COMPLETED: 9,
    CANCELLED_BY_PATIENT: 10,
    REJECTED_BY_LAB: 11
};

/**
 * UI Configuration for Laboratory Order Statuses
 */
export const LAB_STATUS_CONFIG = {
    [LAB_ORDER_STATUS.NEW_REQUEST]: {
        label: 'طلب جديد',
        color: 'text-amber-700',
        bgColor: 'bg-amber-50',
        borderColor: 'border-amber-200'
    },
    [LAB_ORDER_STATUS.AWAITING_LAB_REVIEW]: {
        label: 'في انتظار مراجعة المعمل',
        color: 'text-blue-700',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200'
    },
    [LAB_ORDER_STATUS.CONFIRMED_BY_LAB]: {
        label: 'تم التأكيد من المعمل',
        color: 'text-indigo-700',
        bgColor: 'bg-indigo-50',
        borderColor: 'border-indigo-200'
    },
    [LAB_ORDER_STATUS.AWAITING_PAYMENT]: {
        label: 'في انتظار الدفع',
        color: 'text-orange-700',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-200'
    },
    [LAB_ORDER_STATUS.PAID]: {
        label: 'تم الدفع',
        color: 'text-emerald-700',
        bgColor: 'bg-emerald-50',
        borderColor: 'border-emerald-200'
    },
    [LAB_ORDER_STATUS.AWAITING_SAMPLES]: {
        label: 'في انتظار العينات',
        color: 'text-purple-700',
        bgColor: 'bg-purple-50',
        borderColor: 'border-purple-200'
    },
    [LAB_ORDER_STATUS.IN_PROGRESS_AT_LAB]: {
        label: 'قيد التنفيذ في المعمل',
        color: 'text-cyan-700',
        bgColor: 'bg-cyan-50',
        borderColor: 'border-cyan-200'
    },
    [LAB_ORDER_STATUS.RESULTS_READY]: {
        label: 'النتائج جاهزة',
        color: 'text-teal-700',
        bgColor: 'bg-teal-50',
        borderColor: 'border-teal-200'
    },
    [LAB_ORDER_STATUS.COMPLETED]: {
        label: 'تم الاستلام',
        color: 'text-green-700',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200'
    },
    [LAB_ORDER_STATUS.CANCELLED_BY_PATIENT]: {
        label: 'ملغي من المريض',
        color: 'text-red-700',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200'
    },
    [LAB_ORDER_STATUS.REJECTED_BY_LAB]: {
        label: 'مرفوض من المعمل',
        color: 'text-red-700',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200'
    }
};
