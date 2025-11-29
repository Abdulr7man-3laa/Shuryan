import { AnimatePresence } from 'framer-motion';
import { FaSave, FaStethoscope, FaHistory, FaUserMd, FaClipboardCheck, FaTasks } from 'react-icons/fa';

const DocumentationTab = ({ docForm, onDocFormChange, autoSaveStatus }) => {
  const fields = [
    {
      key: 'chiefComplaint',
      label: 'الشكوى الرئيسية',
      icon: FaStethoscope,
      placeholder: 'الإبلاغ عن درجة الحرارة وصداع...',
      rows: 2,
      color: 'teal'
    },
    {
      key: 'historyOfPresentIllness',
      label: 'تاريخ المرض الحالي',
      icon: FaHistory,
      placeholder: 'بدأت الأعراض منذ يومين، مع تفاقم تدريجي للشدة...',
      rows: 2,
      color: 'emerald'
    },
    {
      key: 'physicalExamination',
      label: 'الفحص الجسدي',
      icon: FaUserMd,
      placeholder: 'احتقان في الحلق، صوت صفير خفيف في الصدر...',
      rows: 2,
      color: 'cyan'
    },
    {
      key: 'diagnosis',
      label: 'التقييم والتشخيص',
      icon: FaClipboardCheck,
      placeholder: 'إنه بشكل حاد...',
      rows: 2,
      color: 'indigo'
    },
    {
      key: 'managementPlan',
      label: 'الخطة العلاجية',
      icon: FaTasks,
      placeholder: 'وصف دواء علاج موسع للشعب الهوائية، متابعة بعد 3 أيام...',
      rows: 2,
      color: 'purple'
    }
  ];

  const colorClasses = {
    teal: 'focus:border-teal-400 focus:ring-teal-100',
    emerald: 'focus:border-emerald-400 focus:ring-emerald-100',
    cyan: 'focus:border-cyan-400 focus:ring-cyan-100',
    indigo: 'focus:border-indigo-400 focus:ring-indigo-100',
    purple: 'focus:border-purple-400 focus:ring-purple-100'
  };

  const iconColorClasses = {
    teal: 'text-teal-500',
    emerald: 'text-emerald-500',
    cyan: 'text-cyan-500',
    indigo: 'text-indigo-500',
    purple: 'text-purple-500'
  };

  return (
    <div className="h-full flex flex-col">
      {/* Auto-save Status - Fixed at Top */}
      <AnimatePresence>
        {autoSaveStatus && (
          <div className="mb-4 flex justify-center animate-in fade-in slide-in-from-top-2 duration-200">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold shadow-sm backdrop-blur-sm transition-all ${
              autoSaveStatus === 'saving' 
                ? 'bg-blue-50/80 text-blue-600 border border-blue-200/50' 
                : 'bg-emerald-50/80 text-emerald-600 border border-emerald-200/50'
            }`}>
              {autoSaveStatus === 'saving' && (
                <>
                  <div className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-blue-600 border-t-transparent"></div>
                  <span>جاري الحفظ...</span>
                </>
              )}
              {autoSaveStatus === 'saved' && (
                <>
                  <FaSave className="text-emerald-600 w-3.5 h-3.5" />
                  <span>تم الحفظ تلقائياً</span>
                </>
              )}
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Form - 2 Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1">
        {fields.map((field) => {
          const Icon = field.icon;
          return (
            <div
              key={field.key}
              className="flex flex-col"
            >
              <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                <Icon className={`w-4 h-4 ${iconColorClasses[field.color]}`} />
                <span>{field.label}</span>
              </label>
              <textarea
                value={docForm[field.key]}
                onChange={(e) => onDocFormChange(field.key, e.target.value)}
                rows={field.rows}
                className={`w-full px-3 py-2.5 border border-slate-200 rounded-lg ${colorClasses[field.color]} focus:ring-2 transition-all resize-none text-sm leading-relaxed placeholder:text-slate-400`}
                placeholder={field.placeholder}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DocumentationTab;
