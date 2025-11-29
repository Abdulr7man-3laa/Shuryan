import { useState } from 'react';
import { FaFlask, FaSync } from 'react-icons/fa';
import useLabPrescriptions from '../hooks/useLabPrescriptions';
import LabPrescriptionCard from '../components/lab/LabPrescriptionCard';
import LabPrescriptionDetailsModal from '../components/lab/LabPrescriptionDetailsModal';

const LabPrescriptionsPage = () => {
  const { labPrescriptions, loading, error, fetchLabPrescriptions } = useLabPrescriptions();
  const [selectedPrescription, setSelectedPrescription] = useState(null);

  const handleViewDetails = (prescription) => {
    setSelectedPrescription(prescription);
  };

  const handleCloseModal = () => {
    setSelectedPrescription(null);
  };

  const handleRefresh = () => {
    fetchLabPrescriptions();
  };

  // Loading State
  if (loading && labPrescriptions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50/30 to-blue-50/30 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header Skeleton */}
          <div className="mb-8">
            <div className="h-10 bg-slate-200 rounded-lg w-64 mb-4 animate-pulse"></div>
            <div className="h-6 bg-slate-200 rounded-lg w-96 animate-pulse"></div>
          </div>

          {/* Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 border-2 border-slate-200 animate-pulse"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-14 h-14 bg-slate-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-5 bg-slate-200 rounded w-32 mb-2"></div>
                    <div className="h-4 bg-slate-200 rounded w-24"></div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="h-4 bg-slate-200 rounded w-full"></div>
                  <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-10 bg-slate-200 rounded-xl w-full"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50/30 to-blue-50/30 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl p-8 border-2 border-red-200 text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaFlask className="text-4xl text-red-500" />
            </div>
            <h3 className="text-2xl font-black text-slate-800 mb-2">حدث خطأ</h3>
            <p className="text-slate-600 mb-6">{error}</p>
            <button
              onClick={handleRefresh}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl font-bold hover:shadow-lg hover:scale-105 transition-all duration-200 inline-flex items-center gap-2"
            >
              <FaSync />
              إعادة المحاولة
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Empty State
  if (!loading && labPrescriptions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50/30 to-blue-50/30 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-black text-slate-800 mb-2 flex items-center gap-3">
              <FaFlask className="text-cyan-600" />
              طلبات التحاليل
            </h1>
            <p className="text-slate-600">جميع طلبات التحاليل التي تم طلبها من الأطباء</p>
          </div>

          {/* Empty State */}
          <div className="bg-white rounded-2xl p-12 border-2 border-dashed border-slate-300 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaFlask className="text-5xl text-cyan-600" />
            </div>
            <h3 className="text-2xl font-black text-slate-800 mb-2">لا توجد طلبات تحاليل</h3>
            <p className="text-slate-600 mb-6 max-w-md mx-auto">
              لم يتم طلب أي تحاليل منك حتى الآن. عندما يطلب الطبيب تحاليل، ستظهر هنا.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Main Content
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50/30 to-blue-50/30 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-black text-slate-800 mb-2 flex items-center gap-3">
              <FaFlask className="text-cyan-600" />
              طلبات التحاليل
            </h1>
            <p className="text-slate-600">
              لديك {labPrescriptions.length} طلب تحليل
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="px-6 py-3 bg-white text-slate-700 rounded-xl font-bold border-2 border-slate-200 hover:border-cyan-300 hover:shadow-md transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaSync className={loading ? 'animate-spin' : ''} />
            تحديث
          </button>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {labPrescriptions.map((prescription) => (
            <LabPrescriptionCard
              key={prescription.id}
              prescription={prescription}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      </div>

      {/* Details Modal */}
      {selectedPrescription && (
        <LabPrescriptionDetailsModal
          prescription={selectedPrescription}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default LabPrescriptionsPage;
