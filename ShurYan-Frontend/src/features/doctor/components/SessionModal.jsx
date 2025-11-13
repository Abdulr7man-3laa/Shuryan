import { useEffect, useState, useRef } from 'react';
import { useSession } from '../hooks/useSession';
import { useSessionManager } from '../hooks/useSessionManager';
import useAuth from '../../auth/hooks/useAuth';
import {
  FaTimes, FaClock, FaUser, FaNotesMedical, FaPrescriptionBottleAlt,
  FaFlask, FaFileAlt, FaStopCircle, FaPhone, FaCalendarAlt,
  FaCheckCircle, FaExclamationCircle, FaHeart, FaSave, FaPlus, FaTrash, FaPills
} from 'react-icons/fa';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Prescriptions from '../../../api/services/prescriptions.service';

// Prescription Options
const DOSAGE_OPTIONS = [
  'قرص واحد',
  'قرصين',
  '3 أقراص',
  'نصف قرص',
  'ربع قرص',
  'ملعقة صغيرة (5 مل)',
  'ملعقة كبيرة (15 مل)',
  'كبسولة واحدة',
  'كبسولتين',
  'حقنة واحدة',
  'بخة واحدة',
  'بختين',
  '3 بخات',
  'نقطة واحدة',
  'نقطتين',
  '3 نقط',
];

const FREQUENCY_OPTIONS = [
  'مرة واحدة يومياً',
  'مرتين يومياً',
  '3 مرات يومياً',
  '4 مرات يومياً',
  'مرة كل 12 ساعة',
  'مرة كل 8 ساعات',
  'مرة كل 6 ساعات',
  'مرة كل يومين',
  'مرة أسبوعياً',
  'مرتين في الأسبوع',
  '3 مرات في الأسبوع',
  'عند الحاجة',
  'قبل النوم',
  'صباحاً',
  'مساءً',
];

const DURATION_OPTIONS = [
  '3',
  '5',
  '7',
  '10',
  '14',
  '21',
  '30',
  '60',
  '90',
];

const SPECIAL_INSTRUCTIONS_OPTIONS = [
  'بعد الأكل',
  'قبل الأكل',
  'مع الأكل',
  'على معدة فارغة',
  'قبل النوم',
  'عند الاستيقاظ',
  'مع كوب ماء كامل',
  'لا تقود السيارة بعد تناوله',
  'تجنب التعرض للشمس',
  'احفظه في الثلاجة',
  'رج الزجاجة قبل الاستخدام',
  'لا تتوقف عن تناوله دون استشارة الطبيب',
  'أكمل الجرعة كاملة',
];

