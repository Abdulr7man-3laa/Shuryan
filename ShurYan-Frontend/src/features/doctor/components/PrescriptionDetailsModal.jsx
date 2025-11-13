import React, { useEffect, useState, useCallback } from 'react';
import { 
  FaTimes, FaPrescriptionBottleAlt, FaCalendarAlt,
  FaUser, FaPills, FaExclamationCircle, FaHashtag,
  FaUserMd, FaHospital
} from 'react-icons/fa';
import { usePatientsStore } from '../stores/patientsStore';
import { formatDate } from '@/utils/helpers';

/**
 * PrescriptionDetailsModal Component
 * Modal for viewing detailed prescription information with medications
 */
const PrescriptionDetailsModal = ({ isOpen, onClose, prescriptionId, patientId, doctorId }) => {
  const { fetchPrescriptionDetails } = usePatientsStore();
  const [prescription, setPrescription] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load prescription details function
  const loadPrescriptionDetails = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchPrescriptionDetails(patientId, doctorId, prescriptionId);
      
      if (data) {
        setPrescription(data);
      } else {
        setError('فشل في تحميل تفاصيل الروشتة');
      }
    } catch {
      setError('حدث خطأ في تحميل الروشتة');
    } finally {
      setLoading(false);
    }
  }, [fetchPrescriptionDetails, patientId, doctorId, prescriptionId]);

  // Fetch prescription details
  useEffect(() => {
    if (isOpen && prescriptionId && patientId && doctorId) {
      loadPrescriptionDetails();
    }
    
    // Cleanup on close
    return () => {
      if (!isOpen) {
        setPrescription(null);
        setError(null);
      }
    };
  }, [isOpen, prescriptionId, patientId, doctorId, loadPrescriptionDetails]);

  // Format date helper
  const formatPrescriptionDate = (date) => {
    if (!date) return 'غير محدد';
    try {
      return formatDate(date);
    } catch {
      return date;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" dir="rtl">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="flex min-h-screen items-center justify-center p-4">
        <div 
          className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl transform transition-all"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-teal-500 to-emerald-600 px-6 py-5 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <FaPrescriptionBottleAlt className="text-white text-xl" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white">تفاصيل الروشتة</h2>
                  <p className="text-white/90 text-sm font-medium">
                    {prescription?.prescriptionNumber || 'جاري التحميل...'}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-colors"
              >
                <FaTimes className="text-white text-lg" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
            {loading ? (
              /* Loading State */
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <div className="w-16 h-16 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-slate-600 font-medium">جاري تحميل الروشتة...</p>
                </div>
              </div>
            ) : error ? (
              /* Error State */
              <div className="text-center py-20">
                <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaExclamationCircle className="text-red-500 text-4xl" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">حدث خطأ</h3>
                <p className="text-slate-600 font-medium mb-4">{error}</p>
                <button
                  onClick={loadPrescriptionDetails}
                  className="px-6 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-600 text-white rounded-xl hover:from-teal-600 hover:to-emerald-700 transition-all font-bold text-sm shadow-lg"
                >
                  إعادة المحاولة
                </button>
              </div>
            ) : !prescription ? (
              /* No Data State */
              <div className="text-center py-20">
                <p className="text-slate-600 font-medium">لا توجد بيانات</p>
              </div>
            ) : (
              <>
                {/* Prescription Info */}
                <div className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-2xl p-6 mb-6 border-2 border-teal-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Prescription Number */}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-lg flex items-center justify-center">
                        <FaHashtag className="text-white" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-teal-700">رقم الروشتة</p>
                        <p className="text-base font-black text-slate-900">{prescription.prescriptionNumber}</p>
                      </div>
                    </div>

                    {/* Date */}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/50 rounded-lg flex items-center justify-center">
                        <FaCalendarAlt className="text-teal-600" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-teal-700">تاريخ الإنشاء</p>
                        <p className="text-base font-bold text-slate-900">{formatPrescriptionDate(prescription.createdAt)}</p>
                      </div>
                    </div>

                    {/* Patient */}
                    {prescription.patientName && (
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/50 rounded-lg flex items-center justify-center">
                          <FaUser className="text-teal-600" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-teal-700">المريض</p>
                          <p className="text-base font-bold text-slate-900">{prescription.patientName}</p>
                        </div>
                      </div>
                    )}

                    {/* Doctor */}
                    {prescription.doctorName && (
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/50 rounded-lg flex items-center justify-center">
                          <FaUserMd className="text-teal-600" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-teal-700">الطبيب</p>
                          <p className="text-base font-bold text-slate-900">{prescription.doctorName}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* General Instructions */}
                  {prescription.generalInstructions && (
                    <div className="mt-4 bg-teal-50 rounded-lg p-4 border border-teal-200">
                      <p className="text-xs font-semibold text-teal-700 mb-2">تعليمات عامة:</p>
                      <p className="text-sm font-medium text-slate-700">{prescription.generalInstructions}</p>
                    </div>
                  )}
                </div>

                {/* Medications List */}
                <div>
                  <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
                    <FaPills className="text-teal-600" />
                    الأدوية ({prescription.medications?.length || 0})
                  </h3>
                  
                  <div className="space-y-3">
                    {prescription.medications?.map((med, index) => (
                      <div 
                        key={index}
                        className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-xl p-4 border-2 border-teal-200"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <h4 className="text-base font-black text-slate-900 mb-3">{med.medicationName}</h4>
                            
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                              <div className="bg-white rounded-lg p-2 border border-teal-200">
                                <p className="text-xs font-semibold text-teal-700 mb-1">الجرعة</p>
                                <p className="text-xs font-bold text-slate-800">{med.dosage}</p>
                              </div>
                              <div className="bg-white rounded-lg p-2 border border-teal-200">
                                <p className="text-xs font-semibold text-teal-700 mb-1">التكرار</p>
                                <p className="text-xs font-bold text-slate-800">{med.frequency}</p>
                              </div>
                              <div className="bg-white rounded-lg p-2 border border-teal-200">
                                <p className="text-xs font-semibold text-teal-700 mb-1">المدة</p>
                                <p className="text-xs font-bold text-slate-800">{med.durationDays} يوم</p>
                              </div>
                            </div>

                            {med.specialInstructions && (
                              <div className="mt-2 bg-teal-50 rounded-lg p-2 border border-teal-200">
                                <p className="text-xs font-semibold text-teal-700 mb-1">تعليمات خاصة:</p>
                                <p className="text-xs font-medium text-slate-700">{med.specialInstructions}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="bg-slate-50 px-6 py-4 rounded-b-2xl border-t-2 border-slate-200">
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-white border-2 border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors font-semibold text-sm"
            >
              إغلاق
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionDetailsModal;
