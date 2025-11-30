import { 
  FaFlask, 
  FaHospital, 
  FaCalendarAlt, 
  FaMoneyBillWave, 
  FaCreditCard,
  FaCheckCircle,
  FaClock,
  FaExclamationCircle,
  FaTimesCircle,
  FaHome,
  FaBuilding
} from 'react-icons/fa';

/**
 * Lab Order Status Enum
 * Must match backend LabOrderStatus enum
 */
const LAB_ORDER_STATUS = {
  NEW_REQUEST: 1,                    // طلب جديد
  AWAITING_LAB_REVIEW: 2,            // في انتظار مراجعة المعمل
  CONFIRMED_BY_LAB: 3,               // تم التأكيد من المعمل
  AWAITING_PAYMENT: 4,               // في انتظار الدفع
  PAID: 5,                           // تم الدفع
  AWAITING_SAMPLES: 6,               // في انتظار العينات
  IN_PROGRESS_AT_LAB: 7,             // قيد التنفيذ في المعمل
  RESULTS_READY: 8,                  // النتائج جاهزة
  COMPLETED: 9,                      // تم الاستلام
  CANCELLED_BY_PATIENT: 10,          // ملغي من المريض
  REJECTED_BY_LAB: 11,               // مرفوض من المعمل
};

/**
 * Sample Collection Type Enum
 */
const SAMPLE_COLLECTION_TYPE = {
  LAB_VISIT: 1,          // زيارة المعمل
  HOME_COLLECTION: 2,    // سحب من المنزل
};

