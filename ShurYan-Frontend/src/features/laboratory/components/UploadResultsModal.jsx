import React, { useState } from 'react';
import { FaTimes, FaFlask, FaCheckCircle, FaSave, FaClipboardCheck } from 'react-icons/fa';
import { submitTestResults } from '../../../api/services/laboratory.service';

/**
 * Upload Results Modal Component
 * Professional modal for entering laboratory test results digitally
 * @component
 */
const UploadResultsModal = ({ isOpen, onClose, orderDetails, onUploadSuccess }) => {
    const [submitting, setSubmitting] = useState(false);
    const [testResults, setTestResults] = useState({});

    if (!isOpen || !orderDetails) return null;

    // Handle field change for a specific test
    const handleFieldChange = (testId, field, value) => {
        setTestResults(prev => ({
            ...prev,
            [testId]: {
                ...prev[testId],
                [field]: value
            }
        }));
    };

    // Submit results
    const handleSubmit = async () => {
        const tests = orderDetails.tests || [];

        // Validate that all tests have result values
        const missingResults = tests.filter(test => {
            const testId = test.labTestId || test.id || test.testName;
            const result = testResults[testId];
            return !result?.resultValue || result.resultValue.trim() === '';
        });

        if (missingResults.length > 0) {
            alert(`يرجى إدخال نتائج لجميع التحاليل. التحاليل المتبقية: ${missingResults.length}`);
            return;
        }

        setSubmitting(true);

        try {
            // Prepare results data based on LabResult entity structure
            const resultsData = tests.map(test => {
                const testId = test.labTestId || test.id;
                const result = testResults[testId] || {};

                return {
                    labTestId: testId,
                    resultValue: result.resultValue || '',
                    referenceRange: result.referenceRange || null,
                    unit: result.unit || null,
                    notes: result.notes || null,
                    attachmentUrl: result.attachmentUrl || null
                };
            });

            // Submit results to backend
            await submitTestResults(orderDetails.id, resultsData);

            alert('✅ تم إرسال النتائج بنجاح');

            // Reset state
            setTestResults({});

            // Notify parent and close
            if (onUploadSuccess) {
                onUploadSuccess();
            }
            onClose();
        } catch (error) {
            console.error('❌ Error submitting results:', error);
            alert(error.response?.data?.message || 'حدث خطأ أثناء إرسال النتائج');
        } finally {
            setSubmitting(false);
        }
    };

    // Close handler
    const handleClose = () => {
        if (submitting) return;
        setTestResults({});
        onClose();
    };

    const tests = orderDetails.tests || [];

    // Count completed results
    const completedCount = tests.filter(test => {
        const testId = test.labTestId || test.id || test.testName;
        const result = testResults[testId];
        return result?.resultValue && result.resultValue.trim() !== '';
    }).length;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-slideUp">

                {/* Header */}
                <div className="flex-shrink-0 relative bg-gradient-to-br from-[#00b19f] via-[#00c4b0] to-[#00d4be] p-6">
                    <button
                        onClick={handleClose}
                        disabled={submitting}
                        className="absolute top-4 left-4 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all duration-200 hover:rotate-90 disabled:opacity-50"
                    >
                        <FaTimes className="text-white text-lg" />
                    </button>

                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center flex-shrink-0">
                            <FaClipboardCheck className="text-3xl text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-white">إدخال نتائج التحاليل</h2>
                            <p className="text-sm text-white/80 font-medium">طلب #{orderDetails.id?.substring(0, 8) || 'غير محدد'}</p>
                        </div>
                    </div>

                    {/* Patient & Progress Info Bar */}
                    <div className="bg-white rounded-xl p-4 shadow-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-slate-500 font-bold mb-1 uppercase">المريض</p>
                                <p className="text-lg font-black text-slate-800">{orderDetails.patientName || 'غير محدد'}</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="bg-slate-100 px-4 py-2 rounded-lg">
                                    <p className="text-xs text-slate-600 font-bold mb-1 uppercase">التقدم</p>
                                    <p className="text-lg font-black text-slate-800 text-center">
                                        {completedCount} / {tests.length}
                                    </p>
                                </div>
                                {completedCount === tests.length && tests.length > 0 && (
                                    <FaCheckCircle className="text-3xl text-emerald-500" />
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-5">
                    {tests.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="w-24 h-24 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
                                <FaFlask className="text-4xl text-slate-400" />
                            </div>
                            <p className="text-slate-500 font-medium">لا توجد تحاليل في هذا الطلب</p>
                        </div>
                    ) : (
                        tests.map((test, index) => {
                            const testId = test.labTestId || test.id || test.testName;
                            const testName = test.testName || test.name || test.labTestName || test.serviceName || 'تحليل غير محدد';
                            const result = testResults[testId] || {};
                            const isComplete = result.resultValue && result.resultValue.trim() !== '';

                            return (
                                <div
                                    key={testId || index}
                                    className={`bg-gradient-to-br from-slate-50 to-white rounded-2xl p-6 border-2 transition-all ${isComplete
                                            ? 'border-emerald-300 bg-emerald-50/30'
                                            : 'border-slate-200 hover:border-[#00b19f]/30'
                                        }`}
                                >
                                    {/* Test Header */}
                                    <div className="flex items-center gap-3 mb-5">
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0 ${isComplete
                                                ? 'bg-gradient-to-br from-emerald-500 to-teal-500 text-white'
                                                : 'bg-gradient-to-br from-[#00b19f] to-[#00d4be] text-white'
                                            }`}>
                                            {index + 1}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-lg font-black text-slate-800">{testName}</h4>
                                            {test.description && (
                                                <p className="text-xs text-slate-500 mt-1">{test.description}</p>
                                            )}
                                        </div>
                                        {isComplete && (
                                            <FaCheckCircle className="text-2xl text-emerald-500" />
                                        )}
                                    </div>

                                    {/* Input Fields Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                        {/* Result Value - Required */}
                                        <div className="md:col-span-2">
                                            <label className="block text-xs font-bold text-slate-700 mb-2 uppercase">
                                                النتيجة <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={result.resultValue || ''}
                                                onChange={(e) => handleFieldChange(testId, 'resultValue', e.target.value)}
                                                disabled={submitting}
                                                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00b19f] focus:border-transparent transition-all disabled:bg-slate-50 text-slate-800 font-semibold"
                                                placeholder="أدخل نتيجة التحليل..."
                                                required
                                            />
                                        </div>

                                        {/* Reference Range - Optional */}
                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 mb-2 uppercase">
                                                النطاق المرجعي
                                            </label>
                                            <input
                                                type="text"
                                                value={result.referenceRange || ''}
                                                onChange={(e) => handleFieldChange(testId, 'referenceRange', e.target.value)}
                                                disabled={submitting}
                                                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00b19f] focus:border-transparent transition-all disabled:bg-slate-50 text-sm"
                                                placeholder="مثال: 70-100"
                                            />
                                        </div>

                                        {/* Unit - Optional */}
                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 mb-2 uppercase">
                                                الوحدة
                                            </label>
                                            <input
                                                type="text"
                                                value={result.unit || ''}
                                                onChange={(e) => handleFieldChange(testId, 'unit', e.target.value)}
                                                disabled={submitting}
                                                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00b19f] focus:border-transparent transition-all disabled:bg-slate-50 text-sm"
                                                placeholder="مثال: mg/dL"
                                            />
                                        </div>

                                        {/* Attachment URL - Optional */}
                                        <div className="md:col-span-2">
                                            <label className="block text-xs font-bold text-slate-700 mb-2 uppercase">
                                                رابط المرفق (اختياري)
                                            </label>
                                            <input
                                                type="url"
                                                value={result.attachmentUrl || ''}
                                                onChange={(e) => handleFieldChange(testId, 'attachmentUrl', e.target.value)}
                                                disabled={submitting}
                                                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00b19f] focus:border-transparent transition-all disabled:bg-slate-50 text-sm"
                                                placeholder="https://..."
                                            />
                                        </div>

                                        {/* Notes - Optional */}
                                        <div className="md:col-span-2">
                                            <label className="block text-xs font-bold text-slate-700 mb-2 uppercase">
                                                ملاحظات
                                            </label>
                                            <textarea
                                                value={result.notes || ''}
                                                onChange={(e) => handleFieldChange(testId, 'notes', e.target.value)}
                                                disabled={submitting}
                                                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00b19f] focus:border-transparent transition-all resize-none disabled:bg-slate-50 text-sm"
                                                rows="2"
                                                placeholder="أي ملاحظات على النتيجة..."
                                            />
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Footer */}
                <div className="flex-shrink-0 border-t-2 border-slate-200 p-6 bg-slate-50">
                    <div className="flex gap-3">
                        <button
                            onClick={handleClose}
                            disabled={submitting}
                            className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold py-3.5 rounded-xl transition-all duration-200 disabled:opacity-50"
                        >
                            إلغاء
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={submitting || tests.length === 0 || completedCount !== tests.length}
                            className="flex-1 bg-gradient-to-r from-[#00b19f] to-[#00d4be] hover:from-[#00a08d] hover:to-[#00c4b0] text-white font-bold py-3.5 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {submitting ? (
                                <div className="flex items-center justify-center gap-2">
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>جاري الإرسال...</span>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center gap-2">
                                    <FaSave className="text-lg" />
                                    <span>حفظ وإرسال النتائج</span>
                                </div>
                            )}
                        </button>
                    </div>

                    {/* Validation Message */}
                    {tests.length > 0 && completedCount !== tests.length && (
                        <p className="text-center text-sm text-amber-600 mt-3 font-medium">
                            ⚠️ يجب إدخال نتائج لجميع التحاليل قبل الإرسال ({completedCount}/{tests.length})
                        </p>
                    )}
                </div>
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
        </div>
    );
};

export default UploadResultsModal;
