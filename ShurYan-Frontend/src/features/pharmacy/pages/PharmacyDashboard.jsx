import React, { useState } from 'react';
import { 
  FaShoppingCart, 
  FaCheckCircle, 
  FaClock, 
  FaChartLine,
  FaMoneyBillWave,
  FaCalendarAlt,
  FaFilePrescription
} from 'react-icons/fa';
import { MOCK_PHARMACY_STATS } from '../data/mockData';
import useOrders from '../hooks/useOrders';
import PrescriptionModal from '../components/PrescriptionModal_v2';
import { formatDate } from '../../../utils/helpers';

/**
 * Pharmacy Dashboard - Main Page
 * @component
 */
const PharmacyDashboard = () => {

  // Use orders hook
  const {
    orders,
    loading,
    error,
    getStatusConfig,
    refreshOrders,
  } = useOrders({ autoFetch: true, pageSize: 5 }); // Show only 5 recent orders on dashboard

  // Icon mapping for mock data
  const iconMap = {
    FaShoppingCart,
    FaClock,
    FaCheckCircle,
    FaMoneyBillWave,
    FaCalendarAlt,
    FaChartLine,
  };

  // Map mock data with actual icon components (for stats cards)
  const stats = MOCK_PHARMACY_STATS.map(stat => ({
    ...stat,
    IconComponent: iconMap[stat.icon],
  }));

  // Modal state
  const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  // Handle prescription view
  const handleViewPrescription = (orderId) => {
    console.log('👁️ Viewing prescription for order:', orderId);
    setSelectedOrderId(orderId);
    setIsPrescriptionModalOpen(true);
  };


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
          {stats.map((stat) => {
            const Icon = stat.icon;
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
          })}
        </div>

        {/* Recent Orders Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black text-slate-800">أحدث الطلبات</h2>
            <button className="px-4 py-2 text-sm font-bold text-[#00b19f] hover:text-white hover:bg-[#00b19f] border-2 border-[#00b19f] rounded-xl transition-all duration-200">
              عرض الكل
            </button>
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
                          <span className={`inline-block px-3 py-1.5 rounded-lg text-xs font-semibold ${statusConfig.bgColor} ${statusConfig.textColor} border ${statusConfig.borderColor}`}>
                            {statusConfig.label}
                          </span>
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
