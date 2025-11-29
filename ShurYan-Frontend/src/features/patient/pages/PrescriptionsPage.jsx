import React, { useState, useEffect } from 'react';
import {
  FaEye, FaShoppingCart, FaUserMd, FaCalendarAlt,
  FaStethoscope, FaHashtag, FaExclamationCircle, FaFileAlt, FaInfoCircle, FaPrescriptionBottleAlt, FaClipboardList
} from 'react-icons/fa';
import PrescriptionDetailsModal from '../../doctor/components/PrescriptionDetailsModal';
import OrderPrescriptionModal from '../components/OrderPrescriptionModal';
import PharmacyReportsModal from '../components/PharmacyReportsModal';
import { formatDate } from '@/utils/helpers';
import useAuth from '../../auth/hooks/useAuth';
import patientService from '@/api/services/patient.service';

/**
 * PrescriptionsPage Component
 * Display all patient's prescriptions from all doctors
 */
const PrescriptionsPage = () => {
  const { user } = useAuth();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [prescriptionToOrder, setPrescriptionToOrder] = useState(null);
  const [isReportsModalOpen, setIsReportsModalOpen] = useState(false);
  const [prescriptionForReports, setPrescriptionForReports] = useState(null);

  const fetchPrescriptions = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log('💊 Fetching prescriptions for patient:', user?.id);
      const response = await patientService.getMyPrescriptions();

      console.log('✅ Prescriptions response:', response);

      // Map appointmentType to Arabic consultationType
      const mappedPrescriptions = response.map(prescription => ({
        ...prescription,
        consultationType: prescription.appointmentType === 'regular' ? 'كشف جديد' : 'إعادة كشف',
        patientId: user?.id
      }));

      // Log prescription statuses for debugging
      console.log('📊 Prescription statuses:', mappedPrescriptions.map(p => ({
        id: p.id,
        prescriptionNumber: p.prescriptionNumber,
        status: p.status,
        statusName: p.statusName,
        statusText: getPrescriptionStatusText(p.status),
        hasReports: p.status === 5
      })));

      setPrescriptions(mappedPrescriptions);
      setLoading(false);
    } catch (err) {
      console.error('❌ Error fetching prescriptions:', err);
      setError('حدث خطأ في تحميل الروشتات');
      setLoading(false);
    }
  };

  // Fetch prescriptions on mount
  useEffect(() => {
    if (user?.id) {
      fetchPrescriptions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const handleViewPrescription = (prescription) => {
    console.log('👁️ Viewing prescription:', prescription);
    setSelectedPrescription(prescription);
    setIsDetailsModalOpen(true);
  };

  const handleOrderPrescription = (prescription) => {
    console.log('🛒 Ordering prescription:', prescription);
    setPrescriptionToOrder(prescription);
    setIsOrderModalOpen(true);
  };

  const handleViewReports = (prescription) => {
    console.log('📋 Viewing reports for prescription:', prescription);
    setPrescriptionForReports(prescription);
    setIsReportsModalOpen(true);
  };

  // Check if prescription has pharmacy reports (status = 5 = Reported)
  const hasPharmacyReports = (prescription) => {
    console.log('🔍 Checking prescription status:', {
      id: prescription.id,
      status: prescription.status,
      statusName: prescription.statusName,
      hasReports: prescription.status === 5
    });
    return prescription.status === 5; // Reported = 5
  };

  const formatPrescriptionDate = (date) => {
    if (!date) return 'غير محدد';
    try {
      return formatDate(date);
    } catch {
      return date;
    }
  };

  // Get prescription status in Arabic
  const getPrescriptionStatusText = (status) => {
    const statusMap = {
      1: 'نشطة', // Active
      2: 'ملغية', // Cancelled
      3: 'تم صرفها', // Dispensed
      4: 'منتهية الصلاحية', // Expired
      5: 'تم الرد عليها' // Reported
    };
    return statusMap[status] || 'غير محدد';
  };

  // Get prescription status color
  const getPrescriptionStatusColor = (status) => {
    const colorMap = {
      1: 'text-blue-600 bg-blue-50', // Active
      2: 'text-red-600 bg-red-50', // Cancelled
      3: 'text-green-600 bg-green-50', // Dispensed
      4: 'text-gray-600 bg-gray-50', // Expired
      5: 'text-emerald-600 bg-emerald-50' // Reported
    };
    return colorMap[status] || 'text-gray-600 bg-gray-50';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50/30 to-emerald-50/30" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-500 to-emerald-600 rounded-2xl p-8 mb-8 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}></div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-400/20 rounded-full -ml-24 -mb-24"></div>

          <div className="relative">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
                <FaPrescriptionBottleAlt className="text-white text-3xl" />
              </div>
              <div>
                <h1 className="text-4xl font-black text-white mb-2">
                  الروشتات الطبية
                </h1>
                <p className="text-white/90 text-lg font-medium">
                  جميع الروشتات الخاصة بك من كل الأطباء
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            {!loading && !error && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/30 rounded-lg flex items-center justify-center">
                      <FaPrescriptionBottleAlt className="text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white/80">إجمالي الروشتات</p>
                      <p className="text-2xl font-black text-white">{prescriptions.length}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/30 rounded-lg flex items-center justify-center">
                      <FaUserMd className="text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white/80">عدد الأطباء</p>
                      <p className="text-2xl font-black text-white">
                        {new Set(prescriptions.map(p => p.doctorId)).size}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/30 rounded-lg flex items-center justify-center">
                      <FaCalendarAlt className="text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white/80">آخر روشتة</p>
                      <p className="text-sm font-bold text-white">
                        {prescriptions.length > 0 ? formatPrescriptionDate(prescriptions[0].createdAt) : '-'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          {loading ? (
            /* Loading State */
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-slate-600 font-medium">جاري تحميل الروشتات...</p>
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
                onClick={fetchPrescriptions}
                className="px-6 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-600 text-white rounded-xl hover:from-teal-600 hover:to-emerald-700 transition-all font-bold text-sm shadow-lg"
              >
                إعادة المحاولة
              </button>
            </div>
          ) : prescriptions.length === 0 ? (
            /* Empty State */
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaFileAlt className="text-slate-400 text-4xl" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">لا توجد روشتات</h3>
              <p className="text-slate-600 font-medium">لم يتم إنشاء أي روشتات لك بعد</p>
            </div>
          ) : (
            /* Prescriptions List */
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
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Right Column */}
                      <div className="space-y-3">
                        {/* Prescription Number */}
                        <div className="flex items-center gap-2">
                          <FaHashtag className="text-teal-600 text-sm" />
                          <span className="text-xs font-semibold text-teal-700">رقم الروشتة:</span>
                          <span className="text-sm font-black text-slate-900">{prescription.prescriptionNumber}</span>
                        </div>

                        {/* Doctor Name */}
                        <div className="flex items-center gap-2">
                          <FaUserMd className="text-teal-600 text-sm" />
                          <span className="text-xs font-semibold text-teal-700">الطبيب:</span>
                          <span className="text-sm font-bold text-slate-900">{prescription.doctorName}</span>
                        </div>
                      </div>

                      {/* Left Column */}
                      <div className="space-y-3">
                        {/* Created Date */}
                        <div className="flex items-center gap-2">
                          <FaCalendarAlt className="text-teal-600 text-sm" />
                          <span className="text-xs font-semibold text-teal-700">تاريخ الإنشاء:</span>
                          <span className="text-sm font-bold text-slate-700">{formatPrescriptionDate(prescription.createdAt)}</span>
                        </div>

                        {/* Prescription Status */}
                        <div className="flex items-center gap-2">
                          <FaInfoCircle className="text-teal-600 text-sm" />
                          <span className="text-xs font-semibold text-teal-700">الحالة:</span>
                          <span className={`text-xs font-bold px-2 py-1 rounded-full ${getPrescriptionStatusColor(prescription.status)}`}>
                            {getPrescriptionStatusText(prescription.status)}
                          </span>
                        </div>

                        {/* Doctor Specialty */}
                        <div className="flex items-center gap-2">
                          <FaStethoscope className="text-teal-600 text-sm" />
                          <span className="text-xs font-semibold text-teal-700">التخصص:</span>
                          <span className="text-sm font-bold text-slate-700">{prescription.doctorSpecialty}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right Section: Consultation Type + View Button */}
                    <div className="flex flex-col items-end gap-3">
                      {/* Consultation Type Badge */}
                      <div className="flex items-center gap-2 bg-teal-50 px-3 py-1.5 rounded-lg border border-teal-200">
                        <FaClipboardList className="text-teal-600 text-xs" />
                        <span className="text-xs font-bold text-teal-700">{prescription.consultationType}</span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2">
                        {/* View Button */}
                        <button
                          onClick={() => handleViewPrescription(prescription)}
                          className="px-4 py-2.5 bg-gradient-to-r from-slate-500 to-slate-600 text-white rounded-xl hover:from-slate-600 hover:to-slate-700 transition-all font-bold text-sm shadow-md hover:shadow-lg flex items-center gap-2 whitespace-nowrap"
                        >
                          <FaEye className="w-4 h-4" />
                          عرض الروشتة
                        </button>

                        {/* Dynamic Action Button - Only show for Active or Reported prescriptions */}
                        {(prescription.status === 1 || prescription.status === 5) && (
                          hasPharmacyReports(prescription) ? (
                            <button
                              onClick={() => handleViewReports(prescription)}
                              className="px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all font-bold text-sm shadow-md hover:shadow-lg flex items-center gap-2 whitespace-nowrap"
                            >
                              <FaFileAlt className="w-4 h-4" />
                              التقارير
                            </button>
                          ) : prescription.status === 1 ? (
                            <button
                              onClick={() => handleOrderPrescription(prescription)}
                              className="px-4 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-600 text-white rounded-xl hover:from-teal-600 hover:to-emerald-700 transition-all font-bold text-sm shadow-md hover:shadow-lg flex items-center gap-2 whitespace-nowrap"
                            >
                              <FaShoppingCart className="w-4 h-4" />
                              اطلب الآن
                            </button>
                          ) : null
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Prescription Details Modal */}
      {selectedPrescription && (
        <PrescriptionDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={() => {
            setIsDetailsModalOpen(false);
            setSelectedPrescription(null);
          }}
          prescriptionId={selectedPrescription.id}
          patientId={selectedPrescription.patientId}
          doctorId={selectedPrescription.doctorId}
        />
      )}

      {/* Order Prescription Modal */}
      <OrderPrescriptionModal
        isOpen={isOrderModalOpen}
        onClose={() => {
          setIsOrderModalOpen(false);
          setPrescriptionToOrder(null);
        }}
        prescription={prescriptionToOrder}
      />

      {/* Pharmacy Reports Modal */}
      <PharmacyReportsModal
        isOpen={isReportsModalOpen}
        onClose={() => {
          setIsReportsModalOpen(false);
          setPrescriptionForReports(null);
        }}
        prescription={prescriptionForReports}
        onNewOrder={(prescription) => {
          // Close reports modal and open order modal with the same prescription
          setIsReportsModalOpen(false);
          setPrescriptionToOrder(prescription);
          setIsOrderModalOpen(true);
        }}
      />
    </div>
  );
};

export default PrescriptionsPage;
