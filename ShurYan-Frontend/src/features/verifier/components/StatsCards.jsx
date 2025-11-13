import { FaFileAlt, FaEye, FaCheckCircle, FaUserMd, FaPills, FaFlask } from 'react-icons/fa';

/**
 * Stats Cards Component
 * 
 * Displays quick statistics for verifier dashboard
 */
const StatsCards = ({ stats, loading }) => {
  const statsData = [
    {
      label: 'طلبات جديدة',
      value: stats.totalPending,
      icon: FaFileAlt,
      color: 'from-teal-500 to-teal-600',
      bgColor: 'bg-teal-50',
      textColor: 'text-teal-700',
    },
    {
      label: 'تحت المراجعة',
      value: stats.totalUnderReview,
      icon: FaEye,
      color: 'from-amber-500 to-orange-500',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-700',
    },
    {
      label: 'موثّقة اليوم',
      value: stats.totalApprovedToday,
      icon: FaCheckCircle,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
    },
    {
      label: 'أطباء',
      value: stats.totalDoctors,
      icon: FaUserMd,
      color: 'from-teal-500 to-teal-600',
      bgColor: 'bg-teal-50',
      textColor: 'text-teal-700',
    },
    {
      label: 'صيدليات',
      value: stats.totalPharmacies,
      icon: FaPills,
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-700',
    },
    {
      label: 'معامل',
      value: stats.totalLaboratories,
      icon: FaFlask,
      color: 'from-cyan-500 to-cyan-600',
      bgColor: 'bg-cyan-50',
      textColor: 'text-cyan-700',
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 animate-pulse"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 bg-slate-200 rounded-xl"></div>
            </div>
            <div className="h-8 bg-slate-200 rounded mb-2"></div>
            <div className="h-4 bg-slate-200 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {statsData.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className={`${stat.bgColor} rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md hover:scale-105 transition-all duration-200`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-14 h-14 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center text-white shadow-md`}>
                <Icon className="w-7 h-7" />
              </div>
            </div>
            <div className={`text-3xl font-black ${stat.textColor} mb-1`}>
              {stat.value}
            </div>
            <div className="text-sm font-semibold text-slate-600">
              {stat.label}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;
