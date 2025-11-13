import { useState, useEffect, useRef } from 'react';
import { FaMapMarkerAlt, FaCheckCircle, FaExclamationCircle, FaSpinner, FaLocationArrow } from 'react-icons/fa';
import MapPicker from '@/components/common/MapPicker';
import usePharmacyProfile from '../../hooks/usePharmacyProfile';

/**
 * AddressSection Component
 * Displays and manages pharmacy address with map picker and auto-save
 */
const AddressSection = () => {
  const { address, loading, error, success, updateAddress } = usePharmacyProfile({
    autoFetch: false,
  });

  // Form state
  const [formData, setFormData] = useState({
    governorate: 1,
    city: '',
    street: '',
    buildingNumber: '',
    latitude: 30.0444,
    longitude: 31.2357, // Egypt longitude is always positive (25-35)
  });

  // Auto-save state
  const [autoSaveStatus, setAutoSaveStatus] = useState('');
  const [gettingLocation, setGettingLocation] = useState(false);
  const hasChangesRef = useRef(false);
  const lastSavedDataRef = useRef(null);
  const autoSaveTimeoutRef = useRef(null);

  // Governorates list (same as doctor)
  const governorates = [
    { value: 1, label: 'القاهرة' },
    { value: 2, label: 'الجيزة' },
    { value: 3, label: 'الإسكندرية' },
    { value: 4, label: 'الدقهلية' },
    { value: 5, label: 'الشرقية' },
    { value: 6, label: 'القليوبية' },
    { value: 7, label: 'البحيرة' },
    { value: 8, label: 'المنوفية' },
    { value: 9, label: 'الغربية' },
    { value: 10, label: 'كفر الشيخ' },
  ];

  // Initialize form data
  useEffect(() => {
    if (address) {
      // Validate and fix coordinates from backend
      const lat = address.latitude || 30.0444;
      const lng = address.longitude || 31.2357;
      
      const initialData = {
        governorate: address.governorate || 1,
        city: address.city || '',
        street: address.street || '',
        buildingNumber: address.buildingNumber || '',
        latitude: Math.max(22, Math.min(32, lat)),
        longitude: Math.max(25, Math.min(35, Math.abs(lng))), // Fix negative longitude
      };
      setFormData(initialData);
      lastSavedDataRef.current = JSON.stringify(initialData);
    }
  }, [address]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'governorate' ? parseInt(value, 10) : value,
    }));
    hasChangesRef.current = true;
    setAutoSaveStatus('pending');
  };

  // Handle location change from map
  const handleLocationChange = (location) => {
    // Validate coordinates (Egypt bounds: lat 22-32, lng 25-35)
    const lat = Math.max(22, Math.min(32, location.lat));
    const lng = Math.max(25, Math.min(35, Math.abs(location.lng))); // Ensure positive
    
    setFormData((prev) => ({
      ...prev,
      latitude: lat,
      longitude: lng,
    }));
    hasChangesRef.current = true;
    setAutoSaveStatus('pending');
  };

  // Reverse geocoding to get address from coordinates
  const getAddressFromCoordinates = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=ar`
      );
      const data = await response.json();

      if (data.address) {
        // Extract governorate (state/province)
        const governorateName = data.address.state || data.address.province || data.address.city || '';
        
        // Map governorate name to enum value
        const governorateMap = {
          'القاهرة': 1,
          'Cairo': 1,
          'الجيزة': 2,
          'Giza': 2,
          'الإسكندرية': 3,
          'Alexandria': 3,
          'الدقهلية': 4,
          'Dakahlia': 4,
          'الشرقية': 5,
          'Sharqia': 5,
          'القليوبية': 6,
          'Qalyubia': 6,
          'البحيرة': 7,
          'Beheira': 7,
          'المنوفية': 8,
          'Monufia': 8,
          'الغربية': 9,
          'Gharbia': 9,
          'كفر الشيخ': 10,
          'Kafr El Sheikh': 10,
        };

        const governorateValue = governorateMap[governorateName] || 1;
        const city = data.address.city || data.address.town || data.address.village || '';
        const street = data.address.road || data.address.street || '';

        return {
          governorate: governorateValue,
          city,
          street,
        };
      }
      return null;
    } catch (error) {
      console.error('Error fetching address:', error);
      return null;
    }
  };

  // Get current location
  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('المتصفح لا يدعم تحديد الموقع الجغرافي');
      return;
    }

    setGettingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        // Validate and update coordinates
        const validatedLat = Math.max(22, Math.min(32, lat));
        const validatedLng = Math.max(25, Math.min(35, Math.abs(lng)));

        // Get address from coordinates
        const addressData = await getAddressFromCoordinates(validatedLat, validatedLng);

        setFormData((prev) => ({
          ...prev,
          latitude: validatedLat,
          longitude: validatedLng,
          ...(addressData && {
            governorate: addressData.governorate,
            city: addressData.city,
            street: addressData.street,
          }),
        }));

        hasChangesRef.current = true;
        setAutoSaveStatus('pending');
        setGettingLocation(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        alert('فشل الحصول على الموقع الحالي. تأكد من السماح بالوصول للموقع.');
        setGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
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
      // Final validation before sending
      const validatedData = {
        ...formData,
        latitude: Math.max(22, Math.min(32, formData.latitude)),
        longitude: Math.max(25, Math.min(35, Math.abs(formData.longitude))),
      };
      
      console.log('📍 Sending address data:', validatedData);
      const result = await updateAddress(validatedData);

      if (result.success) {
        // Update formData with validated values to prevent re-sending
        setFormData(validatedData);
        lastSavedDataRef.current = JSON.stringify(validatedData);
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
              <FaMapMarkerAlt className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white">العنوان</h2>
              <p className="text-teal-50 text-sm mt-1">موقع الصيدلية على الخريطة</p>
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
      <div className="p-8 space-y-6">
        {/* Info Note */}
        <div className="p-4 bg-teal-50 border border-teal-200 rounded-xl">
          <p className="text-sm text-teal-700 flex items-center gap-2">
            <FaLocationArrow className="text-teal-500" />
            اضغط على زر "موقعي الحالي" لتحديد موقعك وملء بيانات العنوان تلقائياً
          </p>
        </div>

        {/* Address Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Governorate */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              المحافظة <span className="text-red-500">*</span>
            </label>
            <select
              name="governorate"
              value={formData.governorate}
              onChange={handleChange}
              disabled
              className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-500 cursor-not-allowed"
            >
              {governorates.map((gov) => (
                <option key={gov.value} value={gov.value}>
                  {gov.label}
                </option>
              ))}
            </select>
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              المدينة <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              disabled
              placeholder="سيتم ملؤها تلقائياً"
              className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-500 cursor-not-allowed"
            />
          </div>

          {/* Street */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              الشارع <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="street"
              value={formData.street}
              onChange={handleChange}
              disabled
              placeholder="سيتم ملؤها تلقائياً"
              className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-500 cursor-not-allowed"
            />
          </div>

          {/* Building Number */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              رقم المبنى
            </label>
            <input
              type="text"
              name="buildingNumber"
              value={formData.buildingNumber}
              onChange={handleChange}
              placeholder="مثال: 123"
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Coordinates & Current Location */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            الإحداثيات
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Latitude */}
            <div>
              <input
                type="number"
                step="0.000001"
                name="latitude"
                value={formData.latitude}
                onChange={(e) => {
                  const value = parseFloat(e.target.value) || 0;
                  setFormData((prev) => ({
                    ...prev,
                    latitude: value,
                  }));
                  hasChangesRef.current = true;
                  setAutoSaveStatus('pending');
                }}
                placeholder="خط العرض (Latitude)"
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-sm"
              />
            </div>

            {/* Longitude */}
            <div>
              <input
                type="number"
                step="0.000001"
                name="longitude"
                value={formData.longitude}
                onChange={(e) => {
                  const value = parseFloat(e.target.value) || 0;
                  setFormData((prev) => ({
                    ...prev,
                    longitude: value,
                  }));
                  hasChangesRef.current = true;
                  setAutoSaveStatus('pending');
                }}
                placeholder="خط الطول (Longitude)"
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all text-sm"
              />
            </div>

            {/* Get Current Location Button */}
            <div>
              <button
                type="button"
                onClick={handleGetCurrentLocation}
                disabled={gettingLocation}
                className="w-full h-full px-4 py-3 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-xl hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-semibold"
              >
                {gettingLocation ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    جاري التحديد...
                  </>
                ) : (
                  <>
                    <FaLocationArrow />
                    موقعي الحالي
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Map Picker */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            الموقع على الخريطة
          </label>
          <div className="rounded-xl overflow-hidden border-2 border-slate-200">
            <MapPicker
              latitude={formData.latitude}
              longitude={formData.longitude}
              onLocationChange={handleLocationChange}
              disabled={false}
            />
          </div>
          <p className="text-xs text-slate-500 mt-2">
            انقر على الخريطة لتحديد موقع الصيدلية بدقة
          </p>
        </div>

        {/* Error Messages */}
        {error.address && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-sm text-red-600">{error.address}</p>
          </div>
        )}

        {/* Success Messages */}
        {success.address && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
            <p className="text-sm text-green-600 flex items-center gap-2">
              <FaCheckCircle />
              {success.address}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddressSection;
