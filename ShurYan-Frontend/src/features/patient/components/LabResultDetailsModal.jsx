import React, { useEffect, useState, useCallback } from 'react';
import { 
  FaTimes, FaFlask, FaCalendarAlt,
  FaUser, FaVial, FaExclamationCircle, FaHashtag,
  FaUserMd
} from 'react-icons/fa';
import { formatDate } from '@/utils/helpers';
import patientService from '@/api/services/patient.service';

/**
 * LabResultDetailsModal Component
 * Modal for viewing detailed lab result information with tests
 */
const LabResultDetailsModal = ({ isOpen, onClose, labResultId, patientId, doctorId }) => {
  const [labResult, setLabResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load lab result details function
  const loadLabResultDetails = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔬 Loading lab result details:', { patientId, doctorId, labResultId });
      const response = await patientService.getLabResultDetails(patientId, doctorId, labResultId);
      
      if (response.success && response.data) {
        setLabResult(response.data);
      } else {
        setError(response.error || 'فشل في تحميل تفاصيل التحليل');
      }
    } catch (err) {
      console.error('❌ Error loading lab result details:', err);
      setError('حدث خطأ في تحميل التحليل');
    } finally {
      setLoading(false);
    }
  }, [patientId, doctorId, labResultId]);

  // Fetch lab result details
  useEffect(() => {
    if (isOpen && labResultId && patientId && doctorId) {
      loadLabResultDetails();
    }
    
    // Cleanup on close
    return () => {
      if (!isOpen) {
        setLabResult(null);
        setError(null);
      }
    };
  }, [isOpen, labResultId, patientId, doctorId, loadLabResultDetails]);

  // Format date helper
  const formatLabResultDate = (date) => {
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
          <div className="bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-5 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <FaFlask className="text-white text-xl" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white">تفاصيل التحليل</h2>
                  <p className="text-white/90 text-sm font-medium">
                    {labResult?.labResultNumber || 'جاري التحميل...'}
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
                  <div className="w-16 h-16 border-4 border-cyan-200 border-t-cyan-600 rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-slate-600 font-medium">جاري تحميل التحليل...</p>
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
                  onClick={loadLabResultDetails}
                  className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all font-bold text-sm shadow-lg"
                >
                  إعادة المحاولة
                </button>
              </div>
            ) : !labResult ? (
              /* No Data State */
              <div className="text-center py-20">
                <p className="text-slate-600 font-medium">لا توجد بيانات</p>
              </div>
            ) : (
              <>
                {/* Lab Result Info */}
                <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl p-6 mb-6 border-2 border-cyan-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Lab Result Number */}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                        <FaHashtag className="text-white" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-cyan-700">رقم التحليل</p>
                        <p className="text-base font-black text-slate-900">{labResult.labResultNumber}</p>
                      </div>
                    </div>

                    {/* Date */}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/50 rounded-lg flex items-center justify-center">
                        <FaCalendarAlt className="text-cyan-600" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-cyan-700">تاريخ الإنشاء</p>
                        <p className="text-base font-bold text-slate-900">{formatLabResultDate(labResult.createdAt)}</p>
                      </div>
                    </div>

                    {/* Patient */}
                    {labResult.patientName && (
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/50 rounded-lg flex items-center justify-center">
                          <FaUser className="text-cyan-600" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-cyan-700">المريض</p>
                          <p className="text-base font-bold text-slate-900">{labResult.patientName}</p>
                        </div>
                      </div>
                    )}

                    {/* Doctor */}
                    {labResult.doctorName && (
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/50 rounded-lg flex items-center justify-center">
                          <FaUserMd className="text-cyan-600" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-cyan-700">الطبيب</p>
                          <p className="text-base font-bold text-slate-900">{labResult.doctorName}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* General Instructions */}
                  {labResult.generalInstructions && (
                    <div className="mt-4 bg-cyan-50 rounded-lg p-4 border border-cyan-200">
                      <p className="text-xs font-semibold text-cyan-700 mb-2">تعليمات عامة:</p>
                      <p className="text-sm font-medium text-slate-700">{labResult.generalInstructions}</p>
                    </div>
                  )}
                </div>

                {/* Lab Tests List */}
                <div>
                  <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
                    <FaVial className="text-cyan-600" />
                    التحاليل المطلوبة ({labResult.tests?.length || 0})
                  </h3>

                  {!labResult.tests || labResult.tests.length === 0 ? (
                    <div className="text-center py-10 bg-slate-50 rounded-xl">
                      <p className="text-slate-600 font-medium">لا توجد تحاليل محددة</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {labResult.tests.map((test, index) => (
                        <div
                          key={test.id || index}
                          className="bg-gradient-to-br from-white to-slate-50 rounded-xl p-5 border-2 border-slate-200 hover:border-cyan-300 transition-all shadow-sm hover:shadow-md"
                        >
                          {/* Test Number Badge */}
                          <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-black text-sm flex-shrink-0">
                              {index + 1}
                            </div>

                            <div className="flex-1 space-y-3">
                              {/* Test Name */}
                              <div>
                                <p className="text-xs font-semibold text-cyan-700 mb-1">اسم التحليل</p>
                                <p className="text-base font-bold text-slate-900">{test.testName}</p>
                              </div>

                              {/* Test Code */}
                              {test.testCode && (
                                <div>
                                  <p className="text-xs font-semibold text-cyan-700 mb-1">كود التحليل</p>
                                  <p className="text-sm font-semibold text-slate-700">{test.testCode}</p>
                                </div>
                              )}

                              {/* Special Instructions */}
                              {test.specialInstructions && (
                                <div className="bg-cyan-50 rounded-lg p-3 border border-cyan-200">
                                  <p className="text-xs font-semibold text-cyan-700 mb-1">تعليمات خاصة:</p>
                                  <p className="text-sm font-medium text-slate-700">{test.specialInstructions}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="bg-slate-50 px-6 py-4 rounded-b-2xl border-t border-slate-200">
            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-gradient-to-r from-slate-500 to-slate-600 text-white rounded-xl hover:from-slate-600 hover:to-slate-700 transition-all font-bold text-sm shadow-md"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabResultDetailsModal;
