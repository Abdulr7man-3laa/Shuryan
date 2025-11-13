import { FaChartLine, FaUserMd, FaPills, FaFlask, FaClock, FaCheckCircle, FaTimesCircle, FaCalendarAlt } from 'react-icons/fa';
import { VerifierNavbar } from '../components';
import useVerifier from '../hooks/useVerifier';
import { APPLICATION_TYPE, TYPE_LABELS } from '../constants/verifierConstants';

/**
 * Statistics Page
 * 
 * Comprehensive statistics and analytics for verifier
 */
const StatisticsPage = () => {
  console.log('📊 [StatisticsPage] Component rendering!');
  const { stats, loading } = useVerifier();

  // Calculate percentages
  const totalApplications = stats.totalDoctors + stats.totalPharmacies + stats.totalLaboratories;
  const doctorPercentage = totalApplications > 0 ? ((stats.totalDoctors / totalApplications) * 100).toFixed(1) : 0;
  const pharmacyPercentage = totalApplications > 0 ? ((stats.totalPharmacies / totalApplications) * 100).toFixed(1) : 0;
  const labPercentage = totalApplications > 0 ? ((stats.totalLaboratories / totalApplications) * 100).toFixed(1) : 0;

  const totalProcessed = stats.totalApprovedToday + stats.totalUnderReview + stats.totalPending;
  const approvalRate = totalProcessed > 0 ? ((stats.totalApprovedToday / totalProcessed) * 100).toFixed(1) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50/30 to-emerald-50/30">
      {/* Navbar */}
      <VerifierNavbar activeTab={null} onTabChange={() => {}} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header - Centered */}
        <div className="text-center mb-10">
          <h1 className="text-6xl font-black mb-3 drop-shadow-sm" style={{ color: '#009689' }}>
            الإحصائيات والتحليلات
          </h1>
          <p className="text-xl text-slate-600 font-semibold">
            نظرة شاملة على أداء التوثيق والمراجعة
          </p>
        </div>

        {loading.stats ? (
          // Loading State
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 animate-pulse"
              >
                <div className="h-6 bg-slate-200 rounded mb-4"></div>
                <div className="h-20 bg-slate-200 rounded mb-4"></div>
                <div className="h-4 bg-slate-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Total Applications */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md hover:scale-105 transition-all duration-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center shadow-md">
                    <FaChartLine className="w-7 h-7 text-white" />
                  </div>
                </div>
                <div className="text-3xl font-black text-teal-700 mb-1">
                  {totalApplications}
                </div>
                <div className="text-sm font-semibold text-slate-600">
                  إجمالي الطلبات
                </div>
              </div>

              {/* Pending */}
              <div className="bg-amber-50 rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md hover:scale-105 transition-all duration-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-md">
                    <FaClock className="w-7 h-7 text-white" />
                  </div>
                </div>
                <div className="text-3xl font-black text-amber-700 mb-1">
                  {stats.totalPending}
                </div>
                <div className="text-sm font-semibold text-slate-600">
                  قيد الانتظار
                </div>
              </div>

              {/* Under Review */}
              <div className="bg-blue-50 rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md hover:scale-105 transition-all duration-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-md">
                    <FaCalendarAlt className="w-7 h-7 text-white" />
                  </div>
                </div>
                <div className="text-3xl font-black text-blue-700 mb-1">
                  {stats.totalUnderReview}
                </div>
                <div className="text-sm font-semibold text-slate-600">
                  تحت المراجعة
                </div>
              </div>

              {/* Approved Today */}
              <div className="bg-green-50 rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md hover:scale-105 transition-all duration-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-md">
                    <FaCheckCircle className="w-7 h-7 text-white" />
                  </div>
                </div>
                <div className="text-3xl font-black text-green-700 mb-1">
                  {stats.totalApprovedToday}
                </div>
                <div className="text-sm font-semibold text-slate-600">
                  موثّقة اليوم
                </div>
              </div>
            </div>

            {/* Application Types Distribution */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
              <h2 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-lg flex items-center justify-center">
                  <FaChartLine className="w-5 h-5 text-white" />
                </div>
                توزيع الطلبات حسب النوع
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Doctors */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center shadow-md">
                        <FaUserMd className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-600">الأطباء</div>
                        <div className="text-2xl font-black text-teal-700">{stats.totalDoctors}</div>
                      </div>
                    </div>
                    <div className="text-3xl font-black text-teal-500">{doctorPercentage}%</div>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-teal-500 to-teal-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${doctorPercentage}%` }}
                    ></div>
                  </div>
                </div>

                {/* Pharmacies */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-md">
                        <FaPills className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-600">الصيدليات</div>
                        <div className="text-2xl font-black text-emerald-700">{stats.totalPharmacies}</div>
                      </div>
                    </div>
                    <div className="text-3xl font-black text-emerald-500">{pharmacyPercentage}%</div>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${pharmacyPercentage}%` }}
                    ></div>
                  </div>
                </div>

                {/* Laboratories */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-md">
                        <FaFlask className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-600">المعامل</div>
                        <div className="text-2xl font-black text-cyan-700">{stats.totalLaboratories}</div>
                      </div>
                    </div>
                    <div className="text-3xl font-black text-cyan-500">{labPercentage}%</div>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-cyan-500 to-cyan-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${labPercentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Approval Rate */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                <h2 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                    <FaCheckCircle className="w-5 h-5 text-white" />
                  </div>
                  معدل الموافقة
                </h2>

                <div className="flex items-center justify-center mb-6">
                  <div className="relative w-48 h-48">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="96"
                        cy="96"
                        r="88"
                        stroke="#e2e8f0"
                        strokeWidth="16"
                        fill="none"
                      />
                      <circle
                        cx="96"
                        cy="96"
                        r="88"
                        stroke="url(#gradient)"
                        strokeWidth="16"
                        fill="none"
                        strokeDasharray={`${(approvalRate / 100) * 553} 553`}
                        strokeLinecap="round"
                        className="transition-all duration-1000"
                      />
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#10b981" />
                          <stop offset="100%" stopColor="#14b8a6" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-5xl font-black text-green-600">{approvalRate}%</div>
                        <div className="text-sm font-semibold text-slate-600 mt-1">معدل الموافقة</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-black text-green-600">{stats.totalApprovedToday}</div>
                    <div className="text-xs font-semibold text-slate-600">موافق</div>
                  </div>
                  <div>
                    <div className="text-2xl font-black text-blue-600">{stats.totalUnderReview}</div>
                    <div className="text-xs font-semibold text-slate-600">قيد المراجعة</div>
                  </div>
                  <div>
                    <div className="text-2xl font-black text-amber-600">{stats.totalPending}</div>
                    <div className="text-xs font-semibold text-slate-600">معلق</div>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                <h2 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-lg flex items-center justify-center">
                    <FaChartLine className="w-5 h-5 text-white" />
                  </div>
                  ملخص سريع
                </h2>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-teal-50 to-emerald-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <FaUserMd className="w-5 h-5 text-teal-500" />
                      <span className="font-semibold text-slate-700">أطباء</span>
                    </div>
                    <span className="text-2xl font-black text-teal-600">{stats.totalDoctors}</span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <FaPills className="w-5 h-5 text-emerald-500" />
                      <span className="font-semibold text-slate-700">صيدليات</span>
                    </div>
                    <span className="text-2xl font-black text-emerald-600">{stats.totalPharmacies}</span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <FaFlask className="w-5 h-5 text-cyan-500" />
                      <span className="font-semibold text-slate-700">معامل</span>
                    </div>
                    <span className="text-2xl font-black text-cyan-600">{stats.totalLaboratories}</span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border-2 border-amber-200">
                    <div className="flex items-center gap-3">
                      <FaClock className="w-5 h-5 text-amber-500" />
                      <span className="font-semibold text-slate-700">قيد الانتظار</span>
                    </div>
                    <span className="text-2xl font-black text-amber-600">{stats.totalPending}</span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-200">
                    <div className="flex items-center gap-3">
                      <FaCheckCircle className="w-5 h-5 text-green-500" />
                      <span className="font-semibold text-slate-700">موثّقة اليوم</span>
                    </div>
                    <span className="text-2xl font-black text-green-600">{stats.totalApprovedToday}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatisticsPage;
