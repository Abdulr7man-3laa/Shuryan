import React, { useState, useEffect, useRef } from 'react';
import { usePatientProfile } from '../../hooks/usePatientProfile';
import { EGYPTIAN_GOVERNORATES, GENDER_OPTIONS, mapGenderToArabic } from '@/utils/constants';
import MapPicker from '@/components/common/MapPicker';
import '@/styles/leaflet-custom.css';
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCamera,
  FaEdit,
  FaSave,
  FaTimes,
  FaVenusMars,
  FaCalendar,
  FaGlobeAmericas,
} from 'react-icons/fa';

/**
 * Personal Info Section Component
 * 
 * Displays and manages patient personal information:
 * - First name, Last name
 * - Email, Phone
 * - Gender, Birth date
 * - Profile image
 * - Address (governorate, city, street, building, coordinates)
 * - Map integration (same as doctor clinic)
 */
const PersonalInfoSection = () => {
  const {
    personalInfo,
    address,
    loading,
    error,
    success,
    fetchPersonalInfo,
    fetchAddress,
    updatePersonalInfo,
    updateProfileImage,
    updateAddress,
    clearErrors,
  } = usePatientProfile({ autoFetch: false }); // Fetched by parent

  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [autoSaveStatus, setAutoSaveStatus] = useState(''); // '', 'saved', 'error'
  const hasInitializedInfoRef = useRef(false);
  const hasInitializedAddressRef = useRef(false);
  const hasChangesRef = useRef(false);
  const lastSavedInfoRef = useRef(null);
  const lastSavedAddressRef = useRef(null);
  const autoSaveTimeoutRef = useRef(null);

  // Form state for personal info
  const [infoValues, setInfoValues] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    gender: '',
    birthDate: '',
  });

  // Form state for address
  const [addressValues, setAddressValues] = useState({
    governorate: '',
    city: '',
    street: '',
    buildingNumber: '',
    latitude: '',
    longitude: '',
  });

  // Initialize personal info from store
  useEffect(() => {
    if (personalInfo && !hasInitializedInfoRef.current) {
      console.log('🔧 Initializing personal info from store:', personalInfo);
      const infoToUse = {
        firstName: personalInfo.firstName || '',
        lastName: personalInfo.lastName || '',
        email: personalInfo.email || '',
        phoneNumber: personalInfo.phoneNumber || '',
        gender: personalInfo.gender || '',
        birthDate: personalInfo.birthDate ? personalInfo.birthDate.split('T')[0] : '',
      };

      console.log('📝 Setting initial values:', infoToUse);
      setInfoValues(infoToUse);
      setProfileImagePreview(personalInfo.profileImageUrl || null);
      lastSavedInfoRef.current = JSON.stringify(infoToUse);
      hasInitializedInfoRef.current = true;
    }
  }, [personalInfo]);

  // Initialize address from store
  useEffect(() => {
    if (address && !hasInitializedAddressRef.current) {
      console.log('🏠 Initializing address from store:', address);
      
      // Use default Cairo coordinates if address has no coordinates
      const lat = address.latitude != null && address.latitude !== 0 ? address.latitude : 30.0444;
      const lng = address.longitude != null && address.longitude !== 0 ? address.longitude : 31.2357;
      
      const addressToUse = {
        governorate: address.governorate ? String(address.governorate) : '', // Convert number to string for form
        city: address.city || '',
        street: address.street || '',
        buildingNumber: address.buildingNumber || '',
        latitude: String(lat),
        longitude: String(lng),
      };

      console.log('📍 Setting initial address:', addressToUse);
      setAddressValues(addressToUse);
      lastSavedAddressRef.current = JSON.stringify(addressToUse);
      hasInitializedAddressRef.current = true;
    }
  }, [address]);

  // Handle personal info change
  const handleInfoChange = (e) => {
    const { name, value } = e.target;
    setInfoValues(prev => ({ ...prev, [name]: value }));
    hasChangesRef.current = true;
    setAutoSaveStatus(''); // Clear status when editing
  };

  // Handle address change
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddressValues(prev => ({ ...prev, [name]: value }));
    hasChangesRef.current = true;
    setAutoSaveStatus(''); // Clear status when editing
  };

  // Handle profile image change
  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('يرجى اختيار صورة صالحة');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('حجم الصورة يجب أن يكون أقل من 5 ميجابايت');
      return;
    }

    setProfileImageFile(file);

    // Create preview
    // Create object URL for preview
    const url = URL.createObjectURL(file);
    setProfileImagePreview(url);
    setProfileImageFile(file);
    hasChangesRef.current = true;
    setAutoSaveStatus(''); // Clear status when editing
  };

  // Handle map location change
  const handleMapLocationChange = (lat, lng) => {
    console.log('🗺️ PersonalInfoSection: Map location changed:', { lat, lng });
    
    setAddressValues(prev => ({
      ...prev,
      latitude: String(lat),
      longitude: String(lng),
    }));
    hasChangesRef.current = true;
    setAutoSaveStatus(''); // Clear status when editing
  };

  // Auto-save function
  const performAutoSave = async () => {
    try {
    // Check if there are changes
    const currentInfo = JSON.stringify(infoValues);
    const currentAddress = JSON.stringify(addressValues);
    
    const hasInfoChanges = currentInfo !== lastSavedInfoRef.current;
    const hasAddressChanges = currentAddress !== lastSavedAddressRef.current;
    const hasImageChanges = !!profileImageFile;
    
    console.log('📊 Change detection:', {
      hasInfoChanges,
      hasAddressChanges,
      hasImageChanges,
      currentInfo: currentInfo.substring(0, 100) + '...',
      lastSavedInfo: lastSavedInfoRef.current?.substring(0, 100) + '...',
    });
    
    if (!hasInfoChanges && !hasAddressChanges && !hasImageChanges) {
      console.log('⏭️ No changes to save, skipping...');
      hasChangesRef.current = false;
      return; // No changes to save
    }
    
    console.log('🔄 Auto-saving changes...');
    // Don't show "saving" status, just save silently
    
    // Basic validation
    if (!infoValues.firstName || !infoValues.lastName || !infoValues.phoneNumber) {
      console.error('❌ Validation failed: Required fields are empty', {
        firstName: infoValues.firstName,
        lastName: infoValues.lastName,
        phoneNumber: infoValues.phoneNumber,
        hasFirstName: !!infoValues.firstName,
        hasLastName: !!infoValues.lastName,
        hasPhoneNumber: !!infoValues.phoneNumber
      });
      setAutoSaveStatus('error');
      setTimeout(() => setAutoSaveStatus(''), 3000);
      return; // Don't auto-save if required fields are empty
    }
    
    console.log('✅ Validation passed!');

    // Prepare info data
    const infoData = {
      firstName: infoValues.firstName.trim(),
      lastName: infoValues.lastName.trim(),
      email: infoValues.email?.trim() || '',
      phoneNumber: infoValues.phoneNumber.trim(),
      gender: infoValues.gender ? parseInt(infoValues.gender, 10) : null, // Convert to number (1 or 2)
      birthDate: infoValues.birthDate || null,
    };

    // Prepare address data
    const lat = parseFloat(addressValues.latitude);
    const lng = parseFloat(addressValues.longitude);
    
    // Convert governorate from string to number (Backend expects enum 1-27)
    const governorateNum = addressValues.governorate ? parseInt(addressValues.governorate, 10) : null;
    
    const addressData = {
      street: addressValues.street?.trim() || '',
      city: addressValues.city?.trim() || '',
      governorate: governorateNum, // Number (enum)
      buildingNumber: addressValues.buildingNumber?.trim() || '',
      latitude: !isNaN(lat) && lat !== 0 ? lat : 30.0444, // Default Cairo coordinates
      longitude: !isNaN(lng) && lng !== 0 ? lng : 31.2357,
    };
    
    console.log('🗺️ Address coordinates:', {
      original: { lat: addressValues.latitude, lng: addressValues.longitude },
      parsed: { lat, lng },
      final: { lat: addressData.latitude, lng: addressData.longitude }
    });

    console.log('📤 Data to send:', { 
      infoData, 
      addressData, 
      hasImage: !!profileImageFile,
      imageFileName: profileImageFile?.name,
      governorateType: typeof addressData.governorate,
      governorateValue: addressData.governorate
    });

    // Execute all updates in parallel
    // Personal info, profile image, and address as separate requests
    const promises = [];
    const promiseTypes = []; // Track which API each promise represents
    
    // Update personal info if it changed
    if (hasInfoChanges) {
      promises.push(updatePersonalInfo(infoData));
      promiseTypes.push('Personal Info');
    }
    
    // Update profile image if changed (separate endpoint)
    if (hasImageChanges && profileImageFile) {
      promises.push(updateProfileImage(profileImageFile));
      promiseTypes.push('Profile Image');
    }
    
    // Update address if it changed and has valid data
    if (hasAddressChanges) {
      // Validate address has at least governorate AND city (Backend requirement)
      if (addressData.governorate && addressData.city) {
        promises.push(updateAddress(addressData));
        promiseTypes.push('Address');
      } else {
        console.warn('⚠️ Skipping address update - governorate and city are required', {
          governorate: addressData.governorate,
          city: addressData.city
        });
      }
    }
    
    // If no promises, skip (shouldn't happen due to earlier check)
    if (promises.length === 0) {
      console.log('⚠️ No updates to perform');
      setAutoSaveStatus('');
      return;
    }

    const results = await Promise.allSettled(promises);
    console.log('📥 Save results:', results);
    console.log('📋 Promise types:', promiseTypes);
    console.log('🔢 Number of promises:', promises.length);
    console.log('🔢 Number of results:', results.length);

    // Check if all succeeded
    console.log('🔍 Starting success check...');
    const allSuccess = results.every((r, index) => {
      const apiName = promiseTypes[index] || `API ${index}`;
      
      console.log(`🔍 Checking ${apiName} result:`, {
        status: r.status,
        value: r.value,
        isSuccess: r.value?.isSuccess,
        hasIsSuccess: 'isSuccess' in (r.value || {}),
        valueType: typeof r.value,
        valueKeys: r.value ? Object.keys(r.value) : null,
        valueKeysLength: r.value ? Object.keys(r.value).length : null
      });
      
      if (r.status !== 'fulfilled') {
        console.error(`❌ ${apiName}: Request failed (rejected)`);
        return false;
      }
      
      // If value is empty object {}, consider it success (Backend issue)
      const isEmptyObject = r.value && typeof r.value === 'object' && Object.keys(r.value).length === 0;
      console.log(`🧪 ${apiName}: isEmptyObject check:`, {
        hasValue: !!r.value,
        isObject: typeof r.value === 'object',
        keysLength: r.value ? Object.keys(r.value).length : null,
        isEmptyObject
      });
      
      if (isEmptyObject) {
        console.log(`⚠️ ${apiName}: Backend returned empty response {}, considering it success`);
        return true;
      }
      
      // If value is null or undefined but status is fulfilled, consider it success
      if (!r.value) {
        console.log(`⚠️ ${apiName}: Backend returned null/undefined, considering it success`);
        return true;
      }
      
      // Check isSuccess
      const hasIsSuccess = r.value?.isSuccess === true;
      
      // WORKAROUND: If Backend returns empty object or no isSuccess field,
      // but status is fulfilled (200 OK), consider it success
      const success = hasIsSuccess || (r.status === 'fulfilled' && !('isSuccess' in (r.value || {})));
      
      if (!hasIsSuccess && success) {
        console.warn(`⚠️ ${apiName}: No isSuccess field, but status is fulfilled - considering it success`);
      } else if (!success) {
        console.error(`❌ ${apiName}: isSuccess = ${r.value?.isSuccess}`);
      } else {
        console.log(`✅ ${apiName}: Success!`);
      }
      
      return success;
    });
    
    console.log('🎯 Final result: allSuccess =', allSuccess);

    if (allSuccess) {
      // Update last saved refs (no refresh to avoid loading)
      lastSavedInfoRef.current = currentInfo;
      lastSavedAddressRef.current = currentAddress;
      setProfileImageFile(null);
      hasChangesRef.current = false;
      setAutoSaveStatus('saved');
      console.log('✅ Auto-save complete!');
      
      // Clear saved status after 2 seconds
      setTimeout(() => {
        setAutoSaveStatus('');
      }, 2000);
    } else {
      console.error('⚠️ Auto-save failed:', results);
      // Log detailed error information
      results.forEach((result, index) => {
        const name = promiseTypes[index] || `API ${index}`;
        console.log(`${name} result:`, {
          status: result.status,
          value: result.value,
          reason: result.reason
        });
      });
      setAutoSaveStatus('error');
      // Clear error status after 3 seconds
      setTimeout(() => {
        setAutoSaveStatus('');
      }, 3000);
    }
    } catch (error) {
      console.error('🚨 Auto-save error:', error);
      setAutoSaveStatus('error');
      setTimeout(() => {
        setAutoSaveStatus('');
      }, 3000);
    }
  };

  // Auto-save effect
  useEffect(() => {
    if (hasChangesRef.current) {
      // Clear previous timeout
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
      
      // Set new timeout for 3 seconds
      autoSaveTimeoutRef.current = setTimeout(() => {
        performAutoSave();
      }, 3000);
    }
    
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [infoValues, addressValues, profileImageFile]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Section Header */}
      <div className="bg-gradient-to-r from-teal-500 via-emerald-500 to-green-500 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <FaUser className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-1">المعلومات الشخصية</h3>
              <p className="text-teal-100">
                البيانات الأساسية ومعلومات التواصل
              </p>
            </div>
          </div>
          {/* Auto-save indicator */}
          {autoSaveStatus && (
            <div className={`px-4 py-2 backdrop-blur-sm rounded-lg transition-all ${
              autoSaveStatus === 'saved' ? 'bg-green-500/30 text-green-100' :
              autoSaveStatus === 'error' ? 'bg-red-500/20 text-red-100' :
              'bg-white/20 text-white'
            }`}>
              <span className="text-sm font-medium">
                {autoSaveStatus === 'saved' ? 'تم الحفظ' :
                 autoSaveStatus === 'error' ? 'فشل الحفظ' :
                 ''}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="p-8 space-y-8">
        {/* Profile Image */}
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-teal-500 shadow-lg">
              {profileImagePreview ? (
                <img
                  src={profileImagePreview}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-teal-100 to-emerald-100 flex items-center justify-center">
                  <FaUser className="w-12 h-12 text-teal-600" />
                </div>
              )}
            </div>
            <label className="absolute bottom-0 right-0 w-10 h-10 bg-teal-600 hover:bg-teal-700 rounded-full flex items-center justify-center cursor-pointer shadow-lg transition-all">
              <FaCamera className="w-5 h-5 text-white" />
              <input
                type="file"
                accept="image/*"
                onChange={handleProfileImageChange}
                className="hidden"
              />
            </label>
          </div>
          <p className="mt-3 text-sm text-slate-500">
            اضغط على الكاميرا لتغيير الصورة
          </p>
        </div>

        {/* Basic Information */}
        <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <FaUser className="w-5 h-5 text-teal-600" />
            <h4 className="text-lg font-semibold text-slate-800">المعلومات الأساسية</h4>
          </div>

          {/* Name Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                الاسم الأول <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="firstName"
                value={infoValues.firstName}
                onChange={handleInfoChange}
                placeholder="أدخل الاسم الأول"
                className="w-full px-4 py-3 border border-slate-200 rounded-lg transition-all duration-200 hover:border-teal-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 text-right"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                الاسم الثاني <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="lastName"
                value={infoValues.lastName}
                onChange={handleInfoChange}
                placeholder="أدخل الاسم الثاني"
                className="w-full px-4 py-3 border border-slate-200 rounded-lg transition-all duration-200 hover:border-teal-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 text-right"
              />
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <FaEnvelope className="inline w-4 h-4 ml-1 text-teal-600" />
                البريد الإلكتروني <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={infoValues.email}
                onChange={handleInfoChange}
                placeholder="example@email.com"
                className="w-full px-4 py-3 border border-slate-200 rounded-lg transition-all duration-200 hover:border-teal-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 text-left"
                dir="ltr"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <FaPhone className="inline w-4 h-4 ml-1 text-teal-600" />
                رقم الهاتف <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={infoValues.phoneNumber}
                onChange={handleInfoChange}
                placeholder="01xxxxxxxxx"
                className="w-full px-4 py-3 border border-slate-200 rounded-lg transition-all duration-200 hover:border-teal-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 text-left"
                dir="ltr"
              />
            </div>
          </div>

          {/* Gender & Birth Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <FaVenusMars className="inline w-4 h-4 ml-1 text-teal-600" />
                الجنس <span className="text-red-500">*</span>
              </label>
              <select
                name="gender"
                value={infoValues.gender}
                onChange={handleInfoChange}
                className="w-full px-4 py-3 border border-slate-200 rounded-lg transition-all duration-200 hover:border-teal-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 text-right"
              >
                <option value="">اختر الجنس</option>
                {GENDER_OPTIONS.map(option => (
                  <option key={option.id} value={option.value}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                <FaCalendar className="inline w-4 h-4 ml-1 text-teal-600" />
                تاريخ الميلاد <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="birthDate"
                value={infoValues.birthDate}
                onChange={handleInfoChange}
                className="w-full px-4 py-3 border border-slate-200 rounded-lg transition-all duration-200 hover:border-teal-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 text-left"
                dir="ltr"
              />
            </div>
          </div>
        </div>

        {/* Address Section */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <FaMapMarkerAlt className="w-5 h-5 text-green-600" />
            <h4 className="text-lg font-semibold text-slate-800">العنوان</h4>
          </div>

          {/* Governorate & City */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                المحافظة <span className="text-red-500">*</span>
              </label>
              <select
                name="governorate"
                value={addressValues.governorate}
                onChange={handleAddressChange}
                className="w-full px-4 py-3 border border-slate-200 rounded-lg transition-all duration-200 hover:border-teal-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 text-right"
              >
                <option value="">اختر المحافظة</option>
                {EGYPTIAN_GOVERNORATES.map(gov => (
                  <option key={gov.id} value={gov.id}>
                    {gov.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                المدينة <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="city"
                value={addressValues.city}
                onChange={handleAddressChange}
                placeholder="أدخل اسم المدينة"
                className="w-full px-4 py-3 border border-slate-200 rounded-lg transition-all duration-200 hover:border-teal-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 text-right"
              />
            </div>
          </div>

          {/* Street & Building Number */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                الشارع <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="street"
                value={addressValues.street}
                onChange={handleAddressChange}
                placeholder="أدخل اسم الشارع"
                className="w-full px-4 py-3 border border-slate-200 rounded-lg transition-all duration-200 hover:border-teal-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 text-right"
              />
            </div>

            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                رقم المبنى
              </label>
              <input
                type="text"
                name="buildingNumber"
                value={addressValues.buildingNumber}
                onChange={handleAddressChange}
                placeholder="رقم المبنى"
                className="w-full px-4 py-3 border border-slate-200 rounded-lg transition-all duration-200 hover:border-teal-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 text-right"
              />
            </div>
          </div>

          {/* Coordinates & Get Location Button */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                خط العرض (Latitude)
              </label>
              <input
                type="number"
                step="any"
                name="latitude"
                value={addressValues.latitude}
                onChange={handleAddressChange}
                placeholder="30.0444"
                className="w-full px-4 py-3 border border-slate-200 rounded-lg transition-all duration-200 hover:border-teal-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 text-right"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                خط الطول (Longitude)
              </label>
              <input
                type="number"
                step="any"
                name="longitude"
                value={addressValues.longitude}
                onChange={handleAddressChange}
                placeholder="31.2357"
                className="w-full px-4 py-3 border border-slate-200 rounded-lg transition-all duration-200 hover:border-teal-300 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 text-right"
              />
            </div>

            <div className="flex items-end">
              <button
                type="button"
                onClick={() => {
                  if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                      (position) => {
                        const lat = position.coords.latitude;
                        const lng = position.coords.longitude;
                        setAddressValues(prev => ({
                          ...prev,
                          latitude: String(lat),
                          longitude: String(lng),
                        }));
                        hasChangesRef.current = true;
                        setAutoSaveStatus('');
                        console.log('📍 Current location:', { lat, lng });
                      },
                      (error) => {
                        console.error('❌ Error getting location:', error);
                        alert('لا يمكن الوصول إلى موقعك. يرجى التأكد من السماح بالوصول للموقع.');
                      }
                    );
                  } else {
                    alert('المتصفح لا يدعم تحديد الموقع الجغرافي');
                  }
                }}
                className="w-full px-4 py-3 bg-gradient-to-r from-teal-600 to-teal-700 text-white rounded-lg hover:from-teal-700 hover:to-teal-800 transition-all duration-200 flex items-center justify-center gap-2 font-medium shadow-sm"
              >
                <FaMapMarkerAlt className="w-4 h-4" />
                تحديد موقعي الحالي
              </button>
            </div>
          </div>

          {/* Map */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FaGlobeAmericas className="w-4 h-4 text-green-600" />
                <h5 className="font-medium text-slate-800">الموقع على الخريطة</h5>
              </div>
            </div>

            <MapPicker
              latitude={parseFloat(addressValues.latitude) || 30.0444}
              longitude={parseFloat(addressValues.longitude) || 31.2357}
              onLocationChange={handleMapLocationChange}
              disabled={false}
            />
          </div>
        </div>

        {/* Success Message */}
        {(success.personalInfo || success.address || success.profileImage) && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-700 font-medium flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              تم حفظ التغييرات بنجاح!
            </p>
          </div>
        )}

        {/* Error Message */}
        {(error.personalInfo || error.address || error.profileImage) && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700 font-medium">
              حدث خطأ أثناء الحفظ: {error.personalInfo || error.address || error.profileImage}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonalInfoSection;
