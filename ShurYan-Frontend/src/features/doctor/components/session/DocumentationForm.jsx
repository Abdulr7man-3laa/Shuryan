import { useState } from 'react';
import { FaTimes, FaFileAlt } from 'react-icons/fa';

/**
 * Documentation Form Modal
 * Add session documentation
 */
const DocumentationForm = ({ isOpen, onClose, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    chiefComplaint: '',
    historyOfPresentIllness: '',
    physicalExamination: '',
    diagnosis: '',
    managementPlan: '',
  });

  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.chiefComplaint || !formData.diagnosis) {
      alert('يرجى ملء الحقول المطلوبة (الشكوى الرئيسية والتشخيص)');
      return;
    }

    onSubmit(formData);

    // Reset form
    setFormData({
      chiefComplaint: '',
      historyOfPresentIllness: '',
      physicalExamination: '',
      diagnosis: '',
      managementPlan: '',
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <FaFileAlt className="text-2xl" />
            </div>
            <div>
              <h2 className="text-2xl font-black">توثيق الجلسة</h2>
              <p className="text-sm text-white/80">سجل تفاصيل الكشف الطبي</p>
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
            {/* Chief Complaint */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                الشكوى الرئيسية <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.chiefComplaint}
                onChange={(e) => handleChange('chiefComplaint', e.target.value)}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-teal-500 focus:outline-none resize-none"
                rows="3"
                placeholder="ما هي الشكوى الرئيسية للمريض؟"
                required
              />
            </div>

            {/* History of Present Illness */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                تاريخ المرض الحالي
              </label>
              <textarea
                value={formData.historyOfPresentIllness}
                onChange={(e) => handleChange('historyOfPresentIllness', e.target.value)}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-teal-500 focus:outline-none resize-none"
                rows="4"
                placeholder="متى بدأت الأعراض؟ كيف تطورت؟ ما هي العوامل المؤثرة؟"
              />
            </div>

            {/* Physical Examination */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                الفحص السريري
              </label>
              <textarea
                value={formData.physicalExamination}
                onChange={(e) => handleChange('physicalExamination', e.target.value)}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-teal-500 focus:outline-none resize-none"
                rows="4"
                placeholder="نتائج الفحص السريري (الحرارة، الضغط، النبض، الفحص الموضعي...)"
              />
            </div>

            {/* Diagnosis */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                التشخيص <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.diagnosis}
                onChange={(e) => handleChange('diagnosis', e.target.value)}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-teal-500 focus:outline-none resize-none"
                rows="3"
                placeholder="ما هو التشخيص النهائي أو المبدئي؟"
                required
              />
            </div>

            {/* Management Plan */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                خطة العلاج
              </label>
              <textarea
                value={formData.managementPlan}
                onChange={(e) => handleChange('managementPlan', e.target.value)}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-teal-500 focus:outline-none resize-none"
                rows="4"
                placeholder="ما هي خطة العلاج والمتابعة؟"
              />
            </div>

            {/* Info Note */}
            <div className="bg-teal-50 border-2 border-teal-200 rounded-lg p-4">
              <p className="text-sm text-teal-800">
                <strong>ملاحظة:</strong> سيتم حفظ هذا التوثيق في السجل الطبي للمريض ويمكن
                الرجوع إليه في أي وقت.
              </p>
            </div>
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
            className="flex-1 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white font-bold py-3 px-6 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'جاري الحفظ...' : 'حفظ التوثيق'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentationForm;
