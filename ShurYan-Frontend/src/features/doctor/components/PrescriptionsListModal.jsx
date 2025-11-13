import React, { useEffect, useState } from 'react';
import { 
  FaTimes, FaPrescriptionBottleAlt, FaCalendarAlt,
  FaUser, FaFileAlt, FaExclamationCircle, FaHashtag, FaEye
} from 'react-icons/fa';
import { usePatientsStore } from '../stores/patientsStore';
import { formatDate } from '@/utils/helpers';
import useAuth from '../../auth/hooks/useAuth';
import PrescriptionDetailsModal from './PrescriptionDetailsModal';

/**
 * PrescriptionsListModal Component - Premium Design
 * Modal for viewing patient's prescriptions list
 */
const PrescriptionsListModal = ({ isOpen, onClose, patient }) => {
  const { user } = useAuth();
  const [selectedPrescriptionId, setSelectedPrescriptionId] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  
  const { 
    prescriptions, 
    detailsLoading, 
    detailsError,
    fetchPrescriptions
  } = usePatientsStore();

  // Handle view prescription details
  const handleViewPrescription = (prescriptionId) => {
    setSelectedPrescriptionId(prescriptionId);
    setIsDetailsModalOpen(true);
  };

  // Fetch prescriptions data
  useEffect(() => {
    // Get patient ID (could be 'id' or 'patientId')
    const patientId = patient?.patientId || patient?.id;
    
    console.log('🔄 useEffect triggered:', {
      isOpen,
      'patient?.id': patient?.id,
      'patient?.patientId': patient?.patientId,
      'patientId (resolved)': patientId,
      'user?.id': user?.id,
      'canFetch': isOpen && patientId && user?.id
    });
    
    // Only fetch if modal is open and we have both IDs
    if (!isOpen) {
      console.log('⏸️ Modal is closed, skipping fetch');
      return;
    }
    
    if (!patientId) {
      console.log('⚠️ No patientId available');
      return;
    }
    
    if (!user?.id) {
      console.log('⚠️ No doctorId available, waiting...');
      return;
    }
    
    console.log('🔍 Fetching prescriptions for patient:', patientId, 'doctor:', user.id);
    fetchPrescriptions(patientId, user.id);
    
  }, [isOpen, patient?.id, patient?.patientId, user?.id, fetchPrescriptions]);

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
          <div className="bg-gradient-to-r from-teal-500 to-emerald-600 px-6 py-5 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <FaPrescriptionBottleAlt className="text-white text-xl" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white">الروشتات الطبية</h2>
                  <p className="text-white/90 text-sm font-medium">
                    {patient?.firstName + ' ' + patient?.lastName || 'مريض'}
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
                prescriptions,
                prescriptionsType: typeof prescriptions,
                prescriptionsIsArray: Array.isArray(prescriptions),
                prescriptionsLength: prescriptions?.length
              });
              return null;
            })()}
            {detailsLoading ? (
              /* Loading State */
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <div className="w-16 h-16 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-slate-600 font-medium">جاري تحميل الروشتات...</p>
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
                  onClick={() => fetchPrescriptions(patient?.patientId, user?.id)}
                  className="px-6 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-600 text-white rounded-xl hover:from-teal-600 hover:to-emerald-700 transition-all font-bold text-sm shadow-lg"
                >
                  إعادة المحاولة
                </button>
              </div>
            ) : !prescriptions || !prescriptions.length ? (
              /* No Prescriptions State */
              <div className="text-center py-20">
                <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaFileAlt className="text-slate-400 text-4xl" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">لا توجد روشتات</h3>
                <p className="text-slate-600 font-medium">لم يتم إنشاء أي روشتات لهذا المريض بعد</p>
              </div>
            ) : (
              <>
                {/* Stats Header */}
                <div className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-2xl p-5 mb-6 border-2 border-teal-200">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-xl flex items-center justify-center">
                      <FaPrescriptionBottleAlt className="text-white text-lg" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-teal-700">إجمالي الروشتات</p>
                      <p className="text-2xl font-black text-slate-900">{prescriptions.length || 0}</p>
                    </div>
                  </div>
                </div>

                {/* Prescriptions List */}
                <div className="space-y-4">
                  {prescriptions.map((prescription, index) => (
                    <div 
                      key={prescription.id}
                      className="bg-white rounded-2xl border-2 border-slate-200 hover:border-teal-400 transition-all shadow-sm hover:shadow-lg p-6"
                    >
                      <div className="flex items-center gap-4">
                        {/* Number Badge */}
                        <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-xl flex items-center justify-center text-white font-black text-lg flex-shrink-0">
                          {index + 1}
                        </div>
                        
                        {/* Prescription Info */}
                        <div className="flex-1">
                          {/* Prescription Number */}
                          <div className="flex items-center gap-2 mb-2">
                            <FaHashtag className="text-teal-600 text-sm" />
                            <span className="text-xs font-semibold text-teal-700">رقم الروشتة</span>
                          </div>
                          <p className="text-lg font-black text-slate-900 mb-3">{prescription.prescriptionNumber}</p>
                          
                          {/* Created Date */}
                          <div className="flex items-center gap-2">
                            <FaCalendarAlt className="text-teal-600 text-sm" />
                            <span className="text-xs font-semibold text-teal-700">تاريخ الإنشاء:</span>
                            <span className="text-sm font-bold text-slate-700">{formatPrescriptionDate(prescription.createdAt)}</span>
                          </div>
                        </div>

                        {/* View Button */}
                        <button
                          onClick={() => handleViewPrescription(prescription.id)}
                          className="px-4 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-600 text-white rounded-xl hover:from-teal-600 hover:to-emerald-700 transition-all font-bold text-sm shadow-md hover:shadow-lg flex items-center gap-2 whitespace-nowrap"
                        >
                          <FaEye className="w-4 h-4" />
                          عرض الروشتة
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

      {/* Prescription Details Modal */}
      <PrescriptionDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedPrescriptionId(null);
        }}
        prescriptionId={selectedPrescriptionId}
        patientId={patient?.patientId || patient?.id}
        doctorId={user?.id}
      />
    </div>
  );
};

export default PrescriptionsListModal;
