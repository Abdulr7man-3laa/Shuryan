import React, { useState, useRef, useEffect } from 'react';
import { 
  FaCalendarAlt, FaFilter, FaSearch, FaTimes, FaChevronDown, 
  FaCheck, FaClock, FaCalendarDay, FaChartLine, FaChevronLeft, FaChevronRight,
  FaHourglassHalf, FaPlay, FaUserCheck, FaUserTimes, FaBan
} from 'react-icons/fa';
import AppointmentCard from '../components/AppointmentCard';
import ActiveSessionWarning from '../components/ActiveSessionWarning';
import SessionModal from '../components/SessionModal';
import { useAllAppointments } from '../hooks/useAllAppointments'; // ✅ Changed from useTodayAppointments
import { useSessionManager } from '../hooks/useSessionManager';
import { isAppointmentCompleted } from '@/utils/appointmentStatus';

/**
 * AppointmentsPage - Premium Modern Design
 * Complete appointments management with creative UI/UX
 * Shows ALL appointments (past, today, future)
 */
const AppointmentsPage = () => {
  const { 
    appointments, 
    loading, 
    error, 
    pagination,
    statistics, // ✅ Get statistics from API
    goToNextPage, 
    goToPreviousPage, 
    goToPage 
  } = useAllAppointments(); // ✅ Using useAllAppointments hook with pagination
  const { startOrResumeSession, sessionLoading } = useSessionManager();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterType, setFilterType] = useState('all'); // ✅ Local filter state
  
  // Session Modal state
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  
  const filterRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter appointments by search and type
  const filteredAppointments = appointments?.filter(apt => {
    // Search filter
    const matchesSearch = !searchTerm || 
      apt.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.phoneNumber?.includes(searchTerm);
    
    // Type filter
    const matchesType = filterType === 'all' || apt.status === filterType;
    
    return matchesSearch && matchesType;
  }) || [];

  // Get filter label
  const getFilterLabel = () => {
    const labels = {
      'all': 'جميع الأنواع',
      'كشف عام': 'كشف عام',
      'متابعة': 'متابعة',
    };
    return labels[filterType] || 'جميع الأنواع';
  };

  // Handle enter session (start, resume, or view completed)
  const handleStartAppointment = async (appointment) => {
    console.log('🔵 [AppointmentsPage] handleStartAppointment called');
    console.log('🔵 [AppointmentsPage] Appointment ID:', appointment.id);
    console.log('🔵 [AppointmentsPage] Appointment apiStatus:', appointment.apiStatus);
    console.log('🔵 [AppointmentsPage] Appointment apiStatus type:', typeof appointment.apiStatus);
    console.log('🔵 [AppointmentsPage] Full appointment:', appointment);
    
    // Check if session is completed (using helper function)
    const isCompleted = isAppointmentCompleted(appointment.apiStatus);
    
    console.log('🔵 [AppointmentsPage] isCompleted:', isCompleted);
    
    console.log('🔵 [AppointmentsPage] Calling startOrResumeSession...');
    
    // Start or resume session (works for all statuses)
    const result = await startOrResumeSession(appointment);
    
    if (result.success) {
      // Open session modal
      setSelectedAppointment(appointment);
      setIsSessionModalOpen(true);
    } else {
      // Show error alert
      alert(`❌ خطأ في بدء الجلسة:\n\n${result.error}`);
    }
  };

  // Get stats from API statistics (static across all pages)
  const totalAppointments = statistics?.total || pagination?.totalCount || 0;
  
  // ✅ Use statistics from API - These are STATIC and reflect ALL pages
  const statusCounts = statistics ? {
    pending: statistics.pending || 0,
    confirmed: statistics.confirmed || 0,
    checkedIn: statistics.checkedIn || 0,
    inProgress: statistics.inProgress || 0,
    completed: statistics.completed || 0,
    noShow: statistics.noShow || 0,
    cancelled: statistics.cancelled || 0,
  } : {
    // Fallback: Calculate from current page if statistics not available
    pending: appointments?.filter(apt => apt.apiStatus === 0 || apt.apiStatus === 'pending').length || 0,
    confirmed: appointments?.filter(apt => apt.apiStatus === 1 || apt.apiStatus === 'Confirmed').length || 0,
    checkedIn: appointments?.filter(apt => apt.apiStatus === 2 || apt.apiStatus === 'CheckedIn').length || 0,
    inProgress: appointments?.filter(apt => apt.apiStatus === 3 || apt.apiStatus === 'InProgress').length || 0,
    completed: appointments?.filter(apt => apt.apiStatus === 4 || apt.apiStatus === 'Completed').length || 0,
    noShow: appointments?.filter(apt => apt.apiStatus === 5 || apt.apiStatus === 'NoShow').length || 0,
    cancelled: appointments?.filter(apt => apt.apiStatus === 6 || apt.apiStatus === 'Cancelled').length || 0,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50/20 to-emerald-50/20" dir="rtl">
      {/* Active Session Warning */}
      <ActiveSessionWarning />
      
      <div className="container mx-auto px-4 py-8">
        {/* Premium Header Section */}
        <div 
          className="rounded-2xl p-8 mb-8 shadow-xl relative"
          style={{
            backgroundColor: '#0d9488',
            backgroundImage: `
              linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
            `,
            backgroundSize: '30px 30px',
            overflow: 'visible'
          }}
        >
          {/* Decorative gradient orbs */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-emerald-400/20 to-transparent rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-teal-400/20 to-transparent rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="relative z-10">
            {/* Title & Stats Row */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-6">
              {/* Title & Icon */}
              <div className="flex items-center gap-5">
                <div className="relative">
                  <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-2xl">
                    <FaCalendarAlt className="text-white text-3xl" />
                  </div>
                  {/* Icon glow */}
                  <div className="absolute inset-0 bg-white/30 rounded-2xl blur-xl"></div>
                </div>
                <div>
                  <h1 className="text-4xl font-black text-white mb-2 drop-shadow-lg">المواعيد</h1>
                  <p className="text-white/90 text-base font-medium">
                    إدارة مواعيد المرضى والجلسات
                  </p>
                </div>
              </div>

              {/* Quick Stats - All Status Badges */}
              <div className="flex flex-wrap gap-3">
                {/* Total */}
                <div className="group bg-gradient-to-br from-white/25 to-white/15 backdrop-blur-md px-5 py-3 rounded-xl border-2 border-white/40 hover:border-white/60 flex items-center gap-3 shadow-lg hover:shadow-xl">
                  <div className="w-10 h-10 bg-white/30 rounded-lg flex items-center justify-center">
                    <FaCalendarDay className="text-white text-base" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-white/90 font-semibold tracking-wide">الإجمالي</span>
                    <span className="text-2xl font-black text-white">{totalAppointments}</span>
                  </div>
                </div>
                
                {/* Completed - مكتمل */}
                <div className="group bg-gradient-to-br from-emerald-500/30 to-emerald-600/20 backdrop-blur-md px-5 py-3 rounded-xl border-2 border-emerald-400/50 hover:border-emerald-300/70 flex items-center gap-3 shadow-lg hover:shadow-emerald-500/20">
                  <div className="w-10 h-10 bg-emerald-400/40 rounded-lg flex items-center justify-center">
                    <FaCheck className="text-emerald-100 text-base" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-emerald-100 font-semibold tracking-wide">مكتمل</span>
                    <span className="text-2xl font-black text-white">{statusCounts.completed}</span>
                  </div>
                </div>

                {/* Confirmed - مؤكد */}
                <div className="group bg-gradient-to-br from-blue-500/30 to-blue-600/20 backdrop-blur-md px-5 py-3 rounded-xl border-2 border-blue-400/50 hover:border-blue-300/70 flex items-center gap-3 shadow-lg hover:shadow-blue-500/20">
                  <div className="w-10 h-10 bg-blue-400/40 rounded-lg flex items-center justify-center">
                    <FaCheck className="text-blue-100 text-base" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-blue-100 font-semibold tracking-wide">مؤكد</span>
                    <span className="text-2xl font-black text-white">{statusCounts.confirmed}</span>
                  </div>
                </div>

                {/* Cancelled - ملغي */}
                <div className="group bg-gradient-to-br from-red-500/30 to-red-600/20 backdrop-blur-md px-5 py-3 rounded-xl border-2 border-red-400/50 hover:border-red-300/70 flex items-center gap-3 shadow-lg hover:shadow-red-500/20">
                  <div className="w-10 h-10 bg-red-400/40 rounded-lg flex items-center justify-center">
                    <FaBan className="text-red-100 text-base" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-red-100 font-semibold tracking-wide">ملغي</span>
                    <span className="text-2xl font-black text-white">{statusCounts.cancelled}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Search & Filters Row */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search Input */}
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="ابحث بالاسم أو رقم الهاتف..."
                  className="w-full pl-4 pr-12 py-3.5 bg-white/90 backdrop-blur-sm border-2 border-white/30 rounded-xl focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all duration-200 text-slate-800 placeholder-slate-400 font-medium shadow-lg"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <FaSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <FaTimes />
                  </button>
                )}
              </div>

              {/* Filter Dropdown */}
              <div className="relative" ref={filterRef}>
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-5 py-3.5 rounded-xl transition-all duration-200 flex items-center gap-2 border-2 border-white/30 shadow-lg font-bold text-white"
                >
                  <FaFilter className="w-4 h-4" />
                  <span className="text-sm">{getFilterLabel()}</span>
                  <FaChevronDown className={`w-3 h-3 transition-transform duration-200 ${isFilterOpen ? 'rotate-180' : ''}`} />
                </button>

                {isFilterOpen && (
                  <div className="absolute left-0 top-full mt-2 w-56 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-50">
                    <div className="py-1">
                      <button
                        onClick={() => { setFilterType('all'); setIsFilterOpen(false); }}
                        className={`w-full flex items-center justify-between px-4 py-3 text-sm transition-colors ${
                          filterType === 'all'
                            ? 'bg-teal-50 text-teal-700 font-bold'
                            : 'text-slate-700 hover:bg-slate-50 font-medium'
                        }`}
                      >
                        <span>جميع الأنواع</span>
                        {filterType === 'all' && <FaCheck className="w-4 h-4 text-teal-600" />}
                      </button>
                      <button
                        onClick={() => { setFilterType('كشف عام'); setIsFilterOpen(false); }}
                        className={`w-full flex items-center justify-between px-4 py-3 text-sm transition-colors ${
                          filterType === 'كشف عام'
                            ? 'bg-teal-50 text-teal-700 font-bold'
                            : 'text-slate-700 hover:bg-slate-50 font-medium'
                        }`}
                      >
                        <span>كشف عام</span>
                        {filterType === 'كشف عام' && <FaCheck className="w-4 h-4 text-teal-600" />}
                      </button>
                      <button
                        onClick={() => { setFilterType('متابعة'); setIsFilterOpen(false); }}
                        className={`w-full flex items-center justify-between px-4 py-3 text-sm transition-colors ${
                          filterType === 'متابعة'
                            ? 'bg-emerald-50 text-emerald-700 font-bold'
                            : 'text-slate-700 hover:bg-slate-50 font-medium'
                        }`}
                      >
                        <span>متابعة</span>
                        {filterType === 'متابعة' && <FaCheck className="w-4 h-4 text-emerald-600" />}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-200 rounded-xl p-6 mb-8 shadow-lg">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center text-white flex-shrink-0">
                !
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-red-800 mb-1">حدث خطأ</h3>
                <p className="text-red-700 font-medium">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 animate-pulse">
                <div className="flex items-center justify-between mb-4">
                  <div className="h-12 w-32 bg-slate-200 rounded-xl"></div>
                  <div className="h-8 w-20 bg-slate-200 rounded-lg"></div>
                </div>
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-14 h-14 bg-slate-200 rounded-xl"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="h-10 bg-slate-200 rounded-lg"></div>
              </div>
            ))}
          </div>
        ) : filteredAppointments.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-2xl p-16 text-center shadow-lg border border-slate-200">
            <div className="w-32 h-32 bg-gradient-to-br from-teal-50 to-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
              <FaCalendarAlt className="w-16 h-16 text-teal-500" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">لا توجد مواعيد</h3>
            <p className="text-slate-600 font-medium">
              {searchTerm 
                ? 'لم يتم العثور على نتائج للبحث' 
                : filterType !== 'all'
                  ? `لا توجد مواعيد من نوع "${getFilterLabel()}"`
                  : 'لا توجد أي مواعيد محجوزة بعد'}
            </p>
          </div>
        ) : (
          /* Appointments Grid */
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredAppointments.map((appointment) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  onStartAppointment={handleStartAppointment}
                  loading={sessionLoading === appointment.id}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center">
                {/* Navigation Buttons */}
                <div className="flex items-center gap-2">
                  {/* Previous Button */}
                  <button
                    onClick={goToPreviousPage}
                    disabled={!pagination.hasPreviousPage}
                    className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm shadow-sm transition-all duration-200 ${
                      pagination.hasPreviousPage
                        ? 'bg-white hover:bg-teal-50 text-teal-600 border-2 border-teal-200 hover:border-teal-300 hover:shadow-md'
                        : 'bg-slate-100 text-slate-400 border-2 border-slate-200 cursor-not-allowed'
                    }`}
                  >
                    <FaChevronRight className="text-sm" />
                    <span>السابق</span>
                  </button>

                  {/* Page Numbers */}
                  <div className="hidden sm:flex items-center gap-1">
                    {[...Array(pagination.totalPages)].map((_, index) => {
                      const pageNum = index + 1;
                      // Show first, last, current, and adjacent pages
                      if (
                        pageNum === 1 ||
                        pageNum === pagination.totalPages ||
                        (pageNum >= pagination.pageNumber - 1 && pageNum <= pagination.pageNumber + 1)
                      ) {
                        return (
                          <button
                            key={pageNum}
                            onClick={() => goToPage(pageNum)}
                            className={`w-10 h-10 rounded-lg font-bold text-sm transition-all duration-200 ${
                              pageNum === pagination.pageNumber
                                ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-md scale-110'
                                : 'bg-white text-slate-700 border-2 border-slate-200 hover:border-teal-300 hover:bg-teal-50'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      } else if (
                        pageNum === pagination.pageNumber - 2 ||
                        pageNum === pagination.pageNumber + 2
                      ) {
                        return <span key={pageNum} className="text-slate-400 px-1">...</span>;
                      }
                      return null;
                    })}
                  </div>

                  {/* Next Button */}
                  <button
                    onClick={goToNextPage}
                    disabled={!pagination.hasNextPage}
                    className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm shadow-sm transition-all duration-200 ${
                      pagination.hasNextPage
                        ? 'bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white hover:shadow-md'
                        : 'bg-slate-100 text-slate-400 border-2 border-slate-200 cursor-not-allowed'
                    }`}
                  >
                    <span>التالي</span>
                    <FaChevronLeft className="text-sm" />
                  </button>
                </div>
              </div>
            )}

            {/* Results Count (when only 1 page) */}
            {pagination.totalPages <= 1 && filteredAppointments.length > 0 && (
              <div className="mt-8 text-center">
                <div className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-xl shadow-sm border border-slate-200">
                  <FaChartLine className="text-teal-600" />
                  <span className="text-slate-700 font-semibold">
                    عرض {filteredAppointments.length} من {totalAppointments} موعد
                  </span>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Session Modal */}
      {isSessionModalOpen && selectedAppointment && (
        <SessionModal
          isOpen={isSessionModalOpen}
          onClose={() => {
            setIsSessionModalOpen(false);
            setSelectedAppointment(null);
          }}
          appointmentId={selectedAppointment.id}
          appointmentData={selectedAppointment}
        />
      )}
    </div>
  );
};

export default AppointmentsPage;
