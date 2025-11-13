import React, { useState } from 'react';
import {
  FaCreditCard,
  FaCheckCircle,
  FaLock,
  FaShieldAlt,
  FaMobileAlt,
} from 'react-icons/fa';

/**
 * PaymentStep - Step 5: Payment method selection and processing
 */
const PaymentStep = ({
  doctorName,
  serviceDetails,
  selectedDate,
  selectedTime,
  onPaymentComplete,
  loading,
}) => {
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
  });
  const [vodafoneNumber, setVodafoneNumber] = useState('');
  const [processing, setProcessing] = useState(false);

  // Payment methods
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
  ];

  // Format date
  const formatDateArabic = (dateStr) => {
    const date = new Date(dateStr);
    const dayNames = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    const monthNames = [
      'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
      'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
    ];
    return `${dayNames[date.getDay()]}، ${date.getDate()} ${monthNames[date.getMonth()]}`;
  };

  // Format time
  const formatTime12h = (time24) => {
    if (!time24) return '--:--';
    const parts = time24.split(':');
    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);
    const period = hours >= 12 ? 'م' : 'ص';
    const hours12 = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
    return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  // Handle card input
  const handleCardInput = (field, value) => {
    let formattedValue = value;

    if (field === 'cardNumber') {
      formattedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      if (formattedValue.length > 19) return;
    } else if (field === 'expiryDate') {
      formattedValue = value.replace(/\D/g, '');
      if (formattedValue.length >= 2) {
        formattedValue = formattedValue.slice(0, 2) + '/' + formattedValue.slice(2, 4);
      }
      if (formattedValue.length > 5) return;
    } else if (field === 'cvv') {
      formattedValue = value.replace(/\D/g, '').slice(0, 4);
    }

    setCardDetails(prev => ({ ...prev, [field]: formattedValue }));
  };

  // Handle Vodafone number input
  const handleVodafoneInput = (value) => {
    // Only numbers, max 11 digits
    const formattedValue = value.replace(/\D/g, '').slice(0, 11);
    setVodafoneNumber(formattedValue);
  };

  // Handle payment
  const handlePayment = async () => {
    setProcessing(true);
    
    // Simulate API call
    setTimeout(() => {
      setProcessing(false);
      onPaymentComplete({ 
        method: selectedMethod, 
        status: 'completed',
        transactionId: 'TXN' + Date.now(),
      });
    }, 2000);
  };

  // Validate forms
  const isCardValid = 
    cardDetails.cardNumber.replace(/\s/g, '').length === 16 &&
    cardDetails.cardHolder.length > 0 &&
    cardDetails.expiryDate.length === 5 &&
    cardDetails.cvv.length >= 3;

  const isVodafoneValid = vodafoneNumber.length === 11;

  const canProceed = 
    (selectedMethod === 'card' && isCardValid) || 
    (selectedMethod === 'vodafone' && isVodafoneValid);

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Payment Methods - Clean Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {paymentMethods.map((method) => {
          const isSelected = selectedMethod === method.id;
          return (
            <button
              key={method.id}
              onClick={() => setSelectedMethod(method.id)}
              className={`
                relative p-6 rounded-2xl border-2 transition-all duration-300
                ${
                  isSelected
                    ? `${method.borderColor} bg-gradient-to-br ${method.bgGradient} shadow-lg scale-[1.02]`
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md'
                }
              `}
            >
              {/* Selected Check */}
              {isSelected && (
                <div className="absolute top-4 left-4">
                  <div className={`w-6 h-6 rounded-full ${method.iconBg} flex items-center justify-center`}>
                    <FaCheckCircle className="text-white text-sm" />
                  </div>
                </div>
              )}

              <div className="text-center space-y-4">
                {/* Icon */}
                <div className={`
                  inline-flex items-center justify-center w-16 h-16 rounded-2xl
                  ${isSelected ? `${method.iconBg} text-white shadow-lg` : 'bg-slate-100 text-slate-400'}
                  transition-all duration-300
                `}>
                  {method.icon}
                </div>
                
                {/* Text */}
                <div>
                  <p className={`text-lg font-black mb-1 ${
                    isSelected ? 'text-slate-800' : 'text-slate-600'
                  }`}>
                    {method.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {method.description}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Card Payment Form - Clean & Minimal */}
      {selectedMethod === 'card' && (
        <div className="bg-white rounded-2xl border-2 border-slate-200 p-6 space-y-5 animate-fadeIn">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
            <FaLock className="text-blue-500" />
            <h3 className="text-base font-bold text-slate-700">معلومات البطاقة</h3>
          </div>

          <div className="space-y-4">
            {/* Card Number */}
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-2">
                رقم البطاقة
              </label>
              <input
                type="text"
                value={cardDetails.cardNumber}
                onChange={(e) => handleCardInput('cardNumber', e.target.value)}
                placeholder="1234 5678 9012 3456"
                className="w-full px-4 py-3.5 border border-slate-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none text-base font-mono transition-all"
              />
            </div>

            {/* Card Holder */}
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-2">
                اسم حامل البطاقة
              </label>
              <input
                type="text"
                value={cardDetails.cardHolder}
                onChange={(e) => handleCardInput('cardHolder', e.target.value)}
                placeholder="AHMED MOHAMED"
                className="w-full px-4 py-3.5 border border-slate-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none text-base uppercase transition-all"
              />
            </div>

            {/* Expiry & CVV */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-2">
                  تاريخ الانتهاء
                </label>
                <input
                  type="text"
                  value={cardDetails.expiryDate}
                  onChange={(e) => handleCardInput('expiryDate', e.target.value)}
                  placeholder="MM/YY"
                  className="w-full px-4 py-3.5 border border-slate-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none text-base font-mono transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-2">
                  CVV
                </label>
                <input
                  type="text"
                  value={cardDetails.cvv}
                  onChange={(e) => handleCardInput('cvv', e.target.value)}
                  placeholder="123"
                  className="w-full px-4 py-3.5 border border-slate-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none text-base font-mono transition-all"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Vodafone Cash Form - Clean & Minimal */}
      {selectedMethod === 'vodafone' && (
        <div className="bg-white rounded-2xl border-2 border-slate-200 p-6 space-y-5 animate-fadeIn">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
            <FaMobileAlt className="text-red-500" />
            <h3 className="text-base font-bold text-slate-700">معلومات فودافون كاش</h3>
          </div>

          <div className="space-y-4">
            {/* Phone Number */}
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-2">
                رقم المحفظة
              </label>
              <input
                type="text"
                value={vodafoneNumber}
                onChange={(e) => handleVodafoneInput(e.target.value)}
                placeholder="01xxxxxxxxx"
                dir="ltr"
                className="w-full px-4 py-3.5 border border-slate-300 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-100 focus:outline-none text-base font-mono transition-all"
              />
              <p className="text-xs text-slate-500 mt-2">
                أدخل رقم محفظة فودافون كاش (11 رقم)
              </p>
            </div>
          </div>

          {/* Info Notice */}
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-sm text-red-800 font-semibold mb-2">
              كيفية الدفع:
            </p>
            <ul className="space-y-1.5 text-xs text-red-700">
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-0.5">•</span>
                <span>سيتم إرسال طلب دفع إلى رقم محفظتك</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-0.5">•</span>
                <span>أدخل الرقم السري لتأكيد العملية</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-0.5">•</span>
                <span>سيتم تأكيد الحجز فوراً بعد الدفع</span>
              </li>
            </ul>
          </div>
        </div>
      )}


      {/* Action Button - Clean & Professional */}
      <button
        onClick={handlePayment}
        disabled={!canProceed || processing || loading}
        className={`
          w-full py-4 rounded-xl font-bold text-base
          transition-all duration-300
          flex items-center justify-center gap-2
          ${
            canProceed && !processing && !loading
              ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-lg hover:shadow-xl hover:scale-[1.02]'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }
        `}
      >
        {processing || loading ? (
          <>
            <div className="inline-block animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
            <span>جاري المعالجة...</span>
          </>
        ) : (
          <>
            <FaCheckCircle className="text-lg" />
            <span>تأكيد الدفع</span>
          </>
        )}
      </button>
    </div>
  );
};

export default PaymentStep;
