import { useState, useEffect } from 'react';
import { FaPills, FaPrescriptionBottleAlt, FaPlus, FaTrash, FaSave } from 'react-icons/fa';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Prescriptions from '../../../../api/services/prescriptions.service';

const DOSAGE_OPTIONS = [
  'قرص واحد', 'قرصين', '3 أقراص', 'نصف قرص', 'ربع قرص',
  'ملعقة صغيرة (5 مل)', 'ملعقة كبيرة (15 مل)',
  'كبسولة واحدة', 'كبسولتين', 'حقنة واحدة',
  'بخة واحدة', 'بختين', '3 بخات',
  'نقطة واحدة', 'نقطتين', '3 نقط',
];

const FREQUENCY_OPTIONS = [
  'مرة واحدة يومياً', 'مرتين يومياً', '3 مرات يومياً', '4 مرات يومياً',
  'مرة كل 12 ساعة', 'مرة كل 8 ساعات', 'مرة كل 6 ساعات',
  'مرة كل يومين', 'مرة أسبوعياً', 'مرتين في الأسبوع', '3 مرات في الأسبوع',
  'عند الحاجة', 'قبل النوم', 'صباحاً', 'مساءً',
];

const DURATION_OPTIONS = ['3', '5', '7', '10', '14', '21', '30', '60', '90'];

const SPECIAL_INSTRUCTIONS_OPTIONS = [
  'بعد الأكل', 'قبل الأكل', 'مع الأكل', 'على معدة فارغة',
  'قبل النوم', 'عند الاستيقاظ', 'مع كوب ماء كامل',
  'لا تقود السيارة بعد تناوله', 'تجنب التعرض للشمس',
  'احفظه في الثلاجة', 'رج الزجاجة قبل الاستخدام',
  'لا تتوقف عن تناوله دون استشارة الطبيب', 'أكمل الجرعة كاملة',
];

