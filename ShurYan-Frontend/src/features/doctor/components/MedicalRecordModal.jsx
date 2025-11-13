import React, { useEffect } from 'react';
import { 
  FaTimes, FaFileMedical, FaPrint, FaCalendarAlt,
  FaUser, FaFileAlt, FaAllergies, FaHeartbeat,
  FaPills, FaSyringe, FaExclamationCircle, FaCheckCircle
} from 'react-icons/fa';
import { usePatientsStore } from '../stores/patientsStore';
import { formatDate } from '@/utils/helpers';

/**
 * MedicalRecordModal Component - Premium Design
 * Modal for viewing patient's complete medical record
 */
const MedicalRecordModal = ({ isOpen, onClose, patient }) => {
  const { 
    medicalRecord, 
    detailsLoading, 
    detailsError,
    fetchMedicalRecord,
    clearPatientDetails 
  } = usePatientsStore();

  // Fetch medical record data
  useEffect(() => {
    if (isOpen && patient) {
      // Use patientId or id (fallback)
      const patientId = patient.patientId || patient.id;
      console.log('📋 Fetching medical record for patient:', patientId, patient);
      
      if (patientId) {
        fetchMedicalRecord(patientId);
      } else {
        console.error('❌ No patient ID found:', patient);
      }
    }
    
    // Cleanup on close
    return () => {
      if (!isOpen) {
        clearPatientDetails();
      }
    };
  }, [isOpen, patient]);

  // Format date helper
  const formatLastUpdate = (date) => {
    if (!date) return 'غير محدد';
    try {
      return formatDate(date);
    } catch {
      return date;
    }
  };

  // Handle print
  const handlePrint = () => {
    window.print();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" dir="rtl">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-md transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="flex min-h-screen items-center justify-center p-4">
        <div 
          className="relative bg-white rounded-3xl shadow-2xl w-full max-w-4xl transform transition-all"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative bg-gradient-to-br from-teal-500 via-teal-600 to-emerald-600 px-8 py-6 rounded-t-3xl overflow-hidden">
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-8 left-0 w-40 h-40 bg-emerald-400/20 rounded-full blur-3xl"></div>
            
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-lg">
                  <FaFileMedical className="text-white text-2xl" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white mb-1">السجل الطبي</h2>
                  <p className="text-white/90 text-sm font-semibold flex items-center gap-2">
                    <FaUser className="text-xs" />
                    {patient?.fullName || 'مريض'}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-11 h-11 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-all hover:scale-105"
              >
                <FaTimes className="text-white text-xl" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="p-8 max-h-[calc(100vh-220px)] overflow-y-auto bg-gradient-to-br from-slate-50/50 via-white to-teal-50/30">
            {detailsLoading ? (
              /* Loading State */
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <div className="w-16 h-16 border-4 border-cyan-200 border-t-cyan-600 rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-slate-600 font-medium">جاري تحميل السجل الطبي...</p>
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
                  onClick={() => fetchMedicalRecord(patient?.patientId)}
                  className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all font-bold text-sm shadow-lg"
                >
                  إعادة المحاولة
                </button>
              </div>
            ) : !medicalRecord ? (
              /* No Record State */
              <div className="text-center py-20">
                <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaFileAlt className="text-slate-400 text-4xl" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">لا يوجد سجل طبي</h3>
                <p className="text-slate-600 font-medium">لم يتم إنشاء سجل طبي لهذا المريض بعد</p>
              </div>
            ) : (
              <>
                {/* Stats Banner */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 mb-8">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-md">
                        <FaUser className="text-white text-lg" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-500 mb-0.5">اسم المريض</p>
                        <p className="text-base font-bold text-slate-800">{medicalRecord.patientFullName || patient?.fullName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 bg-teal-50 px-5 py-3 rounded-xl">
                      <FaFileAlt className="text-teal-600 text-lg" />
                      <div>
                        <p className="text-xs font-semibold text-teal-600">إجمالي السجلات</p>
                        <p className="text-2xl font-black text-teal-700">{medicalRecord.medicalHistory?.length || 0}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Medical History Records - Grouped by Type */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  {medicalRecord.medicalHistory && medicalRecord.medicalHistory.length > 0 ? (
                    (() => {
                      // Group records by type
                      const groupedRecords = medicalRecord.medicalHistory.reduce((acc, record) => {
                        const key = record.typeName || 'سجل طبي';
                        if (!acc[key]) {
                          acc[key] = [];
                        }
                        acc[key].push(record);
                        return acc;
                      }, {});

                      return Object.entries(groupedRecords).map(([typeName, records]) => (
                        <div key={typeName} className="bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden hover:shadow-lg transition-shadow">
                          {/* Type Header */}
                          <div className="bg-gradient-to-r from-teal-50 to-emerald-50 border-b-2 border-teal-200 px-5 py-4">
                            <div className="flex items-center justify-between">
                              <h3 className="text-base font-black text-slate-800 flex items-center gap-2.5">
                                <div className="w-9 h-9 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-md">
                                  <FaFileAlt className="text-white text-sm" />
                                </div>
                                {typeName}
                              </h3>
                              <span className="text-sm font-bold text-teal-700 bg-teal-100 px-3.5 py-1.5 rounded-full">
                                {records.length}
                              </span>
                            </div>
                          </div>
                          
                          {/* Records List */}
                          <div className="p-4 space-y-2.5">
                            {records.map((record, index) => (
                              <div 
                                key={record.id}
                                className="group bg-white hover:bg-teal-50/30 rounded-xl p-4 border-2 border-slate-200 hover:border-teal-400 transition-all duration-200 shadow-sm hover:shadow-md"
                              >
                                <div className="flex items-start gap-3.5">
                                  <div className="flex-shrink-0">
                                    <div className="w-8 h-8 bg-slate-100 border-2 border-slate-300 rounded-lg flex items-center justify-center group-hover:bg-teal-100 group-hover:border-teal-400 transition-all">
                                      <span className="text-slate-700 font-black text-sm group-hover:text-teal-700">#{index + 1}</span>
                                    </div>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-slate-800 leading-relaxed whitespace-pre-wrap mb-2.5">
                                      {record.text}
                                    </p>
                                    <div className="flex items-center gap-3 text-xs text-slate-500">
                                      <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200">
                                        <FaCalendarAlt className="text-teal-600 text-[10px]" />
                                        <span className="font-medium">{formatLastUpdate(record.createdAt)}</span>
                                      </div>
                                      {record.updatedAt && record.updatedAt !== record.createdAt && (
                                        <div className="flex items-center gap-1.5 bg-amber-50 px-2.5 py-1.5 rounded-lg border border-amber-200">
                                          <FaCalendarAlt className="text-amber-600 text-[10px]" />
                                          <span className="font-medium text-amber-700">تحديث: {formatLastUpdate(record.updatedAt)}</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ));
                    })()
                  ) : (
                    <div className="text-center py-20">
                      <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaFileAlt className="text-slate-400 text-4xl" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-800 mb-2">لا توجد سجلات طبية</h3>
                      <p className="text-slate-600 font-medium">لم يتم إضافة أي سجلات طبية لهذا المريض بعد</p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="bg-white px-6 py-4 rounded-b-2xl border-t border-slate-200">
            <div className="flex items-center justify-end">
              <button
                onClick={onClose}
                className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors font-semibold text-sm"
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

export default MedicalRecordModal;