import { FaNotesMedical, FaPrescriptionBottleAlt, FaCalendarAlt, FaAllergies, FaHeartbeat, FaProcedures } from 'react-icons/fa';

const MedicalRecordTab = ({ patientMedicalRecord, loading, onFetchMedicalRecord }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-slate-600 text-sm font-semibold">جاري تحميل السجل الطبي...</p>
        </div>
      </div>
    );
  }

  if (!patientMedicalRecord) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <FaNotesMedical className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-600 text-sm font-semibold mb-3">لا توجد سجلات طبية متاحة</p>
          <button
            onClick={onFetchMedicalRecord}
            className="px-5 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-white text-sm rounded-lg hover:shadow-md transition-all font-semibold"
          >
            تحميل السجل الطبي
          </button>
        </div>
      </div>
    );
  }

  const sections = [
    {
      title: 'الحساسية',
      data: patientMedicalRecord.drugAllergies,
      color: 'red',
      icon: FaAllergies,
      renderItem: (allergy) => (
        <div className="space-y-1">
          <p className="text-sm font-bold text-slate-800">{allergy.drugName}</p>
          <p className="text-xs text-slate-600">{allergy.reaction}</p>
          {allergy.createdAt && (
            <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-1">
              <FaCalendarAlt />
              <span>{new Date(allergy.createdAt).toLocaleDateString('ar-EG')}</span>
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'الأمراض المزمنة',
      data: patientMedicalRecord.chronicDiseases,
      color: 'orange',
      icon: FaHeartbeat,
      renderItem: (disease) => (
        <div className="space-y-1">
          <p className="text-sm font-bold text-slate-800">{disease.diseaseName}</p>
          {disease.createdAt && (
            <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-1">
              <FaCalendarAlt />
              <span>{new Date(disease.createdAt).toLocaleDateString('ar-EG')}</span>
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'الأدوية الحالية',
      data: patientMedicalRecord.currentMedications,
      color: 'teal',
      icon: FaPrescriptionBottleAlt,
      renderItem: (medication) => (
        <div className="space-y-1">
          <p className="text-sm font-bold text-slate-800">{medication.medicationName}</p>
          {medication.reason && (
            <p className="text-xs text-slate-500">السبب: {medication.reason}</p>
          )}
          {medication.startDate && (
            <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-1">
              <FaCalendarAlt />
              <span>بدء: {new Date(medication.startDate).toLocaleDateString('ar-EG')}</span>
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'العمليات السابقة',
      data: patientMedicalRecord.previousSurgeries,
      color: 'indigo',
      icon: FaProcedures,
      renderItem: (surgery) => (
        <div className="space-y-1">
          <p className="text-sm font-bold text-slate-800">{surgery.surgeryName}</p>
          {surgery.surgeryDate && (
            <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-1">
              <FaCalendarAlt />
              <span>{new Date(surgery.surgeryDate).toLocaleDateString('ar-EG')}</span>
            </div>
          )}
        </div>
      ),
    },
  ];

  const colorMap = {
    red: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      icon: 'text-red-500',
      badge: 'bg-red-100 text-red-700',
      hover: 'hover:border-red-300'
    },
    orange: {
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      icon: 'text-orange-500',
      badge: 'bg-orange-100 text-orange-700',
      hover: 'hover:border-orange-300'
    },
    teal: {
      bg: 'bg-teal-50',
      border: 'border-teal-200',
      icon: 'text-teal-500',
      badge: 'bg-teal-100 text-teal-700',
      hover: 'hover:border-teal-300'
    },
    indigo: {
      bg: 'bg-indigo-50',
      border: 'border-indigo-200',
      icon: 'text-indigo-500',
      badge: 'bg-indigo-100 text-indigo-700',
      hover: 'hover:border-indigo-300'
    }
  };

  return (
    <div className="h-full grid grid-cols-1 lg:grid-cols-2 gap-3">
      {sections.map((section) => {
        const Icon = section.icon;
        const colors = colorMap[section.color];
        
        return (
          <div key={section.title} className={`${colors.bg} rounded-lg border ${colors.border} overflow-hidden flex flex-col`}>
            <div className="px-3 py-2 border-b border-slate-200/50 flex items-center justify-between bg-white/50">
              <div className="flex items-center gap-2">
                <Icon className={`w-3.5 h-3.5 ${colors.icon}`} />
                <h4 className="text-sm font-bold text-slate-700">{section.title}</h4>
              </div>
              <span className={`text-xs font-bold ${colors.badge} px-2 py-0.5 rounded-full`}>
                {section.data?.length || 0}
              </span>
            </div>
            
            <div className="flex-1 overflow-y-auto p-2 space-y-1.5 max-h-[200px]">
              {section.data && section.data.length > 0 ? (
                section.data.map((item) => (
                  <div
                    key={item.id}
                    className={`bg-white rounded-lg p-2.5 border ${colors.border} ${colors.hover} transition-all`}
                  >
                    {section.renderItem(item)}
                  </div>
                ))
              ) : (
                <p className="text-slate-400 text-xs text-center py-6">لا توجد بيانات</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MedicalRecordTab;
