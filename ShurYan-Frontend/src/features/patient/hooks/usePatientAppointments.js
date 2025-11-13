import useAppointmentsStore from '../stores/appointmentsStore';

/**
 * Custom hook for patient appointments
 * Encapsulates store logic and provides clean API
 * 
 * @returns {Object} Appointments state and actions
 */
const usePatientAppointments = () => {
  // Get all state and actions from store
  const {
    upcomingAppointments,
    pastAppointments,
    selectedAppointment,
    loading,
    error,
    activeTab,
    filters,
    fetchUpcomingAppointments,
    fetchPastAppointments,
    fetchAllAppointments,
    fetchAppointmentDetails,
    cancelAppointment,
    rescheduleAppointment,
    setActiveTab,
    setSearchTerm,
    resetFilters,
    getFilteredAppointments,
  } = useAppointmentsStore();

  return {
    // State
    upcomingAppointments,
    pastAppointments,
    selectedAppointment,
    loading,
    error,
    activeTab,
    filters,
    
    // Actions
    fetchUpcomingAppointments,
    fetchPastAppointments,
    fetchAllAppointments,
    fetchAppointmentDetails,
    cancelAppointment,
    rescheduleAppointment,
    setActiveTab,
    setSearchTerm,
    resetFilters,
    getFilteredAppointments,
  };
};

export default usePatientAppointments;
