import React, { useState, useEffect } from 'react';
import {
  FaFlask,
  FaSearch,
  FaCalendar,
  FaUser,
  FaMicroscope,
  FaTruck,
  FaCheckCircle,
  FaChevronDown,
  FaChevronUp,
  FaSpinner
} from 'react-icons/fa';
import useLabOrdersStore from '../stores/labOrdersStore';

import { LAB_ORDER_STATUS, LAB_STATUS_CONFIG } from '../constants/labConstants';

/**
 * Laboratory Orders Page - All Orders
 * @component
 */
const OrdersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedOrder, setExpandedOrder] = useState(null);

  // Get data from store
  const {
    orders,
    loading,
    error,
    fetchOrders,
    fetchOrderDetails,
    selectedOrder,
    orderDetailsLoading,
    clearOrderDetails
  } = useLabOrdersStore();

  // Fetch orders on mount
  useEffect(() => {
    fetchOrders(1, 20, null); // Fetch all orders without status filter
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filter orders by search term
  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      order.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // Calculate stats from filtered orders
  // Calculate stats from filtered orders
  const stats = {
    total: filteredOrders.length,
    delivered: filteredOrders.filter(o => o.status === LAB_ORDER_STATUS.COMPLETED).length,
    confirmed: filteredOrders.filter(o => o.status === LAB_ORDER_STATUS.CONFIRMED_BY_LAB).length,
    pending: filteredOrders.filter(o => o.status === LAB_ORDER_STATUS.AWAITING_LAB_REVIEW).length,
  };

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
  const toggleOrder = async (orderId) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
      clearOrderDetails();
    } else {
      setExpandedOrder(orderId);
      await fetchOrderDetails(orderId);
    }
  };

  // Get order details (either from selectedOrder or from list)
  const getOrderDetails = (orderId) => {
    if (selectedOrder && selectedOrder.id === orderId) {
      return selectedOrder;
    }
    return null;
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
            الطلبات
          </h1>
          <p className="text-slate-600 text-lg">
            جميع الطلبات الخاصة بالمعمل
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-5 border-2 border-blue-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 font-semibold mb-1">إجمالي الطلبات</p>
                <p className="text-3xl font-black text-blue-600">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <FaFlask className="text-2xl text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 border-2 border-green-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 font-semibold mb-1">تم التسليم</p>
                <p className="text-3xl font-black text-green-600">{stats.delivered}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <FaCheckCircle className="text-2xl text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 border-2 border-amber-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 font-semibold mb-1">تم التأكيد</p>
                <p className="text-3xl font-black text-amber-600">{stats.confirmed}</p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <FaTruck className="text-2xl text-amber-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 border-2 border-purple-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 font-semibold mb-1">في الانتظار</p>
                <p className="text-3xl font-black text-purple-600">{stats.pending}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <FaSpinner className="text-2xl text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-6">
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
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-16 text-center">
            <FaSpinner className="text-4xl text-[#00b19f] animate-spin mx-auto mb-4" />
            <p className="text-slate-600 text-lg">جاري تحميل الطلبات...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 rounded-2xl border-2 border-red-200 p-6 text-center">
            <p className="text-red-600 font-semibold">{error}</p>
          </div>
        )}

        {/* Orders List */}
        {!loading && !error && (
          <div className="space-y-4">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => {
                const statusConfig = LAB_STATUS_CONFIG[order.status] || LAB_STATUS_CONFIG[LAB_ORDER_STATUS.NEW_REQUEST];
                const isExpanded = expandedOrder === order.id;
                const orderDetails = getOrderDetails(order.id);
                const totalCost = (order.testsTotalCost || 0) + (order.sampleCollectionDeliveryCost || 0);

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
                            <FaFlask />
                          </div>

                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-black text-slate-800 mb-1">طلب #{order.id?.substring(0, 8)}</h3>
                            <div className="flex items-center gap-4 text-sm text-slate-600">
                              <span className="flex items-center gap-1">
                                <FaUser className="text-xs" />
                                {order.patientName || 'غير محدد'}
                              </span>
                              <span className="flex items-center gap-1">
                                <FaCalendar className="text-xs" />
                                {formatDate(order.createdAt)}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Right: Status & Price */}
                        <div className="flex items-center gap-4">
                          <div className="text-left">
                            <p className="text-sm text-slate-500 font-semibold mb-1">الإجمالي</p>
                            <p className="text-2xl font-black text-slate-800">{totalCost.toFixed(2)} ج.م</p>
                          </div>

                          <span className={`px-4 py-2 rounded-xl text-sm font-bold ${statusConfig.bgColor} ${statusConfig.color} border-2 ${statusConfig.borderColor}`}>
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
                        {orderDetailsLoading ? (
                          <div className="text-center py-8">
                            <FaSpinner className="text-3xl text-[#00b19f] animate-spin mx-auto mb-3" />
                            <p className="text-slate-600">جاري تحميل التفاصيل...</p>
                          </div>
                        ) : orderDetails ? (
                          <>
                            {/* Tests List */}
                            {orderDetails.tests && orderDetails.tests.length > 0 && (
                              <div className="mb-6">
                                <h4 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2">
                                  <FaMicroscope className="text-[#00b19f]" />
                                  التحاليل المطلوبة
                                </h4>
                                <div className="space-y-3">
                                  {orderDetails.tests.map((test, index) => (
                                    <div key={test.labTestId || index} className="bg-white rounded-xl p-4 border-2 border-slate-200">
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                          <div className="w-8 h-8 bg-slate-800 text-white rounded-lg flex items-center justify-center text-sm font-bold">
                                            {index + 1}
                                          </div>
                                          <div>
                                            <h5 className="font-bold text-slate-800">{test.labTestName || test.testName}</h5>
                                            <p className="text-sm text-slate-500">
                                              {test.labTestCategory || test.category || 'تحليل معملي'}
                                            </p>
                                          </div>
                                        </div>
                                        <div className="text-left">
                                          <p className="text-sm text-slate-500">السعر</p>
                                          <p className="text-lg font-black text-slate-800">{test.price?.toFixed(2) || '0.00'} ج.م</p>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Sample Collection Info */}
                            <div className="mb-6">
                              <h4 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2">
                                <FaTruck className="text-[#00b19f]" />
                                معلومات جمع العينة
                              </h4>
                              <div className="bg-white rounded-xl p-4 border-2 border-slate-200">
                                <div className="space-y-2">
                                  <p className="text-slate-700 font-semibold">
                                    <span className="text-slate-500">اسم المريض: </span>
                                    {orderDetails.patientName || 'غير محدد'}
                                  </p>
                                  <p className="text-slate-700 font-semibold">
                                    <span className="text-slate-500">نوع الجمع: </span>
                                    {orderDetails.sampleCollectionType === 1 ? 'زيارة المعمل' :
                                      orderDetails.sampleCollectionType === 2 ? 'جمع عينة من المنزل' :
                                        'غير محدد'}
                                  </p>
                                  {orderDetails.sampleCollectionType === 2 && (
                                    <p className="text-slate-700 font-semibold">
                                      <span className="text-slate-500">رسوم الخدمة المنزلية: </span>
                                      {orderDetails.sampleCollectionDeliveryCost?.toFixed(2) || '0.00'} ج.م
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Total Summary */}
                            <div className="bg-gradient-to-r from-[#00b19f] to-[#00d4be] rounded-xl p-6 text-white">
                              <div className="space-y-2 mb-3">
                                <div className="flex items-center justify-between">
                                  <span className="font-semibold">تكلفة التحاليل:</span>
                                  <span className="font-bold">{(orderDetails.testsTotalCost || 0).toFixed(2)} ج.م</span>
                                </div>
                                {orderDetails.sampleCollectionType === 2 && (
                                  <div className="flex items-center justify-between">
                                    <span className="font-semibold">رسوم الخدمة المنزلية:</span>
                                    <span className="font-bold">{(orderDetails.sampleCollectionDeliveryCost || 0).toFixed(2)} ج.م</span>
                                  </div>
                                )}
                              </div>
                              <div className="border-t-2 border-white/30 pt-3 flex items-center justify-between">
                                <span className="text-xl font-black">الإجمالي النهائي:</span>
                                <span className="text-3xl font-black">
                                  {((orderDetails.testsTotalCost || 0) + (orderDetails.sampleCollectionDeliveryCost || 0)).toFixed(2)} ج.م
                                </span>
                              </div>
                            </div>
                          </>
                        ) : (
                          <div className="text-center py-8">
                            <p className="text-slate-600">لا توجد تفاصيل متاحة</p>
                          </div>
                        )}
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
                  <FaFlask className="text-4xl" style={{ color: '#00b19f' }} />
                </div>
                <h3 className="text-xl font-bold text-slate-700 mb-3">لا توجد طلبات</h3>
                <p className="text-slate-500 text-base">لا توجد طلبات مطابقة لمعايير البحث</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
