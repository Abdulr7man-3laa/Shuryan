import { useState } from 'react';
import { FaTimes, FaAllergies, FaPills, FaDisease, FaSyringe, FaSpinner } from 'react-icons/fa';

/**
 * Medical Record Viewer Modal
 * Displays patient's complete medical record
 */
const MedicalRecordViewer = ({ isOpen, onClose, medicalRecord, loading, onFetch }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <FaPills className="text-2xl" />
            </div>
            <div>
              <h2 className="text-2xl font-black">السجل الطبي الكامل</h2>
              <p className="text-sm text-white/80">
                {medicalRecord?.patientFullName || 'المريض'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <FaSpinner className="text-4xl text-teal-500 animate-spin" />
            </div>
          ) : !medicalRecord ? (
            <div className="text-center py-12">
              <p className="text-slate-400 mb-4">لم يتم تحميل السجل الطبي</p>
              <button
                onClick={onFetch}
                className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white px-6 py-3 rounded-lg font-bold hover:shadow-lg transition-all"
              >
                تحميل السجل الطبي
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Drug Allergies */}
              <Section
                title="الحساسية من الأدوية"
                icon={FaAllergies}
                color="red"
                items={medicalRecord.drugAllergies}
                emptyMessage="لا توجد حساسية مسجلة"
                renderItem={(allergy) => (
                  <div key={allergy.id} className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="font-bold text-red-900">{allergy.drugName}</p>
                    <p className="text-sm text-red-700 mt-1">{allergy.reaction}</p>
                    <p className="text-xs text-red-500 mt-2">
                      تاريخ التسجيل: {new Date(allergy.createdAt).toLocaleDateString('ar-EG')}
                    </p>
                  </div>
                )}
              />

              {/* Chronic Diseases */}
              <Section
                title="الأمراض المزمنة"
                icon={FaDisease}
                color="orange"
                items={medicalRecord.chronicDiseases}
                emptyMessage="لا توجد أمراض مزمنة مسجلة"
                renderItem={(disease) => (
                  <div key={disease.id} className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <p className="font-bold text-orange-900">{disease.diseaseName}</p>
                    <p className="text-xs text-orange-500 mt-2">
                      تاريخ التشخيص: {new Date(disease.createdAt).toLocaleDateString('ar-EG')}
                    </p>
                  </div>
                )}
              />

              {/* Current Medications */}
              <Section
                title="الأدوية الحالية"
                icon={FaPills}
                color="teal"
                items={medicalRecord.currentMedications}
                emptyMessage="لا توجد أدوية حالية"
                renderItem={(medication) => (
                  <div key={medication.id} className="bg-teal-50 border border-teal-200 rounded-lg p-4">
                    <p className="font-bold text-teal-900">{medication.medicationName}</p>
                    <div className="grid grid-cols-2 gap-2 mt-2 text-sm text-teal-700">
                      <p>الجرعة: {medication.dosage}</p>
                      <p>التكرار: {medication.frequency}</p>
                    </div>
                    {medication.reason && (
                      <p className="text-sm text-teal-600 mt-2">السبب: {medication.reason}</p>
                    )}
                    <p className="text-xs text-teal-500 mt-2">
                      تاريخ البدء: {new Date(medication.startDate).toLocaleDateString('ar-EG')}
                    </p>
                  </div>
                )}
              />

              {/* Previous Surgeries */}
              <Section
                title="العمليات الجراحية السابقة"
                icon={FaSyringe}
                color="indigo"
                items={medicalRecord.previousSurgeries}
                emptyMessage="لا توجد عمليات جراحية مسجلة"
                renderItem={(surgery) => (
                  <div key={surgery.id} className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                    <p className="font-bold text-indigo-900">{surgery.surgeryName}</p>
                    <p className="text-xs text-indigo-500 mt-2">
                      تاريخ العملية: {new Date(surgery.surgeryDate).toLocaleDateString('ar-EG')}
                    </p>
                  </div>
                )}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Section Component
const Section = ({ title, icon: Icon, color, items, emptyMessage, renderItem }) => {
  const colorClasses = {
    red: 'text-red-600',
    orange: 'text-orange-600',
    teal: 'text-teal-600',
    indigo: 'text-indigo-600',
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <Icon className={`text-xl ${colorClasses[color]}`} />
        <h3 className="text-lg font-bold text-slate-800">{title}</h3>
      </div>
      {items && items.length > 0 ? (
        <div className="space-y-3">{items.map(renderItem)}</div>
      ) : (
        <p className="text-slate-400 text-sm">{emptyMessage}</p>
      )}
    </div>
  );
};

export default MedicalRecordViewer;
