import React, { useState, useEffect, useRef } from 'react';
import {
  FaShoppingCart,
  FaCheckCircle,
  FaClock,
  FaChartLine,
  FaMoneyBillWave,
  FaCalendarAlt,
  FaFilePrescription,
  FaChevronDown,
  FaBox,
  FaTruck,
  FaCheck
} from 'react-icons/fa';
import usePharmacyStatsStore from '../stores/pharmacyStatsStore';
import useOrders from '../hooks/useOrders';
import PrescriptionModal from '../components/PrescriptionModal_v2';
import { formatDate } from '../../../utils/helpers';
import { updateOrderStatus as updateOrderStatusAPI } from '../../../api/services/pharmacy.service';

/**
 * Pharmacy Dashboard - Main Page
 * @component
 */
const PharmacyDashboard = () => {

  // Use statistics store
  const { statistics, loading: statsLoading, error: statsError, fetchStatistics } = usePharmacyStatsStore();

  // Use orders hook
  const {
    orders,
    loading,
    error,
    getStatusConfig,
    refreshOrders,
    updateOrderStatus: updateOrderStatusLocal,
  } = useOrders({ autoFetch: true, pageSize: 5 }); // Show only 5 recent orders on dashboard

  // Fetch statistics on mount
  useEffect(() => {
    fetchStatistics();
  }, [fetchStatistics]);

  // Map API statistics to stats cards
  const stats = statistics ? [
    {
      id: 1,
      title: 'طلبات جديدة اليوم',
      value: statistics.newOrdersToday?.toString() || '0',
      IconComponent: FaShoppingCart,
      bgColor: 'bg-[#00b19f]/10',
      textColor: 'text-[#00b19f]',
    },
    {
      id: 2,
      title: 'طلبات معلقة',
      value: statistics.pendingOrders?.toString() || '0',
      IconComponent: FaClock,
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-600',
    },
    {
      id: 3,
      title: 'طلبات مكتملة',
      value: statistics.completedOrders?.toString() || '0',
      IconComponent: FaCheckCircle,
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600',
    },
    {
      id: 4,
      title: 'إيرادات اليوم',
      value: `${statistics.todayRevenue?.toLocaleString() || '0'} ج.م`,
      IconComponent: FaMoneyBillWave,
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      id: 5,
      title: 'طلبات الشهر',
      value: statistics.monthlyOrders?.toString() || '0',
      IconComponent: FaCalendarAlt,
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
    },
    {
      id: 6,
      title: 'إيرادات الشهر',
      value: `${statistics.monthlyRevenue?.toLocaleString() || '0'} ج.م`,
      IconComponent: FaChartLine,
      bgColor: 'bg-rose-50',
      textColor: 'text-rose-600',
    },
  ] : [];

  // Modal state
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  // Dropdown state
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const dropdownRef = useRef(null);

  // Status options for dropdown
  const statusOptions = [
    { value: 6, label: 'جاري تحضير الطلب', icon: FaBox, color: 'text-blue-600', bgColor: 'bg-blue-50' },
    { value: 7, label: 'خرج للتوصيل', icon: FaTruck, color: 'text-indigo-600', bgColor: 'bg-indigo-50' },
    { value: 8, label: 'جاهز للاستلام', icon: FaCheck, color: 'text-green-600', bgColor: 'bg-green-50' },
    { value: 9, label: 'تم التسليم', icon: FaCheckCircle, color: 'text-emerald-600', bgColor: 'bg-emerald-50' },
  ];

  // Handle prescription view
  const handleViewPrescription = (orderId) => {
    console.log('👁️ Viewing prescription for order:', orderId);
    setSelectedOrderId(orderId);
    setIsPrescriptionModalOpen(true);
  };

  // Handle status update
  const handleStatusUpdate = async (orderId, newStatus) => {
    console.log('🔄 Updating order status:', orderId, newStatus);

    // Optimistic update
    const prevOrder = orders.find(o => o.orderId === orderId);
    const prevStatus = prevOrder?.pharmacyOrderStatus;
    updateOrderStatusLocal(orderId, newStatus);
    setOpenDropdownId(null);

    try {
      const result = await updateOrderStatusAPI(orderId, newStatus);
      if (result.success) {
        console.log('✅ Status updated successfully');
        // No refresh needed; UI already updated optimistically
      } else {
        // Rollback on failure
        updateOrderStatusLocal(orderId, prevStatus);
        console.error('❌ Failed to update status:', result.error);
        alert(result.error || 'فشل في تحديث حالة الطلب');
      }
    } catch (error) {
      // Rollback on error
      updateOrderStatusLocal(orderId, prevStatus);
      console.error('❌ Error updating status:', error);
      alert('حدث خطأ أثناء تحديث حالة الطلب');
    }
  };

  // Toggle dropdown
  const toggleDropdown = (orderId) => {
    setOpenDropdownId(openDropdownId === orderId ? null : orderId);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdownId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Header - Centered */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-black mb-3 leading-tight" style={{
            background: 'linear-gradient(to right, #00b19f, #00d4be)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            مرحباً بك في لوحة التحكم
          </h1>
          <p className="text-slate-500 text-lg font-medium">
            إدارة طلبات الروشتات والأدوية
          </p>
        </div>

        {/* Stats Grid - 6 Cards in One Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
          {statsLoading ? (
            /* Loading State for Stats */
            <div className="col-span-full text-center py-8">
              <div className="inline-block w-10 h-10 border-4 border-[#00b19f] border-t-transparent rounded-full animate-spin mb-3"></div>
              <p className="text-slate-600 font-medium">جاري تحميل الإحصائيات...</p>
            </div>
          ) : statsError ? (
            /* Error State for Stats */
            <div className="col-span-full text-center py-8">
              <div className="w-16 h-16 rounded-xl bg-red-50 flex items-center justify-center mx-auto mb-4">
                <FaChartLine className="text-2xl text-red-500" />
              </div>
              <h3 className="text-lg font-bold text-slate-700 mb-2">حدث خطأ في تحميل الإحصائيات</h3>
              <p className="text-slate-500 text-sm mb-3">{statsError}</p>
              <button
                onClick={fetchStatistics}
                className="px-4 py-2 bg-[#00b19f] hover:bg-[#00a08d] text-white font-semibold rounded-lg transition-all duration-200"
              >
                إعادة المحاولة
              </button>
            </div>
          ) : (
            /* Stats Cards */
            stats.map((stat) => {
              const Icon = stat.IconComponent;
              return (
                <div
                  key={stat.id}
                  className="bg-white rounded-xl shadow-sm border border-slate-100 p-5 hover:shadow-lg hover:border-[#00b19f]/30 transition-all duration-300 group"
                >
                  {/* Icon */}
                  <div className="flex justify-center mb-4">
                    <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className={`text-xl ${stat.textColor}`} />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-slate-600 text-xs font-semibold mb-2 text-center leading-tight">{stat.title}</h3>

                  {/* Value */}
                  <p className="text-2xl font-black text-slate-800 text-center">{stat.value}</p>
                </div>
              );
            })
          )}
        </div>

        {/* Recent Orders Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black text-slate-800">أحدث الطلبات</h2>
          </div>

          {/* Orders Table */}
          {loading ? (
            /* Loading State */
            <div className="text-center py-16">
              <div className="inline-block w-12 h-12 border-4 border-[#00b19f] border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-slate-600 font-medium">جاري تحميل الروشتات...</p>
            </div>
          ) : error ? (
            /* Error State */
            <div className="text-center py-16">
              <div className="w-24 h-24 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-6">
                <FaShoppingCart className="text-4xl text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-700 mb-3">حدث خطأ</h3>
              <p className="text-slate-500 text-base mb-4">{error}</p>
              <button
                onClick={refreshOrders}
                className="px-6 py-2 bg-[#00b19f] hover:bg-[#00a08d] text-white font-semibold rounded-lg transition-all duration-200"
              >
                إعادة المحاولة
              </button>
            </div>
          ) : orders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-slate-200">
                    <th className="text-right py-4 px-4 text-sm font-bold text-slate-700">رقم الروشتة</th>
                    <th className="text-right py-4 px-4 text-sm font-bold text-slate-700">المريض</th>
                    <th className="text-right py-4 px-4 text-sm font-bold text-slate-700">الطبيب</th>
                    <th className="text-center py-4 px-4 text-sm font-bold text-slate-700">الحالة</th>
                    <th className="text-right py-4 px-4 text-sm font-bold text-slate-700">التاريخ</th>
                    <th className="text-center py-4 px-4 text-sm font-bold text-slate-700">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => {
                    const statusConfig = getStatusConfig(order.pharmacyOrderStatus);
                    // Check if status update is disabled (status 2 or 9)
                    const isStatusUpdateDisabled = order.pharmacyOrderStatus === 1 || order.pharmacyOrderStatus === 2 || order.pharmacyOrderStatus === 9;

                    return (
                      <tr key={order.orderId} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                        <td className="py-4 px-4">
                          <span className="text-sm font-semibold text-slate-800">{order.prescriptionNumber}</span>
                        </td>
                        <td className="py-4 px-4">
                          <div>
                            <p className="text-sm font-medium text-slate-700">{order.patientName}</p>
                            <p className="text-xs text-slate-500">{order.patientPhone}</p>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-sm font-medium text-slate-700">{order.doctorName}</span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          {isStatusUpdateDisabled ? (
                            <span className={`inline-block px-3 py-1.5 rounded-lg text-xs font-semibold ${statusConfig.bgColor} ${statusConfig.textColor} border ${statusConfig.borderColor}`}>
                              {statusConfig.label}
                            </span>
                          ) : (
                            <div className="relative inline-block" ref={openDropdownId === order.orderId ? dropdownRef : null}>
                              <button
                                onClick={() => toggleDropdown(order.orderId)}
                                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border ${statusConfig.borderColor} ${statusConfig.bgColor} ${statusConfig.textColor} transition-all duration-200 hover:shadow-sm`}
                              >
                                <span>{statusConfig.label}</span>
                                <FaChevronDown className={`text-xs transition-transform duration-200 ${openDropdownId === order.orderId ? 'rotate-180' : ''}`} />
                              </button>

                              {/* Status Update Dropdown */}
                              {openDropdownId === order.orderId && (
                                <div className="absolute left-0 mt-2 w-56 bg-white rounded-xl shadow-lg border-2 border-slate-100 z-50 overflow-hidden animate-fadeIn">
                                  {statusOptions.map((option) => {
                                    const Icon = option.icon;
                                    return (
                                      <button
                                        key={option.value}
                                        onClick={() => handleStatusUpdate(order.orderId, option.value)}
                                        className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors text-right border-b border-slate-100 last:border-b-0`}
                                      >
                                        <div className={`w-8 h-8 ${option.bgColor} rounded-lg flex items-center justify-center`}>
                                          <Icon className={`text-sm ${option.color}`} />
                                        </div>
                                        <span className="text-sm font-semibold text-slate-700">{option.label}</span>
                                      </button>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <span className="text-sm text-slate-600">{formatDate(order.receivedAt, 'DD/MM/YYYY HH:mm')}</span>
                        </td>
                        <td className="py-4 px-4 text-center">
                          <button
                            onClick={() => handleViewPrescription(order.orderId)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-[#00b19f] hover:bg-[#00a08d] text-white text-sm font-semibold rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                          >
                            <FaFilePrescription className="text-base" />
                            <span>عرض التفاصيل</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            /* Empty State */
            <div className="text-center py-16">
              <div className="w-24 h-24 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm" style={{
                background: 'linear-gradient(to bottom right, rgba(0, 177, 159, 0.1), rgba(0, 212, 190, 0.1))'
              }}>
                <FaShoppingCart className="text-4xl" style={{ color: '#00b19f' }} />
              </div>
              <h3 className="text-xl font-bold text-slate-700 mb-3">لا توجد طلبات حالياً</h3>
              <p className="text-slate-500 text-base">سيتم عرض الطلبات الجديدة هنا</p>
            </div>
          )}
        </div>
      </div>

      {/* Prescription Modal */}
      <PrescriptionModal
        isOpen={isPrescriptionModalOpen}
        onClose={() => setIsPrescriptionModalOpen(false)}
        orderId={selectedOrderId}
      />

    </div>
  );
};

export default PharmacyDashboard;
