import React, { useEffect, useState, useCallback } from 'react';
import {
    FaTimes, FaFlask, FaCalendarAlt,
    FaUser, FaVial, FaExclamationCircle, FaHashtag,
    FaFileMedicalAlt, FaBuilding, FaCheckCircle, FaClipboardCheck
} from 'react-icons/fa';
import { formatDate } from '@/utils/helpers';
import patientService from '@/api/services/patient.service';

/**
 * LabOrderResultsModal Component
 * Modal for viewing detailed lab order results matching specific schema
 */
const LabOrderResultsModal = ({ isOpen, onClose, orderId }) => {
    const [resultData, setResultData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Load lab order results
    const loadResults = useCallback(async () => {
        if (!orderId) return;

        setLoading(true);
        setError(null);

        try {
            console.log('🔬 Loading lab order results:', orderId);
            const response = await patientService.getLabOrderResults(orderId);

            if (response.isSuccess && response.data) {
                setResultData(response.data);
            } else {
                setError(response.message || 'فشل في تحميل نتائج التحليل');
            }
        } catch (err) {
            console.error('❌ Error loading lab order results:', err);
            setError('حدث خطأ في تحميل النتائج');
        } finally {
            setLoading(false);
        }
    }, [orderId]);

    useEffect(() => {
        if (isOpen && orderId) {
            loadResults();
        }

        return () => {
            if (!isOpen) {
                setResultData(null);
                setError(null);
            }
        };
    }, [isOpen, orderId, loadResults]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto" dir="rtl">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal */}
            <div className="flex min-h-screen items-center justify-center p-4">
                <div
                    className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl transform transition-all"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-teal-500 to-emerald-600 px-6 py-5 rounded-t-2xl">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                                    <FaClipboardCheck className="text-white text-xl" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-white">نتيجة التحليل</h2>
                                    <p className="text-white/90 text-sm font-medium">
                                        {resultData?.laboratoryName || 'جاري التحميل...'}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-colors"
                            >
                                <FaTimes className="text-white text-lg" />
                            </button>
                        </div>
                    </div>

                    {/* Body */}
                    <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
                        {loading ? (
                            <div className="flex items-center justify-center py-20">
                                <div className="text-center">
                                    <div className="w-16 h-16 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin mx-auto mb-4"></div>
                                    <p className="text-slate-600 font-medium">جاري تحميل النتائج...</p>
                                </div>
                            </div>
                        ) : error ? (
                            <div className="text-center py-20">
                                <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FaExclamationCircle className="text-red-500 text-4xl" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-800 mb-2">حدث خطأ</h3>
                                <p className="text-slate-600 font-medium mb-4">{error}</p>
                                <button
                                    onClick={loadResults}
                                    className="px-6 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-600 text-white rounded-xl hover:from-teal-600 hover:to-emerald-700 transition-all font-bold text-sm shadow-lg"
                                >
                                    إعادة المحاولة
                                </button>
                            </div>
                        ) : !resultData ? (
                            <div className="text-center py-20">
                                <p className="text-slate-600 font-medium">لا توجد بيانات</p>
                            </div>
                        ) : (
                            <>
                                {/* Info Card */}
                                <div className="bg-slate-50 rounded-2xl p-6 mb-6 border border-slate-200">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Patient Name */}
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                                                <FaUser className="text-teal-600" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-semibold text-slate-500">اسم المريض</p>
                                                <p className="text-base font-bold text-slate-900">{resultData.patientName}</p>
                                            </div>
                                        </div>

                                        {/* Order Date */}
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                                                <FaCalendarAlt className="text-teal-600" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-semibold text-slate-500">تاريخ الطلب</p>
                                                <p className="text-base font-bold text-slate-900">{formatDate(resultData.orderDate)}</p>
                                            </div>
                                        </div>

                                        {/* Laboratory */}
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                                                <FaBuilding className="text-teal-600" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-semibold text-slate-500">المعمل</p>
                                                <p className="text-base font-bold text-slate-900">{resultData.laboratoryName}</p>
                                            </div>
                                        </div>

                                        {/* Status */}
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                                                <FaCheckCircle className="text-teal-600" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-semibold text-slate-500">الحالة</p>
                                                <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold mt-1">
                                                    {resultData.statusName}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Results List */}
                                <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
                                    <FaFlask className="text-teal-600" />
                                    نتائج التحاليل ({resultData.results?.length || 0})
                                </h3>

                                <div className="space-y-4">
                                    {resultData.results?.map((result, index) => (
                                        <div
                                            key={index}
                                            className={`rounded-xl border-2 p-5 transition-all ${result.isAbnormal
                                                ? 'bg-red-50 border-red-200'
                                                : 'bg-white border-slate-100 hover:border-teal-200'
                                                }`}
                                        >
                                            <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center mb-4">
                                                <div>
                                                    <h4 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                                                        {result.testName}
                                                        {result.category && (
                                                            <span className="text-xs font-normal px-2 py-1 bg-slate-100 rounded-full text-slate-600">
                                                                {result.category}
                                                            </span>
                                                        )}
                                                    </h4>
                                                    {result.testCode && (
                                                        <p className="text-xs text-slate-500 font-mono mt-1">Code: {result.testCode}</p>
                                                    )}
                                                </div>

                                                {result.isAbnormal && (
                                                    <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold flex items-center gap-1">
                                                        <FaExclamationCircle />
                                                        قيمة غير طبيعية
                                                    </span>
                                                )}
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white/50 rounded-lg p-4 mb-3">
                                                {/* Result Value */}
                                                <div>
                                                    <p className="text-xs font-semibold text-slate-500 mb-1">النتيجة</p>
                                                    <p className={`text-lg font-black text-right ${result.isAbnormal ? 'text-red-600' : 'text-slate-900'}`} dir="ltr">
                                                        {result.resultValue} <span className="text-sm font-medium text-slate-600">{result.unit}</span>
                                                    </p>
                                                </div>

                                                {/* Reference Range */}
                                                <div>
                                                    <p className="text-xs font-semibold text-slate-500 mb-1">المعدل الطبيعي</p>
                                                    <p className="text-sm font-bold text-slate-700 text-right" dir="ltr">
                                                        {result.referenceRange}
                                                    </p>
                                                </div>

                                                {/* Notes */}
                                                {result.notes && (
                                                    <div className="md:col-span-3 pt-3 border-t border-slate-200/50">
                                                        <p className="text-xs font-semibold text-slate-500 mb-1">ملاحظات</p>
                                                        <p className="text-sm text-slate-700">{result.notes}</p>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Attachment */}
                                            {result.attachmentUrl && (
                                                <div className="mt-3">
                                                    <a
                                                        href={result.attachmentUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-sm font-bold text-teal-600 hover:text-teal-700 hover:underline flex items-center gap-1"
                                                    >
                                                        <FaFileMedicalAlt />
                                                        عرض المرفق الأصلي
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="bg-slate-50 px-6 py-4 rounded-b-2xl border-t border-slate-200 text-center md:text-left">
                        <button
                            onClick={onClose}
                            className="w-full md:w-auto px-8 py-3 bg-slate-200 text-slate-700 rounded-xl hover:bg-slate-300 transition-all font-bold text-sm"
                        >
                            إغلاق
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LabOrderResultsModal;
