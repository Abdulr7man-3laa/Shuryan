import { useState, useEffect } from 'react';
import { FaFlask, FaVial, FaPlus, FaTrash, FaSave } from 'react-icons/fa';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import doctorService from '@/api/services/doctor.service';
import laboratoryService from '@/api/services/laboratory.service';

const SPECIAL_INSTRUCTIONS_OPTIONS = [
  'صائم 8 ساعات قبل التحليل',
  'صائم 12 ساعة قبل التحليل',
  'لا تتناول الطعام قبل التحليل بـ 3 ساعات',
  'يُفضل التحليل في الصباح الباكر',
  'يُفضل أخذ العينة في أي وقت',
  'تجنب المجهود الشديد قبل التحليل',
  'تجنب الأطعمة الدهنية قبل التحليل بـ 24 ساعة',
  'اشرب كمية كافية من الماء قبل التحليل',
  'أحضر نتائج التحاليل السابقة للمقارنة',
];

const LabTab = ({ currentSession, patientInfo, appointmentData, appointmentId, user }) => {
  const [labTests, setLabTests] = useState([]);
  const [generalNotes, setGeneralNotes] = useState('');
  const [currentTest, setCurrentTest] = useState({
    labTestId: '',
    testName: '',
    specialInstructions: '',
  });
  const [labTestOptions, setLabTestOptions] = useState([]);
  const [labTestSearchVal, setLabTestSearchVal] = useState('');
  const [selectedLabTest, setSelectedLabTest] = useState(null);

  // Fetch lab tests from API
  useEffect(() => {
    const getLabTestOptions = async () => {
      try {
        console.log('🔬 Fetching available lab tests from API...');
        const tests = await laboratoryService.getAvailableTests();
        
        // Map API response to component format
        const mappedTests = tests.map(test => ({
          id: test.id,
          testName: test.name,
          code: test.code,
          category: test.category,
          specialInstructions: test.specialInstructions || ''
        }));
        
        // Filter by search term
        const filtered = labTestSearchVal
          ? mappedTests.filter(test => 
              test.testName.toLowerCase().includes(labTestSearchVal.toLowerCase()) ||
              test.code?.toLowerCase().includes(labTestSearchVal.toLowerCase()) ||
              test.category?.toLowerCase().includes(labTestSearchVal.toLowerCase())
            )
          : mappedTests;
        
        setLabTestOptions(filtered);
        console.log(`✅ Loaded ${filtered.length} lab tests`);
      } catch (error) {
        console.error('❌ Error fetching lab tests:', error);
        // Fallback to empty array on error
        setLabTestOptions([]);
      }
    };
    getLabTestOptions();
  }, [labTestSearchVal]);

  const handleAddTest = () => {
    if (!currentTest.testName) {
      alert('⚠️ يرجى إدخال اسم التحليل');
      return;
    }

    setLabTests([
      ...labTests,
      {
        ...currentTest,
        id: Date.now(),
        labTestId: currentTest.labTestId || '00000000-0000-0000-0000-000000000000',
      },
    ]);

    setCurrentTest({
      labTestId: '',
      testName: '',
      specialInstructions: '',
    });
    setSelectedLabTest(null);
    setLabTestSearchVal('');
  };

  const handleSaveLabPrescription = async () => {
    try {
      if (labTests.length === 0) {
        alert('⚠️ يرجى إضافة تحليل واحد على الأقل');
        return;
      }

      const doctorId = currentSession?.doctorId || appointmentData?.doctorId || user?.id;
      const patientIdFromSession = patientInfo?.patientId || appointmentData?.patientId || currentSession?.patientId;

      if (!doctorId || !patientIdFromSession || !appointmentId) {
        alert('❌ بيانات الجلسة غير مكتملة');
        console.error('Missing IDs:', { doctorId, patientIdFromSession, appointmentId });
        return;
      }

      const preparedItems = labTests.map((test) => ({
        labTestId: test.labTestId,
        specialInstructions: test.specialInstructions || '',
      }));

      const labPrescriptionData = {
        appointmentId,
        doctorId,
        patientId: patientIdFromSession,
        generalNotes: generalNotes || '',
        items: preparedItems,
      };

      console.log('📋 Sending lab prescription:', labPrescriptionData);

      const response = await doctorService.createLabPrescription(labPrescriptionData);

      console.log('✅ Lab prescription created:', response);

      // Response is already extracted from wrapper in service
      if (response && response.id) {
        alert(`✅ تم حفظ طلب التحاليل بنجاح!\n\nرقم الطلب: ${response.id}`);
        console.log('📝 Lab Prescription Details:', {
          id: response.id,
          appointmentId: response.appointmentId,
          doctorName: response.doctorName,
          patientName: response.patientName,
          itemsCount: response.items?.length || 0,
          createdAt: response.createdAt
        });
        
        // Reset form
        setLabTests([]);
        setGeneralNotes('');
        setCurrentTest({
          labTestId: '',
          testName: '',
          specialInstructions: '',
        });
      } else {
        alert(`❌ فشل حفظ طلب التحاليل`);
      }
    } catch (error) {
      console.error('❌ Error saving lab prescription:', error);
      alert('❌ حدث خطأ أثناء حفظ طلب التحاليل');
    }
  };

  return (
    <div className="space-y-6">
      {/* Add Lab Test Form */}
      <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl p-6 border-2 border-cyan-200">
        <h4 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <FaVial className="text-cyan-600" />
          إضافة تحليل
        </h4>

        {/* Lab Test Name */}
        <div className="mb-4">
          
        </div>

        {/*   Special Instructions in Grid */}
        <div className="grid grid-cols-2 gap-3">
          <Autocomplete
            disablePortal
            filterOptions={(x) => x}
            getOptionLabel={(option) => {
              // Show test name with code if available
              if (option.code) {
                return `${option.testName} (${option.code})`;
              }
              return option.testName || '';
            }}
            options={labTestOptions}
            value={selectedLabTest}
            onChange={(event, newValue) => {
              setSelectedLabTest(newValue);
              if (newValue) {
                setCurrentTest({
                  ...currentTest,
                  labTestId: newValue.id || '',
                  testName: newValue.testName || '',
                  // Pre-fill special instructions if available from API
                  specialInstructions: currentTest.specialInstructions || newValue.specialInstructions || '',
                });
              } else {
                setCurrentTest({
                  ...currentTest,
                  labTestId: '',
                  testName: '',
                  specialInstructions: '',
                });
              }
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                dir="rtl"
                label="اسم التحليل *"
                placeholder="ابحث عن التحليل..."
                onChange={(e) => setLabTestSearchVal(e.target.value)}
              />
            )}
          />

          <Autocomplete
            freeSolo
            options={SPECIAL_INSTRUCTIONS_OPTIONS}
            value={currentTest.specialInstructions}
            onChange={(event, newValue) => setCurrentTest({ ...currentTest, specialInstructions: newValue || '' })}
            onInputChange={(event, newInputValue) => setCurrentTest({ ...currentTest, specialInstructions: newInputValue })}
            renderInput={(params) => <TextField {...params} label="تعليمات خاصة" placeholder="صائم 8 ساعات" dir="rtl"/>}
          />
        </div>

        <button
          onClick={handleAddTest}
          disabled={!currentTest.testName}
          className="mt-4 w-full px-6 py-3 bg-gradient-to-r from-teal-600 to-teal-600 text-white rounded-xl font-bold hover:shadow-lg hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
        >
          <FaPlus />
          إضافة التحليل للروشتة
        </button>
      </div>

      {/* Lab Tests List */}
      {labTests.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <FaVial className="text-teal-600" />
              التحاليل المضافة ({labTests.length})
            </h4>
          </div>

          <div className="space-y-3">
            {labTests.map((test, index) => (
              <div
                key={test.id}
                className="bg-white rounded-xl p-5 border-2 border-slate-200 hover:border-teal-300 transition-all duration-200 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-8 h-8 bg-teal-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                        {index + 1}
                      </span>
                      <h5 className="text-lg font-black text-slate-800">{test.testName}</h5>
                    </div>

                    {test.specialInstructions && (
                      <div className="bg-teal-50 rounded-lg p-3 border border-teal-200">
                        <p className="text-xs font-semibold text-teal-700 mb-1">تعليمات خاصة:</p>
                        <p className="text-sm font-medium text-slate-800">{test.specialInstructions}</p>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => setLabTests(labTests.filter((t) => t.id !== test.id))}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                    title="حذف التحليل"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleSaveLabPrescription}
            disabled={labTests.length === 0}
            className="w-full px-6 py-4 bg-gradient-to-r from-[#223045] to-slate-700 text-white rounded-xl font-black text-lg hover:shadow-xl hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
          >
            <FaSave />
            حفظ طلب التحاليل ({labTests.length} تحليل)
          </button>
        </div>
      )}

      {/* Empty State */}
      {labTests.length === 0 && (
        <div className="text-center py-8 bg-slate-50 rounded-xl border-2 border-dashed border-slate-300">
          <FaVial className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-semibold">لم يتم إضافة أي تحاليل بعد</p>
          <p className="text-slate-400 text-sm mt-1">قم بملء النموذج أعلاه لإضافة تحليل</p>
        </div>
      )}
    </div>
  );
};

export default LabTab;
