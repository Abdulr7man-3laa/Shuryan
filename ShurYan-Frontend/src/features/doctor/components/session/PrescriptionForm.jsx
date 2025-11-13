import { useState } from 'react';
import { FaTimes, FaPrescriptionBottleAlt, FaPlus, FaTrash } from 'react-icons/fa';

/**
 * Prescription Form Modal
 * Create new prescription in session
 */
const PrescriptionForm = ({ isOpen, onClose, onSubmit, loading }) => {
  const [medications, setMedications] = useState([
    {
      medicationName: '',
      dosage: '',
      frequency: '',
      durationDays: '',
      specialInstructions: '',
    },
  ]);

  if (!isOpen) return null;

  const handleAddMedication = () => {
    setMedications([
      ...medications,
      {
        medicationName: '',
        dosage: '',
        frequency: '',
        durationDays: '',
        specialInstructions: '',
      },
    ]);
  };

  const handleRemoveMedication = (index) => {
    if (medications.length === 1) return;
    setMedications(medications.filter((_, i) => i !== index));
  };

  const handleMedicationChange = (index, field, value) => {
    const updated = [...medications];
    updated[index][field] = value;
    setMedications(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate
    const isValid = medications.every(
      (med) => med.medicationName && med.dosage && med.frequency && med.durationDays
    );

    if (!isValid) {
      alert('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    onSubmit({ medications });
    
    // Reset form
    setMedications([
      {
        medicationName: '',
        dosage: '',
        frequency: '',
        durationDays: '',
        specialInstructions: '',
      },
    ]);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <FaPrescriptionBottleAlt className="text-2xl" />
            </div>
            <div>
              <h2 className="text-2xl font-black">كتابة روشتة جديدة</h2>
              <p className="text-sm text-white/80">أضف الأدوية والتعليمات</p>
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
            {medications.map((medication, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-xl p-6 relative"
              >
                {/* Remove Button */}
                {medications.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveMedication(index)}
                    className="absolute top-4 left-4 w-8 h-8 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-colors"
                  >
                    <FaTrash className="text-sm" />
                  </button>
                )}

                <h3 className="text-lg font-bold text-purple-900 mb-4">
                  الدواء {index + 1}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Medication Name */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      اسم الدواء <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={medication.medicationName}
                      onChange={(e) =>
                        handleMedicationChange(index, 'medicationName', e.target.value)
                      }
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-purple-500 focus:outline-none"
                      placeholder="مثال: باراسيتامول 500 ملجم"
                      required
                    />
                  </div>

                  {/* Dosage */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      الجرعة <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={medication.dosage}
                      onChange={(e) => handleMedicationChange(index, 'dosage', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-purple-500 focus:outline-none"
                      placeholder="مثال: قرص واحد"
                      required
                    />
                  </div>

                  {/* Frequency */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      التكرار <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={medication.frequency}
                      onChange={(e) => handleMedicationChange(index, 'frequency', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-purple-500 focus:outline-none"
                      placeholder="مثال: 3 مرات يومياً"
                      required
                    />
                  </div>

                  {/* Duration */}
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      المدة (أيام) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={medication.durationDays}
                      onChange={(e) =>
                        handleMedicationChange(index, 'durationDays', e.target.value)
                      }
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-purple-500 focus:outline-none"
                      placeholder="مثال: 7"
                      min="1"
                      required
                    />
                  </div>

                  {/* Special Instructions */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      تعليمات خاصة
                    </label>
                    <textarea
                      value={medication.specialInstructions}
                      onChange={(e) =>
                        handleMedicationChange(index, 'specialInstructions', e.target.value)
                      }
                      className="w-full px-4 py-3 border-2 border-slate-200 rounded-lg focus:border-purple-500 focus:outline-none resize-none"
                      rows="2"
                      placeholder="مثال: يؤخذ بعد الأكل"
                    />
                  </div>
                </div>
              </div>
            ))}

            {/* Add Medication Button */}
            <button
              type="button"
              onClick={handleAddMedication}
              className="w-full bg-gradient-to-r from-purple-100 to-indigo-100 hover:from-purple-200 hover:to-indigo-200 text-purple-700 font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-all border-2 border-purple-300"
            >
              <FaPlus />
              <span>إضافة دواء آخر</span>
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
            className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-bold py-3 px-6 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'جاري الحفظ...' : 'حفظ الروشتة'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionForm;
