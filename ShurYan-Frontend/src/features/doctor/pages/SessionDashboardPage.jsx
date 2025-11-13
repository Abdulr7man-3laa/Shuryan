import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSessionManager } from '../hooks/useSessionManager';

/**
 * Session Dashboard Page - Clean Skeleton
 * Ready for custom UI implementation
 * 
 * This page is accessed via route: /doctor/session/:appointmentId
 * 
 * Available from useSessionManager:
 * - sessionLoading: Loading state for session operations
 * - sessionError: Error message
 * - startOrResumeSession(appointment): Start/resume session
 * - clearSessionError(): Clear error
 */
const SessionDashboardPage = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const { sessionLoading, sessionError, startOrResumeSession, clearSessionError } = useSessionManager();

  // Initialize session on mount
  useEffect(() => {
    if (!appointmentId) {
      navigate('/doctor/dashboard');
      return;
    }

    const initSession = async () => {
      console.log('🚀 Initializing session for appointment:', appointmentId);
      
      // For now, you'll need appointment data to start session
      // In real app, fetch appointment details first or pass via navigation state
      const mockAppointment = {
        id: appointmentId,
        patientId: 'unknown',
        patientName: 'Unknown Patient',
        phoneNumber: '01234567890',
        duration: 30,
        apiStatus: 3, // InProgress
      };

      const result = await startOrResumeSession(mockAppointment);
      
      if (!result.success) {
        console.error('❌ Failed to start session:', result.error);
      } else {
        console.log('✅ Session started successfully');
      }
    };

    initSession();
  }, [appointmentId]);

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* TODO: Add your custom UI here */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-4">
            Session Dashboard - Clean Skeleton
          </h1>
          <p className="text-slate-600 mb-6">
            Build your custom session dashboard UI
          </p>

          {/* Loading State */}
          {sessionLoading && (
            <div className="p-6 bg-blue-50 rounded-lg mb-4">
              <p className="text-blue-700 text-lg">Loading session...</p>
            </div>
          )}

          {/* Error State */}
          {sessionError && (
            <div className="p-6 bg-red-50 rounded-lg mb-4">
              <p className="text-red-700 text-lg">{sessionError}</p>
              <button
                onClick={clearSessionError}
                className="mt-3 px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200"
              >
                Clear Error
              </button>
            </div>
          )}

          {/* Info */}
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-lg">
              <h3 className="font-bold mb-2">Current Route Info:</h3>
              <p className="text-sm">Appointment ID: {appointmentId}</p>
            </div>

            <div className="p-4 bg-teal-50 rounded-lg">
              <h3 className="font-bold mb-2">Available Hooks & Data:</h3>
              <ul className="text-sm space-y-1">
                <li>• useSessionManager() - Session operations</li>
                <li>• useSession() - Session data & actions</li>
                <li>• currentSession - Session details</li>
                <li>• patientInfo - Patient information</li>
                <li>• timeRemaining - Session timer</li>
              </ul>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg">
              <h3 className="font-bold mb-2">Available Actions:</h3>
              <ul className="text-sm space-y-1">
                <li>• Create Prescription</li>
                <li>• Request Lab Test</li>
                <li>• Add Documentation</li>
                <li>• View Medical Record</li>
                <li>• End Session</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => navigate('/doctor/dashboard')}
                className="px-6 py-3 bg-slate-500 text-white rounded-lg hover:bg-slate-600"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionDashboardPage;