const SessionModal = ({ isOpen, onClose, appointmentId, appointmentData }) => {
  const {
    currentSession,
    patientInfo,
    patientMedicalRecord,
    documentation,
    loading,
    error,
    fetchPatientMedicalRecord,
    createPrescription,
    addDocumentation,
    fetchDocumentation,
    endSession,
    clearError,
  } = useSession();

  const { startOrResumeSession } = useSessionManager();
  const { user } = useAuth(); // Get logged in doctor

  const [activeTab, setActiveTab] = useState('home');
  const [docForm, setDocForm] = useState({
    chiefComplaint: '',
    historyOfPresentIllness: '',
    physicalExamination: '',
    diagnosis: '',
    managementPlan: '',
  });
  const [autoSaveStatus, setAutoSaveStatus] = useState(''); // '', 'saving', 'saved'
  const autoSaveTimeoutRef = useRef(null);
  const hasChangesRef = useRef(false);

  // Prescription State
  const [medications, setMedications] = useState([]);
  const [currentMedication, setCurrentMedication] = useState({
    medicationId: '',
    medicationName: '',
    dosage: '',
    frequency: '',
    durationDays: '',
    specialInstructions: '',
  });
  const [medOptions, setMedOptions] = useState([]);
  const [medicSearchVal, setMedicSearchVal] = useState('');
  const [selectedMedication, setSelectedMedication] = useState(null);
  
  useEffect(() => {
    const getMedicOptions = async () => {
      try {
        const { data } = await Prescriptions.getPrescriptions({ search: medicSearchVal });
        console.log('💊 Medication options:', data);
        setMedOptions(data || []);
      } catch (error) {
        console.error('❌ Error fetching medications:', error);
      }
    };
    getMedicOptions();
  }, [medicSearchVal]);
  // Initialize session when modal opens
  useEffect(() => {
    if (isOpen && appointmentId && appointmentData) {
      console.log('📋 Session Modal Opened:', {
        appointmentId,
        currentSession,
        patientInfo,
        appointmentData,
      });

      // Start session if not already active
      if (!currentSession || currentSession.appointmentId !== appointmentId) {
        console.log('🚀 Starting session from modal...', appointmentData);
        startOrResumeSession(appointmentData).then(result => {
          console.log('📥 Start session result:', result);
          if (!result.success) {
            console.error('❌ Failed to start session:', result.error);
          } else {
            console.log('✅ Session started successfully, currentSession should be set');
          }
        });
      } else {
        console.log('✅ Session already active:', currentSession);
      }
    }
  }, [isOpen, appointmentId, appointmentData, currentSession]);

  // Handle ESC key to close
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isOpen && !loading) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, loading, onClose]);

  const handleEndSession = async () => {
    const confirmed = window.confirm('هل أنت متأكد من إنهاء الجلسة؟');
    if (confirmed) {
      console.log('🔚 Ending session...');
      
      // ✅ Auto-save documentation before ending session (if any data exists)
      const hasDocumentation = docForm.chiefComplaint || docForm.historyOfPresentIllness || 
                               docForm.physicalExamination || docForm.diagnosis || 
                               docForm.managementPlan;
      
      if (hasDocumentation) {
        console.log('💾 Saving documentation before ending session...');
        const documentationPayload = {
          ...docForm,
          sessionType: currentSession?.sessionType || 1,
        };
        console.log('📤 Final documentation payload:', documentationPayload);
        
        const docResult = await addDocumentation(documentationPayload, true);
        if (docResult.success) {
          console.log('✅ Documentation saved before ending session');
        } else {
          console.error('❌ Failed to save documentation:', docResult.error);
        }
      } else {
        console.log('ℹ️ No documentation to save');
      }
      
      // End the session
      const result = await endSession();
      if (result.success) {
        console.log('✅ Session ended successfully');
        onClose();
      } else {
        console.error('❌ Failed to end session:', result.error);
      }
    }
  };

  const handleFetchMedicalRecord = async () => {
    await fetchPatientMedicalRecord();
    setActiveTab('medical');
  };

  // Fetch documentation when switching to documentation tab
  const handleDocumentationTab = async () => {
    setActiveTab('documentation');
    if (!documentation && currentSession) {
      const result = await fetchDocumentation();
      if (result.success && result.data) {
        setDocForm({
          chiefComplaint: result.data.chiefComplaint || '',
          historyOfPresentIllness: result.data.historyOfPresentIllness || '',
          physicalExamination: result.data.physicalExamination || '',
          diagnosis: result.data.diagnosis || '',
          managementPlan: result.data.managementPlan || '',
        });
      }
    } else if (documentation) {
      // Load existing documentation
      setDocForm({
        chiefComplaint: documentation.chiefComplaint || '',
        historyOfPresentIllness: documentation.historyOfPresentIllness || '',
        physicalExamination: documentation.physicalExamination || '',
        diagnosis: documentation.diagnosis || '',
        managementPlan: documentation.managementPlan || '',
      });
    }
  };

  // Handle documentation form change
  const handleDocFormChange = (field, value) => {
    setDocForm(prev => ({ ...prev, [field]: value }));
    hasChangesRef.current = true;
    setAutoSaveStatus('');
  };

  // Auto-save documentation
  useEffect(() => {
    if (hasChangesRef.current && activeTab === 'documentation') {
      // Clear previous timeout
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }

      // Set new timeout
      autoSaveTimeoutRef.current = setTimeout(async () => {
        console.log('🔄 Auto-saving documentation...');
        setAutoSaveStatus('saving');
        // ✅ Include sessionType from currentSession (1=كشف عادي, 2=متابعة)
        const documentationPayload = {
          ...docForm,
          sessionType: currentSession?.sessionType || 1, // Use sessionType from session
        };
        console.log('📤 Documentation payload:', documentationPayload);
        console.log('📋 Session Type:', currentSession?.sessionType);
        
        const result = await addDocumentation(documentationPayload, true); // silent save
        
        if (result.success) {
          console.log('✅ Documentation saved successfully:', result.data);
          setAutoSaveStatus('saved');
          hasChangesRef.current = false;
          setTimeout(() => setAutoSaveStatus(''), 2000);
        } else {
          console.error('❌ Failed to save documentation:', result.error);
          setAutoSaveStatus('');
        }
      }, 3000);
    }

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [docForm, activeTab]);

  if (!isOpen) return null;



  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden">

        {/* ==================== HEADER ==================== */}
        <div className="relative bg-gradient-to-br from-teal-600 via-teal-500 to-emerald-500 text-white p-8 overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-400/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>

          <div className="relative z-10">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute -top-4 -left-4 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/30 transition-all"
            >
              <FaTimes className="w-5 h-5" />
            </button>

            {/* End Session Button - Only show if session is NOT completed */}
            {(() => {
              console.log('🔍 Session Status Check:', {
                status: currentSession?.status,
                statusType: typeof currentSession?.status,
                isCompleted: currentSession?.status === 4 || currentSession?.status === 'Completed',
                shouldShowEndButton: currentSession?.status !== 4 && currentSession?.status !== 'Completed'
              });
              // Check both number (4) and string ('Completed')
              return currentSession?.status !== 4 && currentSession?.status !== 'Completed';
            })() && (
              <button
                onClick={handleEndSession}
                disabled={loading}
                className="absolute top-11 -left-4 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl shadow-lg hover:shadow-xl flex items-center gap-2 transition-all disabled:opacity-50 font-black text-base whitespace-nowrap hover:scale-105"
              >
                <FaStopCircle className="w-5 h-5" />
                إنهاء الجلسة
              </button>
            )}

            <div className="flex items-start justify-between gap-6">
              {/* Patient Info */}
              <div className="flex items-center gap-4 flex-1">
                {/* Avatar */}
                <div className="relative">
                  {patientInfo?.patientProfileImageUrl ? (
                    <img
                      src={patientInfo.patientProfileImageUrl}
                      alt={patientInfo.patientFullName}
                      className="w-20 h-20 rounded-2xl object-cover border-4 border-white/30 shadow-lg"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-md border-4 border-white/30 flex items-center justify-center shadow-lg">
                      <FaUser className="w-10 h-10 text-white/80" />
                    </div>
                  )}
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 border-4 border-white/30 rounded-full"></div>
                </div>

                {/* Info */}
                <div className="flex-1">
                  <h2 className="text-2xl font-black mb-1">{patientInfo?.patientFullName || 'المريض'}</h2>
                  <div className="flex items-center gap-4 text-sm text-white/90">
                    {patientInfo?.patientAge && (
                      <span className="flex items-center gap-1">
                        <FaUser className="w-3 h-3" />
                        {patientInfo.patientAge} سنة
                      </span>
                    )}
                    {patientInfo?.phoneNumber && (
                      <span className="flex items-center gap-1">
                        <FaPhone className="w-3 h-3" />
                        {patientInfo.phoneNumber}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${currentSession?.sessionType === 1
                      ? 'bg-blue-500/90'
                      : 'bg-purple-500/90'
                      }`}>
                      {currentSession?.sessionType === 1 ? '🩺 كشف جديد' : '📋 إعادة كشف'}
                    </span>
                    <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold">
                      <FaCalendarAlt className="inline w-3 h-3 ml-1" />
                      {currentSession?.scheduledStartTime && new Date(currentSession.scheduledStartTime).toLocaleDateString('ar-EG')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ==================== QUICK ACTIONS ==================== */}
        <div className="bg-gradient-to-r from-slate-50 to-white px-8 py-4 border-b border-slate-200">
          <div className="grid grid-cols-5 gap-3">
            <button
              onClick={() => setActiveTab('home')}
              className={`flex flex-col items-center gap-2 p-3 bg-white rounded-xl shadow-sm hover:shadow-md border-2 transition-all group ${activeTab === 'home' ? 'border-teal-500 bg-teal-50' : 'border-transparent hover:border-teal-500'
                }`}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-slate-500 to-slate-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <FaUser className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-bold text-slate-700">الرئيسية</span>
            </button>

            <button
              onClick={handleFetchMedicalRecord}
              disabled={loading}
              className={`flex flex-col items-center gap-2 p-3 bg-white rounded-xl shadow-sm hover:shadow-md border-2 transition-all group disabled:opacity-50 ${activeTab === 'medical' ? 'border-red-500 bg-red-50' : 'border-transparent hover:border-teal-500'
                }`}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <FaHeart className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-bold text-slate-700">السجل الطبي</span>
            </button>

            <button
              onClick={() => setActiveTab('prescription')}
              className={`flex flex-col items-center gap-2 p-3 bg-white rounded-xl shadow-sm hover:shadow-md border-2 transition-all group ${activeTab === 'prescription' ? 'border-teal-500 bg-teal-50' : 'border-transparent hover:border-teal-500'
                }`}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <FaPrescriptionBottleAlt className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-bold text-slate-700">روشتة</span>
            </button>

            <button
              onClick={() => setActiveTab('lab')}
              className={`flex flex-col items-center gap-2 p-3 bg-white rounded-xl shadow-sm hover:shadow-md border-2 transition-all group ${activeTab === 'lab' ? 'border-blue-500 bg-blue-50' : 'border-transparent hover:border-teal-500'
                }`}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <FaFlask className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-bold text-slate-700">تحاليل</span>
            </button>

            <button
              onClick={handleDocumentationTab}
              className={`flex flex-col items-center gap-2 p-3 bg-white rounded-xl shadow-sm hover:shadow-md border-2 transition-all group ${activeTab === 'documentation' ? 'border-purple-500 bg-purple-50' : 'border-transparent hover:border-teal-500'
                }`}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <FaFileAlt className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-bold text-slate-700">التوثيق</span>
            </button>
          </div>
        </div>

        {/* ==================== CONTENT AREA ==================== */}
        <div className="p-8 overflow-y-auto max-h-[50vh]">
          {/* Error State */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-r-4 border-red-500 rounded-lg flex items-start gap-3">
              <FaExclamationCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-red-800 font-semibold">{error}</p>
                <button onClick={clearError} className="mt-2 text-sm text-red-600 hover:text-red-700 underline">
                  إخفاء
                </button>
              </div>
            </div>
          )}

          {/* Tab: Home (Main) */}
          {activeTab === 'home' && (
            <div className="space-y-6">
              <h3 className="text-xl font-black text-slate-800 mb-4 flex items-center gap-2">
                <div className="w-1 h-6 bg-gradient-to-b from-teal-500 to-emerald-500 rounded-full"></div>
                تفاصيل الجلسة
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                  <p className="text-xs text-blue-600 font-semibold mb-1">رقم الجلسة</p>
                  <p className="text-sm font-black text-blue-900 truncate">{currentSession?.sessionId?.substring(0, 13)}...</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-100">
                  <p className="text-xs text-purple-600 font-semibold mb-1">الحالة</p>
                  <p className="text-sm font-black text-purple-900">{currentSession?.status}</p>
                </div>
                <div className="p-4 bg-gradient-to-br from-teal-50 to-emerald-50 rounded-xl border border-teal-100">
                  <p className="text-xs text-teal-600 font-semibold mb-1">وقت البداية</p>
                  <p className="text-sm font-black text-teal-900">
                    {currentSession?.startTime && new Date(currentSession.startTime).toLocaleTimeString('ar-EG')}
                  </p>
                </div>
                <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-100">
                  <p className="text-xs text-amber-600 font-semibold mb-1">المدة المتوقعة</p>
                  <p className="text-sm font-black text-amber-900">{currentSession?.durationMinutes} دقيقة</p>
                </div>
              </div>
            </div>
          )}

          {/* Tab: Medical Record */}
          {activeTab === 'medical' && (
            <div className="space-y-6">
              <h3 className="text-xl font-black text-slate-800 mb-4 flex items-center gap-2">
                <div className="w-1 h-6 bg-gradient-to-b from-red-500 to-pink-500 rounded-full"></div>
                السجل الطبي
              </h3>
              {loading ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-slate-600 font-semibold">جاري تحميل السجل الطبي...</p>
                </div>
              ) : patientMedicalRecord ? (
                <div className="space-y-6">
                  {/* Drug Allergies Section */}
                  <div className="bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden">
                    <div className="bg-gradient-to-r from-red-50 to-pink-50 border-b-2 border-red-200 px-5 py-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-base font-black text-slate-800 flex items-center gap-2.5">
                          <div className="w-9 h-9 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center shadow-md">
                            <FaNotesMedical className="text-white text-sm" />
                          </div>
                          الحساسية من الأدوية
                        </h4>
                        <span className="text-sm font-bold text-red-700 bg-red-100 px-3.5 py-1.5 rounded-full">
                          {patientMedicalRecord.drugAllergies?.length || 0}
                        </span>
                      </div>
                    </div>
                    <div className="p-4 space-y-2.5">
                      {patientMedicalRecord.drugAllergies && patientMedicalRecord.drugAllergies.length > 0 ? (
                        patientMedicalRecord.drugAllergies.map((allergy, index) => (
                          <div
                            key={allergy.id}
                            className="group bg-white hover:bg-red-50/30 rounded-xl p-4 border-2 border-slate-200 hover:border-red-400 transition-all duration-200 shadow-sm hover:shadow-md"
                          >
                            <div className="flex items-start gap-3.5">
                              <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-slate-100 border-2 border-slate-300 rounded-lg flex items-center justify-center group-hover:bg-red-100 group-hover:border-red-400 transition-all">
                                  <span className="text-slate-700 font-black text-sm group-hover:text-red-700">#{index + 1}</span>
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-red-900 mb-1">{allergy.drugName}</p>
                                <p className="text-sm text-red-700 mb-2">{allergy.reaction}</p>
                                <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-500 w-fit">
                                  <FaCalendarAlt className="text-red-600 text-[10px]" />
                                  <span className="font-medium">{allergy.createdAt && new Date(allergy.createdAt).toLocaleDateString('ar-EG')}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-slate-400 text-sm text-center py-4">لا توجد حساسية مسجلة</p>
                      )}
                    </div>
                  </div>

                  {/* Chronic Diseases Section */}
                  <div className="bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden">
                    <div className="bg-gradient-to-r from-orange-50 to-amber-50 border-b-2 border-orange-200 px-5 py-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-base font-black text-slate-800 flex items-center gap-2.5">
                          <div className="w-9 h-9 bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl flex items-center justify-center shadow-md">
                            <FaNotesMedical className="text-white text-sm" />
                          </div>
                          الأمراض المزمنة
                        </h4>
                        <span className="text-sm font-bold text-orange-700 bg-orange-100 px-3.5 py-1.5 rounded-full">
                          {patientMedicalRecord.chronicDiseases?.length || 0}
                        </span>
                      </div>
                    </div>
                    <div className="p-4 space-y-2.5">
                      {patientMedicalRecord.chronicDiseases && patientMedicalRecord.chronicDiseases.length > 0 ? (
                        patientMedicalRecord.chronicDiseases.map((disease, index) => (
                          <div
                            key={disease.id}
                            className="group bg-white hover:bg-orange-50/30 rounded-xl p-4 border-2 border-slate-200 hover:border-orange-400 transition-all duration-200 shadow-sm hover:shadow-md"
                          >
                            <div className="flex items-start gap-3.5">
                              <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-slate-100 border-2 border-slate-300 rounded-lg flex items-center justify-center group-hover:bg-orange-100 group-hover:border-orange-400 transition-all">
                                  <span className="text-slate-700 font-black text-sm group-hover:text-orange-700">#{index + 1}</span>
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-orange-900 mb-2">{disease.diseaseName}</p>
                                <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-500 w-fit">
                                  <FaCalendarAlt className="text-orange-600 text-[10px]" />
                                  <span className="font-medium">{disease.createdAt && new Date(disease.createdAt).toLocaleDateString('ar-EG')}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-slate-400 text-sm text-center py-4">لا توجد أمراض مزمنة مسجلة</p>
                      )}
                    </div>
                  </div>

                  {/* Current Medications Section */}
                  <div className="bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden">
                    <div className="bg-gradient-to-r from-teal-50 to-emerald-50 border-b-2 border-teal-200 px-5 py-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-base font-black text-slate-800 flex items-center gap-2.5">
                          <div className="w-9 h-9 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-md">
                            <FaPrescriptionBottleAlt className="text-white text-sm" />
                          </div>
                          الأدوية الحالية
                        </h4>
                        <span className="text-sm font-bold text-teal-700 bg-teal-100 px-3.5 py-1.5 rounded-full">
                          {patientMedicalRecord.currentMedications?.length || 0}
                        </span>
                      </div>
                    </div>
                    <div className="p-4 space-y-2.5">
                      {patientMedicalRecord.currentMedications && patientMedicalRecord.currentMedications.length > 0 ? (
                        patientMedicalRecord.currentMedications.map((medication, index) => (
                          <div
                            key={medication.id}
                            className="group bg-white hover:bg-teal-50/30 rounded-xl p-4 border-2 border-slate-200 hover:border-teal-400 transition-all duration-200 shadow-sm hover:shadow-md"
                          >
                            <div className="flex items-start gap-3.5">
                              <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-slate-100 border-2 border-slate-300 rounded-lg flex items-center justify-center group-hover:bg-teal-100 group-hover:border-teal-400 transition-all">
                                  <span className="text-slate-700 font-black text-sm group-hover:text-teal-700">#{index + 1}</span>
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-teal-900 mb-2">{medication.medicationName}</p>
                                <div className="grid grid-cols-2 gap-2 mb-2 text-sm text-teal-700">
                                  <p>الجرعة: {medication.dosage}</p>
                                  <p>التكرار: {medication.frequency}</p>
                                </div>
                                {medication.reason && (
                                  <p className="text-sm text-teal-600 mb-2">السبب: {medication.reason}</p>
                                )}
                                <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-500 w-fit">
                                  <FaCalendarAlt className="text-teal-600 text-[10px]" />
                                  <span className="font-medium">بدء: {medication.startDate && new Date(medication.startDate).toLocaleDateString('ar-EG')}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-slate-400 text-sm text-center py-4">لا توجد أدوية حالية</p>
                      )}
                    </div>
                  </div>

                  {/* Previous Surgeries Section */}
                  <div className="bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden">
                    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b-2 border-indigo-200 px-5 py-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-base font-black text-slate-800 flex items-center gap-2.5">
                          <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-md">
                            <FaNotesMedical className="text-white text-sm" />
                          </div>
                          العمليات الجراحية السابقة
                        </h4>
                        <span className="text-sm font-bold text-indigo-700 bg-indigo-100 px-3.5 py-1.5 rounded-full">
                          {patientMedicalRecord.previousSurgeries?.length || 0}
                        </span>
                      </div>
                    </div>
                    <div className="p-4 space-y-2.5">
                      {patientMedicalRecord.previousSurgeries && patientMedicalRecord.previousSurgeries.length > 0 ? (
                        patientMedicalRecord.previousSurgeries.map((surgery, index) => (
                          <div
                            key={surgery.id}
                            className="group bg-white hover:bg-indigo-50/30 rounded-xl p-4 border-2 border-slate-200 hover:border-indigo-400 transition-all duration-200 shadow-sm hover:shadow-md"
                          >
                            <div className="flex items-start gap-3.5">
                              <div className="flex-shrink-0">
                                <div className="w-8 h-8 bg-slate-100 border-2 border-slate-300 rounded-lg flex items-center justify-center group-hover:bg-indigo-100 group-hover:border-indigo-400 transition-all">
                                  <span className="text-slate-700 font-black text-sm group-hover:text-indigo-700">#{index + 1}</span>
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-indigo-900 mb-2">{surgery.surgeryName}</p>
                                <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-500 w-fit">
                                  <FaCalendarAlt className="text-indigo-600 text-[10px]" />
                                  <span className="font-medium">{surgery.surgeryDate && new Date(surgery.surgeryDate).toLocaleDateString('ar-EG')}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-slate-400 text-sm text-center py-4">لا توجد عمليات جراحية مسجلة</p>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <FaNotesMedical className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-600 font-semibold">لا توجد سجلات طبية متاحة</p>
                  <button
                    onClick={handleFetchMedicalRecord}
                    className="mt-4 px-6 py-2 bg-teal-600 text-white rounded-xl hover:bg-teal-700 font-semibold"
                  >
                    تحميل السجل الطبي
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Tab: Prescription */}
          {activeTab === 'prescription' && (
            <div className="space-y-6">
              {/* Add Medication Form */}
              <div className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-2xl p-6 border-2 border-teal-200">
                <h4 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <FaPills className="text-teal-600" />
                  إضافة دواء
                </h4>

                {/* Medication Name - Full Width */}
                <div className="mb-4">
                  <Autocomplete
                    disablePortal
                    filterOptions={(x) => x}
                    getOptionLabel={(option) => option.brandName || ''}
                    options={medOptions}
                    value={selectedMedication}
                    onChange={(event, newValue) => {
                      console.log('💊 Selected medication:', newValue);
                      setSelectedMedication(newValue);
                      if (newValue) {
                        setCurrentMedication({
                          ...currentMedication,
                          medicationId: newValue.id || '',
                          medicationName: newValue.brandName || '',
                        });
                      } else {
                        setCurrentMedication({
                          ...currentMedication,
                          medicationId: '',
                          medicationName: '',
                        });
                      }
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        dir="rtl"
                        label="اسم الدواء *"
                        placeholder="ابحث عن الدواء..."
                        onChange={(e) => setMedicSearchVal(e.target.value)}
                      />
                    )}
                  />
                </div>

                {/* All Other Fields in One Row */}
                <div className="grid grid-cols-4 gap-3">
                  {/* Dosage */}
                  <div>
                    <Autocomplete
                      freeSolo
                      options={DOSAGE_OPTIONS}
                      value={currentMedication.dosage}
                      onChange={(event, newValue) => {
                        setCurrentMedication({ ...currentMedication, dosage: newValue || '' });
                      }}
                      onInputChange={(event, newInputValue) => {
                        setCurrentMedication({ ...currentMedication, dosage: newInputValue });
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="الجرعة *"
                          placeholder="قرص واحد"
                          dir="rtl"
                          size="small"
                        />
                      )}
                    />
                  </div>

                  {/* Frequency */}
                  <div>
                    <Autocomplete
                      freeSolo
                      options={FREQUENCY_OPTIONS}
                      value={currentMedication.frequency}
                      onChange={(event, newValue) => {
                        setCurrentMedication({ ...currentMedication, frequency: newValue || '' });
                      }}
                      onInputChange={(event, newInputValue) => {
                        setCurrentMedication({ ...currentMedication, frequency: newInputValue });
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="عدد المرات *"
                          placeholder="3 مرات يومياً"
                          dir="rtl"
                          size="small"
                        />
                      )}
                    />
                  </div>

                  {/* Duration */}
                  <div>
                    <Autocomplete
                      freeSolo
                      options={DURATION_OPTIONS}
                      value={currentMedication.durationDays}
                      onChange={(event, newValue) => {
                        setCurrentMedication({ ...currentMedication, durationDays: newValue || '' });
                      }}
                      onInputChange={(event, newInputValue) => {
                        setCurrentMedication({ ...currentMedication, durationDays: newInputValue });
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="المدة (بالأيام) *"
                          placeholder="7"
                          dir="rtl"
                          size="small"
                          type="number"
                        />
                      )}
                    />
                  </div>

                  {/* Special Instructions */}
                  <div>
                    <Autocomplete
                      freeSolo
                      options={SPECIAL_INSTRUCTIONS_OPTIONS}
                      value={currentMedication.specialInstructions}
                      onChange={(event, newValue) => {
                        setCurrentMedication({ ...currentMedication, specialInstructions: newValue || '' });
                      }}
                      onInputChange={(event, newInputValue) => {
                        setCurrentMedication({ ...currentMedication, specialInstructions: newInputValue });
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="تعليمات خاصة"
                          placeholder="بعد الأكل"
                          dir="rtl"
                          size="small"
                        />
                      )}
                    />
                  </div>
                </div>

                {/* Add Button */}
                <button
                  onClick={() => {
                    // Validation
                    if (!currentMedication.medicationName || !currentMedication.dosage || 
                        !currentMedication.frequency || !currentMedication.durationDays) {
                      alert('⚠️ يرجى ملء جميع الحقول المطلوبة');
                      return;
                    }

                    // Add to list
                    setMedications([...medications, { 
                      ...currentMedication, 
                      id: Date.now(),
                      durationDays: parseInt(currentMedication.durationDays) || 0
                    }]);
                    
                    // Reset form
                    setCurrentMedication({
                      medicationId: '',
                      medicationName: '',
                      dosage: '',
                      frequency: '',
                      durationDays: '',
                      specialInstructions: '',
                    });
                    setSelectedMedication(null);
                    setMedicSearchVal('');
                    
                    console.log('✅ Medication added to list');
                  }}
                  disabled={!currentMedication.medicationName || !currentMedication.dosage || 
                           !currentMedication.frequency || !currentMedication.durationDays}
                  className="mt-4 w-full px-6 py-3 bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-xl font-bold hover:shadow-lg hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                >
                  <FaPlus />
                  إضافة الدواء للروشتة
                </button>
              </div>

              {/* Medications List */}
              {medications.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                      <FaPrescriptionBottleAlt className="text-teal-600" />
                      الأدوية المضافة ({medications.length})
                    </h4>
                  </div>

                  <div className="space-y-3">
                    {medications.map((med, index) => (
                      <div
                        key={med.id}
                        className="bg-white rounded-xl p-5 border-2 border-slate-200 hover:border-teal-300 transition-all duration-200 hover:shadow-md"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-3">
                              <span className="w-8 h-8 bg-teal-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                                {index + 1}
                              </span>
                              <h5 className="text-lg font-black text-slate-800">
                                {med.medicationName}
                              </h5>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                              <div className="bg-slate-50 rounded-lg p-2">
                                <p className="text-slate-500 font-semibold mb-1">الجرعة</p>
                                <p className="text-slate-800 font-bold">{med.dosage}</p>
                              </div>
                              <div className="bg-slate-50 rounded-lg p-2">
                                <p className="text-slate-500 font-semibold mb-1">عدد المرات</p>
                                <p className="text-slate-800 font-bold">{med.frequency}</p>
                              </div>
                              <div className="bg-slate-50 rounded-lg p-2">
                                <p className="text-slate-500 font-semibold mb-1">المدة</p>
                                <p className="text-slate-800 font-bold">{med.durationDays} يوم</p>
                              </div>
                              {med.specialInstructions && (
                                <div className="bg-teal-50 rounded-lg p-2 col-span-2 md:col-span-1">
                                  <p className="text-teal-600 font-semibold mb-1">تعليمات</p>
                                  <p className="text-slate-800 font-bold">{med.specialInstructions}</p>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Delete Button */}
                          <button
                            onClick={() => setMedications(medications.filter(m => m.id !== med.id))}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                            title="حذف الدواء"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Save Prescription Button */}
                  <button
                    onClick={async () => {
                      try {
                        console.log('💊 Saving prescription...');
                        console.log('📋 Current medications:', medications);
                        console.log('🔍 Debug - currentSession:', currentSession);
                        console.log('🔍 Debug - patientInfo:', patientInfo);
                        console.log('🔍 Debug - appointmentData:', appointmentData);
                        console.log('🔍 Debug - appointmentId:', appointmentId);
                        
                        // Validation
                        if (medications.length === 0) {
                          alert('⚠️ يرجى إضافة دواء واحد على الأقل');
                          return;
                        }

                        // Get required data - Try multiple sources
                        const doctorId = currentSession?.doctorId || 
                                        appointmentData?.doctorId || 
                                        user?.id; // ← Fallback to logged in doctor
                        const patientIdFromSession = patientInfo?.patientId || 
                                                    appointmentData?.patientId || 
                                                    currentSession?.patientId;

                        console.log('🔍 Extracted IDs:', { 
                          doctorId, 
                          patientIdFromSession, 
                          appointmentId,
                          fromCurrentSession: currentSession?.doctorId,
                          fromAppointmentData: appointmentData?.doctorId,
                          fromLoggedInUser: user?.id,
                          fromPatientInfo: patientInfo?.patientId,
                          fromAppointmentDataPatient: appointmentData?.patientId,
                          fromCurrentSessionPatient: currentSession?.patientId
                        });

                        if (!doctorId || !patientIdFromSession || !appointmentId) {
                          alert('❌ بيانات الجلسة غير مكتملة\n\nالبيانات الناقصة:\n' + 
                                (!doctorId ? '- معرف الطبيب\n' : '') +
                                (!patientIdFromSession ? '- معرف المريض\n' : '') +
                                (!appointmentId ? '- معرف الموعد\n' : ''));
                          console.error('❌ Missing data:', { 
                            doctorId, 
                            patientIdFromSession, 
                            appointmentId,
                            currentSession,
                            patientInfo,
                            appointmentData
                          });
                          return;
                        }

                        // Prepare medications (remove temporary id, keep medicationId)
                        const preparedMedications = medications.map(({ id, ...med }) => ({
                          medicationId: med.medicationId || '00000000-0000-0000-0000-000000000000',
                          dosage: med.dosage,
                          frequency: med.frequency,
                          durationDays: parseInt(med.durationDays) || 0,
                          specialInstructions: med.specialInstructions || '',
                        }));

                        console.log('📤 Prepared medications:', preparedMedications);

                        const result = await createPrescription({
                          appointmentId,
                          doctorId,
                          patientId: patientIdFromSession,
                          medications: preparedMedications,
                        });

                        console.log('📥 Save result:', result);

                        if (result.success) {
                          alert('✅ تم حفظ الروشتة بنجاح!');
                          // Clear medications after successful save
                          setMedications([]);
                          setCurrentMedication({
                            medicationId: '',
                            medicationName: '',
                            dosage: '',
                            frequency: '',
                            durationDays: '',
                            specialInstructions: '',
                          });
                          setSelectedMedication(null);
                          setMedicSearchVal('');
                        } else {
                          alert(`❌ فشل حفظ الروشتة: ${result.error}`);
                        }
                      } catch (error) {
                        console.error('❌ Error saving prescription:', error);
                        alert('❌ حدث خطأ أثناء حفظ الروشتة');
                      }
                    }}
                    disabled={medications.length === 0}
                    className="w-full px-6 py-4 bg-gradient-to-r from-[#223045] to-slate-700 text-white rounded-xl font-black text-lg hover:shadow-xl hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                  >
                    <FaSave />
                    حفظ الروشتة ({medications.length} دواء)
                  </button>
                </div>
              )}

              {/* Empty State */}
              {medications.length === 0 && (
                <div className="text-center py-8 bg-slate-50 rounded-xl border-2 border-dashed border-slate-300">
                  <FaPrescriptionBottleAlt className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500 font-semibold">لم يتم إضافة أي أدوية بعد</p>
                  <p className="text-slate-400 text-sm mt-1">قم بملء النموذج أعلاه لإضافة دواء</p>
                </div>
              )}
            </div>
          )}

          {/* Tab: Lab Test */}
          {activeTab === 'lab' && (
            <div className="space-y-6">
              <h3 className="text-xl font-black text-slate-800 mb-4 flex items-center gap-2">
                <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-full"></div>
                طلب تحاليل
              </h3>
              <div className="text-center py-12">
                <FaFlask className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-600 font-semibold">قريباً - نموذج طلب التحاليل</p>
              </div>
            </div>
          )}

          {/* Tab: Documentation */}
          {activeTab === 'documentation' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                {autoSaveStatus && (
                  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold ${autoSaveStatus === 'saving' ? 'bg-blue-50 text-blue-600' :
                    autoSaveStatus === 'saved' ? 'bg-green-50 text-green-600' : ''
                    }`}>
                    {autoSaveStatus === 'saving' && (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
                        <span>جاري الحفظ...</span>
                      </>
                    )}
                    {autoSaveStatus === 'saved' && (
                      <>
                        <FaSave className="text-green-600" />
                        <span>تم الحفظ تلقائياً</span>
                      </>
                    )}
                  </div>
                )}
              </div>

              <form className="space-y-5">
                {/* الشكوى الرئيسية */}
                <div>
                  <label className="block text-xl font-bold text-slate-700 mb-2">
                    الشكوى الرئيسية
                  </label>
                  <textarea
                    value={docForm.chiefComplaint}
                    onChange={(e) => handleDocFormChange('chiefComplaint', e.target.value)}
                    rows="3"
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all resize-none text-sm"
                    placeholder="الإبلاغ عن درجة الحرارة وصداع..."
                  ></textarea>
                </div>

                {/* تاريخ المرض الحالي */}
                <div>
                  <label className="block text-xl font-bold text-slate-700 mb-2">
                    تاريخ المرض الحالي
                  </label>
                  <textarea
                    value={docForm.historyOfPresentIllness}
                    onChange={(e) => handleDocFormChange('historyOfPresentIllness', e.target.value)}
                    rows="4"
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all resize-none text-sm"
                    placeholder="بدأت الأعراض منذ يومين، مع تفاقم تدريجي للشدة..."
                  ></textarea>
                </div>

                {/* الفحص الجسدي */}
                <div>
                  <label className="block text-xl font-bold text-slate-700 mb-2">
                    الفحص الجسدي
                  </label>
                  <textarea
                    value={docForm.physicalExamination}
                    onChange={(e) => handleDocFormChange('physicalExamination', e.target.value)}
                    rows="4"
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all resize-none text-sm"
                    placeholder="احتقان في الحلق، صوت صفير خفيف في الصدر..."
                  ></textarea>
                </div>

                {/* التقييم والتشخيص */}
                <div>
                  <label className="block text-xl font-bold text-slate-700 mb-2">
                    التقييم والتشخيص
                  </label>
                  <textarea
                    value={docForm.diagnosis}
                    onChange={(e) => handleDocFormChange('diagnosis', e.target.value)}
                    rows="3"
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all resize-none text-sm"
                    placeholder="إنه بشكل حاد..."
                  ></textarea>
                </div>

                {/* الخطة العلاجية */}
                <div>
                  <label className="block text-xl font-bold text-slate-700 mb-2">
                    الخطة العلاجية
                  </label>
                  <textarea
                    value={docForm.managementPlan}
                    onChange={(e) => handleDocFormChange('managementPlan', e.target.value)}
                    rows="4"
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all resize-none text-sm"
                    placeholder="وصف دواء علاج موسع للشعب الهوائية، متابعة بعد 3 أيام..."
                  ></textarea>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* ==================== FOOTER ==================== */}
        <div className="bg-gradient-to-r from-slate-50 to-white px-8 py-6 border-t border-slate-200">
          <div className="flex items-center justify-center">
            <button
              onClick={onClose}
              disabled={loading}
              className="px-8 py-3 bg-slate-200 text-slate-700 rounded-xl hover:bg-slate-300 font-bold transition-all disabled:opacity-50"
            >
              إغلاق
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionModal;
