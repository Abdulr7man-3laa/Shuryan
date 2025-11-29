import { useState, useEffect, useRef } from 'react';
import { FaVial, FaCheckCircle, FaExclamationCircle, FaSpinner, FaDollarSign } from 'react-icons/fa';
import useLaboratoryProfile from '../../hooks/useLaboratoryProfile';

/**
 * SampleCollectionSection Component
 * Displays and manages laboratory sample collection settings with auto-save
 */
const SampleCollectionSection = () => {
  const { sampleCollectionSettings, error, success, updateSampleCollectionSettings } =
    useLaboratoryProfile({ autoFetch: false });

  // Form state
  const [formData, setFormData] = useState({
    offersHomeSampleCollection: false,
    homeSampleCollectionFee: 0,
  });

  // Auto-save state
  const [autoSaveStatus, setAutoSaveStatus] = useState('');
  const hasChangesRef = useRef(false);
  const lastSavedDataRef = useRef(null);
  const autoSaveTimeoutRef = useRef(null);

  // Initialize form data
  useEffect(() => {
    if (sampleCollectionSettings) {
      const initialData = {
        offersHomeSampleCollection: sampleCollectionSettings.offersHomeSampleCollection || false,
        homeSampleCollectionFee: sampleCollectionSettings.homeSampleCollectionFee || 0,
      };
      setFormData(initialData);
      lastSavedDataRef.current = JSON.stringify(initialData);
    }
  }, [sampleCollectionSettings]);

  // Handle toggle change
  const handleToggleChange = (e) => {
    const { checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      offersHomeSampleCollection: checked,
    }));
    hasChangesRef.current = true;
    setAutoSaveStatus('pending');
  };

  // Handle fee change
  const handleFeeChange = (e) => {
    const value = parseFloat(e.target.value) || 0;
    setFormData((prev) => ({
      ...prev,
      homeSampleCollectionFee: value,
    }));
    hasChangesRef.current = true;
    setAutoSaveStatus('pending');
  };

  // Auto-save function
  const performAutoSave = async () => {
    const currentData = JSON.stringify(formData);
    const hasChanges = currentData !== lastSavedDataRef.current;

    if (!hasChanges) {
      setAutoSaveStatus('');
      return;
    }

    setAutoSaveStatus('saving');

    try {
      const result = await updateSampleCollectionSettings(formData);

      if (result.success) {
        lastSavedDataRef.current = currentData;
        hasChangesRef.current = false;
        setAutoSaveStatus('saved');

        setTimeout(() => {
          setAutoSaveStatus('');
        }, 2000);
      } else {
        setAutoSaveStatus('error');
      }
    } catch (error) {
      console.error('Auto-save error:', error);
      setAutoSaveStatus('error');
    }
  };

  // Auto-save effect
  useEffect(() => {
    if (hasChangesRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
      autoSaveTimeoutRef.current = setTimeout(() => {
        performAutoSave();
      }, 3000);
    }

    return () => clearTimeout(autoSaveTimeoutRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-500 to-emerald-500 px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <FaVial className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white">إعدادات أخذ العينات</h2>
              <p className="text-teal-50 text-sm mt-1">خدمة أخذ العينات من المنزل</p>
            </div>
          </div>

          {/* Auto-save status */}
          {autoSaveStatus && (
            <div
              className={`px-4 py-2 backdrop-blur-sm rounded-lg ${
                autoSaveStatus === 'pending'
                  ? 'bg-yellow-500/20 text-yellow-100'
                  : autoSaveStatus === 'saving'
                  ? 'bg-blue-500/20 text-blue-100'
                  : autoSaveStatus === 'saved'
                  ? 'bg-green-500/30 text-green-100'
                  : autoSaveStatus === 'error'
                  ? 'bg-red-500/20 text-red-100'
                  : ''
              }`}
            >
              <span className="text-sm font-medium flex items-center gap-2">
                {autoSaveStatus === 'pending' && '⏳ سيتم الحفظ خلال 3 ثواني...'}
                {autoSaveStatus === 'saving' && (
                  <>
                    <FaSpinner className="animate-spin" />
                    جاري الحفظ...
                  </>
                )}
                {autoSaveStatus === 'saved' && (
                  <>
                    <FaCheckCircle />تم الحفظ
                  </>
                )}
                {autoSaveStatus === 'error' && (
                  <>
                    <FaExclamationCircle />فشل الحفظ
                  </>
                )}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Sample Collection Toggle */}
          <div className="flex items-center justify-between p-6 bg-gradient-to-br from-teal-50 to-emerald-50 rounded-xl border-2 border-teal-200">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                <FaVial className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">خدمة أخذ العينات من المنزل</h3>
                <p className="text-sm text-slate-600 mt-1">
                  {formData.offersHomeSampleCollection ? 'متاحة حالياً' : 'غير متاحة'}
                </p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.offersHomeSampleCollection}
                onChange={handleToggleChange}
                className="sr-only peer"
              />
              <div className="w-14 h-7 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-teal-500 peer-checked:to-emerald-500"></div>
            </label>
          </div>

          {/* Fee Input - Shows when service is enabled */}
          {formData.offersHomeSampleCollection && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  رسوم أخذ العينات من المنزل (جنيه) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FaDollarSign className="absolute right-4 top-1/2 -translate-y-1/2 text-teal-500 w-5 h-5" />
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.homeSampleCollectionFee}
                    onChange={handleFeeChange}
                    placeholder="أدخل الرسوم"
                    className="w-full pr-12 pl-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  />
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  الرسوم المطلوبة لخدمة أخذ العينات من المنزل (بالجنيه المصري)
                </p>
              </div>

              <div className="p-6 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center gap-2 text-green-600 mb-3">
                  <FaCheckCircle />
                  <span className="text-sm font-semibold">الخدمة متاحة</span>
                </div>
                <p className="text-sm text-slate-600">
                  سيتمكن المرضى من طلب خدمة أخذ العينات من المنزل برسوم {formData.homeSampleCollectionFee} جنيه. سيتم التواصل معك لتأكيد الموعد وتحديد التفاصيل.
                </p>
              </div>
            </div>
          )}

          {/* Error Messages */}
          {error.sampleCollection && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-sm text-red-600">{error.sampleCollection}</p>
            </div>
          )}

          {/* Success Messages */}
          {success.sampleCollection && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
              <p className="text-sm text-green-600 flex items-center gap-2">
                <FaCheckCircle />
                {success.sampleCollection}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SampleCollectionSection;
