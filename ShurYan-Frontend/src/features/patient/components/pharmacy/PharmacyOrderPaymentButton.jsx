import React, { useState } from 'react';
import { FaCreditCard, FaSpinner } from 'react-icons/fa';
import PaymentModal from '../payment/PaymentModal';
import { usePaymentStore } from '../../stores/paymentStore';

/**
 * PharmacyOrderPaymentButton - Button to initiate payment for pharmacy order
 * Shows when order status is WaitingForPatientConfirmation (2)
 */
const PharmacyOrderPaymentButton = ({ order }) => {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const { openPaymentModal } = usePaymentStore();

  // Only show button if order is waiting for patient confirmation (status 2)
  if (order.pharmacyOrderStatus !== 2) {
    return null;
  }

  const handlePayNow = () => {
    openPaymentModal(
      'pharmacy',
      order.orderId,
      order.totalAmount
    );
    setIsPaymentModalOpen(true);
  };

  return (
    <>
      <button
        onClick={handlePayNow}
        className="
          w-full py-4 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500
          text-white font-bold hover:shadow-2xl hover:scale-105
          transition-all duration-200
          flex items-center justify-center gap-3
        "
      >
        <FaCreditCard className="text-xl" />
        <span>إتمام الدفع - {order.totalAmount} جنيه</span>
      </button>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        orderType="pharmacy"
        orderId={order.orderId}
        amount={order.totalAmount}
        orderDetails={{
          title: 'طلب صيدلية',
          items: [
            {
              label: 'رقم الطلب',
              value: `#${order.orderNumber || order.orderId.slice(0, 8)}`,
            },
            {
              label: 'عدد الأدوية',
              value: `${order.medicationsCount || order.medications?.length || 0} دواء`,
            },
            {
              label: 'الصيدلية',
              value: order.pharmacyName || 'صيدلية شريان',
            },
          ],
        }}
      />
    </>
  );
};

export default PharmacyOrderPaymentButton;
