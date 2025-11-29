import React, { useState, useEffect } from 'react';
import {
  FaTimes,
  FaCheck,
  FaPills,
  FaExclamationTriangle,
  FaCheckCircle,
  FaExchangeAlt,
  FaChevronDown,
  FaChevronUp,
  FaCalendarAlt,
  FaUser,
  FaUserMd,
  FaHospital,
  FaTimesCircle
} from 'react-icons/fa';
import useOrders from '../hooks/useOrders';
import { MEDICATION_UNITS } from '../data/mockData';
import { getPrescriptionDetails } from '../../../api/services/pharmacy.service';

/**
 * Improved Prescription Modal Component
 * Clean, compact, and beautiful design
 * @component
 */
const PrescriptionModal = ({ isOpen, onClose, orderId }) => {
  const { respondToOrder, getOrderById } = useOrders();
  const [prescription, setPrescription] = useState(null);
  const [medicationStates, setMedicationStates] = useState({});
  const [expandedMeds, setExpandedMeds] = useState({});
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Load prescription data from API
  useEffect(() => {
    const fetchPrescriptionDetails = async () => {
      if (!isOpen || !orderId) return;

      try {
        setLoading(true);
        setError(null);
        console.log('📄 Fetching prescription details for order:', orderId);

        const data = await getPrescriptionDetails(orderId);
        console.log('✅ Prescription details:', data);

        if (data) {
          setPrescription(data);

          // Initialize medication states
          const initialStates = {};
          const initialExpanded = {};
          data.medications.forEach((med, index) => {
            // Use same ID logic as in handleSendReport
            const medId = (med.id || med.medicationId || med.drugId || index).toString();

            console.log(`📋 Initializing medication ${index}:`, {
              medication: med,
              medId: medId
            });

            initialStates[medId] = {
              isAvailable: true,
              quantity: '',
              unitType: 'tablets',
              price: '',
              hasAlternative: false,
              alternativeName: '',
              alternativeUnitType: 'tablets',
              alternativePrice: '',
            };
            initialExpanded[medId] = false; // Collapsed by default
          });
          setMedicationStates(initialStates);
          setExpandedMeds(initialExpanded);
        }
      } catch (err) {
        console.error('❌ Error fetching prescription details:', err);
        setError(err.message || 'فشل في تحميل تفاصيل الروشتة');
      } finally {
        setLoading(false);
      }
    };

    fetchPrescriptionDetails();
  }, [isOpen, orderId]);

  // Toggle medication details
  const toggleMedication = (medId) => {
    setExpandedMeds(prev => ({
      ...prev,
      [medId]: !prev[medId]
    }));
  };

  // Handle availability change
  const handleAvailabilityChange = (medId, isAvailable) => {
    setMedicationStates(prev => ({
      ...prev,
      [medId]: {
        ...prev[medId],
        isAvailable,
        hasAlternative: false,
        alternativeName: '',
        alternativeUnitType: 'tablets',
        alternativePrice: '',
      }
    }));
  };

  // Handle field change
  const handleFieldChange = (medId, field, value) => {
    setMedicationStates(prev => ({
      ...prev,
      [medId]: {
        ...prev[medId],
        [field]: value
      }
    }));
  };


  // Calculate total
  const calculateTotal = () => {
    let total = 0;
    Object.values(medicationStates).forEach((state) => {
      if (state.isAvailable && state.price && state.quantity) {
        total += (parseFloat(state.price) || 0) * (parseInt(state.quantity) || 0);
      } else if (!state.isAvailable && state.hasAlternative && state.alternativePrice) {
        total += parseFloat(state.alternativePrice) || 0;
      }
    });
    return total.toFixed(2);
  };

  // Count available medications
  const countAvailable = () => {
    return Object.values(medicationStates).filter(state =>
      state.isAvailable || (!state.isAvailable && state.hasAlternative)
    ).length;
  };

  // Handle send report
  const handleSendReport = async () => {
    setIsSubmitting(true);

    try {
      // Validate that we have prescription and medications
      if (!prescription || !prescription.medications || prescription.medications.length === 0) {
        alert('لا توجد أدوية للرد عليها');
        return;
      }

      // Validate that we have at least some medication states
      if (Object.keys(medicationStates).length === 0) {
        alert('يرجى تحديد حالة الأدوية أولاً');
        return;
      }

      console.log('📋 Current medication states:', medicationStates);
      console.log('📋 Prescription medications:', prescription.medications);

      // Transform medication states to API format
      const medications = prescription.medications.map((medication, index) => {
        // Use different possible ID fields or fallback to index
        const medId = (medication.id || medication.medicationId || medication.drugId || index).toString();
        const state = medicationStates[medId] || {};

        console.log(`📋 Processing medication ${index}:`, {
          medication,
          medId,
          state
        });

        const medicationData = {
          medicationName: medication.medicationName || medication.name || medication.drugName || '',
          isAvailable: Boolean(state.isAvailable),
          availableQuantity: state.isAvailable ? Math.max(0, parseInt(state.quantity) || 0) : 0,
          unitPrice: state.isAvailable ? Math.max(0, parseFloat(state.price) || 0) : 0
        };

        // Only add alternativeOne if medication is NOT available AND has alternative
        if (!state.isAvailable && state.hasAlternative && state.alternativeName) {
          medicationData.alternativeOne = {
            medicationName: state.alternativeName || '',
            unitPrice: Math.max(0, parseFloat(state.alternativePrice) || 0)
          };
        }

        return medicationData;
      });

      const responseData = {
        medications,
        totalAmount: Math.max(0, calculateTotal() || 0),
        deliveryAvailable: true,
        deliveryFee: 10.00,
        pharmacyNotes: notes || ''
      };

      // Validate that all medications have proper data
      const invalidMedications = medications.filter(med => {
        if (med.isAvailable) {
          // For available medications: need name, quantity > 0, and price > 0
          return !med.medicationName || med.availableQuantity <= 0 || med.unitPrice <= 0;
        } else {
          // For unavailable medications: need name, and if has alternative, need alternative name
          if (!med.medicationName) return true;
          if (med.alternativeOne && !med.alternativeOne.medicationName) return true;
          return false;
        }
      });

      if (invalidMedications.length > 0) {
        console.warn('⚠️ Invalid medications found:', invalidMedications);
        alert('يرجى التأكد من ملء جميع البيانات المطلوبة للأدوية');
        return;
      }

      console.log('📋 Sending pharmacy response:', responseData);
      console.log('📋 Medications count:', medications.length);
      console.log('📋 Order ID:', orderId);

      // Log each medication for debugging
      medications.forEach((med, index) => {
        console.log(`📋 Medication ${index + 1}:`, {
          name: med.medicationName,
          available: med.isAvailable,
          quantity: med.availableQuantity,
          price: med.unitPrice,
          hasAlternative: !!med.alternativeOne,
          alternative: med.alternativeOne
        });
      });

      const result = await respondToOrder(orderId, responseData);

      if (result.success) {
        alert('تم إرسال التقرير للمريض بنجاح! ✅');
        onClose();
      } else {
        alert(result.error || 'فشل في إرسال التقرير');
      }
    } catch (error) {
      console.error('Error sending report:', error);
      console.error('Error details:', error.response?.data);

      // Show more specific error message
      const errorMessage = error.response?.data?.message ||
        error.response?.data?.errors?.[0] ||
        error.message ||
        'حدث خطأ أثناء إرسال التقرير';
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-EG', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  // Determine if sending is allowed based on order status (1 = PendingPharmacyResponse)
  const currentOrder = getOrderById ? getOrderById(orderId) : null;
  const canSend = ((currentOrder?.pharmacyOrderStatus ?? currentOrder?.status) === 1);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full h-[90vh] flex flex-col overflow-hidden animate-slideUp">

        {/* Loading State */}
        {loading && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="inline-block w-16 h-16 border-4 border-[#00b19f] border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-slate-600 font-semibold">جاري تحميل تفاصيل الروشتة...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center">
              <div className="w-24 h-24 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-6">
                <FaTimes className="text-4xl text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-700 mb-3">حدث خطأ</h3>
              <p className="text-slate-500 text-base mb-6">{error}</p>
              <button
                onClick={onClose}
                className="px-6 py-2 bg-[#00b19f] hover:bg-[#00a08d] text-white font-semibold rounded-lg transition-all duration-200"
              >
                إغلاق
              </button>
            </div>
          </div>
        )}

        {/* Content - Only show when loaded */}
        {!loading && !error && prescription && (
          <>
            {/* Header - Fixed at Top */}
            <div className="flex-shrink-0 relative bg-gradient-to-br from-[#00b19f] via-[#00c4b0] to-[#00d4be] p-6">
              <button
                onClick={onClose}
                className="absolute top-4 left-4 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-200 hover:rotate-90"
              >
                <FaTimes className="text-white text-lg" />
              </button>

              {/* Header Section */}
              <div className="flex items-center justify-between gap-4 mb-6">
                {/* Right: Title & Icon */}
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center flex-shrink-0">
                    <FaPills className="text-3xl text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-white">روشتة طبية</h2>
                    <p className="text-sm text-white/80 font-medium">{prescription.prescriptionNumber}</p>
                  </div>
                </div>

                {/* Left: Stats */}
                <div className="flex items-center gap-4 ml-14">
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2.5">
                    <span className="text-xs text-white/70 font-semibold block mb-0.5">المتوفر</span>
                    <p className="text-xl font-black text-white">{countAvailable()}/{prescription.medications.length}</p>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2.5">
                    <span className="text-xs text-white/70 font-semibold block mb-0.5">الإجمالي</span>
                    <p className="text-xl font-black text-white">{calculateTotal()} ج.م</p>
                  </div>
                </div>
              </div>

              {/* Info Bar - Clean & Simple */}
              <div className="bg-white rounded-xl p-5 shadow-lg">
                <div className="grid grid-cols-3 gap-6">
                  {/* Patient */}
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                      <span className="text-2xl">👤</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-500 font-bold mb-1 uppercase tracking-wide">المريض</p>
                      <p className="text-lg font-black text-slate-800 truncate">{prescription.patient?.name}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{prescription.patient?.phone}</p>
                    </div>
                  </div>

                  {/* Doctor */}
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                      <span className="text-2xl">🩺</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-wide">الطبيب</p>
                        <p className="text-xs text-emerald-600 font-bold">({prescription.doctor?.specialty})</p>
                      </div>
                      <p className="text-lg font-black text-slate-800 truncate mt-1">{prescription.doctor?.name}</p>
                    </div>
                  </div>

                  {/* Date */}
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                      <span className="text-2xl">📅</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-500 font-bold mb-1 uppercase tracking-wide">تاريخ الروشتة</p>
                      <p className="text-lg font-black text-slate-800">{formatDate(prescription.createdAt)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Medications List - Scrollable */}
            <div className="flex-1 overflow-y-auto p-6 space-y-3">
              {prescription.medications.map((medication, index) => {
                // Use same ID logic as everywhere else
                const medId = (medication.id || medication.medicationId || medication.drugId || index).toString();
                const state = medicationStates[medId] || {};
                const isExpanded = expandedMeds[medId];

                // Determine status
                let statusColor = 'green';
                let statusIcon = FaCheckCircle;
                let statusText = 'متوفر';

                if (!state.isAvailable) {
                  if (state.hasAlternative) {
                    statusColor = 'yellow';
                    statusIcon = FaExchangeAlt;
                    statusText = 'بديل';
                  } else {
                    statusColor = 'red';
                    statusIcon = FaTimesCircle;
                    statusText = 'غير متوفر';
                  }
                }

                const StatusIcon = statusIcon;

                return (
                  <div
                    key={index}
                    className={`border-2 rounded-2xl overflow-hidden transition-all duration-300 ${statusColor === 'green' ? 'border-green-200 bg-green-50/30' :
                      statusColor === 'yellow' ? 'border-yellow-200 bg-yellow-50/30' :
                        'border-red-200 bg-red-50/30'
                      }`}
                  >
                    {/* Compact Header - Always Visible */}
                    <div
                      className="p-4 cursor-pointer hover:bg-white/50 transition-colors"
                      onClick={() => toggleMedication(medId)}
                    >
                      <div className="flex items-center justify-between gap-4">
                        {/* Left: Number + Name */}
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="w-8 h-8 bg-slate-800 text-white rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0">
                            {index + 1}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="text-lg font-bold text-slate-800 truncate">{medication.medicationName}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full font-semibold">
                                {medication.dosage}
                              </span>
                              <span className="text-xs text-slate-500">• {medication.frequency}</span>
                            </div>
                          </div>
                        </div>

                        {/* Right: Status + Price + Expand */}
                        <div className="flex items-center gap-3 flex-shrink-0">
                          {/* Status Badge */}
                          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${statusColor === 'green' ? 'bg-green-100 text-green-700' :
                            statusColor === 'yellow' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-red-100 text-red-700'
                            }`}>
                            <StatusIcon className="text-sm" />
                            <span className="text-xs font-bold">{statusText}</span>
                          </div>

                          {/* Price Display */}
                          {((state.isAvailable && state.price) || (!state.isAvailable && state.hasAlternative && state.alternativePrice)) && (
                            <div className="px-3 py-1.5 bg-slate-800 text-white rounded-full">
                              <span className="text-sm font-bold">
                                {state.isAvailable ? state.price : state.alternativePrice} ج.م
                              </span>
                            </div>
                          )}

                          {/* Expand Icon */}
                          <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                            {isExpanded ?
                              <FaChevronUp className="text-slate-600 text-sm" /> :
                              <FaChevronDown className="text-slate-600 text-sm" />
                            }
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {isExpanded && (
                      <div className="px-4 pb-4 space-y-4 animate-slideDown">
                        {/* Medication Info */}
                        <div className="flex flex-wrap gap-2 pb-3 border-b border-slate-200">
                          <span className="text-xs px-2.5 py-1 bg-white rounded-lg border border-slate-200">
                            <span className="text-slate-500">المدة:</span> <span className="font-bold text-slate-700">{medication.durationDays} يوم</span>
                          </span>
                          {medication.specialInstructions && (
                            <span className="text-xs px-2.5 py-1 bg-white rounded-lg border border-slate-200">
                              <span className="text-slate-500">التعليمات:</span> <span className="font-bold text-slate-700">{medication.specialInstructions}</span>
                            </span>
                          )}
                        </div>

                        {/* Availability Toggle */}
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleAvailabilityChange(medId, true)}
                            className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-sm transition-all ${state.isAvailable
                              ? 'bg-green-500 text-white shadow-md'
                              : 'bg-white border-2 border-slate-200 text-slate-600 hover:border-green-300'
                              }`}
                          >
                            <FaCheckCircle className="inline mr-2" />
                            متوفر
                          </button>
                          <button
                            onClick={() => handleAvailabilityChange(medId, false)}
                            className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-sm transition-all ${!state.isAvailable
                              ? 'bg-red-500 text-white shadow-md'
                              : 'bg-white border-2 border-slate-200 text-slate-600 hover:border-red-300'
                              }`}
                          >
                            <FaTimesCircle className="inline mr-2" />
                            غير متوفر
                          </button>
                        </div>

                        {/* Available Form */}
                        {state.isAvailable && (
                          <div className="grid grid-cols-3 gap-3 p-4 bg-white rounded-xl border-2 border-green-200">
                            <div>
                              <label className="block text-xs font-bold text-slate-700 mb-1.5">الكمية</label>
                              <input
                                type="number"
                                value={state.quantity}
                                onChange={(e) => handleFieldChange(medId, 'quantity', e.target.value)}
                                placeholder="0"
                                min="0"
                                className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg text-sm font-bold focus:border-[#00b19f] focus:ring-2 focus:ring-[#00b19f]/20 outline-none"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-slate-700 mb-1.5">النوع</label>
                              <select
                                value={state.unitType}
                                onChange={(e) => handleFieldChange(medId, 'unitType', e.target.value)}
                                className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg text-sm font-semibold focus:border-[#00b19f] focus:ring-2 focus:ring-[#00b19f]/20 outline-none"
                              >
                                {MEDICATION_UNITS.map(unit => (
                                  <option key={unit.value} value={unit.value}>{unit.label}</option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-slate-700 mb-1.5">السعر (ج.م)</label>
                              <input
                                type="number"
                                value={state.price}
                                onChange={(e) => handleFieldChange(medId, 'price', e.target.value)}
                                placeholder="0.00"
                                min="0"
                                step="0.01"
                                className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg text-sm font-bold focus:border-[#00b19f] focus:ring-2 focus:ring-[#00b19f]/20 outline-none"
                              />
                            </div>
                          </div>
                        )}

                        {/* Not Available - Alternative Options */}
                        {!state.isAvailable && (
                          <div className="space-y-3">
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => handleFieldChange(medId, 'hasAlternative', false)}
                                className={`flex-1 py-2 px-3 rounded-lg text-sm font-bold transition-all ${!state.hasAlternative
                                  ? 'bg-red-100 text-red-700 border-2 border-red-300'
                                  : 'bg-white border-2 border-slate-200 text-slate-600'
                                  }`}
                              >
                                لا يوجد بديل
                              </button>
                              <button
                                onClick={() => handleFieldChange(medId, 'hasAlternative', true)}
                                className={`flex-1 py-2 px-3 rounded-lg text-sm font-bold transition-all ${state.hasAlternative
                                  ? 'bg-yellow-100 text-yellow-700 border-2 border-yellow-300'
                                  : 'bg-white border-2 border-slate-200 text-slate-600'
                                  }`}
                              >
                                <FaExchangeAlt className="inline mr-1" />
                                يوجد بديل
                              </button>
                            </div>

                            {state.hasAlternative && (
                              <div className="grid grid-cols-3 gap-3 p-4 bg-white rounded-xl border-2 border-yellow-200">
                                <div>
                                  <label className="block text-xs font-bold text-slate-700 mb-1.5">اسم البديل</label>
                                  <input
                                    type="text"
                                    value={state.alternativeName}
                                    onChange={(e) => handleFieldChange(medId, 'alternativeName', e.target.value)}
                                    placeholder="اسم الدواء"
                                    className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg text-sm font-semibold focus:border-[#00b19f] focus:ring-2 focus:ring-[#00b19f]/20 outline-none"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-bold text-slate-700 mb-1.5">النوع</label>
                                  <select
                                    value={state.alternativeUnitType}
                                    onChange={(e) => handleFieldChange(medId, 'alternativeUnitType', e.target.value)}
                                    className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg text-sm font-semibold focus:border-[#00b19f] focus:ring-2 focus:ring-[#00b19f]/20 outline-none"
                                  >
                                    {MEDICATION_UNITS.map(unit => (
                                      <option key={unit.value} value={unit.value}>{unit.label}</option>
                                    ))}
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-xs font-bold text-slate-700 mb-1.5">السعر (ج.م)</label>
                                  <input
                                    type="number"
                                    value={state.alternativePrice}
                                    onChange={(e) => handleFieldChange(medId, 'alternativePrice', e.target.value)}
                                    placeholder="0.00"
                                    className="w-full px-3 py-2 border-2 border-slate-200 rounded-lg text-sm font-bold focus:border-[#00b19f] focus:ring-2 focus:ring-[#00b19f]/20 outline-none"
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Footer - Fixed at Bottom */}
            <div className="flex-shrink-0 border-t-2 border-slate-200 p-6 bg-slate-50">
              {/* Notes */}
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="💬 ملاحظات إضافية للمريض..."
                rows={2}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-sm focus:border-[#00b19f] focus:ring-2 focus:ring-[#00b19f]/20 outline-none resize-none mb-4"
              />

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={handleSendReport}
                  disabled={isSubmitting || !canSend}
                  className="flex-1 bg-gradient-to-r from-[#00b19f] to-[#00d4be] hover:from-[#00a08d] hover:to-[#00c4b0] text-white font-bold py-3.5 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-[1.02] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      جاري الإرسال...
                    </>
                  ) : (
                    <>
                      <FaCheck className="text-lg" />
                      إرسال التقرير
                    </>
                  )}
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-3.5 bg-white hover:bg-slate-100 text-slate-700 font-bold rounded-xl border-2 border-slate-200 transition-all"
                >
                  إلغاء
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes slideDown {
          from { max-height: 0; opacity: 0; }
          to { max-height: 500px; opacity: 1; }
        }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
        .animate-slideUp { animation: slideUp 0.3s ease-out; }
        .animate-slideDown { animation: slideDown 0.3s ease-out; }
      `}</style>
    </div>
  );
};

export default PrescriptionModal;
