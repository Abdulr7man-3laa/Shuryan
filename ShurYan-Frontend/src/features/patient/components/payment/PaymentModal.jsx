import React, { useEffect } from 'react';
import {
  FaTimes,
  FaCreditCard,
  FaMobileAlt,
  FaMoneyBillWave,
  FaCheckCircle,
  FaSpinner,
} from 'react-icons/fa';
import { usePaymentStore } from '../../stores/paymentStore';
import { PaymentMethod, PaymentType } from '@/api/services/payment.service';

/**
 * PaymentModal - Modal for selecting payment method and initiating payment
 */
const PaymentModal = ({ isOpen, onClose, orderType, orderId, amount, orderDetails }) => {
  const {
    selectedPaymentMethod,
    selectedPaymentType,
    loading,
    error,
    setPaymentMethod,
    setPaymentType,
    initiatePayment,
    clearError,
  } = usePaymentStore();

  // Clear error when modal opens
  useEffect(() => {
    if (isOpen) {
      clearError();
    }
  }, [isOpen, clearError]);

  if (!isOpen) return null;

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
    clearError();
  };

  const handlePaymentTypeChange = (type) => {
    setPaymentType(type);
    clearError();
  };

  const handleProceedToPayment = async () => {
    console.log('💳 [PaymentModal] Proceeding to payment:', {
      selectedPaymentMethod,
      selectedPaymentType,
      orderType,
      orderId,
      amount
    });
    
    const result = await initiatePayment();
    
    console.log('💳 [PaymentModal] Payment initiation result:', result);
    
    // If payment is cash, close modal and show success
    if (result.success && selectedPaymentMethod === PaymentMethod.CASH_ON_DELIVERY) {
      console.log('💳 [PaymentModal] Cash payment confirmed, closing modal');
      onClose();
      // You can show a success toast here
    }
    
    // If online payment, user will be redirected to Paymob
    if (result.success && selectedPaymentMethod === PaymentMethod.ONLINE) {
      console.log('💳 [PaymentModal] Online payment - waiting for redirect...');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-teal-500 to-emerald-500 p-6 text-white rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black">إتمام الدفع</h2>
              <p className="text-white/80 text-sm mt-1">اختر طريقة الدفع المناسبة</p>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white hover:bg-white/20 rounded-lg p-2 transition-all"
              disabled={loading}
            >
              <FaTimes className="text-xl" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Order Summary */}
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-5 border-2 border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-4">ملخص الطلب</h3>
            
            {orderDetails && (
              <div className="space-y-3 mb-4">
                {orderDetails.title && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">{orderDetails.title}</span>
                    <span className="font-semibold text-slate-800">{orderDetails.value}</span>
                  </div>
                )}
                {orderDetails.items && orderDetails.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="text-slate-600">{item.label}</span>
                    <span className="font-semibold text-slate-800">{item.value}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="border-t-2 border-slate-300 pt-3 mt-3">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-slate-800">الإجمالي</span>
                <span className="text-2xl font-black text-teal-600">{amount} جنيه</span>
              </div>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-4">طريقة الدفع</h3>
            <div className="grid grid-cols-2 gap-4">
              {/* Online Payment */}
              <button
                onClick={() => handlePaymentMethodChange(PaymentMethod.ONLINE)}
                className={`
                  p-5 rounded-xl border-2 transition-all duration-200
                  ${
                    selectedPaymentMethod === PaymentMethod.ONLINE
                      ? 'border-teal-500 bg-teal-50 shadow-lg scale-105'
                      : 'border-slate-200 bg-white hover:border-teal-300 hover:shadow-md'
                  }
                `}
                disabled={loading}
              >
                <div className="flex flex-col items-center gap-3">
                  <div
                    className={`
                    w-14 h-14 rounded-full flex items-center justify-center
                    ${
                      selectedPaymentMethod === PaymentMethod.ONLINE
                        ? 'bg-gradient-to-br from-teal-500 to-emerald-500'
                        : 'bg-slate-100'
                    }
                  `}
                  >
                    <FaCreditCard
                      className={`text-2xl ${
                        selectedPaymentMethod === PaymentMethod.ONLINE
                          ? 'text-white'
                          : 'text-slate-500'
                      }`}
                    />
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-slate-800">دفع إلكتروني</p>
                    <p className="text-xs text-slate-500 mt-1">بطاقة أو محفظة</p>
                  </div>
                  {selectedPaymentMethod === PaymentMethod.ONLINE && (
                    <FaCheckCircle className="text-teal-600 text-lg" />
                  )}
                </div>
              </button>

              {/* Cash Payment */}
              <button
                onClick={() => handlePaymentMethodChange(PaymentMethod.CASH_ON_DELIVERY)}
                className={`
                  p-5 rounded-xl border-2 transition-all duration-200
                  ${
                    selectedPaymentMethod === PaymentMethod.CASH_ON_DELIVERY
                      ? 'border-amber-500 bg-amber-50 shadow-lg scale-105'
                      : 'border-slate-200 bg-white hover:border-amber-300 hover:shadow-md'
                  }
                `}
                disabled={loading}
              >
                <div className="flex flex-col items-center gap-3">
                  <div
                    className={`
                    w-14 h-14 rounded-full flex items-center justify-center
                    ${
                      selectedPaymentMethod === PaymentMethod.CASH_ON_DELIVERY
                        ? 'bg-gradient-to-br from-amber-500 to-orange-500'
                        : 'bg-slate-100'
                    }
                  `}
                  >
                    <FaMoneyBillWave
                      className={`text-2xl ${
                        selectedPaymentMethod === PaymentMethod.CASH_ON_DELIVERY
                          ? 'text-white'
                          : 'text-slate-500'
                      }`}
                    />
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-slate-800">دفع كاش</p>
                    <p className="text-xs text-slate-500 mt-1">عند الاستلام</p>
                  </div>
                  {selectedPaymentMethod === PaymentMethod.CASH_ON_DELIVERY && (
                    <FaCheckCircle className="text-amber-600 text-lg" />
                  )}
                </div>
              </button>
            </div>
          </div>

          {/* Payment Type Selection (Only for Online) */}
          {selectedPaymentMethod === PaymentMethod.ONLINE && (
            <div>
              <h3 className="text-lg font-bold text-slate-800 mb-4">نوع الدفع الإلكتروني</h3>
              <div className="grid grid-cols-2 gap-4">
                {/* Card Payment */}
                <button
                  onClick={() => handlePaymentTypeChange(PaymentType.CARD)}
                  className={`
                    p-4 rounded-xl border-2 transition-all duration-200
                    ${
                      selectedPaymentType === PaymentType.CARD
                        ? 'border-blue-500 bg-blue-50 shadow-lg scale-105'
                        : 'border-slate-200 bg-white hover:border-blue-300 hover:shadow-md'
                    }
                  `}
                  disabled={loading}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`
                      w-12 h-12 rounded-lg flex items-center justify-center
                      ${
                        selectedPaymentType === PaymentType.CARD
                          ? 'bg-gradient-to-br from-blue-500 to-blue-600'
                          : 'bg-slate-100'
                      }
                    `}
                    >
                      <FaCreditCard
                        className={`text-xl ${
                          selectedPaymentType === PaymentType.CARD ? 'text-white' : 'text-slate-500'
                        }`}
                      />
                    </div>
                    <div className="flex-1 text-right">
                      <p className="font-bold text-slate-800">بطاقة ائتمان/خصم</p>
                      <p className="text-xs text-slate-500 mt-0.5">Visa, Mastercard</p>
                    </div>
                    {selectedPaymentType === PaymentType.CARD && (
                      <FaCheckCircle className="text-blue-600" />
                    )}
                  </div>
                </button>

                {/* Mobile Wallet */}
                <button
                  onClick={() => handlePaymentTypeChange(PaymentType.MOBILE_WALLET)}
                  className={`
                    p-4 rounded-xl border-2 transition-all duration-200
                    ${
                      selectedPaymentType === PaymentType.MOBILE_WALLET
                        ? 'border-red-500 bg-red-50 shadow-lg scale-105'
                        : 'border-slate-200 bg-white hover:border-red-300 hover:shadow-md'
                    }
                  `}
                  disabled={loading}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`
                      w-12 h-12 rounded-lg flex items-center justify-center
                      ${
                        selectedPaymentType === PaymentType.MOBILE_WALLET
                          ? 'bg-gradient-to-br from-red-500 to-red-600'
                          : 'bg-slate-100'
                      }
                    `}
                    >
                      <FaMobileAlt
                        className={`text-xl ${
                          selectedPaymentType === PaymentType.MOBILE_WALLET
                            ? 'text-white'
                            : 'text-slate-500'
                        }`}
                      />
                    </div>
                    <div className="flex-1 text-right">
                      <p className="font-bold text-slate-800">فودافون كاش</p>
                      <p className="text-xs text-slate-500 mt-0.5">محفظة موبايل</p>
                    </div>
                    {selectedPaymentType === PaymentType.MOBILE_WALLET && (
                      <FaCheckCircle className="text-red-600" />
                    )}
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
              <p className="text-red-700 text-sm font-semibold">{error}</p>
            </div>
          )}

          {/* Important Notes */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
            <p className="text-sm text-blue-800 font-bold mb-2">📌 ملاحظات هامة</p>
            <ul className="text-xs text-blue-700 space-y-1 mr-4 list-disc">
              {selectedPaymentMethod === PaymentMethod.ONLINE ? (
                <>
                  <li>سيتم تحويلك إلى صفحة الدفع الآمنة لإتمام العملية</li>
                  <li>جميع المعاملات مشفرة وآمنة 100%</li>
                  <li>يمكنك الدفع ببطاقة ائتمان أو فودافون كاش</li>
                </>
              ) : (
                <>
                  <li>يمكنك الدفع نقداً عند استلام الخدمة</li>
                  <li>يرجى تجهيز المبلغ المطلوب</li>
                  <li>يمكنك إلغاء الطلب قبل 24 ساعة</li>
                </>
              )}
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t-2 border-slate-200 p-6 rounded-b-2xl">
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-4 rounded-xl border-2 border-slate-300 text-slate-700 font-bold hover:bg-slate-50 transition-all"
              disabled={loading}
            >
              إلغاء
            </button>
            <button
              onClick={handleProceedToPayment}
              disabled={loading}
              className="
                flex-1 py-4 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500
                text-white font-black hover:shadow-2xl hover:scale-105
                transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                flex items-center justify-center gap-3
              "
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin text-xl" />
                  <span>جاري المعالجة...</span>
                </>
              ) : (
                <>
                  <FaCheckCircle className="text-xl" />
                  <span>
                    {selectedPaymentMethod === PaymentMethod.ONLINE
                      ? 'المتابعة للدفع'
                      : 'تأكيد الطلب'}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
