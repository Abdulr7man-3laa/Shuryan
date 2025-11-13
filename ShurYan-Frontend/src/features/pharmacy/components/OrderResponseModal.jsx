import React, { useState, useEffect } from 'react';
import { 
  FaTimes, 
  FaCheck, 
  FaExclamationTriangle, 
  FaPills, 
  FaMoneyBillWave,
  FaTruck,
  FaStickyNote,
  FaPlus,
  FaTrash
} from 'react-icons/fa';
import useOrders from '../hooks/useOrders';

/**
 * OrderResponseModal Component
 * Modal for pharmacy to respond to orders with medication availability and pricing
 */
const OrderResponseModal = ({ isOpen, onClose, order }) => {
  const { respondToOrder } = useOrders();
  
  // Form state
  const [medications, setMedications] = useState([]);
  const [deliveryAvailable, setDeliveryAvailable] = useState(true);
  const [deliveryFee, setDeliveryFee] = useState(10.00);
  const [pharmacyNotes, setPharmacyNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize medications from order
  useEffect(() => {
    if (order?.prescription?.medications) {
      const initialMedications = order.prescription.medications.map(med => ({
        medicationName: med.medicationName,
        isAvailable: true,
        availableQuantity: 10,
        unitPrice: 25.00,
        alternativeOne: {
          medicationName: '',
          unitPrice: 0
        }
      }));
      setMedications(initialMedications);
    }
  }, [order]);

  // Calculate total amount
  const totalAmount = medications.reduce((total, med) => {
    return total + (med.isAvailable ? med.unitPrice * med.availableQuantity : 0);
  }, 0) + (deliveryAvailable ? deliveryFee : 0);

  const handleMedicationChange = (index, field, value) => {
    setMedications(prev => prev.map((med, i) => 
      i === index 
        ? { ...med, [field]: value }
        : med
    ));
  };

  const handleAlternativeChange = (index, field, value) => {
    setMedications(prev => prev.map((med, i) => 
      i === index 
        ? { 
            ...med, 
            alternativeOne: { ...med.alternativeOne, [field]: value }
          }
        : med
    ));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const responseData = {
        medications,
        totalAmount,
        deliveryAvailable,
        deliveryFee: deliveryAvailable ? deliveryFee : 0,
        pharmacyNotes
      };

      const result = await respondToOrder(order.orderId, responseData);
      
      if (result.success) {
        alert('تم إرسال الرد بنجاح! سيتم إشعار المريض بالتفاصيل.');
        onClose();
      } else {
        alert(result.error || 'فشل في إرسال الرد');
      }
    } catch (error) {
      console.error('Error submitting response:', error);
      alert('حدث خطأ أثناء إرسال الرد');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-500 to-emerald-500 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <FaPills className="text-2xl" />
              </div>
              <div>
                <h2 className="text-xl font-bold">الرد على طلب الروشتة</h2>
                <p className="text-teal-100">رقم الطلب: {order.prescriptionNumber}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-colors"
            >
              <FaTimes className="text-lg" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Order Info */}
          <div className="bg-slate-50 rounded-xl p-4">
            <h3 className="font-bold text-slate-800 mb-2">معلومات الطلب</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-slate-600">المريض:</span>
                <span className="font-semibold text-slate-800 mr-2">{order.patientName}</span>
              </div>
              <div>
                <span className="text-slate-600">الطبيب:</span>
                <span className="font-semibold text-slate-800 mr-2">{order.doctorName}</span>
              </div>
              <div>
                <span className="text-slate-600">التاريخ:</span>
                <span className="font-semibold text-slate-800 mr-2">
                  {new Date(order.receivedAt).toLocaleDateString('ar-EG')}
                </span>
              </div>
            </div>
          </div>

          {/* Medications */}
          <div className="space-y-4">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <FaPills className="text-teal-500" />
              الأدوية المطلوبة
            </h3>
            
            {medications.map((medication, index) => (
              <div key={index} className="border border-slate-200 rounded-xl p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-slate-800">{medication.medicationName}</h4>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`available-${index}`}
                      checked={medication.isAvailable}
                      onChange={(e) => handleMedicationChange(index, 'isAvailable', e.target.checked)}
                      className="w-4 h-4 text-teal-600"
                    />
                    <label htmlFor={`available-${index}`} className="text-sm font-medium">
                      متوفر
                    </label>
                  </div>
                </div>

                {medication.isAvailable ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        الكمية المتاحة
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={medication.availableQuantity}
                        onChange={(e) => handleMedicationChange(index, 'availableQuantity', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        سعر الوحدة (جنيه)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={medication.unitPrice}
                        onChange={(e) => handleMedicationChange(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-red-700 mb-2">
                      <FaExclamationTriangle />
                      <span className="font-medium">غير متوفر</span>
                    </div>
                  </div>
                )}

                {/* Alternative */}
                <div className="border-t border-slate-200 pt-4">
                  <h5 className="font-medium text-slate-700 mb-2">البديل المقترح (اختياري)</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        اسم الدواء البديل
                      </label>
                      <input
                        type="text"
                        value={medication.alternativeOne.medicationName}
                        onChange={(e) => handleAlternativeChange(index, 'medicationName', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                        placeholder="اسم الدواء البديل"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        سعر البديل (جنيه)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={medication.alternativeOne.unitPrice}
                        onChange={(e) => handleAlternativeChange(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Delivery */}
          <div className="border border-slate-200 rounded-xl p-4">
            <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
              <FaTruck className="text-teal-500" />
              التوصيل
            </h3>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="delivery-available"
                  checked={deliveryAvailable}
                  onChange={(e) => setDeliveryAvailable(e.target.checked)}
                  className="w-4 h-4 text-teal-600"
                />
                <label htmlFor="delivery-available" className="text-sm font-medium">
                  التوصيل متاح
                </label>
              </div>
            </div>
            {deliveryAvailable && (
              <div className="max-w-xs">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  رسوم التوصيل (جنيه)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={deliveryFee}
                  onChange={(e) => setDeliveryFee(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
              <FaStickyNote className="text-teal-500" />
              ملاحظات الصيدلية (اختياري)
            </label>
            <textarea
              value={pharmacyNotes}
              onChange={(e) => setPharmacyNotes(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              placeholder="أي ملاحظات إضافية للمريض..."
            />
          </div>

          {/* Total */}
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800 flex items-center gap-2">
                <FaMoneyBillWave className="text-emerald-500" />
                إجمالي المبلغ
              </span>
              <span className="text-2xl font-black text-emerald-600">
                {totalAmount.toFixed(2)} جنيه
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  جاري الإرسال...
                </>
              ) : (
                <>
                  <FaCheck />
                  إرسال الرد
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-slate-300 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors"
            >
              إلغاء
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderResponseModal;
