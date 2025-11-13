import React, { useState } from 'react';
import { 
  FaTimes, 
  FaFilePrescription, 
  FaMapMarkerAlt, 
  FaCheckCircle, 
  FaSearch,
  FaArrowLeft,
  FaFileAlt,
  FaPlus,
  FaStore,
  FaPills
} from 'react-icons/fa';
import NearbyPharmaciesView from './NearbyPharmaciesView';
import PharmacyReportModal from './PharmacyReportModal';
import usePharmacy from '../hooks/usePharmacy';
import patientService from '../../../api/services/patient.service';

/**
 * OrderPrescriptionModal Component
 * Modal for ordering prescription from nearby pharmacies
 */
const OrderPrescriptionModal = ({ isOpen, onClose, prescription }) => {
  const [showResults, setShowResults] = useState(false);
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [pharmacyReport, setPharmacyReport] = useState(null);
  const [showReports, setShowReports] = useState(false);
  const [pharmacyReports, setPharmacyReports] = useState([]);

  // Use pharmacy hook
  const {
    nearbyPharmacies,
    loading: isSearching,
    fetchNearbyPharmacies,
    clearError,
  } = usePharmacy();

  // Check if there are existing reports for this prescription
  const checkExistingReports = async () => {
    try {
      // For now, we'll simulate checking multiple orders
      // In reality, you'd have a list of order IDs for this prescription
      const mockOrderIds = ['order-1', 'order-2']; // These would come from prescription data
      
      const reports = [];
      
      for (const orderId of mockOrderIds) {
        try {
          const response = await patientService.getPharmacyResponse(orderId);
          if (response) {
            // Transform API response to match our UI format
            reports.push({
              orderId: response.orderId,
              pharmacyId: response.orderId, // Using orderId as unique identifier
              pharmacyName: response.pharmacyName,
              pharmacyAddress: '', // Not in API response, could be added later
              pharmacyPhone: response.pharmacyPhone,
              rating: 4.5, // Default rating, could be fetched separately
              hasReport: true,
              reportStatus: 'completed',
              totalAmount: response.totalAmount,
              deliveryAvailable: response.deliveryAvailable,
              deliveryFee: response.deliveryFee,
              responseTime: response.respondedAt,
              apiResponse: response // Store full API response for detailed view
            });
          }
        } catch {
          console.log(`No response found for order ${orderId}`);
          // Continue checking other orders
        }
      }
      
      return reports;
    } catch (error) {
      console.error('Error checking existing reports:', error);
      return [];
    }
  };

  const handleSearch = async () => {
    console.log('🔍 Searching for nearby pharmacies for prescription:', prescription?.id);
    
    // Check if there are existing reports first
    const existingReports = await checkExistingReports();
    if (existingReports.length > 0) {
      setPharmacyReports(existingReports);
      setShowReports(true);
      return;
    }
    
    // Clear any previous errors
    clearError();
    
    const result = await fetchNearbyPharmacies();
    
    if (result.success) {
      setShowResults(true);
    } else {
      // Show user-friendly error message
      alert('حدث خطأ أثناء البحث عن الصيدليات. يرجى المحاولة مرة أخرى.');
    }
  };

  const handleSelectPharmacy = async (pharmacy) => {
    console.log('✅ Opening report for pharmacy:', pharmacy);
    setSelectedPharmacy(pharmacy);
    
    // For now, use mock data since this is for new pharmacy selection
    // In real implementation, this would create a new order and get response
    const mockReport = {
      pharmacyName: pharmacy.name,
      medications: prescription?.medications || [],
      totalAmount: 0,
      deliveryAvailable: true,
      deliveryFee: 10
    };
    
    setPharmacyReport(mockReport);
    setIsReportModalOpen(true);
  };

  const handleBack = () => {
    setShowResults(false);
    // If we have existing reports, go back to reports view
    if (pharmacyReports.length > 0) {
      setShowReports(true);
    }
    // Note: We keep the pharmacies data in store for potential reuse
  };

  const handleCloseReportModal = () => {
    setIsReportModalOpen(false);
    setPharmacyReport(null);
    setSelectedPharmacy(null);
  };

  const handleViewReport = async (pharmacy) => {
    console.log('📋 Viewing report for pharmacy:', pharmacy.pharmacyName);
    
    try {
      // Use the stored API response if available
      if (pharmacy.apiResponse) {
        setPharmacyReport(pharmacy.apiResponse);
        setSelectedPharmacy(pharmacy);
        setIsReportModalOpen(true);
      } else {
        // Fallback: fetch from API using orderId
        const response = await patientService.getPharmacyResponse(pharmacy.orderId);
        if (response) {
          setPharmacyReport(response);
          setSelectedPharmacy(pharmacy);
          setIsReportModalOpen(true);
        } else {
          alert('لا يمكن جلب تفاصيل التقرير في الوقت الحالي');
        }
      }
    } catch (error) {
      console.error('Error fetching pharmacy report:', error);
      alert('حدث خطأ أثناء جلب تفاصيل التقرير');
    }
  };

  const handleNewOrder = () => {
    // Reset all states to start fresh
    setShowReports(false);
    setShowResults(false);
    setPharmacyReports([]);
    setSelectedPharmacy(null);
    setPharmacyReport(null);
    setIsReportModalOpen(false);
  };


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-6xl w-full overflow-hidden animate-slideUp max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="relative bg-gradient-to-br from-teal-500 via-teal-600 to-emerald-600 p-8">
          <button
            onClick={onClose}
            className="absolute top-4 left-4 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-200 hover:rotate-90"
          >
            <FaTimes className="text-white text-lg" />
          </button>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center flex-shrink-0">
              <FaPills className="text-4xl text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-white mb-1">طلب روشتة</h2>
              <p className="text-sm text-white/80 font-semibold">
                رقم الروشتة: {prescription?.prescriptionNumber || 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        {showReports ? (
          /* Pharmacy Reports View */
          <div className="p-8 space-y-6">
            {/* Header */}
            <div className="text-center mb-6">
              <h3 className="text-2xl font-black text-slate-800 mb-2">التقارير الواردة</h3>
              <p className="text-slate-600 font-semibold">
                تم استلام {pharmacyReports.length} تقرير من الصيدليات
              </p>
            </div>

            {/* Pharmacy Reports Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pharmacyReports.map((pharmacy) => (
                <div key={pharmacy.pharmacyId} className="bg-white border-2 border-slate-200 rounded-2xl p-6 hover:border-teal-300 hover:shadow-lg transition-all duration-200">
                  {/* Pharmacy Header */}
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <FaStore className="text-white text-xl" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-black text-slate-800 text-lg mb-1">{pharmacy.pharmacyName}</h4>
                      <p className="text-slate-500 text-sm">{pharmacy.pharmacyAddress}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <FaCheckCircle 
                              key={i} 
                              className={`text-xs ${i < Math.floor(pharmacy.rating) ? 'text-amber-400' : 'text-slate-300'}`} 
                            />
                          ))}
                        </div>
                        <span className="text-xs text-slate-600 font-semibold">{pharmacy.rating}</span>
                      </div>
                    </div>
                  </div>

                  {/* Report Summary */}
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600 font-semibold">إجمالي المبلغ:</span>
                      <span className="font-black text-teal-600">{pharmacy.totalAmount} جنيه</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600 font-semibold">التوصيل:</span>
                      <span className={`font-semibold ${pharmacy.deliveryAvailable ? 'text-green-600' : 'text-red-600'}`}>
                        {pharmacy.deliveryAvailable ? `متاح (${pharmacy.deliveryFee} جنيه)` : 'غير متاح'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600 font-semibold">وقت الرد:</span>
                      <span className="text-slate-500 text-sm">
                        {new Date(pharmacy.responseTime).toLocaleTimeString('ar-EG', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => handleViewReport(pharmacy)}
                    className="w-full px-4 py-3 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white font-bold rounded-xl transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2"
                  >
                    <FaFileAlt className="text-sm" />
                    <span>عرض التقرير</span>
                  </button>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-4">
              <button
                onClick={handleNewOrder}
                className="flex-1 px-6 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
              >
                <FaPlus className="text-xl" />
                <span>طلب جديد</span>
              </button>
              <button
                onClick={onClose}
                className="px-6 py-4 bg-white hover:bg-slate-100 text-slate-700 font-bold rounded-xl border-2 border-slate-200 transition-all"
              >
                إغلاق
              </button>
            </div>
          </div>
        ) : showResults ? (
          <NearbyPharmaciesView
            pharmacies={nearbyPharmacies}
            loading={isSearching}
            onClose={handleBack}
            onSelectPharmacy={handleSelectPharmacy}
            prescription={prescription}
          />
        ) : (
        <div className="p-8 space-y-6">
          {/* Info Card */}
          <div className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-2xl p-6 border-2 border-teal-200">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <FaMapMarkerAlt className="text-white text-xl" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-black text-slate-800 mb-2">كيف يعمل النظام؟</h3>
                <p className="text-slate-600 leading-relaxed font-semibold">
                  سيقوم النظام بالبحث عن <span className="text-teal-600 font-black">أقرب 3 صيدليات</span> من موقعك الحالي وإرسال الروشتة لهم للتأكد من توفر جميع الأدوية. ستتلقى ردودهم مع الأسعار والبدائل المتاحة لتختار الأنسب لك.
                </p>
              </div>
            </div>
          </div>

          {/* Features List */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <FaCheckCircle className="text-teal-600" />
              </div>
              <p className="text-slate-700 font-semibold">مقارنة الأسعار بين الصيدليات</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <FaCheckCircle className="text-teal-600" />
              </div>
              <p className="text-slate-700 font-semibold">معرفة البدائل المتاحة للأدوية</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <FaCheckCircle className="text-teal-600" />
              </div>
              <p className="text-slate-700 font-semibold">توصيل سريع لباب المنزل</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-4">
            <button
              onClick={handleSearch}
              disabled={isSearching}
              className="flex-1 px-6 py-4 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white font-black rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {isSearching ? (
                <>
                  <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>جاري البحث...</span>
                </>
              ) : (
                <>
                  <FaSearch className="text-xl" />
                  <span>ابحث الآن</span>
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="px-6 py-4 bg-white hover:bg-slate-100 text-slate-700 font-bold rounded-xl border-2 border-slate-200 transition-all"
            >
              إلغاء
            </button>
          </div>
        </div>
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
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>

      {/* Pharmacy Report Modal */}
      <PharmacyReportModal
        isOpen={isReportModalOpen}
        onClose={handleCloseReportModal}
        pharmacy={selectedPharmacy}
        report={pharmacyReport}
      />
    </div>
  );
};

export default OrderPrescriptionModal;
