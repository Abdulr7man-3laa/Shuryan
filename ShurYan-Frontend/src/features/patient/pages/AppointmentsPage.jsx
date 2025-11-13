import React, { useState, useEffect } from 'react';
import { 
  FaCalendarCheck, 
  FaSearch, 
  FaTimes, 
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
  FaHistory
} from 'react-icons/fa';
import PatientAppointmentCard from '../components/PatientAppointmentCard';
import CancelAppointmentModal from '../components/CancelAppointmentModal';
import RescheduleAppointmentModal from '../components/RescheduleAppointmentModal';
import usePatientAppointments from '../hooks/usePatientAppointments';

/**
 * Patient Appointments Page
 * Premium design with filters, search, and pagination
 */
const AppointmentsPage = () => {
  const {
    upcomingAppointments,
    pastAppointments,
    loading,
    error,
    activeTab,
    filters,
    fetchAllAppointments,
    cancelAppointment,
    rescheduleAppointment,
    setActiveTab,
    setSearchTerm,
    getFilteredAppointments,
  } = usePatientAppointments();

  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  // Fetch appointments on mount
  useEffect(() => {
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Fetch appointments
    fetchAllAppointments();
  }, []);

  // Handle search input
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle clear search
  const handleClearSearch = () => {
    setSearchTerm('');
  };

  // Handle cancel appointment
  const handleCancelAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setCancelModalOpen(true);
  };

  // Confirm cancel
  const handleConfirmCancel = async (cancellationReason) => {
    const result = await cancelAppointment(selectedAppointment.id, cancellationReason);
    if (result.success) {
      setCancelModalOpen(false);
      setSelectedAppointment(null);
    } else {
      alert(`❌ فشل في إلغاء الموعد:\n\n${result.error}`);
    }
  };

  // Handle reschedule appointment
  const handleRescheduleAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setRescheduleModalOpen(true);
  };

  // Confirm reschedule
  const handleConfirmReschedule = async (newStartTime, newEndTime) => {
    const result = await rescheduleAppointment(selectedAppointment.id, newStartTime, newEndTime);
    if (result.success) {
      setRescheduleModalOpen(false);
      setSelectedAppointment(null);
    } else {
      alert(`❌ فشل في إعادة جدولة الموعد:\n\n${result.error}`);
    }
  };

  // Get filtered appointments
  const filteredAppointments = getFilteredAppointments();

  // Calculate stats
  const stats = {
    upcoming: upcomingAppointments.length,
    past: pastAppointments.length,
    scheduled: upcomingAppointments.filter(a => a.status === 0).length,
    confirmed: upcomingAppointments.filter(a => a.status === 1).length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Premium Header */}
      <div className="relative bg-gradient-to-r from-[#00d5be] to-emerald-500 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Title & Icon */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <FaCalendarCheck className="text-3xl" />
            </div>
            <div>
              <h1 className="text-4xl font-black">مواعيدي</h1>
              <p className="text-white/90 text-lg mt-1">إدارة مواعيدك الطبية</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/30 rounded-lg flex items-center justify-center">
                  <FaCalendarCheck className="text-xl" />
                </div>
                <div>
                  <p className="text-2xl font-black">{stats.upcoming}</p>
                  <p className="text-sm text-white/80">مواعيد قادمة</p>
                </div>
              </div>
            </div>

            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/30 rounded-lg flex items-center justify-center">
                  <FaHistory className="text-xl" />
                </div>
                <div>
                  <p className="text-2xl font-black">{stats.past}</p>
                  <p className="text-sm text-white/80">مواعيد سابقة</p>
                </div>
              </div>
            </div>

            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/30 rounded-lg flex items-center justify-center">
                  <FaHourglassHalf className="text-xl" />
                </div>
                <div>
                  <p className="text-2xl font-black">{stats.scheduled}</p>
                  <p className="text-sm text-white/80">مجدول</p>
                </div>
              </div>
            </div>

            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/30 rounded-lg flex items-center justify-center">
                  <FaCheckCircle className="text-xl" />
                </div>
                <div>
                  <p className="text-2xl font-black">{stats.confirmed}</p>
                  <p className="text-sm text-white/80">مؤكد</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs & Search Bar */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 mb-6">
          {/* Tabs */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === 'upcoming'
                  ? 'bg-gradient-to-r from-[#00d5be] to-emerald-500 text-white shadow-md'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <FaCalendarCheck />
                <span>المواعيد القادمة</span>
                <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs">{stats.upcoming}</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === 'past'
                  ? 'bg-gradient-to-r from-[#00d5be] to-emerald-500 text-white shadow-md'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <FaHistory />
                <span>المواعيد السابقة</span>
                <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs">{stats.past}</span>
              </div>
            </button>
          </div>

          {/* Search Input */}
          <div className="relative">
            <FaSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="ابحث عن طبيب..."
              value={filters.searchTerm}
              onChange={handleSearchChange}
              className="w-full pr-12 pl-12 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00d5be] focus:border-transparent text-slate-700"
            />
            {filters.searchTerm && (
              <button
                onClick={handleClearSearch}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <FaTimes />
              </button>
            )}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 animate-pulse">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-14 h-14 bg-slate-200 rounded-full" />
                  <div className="flex-1">
                    <div className="h-5 bg-slate-200 rounded w-3/4 mb-2" />
                    <div className="h-4 bg-slate-200 rounded w-1/2" />
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="h-4 bg-slate-200 rounded" />
                  <div className="h-4 bg-slate-200 rounded w-5/6" />
                  <div className="h-10 bg-slate-200 rounded-xl mt-4" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaTimesCircle className="text-3xl text-red-500" />
            </div>
            <h3 className="text-xl font-bold text-red-700 mb-2">حدث خطأ</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchAllAppointments}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-all duration-300"
            >
              إعادة المحاولة
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredAppointments.length === 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaCalendarCheck className="text-4xl text-slate-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-700 mb-2">لا توجد مواعيد</h3>
            <p className="text-slate-500 mb-6">
              {filters.searchTerm
                ? 'لم يتم العثور على مواعيد تطابق البحث'
                : activeTab === 'upcoming'
                ? 'لا توجد مواعيد قادمة'
                : 'لا توجد مواعيد سابقة'}
            </p>
            {filters.searchTerm && (
              <button
                onClick={handleClearSearch}
                className="px-6 py-3 bg-[#00d5be] hover:bg-emerald-500 text-white rounded-xl font-semibold transition-all duration-300"
              >
                مسح البحث
              </button>
            )}
          </div>
        )}

        {/* Appointments Grid */}
        {!loading && !error && filteredAppointments.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAppointments.map((appointment) => (
              <PatientAppointmentCard
                key={appointment.id}
                appointment={appointment}
                onCancel={handleCancelAppointment}
                onReschedule={handleRescheduleAppointment}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <CancelAppointmentModal
        isOpen={cancelModalOpen}
        onClose={() => {
          setCancelModalOpen(false);
          setSelectedAppointment(null);
        }}
        onConfirm={handleConfirmCancel}
        loading={loading}
      />

      <RescheduleAppointmentModal
        isOpen={rescheduleModalOpen}
        onClose={() => {
          setRescheduleModalOpen(false);
          setSelectedAppointment(null);
        }}
        onConfirm={handleConfirmReschedule}
        loading={loading}
        appointment={selectedAppointment}
      />
    </div>
  );
};

export default AppointmentsPage;