const LabOrderCard = ({ order, onPayClick, onViewDetails }) => {
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusConfig = (status) => {
    const configs = {
      [LAB_ORDER_STATUS.NEW_REQUEST]: {
        label: 'طلب جديد',
        icon: FaExclamationCircle,
        bgColor: 'bg-blue-100',
        textColor: 'text-blue-700',
        borderColor: 'border-blue-300',
      },
      [LAB_ORDER_STATUS.AWAITING_LAB_REVIEW]: {
        label: 'في انتظار مراجعة المعمل',
        icon: FaClock,
        bgColor: 'bg-amber-100',
        textColor: 'text-amber-700',
        borderColor: 'border-amber-300',
      },
      [LAB_ORDER_STATUS.CONFIRMED_BY_LAB]: {
        label: 'تم التأكيد من المعمل',
        icon: FaCheckCircle,
        bgColor: 'bg-green-100',
        textColor: 'text-green-700',
        borderColor: 'border-green-300',
      },
      [LAB_ORDER_STATUS.AWAITING_PAYMENT]: {
        label: 'في انتظار الدفع',
        icon: FaCreditCard,
        bgColor: 'bg-orange-100',
        textColor: 'text-orange-700',
        borderColor: 'border-orange-300',
      },
      [LAB_ORDER_STATUS.PAID]: {
        label: 'تم الدفع',
        icon: FaCheckCircle,
        bgColor: 'bg-teal-100',
        textColor: 'text-teal-700',
        borderColor: 'border-teal-300',
      },
      [LAB_ORDER_STATUS.AWAITING_SAMPLES]: {
        label: 'في انتظار العينات',
        icon: FaClock,
        bgColor: 'bg-purple-100',
        textColor: 'text-purple-700',
        borderColor: 'border-purple-300',
      },
      [LAB_ORDER_STATUS.IN_PROGRESS_AT_LAB]: {
        label: 'قيد التنفيذ في المعمل',
        icon: FaFlask,
        bgColor: 'bg-indigo-100',
        textColor: 'text-indigo-700',
        borderColor: 'border-indigo-300',
      },
      [LAB_ORDER_STATUS.RESULTS_READY]: {
        label: 'النتائج جاهزة',
        icon: FaCheckCircle,
        bgColor: 'bg-green-100',
        textColor: 'text-green-700',
        borderColor: 'border-green-300',
      },
      [LAB_ORDER_STATUS.COMPLETED]: {
        label: 'تم الاستلام',
        icon: FaCheckCircle,
        bgColor: 'bg-emerald-100',
        textColor: 'text-emerald-700',
        borderColor: 'border-emerald-300',
      },
      [LAB_ORDER_STATUS.CANCELLED_BY_PATIENT]: {
        label: 'ملغي',
        icon: FaTimesCircle,
        bgColor: 'bg-red-100',
        textColor: 'text-red-700',
        borderColor: 'border-red-300',
      },
      [LAB_ORDER_STATUS.REJECTED_BY_LAB]: {
        label: 'مرفوض من المعمل',
        icon: FaTimesCircle,
        bgColor: 'bg-red-100',
        textColor: 'text-red-700',
        borderColor: 'border-red-300',
      },
    };

    return configs[status] || {
      label: 'غير محدد',
      icon: FaExclamationCircle,
      bgColor: 'bg-slate-100',
      textColor: 'text-slate-700',
      borderColor: 'border-slate-300',
    };
  };

  const statusConfig = getStatusConfig(order.status);
  const StatusIcon = statusConfig.icon;
  const totalAmount = order.testsTotalCost + (order.sampleCollectionDeliveryCost || 0);
  const isAwaitingPayment = order.status === LAB_ORDER_STATUS.AWAITING_PAYMENT;

  return (
    <div className="bg-white rounded-2xl p-6 border-2 border-slate-200 hover:border-cyan-300 hover:shadow-lg transition-all duration-200">
      {/* Status Badge */}
      <div className={`inline-flex items-center gap-2 px-4 py-2 ${statusConfig.bgColor} ${statusConfig.textColor} rounded-xl text-sm font-bold mb-4 border-2 ${statusConfig.borderColor}`}>
        <StatusIcon />
        <span>{statusConfig.label}</span>
      </div>

      {/* Laboratory Info */}
      <div className="flex items-start gap-3 mb-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white flex-shrink-0">
          <FaHospital className="text-xl" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-black text-slate-800 truncate">
            {order.laboratoryName || 'اسم المعمل'}
          </h3>
          <p className="text-sm text-slate-600">
            {order.testsCount || 0} تحليل
          </p>
        </div>
      </div>

      {/* Order Details */}
      <div className="space-y-3 mb-4">
        {/* Date */}
        <div className="flex items-center gap-2 text-slate-600">
          <FaCalendarAlt className="text-cyan-600" />
          <span className="text-sm">
            {formatDate(order.createdAt)}
          </span>
        </div>

        {/* Sample Collection Type */}
        <div className="flex items-center gap-2 text-slate-600">
          {order.sampleCollectionType === SAMPLE_COLLECTION_TYPE.HOME_COLLECTION ? (
            <>
              <FaHome className="text-cyan-600" />
              <span className="text-sm">سحب العينة من المنزل</span>
            </>
          ) : (
            <>
              <FaBuilding className="text-cyan-600" />
              <span className="text-sm">زيارة المعمل</span>
            </>
          )}
        </div>

        {/* Total Amount */}
        <div className="flex items-center gap-2">
          <FaMoneyBillWave className="text-cyan-600" />
          <div className="flex-1 flex justify-between items-center">
            <span className="text-sm text-slate-600">الإجمالي:</span>
            <span className="text-lg font-black text-cyan-600">
              {totalAmount.toFixed(2)} جنيه
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        {isAwaitingPayment && (
          <button
            onClick={() => onPayClick(order)}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl font-bold hover:shadow-lg hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <FaCreditCard />
            <span>دفع وتأكيد الطلب</span>
          </button>
        )}
        
        {!isAwaitingPayment && (
          <button
            onClick={() => onViewDetails(order)}
            className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-all duration-200"
          >
            عرض التفاصيل
          </button>
        )}
      </div>
    </div>
  );
};

export default LabOrderCard;
