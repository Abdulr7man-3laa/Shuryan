import { useEffect, useState, useRef } from 'react';
import { useSession } from '../hooks/useSession';
import { useSessionManager } from '../hooks/useSessionManager';
import useAuth from '../../auth/hooks/useAuth';
import SessionHeader from './session/SessionHeader';
import MedicalRecordTab from './session/MedicalRecordTab';
import PrescriptionTab from './session/PrescriptionTab';
import LabTab from './session/LabTab';
import DocumentationTab from './session/DocumentationTab';
import ErrorAlert from './session/ErrorAlert';

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
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('medical');
  const [docForm, setDocForm] = useState({
    chiefComplaint: '',
    historyOfPresentIllness: '',
    physicalExamination: '',
    diagnosis: '',
    managementPlan: '',
  });
  const [autoSaveStatus, setAutoSaveStatus] = useState('');
  const autoSaveTimeoutRef = useRef(null);
  const hasChangesRef = useRef(false);

  // Initialize session when modal opens
  useEffect(() => {
    if (isOpen && appointmentId && appointmentData) {
      if (!currentSession || currentSession.appointmentId !== appointmentId) {
        startOrResumeSession(appointmentData);
      }
    }
  }, [isOpen, appointmentId, appointmentData, currentSession, startOrResumeSession]);

  // Auto-fetch medical record when session starts or medical tab is active
  useEffect(() => {
    if (isOpen && currentSession && activeTab === 'medical' && !patientMedicalRecord && !loading) {
      fetchPatientMedicalRecord();
    }
  }, [isOpen, currentSession, activeTab, patientMedicalRecord, loading, fetchPatientMedicalRecord]);

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

  // Auto-save documentation
  useEffect(() => {
    if (hasChangesRef.current && activeTab === 'documentation') {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }

      autoSaveTimeoutRef.current = setTimeout(async () => {
        setAutoSaveStatus('saving');
        const documentationPayload = {
          ...docForm,
          sessionType: currentSession?.sessionType || 1,
        };
        
        const result = await addDocumentation(documentationPayload, true);
        
        if (result.success) {
          setAutoSaveStatus('saved');
          hasChangesRef.current = false;
          setTimeout(() => setAutoSaveStatus(''), 2000);
        } else {
          setAutoSaveStatus('');
        }
      }, 3000);
    }

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [docForm, activeTab, currentSession, addDocumentation]);

  const handleEndSession = async () => {
    const confirmed = window.confirm('هل أنت متأكد من إنهاء الجلسة؟');
    if (confirmed) {
      const hasDocumentation = docForm.chiefComplaint || docForm.historyOfPresentIllness || 
                               docForm.physicalExamination || docForm.diagnosis || 
                               docForm.managementPlan;
      
      if (hasDocumentation) {
        const documentationPayload = {
          ...docForm,
          sessionType: currentSession?.sessionType || 1,
        };
        await addDocumentation(documentationPayload, true);
      }
      
      const result = await endSession();
      if (result.success) {
        onClose();
      }
    }
  };

  const handleTabChange = async (tabId) => {
    setActiveTab(tabId);
    if (tabId === 'medical' && !patientMedicalRecord) {
      await fetchPatientMedicalRecord();
    } else if (tabId === 'documentation') {
      await handleDocumentationTab();
    }
  };

  const handleDocumentationTab = async () => {
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
      setDocForm({
        chiefComplaint: documentation.chiefComplaint || '',
        historyOfPresentIllness: documentation.historyOfPresentIllness || '',
        physicalExamination: documentation.physicalExamination || '',
        diagnosis: documentation.diagnosis || '',
        managementPlan: documentation.managementPlan || '',
      });
    }
  };

  const handleDocFormChange = (field, value) => {
    setDocForm(prev => ({ ...prev, [field]: value }));
    hasChangesRef.current = true;
    setAutoSaveStatus('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden">

        {/* Header with Tabs */}
        <SessionHeader
          patientInfo={patientInfo}
          currentSession={currentSession}
          loading={loading}
          onClose={onClose}
          onEndSession={handleEndSession}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />

        {/* Content Area */}
        <div className="p-8 overflow-y-auto max-h-[50vh]">
          {/* Error State */}
          <ErrorAlert error={error} onClear={clearError} />

          {/* Tab: Medical Record */}
          {activeTab === 'medical' && (
            <MedicalRecordTab
              patientMedicalRecord={patientMedicalRecord}
              loading={loading}
              onFetchMedicalRecord={fetchPatientMedicalRecord}
            />
          )}

          {/* Tab: Prescription */}
          {activeTab === 'prescription' && (
            <PrescriptionTab
              currentSession={currentSession}
              patientInfo={patientInfo}
              appointmentData={appointmentData}
              appointmentId={appointmentId}
              user={user}
              onCreatePrescription={createPrescription}
            />
          )}

          {/* Tab: Lab */}
          {activeTab === 'lab' && (
            <LabTab
              currentSession={currentSession}
              patientInfo={patientInfo}
              appointmentData={appointmentData}
              appointmentId={appointmentId}
              user={user}
            />
          )}

          {/* Tab: Documentation */}
          {activeTab === 'documentation' && (
            <DocumentationTab
              docForm={docForm}
              onDocFormChange={handleDocFormChange}
              autoSaveStatus={autoSaveStatus}
            />
          )}
        </div>

        {/* Footer */}
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
