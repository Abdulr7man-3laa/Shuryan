import React, { useState } from 'react';
import { usePatientProfile } from '../../hooks/usePatientProfile';
import {
  FaFileMedical,
  FaAllergies,
  FaHeartbeat,
  FaPills,
  FaProcedures,
  FaPlus,
  FaTrash,
  FaExclamationTriangle,
} from 'react-icons/fa';

/**
 * Medical Record Section Component
 * 
 * Displays and manages patient medical record:
 * - Drug allergies
 * - Chronic diseases
 * - Current medications
 * - Previous surgeries
 */
const MedicalRecordSection = () => {
  const {
    medicalRecord,
    loading,
    error,
    updateMedicalRecord,
  } = usePatientProfile({ autoFetch: false }); // Fetched by parent

  // Form states
  const [showAllergyForm, setShowAllergyForm] = useState(false);
  const [showDiseaseForm, setShowDiseaseForm] = useState(false);
  const [showMedicationForm, setShowMedicationForm] = useState(false);
  const [showSurgeryForm, setShowSurgeryForm] = useState(false);

  const [allergyForm, setAllergyForm] = useState('');
  const [diseaseForm, setDiseaseForm] = useState('');
  const [medicationForm, setMedicationForm] = useState('');
  const [surgeryForm, setSurgeryForm] = useState('');

  // Handle add drug allergy
  const handleAddAllergy = async () => {
    if (!allergyForm.trim()) {
      alert('يرجى إدخال اسم الدواء');
      return;
    }

    // Get current allergies and add new one (without id = new item)
    const currentAllergies = medicalRecord?.drugAllergies || [];
    const updatedAllergies = [...currentAllergies, { drugName: allergyForm }];

    const result = await updateMedicalRecord({ drugAllergies: updatedAllergies });
    if (result.success) {
      setAllergyForm('');
      setShowAllergyForm(false);
    }
  };

  // Handle delete drug allergy
  const handleDeleteAllergy = async (allergyId) => {
    // Filter out the deleted item
    const updatedAllergies = (medicalRecord?.drugAllergies || []).filter(
      (item) => item.id !== allergyId
    );

    await updateMedicalRecord({ drugAllergies: updatedAllergies });
  };

  // Handle add chronic disease
  const handleAddDisease = async () => {
    if (!diseaseForm.trim()) {
      alert('يرجى إدخال اسم المرض');
      return;
    }

    const currentDiseases = medicalRecord?.chronicDiseases || [];
    const updatedDiseases = [...currentDiseases, { diseaseName: diseaseForm }];

    const result = await updateMedicalRecord({ chronicDiseases: updatedDiseases });
    if (result.success) {
      setDiseaseForm('');
      setShowDiseaseForm(false);
    }
  };

  // Handle delete chronic disease
  const handleDeleteDisease = async (diseaseId) => {
    const updatedDiseases = (medicalRecord?.chronicDiseases || []).filter(
      (item) => item.id !== diseaseId
    );

    await updateMedicalRecord({ chronicDiseases: updatedDiseases });
  };

  // Handle add current medication
  const handleAddMedication = async () => {
    if (!medicationForm.trim()) {
      alert('يرجى إدخال اسم الدواء');
      return;
    }

    const currentMedications = medicalRecord?.currentMedications || [];
    const updatedMedications = [...currentMedications, { medicationName: medicationForm }];

    const result = await updateMedicalRecord({ currentMedications: updatedMedications });
    if (result.success) {
      setMedicationForm('');
      setShowMedicationForm(false);
    }
  };

  // Handle delete current medication
  const handleDeleteMedication = async (medicationId) => {
    const updatedMedications = (medicalRecord?.currentMedications || []).filter(
      (item) => item.id !== medicationId
    );

    await updateMedicalRecord({ currentMedications: updatedMedications });
  };

  // Handle add previous surgery
  const handleAddSurgery = async () => {
    if (!surgeryForm.trim()) {
      alert('يرجى إدخال اسم العملية');
      return;
    }

    const currentSurgeries = medicalRecord?.previousSurgeries || [];
    const updatedSurgeries = [...currentSurgeries, { surgeryName: surgeryForm }];

    const result = await updateMedicalRecord({ previousSurgeries: updatedSurgeries });
    if (result.success) {
      setSurgeryForm('');
      setShowSurgeryForm(false);
    }
  };

  // Handle delete previous surgery
  const handleDeleteSurgery = async (surgeryId) => {
    const updatedSurgeries = (medicalRecord?.previousSurgeries || []).filter(
      (item) => item.id !== surgeryId
    );

    await updateMedicalRecord({ previousSurgeries: updatedSurgeries });
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Section Header */}
      <div className="bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 p-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <FaFileMedical className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white mb-1">الملف الطبي</h3>
            <p className="text-rose-100">
              السجل الطبي والمعلومات الصحية المهمة
            </p>
          </div>
        </div>
      </div>

      <div className="p-8 space-y-6">
        {/* Loading State */}
        {loading.medicalRecord && (
          <div className="flex justify-center py-12">
            <div className="w-12 h-12 border-4 border-rose-200 border-t-rose-600 rounded-full animate-spin"></div>
          </div>
        )}

        {/* Error State */}
        {error.medicalRecord && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700 font-medium flex items-center gap-2">
              <FaExclamationTriangle className="w-4 h-4" />
              حدث خطأ في تحميل الملف الطبي: {error.medicalRecord}
            </p>
          </div>
        )}

        {/* Medical Record Content */}
        {!loading.medicalRecord && (
          <>
            {/* Drug Allergies */}
            <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <FaAllergies className="w-5 h-5 text-red-600" />
                  <h4 className="text-lg font-semibold text-slate-800">
                    الحساسية من الأدوية
                  </h4>
                </div>
                <button
                  onClick={() => setShowAllergyForm(!showAllergyForm)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all flex items-center gap-2 text-sm font-medium"
                >
                  <FaPlus className="w-3 h-3" />
                  إضافة حساسية
                </button>
              </div>

              {/* Add Allergy Form */}
              {showAllergyForm && (
                <div className="mb-4 p-4 bg-white rounded-lg border border-red-200">
                  <input
                    type="text"
                    value={allergyForm}
                    onChange={(e) => setAllergyForm(e.target.value)}
                    placeholder="اسم الدواء *"
                    className="w-full px-4 py-2 border border-red-300 rounded-lg focus:border-red-500 focus:ring-2 focus:ring-red-200 mb-3"
                  />
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleAddAllergy}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all text-sm font-medium"
                    >
                      حفظ
                    </button>
                    <button
                      onClick={() => {
                        setShowAllergyForm(false);
                        setAllergyForm('');
                      }}
                      className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg transition-all text-sm font-medium"
                    >
                      إلغاء
                    </button>
                  </div>
                </div>
              )}

              {/* Allergies List */}
              {medicalRecord?.drugAllergies && medicalRecord.drugAllergies.length > 0 ? (
                <div className="space-y-2">
                  {medicalRecord.drugAllergies.map((allergy) => (
                    <div
                      key={allergy.id}
                      className="flex items-center justify-between p-4 bg-white rounded-lg border border-red-200"
                    >
                      <div className="flex-1">
                        <p className="font-semibold text-slate-800">{allergy.drugName}</p>
                        <p className="text-xs text-slate-500 mt-1">
                          {formatDate(allergy.createdAt)}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteAllergy(allergy.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <FaTrash className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-slate-500 py-6">لا توجد حساسية مسجلة</p>
              )}
            </div>

            {/* Chronic Diseases */}
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <FaHeartbeat className="w-5 h-5 text-orange-600" />
                  <h4 className="text-lg font-semibold text-slate-800">
                    الأمراض المزمنة
                  </h4>
                </div>
                <button
                  onClick={() => setShowDiseaseForm(!showDiseaseForm)}
                  className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-all flex items-center gap-2 text-sm font-medium"
                >
                  <FaPlus className="w-3 h-3" />
                  إضافة مرض
                </button>
              </div>

              {/* Add Disease Form */}
              {showDiseaseForm && (
                <div className="mb-4 p-4 bg-white rounded-lg border border-orange-200">
                  <input
                    type="text"
                    value={diseaseForm}
                    onChange={(e) => setDiseaseForm(e.target.value)}
                    placeholder="اسم المرض *"
                    className="w-full px-4 py-2 border border-orange-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 mb-3"
                  />
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleAddDisease}
                      className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-all text-sm font-medium"
                    >
                      حفظ
                    </button>
                    <button
                      onClick={() => {
                        setShowDiseaseForm(false);
                        setDiseaseForm('');
                      }}
                      className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg transition-all text-sm font-medium"
                    >
                      إلغاء
                    </button>
                  </div>
                </div>
              )}

              {/* Diseases List */}
              {medicalRecord?.chronicDiseases && medicalRecord.chronicDiseases.length > 0 ? (
                <div className="space-y-2">
                  {medicalRecord.chronicDiseases.map((disease) => (
                    <div
                      key={disease.id}
                      className="flex items-center justify-between p-4 bg-white rounded-lg border border-orange-200"
                    >
                      <div className="flex-1">
                        <p className="font-semibold text-slate-800">{disease.diseaseName}</p>
                        <p className="text-xs text-slate-500 mt-1">
                          {formatDate(disease.createdAt)}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteDisease(disease.id)}
                        className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-all"
                      >
                        <FaTrash className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-slate-500 py-6">لا توجد أمراض مزمنة مسجلة</p>
              )}
            </div>

            {/* Current Medications */}
            <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <FaPills className="w-5 h-5 text-teal-600" />
                  <h4 className="text-lg font-semibold text-slate-800">
                    الأدوية الحالية
                  </h4>
                </div>
                <button
                  onClick={() => setShowMedicationForm(!showMedicationForm)}
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-all flex items-center gap-2 text-sm font-medium"
                >
                  <FaPlus className="w-3 h-3" />
                  إضافة دواء
                </button>
              </div>

              {/* Add Medication Form */}
              {showMedicationForm && (
                <div className="mb-4 p-4 bg-white rounded-lg border border-teal-200">
                  <input
                    type="text"
                    value={medicationForm}
                    onChange={(e) => setMedicationForm(e.target.value)}
                    placeholder="اسم الدواء *"
                    className="w-full px-4 py-2 border border-teal-300 rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-200 mb-3"
                  />
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleAddMedication}
                      className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-all text-sm font-medium"
                    >
                      حفظ
                    </button>
                    <button
                      onClick={() => {
                        setShowMedicationForm(false);
                        setMedicationForm('');
                      }}
                      className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg transition-all text-sm font-medium"
                    >
                      إلغاء
                    </button>
                  </div>
                </div>
              )}

              {/* Medications List */}
              {medicalRecord?.currentMedications && medicalRecord.currentMedications.length > 0 ? (
                <div className="space-y-2">
                  {medicalRecord.currentMedications.map((medication) => (
                    <div
                      key={medication.id}
                      className="flex items-center justify-between p-4 bg-white rounded-lg border border-teal-200"
                    >
                      <div className="flex-1">
                        <p className="font-semibold text-slate-800">{medication.medicationName}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteMedication(medication.id)}
                        className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-all"
                      >
                        <FaTrash className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-slate-500 py-6">لا توجد أدوية حالية مسجلة</p>
              )}
            </div>

            {/* Previous Surgeries */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <FaProcedures className="w-5 h-5 text-indigo-600" />
                  <h4 className="text-lg font-semibold text-slate-800">
                    العمليات السابقة
                  </h4>
                </div>
                <button
                  onClick={() => setShowSurgeryForm(!showSurgeryForm)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all flex items-center gap-2 text-sm font-medium"
                >
                  <FaPlus className="w-3 h-3" />
                  إضافة عملية
                </button>
              </div>

              {/* Add Surgery Form */}
              {showSurgeryForm && (
                <div className="mb-4 p-4 bg-white rounded-lg border border-indigo-200">
                  <input
                    type="text"
                    value={surgeryForm}
                    onChange={(e) => setSurgeryForm(e.target.value)}
                    placeholder="اسم العملية *"
                    className="w-full px-4 py-2 border border-indigo-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 mb-3"
                  />
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleAddSurgery}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-all text-sm font-medium"
                    >
                      حفظ
                    </button>
                    <button
                      onClick={() => {
                        setShowSurgeryForm(false);
                        setSurgeryForm('');
                      }}
                      className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg transition-all text-sm font-medium"
                    >
                      إلغاء
                    </button>
                  </div>
                </div>
              )}

              {/* Surgeries List */}
              {medicalRecord?.previousSurgeries && medicalRecord.previousSurgeries.length > 0 ? (
                <div className="space-y-2">
                  {medicalRecord.previousSurgeries.map((surgery) => (
                    <div
                      key={surgery.id}
                      className="flex items-center justify-between p-4 bg-white rounded-lg border border-indigo-200"
                    >
                      <div className="flex-1">
                        <p className="font-semibold text-slate-800">{surgery.surgeryName}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteSurgery(surgery.id)}
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                      >
                        <FaTrash className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-slate-500 py-6">لا توجد عمليات سابقة مسجلة</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MedicalRecordSection;
