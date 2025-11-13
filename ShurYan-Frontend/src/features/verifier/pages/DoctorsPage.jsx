import { useState, useEffect } from 'react';
import { FaInbox, FaUserMd } from 'react-icons/fa';
import useVerifier from '../hooks/useVerifier';
import {
  VerifierNavbar,
  StatsCards,
  StatusFilter,
  ApplicationCard,
  ApplicationDetailsModal,
} from '../components';
import { APPLICATION_TYPE } from '../constants/verifierConstants';

/**
 * Doctors Page
 * 
 * Page for reviewing doctor applications only
 */
const DoctorsPage = () => {
  console.log('👨‍⚕️ [DoctorsPage] Component rendering!');
  console.log('📍 [DoctorsPage] Current URL:', window.location.pathname);
  
  const {
    applications,
    stats,
    loading,
    filters,
    filteredApplications,
    setActiveTab,
    setActiveStatus,
  } = useVerifier();

  const [selectedApplication, setSelectedApplication] = useState(null);

  // Set active tab to doctors on mount
  useEffect(() => {
    console.log('🔄 [DoctorsPage] Setting active tab to DOCTOR');
    setActiveTab(APPLICATION_TYPE.DOCTOR);
  }, [setActiveTab]);

  // Get doctors applications
  const doctorApplications = applications.doctors || [];
  
  console.log('📊 [DoctorsPage] State:', {
    totalDoctors: doctorApplications.length,
    filteredCount: filteredApplications?.length,
    activeStatus: filters.activeStatus,
    loading: loading.applications,
  });

  // Handle view details
  const handleViewDetails = (application) => {
    setSelectedApplication(application);
  };

  // Handle close modal
  const handleCloseModal = () => {
    setSelectedApplication(null);
  };

  // Use filteredApplications from hook (already filtered by status)
  const filteredDoctors = filteredApplications || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50/30 to-emerald-50/30">
      {/* Navbar */}
      <VerifierNavbar 
        activeTab={APPLICATION_TYPE.DOCTOR}
        onTabChange={setActiveTab}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header - Centered */}
        <div className="text-center mb-10">
          <h1 className="text-6xl font-black mb-3 drop-shadow-sm" style={{ color: '#009689' }}>
            طلبات الأطباء
          </h1>
          <p className="text-xl text-slate-600 font-semibold">
            مراجعة وتوثيق طلبات الأطباء
          </p>
        </div>
        {/* Status Filter - Full Width */}
        <div className="mb-8">
          <StatusFilter
            activeStatus={filters.activeStatus}
            onStatusChange={setActiveStatus}
            stats={stats}
          />
        </div>

        {/* Applications Grid */}
        {loading.applications ? (
          // Loading State
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 animate-pulse"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 bg-slate-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-6 bg-slate-200 rounded mb-2"></div>
                    <div className="h-4 bg-slate-200 rounded w-2/3"></div>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="h-4 bg-slate-200 rounded"></div>
                  <div className="h-4 bg-slate-200 rounded"></div>
                </div>
                <div className="h-20 bg-slate-200 rounded mb-4"></div>
                <div className="h-10 bg-slate-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : filteredDoctors.length > 0 ? (
          // Applications Grid
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((application) => (
              <ApplicationCard
                key={application.id}
                application={application}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        ) : (
          // Empty State
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-teal-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaInbox className="text-5xl text-teal-400" />
            </div>
            <h3 className="text-2xl font-black text-slate-800 mb-2">
              لا توجد طلبات
            </h3>
            <p className="text-slate-600 font-semibold">
              لا توجد طلبات أطباء في هذه الحالة حالياً
            </p>
          </div>
        )}
      </div>

      {/* Application Details Modal */}
      {selectedApplication && (
        <ApplicationDetailsModal
          application={selectedApplication}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default DoctorsPage;
