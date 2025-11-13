import { useState } from 'react';
import { FaTimes, FaFlask, FaPlus, FaTrash } from 'react-icons/fa';

/**
 * Lab Test Form Modal
 * Request lab tests in session
 */
const LabTestForm = ({ isOpen, onClose, onSubmit, loading }) => {
  const [tests, setTests] = useState([
    {
      testName: '',
      testType: '',
      notes: '',
    },
  ]);

  if (!isOpen) return null;

  const handleAddTest = () => {
    setTests([
      ...tests,
      {
        testName: '',
        testType: '',
        notes: '',
      },
    ]);
  };

  const handleRemoveTest = (index) => {
    if (tests.length === 1) return;
    setTests(tests.filter((_, i) => i !== index));
  };

  const handleTestChange = (index, field, value) => {
    const updated = [...tests];
    updated[index][field] = value;
    setTests(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate
    const isValid = tests.every((test) => test.testName && test.testType);

    if (!isValid) {
      alert('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    onSubmit({ tests });

    // Reset form
    setTests([
      {
        testName: '',
        testType: '',
        notes: '',
      },
    ]);
  };

  // Common test types
  const testTypes = [
    'تحليل دم شامل',
    'تحليل بول',
    'تحليل براز',
    'وظائف كلى',
    'وظائف كبد',
    'سكر صائم',
    'سكر فاطر',
    'دهون ثلاثية',
    'كوليسترول',
    'هرمونات الغدة الدرقية',
    'فيتامين د',
    'أشعة سينية',
    'أشعة مقطعية',
    'رنين مغناطيسي',
    'موجات صوتية',
    'أخرى',
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <FaFlask className="text-2xl" />
            </div>
            <div>
              <h2 className="text-2xl font-black">طلب تحاليل طبية</h2>
              <p className="text-sm text-white/80">أضف التحاليل المطلوبة</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          <div className="space-y-6">
            {tests.map((test, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-xl p-6 relative"
              >
                {/* Remove Button */}
                {tests.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveTest(index)}
                    className="absolute top-4 left-4 w-8 h-8 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-colors"
                  >
                    <FaTrash className="text-sm" />
                  </button>
                )}

                <h3 className="text-lg font-bold text-blue-900 mb-4">
                  التحليل {index + 1}
                </h3>

                <div className="grid grid-cols-1 gap-4">
                  {/* Test Type */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      نوع التحليل <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={test.testType}
                      onChange={(e) => handleTestChange(index, 'testType', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:outline-none"
                      required
                    >
                      <option value="">اختر نوع التحليل</option>
                      {testTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Test Name */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      اسم التحليل التفصيلي <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={test.testName}
                      onChange={(e) => handleTestChange(index, 'testName', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:outline-none"
                      placeholder="مثال: CBC - Complete Blood Count"
                      required
                    />
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      ملاحظات إضافية
                    </label>
                    <textarea
                      value={test.notes}
                      onChange={(e) => handleTestChange(index, 'notes', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-blue-500 focus:outline-none resize-none"
                      rows="2"
                      placeholder="مثال: صائم 12 ساعة"
                    />
                  </div>
                </div>
              </div>
            ))}

            {/* Add Test Button */}
            <button
              type="button"
              onClick={handleAddTest}
              className="w-full bg-gradient-to-r from-blue-100 to-cyan-100 hover:from-blue-200 hover:to-cyan-200 text-blue-700 font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-all border-2 border-blue-300"
            >
              <FaPlus />
              <span>إضافة تحليل آخر</span>
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="bg-slate-50 p-6 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-white border-2 border-slate-300 text-slate-700 font-bold py-3 px-6 rounded-xl hover:bg-slate-50 transition-colors"
          >
            إلغاء
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold py-3 px-6 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'جاري الحفظ...' : 'إرسال الطلب'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LabTestForm;
