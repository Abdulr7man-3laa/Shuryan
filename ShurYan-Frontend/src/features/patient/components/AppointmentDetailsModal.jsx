import React, { useState, useEffect } from 'react';
import {
  FaTimes,
  FaFileAlt,
  FaFlask,
  FaPrescription,
  FaClipboardList,
  FaBook,
  FaStethoscope,
  FaSearchPlus,
  FaNotesMedical
} from 'react-icons/fa';
import apiClient from '../../../api/client';
import patientService from '../../../api/services/patient.service';
import { getSpecialtyById } from '@/utils/constants';

/**
 * Appointment Details Modal
 * Shows session documentation, lab tests, and prescription in tabs
 */
const AppointmentDetailsModal = ({ isOpen, onClose, appointment }) => {
  const [activeTab, setActiveTab] = useState('documentation'); // documentation, labs, prescription
  const [documentation, setDocumentation] = useState(null);
  const [prescription, setPrescription] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch data when modal opens or tab changes
  useEffect(() => {
    if (isOpen && appointment) {
      if (activeTab === 'documentation') {
        fetchDocumentation();
      } else if (activeTab === 'prescription') {
        fetchPrescription();
      }
    }
  }, [isOpen, appointment, activeTab]);

  const fetchDocumentation = async () => {
    if (!appointment?.id) return;

    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.get(`/Appointments/${appointment.id}/documentation`);

      if (response.data?.isSuccess || response.data?.success) {
        setDocumentation(response.data?.data || response.data);
      } else {
        setDocumentation(null);
      }
    } catch (err) {
      // 404 means no documentation exists - not an error
      if (err.response?.status === 404) {
        setDocumentation(null);
      } else {
        console.error('Error fetching documentation:', err);
        setError('فشل تحميل التوثيق');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchPrescription = async () => {
    // Check if prescription exists for this appointment
    if (!appointment?.prescriptionId) {
      console.log('ℹ️ No prescription for this appointment');
      setPrescription(null);
      return;
    }

    // Check if we have required IDs
    if (!appointment?.patientId || !appointment?.doctorId) {
      console.log('⚠️ Missing required IDs');
      setPrescription(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('💊 Fetching prescription:', {
        patientId: appointment.patientId,
        doctorId: appointment.doctorId,
        prescriptionId: appointment.prescriptionId
      });

      // Use the original method with prescriptionId (faster and more specific)
      const result = await patientService.getPrescriptionDetails(
        appointment.patientId,
        appointment.doctorId,
        appointment.prescriptionId
      );

      if (result.success && result.data) {
        console.log('✅ Prescription loaded:', result.data);
        setPrescription(result.data);
      } else {
        setPrescription(null);
        if (result.error) {
          setError(result.error);
        }
      }
    } catch (err) {
      console.error('❌ Error fetching prescription:', err);
      setPrescription(null);
      setError('فشل تحميل الروشتة');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !appointment) return null;

  const tabs = [
    { id: 'documentation', label: 'توثيق الجلسة', icon: FaFileAlt, color: 'teal' },
    { id: 'prescription', label: 'الروشتة الطبية', icon: FaPrescription, color: 'teal' },
    { id: 'labs', label: 'التحاليل المطلوبة', icon: FaFlask, color: 'teal' },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" dir="rtl">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden animate-fadeIn">

          {/* Header */}
          <div className="bg-[#00ae9c] text-white p-6">
            <div className="flex items-center justify-between mb-6">
              {/* Tabs Bar - Inside Header */}
              <div className="grid grid-cols-3 gap-3">
                {tabs.map((tab) => {
                  const TabIcon = tab.icon;
                  const isActive = activeTab === tab.id;

                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-sm transition-all duration-200 ${isActive
                          ? 'bg-[#223045] text-white shadow-lg scale-105'
                          : 'bg-white/10 text-white hover:bg-[#223045]/80 hover:scale-105'
                        }`}
                    >
                      <TabIcon className="text-lg" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-all duration-200"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>
          </div>



          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">

            {/* Session Documentation Tab */}
            {activeTab === 'documentation' && (
              <div className="animate-fadeIn">
                {loading ? (
                  <div className="text-center py-16">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
                    <p className="text-slate-600 font-semibold">جاري تحميل التوثيق...</p>
                  </div>
                ) : error ? (
                  <div className="text-center py-16">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FaFileAlt className="text-4xl text-red-400" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-700 mb-2">حدث خطأ</h3>
                    <p className="text-slate-500 mb-4">{error}</p>
                    <button
                      onClick={fetchDocumentation}
                      className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors"
                    >
                      إعادة المحاولة
                    </button>
                  </div>
                ) : documentation ? (
                  <div className="space-y-6">
                    {/* Chief Complaint */}
                    {documentation.chiefComplaint && (
                      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-5 border-2 border-blue-200">
                        <h3 className="text-lg font-black text-slate-800 mb-3 flex items-center gap-2">
                          <FaClipboardList className="text-teal-500 text-xl" />
                          الشكوى الرئيسية
                        </h3>
                        <p className="text-slate-700 leading-relaxed">
                          {documentation.chiefComplaint}
                        </p>
                      </div>
                    )}

                    {/* History of Present Illness */}
                    {documentation.historyOfPresentIllness && (
                      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-5 border-2 border-blue-200">
                        <h3 className="text-lg font-black text-slate-800 mb-3 flex items-center gap-2">
                          <FaBook className="text-teal-500 text-xl" />
                          تاريخ المرض الحالي
                        </h3>
                        <p className="text-slate-700 leading-relaxed">
                          {documentation.historyOfPresentIllness}
                        </p>
                      </div>
                    )}

                    {/* Physical Examination */}
                    {documentation.physicalExamination && (
                      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-5 border-2 border-blue-200">
                        <h3 className="text-lg font-black text-slate-800 mb-3 flex items-center gap-2">
                          <FaStethoscope className="text-teal-500 text-xl" />
                          الفحص الجسدي
                        </h3>
                        <p className="text-slate-700 leading-relaxed">
                          {documentation.physicalExamination}
                        </p>
                      </div>
                    )}

                    {/* Diagnosis */}
                    {documentation.diagnosis && (
                      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-5 border-2 border-blue-200">
                        <h3 className="text-lg font-black text-slate-800 mb-3 flex items-center gap-2">
                          <FaSearchPlus className="text-teal-500 text-xl" />
                          التشخيص
                        </h3>
                        <p className="text-slate-700 leading-relaxed">
                          {documentation.diagnosis}
                        </p>
                      </div>
                    )}

                    {/* Management Plan */}
                    {documentation.managementPlan && (
                      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-5 border-2 border-blue-200">
                        <h3 className="text-lg font-black text-slate-800 mb-3 flex items-center gap-2">
                          <FaNotesMedical className="text-teal-500 text-xl" />
                          خطة العلاج
                        </h3>
                        <p className="text-slate-700 leading-relaxed">
                          {documentation.managementPlan}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FaFileAlt className="text-4xl text-slate-400" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-700 mb-2">لا يوجد توثيق</h3>
                    <p className="text-slate-500">لم يتم توثيق هذه الجلسة بعد</p>
                  </div>
                )}
              </div>
            )}

            {/* Prescription Tab */}
            {activeTab === 'prescription' && (
              <div className="animate-fadeIn">
                {loading ? (
                  <div className="text-center py-16">
                    <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-600 font-semibold">جاري تحميل الروشتة...</p>
                  </div>
                ) : error ? (
                  <div className="text-center py-16">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FaPrescription className="text-4xl text-red-500" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-700 mb-2">حدث خطأ</h3>
                    <p className="text-slate-500 mb-4">{error}</p>
                    <button
                      onClick={fetchPrescription}
                      className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-semibold transition-all"
                    >
                      إعادة المحاولة
                    </button>
                  </div>
                ) : prescription?.medications && prescription.medications.length > 0 ? (
                  <div className="space-y-6">
                    {/* Prescription Header Info */}
                    <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-xl p-5 border-2 border-teal-200">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <span className="text-xs text-slate-500 font-semibold block mb-1">رقم الروشتة</span>
                          <span className="text-lg font-black text-slate-800">{prescription.prescriptionNumber}</span>
                        </div>
                        <div>
                          <span className="text-xs text-slate-500 font-semibold block mb-1">تاريخ الإنشاء</span>
                          <span className="text-lg font-black text-slate-800">
                            {new Date(prescription.createdAt).toLocaleDateString('ar-EG', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Medications List */}
                    <div className="space-y-4">
                      {prescription.medications.map((med, index) => (
                        <div key={index} className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-5 border-2 border-green-200">
                          <div className="flex items-start gap-3">
                            {/* Number Badge */}
                            <div className="w-10 h-10 bg-green-500 text-white rounded-xl flex items-center justify-center text-lg font-black flex-shrink-0">
                              {index + 1}
                            </div>

                            {/* Medication Details */}
                            <div className="flex-1">
                              <h4 className="text-xl font-black text-slate-800 mb-3">
                                {med.medicationName}
                              </h4>

                              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <div className="bg-white rounded-lg p-3 border border-green-200">
                                  <span className="text-xs text-slate-500 font-semibold block mb-1">الجرعة</span>
                                  <span className="text-sm font-bold text-slate-800">{med.dosage}</span>
                                </div>

                                <div className="bg-white rounded-lg p-3 border border-green-200">
                                  <span className="text-xs text-slate-500 font-semibold block mb-1">التكرار</span>
                                  <span className="text-sm font-bold text-slate-800">{med.frequency}</span>
                                </div>

                                {med.durationDays && (
                                  <div className="bg-white rounded-lg p-3 border border-green-200">
                                    <span className="text-xs text-slate-500 font-semibold block mb-1">المدة</span>
                                    <span className="text-sm font-bold text-slate-800">{med.durationDays} يوم</span>
                                  </div>
                                )}

                                {med.specialInstructions && (
                                  <div className="bg-white rounded-lg p-3 border border-green-200 md:col-span-3">
                                    <span className="text-xs text-slate-500 font-semibold block mb-1">تعليمات خاصة</span>
                                    <span className="text-sm font-bold text-slate-800">{med.specialInstructions}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FaPrescription className="text-4xl text-slate-400" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-700 mb-2">لا توجد روشتة</h3>
                    <p className="text-slate-500">لم يتم كتابة روشتة لهذه الجلسة</p>
                  </div>
                )}
              </div>
            )}

            {/* Lab Tests Tab */}
            {activeTab === 'labs' && (
              <div className="animate-fadeIn">
                {appointment.labTests && appointment.labTests.length > 0 ? (
                  <div className="space-y-3">
                    {appointment.labTests.map((test, index) => (
                      <div key={index} className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-5 border-2 border-purple-200">
                        <div className="flex items-center gap-3">
                          {/* Number Badge */}
                          <div className="w-10 h-10 bg-purple-500 text-white rounded-xl flex items-center justify-center text-lg font-black flex-shrink-0">
                            {index + 1}
                          </div>

                          {/* Test Details */}
                          <div className="flex-1">
                            <h4 className="text-lg font-black text-slate-800">
                              {test.name}
                            </h4>
                            {test.notes && (
                              <p className="text-sm text-slate-600 mt-1">
                                <span className="font-semibold">ملاحظات:</span> {test.notes}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FaFlask className="text-4xl text-slate-400" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-700 mb-2">لا توجد تحاليل</h3>
                    <p className="text-slate-500">لم يتم طلب تحاليل لهذه الجلسة</p>
                  </div>
                )}
              </div>
            )}

          </div>

          {/* Footer */}
          <div className="bg-slate-50 border-t-2 border-slate-200 p-4">
            <button
              onClick={onClose}
              className="w-full px-6 py-3 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white rounded-xl font-bold transition-all duration-200"
            >
              إغلاق
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AppointmentDetailsModal;