const PrescriptionTab = ({ currentSession, patientInfo, appointmentData, appointmentId, user, onCreatePrescription }) => {
  const [medications, setMedications] = useState([]);
  const [currentMedication, setCurrentMedication] = useState({
    medicationId: '',
    medicationName: '',
    dosage: '',
    frequency: '',
    durationDays: '',
    specialInstructions: '',
  });
  const [medOptions, setMedOptions] = useState([]);
  const [medicSearchVal, setMedicSearchVal] = useState('');
  const [selectedMedication, setSelectedMedication] = useState(null);

  useEffect(() => {
    const getMedicOptions = async () => {
      try {
        const { data } = await Prescriptions.getPrescriptions({ search: medicSearchVal });
        setMedOptions(data || []);
      } catch (error) {
        console.error('❌ Error fetching medications:', error);
      }
    };
    getMedicOptions();
  }, [medicSearchVal]);

  const handleAddMedication = () => {
    if (!currentMedication.medicationName || !currentMedication.dosage || 
        !currentMedication.frequency || !currentMedication.durationDays) {
      alert('⚠️ يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    setMedications([...medications, { 
      ...currentMedication, 
      id: Date.now(),
      durationDays: parseInt(currentMedication.durationDays) || 0
    }]);
    
    setCurrentMedication({
      medicationId: '',
      medicationName: '',
      dosage: '',
      frequency: '',
      durationDays: '',
      specialInstructions: '',
    });
    setSelectedMedication(null);
    setMedicSearchVal('');
  };

  const handleSavePrescription = async () => {
    try {
      if (medications.length === 0) {
        alert('⚠️ يرجى إضافة دواء واحد على الأقل');
        return;
      }

      const doctorId = currentSession?.doctorId || appointmentData?.doctorId || user?.id;
      const patientIdFromSession = patientInfo?.patientId || appointmentData?.patientId || currentSession?.patientId;

      if (!doctorId || !patientIdFromSession || !appointmentId) {
        alert('❌ بيانات الجلسة غير مكتملة');
        return;
      }

      const preparedMedications = medications.map(({ id: _id, ...med }) => ({
        medicationId: med.medicationId || '00000000-0000-0000-0000-000000000000',
        dosage: med.dosage,
        frequency: med.frequency,
        durationDays: parseInt(med.durationDays) || 0,
        specialInstructions: med.specialInstructions || '',
      }));

      const result = await onCreatePrescription({
        appointmentId,
        doctorId,
        patientId: patientIdFromSession,
        medications: preparedMedications,
      });

      if (result.success) {
        alert('✅ تم حفظ الروشتة بنجاح!');
        setMedications([]);
        setCurrentMedication({
          medicationId: '',
          medicationName: '',
          dosage: '',
          frequency: '',
          durationDays: '',
          specialInstructions: '',
        });
        setSelectedMedication(null);
        setMedicSearchVal('');
      } else {
        alert(`❌ فشل حفظ الروشتة: ${result.error}`);
      }
    } catch (error) {
      console.error('❌ Error saving prescription:', error);
      alert('❌ حدث خطأ أثناء حفظ الروشتة');
    }
  };

  return (
    <div className="space-y-6">
      {/* Add Medication Form */}
      <div className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-2xl p-6 border-2 border-teal-200">
        <h4 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <FaPills className="text-teal-600" />
          إضافة دواء
        </h4>

        {/* Medication Name */}
        <div className="mb-4">
          <Autocomplete
            disablePortal
            filterOptions={(x) => x}
            getOptionLabel={(option) => option.brandName || ''}
            options={medOptions}
            value={selectedMedication}
            onChange={(event, newValue) => {
              setSelectedMedication(newValue);
              if (newValue) {
                setCurrentMedication({
                  ...currentMedication,
                  medicationId: newValue.id || '',
                  medicationName: newValue.brandName || '',
                });
              } else {
                setCurrentMedication({
                  ...currentMedication,
                  medicationId: '',
                  medicationName: '',
                });
              }
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                dir="rtl"
                label="اسم الدواء *"
                placeholder="ابحث عن الدواء..."
                onChange={(e) => setMedicSearchVal(e.target.value)}
              />
            )}
          />
        </div>

        {/* All Other Fields */}
        <div className="grid grid-cols-4 gap-3">
          <Autocomplete
            freeSolo
            options={DOSAGE_OPTIONS}
            value={currentMedication.dosage}
            onChange={(event, newValue) => setCurrentMedication({ ...currentMedication, dosage: newValue || '' })}
            onInputChange={(event, newInputValue) => setCurrentMedication({ ...currentMedication, dosage: newInputValue })}
            renderInput={(params) => <TextField {...params} label="الجرعة *" placeholder="قرص واحد" dir="rtl" size="small" />}
          />

          <Autocomplete
            freeSolo
            options={FREQUENCY_OPTIONS}
            value={currentMedication.frequency}
            onChange={(event, newValue) => setCurrentMedication({ ...currentMedication, frequency: newValue || '' })}
            onInputChange={(event, newInputValue) => setCurrentMedication({ ...currentMedication, frequency: newInputValue })}
            renderInput={(params) => <TextField {...params} label="عدد المرات *" placeholder="3 مرات يومياً" dir="rtl" size="small" />}
          />

          <Autocomplete
            freeSolo
            options={DURATION_OPTIONS}
            value={currentMedication.durationDays}
            onChange={(event, newValue) => setCurrentMedication({ ...currentMedication, durationDays: newValue || '' })}
            onInputChange={(event, newInputValue) => setCurrentMedication({ ...currentMedication, durationDays: newInputValue })}
            renderInput={(params) => <TextField {...params} label="المدة (بالأيام) *" placeholder="7" dir="rtl" size="small" type="number" />}
          />

          <Autocomplete
            freeSolo
            options={SPECIAL_INSTRUCTIONS_OPTIONS}
            value={currentMedication.specialInstructions}
            onChange={(event, newValue) => setCurrentMedication({ ...currentMedication, specialInstructions: newValue || '' })}
            onInputChange={(event, newInputValue) => setCurrentMedication({ ...currentMedication, specialInstructions: newInputValue })}
            renderInput={(params) => <TextField {...params} label="تعليمات خاصة" placeholder="بعد الأكل" dir="rtl" size="small" />}
          />
        </div>

        <button
          onClick={handleAddMedication}
          disabled={!currentMedication.medicationName || !currentMedication.dosage || !currentMedication.frequency || !currentMedication.durationDays}
          className="mt-4 w-full px-6 py-3 bg-gradient-to-r from-teal-600 to-teal-600 text-white rounded-xl font-bold hover:shadow-lg hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
        >
          <FaPlus />
          إضافة الدواء للروشتة
        </button>
      </div>

      {/* Medications List */}
      {medications.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <FaPrescriptionBottleAlt className="text-teal-600" />
              الأدوية المضافة ({medications.length})
            </h4>
          </div>

          <div className="space-y-3">
            {medications.map((med, index) => (
              <div key={med.id} className="bg-white rounded-xl p-5 border-2 border-slate-200 hover:border-teal-300 transition-all duration-200 hover:shadow-md">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-8 h-8 bg-teal-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                        {index + 1}
                      </span>
                      <h5 className="text-lg font-black text-slate-800">{med.medicationName}</h5>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                      <div className="bg-slate-50 rounded-lg p-2">
                        <p className="text-slate-500 font-semibold mb-1">الجرعة</p>
                        <p className="text-slate-800 font-bold">{med.dosage}</p>
                      </div>
                      <div className="bg-slate-50 rounded-lg p-2">
                        <p className="text-slate-500 font-semibold mb-1">عدد المرات</p>
                        <p className="text-slate-800 font-bold">{med.frequency}</p>
                      </div>
                      <div className="bg-slate-50 rounded-lg p-2">
                        <p className="text-slate-500 font-semibold mb-1">المدة</p>
                        <p className="text-slate-800 font-bold">{med.durationDays} يوم</p>
                      </div>
                      {med.specialInstructions && (
                        <div className="bg-teal-50 rounded-lg p-2 col-span-2 md:col-span-1">
                          <p className="text-teal-600 font-semibold mb-1">تعليمات</p>
                          <p className="text-slate-800 font-bold">{med.specialInstructions}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => setMedications(medications.filter(m => m.id !== med.id))}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                    title="حذف الدواء"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleSavePrescription}
            disabled={medications.length === 0}
            className="w-full px-6 py-4 bg-gradient-to-r from-[#223045] to-slate-700 text-white rounded-xl font-black text-lg hover:shadow-xl hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
          >
            <FaSave />
            حفظ الروشتة ({medications.length} دواء)
          </button>
        </div>
      )}

      {/* Empty State */}
      {medications.length === 0 && (
        <div className="text-center py-8 bg-slate-50 rounded-xl border-2 border-dashed border-slate-300">
          <FaPrescriptionBottleAlt className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-semibold">لم يتم إضافة أي أدوية بعد</p>
          <p className="text-slate-400 text-sm mt-1">قم بملء النموذج أعلاه لإضافة دواء</p>
        </div>
      )}
    </div>
  );
};

export default PrescriptionTab;
