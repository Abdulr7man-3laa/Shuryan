// Pages
export { default as DoctorProfilePage } from './pages/DoctorProfilePage';
export { default as DoctorDashboard } from './pages/DoctorDashboard';
export { default as PatientsPage } from './pages/PatientsPage';
export { default as AppointmentsPage } from './pages/AppointmentsPage';
export { default as ReviewsPage } from './pages/ReviewsPage';
export { default as SessionDashboardPage } from './pages/SessionDashboardPage';
export { default as SessionModalWrapper } from './pages/SessionModalWrapper';

// Components
export { default as DoctorNavbar } from './components/DoctorNavbar';
export { default as DoctorDashboardBody } from './components/DoctorDashboardBody';
export { default as TodayAppointments } from './components/TodayAppointments';
export { default as PatientCard } from './components/PatientCard';
export { default as AppointmentCard } from './components/AppointmentCard';
export { default as ReviewCard } from './components/ReviewCard';
export { default as RatingDetailsModal } from './components/RatingDetailsModal';
export { default as ReviewDetailsModal } from './components/ReviewDetailsModal';
export { default as PartnerAutocomplete } from './components/PartnerAutocomplete';
export { default as ActiveSessionWarning } from './components/ActiveSessionWarning';
export { default as SessionModal } from './components/SessionModal';
export { default as PrescriptionModal } from './components/PrescriptionModal';
export { default as LabResultsModal } from './components/LabResultsModal';
export { default as MedicalRecordModal } from './components/MedicalRecordModal';
export { default as SessionDocumentationModal } from './components/SessionDocumentationModal';
export { default as SessionsListModal } from './components/SessionsListModal';
export { default as PrescriptionsListModal } from './components/PrescriptionsListModal';

// Session Components
export { default as SessionTimer } from './components/session/SessionTimer';
export { default as SessionPatientInfo } from './components/session/SessionPatientInfo';
export { default as SessionActions } from './components/session/SessionActions';
export { default as MedicalRecordViewer } from './components/session/MedicalRecordViewer';
export { default as PrescriptionForm } from './components/session/PrescriptionForm';
export { default as LabTestForm } from './components/session/LabTestForm';
export { default as DocumentationForm } from './components/session/DocumentationForm';

// Hooks
export { useDashboardStats } from './hooks/useDashboardStats';
export { usePatients } from './hooks/usePatients';
export { useSession } from './hooks/useSession';
export { useSessionManager } from './hooks/useSessionManager';

// Stores
export { usePatientsStore } from './stores/patientsStore';
export { useSessionStore } from './stores/sessionStore';

// Constants
export { DOCTOR_NAV_ITEMS } from './constants/navigation';