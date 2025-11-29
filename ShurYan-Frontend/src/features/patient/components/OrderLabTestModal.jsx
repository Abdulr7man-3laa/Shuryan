import React, { useState } from 'react';
import { 
  FaTimes, 
  FaFlask, 
  FaMapMarkerAlt, 
  FaCheckCircle, 
  FaSearch,
  FaArrowLeft,
  FaVial,
  FaPhone,
  FaHome,
  FaMapPin
} from 'react-icons/fa';
import patientService from '../../../api/services/patient.service';

/**
 * OrderLabTestModal Component
 * Modal for ordering lab test from nearby laboratories
 * @param {boolean} isOpen - Modal open state
 * @param {function} onClose - Close modal callback
 * @param {Object} labPrescription - Lab prescription object
 */
const OrderLabTestModal = ({ isOpen, onClose, labPrescription }) => {
  const [loading, setLoading] = useState(false);
  const [nearbyLaboratories, setNearbyLaboratories] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [searchStats, setSearchStats] = useState({ totalFound: 0, searchRadiusKm: 0 });
  const [selectedLaboratory, setSelectedLaboratory] = useState(null);
  const [showSampleCollectionChoice, setShowSampleCollectionChoice] = useState(false);

  const handleSearch = async () => {
    console.log('🔍 Searching for nearby laboratories for lab prescription:', labPrescription?.id);
    setLoading(true);
    
    try {
      // Get patient location from browser (optional - can be from user profile)
      // For now, using default values or can be passed from parent component
      const params = {
        pageNumber: 1,
        pageSize: 20,
        radiusInKm: 10, // Search within 10km radius
        // offersHomeSampleCollection: false, // Optional filter
        // latitude: 30.0444, // Can be from user location
        // longitude: 31.2357 // Can be from user location
      };

      const response = await patientService.getNearbyLaboratories(params);
      console.log('✅ Nearby laboratories response:', response);
      
      const laboratories = response.nearbyLaboratories || [];
      setNearbyLaboratories(laboratories);
      setSearchStats({
        totalFound: response.totalFound || 0,
        searchRadiusKm: response.searchRadiusKm || 0
      });
      setShowResults(true);
    } catch (error) {
      console.error('Error fetching laboratories:', error);
      alert('حدث خطأ أثناء البحث عن المعامل. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectLaboratory = (laboratory) => {
    console.log('✅ Selected laboratory:', laboratory);
    setSelectedLaboratory(laboratory);
    setShowSampleCollectionChoice(true);
  };

  const handleCreateOrder = async (sampleCollectionType) => {
    if (!selectedLaboratory || !labPrescription) return;
    
    console.log('📝 Creating lab order with sample collection type:', sampleCollectionType);
    setLoading(true);
    
    try {
      const orderData = {
        labPrescriptionId: labPrescription.id,
        laboratoryId: selectedLaboratory.id,
        sampleCollectionType: sampleCollectionType
      };
      
      const order = await patientService.createLabOrder(orderData);
      console.log('✅ Order created:', order);
      
      alert(`تم إرسال طلب التحليل إلى ${selectedLaboratory.name} بنجاح! سيتم التواصل معك قريباً.`);
      onClose();
    } catch (error) {
      console.error('❌ Error creating lab order:', error);
      alert('حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLaboratories = () => {
    setShowSampleCollectionChoice(false);
    setSelectedLaboratory(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-6xl w-full overflow-hidden animate-slideUp max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="relative bg-gradient-to-br from-teal-500 via-emerald-600 to-cyan-600 p-8">
          <button
            onClick={onClose}
            className="absolute top-4 left-4 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-200 hover:rotate-90"
          >
            <FaTimes className="text-white text-lg" />
          </button>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center flex-shrink-0">
              <FaVial className="text-4xl text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-white mb-1">طلب تحليل</h2>
              <p className="text-sm text-white/80 font-semibold">
                من د. {labPrescription?.doctorName || 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {showSampleCollectionChoice ? (
            /* Sample Collection Type Choice */
            <div className="space-y-6">
              {/* Header with Back Button */}
              <div className="flex items-center gap-4 mb-6">
                <button
                  onClick={handleBackToLaboratories}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all"
                >
                  <FaArrowLeft />
                  <span>رجوع</span>
                </button>
                <div>
                  <h3 className="text-2xl font-black text-slate-800">اختر طريقة جمع العينة</h3>
                  <p className="text-sm text-slate-500 font-semibold">المعمل المختار: {selectedLaboratory?.name}</p>
                </div>
              </div>

              {/* Sample Collection Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Lab Visit Option */}
                <button
                  onClick={() => handleCreateOrder(1)}
                  disabled={loading}
                  className="group relative bg-white border-2 border-slate-200 rounded-2xl p-8 hover:border-teal-400 hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="absolute top-4 right-4 w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                    <FaFlask className="text-teal-600 text-xl" />
                  </div>
                  
                  <div className="mt-8">
                    <h4 className="text-2xl font-black text-slate-800 mb-3">زيارة المعمل</h4>
                    <p className="text-slate-600 font-semibold mb-4">
                      احضر إلى المعمل لأخذ العينة
                    </p>
                    
                    <div className="bg-teal-50 rounded-xl p-4 border border-teal-200 mb-4">
                      <ul className="space-y-2 text-sm">
                        <li className="flex items-center gap-2">
                          <FaCheckCircle className="text-teal-600 flex-shrink-0" />
                          <span className="font-semibold text-slate-700">نتائج أسرع</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <FaCheckCircle className="text-teal-600 flex-shrink-0" />
                          <span className="font-semibold text-slate-700">دقة عالية</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <FaCheckCircle className="text-teal-600 flex-shrink-0" />
                          <span className="font-semibold text-slate-700">بدون رسوم إضافية</span>
                        </li>
                      </ul>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-3xl font-black text-teal-600">مجاناً</span>
                      <div className="px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-600 text-white font-bold rounded-xl group-hover:scale-105 transition-transform">
                        اختر
                      </div>
                    </div>
                  </div>
                </button>

                {/* Home Sample Collection Option */}
                <button
                  onClick={() => handleCreateOrder(2)}
                  disabled={loading || !selectedLaboratory?.offersHomeSampleCollection}
                  className="group relative bg-white border-2 border-slate-200 rounded-2xl p-8 hover:border-emerald-400 hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="absolute top-4 right-4 w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                    <FaHome className="text-emerald-600 text-xl" />
                  </div>
                  
                  <div className="mt-8">
                    <h4 className="text-2xl font-black text-slate-800 mb-3">جمع عينة من المنزل</h4>
                    <p className="text-slate-600 font-semibold mb-4">
                      سيأتي المندوب لمنزلك لأخذ العينة
                    </p>
                    
                    {selectedLaboratory?.offersHomeSampleCollection ? (
                      <>
                        <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-200 mb-4">
                          <ul className="space-y-2 text-sm">
                            <li className="flex items-center gap-2">
                              <FaCheckCircle className="text-emerald-600 flex-shrink-0" />
                              <span className="font-semibold text-slate-700">راحة تامة</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <FaCheckCircle className="text-emerald-600 flex-shrink-0" />
                              <span className="font-semibold text-slate-700">توفير الوقت</span>
                            </li>
                            <li className="flex items-center gap-2">
                              <FaCheckCircle className="text-emerald-600 flex-shrink-0" />
                              <span className="font-semibold text-slate-700">مناسب للعائلة</span>
                            </li>
                          </ul>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-3xl font-black text-emerald-600">
                            {selectedLaboratory.homeSampleCollectionFee > 0 
                              ? `${selectedLaboratory.homeSampleCollectionFee} ج.م` 
                              : 'مجاناً'}
                          </span>
                          <div className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-xl group-hover:scale-105 transition-transform">
                            اختر
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-center">
                        <p className="text-slate-500 font-semibold text-sm">
                          هذا المعمل لا يوفر خدمة جمع العينات المنزلية
                        </p>
                      </div>
                    )}
                  </div>
                </button>
              </div>

              {loading && (
                <div className="flex items-center justify-center py-8">
                  <div className="w-8 h-8 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin"></div>
                  <span className="mr-3 text-slate-600 font-semibold">جاري إرسال الطلب...</span>
                </div>
              )}
            </div>
          ) : !showResults ? (
            /* Initial View */
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-teal-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaFlask className="text-5xl text-teal-600" />
                </div>
                <h3 className="text-2xl font-black text-slate-800 mb-2">ابحث عن معمل قريب</h3>
                <p className="text-slate-600 font-semibold">
                  سنساعدك في العثور على أفضل المعامل القريبة منك
                </p>
              </div>

              <div className="bg-teal-50 rounded-2xl p-6 border-2 border-teal-200">
                <div className="flex items-start gap-3">
                  <FaMapMarkerAlt className="text-teal-600 text-2xl flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-black text-slate-800 mb-2">كيف يعمل؟</h4>
                    <ul className="space-y-2 text-slate-700">
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-teal-600 rounded-full"></div>
                        <span className="font-semibold">ابحث عن المعامل القريبة منك</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-teal-600 rounded-full"></div>
                        <span className="font-semibold">اختر المعمل المناسب</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-teal-600 rounded-full"></div>
                        <span className="font-semibold">سيتم إرسال طلب التحليل مباشرة</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-teal-600 rounded-full"></div>
                        <span className="font-semibold">سيتواصل معك المعمل لتحديد الموعد</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <button
                onClick={handleSearch}
                disabled={loading}
                className="w-full px-6 py-4 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white font-black rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>جاري البحث...</span>
                  </>
                ) : (
                  <>
                    <FaSearch className="text-xl" />
                    <span>ابحث عن المعامل القريبة</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            /* Laboratories List */
            <div className="space-y-6">
              {/* Header with Stats */}
              <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-2xl p-4 border border-teal-200">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-2xl font-black text-slate-800">المعامل القريبة</h3>
                  <button
                    onClick={() => setShowResults(false)}
                    className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-xl transition-all shadow-sm"
                  >
                    <FaArrowLeft />
                    <span>رجوع</span>
                  </button>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <FaFlask className="text-teal-600" />
                    <span className="font-semibold text-slate-600">وجدنا <span className="font-black text-teal-600">{searchStats.totalFound}</span> معمل</span>
                  </div>
                  {searchStats.searchRadiusKm > 0 && (
                    <div className="flex items-center gap-2">
                      <FaMapPin className="text-teal-600" />
                      <span className="font-semibold text-slate-600">ضمن دائرة <span className="font-black text-teal-600">{searchStats.searchRadiusKm.toFixed(1)}</span> كم</span>
                    </div>
                  )}
                </div>
              </div>

              {nearbyLaboratories.length === 0 ? (
                <div className="text-center py-10 bg-slate-50 rounded-2xl">
                  <p className="text-slate-600 font-semibold">لا توجد معامل قريبة في الوقت الحالي</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {nearbyLaboratories.map((laboratory) => (
                    <div key={laboratory.id} className="bg-white border-2 border-slate-200 rounded-2xl p-6 hover:border-teal-300 hover:shadow-lg transition-all duration-200">
                      {/* Header */}
                      <div className="flex items-start gap-3 mb-4">
                        {laboratory.profileImageUrl ? (
                          <img 
                            src={laboratory.profileImageUrl} 
                            alt={laboratory.name}
                            className="w-14 h-14 rounded-xl object-cover flex-shrink-0 border-2 border-teal-200"
                          />
                        ) : (
                          <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
                            <FaFlask className="text-white text-xl" />
                          </div>
                        )}
                        <div className="flex-1">
                          <h4 className="font-black text-slate-800 text-lg mb-1">{laboratory.name}</h4>
                          <div className="flex items-center gap-2 text-slate-500 text-xs">
                            <FaMapPin className="text-teal-600" />
                            <span className="font-semibold">{laboratory.distanceInKm?.toFixed(1) || '~'} كم</span>
                          </div>
                        </div>
                      </div>

                      {/* Details */}
                      <div className="space-y-2 mb-4">
                        {/* Phone Number */}
                        {laboratory.phoneNumber && (
                          <div className="flex items-center gap-2 text-sm">
                            <FaPhone className="text-teal-600 text-xs" />
                            <span className="font-semibold text-slate-700" dir="ltr">{laboratory.phoneNumber}</span>
                          </div>
                        )}

                        {/* Home Collection */}
                        {laboratory.offersHomeSampleCollection && (
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-lg border border-emerald-200">
                              <FaHome className="text-emerald-600 text-xs" />
                              <span className="text-xs font-bold text-emerald-700">عينات منزلية</span>
                              {laboratory.homeSampleCollectionFee != null && laboratory.homeSampleCollectionFee > 0 && (
                                <span className="text-xs font-semibold text-slate-600">({laboratory.homeSampleCollectionFee} جنيه)</span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Action Button */}
                      <button
                        onClick={() => handleSelectLaboratory(laboratory)}
                        className="w-full px-4 py-3 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white font-bold rounded-xl transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2"
                      >
                        <FaCheckCircle />
                        اختر هذا المعمل
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderLabTestModal;
