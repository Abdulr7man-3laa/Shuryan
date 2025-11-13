import React, { useEffect } from 'react';
import { 
  FaTimes, FaNotesMedical, FaCalendarAlt, FaClock,
  FaUser, FaFileAlt, FaExclamationCircle, FaCheckCircle
} from 'react-icons/fa';
import { usePatientsStore } from '../stores/patientsStore';
import { formatDate } from '@/utils/helpers';

/**
 * SessionsListModal Component - Premium Design
 * Modal for viewing patient's session documentations list
 */
const SessionsListModal = ({ isOpen, onClose, patient }) => {
  const { 
    sessionDocumentations, 
    detailsLoading, 
    detailsError,
    fetchSessionDocumentations,
    clearPatientDetails 
  } = usePatientsStore();

  // Fetch session documentations data
  useEffect(() => {
    if (isOpen && patient?.patientId) {
      fetchSessionDocumentations(patient.patientId);
    }
    
    // Cleanup on close
    return () => {
      if (!isOpen) {
        clearPatientDetails();
      }
    };
  }, [isOpen, patient]);

  // Format date helper
  const formatSessionDate = (date) => {
    if (!date) return 'غير محدد';
    try {
      return formatDate(date);
    } catch {
      return date;
    }
  };

  // Get session type badge color
  const getSessionTypeBadge = (type) => {
    const badges = {
      1: { bg: 'bg-blue-50', border: 'border-blue-300', text: 'text-blue-700' },
      2: { bg: 'bg-green-50', border: 'border-green-300', text: 'text-green-700' },
      3: { bg: 'bg-purple-50', border: 'border-purple-300', text: 'text-purple-700' },
    };
    return badges[type] || badges[1];
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
          className="relative bg-white rounded-2xl shadow-2xl w-full max-w-6xl transform transition-all"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-5 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <FaNotesMedical className="text-white text-xl" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white">توثيق الجلسات</h2>
                  <p className="text-white/90 text-sm font-medium">
                    {sessionDocumentations?.patientFullName || patient?.firstName + ' ' + patient?.lastName || 'مريض'}
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
            {detailsLoading ? (
              /* Loading State */
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-slate-600 font-medium">جاري تحميل الجلسات...</p>
                </div>
              </div>
            ) : detailsError ? (
              /* Error State */
              <div className="text-center py-20">
                <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaExclamationCircle className="text-red-500 text-4xl" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">حدث خطأ</h3>
                <p className="text-slate-600 font-medium mb-4">{detailsError}</p>
                <button
                  onClick={() => fetchSessionDocumentations(patient?.patientId)}
                  className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all font-bold text-sm shadow-lg"
                >
                  إعادة المحاولة
                </button>
              </div>
            ) : !sessionDocumentations || !sessionDocumentations.sessions?.length ? (
              /* No Sessions State */
              <div className="text-center py-20">
                <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaFileAlt className="text-slate-400 text-4xl" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">لا توجد جلسات</h3>
                <p className="text-slate-600 font-medium">لم يتم توثيق أي جلسات لهذا المريض بعد</p>
              </div>
            ) : (
              <>
                {/* Stats Header */}
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-5 mb-6 border-2 border-emerald-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                        <FaNotesMedical className="text-white text-lg" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-emerald-700">إجمالي الجلسات</p>
                        <p className="text-2xl font-black text-slate-900">{sessionDocumentations.totalSessions || 0}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white/50 rounded-xl flex items-center justify-center">
                        <FaUser className="text-emerald-600 text-lg" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-emerald-700">المريض</p>
                        <p className="text-base font-black text-slate-900">{sessionDocumentations.patientFullName}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sessions List */}
                <div className="space-y-4">
                  {sessionDocumentations.sessions.map((session, index) => {
                    const typeBadge = getSessionTypeBadge(session.sessionType);
                    
                    return (
                      <div 
                        key={session.consultationRecordId}
                        className="bg-white rounded-2xl border-2 border-slate-200 hover:border-emerald-400 transition-all shadow-sm hover:shadow-lg overflow-hidden"
                      >
                        {/* Session Header */}
                        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 px-5 py-4 border-b-2 border-slate-200">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center text-white font-black">
                                {index + 1}
                              </div>
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <FaCalendarAlt className="text-emerald-600 text-xs" />
                                  <span className="text-sm font-bold text-slate-900">{formatSessionDate(session.sessionDate)}</span>
                                  <span className="text-slate-400">|</span>
                                  <FaClock className="text-emerald-600 text-xs" />
                                  <span className="text-sm font-semibold text-slate-700">{session.sessionTime}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className={`px-2 py-1 ${typeBadge.bg} ${typeBadge.border} border rounded-lg`}>
                                    <span className={`text-xs font-bold ${typeBadge.text}`}>{session.sessionTypeName}</span>
                                  </div>
                                  {session.sessionDurationMinutes && (
                                    <span className="text-xs font-medium text-slate-500">• {session.sessionDurationMinutes} دقيقة</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Session Content */}
                        <div className="p-5">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            
                            {/* Chief Complaint */}
                            {session.chiefComplaint && (
                              <div className="bg-rose-50 rounded-xl p-4 border border-rose-200">
                                <h4 className="text-sm font-black text-rose-700 mb-2">الشكوى الرئيسية</h4>
                                <p className="text-sm font-medium text-slate-700">{session.chiefComplaint}</p>
                              </div>
                            )}

                            {/* Diagnosis */}
                            {session.diagnosis && (
                              <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                                <h4 className="text-sm font-black text-amber-700 mb-2">التشخيص</h4>
                                <p className="text-sm font-medium text-slate-700">{session.diagnosis}</p>
                              </div>
                            )}

                            {/* History of Present Illness */}
                            {session.historyOfPresentIllness && (
                              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                                <h4 className="text-sm font-black text-blue-700 mb-2">تاريخ المرض الحالي</h4>
                                <p className="text-sm font-medium text-slate-700">{session.historyOfPresentIllness}</p>
                              </div>
                            )}

                            {/* Physical Examination */}
                            {session.physicalExamination && (
                              <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                                <h4 className="text-sm font-black text-purple-700 mb-2">الفحص السريري</h4>
                                <p className="text-sm font-medium text-slate-700">{session.physicalExamination}</p>
                              </div>
                            )}

                            {/* Management Plan */}
                            {session.managementPlan && (
                              <div className="lg:col-span-2 bg-emerald-50 rounded-xl p-4 border border-emerald-200">
                                <h4 className="text-sm font-black text-emerald-700 mb-2">خطة العلاج</h4>
                                <p className="text-sm font-medium text-slate-700">{session.managementPlan}</p>
                              </div>
                            )}

                          </div>

                          {/* Created At */}
                          <div className="mt-4 pt-4 border-t border-slate-200">
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                              <FaCalendarAlt className="text-[10px]" />
                              <span className="font-medium">تم التوثيق: {formatSessionDate(session.createdAt)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
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

export default SessionsListModal;
