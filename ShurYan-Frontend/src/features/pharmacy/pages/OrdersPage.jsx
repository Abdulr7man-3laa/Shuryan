import React, { useState } from 'react';
import { 
  FaShoppingCart, 
  FaSearch,
  FaFilter,
  FaCalendar,
  FaUser,
  FaPills,
  FaMoneyBillWave,
  FaTruck,
  FaCheckCircle,
  FaClock,
  FaBox,
  FaChevronDown,
  FaChevronUp
} from 'react-icons/fa';
import { MOCK_COMPLETED_ORDERS, ORDER_STATUS } from '../data/mockData';

/**
 * Pharmacy Orders Page - Completed Orders
 * @component
 */
const OrdersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedOrder, setExpandedOrder] = useState(null);

  // Filter orders
  const filteredOrders = MOCK_COMPLETED_ORDERS.filter(order => {
    const matchesSearch = order.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Toggle order details
  const toggleOrder = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl lg:text-5xl font-black mb-3 leading-tight" style={{ 
            background: 'linear-gradient(to right, #00b19f, #00d4be)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            الطلبات المكتملة
          </h1>
          <p className="text-slate-600 text-lg">
            جميع الطلبات التي تمت معالجتها بنجاح
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-5 border-2 border-blue-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 font-semibold mb-1">إجمالي الطلبات</p>
                <p className="text-3xl font-black text-blue-600">{MOCK_COMPLETED_ORDERS.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <FaShoppingCart className="text-2xl text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 border-2 border-green-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 font-semibold mb-1">تم التسليم</p>
                <p className="text-3xl font-black text-green-600">
                  {MOCK_COMPLETED_ORDERS.filter(o => o.status === 'delivered').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <FaCheckCircle className="text-2xl text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 border-2 border-amber-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 font-semibold mb-1">قيد التوصيل</p>
                <p className="text-3xl font-black text-amber-600">
                  {MOCK_COMPLETED_ORDERS.filter(o => o.status === 'out_for_delivery').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <FaTruck className="text-2xl text-amber-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 border-2 border-purple-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 font-semibold mb-1">قيد التحضير</p>
                <p className="text-3xl font-black text-purple-600">
                  {MOCK_COMPLETED_ORDERS.filter(o => o.status === 'preparation_in_progress').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <FaBox className="text-2xl text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <FaSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="ابحث برقم الطلب أو اسم المريض..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-12 pl-4 py-3 border-2 border-slate-200 rounded-xl font-semibold focus:border-[#00b19f] focus:ring-2 focus:ring-[#00b19f]/20 outline-none transition-all"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <FaFilter className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pr-12 pl-4 py-3 border-2 border-slate-200 rounded-xl font-semibold focus:border-[#00b19f] focus:ring-2 focus:ring-[#00b19f]/20 outline-none transition-all appearance-none"
              >
                <option value="all">جميع الحالات</option>
                <option value="confirmed">تم التأكيد</option>
                <option value="preparation_in_progress">قيد التحضير</option>
                <option value="ready_for_pickup">جاهز للاستلام</option>
                <option value="out_for_delivery">قيد التوصيل</option>
                <option value="delivered">تم التسليم</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => {
              const statusConfig = ORDER_STATUS[order.status];
              const isExpanded = expandedOrder === order.id;

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl shadow-sm border-2 border-slate-100 overflow-hidden transition-all duration-200 hover:shadow-md"
                >
                  {/* Order Header */}
                  <div
                    className="p-6 cursor-pointer hover:bg-slate-50 transition-colors"
                    onClick={() => toggleOrder(order.id)}
                  >
                    <div className="flex items-center justify-between gap-4">
                      {/* Left: Order Info */}
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#00b19f] to-[#00d4be] rounded-xl flex items-center justify-center text-white font-black text-lg shadow-md">
                          #{order.id}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-black text-slate-800 mb-1">{order.orderNumber}</h3>
                          <div className="flex items-center gap-4 text-sm text-slate-600">
                            <span className="flex items-center gap-1">
                              <FaUser className="text-xs" />
                              {order.patientName}
                            </span>
                            <span className="flex items-center gap-1">
                              <FaCalendar className="text-xs" />
                              {formatDate(order.orderDate)}
                            </span>
                            <span className="flex items-center gap-1">
                              <FaPills className="text-xs" />
                              {order.medications.length} دواء
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Status & Price */}
                      <div className="flex items-center gap-4">
                        <div className="text-left">
                          <p className="text-sm text-slate-500 font-semibold mb-1">الإجمالي</p>
                          <p className="text-2xl font-black text-slate-800">{order.totalPrice} ج.م</p>
                        </div>

                        <span className={`px-4 py-2 rounded-xl text-sm font-bold ${statusConfig.bgColor} ${statusConfig.textColor} border-2 ${statusConfig.borderColor}`}>
                          {statusConfig.label}
                        </span>

                        <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                          {isExpanded ? 
                            <FaChevronUp className="text-slate-600" /> : 
                            <FaChevronDown className="text-slate-600" />
                          }
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Details (Expanded) */}
                  {isExpanded && (
                    <div className="border-t-2 border-slate-100 p-6 bg-slate-50 animate-fadeIn">
                      {/* Medications List */}
                      <div className="mb-6">
                        <h4 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2">
                          <FaPills className="text-[#00b19f]" />
                          الأدوية المطلوبة
                        </h4>
                        <div className="space-y-3">
                          {order.medications.map((med, index) => (
                            <div key={index} className="bg-white rounded-xl p-4 border-2 border-slate-200">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 bg-slate-800 text-white rounded-lg flex items-center justify-center text-sm font-bold">
                                    {index + 1}
                                  </div>
                                  <div>
                                    <h5 className="font-bold text-slate-800">{med.name}</h5>
                                    <p className="text-sm text-slate-500">
                                      {med.dosage} • {med.frequency} • {med.duration}
                                    </p>
                                  </div>
                                </div>
                                <div className="text-left">
                                  <p className="text-sm text-slate-500">السعر</p>
                                  <p className="text-lg font-black text-slate-800">{med.price} ج.م</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Delivery Info */}
                      {order.deliveryAddress && (
                        <div className="mb-6">
                          <h4 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2">
                            <FaTruck className="text-[#00b19f]" />
                            معلومات التوصيل
                          </h4>
                          <div className="bg-white rounded-xl p-4 border-2 border-slate-200">
                            <p className="text-slate-700 font-semibold mb-2">{order.deliveryAddress}</p>
                            <div className="flex items-center gap-4 text-sm text-slate-600">
                              <span>رسوم التوصيل: {order.deliveryFee} ج.م</span>
                              {order.deliveryNotes && <span>• {order.deliveryNotes}</span>}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Total Summary */}
                      <div className="bg-gradient-to-r from-[#00b19f] to-[#00d4be] rounded-xl p-6 text-white">
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-semibold">إجمالي الأدوية:</span>
                          <span className="font-bold">{order.subtotal} ج.م</span>
                        </div>
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-semibold">رسوم التوصيل:</span>
                          <span className="font-bold">{order.deliveryFee} ج.م</span>
                        </div>
                        <div className="border-t-2 border-white/30 pt-3 flex items-center justify-between">
                          <span className="text-xl font-black">الإجمالي النهائي:</span>
                          <span className="text-3xl font-black">{order.totalPrice} ج.م</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            /* Empty State */
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-16 text-center">
              <div className="w-24 h-24 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm" style={{
                background: 'linear-gradient(to bottom right, rgba(0, 177, 159, 0.1), rgba(0, 212, 190, 0.1))'
              }}>
                <FaShoppingCart className="text-4xl" style={{ color: '#00b19f' }} />
              </div>
              <h3 className="text-xl font-bold text-slate-700 mb-3">لا توجد طلبات مطابقة</h3>
              <p className="text-slate-500 text-base">جرب تغيير معايير البحث أو الفلتر</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
