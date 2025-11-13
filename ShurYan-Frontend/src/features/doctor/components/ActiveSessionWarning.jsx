import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaExclamationTriangle, FaTimes, FaArrowRight } from 'react-icons/fa';
import sessionService from '@/api/services/session.service';
import { useSessionStore } from '../stores/sessionStore';

/**
 * ActiveSessionWarning Component
 * Shows warning if doctor has an active session
 * Loads it into store and allows navigation
 */
const ActiveSessionWarning = () => {
  const navigate = useNavigate();
  const { getActiveSession } = useSessionStore();
  const [activeSession, setActiveSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    checkForActiveSession();
  }, []);

  const checkForActiveSession = async () => {
    try {
      console.log('🔍 [ActiveSessionWarning] Checking for active session...');
      
      // Use new endpoint to get doctor's active session
      const result = await sessionService.getDoctorActiveSession();
      
      console.log('🔍 [ActiveSessionWarning] Result:', result);
      
      if (result.success && result.isActive && result.data) {
        console.log('⚠️ [ActiveSessionWarning] Found active session!');
        console.log('⚠️ Appointment ID:', result.data.appointmentId);
        console.log('⚠️ Patient Name:', result.data.patientName);
        console.log('⚠️ Session Status:', result.data.status);
        console.log('⚠️ Full Data:', result.data);
        
        setActiveSession(result.data);
        
        // Load session into store immediately
        console.log('📥 [ActiveSessionWarning] Loading session into store...');
        const appointmentData = {
          duration: result.data.sessionDurationMinutes || 30,
          patient: {
            patientId: result.data.patientId,
            patientFullName: result.data.patientName,
            phoneNumber: result.data.patient?.phoneNumber,
          },
        };
        
        await getActiveSession(result.data.appointmentId, appointmentData);
        console.log('✅ [ActiveSessionWarning] Session loaded into store');
      } else {
        console.log('✅ [ActiveSessionWarning] No active session');
      }
    } catch (error) {
      console.error('❌ [ActiveSessionWarning] Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoToSession = () => {
    if (!activeSession) {
      console.error('❌ [ActiveSessionWarning] No active session data');
      alert('حدث خطأ. لا توجد بيانات جلسة نشطة');
      return;
    }

    const appointmentId = activeSession.appointmentId;
    
    if (!appointmentId) {
      console.error('❌ [ActiveSessionWarning] No appointmentId found!');
      console.error('❌ Session data:', activeSession);
      alert('حدث خطأ. لم يتم العثور على معرف الموعد');
      return;
    }

    console.log('🚀 [ActiveSessionWarning] Navigating to session');
    console.log('🚀 Appointment ID:', appointmentId);
    console.log('🚀 Patient Name:', activeSession.patientName);
    console.log('🚀 Session Status:', activeSession.status);
    
    // Hide the warning immediately
    setDismissed(true);
    
    // Navigate to session page
    const sessionUrl = `/doctor/session/${appointmentId}`;
    console.log('🚀 Navigation URL:', sessionUrl);
    navigate(sessionUrl);
  };

  const handleDismiss = () => {
    setDismissed(true);
  };

  // Don't show if loading, no active session, or dismissed
  if (loading || !activeSession || dismissed) {
    return null;
  }

  return (
    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-slideDown" dir="rtl">
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-2xl shadow-2xl p-6 max-w-md mx-4">
        {/* Close Button */}
        <button
          onClick={handleDismiss}
          className="absolute top-3 left-3 text-white/80 hover:text-white transition-colors"
        >
          <FaTimes className="text-xl translate-x-3" />
        </button>

        {/* Icon */}
        <div className="flex items-start gap-4">
          <div className="bg-white/20 rounded-full p-3 flex-shrink-0">
            <FaExclamationTriangle className="text-3xl" />
          </div>

          <div className="flex-1">
            {/* Title */}
            <h3 className="text-xl font-black mb-2">
              لديك جلسة نشطة!
            </h3>

            {/* Message */}
            <p className="text-white/90 mb-1 font-semibold">
              لديك جلسة نشطة مع المريض:
            </p>
            <p className="text-white font-bold text-lg mb-1">
              {activeSession.patientName || 'غير معروف'}
            </p>
            
            {/* Session Info */}
            {activeSession.actualStartTime && (
              <p className="text-white/80 text-sm mb-4">
                بدأت الساعة {new Date(activeSession.actualStartTime).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
              </p>
            )}

            {/* Action Button */}
            <button
              onClick={handleGoToSession}
              className="w-full bg-white text-orange-600 font-bold py-3 px-4 rounded-xl hover:bg-orange-50 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg"
            >
              <span>الذهاب إلى الجلسة</span>
              <FaArrowRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActiveSessionWarning;
