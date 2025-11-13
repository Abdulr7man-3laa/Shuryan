import {
  FaPrescriptionBottleAlt,
  FaFlask,
  FaFileAlt,
  FaFileMedical,
  FaStopCircle,
  FaArrowRight,
} from 'react-icons/fa';

/**
 * Session Actions Component
 * Quick action buttons for session operations
 */
const SessionActions = ({
  onCreatePrescription,
  onRequestLabTest,
  onViewMedicalRecord,
  onAddDocumentation,
  onEndSession,
  onGoBack,
  loading,
  isCompleted = false,
}) => {
  const actions = [
    {
      id: 'prescription',
      label: 'كتابة روشتة',
      icon: FaPrescriptionBottleAlt,
      color: 'from-purple-500 to-indigo-500',
      hoverColor: 'hover:from-purple-600 hover:to-indigo-600',
      onClick: onCreatePrescription,
    },
    {
      id: 'lab-test',
      label: 'طلب تحليل',
      icon: FaFlask,
      color: 'from-blue-500 to-cyan-500',
      hoverColor: 'hover:from-blue-600 hover:to-cyan-600',
      onClick: onRequestLabTest,
    },
    {
      id: 'medical-record',
      label: 'السجل الطبي',
      icon: FaFileMedical,
      color: 'from-amber-500 to-orange-500',
      hoverColor: 'hover:from-amber-600 hover:to-orange-600',
      onClick: onViewMedicalRecord,
    },
    {
      id: 'documentation',
      label: 'توثيق الجلسة',
      icon: FaFileAlt,
      color: 'from-teal-500 to-emerald-500',
      hoverColor: 'hover:from-teal-600 hover:to-emerald-600',
      onClick: onAddDocumentation,
    },
  ];

  return (
    <div className="space-y-4">
      {/* Quick Actions Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              onClick={action.onClick}
              disabled={loading}
              className={`
                bg-gradient-to-br ${action.color} ${action.hoverColor}
                text-white rounded-xl p-6
                flex flex-col items-center gap-3
                transition-all duration-300
                hover:shadow-xl hover:scale-105
                disabled:opacity-50 disabled:cursor-not-allowed
                disabled:hover:scale-100
              `}
            >
              <Icon className="text-4xl" />
              <span className="font-bold text-sm">{action.label}</span>
            </button>
          );
        })}
      </div>

      {/* End Session or Go Back Button */}
      {isCompleted ? (
        // Go Back Button (for completed sessions)
        <button
          onClick={onGoBack}
          disabled={loading}
          className="
            w-full bg-gradient-to-r from-slate-500 to-slate-600
            hover:from-slate-600 hover:to-slate-700
            text-white font-bold py-4 px-6 rounded-xl
            flex items-center justify-center gap-3
            transition-all duration-300
            hover:shadow-xl
            disabled:opacity-50 disabled:cursor-not-allowed
          "
        >
          <FaArrowRight className="text-2xl" />
          <span className="text-lg">رجوع للمواعيد</span>
        </button>
      ) : (
        // End Session Button (for active sessions)
        <button
          onClick={onEndSession}
          disabled={loading}
          className="
            w-full bg-gradient-to-r from-red-500 to-rose-500
            hover:from-red-600 hover:to-rose-600
            text-white font-bold py-4 px-6 rounded-xl
            flex items-center justify-center gap-3
            transition-all duration-300
            hover:shadow-xl
            disabled:opacity-50 disabled:cursor-not-allowed
          "
        >
          <FaStopCircle className="text-2xl" />
          <span className="text-lg">إنهاء الجلسة</span>
        </button>
      )}
    </div>
  );
};

export default SessionActions;
