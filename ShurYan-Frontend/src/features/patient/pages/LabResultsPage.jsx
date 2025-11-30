import React, { useState, useEffect } from 'react';
import {
  FaEye, FaShoppingCart, FaUserMd, FaCalendarAlt,
  FaStethoscope, FaHashtag, FaExclamationCircle, FaFileAlt, FaInfoCircle, FaFlask, FaClipboardList, FaCreditCard
} from 'react-icons/fa';
import LabPrescriptionDetailsModal from '../components/lab/LabPrescriptionDetailsModal';
import OrderLabTestModal from '../components/OrderLabTestModal';
import LabReportsModal from '../components/LabReportsModal';
import PaymentModal from '../components/lab/PaymentModal';
import { formatDate } from '@/utils/helpers';
import useAuth from '../../auth/hooks/useAuth';
import patientService from '@/api/services/patient.service';
import { LAB_STATUS_CONFIG } from '@/features/laboratory/constants/labConstants';

/**
 * LabResultsPage Component
 * Display all patient's lab prescriptions from all doctors
 * Using endpoint: /api/patients/me/lab-prescriptions
 */
const LabResultsPage = () => {
  const { user } = useAuth();

  // Tab state
  const [activeTab, setActiveTab] = useState(1); // 1: Prescriptions, 2: Requests, 3: Results

  // Prescriptions (Tab 1)
  const [labPrescriptions, setLabPrescriptions] = useState([]);

  // Lab Orders (Tabs 2 & 3)
  const [activeLabOrders, setActiveLabOrders] = useState([]); // Tab 2
  const [completedLabOrders, setCompletedLabOrders] = useState([]); // Tab 3

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLabPrescription, setSelectedLabPrescription] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [labPrescriptionToOrder, setLabPrescriptionToOrder] = useState(null);
  const [isReportsModalOpen, setIsReportsModalOpen] = useState(false);
  const [labPrescriptionForReports, setLabPrescriptionForReports] = useState(null);
  
  // Payment modal state
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedOrderForPayment, setSelectedOrderForPayment] = useState(null);

  const fetchLabPrescriptions = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log('🔬 Fetching lab prescriptions for patient:', user?.id);
      const response = await patientService.getLabPrescriptions();

      console.log('✅ Lab prescriptions response:', response);

      // Map data
      const mappedLabPrescriptions = response.map(labPrescription => ({
        ...labPrescription,
        consultationType: labPrescription.appointmentType === 'regular' ? 'كشف جديد' : 'إعادة كشف',
        patientId: user?.id,
        // Calculate status from hasOrder
        status: labPrescription.hasOrder ? 5 : 1, // 5 = Reported (has order), 1 = Active
        statusName: labPrescription.hasOrder ? 'تم الرد عليه' : 'نشط'
      }));

      // Log statuses for debugging
      console.log('📊 Lab prescription statuses:', mappedLabPrescriptions.map(lp => ({
        id: lp.id,
        doctorName: lp.doctorName,
        hasOrder: lp.hasOrder,
        orderStatus: lp.orderStatus,
        status: lp.status,
        statusName: lp.statusName
      })));

      setLabPrescriptions(mappedLabPrescriptions);
      setLoading(false);
    } catch (err) {
      console.error('❌ Error fetching lab prescriptions:', err);
      setError('حدث خطأ في تحميل طلبات التحاليل');
      setLoading(false);
    }
  };

  const fetchActiveLabOrders = async () => {
    try {
      console.log('🔬 Fetching active lab orders for patient:', user?.id);
      const response = await patientService.getActiveLabOrders();
      console.log('✅ Active lab orders response:', response);
      setActiveLabOrders(response);
    } catch (err) {
      console.error('❌ Error fetching active lab orders:', err);
      // Don't set error state for lab orders, just log and continue
    }
  };

  const fetchCompletedLabOrders = async () => {
    try {
      console.log('🔬 Fetching completed lab orders for patient:', user?.id);
      const response = await patientService.getCompletedLabOrders();
      console.log('✅ Completed lab orders response:', response);
      setCompletedLabOrders(response);
    } catch (err) {
      console.error('❌ Error fetching completed lab orders:', err);
      // Don't set error state for lab orders, just log and continue
    }
  };

  // Fetch data based on active tab
  useEffect(() => {
    if (user?.id) {
      const fetchData = async () => {
        setLoading(true);
        setError(null);

        try {
          if (activeTab === 1) {
            await fetchLabPrescriptions();
          } else if (activeTab === 2) {
            await fetchActiveLabOrders();
          } else if (activeTab === 3) {
            await fetchCompletedLabOrders();
          }
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, activeTab]);

  const handleViewLabPrescription = (labPrescription) => {
    console.log('👁️ Viewing lab prescription:', labPrescription);
    setSelectedLabPrescription(labPrescription);
    setIsDetailsModalOpen(true);
  };

  const handleOrderLabTest = (labPrescription) => {
    console.log('🛒 Ordering lab test:', labPrescription);
    setLabPrescriptionToOrder(labPrescription);
    setIsOrderModalOpen(true);
  };

  const handleViewReports = (labPrescription) => {
    console.log('📋 Viewing reports for lab prescription:', labPrescription);
    setLabPrescriptionForReports(labPrescription);
    setIsReportsModalOpen(true);
  };

  // Check if lab prescription has laboratory reports (hasOrder = true)
  const hasLaboratoryReports = (labPrescription) => {
    console.log('🔍 Checking lab prescription status:', {
      id: labPrescription.id,
      hasOrder: labPrescription.hasOrder,
      orderStatus: labPrescription.orderStatus,
      status: labPrescription.status
    });
    return labPrescription.hasOrder === true;
  };

  const formatLabPrescriptionDate = (date) => {
    if (!date) return 'غير محدد';
    try {
      return formatDate(date);
    } catch {
      return date;
    }
  };

  // Get lab prescription status in Arabic
  const getLabPrescriptionStatusText = (status) => {
    const statusMap = {
      1: 'نشط', // Active (no order yet)
      2: 'ملغي', // Cancelled
      3: 'تم إجراؤه', // Performed
      4: 'منتهي الصلاحية', // Expired
      5: 'تم الرد عليه' // Reported (has order)
    };
    return statusMap[status] || 'غير محدد';
  };

  // Get lab prescription status color
  const getLabPrescriptionStatusColor = (status) => {
    const colorMap = {
      1: 'text-blue-600 bg-blue-50', // Active
      2: 'text-red-600 bg-red-50', // Cancelled
      3: 'text-green-600 bg-green-50', // Performed
      4: 'text-gray-600 bg-gray-50', // Expired
      5: 'text-emerald-600 bg-emerald-50' // Reported
    };
    return colorMap[status] || 'text-gray-600 bg-gray-50';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50/30 to-emerald-50/30" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-500 to-emerald-600 rounded-2xl p-8 mb-8 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}></div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-400/20 rounded-full -ml-24 -mb-24"></div>

          <div className="relative">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
                <FaFlask className="text-white text-3xl" />
              </div>
              <div>
                <h1 className="text-4xl font-black text-white mb-2">
                  التحاليل الطبية
                </h1>
                <p className="text-white/90 text-lg font-medium">
                  جميع التحاليل الخاصة بك من كل الأطباء
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            {!loading && !error && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/30 rounded-lg flex items-center justify-center">
                      <FaFlask className="text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white/80">إجمالي التحاليل</p>
                      <p className="text-2xl font-black text-white">{labPrescriptions.length}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/30 rounded-lg flex items-center justify-center">
                      <FaUserMd className="text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white/80">عدد الأطباء</p>
                      <p className="text-2xl font-black text-white">
                        {new Set(labPrescriptions.map(lp => lp.doctorId)).size}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/30 rounded-lg flex items-center justify-center">
                      <FaCalendarAlt className="text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white/80">آخر تحليل</p>
                      <p className="text-sm font-bold text-white">
                        {labPrescriptions.length > 0 ? formatLabPrescriptionDate(labPrescriptions[0].createdAt) : '-'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tabs Navigation */}
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setActiveTab(1)}
                className={`flex-1 px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-md hover:shadow-lg ${activeTab === 1
                  ? 'bg-white text-teal-600 shadow-xl'
                  : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
              >
                <FaFileAlt className="inline-block ml-2" />
                الروشتات
              </button>
              <button
                onClick={() => setActiveTab(2)}
                className={`flex-1 px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-md hover:shadow-lg ${activeTab === 2
                  ? 'bg-white text-teal-600 shadow-xl'
                  : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
              >
                <FaClipboardList className="inline-block ml-2" />
                الطلبات
              </button>
              <button
                onClick={() => setActiveTab(3)}
                className={`flex-1 px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-md hover:shadow-lg ${activeTab === 3
                  ? 'bg-white text-teal-600 shadow-xl'
                  : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
              >
                <FaFlask className="inline-block ml-2" />
                النتائج
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          {loading ? (
            /* Loading State */
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-slate-600 font-medium">جاري تحميل التحاليل...</p>
              </div>
            </div>
          ) : error ? (
            /* Error State */
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaExclamationCircle className="text-red-500 text-4xl" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">حدث خطأ</h3>
              <p className="text-slate-600 font-medium mb-4">{error}</p>
              <button
                onClick={fetchLabPrescriptions}
                className="px-6 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-600 text-white rounded-xl hover:from-teal-600 hover:to-emerald-700 transition-all font-bold text-sm shadow-lg"
              >
                إعادة المحاولة
              </button>
            </div>
          ) : (
            (() => {
              // Determine which data to display based on active tab
              let data = [];
              let emptyMessage = '';

              if (activeTab === 1) {
                data = labPrescriptions;
                emptyMessage = 'لا توجد روشتات';
              } else if (activeTab === 2) {
                data = activeLabOrders;
                emptyMessage = 'لا توجد طلبات';
              } else if (activeTab === 3) {
                data = completedLabOrders;
                emptyMessage = 'لا توجد نتائج';
              }

              // Empty state check
              if (data.length === 0) {
                return (
                  <div className="text-center py-20">
                    <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FaFileAlt className="text-slate-400 text-4xl" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">{emptyMessage}</h3>
                    <p className="text-slate-600 font-medium">
                      {activeTab === 1 && 'لم يتم إنشاء أي تحاليل لك بعد'}
                      {activeTab === 2 && 'لم تقم بإرسال أي طلبات للمعامل بعد'}
                      {activeTab === 3 && 'لا توجد نتائج جاهزة حتى الآن'}
                    </p>
                  </div>
                );
              }

              // Render TAB 1: Prescriptions
              if (activeTab === 1) {
                return (
                  <div className="space-y-4">
                    {labPrescriptions.map((labPrescription, index) => (
                      <div
                        key={labPrescription.id}
                        className="bg-white rounded-2xl border-2 border-slate-200 hover:border-teal-400 transition-all shadow-sm hover:shadow-lg p-6"
                      >
                        <div className="flex items-center gap-4">
                          {/* Number Badge */}
                          <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-xl flex items-center justify-center text-white font-black text-lg flex-shrink-0">
                            {index + 1}
                          </div>

                          {/* Lab Prescription Info */}
                          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Right Column */}
                            <div className="space-y-3">
                              {/* Doctor Name */}
                              <div className="flex items-center gap-2">
                                <FaUserMd className="text-teal-600 text-sm" />
                                <span className="text-xs font-semibold text-teal-700">الطبيب:</span>
                                <span className="text-sm font-bold text-slate-900">{labPrescription.doctorName}</span>
                              </div>

                              {/* Tests Count */}
                              <div className="flex items-center gap-2">
                                <FaFlask className="text-teal-600 text-sm" />
                                <span className="text-xs font-semibold text-teal-700">عدد التحاليل:</span>
                                <span className="text-sm font-black text-slate-900">{labPrescription.tests?.length || 0}</span>
                              </div>
                            </div>

                            {/* Left Column */}
                            <div className="space-y-3">
                              {/* Created Date */}
                              <div className="flex items-center gap-2">
                                <FaCalendarAlt className="text-teal-600 text-sm" />
                                <span className="text-xs font-semibold text-teal-700">تاريخ الإنشاء:</span>
                                <span className="text-sm font-bold text-slate-700">{formatLabPrescriptionDate(labPrescription.createdAt)}</span>
                              </div>

                              {/* Lab Prescription Status */}
                              <div className="flex items-center gap-2">
                                <FaInfoCircle className="text-teal-600 text-sm" />
                                <span className="text-xs font-semibold text-teal-700">الحالة:</span>
                                <span className={`text-xs font-bold px-2 py-1 rounded-full ${getLabPrescriptionStatusColor(labPrescription.status)}`}>
                                  {getLabPrescriptionStatusText(labPrescription.status)}
                                </span>
                              </div>

                              {/* Doctor Specialty */}
                              <div className="flex items-center gap-2">
                                <FaStethoscope className="text-teal-600 text-sm" />
                                <span className="text-xs font-semibold text-teal-700">التخصص:</span>
                                <span className="text-sm font-bold text-slate-700">{labPrescription.doctorSpecialty}</span>
                              </div>
                            </div>
                          </div>

                          {/* Right Section: Consultation Type + Action Buttons */}
                          <div className="flex flex-col items-end gap-3">
                            {/* Consultation Type Badge */}
                            {labPrescription.consultationType && (
                              <div className="flex items-center gap-2 bg-teal-50 px-3 py-1.5 rounded-lg border border-teal-200">
                                <FaClipboardList className="text-teal-600 text-xs" />
                                <span className="text-xs font-bold text-teal-700">{labPrescription.consultationType}</span>
                              </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex items-center gap-2">
                              {/* View Button */}
                              <button
                                onClick={() => handleViewLabPrescription(labPrescription)}
                                className="px-4 py-2.5 bg-gradient-to-r from-slate-500 to-slate-600 text-white rounded-xl hover:from-slate-600 hover:to-slate-700 transition-all font-bold text-sm shadow-md hover:shadow-lg flex items-center gap-2 whitespace-nowrap"
                              >
                                <FaEye className="w-4 h-4" />
                                عرض التحليل
                              </button>

                              {/* Dynamic Action Button */}
                              {(labPrescription.status === 1 || labPrescription.status === 5) && (
                                hasLaboratoryReports(labPrescription) ? (
                                  <button
                                    onClick={() => handleViewReports(labPrescription)}
                                    className="px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all font-bold text-sm shadow-md hover:shadow-lg flex items-center gap-2 whitespace-nowrap"
                                  >
                                    <FaFileAlt className="w-4 h-4" />
                                    التقارير
                                  </button>
                                ) : labPrescription.status === 1 ? (
                                  <button
                                    onClick={() => handleOrderLabTest(labPrescription)}
                                    className="px-4 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-600 text-white rounded-xl hover:from-teal-600 hover:to-emerald-700 transition-all font-bold text-sm shadow-md hover:shadow-lg flex items-center gap-2 whitespace-nowrap"
                                  >
                                    <FaShoppingCart className="w-4 h-4" />
                                    اطلب الآن
                                  </button>
                                ) : null
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              }

              // Render TAB 2 & 3: Lab Orders (Requests or Results)
              return (
                <div className="space-y-4">
                  {data.map((order, index) => {
                    const statusConfig = LAB_STATUS_CONFIG[order.status] || {};

                    return (
                      <div
                        key={order.id}
                        className="bg-white rounded-2xl border-2 border-slate-200 hover:border-teal-400 transition-all shadow-sm hover:shadow-lg p-6"
                      >
                        <div className="flex items-center gap-4">
                          {/* Number Badge */}
                          <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-xl flex items-center justify-center text-white font-black text-lg flex-shrink-0">
                            {index + 1}
                          </div>

                          {/* Order Info */}
                          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Right Column */}
                            <div className="space-y-3">
                              {/* Laboratory Name */}
                              <div className="flex items-center gap-2">
                                <FaFlask className="text-teal-600 text-sm" />
                                <span className="text-xs font-semibold text-teal-700">المعمل:</span>
                                <span className="text-sm font-bold text-slate-900">{order.laboratoryName || 'غير محدد'}</span>
                              </div>

                              {/* Tests Count */}
                              <div className="flex items-center gap-2">
                                <FaHashtag className="text-teal-600 text-sm" />
                                <span className="text-xs font-semibold text-teal-700">عدد التحاليل:</span>
                                <span className="text-sm font-black text-slate-900">{order.testsCount || order.tests?.length || 0}</span>
                              </div>
                            </div>

                            {/* Left Column */}
                            <div className="space-y-3">
                              {/* Created Date */}
                              <div className="flex items-center gap-2">
                                <FaCalendarAlt className="text-teal-600 text-sm" />
                                <span className="text-xs font-semibold text-teal-700">تاريخ الطلب:</span>
                                <span className="text-sm font-bold text-slate-700">{formatLabPrescriptionDate(order.createdAt)}</span>
                              </div>

                              {/* Order Status */}
                              <div className="flex items-center gap-2">
                                <FaInfoCircle className="text-teal-600 text-sm" />
                                <span className="text-xs font-semibold text-teal-700">الحالة:</span>
                                <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${statusConfig.color} ${statusConfig.bgColor} border ${statusConfig.borderColor}`}>
                                  {statusConfig.label || 'غير محدد'}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex flex-col items-end gap-3">
                            {/* Show payment button for orders awaiting payment (status = 4) */}
                            {order.status === 4 && (
                              <button
                                onClick={() => {
                                  setSelectedOrderForPayment(order);
                                  setIsPaymentModalOpen(true);
                                }}
                                className="px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl hover:from-cyan-600 hover:to-blue-600 transition-all font-bold text-sm shadow-md hover:shadow-lg flex items-center gap-2 whitespace-nowrap"
                              >
                                <FaCreditCard className="w-4 h-4" />
                                الدفع الآن
                              </button>
                            )}
                            
                            <button
                              onClick={() => {
                                // Handle view order details
                                console.log('View order:', order);
                              }}
                              className="px-4 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-600 text-white rounded-xl hover:from-teal-600 hover:to-emerald-700 transition-all font-bold text-sm shadow-md hover:shadow-lg flex items-center gap-2 whitespace-nowrap"
                            >
                              <FaEye className="w-4 h-4" />
                              عرض التفاصيل
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()
          )}
        </div>
      </div>

      {/* Lab Prescription Details Modal */}
      {isDetailsModalOpen && selectedLabPrescription && (
        <LabPrescriptionDetailsModal
          prescription={selectedLabPrescription}
          onClose={() => {
            setIsDetailsModalOpen(false);
            setSelectedLabPrescription(null);
          }}
        />
      )}

      {/* Order Lab Test Modal */}
      <OrderLabTestModal
        isOpen={isOrderModalOpen}
        onClose={() => {
          setIsOrderModalOpen(false);
          setLabPrescriptionToOrder(null);
        }}
        labPrescription={labPrescriptionToOrder}
      />

      {/* Lab Reports Modal */}
      <LabReportsModal
        isOpen={isReportsModalOpen}
        onClose={() => {
          setIsReportsModalOpen(false);
          setLabPrescriptionForReports(null);
        }}
        labPrescription={labPrescriptionForReports}
        onNewOrder={(labPrescription) => {
          // Close reports modal and open order modal with the same lab prescription
          setIsReportsModalOpen(false);
          setLabPrescriptionToOrder(labPrescription);
          setIsOrderModalOpen(true);
        }}
      />

      {/* Payment Modal */}
      {isPaymentModalOpen && selectedOrderForPayment && (
        <PaymentModal
          order={selectedOrderForPayment}
          onClose={() => {
            setIsPaymentModalOpen(false);
            setSelectedOrderForPayment(null);
          }}
          onPaymentSuccess={() => {
            setIsPaymentModalOpen(false);
            setSelectedOrderForPayment(null);
            // Refresh lab orders after successful payment
            fetchActiveLabOrders();
            fetchCompletedLabOrders();
          }}
        />
      )}
    </div>
  );
};

export default LabResultsPage;
