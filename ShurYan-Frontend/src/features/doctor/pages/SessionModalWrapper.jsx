import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SessionModal from '../components/SessionModal';
import DoctorDashboard from './DoctorDashboard';

/**
 * Session Modal Wrapper
 * Wrapper component to open SessionModal from route
 * Shows Dashboard in background and modal on top
 * Redirects to dashboard after closing
 */
const SessionModalWrapper = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();

  const handleClose = () => {
    // Navigate back to dashboard
    navigate('/doctor/dashboard');
  };

  // If no appointmentId, redirect to dashboard
  useEffect(() => {
    if (!appointmentId) {
      navigate('/doctor/dashboard');
    }
  }, [appointmentId, navigate]);

  if (!appointmentId) {
    return null;
  }

  return (
    <>
      {/* Background: Dashboard */}
      <DoctorDashboard />
      
      {/* Modal: Session */}
      <SessionModal
        isOpen={true}
        onClose={handleClose}
        appointmentId={appointmentId}
        appointmentData={null}
      />
    </>
  );
};

export default SessionModalWrapper;
