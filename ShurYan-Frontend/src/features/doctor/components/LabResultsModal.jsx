import React, { useState, useEffect } from 'react';
import { 
  FaTimes, FaFlask, FaPrint, FaCalendarAlt,
  FaUser, FaFileAlt, FaCheckCircle, FaExclamationTriangle,
  FaArrowUp, FaArrowDown, FaMinus
} from 'react-icons/fa';

/**
 * LabResultsModal Component - Premium Design
 * Modal for viewing patient lab test results
 */
const LabResultsModal = ({ isOpen, onClose, patient }) => {
  const [labResults, setLabResults] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch lab results data
  useEffect(() => {
    if (isOpen && patient) {
      fetchLabResults();
    }
  }, [isOpen, patient]);

  const fetchLabResults = async () => {
    setLoading(true);
    // Simulate API call - Replace with real API
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock lab results data
    setLabResults({
      id: 1,
      testDate: '2025-10-27',
      labName: 'مختبر الشفاء الطبي',
      reportNumber: 'LAB-2025-001234',
      tests: [
        {
          id: 1,
          category: 'تحليل الدم الكامل (CBC)',
          items: [
            { name: 'كريات الدم البيضاء (WBC)', value: '7.5', unit: '10³/µL', normalRange: '4.0-11.0', status: 'normal' },
            { name: 'كريات الدم الحمراء (RBC)', value: '5.2', unit: '10⁶/µL', normalRange: '4.5-5.9', status: 'normal' },
            { name: 'الهيموجلوبين (Hb)', value: '14.5', unit: 'g/dL', normalRange: '13.0-17.0', status: 'normal' },
            { name: 'الصفائح الدموية', value: '250', unit: '10³/µL', normalRange: '150-400', status: 'normal' }
          ]
        },
        {
          id: 2,
          category: 'وظائف الكلى',
          items: [
            { name: 'الكرياتينين', value: '1.1', unit: 'mg/dL', normalRange: '0.7-1.3', status: 'normal' },
            { name: 'اليوريا', value: '35', unit: 'mg/dL', normalRange: '15-40', status: 'normal' },
            { name: 'حمض اليوريك', value: '6.8', unit: 'mg/dL', normalRange: '3.5-7.2', status: 'normal' }
          ]
        },
        {
          id: 3,
          category: 'وظائف الكبد',
          items: [
            { name: 'ALT (SGPT)', value: '42', unit: 'U/L', normalRange: '7-56', status: 'normal' },
            { name: 'AST (SGOT)', value: '38', unit: 'U/L', normalRange: '10-40', status: 'normal' },
            { name: 'البيليروبين الكلي', value: '0.9', unit: 'mg/dL', normalRange: '0.3-1.2', status: 'normal' }
          ]
        },
        {
          id: 4,
          category: 'سكر الدم والدهون',
          items: [
            { name: 'سكر الدم الصائم', value: '105', unit: 'mg/dL', normalRange: '70-100', status: 'high' },
            { name: 'الكوليسترول الكلي', value: '195', unit: 'mg/dL', normalRange: '<200', status: 'normal' },
            { name: 'الدهون الثلاثية', value: '145', unit: 'mg/dL', normalRange: '<150', status: 'normal' },
            { name: 'HDL (الجيد)', value: '48', unit: 'mg/dL', normalRange: '>40', status: 'normal' },
            { name: 'LDL (الضار)', value: '118', unit: 'mg/dL', normalRange: '<130', status: 'normal' }
          ]
        }
      ],
      notes: 'نتائج التحاليل جيدة بشكل عام. يُنصح بمتابعة مستوى السكر في الدم والالتزام بنظام غذائي صحي.'
    });
    setLoading(false);
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const badges = {
      normal: {
        icon: FaCheckCircle,
        text: 'طبيعي',
        bg: 'bg-emerald-50',
        border: 'border-emerald-200',
        text_color: 'text-emerald-700',
        icon_color: 'text-emerald-500'
      },
      high: {
        icon: FaArrowUp,
        text: 'مرتفع',
        bg: 'bg-red-50',
        border: 'border-red-200',
        text_color: 'text-red-700',
        icon_color: 'text-red-500'
      },
      low: {
        icon: FaArrowDown,
        text: 'منخفض',
        bg: 'bg-orange-50',
        border: 'border-orange-200',
        text_color: 'text-orange-700',
        icon_color: 'text-orange-500'
      }
    };
    return badges[status] || badges.normal;
  };

  // Handle print
  const handlePrint = () => {
    window.print();
  };

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
          className="relative bg-white rounded-2xl shadow-2xl w-full max-w-5xl transform transition-all"
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
                  <h2 className="text-2xl font-black text-white">نتائج التحاليل</h2>
                  <p className="text-white/90 text-sm font-medium">
                    {patient?.fullName || 'مريض'}
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
          <div className="p-6 max-h-[calc(100vh-250px)] overflow-y-auto">
            {loading ? (
              /* Loading State */
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-slate-600 font-medium">جاري تحميل نتائج التحاليل...</p>
                </div>
              </div>
            ) : !labResults ? (
              /* No Results State */
              <div className="text-center py-20">
                <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaFileAlt className="text-slate-400 text-4xl" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">لا توجد نتائج</h3>
                <p className="text-slate-600 font-medium">لم يتم إرسال نتائج تحاليل لهذا المريض بعد</p>
              </div>
            ) : (
              <>
                {/* Lab Info - Premium Design */}
                <div className="relative bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl p-6 mb-6 shadow-xl overflow-hidden">
                  {/* Decorative elements */}
                  <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                  
                  <div className="relative grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
                        <FaCalendarAlt className="text-white text-lg" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-white/80">تاريخ التحليل</p>
                        <p className="text-base font-black text-white">{labResults.testDate}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
                        <FaFlask className="text-white text-lg" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-white/80">المختبر</p>
                        <p className="text-base font-black text-white">{labResults.labName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
                        <FaFileAlt className="text-white text-lg" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-white/80">رقم التقرير</p>
                        <p className="text-base font-black text-white">{labResults.reportNumber}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Test Categories */}
                <div className="space-y-6">
                  {labResults.tests.map((category) => (
                    <div key={category.id} className="bg-white rounded-2xl border-2 border-slate-200 overflow-hidden shadow-sm">
                      {/* Category Header */}
                      <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-6 py-4 border-b-2 border-slate-200">
                        <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          {category.category}
                        </h3>
                      </div>

                      {/* Test Items */}
                      <div className="p-4">
                        <div className="space-y-3">
                          {category.items.map((item, index) => {
                            const statusBadge = getStatusBadge(item.status);
                            const StatusIcon = statusBadge.icon;

                            return (
                              <div 
                                key={index}
                                className="group bg-gradient-to-br from-white to-slate-50 rounded-xl p-4 border-2 border-slate-200 hover:border-purple-300 transition-all duration-200"
                              >
                                <div className="flex items-center justify-between gap-4">
                                  {/* Test Name */}
                                  <div className="flex-1">
                                    <h4 className="text-sm font-bold text-slate-900 mb-1">{item.name}</h4>
                                    <p className="text-xs font-medium text-slate-500">المعدل الطبيعي: {item.normalRange}</p>
                                  </div>

                                  {/* Value */}
                                  <div className="flex items-center gap-3">
                                    <div className="text-right">
                                      <p className="text-2xl font-black text-slate-900">{item.value}</p>
                                      <p className="text-xs font-semibold text-slate-500">{item.unit}</p>
                                    </div>

                                    {/* Status Badge */}
                                    <div className={`flex items-center gap-2 px-3 py-2 ${statusBadge.bg} ${statusBadge.border} border-2 rounded-lg`}>
                                      <StatusIcon className={`${statusBadge.icon_color} text-sm`} />
                                      <span className={`text-xs font-bold ${statusBadge.text_color}`}>{statusBadge.text}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Doctor Notes - Premium */}
                {labResults.notes && (
                  <div className="mt-6 relative bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-50 rounded-2xl p-6 border-2 border-blue-300 shadow-lg overflow-hidden">
                    {/* Decorative corner */}
                    <div className="absolute top-0 left-0 w-20 h-20 bg-blue-200/30 rounded-full blur-2xl"></div>
                    
                    <div className="relative">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-md">
                          <FaExclamationTriangle className="text-white text-lg" />
                        </div>
                        <h4 className="text-base font-black text-slate-900">ملاحظات وتوصيات</h4>
                      </div>
                      <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-blue-200">
                        <p className="text-sm font-semibold text-slate-800 leading-relaxed">
                          {labResults.notes}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer */}
          <div className="bg-slate-50 px-6 py-4 rounded-b-2xl border-t-2 border-slate-200">
            <div className="flex items-center justify-between gap-3">
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-white border-2 border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors font-semibold text-sm"
              >
                إغلاق
              </button>
              
              <button
                onClick={handlePrint}
                disabled={!labResults}
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl hover:from-purple-600 hover:to-indigo-700 transition-all font-bold text-sm shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaPrint />
                طباعة النتائج
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabResultsModal;
