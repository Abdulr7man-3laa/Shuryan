import React, { useState, useEffect } from 'react';
import { respondToOrder, getServices } from '../../../api/services/laboratory.service';
import {
    FaTimes,
    FaFlask,
    FaUser,
    FaCalendarAlt,
    FaMapMarkerAlt,
    FaPhone,
    FaMoneyBillWave,
    FaClock,
    FaCheckCircle,
    FaIdCard,
    FaVenusMars,
    FaBirthdayCake,
    FaNotesMedical,
    FaExclamationTriangle
} from 'react-icons/fa';
import { LAB_ORDER_STATUS, LAB_STATUS_CONFIG } from '../constants/labConstants';

/**
 * Order Details Modal Component
 * Beautiful and organized modal to display laboratory order details
 * @component
 */
const OrderDetailsModal = ({ isOpen, onClose, orderDetails, loading }) => {
    const [responseLoading, setResponseLoading] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [showAcceptModal, setShowAcceptModal] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');
    const [responseNotes, setResponseNotes] = useState('');
    const [labServices, setLabServices] = useState([]);
    const [showMissingTestsModal, setShowMissingTestsModal] = useState(false);
    const [missingTestsList, setMissingTestsList] = useState([]);

    // Fetch lab services when modal opens
    useEffect(() => {
        const fetchLabServices = async () => {
            try {
                const services = await getServices();
                setLabServices(services);
            } catch (error) {
                console.error('Error fetching lab services:', error);
            }
        };

        if (isOpen) {
            fetchLabServices();
        }
    }, [isOpen]);

    // Reset state when modal opens
    React.useEffect(() => {
        if (isOpen && orderDetails) {
            setRejectionReason('');
            setResponseNotes('');
        }
    }, [isOpen, orderDetails]);

    if (!isOpen) return null;

    // Check if all tests in the order are available in lab services
    const checkTestsAvailability = () => {
        if (!orderDetails?.tests || !labServices || labServices.length === 0) {
            return { allAvailable: false, missingTests: [] };
        }

        const missingTests = [];

        orderDetails.tests.forEach(test => {
            // Try to match the test with lab services
            // The test might have: testName, name, labTestName, serviceName, or labTestId
            const testId = test.labTestId || test.id;
            const testName = test.testName || test.name || test.labTestName || test.serviceName;

            // Check if this test exists in lab services (available and isAvailable = true)
            const isInServices = labServices.some(service =>
                (service.labTestId === testId ||
                    service.testName === testName ||
                    service.labTestName === testName ||
                    service.name === testName) &&
                service.isAvailable === true
            );

            if (!isInServices) {
                missingTests.push(testName || 'تحليل غير معروف');
            }
        });

        return {
            allAvailable: missingTests.length === 0,
            missingTests
        };
    };

    const handleAcceptClick = () => {
        const { allAvailable, missingTests } = checkTestsAvailability();

        if (!allAvailable) {
            setMissingTestsList(missingTests);
            setShowMissingTestsModal(true);
            return;
        }

        setShowAcceptModal(true);
    };

    const handleReject = async () => {
        // if (!rejectionReason.trim()) {
        //     alert('يرجى إدخال سبب الرفض');
        //     return; 
        // }

        setResponseLoading(true);
        try {
            await respondToOrder(orderDetails.id, {
                accept: false,
                rejectionReason: rejectionReason,
                notes: responseNotes
            });
            alert('تم رفض الطلب بنجاح');
            setShowRejectModal(false);
            onClose();
        } catch (error) {
            console.error('Error rejecting order:', error);
            alert('حدث خطأ أثناء رفض الطلب');
        } finally {
            setResponseLoading(false);
        }
    };

    const handleAccept = async () => {
        setResponseLoading(true);
        try {
            await respondToOrder(orderDetails.id, {
                accept: true,
                rejectionReason: '',
                notes: responseNotes
            });
            alert('تم قبول الطلب بنجاح');
            setShowAcceptModal(false);
            onClose();
        } catch (error) {
            console.error('Error accepting order:', error);
            alert('حدث خطأ أثناء قبول الطلب');
        } finally {
            setResponseLoading(false);
        }
    };

    // Format date helper
    const formatDate = (dateString) => {
        if (!dateString) return 'غير محدد';
        const date = new Date(dateString);
        return date.toLocaleDateString('ar-EG', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Format currency
    const formatCurrency = (amount) => {
        if (!amount && amount !== 0) return 'غير محدد';
        return `${amount.toLocaleString()} ج.م`;
    };

    // Get status config
    // Get status config
    const getStatusConfig = (status) => {
        return LAB_STATUS_CONFIG[status] || { label: 'غير محدد', color: 'text-slate-700', bgColor: 'bg-slate-50', borderColor: 'border-slate-200' };
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-slideUp">

                {/* Loading State */}
                {loading && (
                    <div className="flex-1 flex items-center justify-center p-16">
                        <div className="text-center">
                            <div className="inline-block w-16 h-16 border-4 border-[#00b19f] border-t-transparent rounded-full animate-spin mb-4"></div>
                            <p className="text-slate-600 font-semibold text-lg">جاري تحميل تفاصيل الطلب...</p>
                        </div>
                    </div>
                )}

                {/* Content - Only show when loaded */}
                {!loading && orderDetails && (
                    <>
                        {/* Header - Fixed at Top */}
                        <div className="flex-shrink-0 relative bg-gradient-to-br from-[#00b19f] via-[#00c4b0] to-[#00d4be] p-6">
                            <button
                                onClick={onClose}
                                className="absolute top-4 left-4 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-200 hover:rotate-90"
                            >
                                <FaTimes className="text-white text-lg" />
                            </button>

                            {/* Header Section */}
                            <div className="flex items-center justify-between gap-4 mb-6">
                                {/* Right: Title & Icon */}
                                <div className="flex items-center gap-3">
                                    <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center flex-shrink-0">
                                        <FaFlask className="text-3xl text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black text-white">تفاصيل طلب التحاليل</h2>
                                        <p className="text-sm text-white/80 font-medium">رقم الطلب: #{orderDetails.id?.substring(0, 8) || 'غير محدد'}</p>
                                    </div>
                                </div>

                                {/* Left: Status Badge or Actions */}
                                <div className="ml-14 flex items-center gap-3">
                                    {orderDetails.status === LAB_ORDER_STATUS.NEW_REQUEST ? (
                                        <>
                                            <button
                                                onClick={handleAcceptClick}
                                                className="px-4 py-2 bg-white text-[#00b19f] font-bold rounded-xl hover:bg-slate-50 transition-colors shadow-lg"
                                            >
                                                قبول الطلب
                                            </button>
                                            <button
                                                onClick={() => setShowRejectModal(true)}
                                                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-colors shadow-lg"
                                            >
                                                رفض الطلب
                                            </button>
                                        </>
                                    ) : orderDetails.laboratoryOrderStatus && (
                                        <div className={`px-6 py-3 rounded-xl ${getStatusConfig(orderDetails.laboratoryOrderStatus).bgColor} ${getStatusConfig(orderDetails.laboratoryOrderStatus).borderColor} border-2`}>
                                            <div className="flex items-center gap-2">
                                                <FaCheckCircle className={getStatusConfig(orderDetails.laboratoryOrderStatus).color} />
                                                <span className={`text-sm font-bold ${getStatusConfig(orderDetails.laboratoryOrderStatus).color}`}>
                                                    {getStatusConfig(orderDetails.laboratoryOrderStatus).label}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Info Bar - Patient & Lab Info */}
                            <div className="bg-white rounded-xl p-5 shadow-lg">
                                <div className="grid grid-cols-2 gap-6">
                                    {/* Patient Info */}
                                    <div className="flex items-start gap-3">
                                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                                            <span className="text-2xl">👤</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs text-slate-500 font-bold mb-1 uppercase tracking-wide">المريض</p>
                                            <p className="text-lg font-black text-slate-800 truncate">{orderDetails.patientName || 'غير محدد'}</p>
                                            {orderDetails.patientPhone && (
                                                <div className="flex items-center gap-1 mt-1">
                                                    <FaPhone className="text-xs text-slate-400" />
                                                    <p className="text-xs text-slate-500">{orderDetails.patientPhone}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Date & Time */}
                                    <div className="flex items-start gap-3">
                                        <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                                            <span className="text-2xl">📅</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs text-slate-500 font-bold mb-1 uppercase tracking-wide">تاريخ الطلب</p>
                                            <p className="text-lg font-black text-slate-800">{formatDate(orderDetails.createdAt)}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">

                            {/* Patient Medical Information */}
                            {(orderDetails.patientAge || orderDetails.patientGender || orderDetails.medicalHistory) && (
                                <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-6 border-2 border-blue-100">
                                    <div className="flex items-center gap-2 mb-4">
                                        <FaNotesMedical className="text-blue-600 text-xl" />
                                        <h3 className="text-lg font-black text-slate-800">المعلومات الطبية</h3>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4">
                                        {orderDetails.patientAge && (
                                            <div className="bg-white rounded-xl p-4 border border-blue-100">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <FaBirthdayCake className="text-blue-500" />
                                                    <p className="text-xs text-slate-500 font-bold uppercase">العمر</p>
                                                </div>
                                                <p className="text-lg font-black text-slate-800">{orderDetails.patientAge} سنة</p>
                                            </div>
                                        )}
                                        {orderDetails.patientGender && (
                                            <div className="bg-white rounded-xl p-4 border border-blue-100">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <FaVenusMars className="text-blue-500" />
                                                    <p className="text-xs text-slate-500 font-bold uppercase">الجنس</p>
                                                </div>
                                                <p className="text-lg font-black text-slate-800">
                                                    {orderDetails.patientGender === 'Male' ? 'ذكر' : orderDetails.patientGender === 'Female' ? 'أنثى' : orderDetails.patientGender}
                                                </p>
                                            </div>
                                        )}
                                        {orderDetails.patientNationalId && (
                                            <div className="bg-white rounded-xl p-4 border border-blue-100">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <FaIdCard className="text-blue-500" />
                                                    <p className="text-xs text-slate-500 font-bold uppercase">الرقم القومي</p>
                                                </div>
                                                <p className="text-sm font-black text-slate-800 direction-ltr">{orderDetails.patientNationalId}</p>
                                            </div>
                                        )}
                                    </div>
                                    {orderDetails.medicalHistory && (
                                        <div className="mt-4 bg-white rounded-xl p-4 border border-blue-100">
                                            <p className="text-xs text-slate-500 font-bold mb-2 uppercase">التاريخ المرضي</p>
                                            <p className="text-sm text-slate-700 leading-relaxed">{orderDetails.medicalHistory}</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Laboratory Tests */}
                            {orderDetails.tests && orderDetails.tests.length > 0 && (
                                <div className="bg-gradient-to-br from-emerald-50 to-white rounded-2xl p-6 border-2 border-emerald-100">
                                    <div className="flex items-center gap-2 mb-4">
                                        <FaFlask className="text-emerald-600 text-xl" />
                                        <h3 className="text-lg font-black text-slate-800">التحاليل المطلوبة</h3>
                                        <span className="mr-auto bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                                            {orderDetails.tests.length} تحليل
                                        </span>
                                    </div>
                                    <div className="space-y-3">
                                        {orderDetails.tests.map((test, index) => (
                                            <div key={index} className="bg-white rounded-xl p-4 border border-emerald-100 hover:border-emerald-300 transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-emerald-600 text-white rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0">
                                                        {index + 1}
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className="text-base font-black text-slate-800">{test.testName || test.name || test.labTestName || test.serviceName || 'غير محدد'}</h4>
                                                        {test.description && (
                                                            <p className="text-sm text-slate-500 mt-1">{test.description}</p>
                                                        )}
                                                    </div>
                                                    {test.price && (
                                                        <div className="bg-emerald-50 px-4 py-2 rounded-lg border border-emerald-200">
                                                            <p className="text-sm font-black text-emerald-700">{formatCurrency(test.price)}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Order Information */}
                            <div className="grid grid-cols-2 gap-4">


                                {/* Total Amount */}
                                {orderDetails.totalAmount !== undefined && (
                                    <div className="bg-gradient-to-br from-rose-50 to-white rounded-xl p-5 border-2 border-rose-100">
                                        <div className="flex items-center gap-2 mb-3">
                                            <FaMoneyBillWave className="text-rose-600" />
                                            <h4 className="text-sm font-bold text-slate-600 uppercase">المبلغ الإجمالي</h4>
                                        </div>
                                        <p className="text-lg font-black text-slate-800">{formatCurrency(orderDetails.totalAmount)}</p>
                                    </div>
                                )}
                            </div>

                            {/* Address Information */}
                            {orderDetails.address && (
                                <div className="bg-gradient-to-br from-purple-50 to-white rounded-xl p-5 border-2 border-purple-100">
                                    <div className="flex items-center gap-2 mb-3">
                                        <FaMapMarkerAlt className="text-purple-600 text-lg" />
                                        <h4 className="text-sm font-bold text-slate-600 uppercase">عنوان التوصيل</h4>
                                    </div>
                                    <p className="text-base font-semibold text-slate-700 leading-relaxed">{orderDetails.address}</p>
                                </div>
                            )}

                            {/* Notes */}
                            {orderDetails.notes && (
                                <div className="bg-gradient-to-br from-slate-50 to-white rounded-xl p-5 border-2 border-slate-200">
                                    <div className="flex items-center gap-2 mb-3">
                                        <FaClock className="text-slate-600" />
                                        <h4 className="text-sm font-bold text-slate-600 uppercase">ملاحظات</h4>
                                    </div>
                                    <p className="text-base text-slate-700 leading-relaxed">{orderDetails.notes}</p>
                                </div>
                            )}
                        </div>

                        {/* Footer - Fixed at Bottom */}
                        <div className="flex-shrink-0 border-t-2 border-slate-200 p-6 bg-slate-50">
                            <button
                                onClick={onClose}
                                className="w-full bg-gradient-to-r from-[#00b19f] to-[#00d4be] hover:from-[#00a08d] hover:to-[#00c4b0] text-white font-bold py-3.5 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-[1.02]"
                            >
                                إغلاق
                            </button>
                        </div>
                    </>
                )}
            </div>

            <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
        .animate-slideUp { animation: slideUp 0.3s ease-out; }
      `}</style>

            {/* Reject Modal */}
            {showRejectModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-slideUp">
                        <h3 className="text-xl font-bold text-slate-800 mb-4">رفض الطلب</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">سبب الرفض (اختياري)</label>
                                <textarea
                                    value={rejectionReason}
                                    onChange={(e) => setRejectionReason(e.target.value)}
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all resize-none"
                                    rows="3"
                                    placeholder="اكتب سبب الرفض هنا..."
                                ></textarea>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">ملاحظات إضافية (اختياري)</label>
                                <textarea
                                    value={responseNotes}
                                    onChange={(e) => setResponseNotes(e.target.value)}
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent transition-all resize-none"
                                    rows="2"
                                    placeholder="أي ملاحظات أخرى..."
                                ></textarea>
                            </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setShowRejectModal(false)}
                                className="flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-all"
                            >
                                إلغاء
                            </button>
                            <button
                                onClick={handleReject}
                                disabled={responseLoading}
                                className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-all disabled:opacity-50"
                            >
                                {responseLoading ? 'جاري الرفض...' : 'تأكيد الرفض'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Accept Modal */}
            {showAcceptModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-slideUp">
                        <h3 className="text-xl font-bold text-slate-800 mb-4">قبول الطلب</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">ملاحظات (اختياري)</label>
                                <textarea
                                    value={responseNotes}
                                    onChange={(e) => setResponseNotes(e.target.value)}
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00b19f] focus:border-transparent transition-all resize-none"
                                    rows="3"
                                    placeholder="أي ملاحظات للمريض..."
                                ></textarea>
                            </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setShowAcceptModal(false)}
                                className="flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-all"
                            >
                                إلغاء
                            </button>
                            <button
                                onClick={handleAccept}
                                disabled={responseLoading}
                                className="flex-1 px-4 py-2 bg-[#00b19f] hover:bg-[#00a08d] text-white font-semibold rounded-xl transition-all disabled:opacity-50"
                            >
                                {responseLoading ? 'جاري القبول...' : 'تأكيد القبول'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Missing Tests Warning Modal */}
            {showMissingTestsModal && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-slideUp">
                        <div className="text-center mb-4">
                            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FaExclamationTriangle className="text-3xl text-amber-600" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-2">لا يمكن قبول الطلب</h3>
                            <p className="text-sm text-slate-600">التحاليل التالية غير متوفرة في خدمات المعمل أو غير متاحة:</p>
                        </div>

                        <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4 mb-4 max-h-60 overflow-y-auto">
                            <ul className="space-y-2">
                                {missingTestsList.map((test, index) => (
                                    <li key={index} className="flex items-start gap-2">
                                        <span className="text-amber-600 mt-1">•</span>
                                        <span className="text-slate-700 font-semibold flex-1">{test}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-4">
                            <p className="text-xs text-blue-800 text-center">
                                💡 يرجى إضافة هذه التحاليل إلى صفحة الخدمات أولاً قبل قبول الطلب
                            </p>
                        </div>

                        <button
                            onClick={() => setShowMissingTestsModal(false)}
                            className="w-full px-4 py-3 bg-[#00b19f] hover:bg-[#00a08d] text-white font-bold rounded-xl transition-all"
                        >
                            حسناً، فهمت
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderDetailsModal;
