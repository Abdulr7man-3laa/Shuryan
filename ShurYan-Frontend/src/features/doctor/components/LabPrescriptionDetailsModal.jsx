import React from 'react';
import { FaTimes, FaFlask, FaInfoCircle } from 'react-icons/fa';

/**
 * LabPrescriptionDetailsModal Component - Placeholder
 * Modal for viewing detailed lab prescription information
 * Will be fully implemented when the details API endpoint is ready
 */
const LabPrescriptionDetailsModal = ({ isOpen, onClose, prescriptionId, patientId }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] overflow-y-auto" dir="rtl">
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
                    <div className="bg-gradient-to-r from-purple-500 to-indigo-600 px-6 py-5 rounded-t-2xl">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                                    <FaFlask className="text-white text-xl" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-white">تفاصيل التحليل</h2>
                                    <p className="text-white/90 text-sm font-medium">
                                        معرف الوصفة: {prescriptionId}
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
                    <div className="p-8">
                        {/* Placeholder Content */}
                        <div className="text-center py-16">
                            <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <FaInfoCircle className="text-purple-500 text-5xl" />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 mb-3">قريباً</h3>
                            <p className="text-base font-semibold text-slate-600 mb-6">
                                سيتم إضافة تفاصيل التحليل الكاملة قريباً
                            </p>

                            {/* Info Box */}
                            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-6 border-2 border-purple-200 max-w-md mx-auto">
                                <h4 className="text-sm font-bold text-purple-900 mb-3">معلومات التحليل</h4>
                                <div className="space-y-2 text-sm text-slate-700">
                                    <div className="flex items-center justify-between">
                                        <span className="font-semibold">معرف الوصفة:</span>
                                        <span className="text-xs font-mono bg-white px-2 py-1 rounded">{prescriptionId || 'غير محدد'}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="font-semibold">معرف المريض:</span>
                                        <span className="text-xs font-mono bg-white px-2 py-1 rounded">{patientId || 'غير محدد'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="bg-slate-50 px-6 py-4 rounded-b-2xl border-t-2 border-slate-200">
                        <button
                            onClick={onClose}
                            className="px-6 py-2.5 bg-white border-2 border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors font-semibold text-sm"
                        >
                            إغلاق
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LabPrescriptionDetailsModal;
