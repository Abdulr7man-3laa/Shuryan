import React, { useState, useEffect } from 'react';
import {
  FaTimes, FaFlask, FaCalendarAlt, FaFileAlt,
  FaExclamationCircle, FaHashtag, FaEye
} from 'react-icons/fa';
import { usePatientsStore } from '../stores/patientsStore';
import { formatDate } from '@/utils/helpers';
import LabPrescriptionDetailsModal from './LabPrescriptionDetailsModal';

/**
 * LabResultsModal Component - Premium Design
 * Modal for viewing patient lab prescriptions (التحاليل المطلوبة)
 */
const LabResultsModal = ({ isOpen, onClose, patient }) => {
  const [selectedPrescriptionId, setSelectedPrescriptionId] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const {
    labPrescriptions,
    detailsLoading,
    detailsError,
    fetchLabPrescriptions
  } = usePatientsStore();

  // Handle view prescription details
  const handleViewPrescription = (prescriptionId) => {
    setSelectedPrescriptionId(prescriptionId);
    setIsDetailsModalOpen(true);
  };

  // Fetch lab prescriptions data
  useEffect(() => {
    const patientId = patient?.patientId || patient?.id;

    console.log('🔄 useEffect triggered:', {
      isOpen,
      'patient?.id': patient?.id,
      'patient?.patientId': patient?.patientId,
      'patientId (resolved)': patientId,
      'canFetch': isOpen && patientId
    });

    if (!isOpen) {
      console.log('⏸️ Modal is closed, skipping fetch');
      return;
    }

    if (!patientId) {
      console.log('⚠️ No patientId available');
      return;
    }

    console.log('🔬 Fetching lab prescriptions for patient:', patientId);
    fetchLabPrescriptions(patientId);

  }, [isOpen, patient?.id, patient?.patientId, fetchLabPrescriptions]);

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
          className="relative bg-white rounded-2xl shadow-2xl w-full max-w-6xl transform transition-all"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-500 to-indigo-600 px-6 py-5 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <FaFlask className="text-white text-xl" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white">التحاليل المطلوبة</h2>
                  <p className="text-white/90 text-sm font-medium">
                    {patient?.firstName + ' ' + patient?.lastName || patient?.fullName || 'مريض'}
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
            {(() => {
              console.log('🎨 Render state:', {
                detailsLoading,
                detailsError,
                labPrescriptions,
                labPrescriptionsType: typeof labPrescriptions,
                labPrescriptionsIsArray: Array.isArray(labPrescriptions),
                labPrescriptionsLength: labPrescriptions?.length
              });
              return null;
            })()}
            {detailsLoading ? (
              /* Loading State */
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-slate-600 font-medium">جاري تحميل التحاليل المطلوبة...</p>
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
                  onClick={() => fetchLabPrescriptions(patient?.patientId || patient?.id)}
                  className="px-6 py-2.5 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl hover:from-purple-600 hover:to-indigo-700 transition-all font-bold text-sm shadow-lg"
                >
                  إعادة المحاولة
                </button>
              </div>
            ) : !labPrescriptions || !labPrescriptions.length ? (
              /* No Lab Prescriptions State */
              <div className="text-center py-20">
                <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaFileAlt className="text-slate-400 text-4xl" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">لا توجد تحاليل مطلوبة</h3>
                <p className="text-slate-600 font-medium">لم يتم طلب أي تحاليل لهذا المريض بعد</p>
              </div>
            ) : (
              <>
                {/* Stats Header */}
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-5 mb-6 border-2 border-purple-200">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
                      <FaFlask className="text-white text-lg" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-purple-700">إجمالي التحاليل المطلوبة</p>
                      <p className="text-2xl font-black text-slate-900">{labPrescriptions.length || 0}</p>
                    </div>
                  </div>
                </div>

                {/* Lab Prescriptions List */}
                <div className="space-y-4">
                  {labPrescriptions.map((prescription, index) => (
                    <div
                      key={prescription.prescriptionId}
                      className="bg-white rounded-2xl border-2 border-slate-200 hover:border-purple-400 transition-all shadow-sm hover:shadow-lg p-6"
                    >
                      <div className="flex items-center gap-4">
                        {/* Number Badge */}
                        <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-lg flex-shrink-0">
                          {index + 1}
                        </div>

                        {/* Prescription Info */}
                        <div className="flex-1">
                          {/* Test Name */}
                          <div className="flex items-center gap-2 mb-2">
                            <FaFlask className="text-purple-600 text-sm" />
                            <span className="text-xs font-semibold text-purple-700">اسم التحليل</span>
                          </div>
                          <p className="text-lg font-black text-slate-900 mb-3">{prescription.testName}</p>

                          {/* Requested Date */}
                          <div className="flex items-center gap-2">
                            <FaCalendarAlt className="text-purple-600 text-sm" />
                            <span className="text-xs font-semibold text-purple-700">تاريخ الطلب:</span>
                            <span className="text-sm font-bold text-slate-700">{formatPrescriptionDate(prescription.requestedDate)}</span>
                          </div>
                        </div>

                        {/* View Button */}
                        <button
                          onClick={() => handleViewPrescription(prescription.prescriptionId)}
                          className="px-4 py-2.5 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl hover:from-purple-600 hover:to-indigo-700 transition-all font-bold text-sm shadow-md hover:shadow-lg flex items-center gap-2 whitespace-nowrap"
                        >
                          <FaEye className="w-4 h-4" />
                          عرض التحاليل
                        </button>
                      </div>
                    </div>
                  ))}
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

      {/* Lab Prescription Details Modal */}
      <LabPrescriptionDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedPrescriptionId(null);
        }}
        prescriptionId={selectedPrescriptionId}
        patientId={patient?.patientId || patient?.id}
      />
    </div>
  );
};

export default LabResultsModal;
