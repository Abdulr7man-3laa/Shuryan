import { useState, useEffect, useRef } from 'react';
import { FaTruck, FaCheckCircle, FaExclamationCircle, FaSpinner } from 'react-icons/fa';
import usePharmacyProfile from '../../hooks/usePharmacyProfile';

/**
 * DeliverySection Component
 * Displays and manages pharmacy delivery settings with auto-save
 */
const DeliverySection = () => {
  const { deliverySettings, loading, error, success, updateDeliverySettings } =
    usePharmacyProfile({ autoFetch: false });

  // Form state
  const [formData, setFormData] = useState({
    offersDelivery: false,
    deliveryFee: 0,
  });

  // Auto-save state
  const [autoSaveStatus, setAutoSaveStatus] = useState('');
  const hasChangesRef = useRef(false);
  const lastSavedDataRef = useRef(null);
  const autoSaveTimeoutRef = useRef(null);

  // Initialize form data
  useEffect(() => {
    if (deliverySettings) {
      const initialData = {
        offersDelivery: deliverySettings.offersDelivery || false,
        deliveryFee: deliverySettings.deliveryFee || 0,
      };
      setFormData(initialData);
      lastSavedDataRef.current = JSON.stringify(initialData);
    }
  }, [deliverySettings]);

  // Handle toggle change
  const handleToggleChange = (e) => {
    const { checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      offersDelivery: checked,
      // Reset fee to 0 if delivery is disabled
      deliveryFee: checked ? prev.deliveryFee : 0,
    }));
    hasChangesRef.current = true;
    setAutoSaveStatus('pending');
  };

  // Handle fee change
  const handleFeeChange = (e) => {
    const value = parseFloat(e.target.value) || 0;
    // Validate: max 1000
    const validatedValue = Math.min(Math.max(0, value), 1000);
    setFormData((prev) => ({
      ...prev,
      deliveryFee: validatedValue,
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
      const result = await updateDeliverySettings(formData);

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
  }, [formData]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-500 to-emerald-500 px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <FaTruck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white">إعدادات التوصيل</h2>
              <p className="text-teal-50 text-sm mt-1">خدمة التوصيل للمنازل</p>
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
          {/* Delivery Toggle */}
          <div className="flex items-center justify-between p-6 bg-gradient-to-br from-teal-50 to-emerald-50 rounded-xl border-2 border-teal-200">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                <FaTruck className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">خدمة التوصيل</h3>
                <p className="text-sm text-slate-600 mt-1">
                  {formData.offersDelivery ? 'متاحة حالياً' : 'غير متاحة'}
                </p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.offersDelivery}
                onChange={handleToggleChange}
                className="sr-only peer"
              />
              <div className="w-14 h-7 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-teal-500 peer-checked:to-emerald-500"></div>
            </label>
          </div>

          {/* Delivery Fee */}
          {formData.offersDelivery && (
            <div className="p-6 bg-slate-50 rounded-xl border border-slate-200">
              <label className="block text-sm font-semibold text-slate-700 mb-3">
                رسوم التوصيل (جنيه مصري)
              </label>

              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="1000"
                  step="5"
                  value={formData.deliveryFee}
                  onChange={handleFeeChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-lg font-semibold"
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-semibold">
                  ج.م
                </span>
              </div>

              <div className="mt-4 flex items-center gap-2">
                {formData.deliveryFee === 0 ? (
                  <div className="flex items-center gap-2 text-green-600">
                    <FaCheckCircle />
                    <span className="text-sm font-semibold">توصيل مجاني</span>
                  </div>
                ) : (
                  <p className="text-sm text-slate-600">
                    سيتم إضافة <span className="font-bold text-teal-600">{formData.deliveryFee} ج.م</span> لكل طلب
                  </p>
                )}
              </div>

              <p className="text-xs text-slate-500 mt-3">
                الحد الأقصى: 1000 جنيه • أدخل 0 للتوصيل المجاني
              </p>
            </div>
          )}

          {/* Error Messages */}
          {error.delivery && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-sm text-red-600">{error.delivery}</p>
            </div>
          )}

          {/* Success Messages */}
          {success.delivery && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
              <p className="text-sm text-green-600 flex items-center gap-2">
                <FaCheckCircle />
                {success.delivery}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeliverySection;
