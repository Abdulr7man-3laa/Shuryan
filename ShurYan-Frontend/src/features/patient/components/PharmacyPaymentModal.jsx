import React, { useState } from 'react';
import { FaTimes, FaCreditCard, FaMobileAlt, FaMoneyBillWave, FaShoppingCart } from 'react-icons/fa';
import patientService from '@/api/services/patient.service';

/**
 * PharmacyPaymentModal Component
 * Payment modal for pharmacy orders
 */
const PharmacyPaymentModal = ({ isOpen, onClose, orderData, onPaymentConfirm }) => {
  const [selectedMethod, setSelectedMethod] = useState('');
  const [cardData, setCardData] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
  });
  const [vodafoneNumber, setVodafoneNumber] = useState('');
  const [processing, setProcessing] = useState(false);

  // Payment methods including cash on delivery
  const paymentMethods = [
    {
      id: 'card',
      name: 'بطاقة ائتمان',
      icon: <FaCreditCard className="text-3xl" />,
      description: 'Visa • Mastercard • Amex',
      gradient: 'from-blue-500 to-indigo-600',
      bgGradient: 'from-blue-50 to-indigo-50',
      borderColor: 'border-blue-300',
      iconBg: 'bg-blue-500',
    },
    {
      id: 'vodafone',
      name: 'فودافون كاش',
      icon: <FaMobileAlt className="text-3xl" />,
      description: 'ادفع من محفظتك الإلكترونية',
      gradient: 'from-red-500 to-red-600',
      bgGradient: 'from-red-50 to-orange-50',
      borderColor: 'border-red-300',
      iconBg: 'bg-red-500',
    },
    {
      id: 'cash',
      name: 'كاش عند الاستلام',
      icon: <FaMoneyBillWave className="text-3xl" />,
      description: 'ادفع نقداً عند استلام الطلب',
      gradient: 'from-green-500 to-emerald-600',
      bgGradient: 'from-green-50 to-emerald-50',
      borderColor: 'border-green-300',
      iconBg: 'bg-green-500',
    },
  ];

  const handlePaymentConfirm = async () => {
    if (!selectedMethod) {
      alert('يرجى اختيار طريقة الدفع');
      return;
    }

    setProcessing(true);

    try {
      let paymentData = {
        method: selectedMethod,
        orderData: orderData
      };

      // Add specific data based on payment method
      if (selectedMethod === 'card') {
        if (!cardData.cardNumber || !cardData.cardHolder || !cardData.expiryDate || !cardData.cvv) {
          alert('يرجى إدخال جميع بيانات البطاقة');
          setProcessing(false);
          return;
        }
        paymentData.cardData = cardData;
      } else if (selectedMethod === 'vodafone') {
        if (!vodafoneNumber) {
          alert('يرجى إدخال رقم فودافون كاش');
          setProcessing(false);
          return;
        }
        paymentData.vodafoneNumber = vodafoneNumber;
      }

      console.log('💳 Processing payment:', paymentData);

      // Call API to confirm the order
      const orderId = orderData?.orderId;
      if (!orderId) {
        alert('لا يمكن تأكيد الطلب: رقم الطلب غير موجود');
        return;
      }

      const confirmResponse = await patientService.confirmPharmacyOrder(orderId, paymentData);
      console.log('✅ Confirm order response:', confirmResponse);

      // Call parent callback
      onPaymentConfirm(paymentData);
      
    } catch (error) {
      console.error('❌ Payment failed:', error);
      alert('حدث خطأ في عملية الدفع');
    } finally {
      setProcessing(false);
    }
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" dir="rtl">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-500 to-emerald-600 p-6 relative">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black text-white mb-2">اختر طريقة الدفع</h2>
              <p className="text-teal-100 font-medium">
                إجمالي المبلغ: {orderData?.totalAmount || 0} ج.م
                {orderData?.deliveryFee && ` + ${orderData.deliveryFee} ج.م رسوم توصيل`}
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-colors"
            >
              <FaTimes className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[calc(90vh-200px)] overflow-y-auto">
          {/* Payment Methods */}
          <div className="space-y-4 mb-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4">طرق الدفع المتاحة</h3>
            
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                onClick={() => setSelectedMethod(method.id)}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  selectedMethod === method.id
                    ? `${method.borderColor} bg-gradient-to-r ${method.bgGradient}`
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 ${method.iconBg} rounded-xl flex items-center justify-center text-white`}>
                    {method.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-800">{method.name}</h4>
                    <p className="text-sm text-slate-600">{method.description}</p>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 ${
                    selectedMethod === method.id 
                      ? 'bg-teal-500 border-teal-500' 
                      : 'border-slate-300'
                  }`}>
                    {selectedMethod === method.id && (
                      <div className="w-full h-full rounded-full bg-white scale-50"></div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Payment Details Forms */}
          {selectedMethod === 'card' && (
            <div className="bg-slate-50 rounded-xl p-6">
              <h4 className="font-bold text-slate-800 mb-4">بيانات البطاقة الائتمانية</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">رقم البطاقة</label>
                  <input
                    type="text"
                    value={cardData.cardNumber}
                    onChange={(e) => setCardData({...cardData, cardNumber: formatCardNumber(e.target.value)})}
                    placeholder="1234 5678 9012 3456"
                    maxLength="19"
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">اسم حامل البطاقة</label>
                  <input
                    type="text"
                    value={cardData.cardHolder}
                    onChange={(e) => setCardData({...cardData, cardHolder: e.target.value})}
                    placeholder="Ahmed Mohamed"
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">تاريخ الانتهاء</label>
                  <input
                    type="text"
                    value={cardData.expiryDate}
                    onChange={(e) => setCardData({...cardData, expiryDate: formatExpiryDate(e.target.value)})}
                    placeholder="MM/YY"
                    maxLength="5"
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">CVV</label>
                  <input
                    type="text"
                    value={cardData.cvv}
                    onChange={(e) => setCardData({...cardData, cvv: e.target.value.replace(/\D/g, '').slice(0, 4)})}
                    placeholder="123"
                    maxLength="4"
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}

          {selectedMethod === 'vodafone' && (
            <div className="bg-slate-50 rounded-xl p-6">
              <h4 className="font-bold text-slate-800 mb-4">بيانات فودافون كاش</h4>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">رقم المحفظة</label>
                <input
                  type="text"
                  value={vodafoneNumber}
                  onChange={(e) => setVodafoneNumber(e.target.value.replace(/\D/g, '').slice(0, 11))}
                  placeholder="01xxxxxxxxx"
                  maxLength="11"
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
            </div>
          )}

          {selectedMethod === 'cash' && (
            <div className="bg-green-50 rounded-xl p-6">
              <h4 className="font-bold text-slate-800 mb-4">الدفع كاش عند الاستلام</h4>
              <div className="flex items-center gap-3 text-green-700">
                <FaMoneyBillWave className="text-2xl" />
                <div>
                  <p className="font-semibold">سيتم الدفع نقداً عند استلام الطلب</p>
                  <p className="text-sm">تأكد من توفر المبلغ المطلوب عند التسليم</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-4 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-slate-500 text-white rounded-xl hover:bg-slate-600 transition-colors font-bold"
          >
            إلغاء
          </button>
          
          <button
            onClick={handlePaymentConfirm}
            disabled={!selectedMethod || processing}
            className={`px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${
              !selectedMethod || processing
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-teal-500 to-emerald-600 text-white hover:from-teal-600 hover:to-emerald-700'
            }`}
          >
            {processing ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                جاري المعالجة...
              </>
            ) : (
              <>
                <FaShoppingCart className="w-5 h-5" />
                تأكيد الطلب والدفع
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PharmacyPaymentModal;
