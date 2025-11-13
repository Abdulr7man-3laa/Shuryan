import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DoctorDashboardBody from '../components/DoctorDashboardBody';
import TodayAppointments from '../components/TodayAppointments';
import DashboardFooter from '../components/DashboardFooter';
import SessionModal from '../components/SessionModal';
import { useDashboardStats } from '../hooks/useDashboardStats';
import { useTodayAppointments } from '../hooks/useTodayAppointments';
import { useSessionManager } from '../hooks/useSessionManager';
import { isAppointmentCompleted } from '@/utils/appointmentStatus';
import sessionService from '@/api/services/session.service';

/**
 * Doctor Dashboard Page
 * Main dashboard for doctors with clean architecture
 * @component
 */
const DoctorDashboard = () => {
  const navigate = useNavigate();
  const { stats, loading, error, refreshStats } = useDashboardStats();
  const { 
    appointments, 
    loading: appointmentsLoading, 
    error: appointmentsError,
    refreshAppointments 
  } = useTodayAppointments();
  const { startOrResumeSession, sessionLoading, sessionError, clearSessionError } = useSessionManager();
  
  // Filter state
  const [filterType, setFilterType] = useState('all');
  
  // Active session from API
  const [activeSessionFromAPI, setActiveSessionFromAPI] = useState(null);
  
  // Session Modal state
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  // Check for active session on mount and after refresh
  useEffect(() => {
    const checkActiveSession = async () => {
      try {
        const result = await sessionService.getDoctorActiveSession();
        if (result.success && result.isActive && result.data) {
          console.log('🟢 Found active session:', result.data.appointmentId);
          setActiveSessionFromAPI(result.data);
        } else {
          setActiveSessionFromAPI(null);
        }
      } catch (error) {
        console.error('❌ Error checking active session:', error);
      }
    };
    
    checkActiveSession();
  }, [appointments]); // Re-check when appointments change

  /**
   * Handle stat card click
   * Navigate to relevant section or show details
   */
  const handleStatClick = (stat) => {
    console.log('Stat clicked:', stat);
    // TODO: Add navigation or modal logic
    // Example: navigate(`/doctor/${stat.id}`);
  };

  /**
   * Handle enter session (start, resume, or view completed)
   */
  const handleStartAppointment = async (appointment) => {
    console.log('🔵 handleStartAppointment called');
    console.log('🔵 Appointment ID:', appointment.id);
    console.log('🔵 Appointment apiStatus:', appointment.apiStatus);
    console.log('🔵 Appointment apiStatus type:', typeof appointment.apiStatus);
    
    // Check if session is completed (using helper function)
    const isCompleted = isAppointmentCompleted(appointment.apiStatus);
    
    console.log('🔵 isCompleted:', isCompleted);
    
    // For both completed and active sessions, open modal
    console.log('🔵 Calling startOrResumeSession...');
    
    // Start or resume session
    const result = await startOrResumeSession(appointment);
    
    if (result.success) {
      // Update active session immediately
      setActiveSessionFromAPI({
        appointmentId: appointment.id,
        patientName: appointment.patientName,
        status: 'InProgress'
      });
      
      // Open session modal immediately
      setSelectedAppointment(appointment);
      setIsSessionModalOpen(true);
      
      console.log('✅ Session started, UI updated immediately');
    } else {
      // Show error with better formatting
      const errorMsg = result.error || 'حدث خطأ غير متوقع';
      
      // If there's an active session, offer to go to it
      if (errorMsg.includes('جلسة نشطة') && activeSessionFromAPI) {
        const goToActive = window.confirm(
          `❌ ${errorMsg}\n\n` +
          `الجلسة النشطة مع: ${activeSessionFromAPI.patientName}\n\n` +
          `هل تريد الذهاب إلى الجلسة النشطة؟`
        );
        
        if (goToActive) {
          // Find the active appointment
          const activeApt = appointments.find(apt => apt.id === activeSessionFromAPI.appointmentId);
          if (activeApt) {
            setSelectedAppointment(activeApt);
            setIsSessionModalOpen(true);
          }
        }
      } else {
        alert(`❌ خطأ في بدء الجلسة:\n\n${errorMsg}`);
      }
    }
  };

  /**
   * Handle close session modal
   */
  const handleCloseSessionModal = async () => {
    setIsSessionModalOpen(false);
    setSelectedAppointment(null);
    
    // Check if session is still active
    try {
      const result = await sessionService.getDoctorActiveSession();
      if (result.success && result.isActive && result.data) {
        // Session still active
        setActiveSessionFromAPI(result.data);
      } else {
        // Session ended
        setActiveSessionFromAPI(null);
      }
    } catch (error) {
      console.error('❌ Error checking session status:', error);
    }
    
    // Refresh appointments
    refreshAppointments();
  };

  /**
   * Separate appointments by status
   * Now includes InProgress appointments in the list
   */
  const { displayedAppointments, activeSession } = useMemo(() => {
    console.log('🔄 useMemo: Processing appointments', appointments.length);
    console.log('🔄 Active session from API:', activeSessionFromAPI?.appointmentId);
    
    // Update appointments with active session status
    const updatedAppointments = appointments.map(apt => {
      // If this appointment has an active session, update its status
      if (activeSessionFromAPI && apt.id === activeSessionFromAPI.appointmentId) {
        console.log('🟢 Updating appointment status to InProgress:', apt.id);
        return {
          ...apt,
          apiStatus: 'InProgress' // Force InProgress status
        };
      }
      return apt;
    });
    
    // Display appointments that are: Pending, Confirmed, or InProgress
    const displayed = updatedAppointments.filter(apt => {
      const isDisplayed = apt.apiStatus === 'pending' || 
                         apt.apiStatus === 'Confirmed' || 
                         apt.apiStatus === 1 ||
                         apt.apiStatus === 'InProgress' || 
                         apt.apiStatus === 3;
      
      console.log(`📋 Appointment ${apt.id}:`, {
        patientName: apt.patientName,
        apiStatus: apt.apiStatus,
        isDisplayed
      });
      
      return isDisplayed;
    });
    
    const active = updatedAppointments.find(apt => {
      // InProgress (active session)
      return apt.apiStatus === 'InProgress' || apt.apiStatus === 3;
    });
    
    console.log('✅ Displayed appointments:', displayed.length);
    console.log('✅ Active session:', active ? active.patientName : 'None');
    
    return { displayedAppointments: displayed, activeSession: active };
  }, [appointments, activeSessionFromAPI]);

  /**
   * Filter displayed appointments based on selected type
   */
  const filteredAppointments = useMemo(() => {
    if (filterType === 'all') return displayedAppointments;
    return displayedAppointments.filter(apt => apt.status === filterType);
  }, [displayedAppointments, filterType]);

  /**
   * Handle filter change - Set specific filter type
   */
  const handleFilterChange = (newFilterType) => {
    setFilterType(newFilterType);
  };

  /**
   * Auto-refresh appointments and stats every minute
   */
  useEffect(() => {
    
    const refreshInterval = setInterval(() => {
      console.log('🔄 Auto-refreshing dashboard data...');
      refreshAppointments();
      refreshStats();
    }, 60000); // Refresh every 60 seconds (1 minute)
    
    // Cleanup on unmount
    return () => {
      clearInterval(refreshInterval);
    };
  }, [refreshAppointments, refreshStats]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50/20 to-emerald-50/20">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Loading State - Stats */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-teal-600 mx-auto mb-4"></div>
              <p className="text-slate-600 font-medium">جاري تحميل الإحصائيات...</p>
            </div>
          </div>
        )}

        {/* Error State - Stats */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-red-800 font-bold text-lg mb-1">حدث خطأ في تحميل الإحصائيات</h3>
                <p className="text-red-600">{error}</p>
              </div>
              <button
                onClick={refreshStats}
                className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium"
              >
                إعادة المحاولة
              </button>
            </div>
          </div>
        )}

        {/* Dashboard Body */}
        {!loading && !error && (
          <DoctorDashboardBody stats={stats} onStatClick={handleStatClick} />
        )}

        {/* Error State - Session */}
        {sessionError && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-red-800 font-bold text-lg mb-1">خطأ في بدء الجلسة</h3>
                <p className="text-red-600">{sessionError}</p>
              </div>
              <button
                onClick={clearSessionError}
                className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium"
              >
                إغلاق
              </button>
            </div>
          </div>
        )}

        {/* Error State - Appointments */}
        {appointmentsError && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-red-800 font-bold text-lg mb-1">حدث خطأ في تحميل المواعيد</h3>
                <p className="text-red-600">{appointmentsError}</p>
              </div>
              <button
                onClick={() => refreshAppointments()}
                className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium"
              >
                إعادة المحاولة
              </button>
            </div>
          </div>
        )}

        {/* Active Session Card */}
        {activeSession && (
          <section className="mb-8">
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                      <span className="text-2xl font-black text-orange-600">
                        {activeSession.patientInitial}
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-white/30 text-white text-xs font-bold px-3 py-1 rounded-full">
                        جلسة نشطة
                      </span>
                      <span className="bg-white/30 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">
                        ● جارية الآن
                      </span>
                    </div>
                    <h3 className="text-white font-black text-xl mb-1">
                      {activeSession.patientName}
                    </h3>
                    <p className="text-white/90 text-sm">
                      بدأت الساعة {activeSession.time} • {activeSession.duration} دقيقة
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleStartAppointment(activeSession)}
                  className="bg-white text-orange-600 px-6 py-3 rounded-xl font-bold hover:bg-orange-50 transition-all duration-200 shadow-lg flex items-center gap-2"
                >
                  <span>متابعة الجلسة</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Today's Appointments - Pending Only */}
        <TodayAppointments
          appointments={filteredAppointments}
          filterType={filterType}
          onStartAppointment={handleStartAppointment}
          onFilterChange={handleFilterChange}
          loading={appointmentsLoading}
          sessionLoading={sessionLoading}
        />
      </main>

      {/* Footer */}
      <DashboardFooter />

      {/* Session Modal */}
      {isSessionModalOpen && selectedAppointment && (
        <SessionModal
          isOpen={isSessionModalOpen}
          onClose={handleCloseSessionModal}
          appointmentId={selectedAppointment.id}
          appointmentData={selectedAppointment}
        />
      )}
    </div>
  );
};

export default DoctorDashboard;
