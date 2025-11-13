import React, { useState } from 'react';
import { FaMapMarkerAlt, FaTruck, FaTimes, FaStar, FaPhone, FaPaperPlane, FaFileAlt, FaCheckCircle } from 'react-icons/fa';
import usePharmacy from '../hooks/usePharmacy';

/**
 * NearbyPharmaciesView Component
 * Displays the 3 nearest pharmacies for prescription ordering
 */
const NearbyPharmaciesView = ({ pharmacies = [], loading, onClose, onSelectPharmacy, prescription }) => {
  const [sentPharmacies, setSentPharmacies] = useState(new Set());
  const [sendingPharmacy, setSendingPharmacy] = useState(null);

  // Use pharmacy hook for sending prescriptions
  const { sendPrescriptionToPharmacy } = usePharmacy();

  // Ensure pharmacies is always an array
  const safePharmacies = Array.isArray(pharmacies) ? pharmacies : [];
  
  console.log('🏪 [NearbyPharmaciesView] Received pharmacies:', pharmacies);
  console.log('🏪 [NearbyPharmaciesView] Safe pharmacies:', safePharmacies);

  const handleSendPrescription = async (pharmacy) => {
    if (!prescription?.id) {
      console.error('❌ No prescription ID provided');
      alert('خطأ: لا يوجد معرف للروشتة');
      return;
    }

    setSendingPharmacy(pharmacy.id);
    console.log('📤 Sending prescription to pharmacy:', pharmacy.name, 'Prescription ID:', prescription.id);
    
    try {
      // Use real API to send prescription via hook
      const result = await sendPrescriptionToPharmacy(prescription.id, pharmacy.id);
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      // Mark as sent
      setSentPharmacies(prev => new Set([...prev, pharmacy.id]));
      console.log('✅ Prescription sent successfully to:', pharmacy.name);
      
      // Show success message
      alert(`تم إرسال الروشتة بنجاح إلى ${pharmacy.name}`);
    } catch (error) {
      console.error('❌ Error sending prescription:', error);
      
      // Show user-friendly error message
      const errorMessage = error.response?.data?.message || 'فشل في إرسال الروشتة. يرجى المحاولة مرة أخرى.';
      alert(errorMessage);
    } finally {
      setSendingPharmacy(null);
    }
  };

  const handleViewReport = (pharmacy) => {
    console.log('📋 Viewing report from pharmacy:', pharmacy.name);
    onSelectPharmacy && onSelectPharmacy(pharmacy);
  };
  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-slate-600 font-semibold text-lg">جاري البحث عن أقرب الصيدليات...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-black text-slate-800">أقرب الصيدليات</h3>
          <p className="text-slate-600 font-semibold mt-1">اختر الصيدلية المناسبة لك</p>
        </div>
        <button
          onClick={onClose}
          className="w-10 h-10 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center transition-all"
        >
          <FaTimes className="text-slate-600" />
        </button>
      </div>

      {/* Pharmacies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {safePharmacies.map((pharmacy, index) => (
          <div
            key={pharmacy.id}
            className="bg-white border-2 border-slate-200 rounded-2xl p-5 hover:border-teal-400 hover:shadow-lg transition-all duration-200 cursor-pointer group"
            onClick={() => onSelectPharmacy && onSelectPharmacy(pharmacy)}
          >
            {/* Rank Badge */}
            <div className="flex items-start justify-between mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-black text-sm">#{index + 1}</span>
              </div>
              {pharmacy.rating && (
                <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg">
                  <FaStar className="text-amber-500 text-xs" />
                  <span className="text-amber-700 font-bold text-xs">{pharmacy.rating}</span>
                </div>
              )}
            </div>

            {/* Profile Image */}
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-teal-100 group-hover:border-teal-300 transition-all">
                <img
                  src={pharmacy.profileImageUrl}
                  alt={pharmacy.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/150/00b19f/ffffff?text=صيدلية';
                  }}
                />
              </div>
            </div>

            {/* Pharmacy Name */}
            <h4 className="text-lg font-black text-slate-800 text-center mb-3 group-hover:text-teal-600 transition-colors">
              {pharmacy.name}
            </h4>

            {/* Distance */}
            <div className="flex items-center justify-center gap-2 mb-3 bg-slate-50 rounded-lg py-2 px-3">
              <FaMapMarkerAlt className="text-teal-600 text-sm" />
              <span className="text-slate-700 font-bold text-sm">
                {pharmacy.distanceInKm || pharmacy.distanceKm} كم
              </span>
            </div>

            {/* Delivery Info */}
            <div className="mt-3 pt-3 border-t border-slate-200">
              {(pharmacy.offersDelivery || pharmacy.hasDelivery) ? (
                <div className="flex items-center justify-between bg-teal-50 rounded-lg py-2 px-3">
                  <div className="flex items-center gap-2">
                    <FaTruck className="text-teal-600 text-sm" />
                    <span className="text-teal-700 font-bold text-xs">توصيل متاح</span>
                  </div>
                  <span className="text-teal-700 font-black text-sm">
                    {pharmacy.deliveryFee === 0 ? 'مجاناً' : `${pharmacy.deliveryFee} ج.م`}
                  </span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2 bg-slate-100 rounded-lg py-2 px-3">
                  <FaTimes className="text-slate-500 text-xs" />
                  <span className="text-slate-600 font-bold text-xs">لا يوجد توصيل</span>
                </div>
              )}
            </div>

            {/* Phone (Optional - shown on hover) */}
            {pharmacy.phoneNumber && (
              <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex items-center justify-center gap-2 text-slate-600">
                  <FaPhone className="text-xs" />
                  <span className="text-xs font-semibold">{pharmacy.phoneNumber}</span>
                </div>
              </div>
            )}

            {/* Action Button */}
            {sentPharmacies.has(pharmacy.id) ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleViewReport(pharmacy);
                }}
                className="w-full mt-4 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                <FaFileAlt className="text-sm" />
                عرض التقرير
              </button>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleSendPrescription(pharmacy);
                }}
                disabled={sendingPharmacy === pharmacy.id}
                className="w-full mt-4 px-4 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {sendingPharmacy === pharmacy.id ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>جاري الإرسال...</span>
                  </>
                ) : (
                  <>
                    <FaPaperPlane className="text-sm" />
                    إرسال الروشتة
                  </>
                )}
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Empty State */}
      {safePharmacies.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FaMapMarkerAlt className="text-4xl text-slate-400" />
          </div>
          <h3 className="text-xl font-bold text-slate-700 mb-2">لا توجد صيدليات قريبة</h3>
          <p className="text-slate-500">لم نتمكن من العثور على صيدليات في منطقتك</p>
        </div>
      )}
    </div>
  );
};

export default NearbyPharmaciesView;
