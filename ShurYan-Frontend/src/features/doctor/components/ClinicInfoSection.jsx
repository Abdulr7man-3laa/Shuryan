import React, { useState, useEffect, useRef } from 'react';
import { useClinic } from '../hooks/useClinic';
import { useClinicForm } from '../hooks/useClinicForm';
import { CLINIC_SERVICES, EGYPTIAN_GOVERNORATES } from '@/utils/constants';
import { 
  convertFromPhoneNumbersArray, 
  convertToPhoneNumbersArray,
  PhoneType 
} from '../utils/phoneHelpers';
import MapPicker from '@/components/common/MapPicker';
import '@/styles/leaflet-custom.css';
import { 
  FaHospital, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaCamera, 
  FaMap,
  FaTags,
  FaBuilding,
  FaGlobeAmericas,
  FaTrash
} from 'react-icons/fa';

/**
 * Clinic Info Section Component
 * 
 * Displays and manages:
 * - Clinic name
 * - 3 phone numbers (2 mobile + 1 landline)
 * - Available services (multi-select checkboxes)
 * - Clinic address (governorate, city, street, building)
 * - Map coordinates (latitude, longitude)
 * - Clinic images (up to 6 images)
 * 
 * Features:
 * - Edit mode toggle
 * - Real-time validation
 * - Optimistic updates
 * - Error handling
 * - Map modal for coordinates
 */
const ClinicInfoSection = () => {
  const {
    clinicInfo,
    clinicAddress,
    clinicImages,
    loading,
    error,
    success,
    updateInfo,
    updateAddress,
    uploadImage,
    deleteImage,
    clearErrors,
    refreshAll,
  } = useClinic({ autoFetch: true });

  const [isEditing, setIsEditing] = useState(false);
  const [selectedServices, setSelectedServices] = useState([]);
  const [localImages, setLocalImages] = useState([]);
  const isEditingRef = useRef(false);
  const hasInitializedInfoRef = useRef(false);
  const hasInitializedAddressRef = useRef(false);
  
  // Auto-save states
  const [autoSaveStatus, setAutoSaveStatus] = useState(''); // '', 'saving', 'saved'
  const autoSaveTimeoutRef = useRef(null);
  const lastSavedDataRef = useRef(null);
  const isRefreshingRef = useRef(false); // Flag to prevent auto-save during refresh
  const [triggerAddressFetch, setTriggerAddressFetch] = useState(false); // Trigger address fetch from map

  // Debug: Component mount
  useEffect(() => {
    console.log('🚀 ClinicInfoSection mounted');
    console.log('📦 SessionStorage on mount:', {
      services: sessionStorage.getItem('clinic-editing-services'),
      address: sessionStorage.getItem('clinic-editing-address')
    });
    
    return () => {
      console.log('👋 ClinicInfoSection unmounting');
    };
  }, []);

  // Initialize form for clinic info
  const {
    values: infoValues,
    handleChange: handleInfoChange,
    setFormValues: setInfoFormValues,
  } = useClinicForm({
    clinicName: '',
    clinicPhone1: '',
    clinicPhone2: '',
    clinicLandline: '',
    services: [],
  });

  // Initialize form for address
  const {
    values: addressValues,
    handleChange: handleAddressChange,
    setFormValues: setAddressFormValues,
  } = useClinicForm({
    governorate: '',
    city: '',
    street: '',
    buildingNumber: '',
    latitude: '',
    longitude: '',
  });

  // Debug: Watch addressValues changes
  useEffect(() => {
    console.log('👀 Component: addressValues changed:', addressValues);
    console.log('👀 Component: addressValues.latitude:', addressValues.latitude, 'Type:', typeof addressValues.latitude);
    console.log('👀 Component: addressValues.longitude:', addressValues.longitude, 'Type:', typeof addressValues.longitude);
  }, [addressValues]);

  // Update forms when data changes
  useEffect(() => {
    console.log('🔍 Info useEffect triggered:', {
      hasClinicInfo: !!clinicInfo,
      isEditingRef: isEditingRef.current,
      hasInitialized: hasInitializedInfoRef.current
    });

    if (clinicInfo && !isEditingRef.current) {
      // Convert phoneNumbers array to old format for form
      const phones = convertFromPhoneNumbersArray(clinicInfo.phoneNumbers);
      
      // Always use API data (no sessionStorage)
      const servicesToUse = clinicInfo.services || [];
      
      setInfoFormValues({
        clinicName: clinicInfo.clinicName || '',
        clinicPhone1: phones.phone1 || '',
        clinicPhone2: phones.phone2 || '',
        clinicLandline: phones.landline || '',
        services: servicesToUse,
      });
      setSelectedServices(servicesToUse);
      
      if (!hasInitializedInfoRef.current) {
        hasInitializedInfoRef.current = true; // Mark as initialized
        console.log('✅ Initialized with services:', servicesToUse.length);
      }
    }
  }, [clinicInfo, setInfoFormValues]);

  // Watch for clinicAddress changes and update form
  useEffect(() => {
    console.log('🔍 Component: Address useEffect triggered:', {
      hasClinicAddress: !!clinicAddress,
      governorate: clinicAddress?.governorate,
      city: clinicAddress?.city,
      street: clinicAddress?.street,
      latitude: clinicAddress?.latitude,
      longitude: clinicAddress?.longitude,
      isEditingRef: isEditingRef.current,
      hasInitialized: hasInitializedAddressRef.current
    });

    // Initialize when address data is available and not editing
    if (clinicAddress && !isEditingRef.current) {
      
      console.log('🔍 Component: Initializing address from store:', clinicAddress);
      
      // Always use API data (no sessionStorage)
      const addressToUse = {
        governorate: clinicAddress.governorate || '',
        city: clinicAddress.city || '',
        street: clinicAddress.street || '',
        buildingNumber: clinicAddress.buildingNumber || '',
        latitude: clinicAddress.latitude ? String(clinicAddress.latitude) : '',
        longitude: clinicAddress.longitude ? String(clinicAddress.longitude) : '',
      };
      
      console.log('✅ Component: Setting address to:', addressToUse);
      
      setAddressFormValues(addressToUse);
      
      if (!hasInitializedAddressRef.current) {
        hasInitializedAddressRef.current = true;
        console.log('✅ Component: Address form initialized!');
      }
    }
  }, [
    clinicAddress?.governorate,
    clinicAddress?.city,
    clinicAddress?.street,
    clinicAddress?.buildingNumber,
    clinicAddress?.latitude, 
    clinicAddress?.longitude,
    setAddressFormValues
  ]);

  useEffect(() => {
    if (clinicImages && !isEditingRef.current) {
      // Only update when NOT editing to preserve local changes
      setLocalImages(clinicImages);
    }
  }, [clinicImages]);

  // Handle service change
  const handleServiceChange = (service) => {
    const isSelected = selectedServices.some(s => s.id === service.id);
    
    let newServices;
    if (isSelected) {
      // Remove service (deselect)
      newServices = selectedServices.filter(s => s.id !== service.id);
    } else {
      // Add service (select)
      newServices = [...selectedServices, service];
    }
    
    setSelectedServices(newServices);
    
    // Save to sessionStorage while editing
    if (isEditingRef.current) {
      sessionStorage.setItem('clinic-editing-services', JSON.stringify(newServices));
    }
  };

  // Handle governorate change
  const handleGovernorateChange = (governorate) => {
    handleAddressChange({
      target: {
        name: 'governorate',
        value: governorate.label
      }
    });
  };

  // Handle clinic image change
  const handleClinicImageChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Check limit
    if (localImages.length + files.length > 6) {
      alert('لا يمكن إضافة أكثر من 6 صور');
      return;
    }

    // Upload images with correct order
    let currentOrder = localImages.length; // Start from current length
    
    console.log('📸 Starting upload for', files.length, 'images. Starting order:', currentOrder);
    
    for (const file of files) {
      console.log('📤 Uploading image:', file.name, 'with order:', currentOrder);
      const result = await uploadImage(file, currentOrder);
      
      if (result.success) {
        console.log('✅ Image uploaded successfully:', file.name, 'order:', currentOrder);
        
        // Add preview locally
        const reader = new FileReader();
        reader.onloadend = () => {
          setLocalImages(prev => [...prev, {
            preview: reader.result,
            file: file,
            order: currentOrder
          }]);
        };
        reader.readAsDataURL(file);
        
        // Increment order for next image
        currentOrder++;
      } else {
        console.error('❌ Failed to upload image:', file.name);
      }
    }
    
    console.log('✅ All images uploaded. Final order:', currentOrder);
  };

  // Remove clinic image
  const removeClinicImage = async (index) => {
    const image = localImages[index];
    
    if (image.id) {
      const result = await deleteImage(image.id);
      if (result.success) {
        setLocalImages(prev => prev.filter((_, i) => i !== index));
      }
    } else {
      setLocalImages(prev => prev.filter((_, i) => i !== index));
    }
  };

  // Handle cancel
  const handleCancel = () => {
    // Clear sessionStorage
    sessionStorage.removeItem('clinic-editing-services');
    sessionStorage.removeItem('clinic-editing-address');
    
    // Reset forms to original data from store
    if (clinicInfo) {
      const phones = convertFromPhoneNumbersArray(clinicInfo.phoneNumbers);
      setInfoFormValues({
        clinicName: clinicInfo.clinicName || '',
        clinicPhone1: phones.phone1 || '',
        clinicPhone2: phones.phone2 || '',
        clinicLandline: phones.landline || '',
        services: clinicInfo.services || [],
      });
      setSelectedServices(clinicInfo.services || []);
    }

    if (clinicAddress) {
      setAddressFormValues({
        governorate: clinicAddress.governorate || '',
        city: clinicAddress.city || '',
        street: clinicAddress.street || '',
        buildingNumber: clinicAddress.buildingNumber || '',
        latitude: clinicAddress.latitude || '',
        longitude: clinicAddress.longitude || '',
      });
    }

    if (clinicImages) {
      setLocalImages(clinicImages);
    }

    setIsEditing(false);
    isEditingRef.current = false;
    clearErrors();
  };

  // Handle edit toggle
  const handleEditToggle = async () => {
    if (isEditing) {
      console.log('💾 Saving data...');
      console.log('📍 Address values to save:', addressValues);
      
      // Convert form values to phoneNumbers array
      const phoneNumbers = convertToPhoneNumbersArray({
        phone1: infoValues.clinicPhone1,
        phone2: infoValues.clinicPhone2,
        landline: infoValues.clinicLandline,
      });

      // Save all data
      const infoResult = await updateInfo({
        clinicName: infoValues.clinicName,
        phoneNumbers: phoneNumbers,
        services: selectedServices,
      });

      const addressData = {
        governorate: addressValues.governorate,
        city: addressValues.city,
        street: addressValues.street,
        buildingNumber: addressValues.buildingNumber,
        latitude: parseFloat(addressValues.latitude) || 0,
        longitude: parseFloat(addressValues.longitude) || 0,
      };
      
      console.log('📤 Sending address data:', addressData);
      console.log('📊 Data types:', {
        latitude: typeof addressData.latitude,
        longitude: typeof addressData.longitude
      });
      
      const addressResult = await updateAddress(addressData);

      console.log('✅ Save results:', { infoResult, addressResult });

      if (infoResult.success && addressResult.success) {
        // Clear sessionStorage after successful save
        console.log('🗑️ Clearing sessionStorage');
        sessionStorage.removeItem('clinic-editing-services');
        sessionStorage.removeItem('clinic-editing-address');
        setIsEditing(false);
        isEditingRef.current = false;
        console.log('✅ Save complete!');
      }
    } else {
      console.log('✏️ Starting edit mode');
      console.log('📍 Current address values:', addressValues);
      setIsEditing(true);
      isEditingRef.current = true;
      // Save current data to sessionStorage when starting edit
      sessionStorage.setItem('clinic-editing-services', JSON.stringify(selectedServices));
      sessionStorage.setItem('clinic-editing-address', JSON.stringify(addressValues));
      console.log('💾 Saved initial state to sessionStorage');
    }
  };

  // Combine all values for easier access
  const formData = {
    ...infoValues,
    ...addressValues,
    services: selectedServices,
  };
  
  // Debug: Log formData on every render
  console.log('🎨 RENDER: formData:', formData);
  console.log('🎨 RENDER: infoValues:', infoValues);
  console.log('🎨 RENDER: addressValues:', addressValues);
  console.log('🎨 RENDER: Can type?', {
    hasClinicName: !!formData.clinicName,
    clinicNameValue: formData.clinicName,
    hasPhone1: !!formData.clinicPhone1,
    phone1Value: formData.clinicPhone1
  });

  // Debug: Watch formData changes
  useEffect(() => {
    console.log('📊 Component: FormData updated:', {
      latitude: formData.latitude,
      longitude: formData.longitude,
      governorate: formData.governorate,
      city: formData.city,
      latType: typeof formData.latitude,
      lngType: typeof formData.longitude,
      latValue: formData.latitude,
      lngValue: formData.longitude,
      latIsEmpty: formData.latitude === '',
      lngIsEmpty: formData.longitude === '',
      addressValuesLat: addressValues.latitude,
      addressValuesLng: addressValues.longitude
    });
  }, [formData.latitude, formData.longitude, addressValues.latitude, addressValues.longitude]);

  // Handle change wrapper
  const handleChange = (e) => {
    const { name } = e.target;
    
    // Check if it's an info field or address field
    if (['clinicName', 'clinicPhone1', 'clinicPhone2', 'clinicLandline'].includes(name)) {
      handleInfoChange(e);
    } else {
      handleAddressChange(e);
    }
  };

  // Auto-save function
  const performAutoSave = async () => {
    // Check if there are actual changes
    const currentData = JSON.stringify({ infoValues, addressValues, selectedServices });
    if (currentData === lastSavedDataRef.current) {
      return; // No changes
    }
    
    console.log('💾 [Auto-save] Starting auto-save...');
    setAutoSaveStatus('saving');
    
    try {
      // Convert form values to phoneNumbers array
      const phoneNumbers = convertToPhoneNumbersArray({
        phone1: infoValues.clinicPhone1,
        phone2: infoValues.clinicPhone2,
        landline: infoValues.clinicLandline,
      });

      // Save clinic info
      const infoResult = await updateInfo({
        clinicName: infoValues.clinicName,
        phoneNumbers: phoneNumbers,
        services: selectedServices,
      });

      // Save address
      const addressData = {
        governorate: addressValues.governorate,
        city: addressValues.city,
        street: addressValues.street,
        buildingNumber: addressValues.buildingNumber,
        latitude: parseFloat(addressValues.latitude) || 0,
        longitude: parseFloat(addressValues.longitude) || 0,
      };
      
      const addressResult = await updateAddress(addressData);

      if (infoResult.success && addressResult.success) {
        setAutoSaveStatus('saved');
        console.log('✅ [Auto-save] Saved successfully');
        
        // Clear sessionStorage after successful save
        console.log('🗑️ [Auto-save] Clearing sessionStorage');
        sessionStorage.removeItem('clinic-editing-services');
        sessionStorage.removeItem('clinic-editing-address');
        
        // Refresh data from API to ensure consistency
        console.log('🔄 [Auto-save] Refreshing data from API...');
        isRefreshingRef.current = true; // Set flag before refresh
        await refreshAll();
        console.log('✅ [Auto-save] Data refreshed');
        
        // Update lastSavedDataRef after refresh to prevent re-trigger
        setTimeout(() => {
          lastSavedDataRef.current = JSON.stringify({ infoValues, addressValues, selectedServices });
          isRefreshingRef.current = false; // Clear flag after update
          console.log('🔧 [Auto-save] Updated lastSavedDataRef after refresh');
        }, 200);
        
        // Clear status after 2 seconds
        setTimeout(() => setAutoSaveStatus(''), 2000);
      } else {
        throw new Error('فشل الحفظ');
      }
      
    } catch (error) {
      console.error('❌ [Auto-save] Error:', error);
      setAutoSaveStatus('');
    }
  };

  // Auto-save effect - triggers 3 seconds after changes
  useEffect(() => {
    // Skip if currently refreshing
    if (isRefreshingRef.current) {
      console.log('⏭️ [Auto-save] Skipping - currently refreshing');
      return;
    }
    
    // Skip if info not initialized yet (address can be empty)
    if (!hasInitializedInfoRef.current) {
      console.log('⏭️ [Auto-save] Skipping - info not initialized');
      return;
    }
    
    // Initialize lastSavedDataRef on first render
    if (!lastSavedDataRef.current) {
      lastSavedDataRef.current = JSON.stringify({ infoValues, addressValues, selectedServices });
      console.log('🔧 [Auto-save] Initialized lastSavedDataRef');
      return;
    }
    
    // Check if data actually changed
    const currentData = JSON.stringify({ infoValues, addressValues, selectedServices });
    if (currentData === lastSavedDataRef.current) {
      console.log('⏭️ [Auto-save] Skipping - no changes detected');
      return; // No real changes, skip auto-save
    }
    
    console.log('⏰ [Auto-save] Changes detected, will save in 3 seconds...');
    
    // Clear existing timeout
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }
    
    // Set new timeout for 3 seconds
    autoSaveTimeoutRef.current = setTimeout(() => {
      performAutoSave();
    }, 3000);
    
    // Cleanup
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [infoValues, addressValues, selectedServices]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Section Header */}
      <div className="bg-gradient-to-br from-teal-500 to-teal-600 px-6 py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
              <FaHospital className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">معلومات العيادة</h3>
              <p className="text-white/80 text-sm">
                بيانات العيادة ومعلومات الموقع والتواصل
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Auto-save Status Indicator */}
            {autoSaveStatus && (
              <div className={`px-4 py-2 backdrop-blur-sm rounded-lg transition-all ${
                autoSaveStatus === 'saving' ? 'bg-blue-500/30 text-blue-100' :
                autoSaveStatus === 'saved' ? 'bg-green-500/30 text-green-100' : ''
              }`}>
                <span className="text-sm font-medium">
                  {autoSaveStatus === 'saving' ? 'جاري الحفظ...' : 'تم الحفظ'}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      
      <div className="p-8 space-y-8">
        {/* Basic Information */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <FaBuilding className="w-5 h-5 text-blue-600" />
            <h4 className="text-lg font-semibold text-slate-800">المعلومات الأساسية</h4>
          </div>
          
          {/* Clinic Name */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              اسم العيادة *
            </label>
            <input
              type="text"
              name="clinicName"
              value={formData.clinicName || ''}
              onChange={handleChange}
              disabled={false}
              placeholder="أدخل اسم العيادة"
              className="w-full px-4 py-3 border border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg transition-all duration-200 text-right"
            />
          </div>

          {/* Phone Numbers */}
          <div className="mt-6">
            <div className="flex items-center gap-3 mb-4">
              <FaPhone className="w-4 h-4 text-blue-600" />
              <h5 className="font-medium text-slate-800">أرقام التواصل</h5>
              <span className="text-xs text-slate-500">(يجب إدخال رقم واحد على الأقل)</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-slate-600 mb-1">رقم الهاتف الأول *</label>
                <input
                  type="tel"
                  name="clinicPhone1"
                  value={formData.clinicPhone1 || ''}
                  onChange={handleChange}
                  disabled={false}
                  placeholder="01xxxxxxxxx"
                  className="w-full px-3 py-2 border border-blue-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 rounded-lg transition-all duration-200 text-left"
                  dir="ltr"
                />
              </div>
              
              <div>
                <label className="block text-sm text-slate-600 mb-1">رقم الهاتف الثاني</label>
                <input
                  type="tel"
                  name="clinicPhone2"
                  value={formData.clinicPhone2 || ''}
                  onChange={handleChange}
                  disabled={false}
                  placeholder="01xxxxxxxxx"
                  className="w-full px-3 py-2 border border-blue-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 rounded-lg transition-all duration-200 text-left"
                  dir="ltr"
                />
              </div>
              
              <div>
                <label className="block text-sm text-slate-600 mb-1">الخط الأرضي</label>
                <input
                  type="tel"
                  name="clinicLandline"
                  value={formData.clinicLandline || ''}
                  onChange={handleChange}
                  disabled={false}
                  placeholder="02xxxxxxxx"
                  className="w-full px-3 py-2 border border-blue-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 rounded-lg transition-all duration-200 text-left"
                  dir="ltr"
                />
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="mt-6">
            <label className="block text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2">
              <FaTags className="w-4 h-4 text-teal-600" />
              الخدمات المتاحة <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-slate-500 mb-4">
              اختر الخدمات التي تقدمها العيادة (يمكنك اختيار أكثر من خدمة)
            </p>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-2.5">
              {CLINIC_SERVICES.map((service) => {
                const isSelected = selectedServices.some(s => s.id === service.id);
                return (
                  <button
                    key={service.id}
                    type="button"
                    onClick={() => handleServiceChange(service)}
                    disabled={false}
                    className={`
                      group relative px-3 py-2 rounded-xl text-xs font-medium transition-all duration-300
                      flex items-center justify-center gap-1.5
                      border-2 backdrop-blur-sm
                      ${
                        isSelected
                          ? 'bg-gradient-to-br from-teal-500 to-emerald-600 text-white border-teal-400 shadow-lg shadow-teal-500/30 scale-[1.02]'
                          : 'bg-white/80 text-slate-700 border-slate-200 hover:border-teal-300 hover:bg-teal-50/50'
                      }
                      ${!isSelected && 'hover:scale-[1.02] hover:shadow-md cursor-pointer'}
                      ${isSelected && 'hover:shadow-xl hover:shadow-teal-500/40 cursor-pointer'}
                    `}
                  >
                    {isSelected && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-md">
                        <FaTags className="w-2 h-2 text-teal-600" />
                      </div>
                    )}
                    <span className="relative z-10">{service.label}</span>
                  </button>
                );
              })}
            </div>

            {selectedServices.length === 0 && isEditing && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-xs text-red-600 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                  يجب اختيار خدمة واحدة على الأقل
                </p>
              </div>
            )}

            {selectedServices.length > 0 && (
              <div className="mt-3 p-3 bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-200 rounded-lg">
                <p className="text-xs text-teal-700 font-medium flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-pulse"></span>
                  تم اختيار {selectedServices.length} خدمة
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Address Section */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <FaMapMarkerAlt className="w-5 h-5 text-green-600" />
            <h4 className="text-lg font-semibold text-slate-800">العنوان</h4>
          </div>
          
          {/* First Row: Governorate | City */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Governorate */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                المحافظة *
              </label>
              <input
                type="text"
                name="governorate"
                value={formData.governorate || ''}
                onChange={handleChange}
                disabled={true}
                placeholder="سيتم ملؤها تلقائياً من الخريطة"
                className="w-full px-3 py-2 border border-slate-300 bg-slate-50 text-slate-600 rounded-lg transition-all duration-200 text-right cursor-not-allowed"
              />
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                المدينة *
              </label>
              <input
                type="text"
                name="city"
                value={formData.city || ''}
                onChange={handleChange}
                disabled={true}
                placeholder="سيتم ملؤه تلقائياً من الخريطة"
                className="w-full px-3 py-2 border border-slate-300 bg-slate-50 text-slate-600 rounded-lg transition-all duration-200 text-right cursor-not-allowed"
              />
            </div>
          </div>

          {/* Second Row: Street (2/3) | Building Number (1/3) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Street - Takes 2 columns */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                الشارع *
              </label>
              <input
                type="text"
                name="street"
                value={formData.street || ''}
                onChange={handleChange}
                disabled={true}
                placeholder="سيتم ملؤه تلقائياً من الخريطة"
                className="w-full px-3 py-2 border border-slate-300 bg-slate-50 text-slate-600 rounded-lg transition-all duration-200 text-right cursor-not-allowed"
              />
            </div>

            {/* Building Number - Takes 1 column */}
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                رقم المبنى
              </label>
              <input
                type="text"
                name="buildingNumber"
                value={formData.buildingNumber || ''}
                onChange={handleChange}
                disabled={false}
                placeholder="رقم المبنى"
                className="w-full px-3 py-2 border border-blue-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 rounded-lg transition-all duration-200 text-right"
              />
            </div>
          </div>

          {/* Map Coordinates */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FaGlobeAmericas className="w-4 h-4 text-green-600" />
                <h5 className="font-medium text-slate-800">الإحداثيات</h5>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div>
                <label className="block text-sm text-slate-600 mb-1">خط الطول (Longitude)</label>
                <input
                  type="number"
                  step="any"
                  name="longitude"
                  value={formData.longitude || ''}
                  onChange={handleChange}
                  disabled={false}
                  placeholder="31.2357"
                  className="w-full px-3 py-2 border border-green-300 focus:border-green-500 focus:ring-1 focus:ring-green-200 rounded-lg transition-all duration-200 text-left"
                  dir="ltr"
                />
              </div>
              
              <div>
                <label className="block text-sm text-slate-600 mb-1">خط العرض (Latitude)</label>
                <input
                  type="number"
                  step="any"
                  name="latitude"
                  value={formData.latitude || ''}
                  onChange={handleChange}
                  disabled={false}
                  placeholder="30.0444"
                  className="w-full px-3 py-2 border border-green-300 focus:border-green-500 focus:ring-1 focus:ring-green-200 rounded-lg transition-all duration-200 text-left"
                  dir="ltr"
                />
              </div>
              
              {/* Get Current Location Button */}
              <div>
                <button
                  type="button"
                  onClick={() => {
                    if (navigator.geolocation) {
                      navigator.geolocation.getCurrentPosition(
                        (position) => {
                          const lat = position.coords.latitude;
                          const lng = position.coords.longitude;
                          
                          console.log('📍 Getting current location:', { lat, lng });
                          
                          // Update coordinates
                          handleAddressChange({ target: { name: 'latitude', value: lat } });
                          handleAddressChange({ target: { name: 'longitude', value: lng } });
                          
                          // Trigger address fetch from map
                          setTriggerAddressFetch(true);
                          setTimeout(() => setTriggerAddressFetch(false), 100);
                        },
                        (error) => {
                          console.error('Error getting location:', error);
                          alert('فشل الحصول على الموقع الحالي');
                        }
                      );
                    }
                  }}
                  disabled={false}
                  className="w-full px-4 py-2 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                  title="الحصول على موقعي الحالي"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  موقعي
                </button>
              </div>
            </div>

            {/* Interactive Map */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-slate-700">
                  <FaMap className="inline-block ml-2 text-green-600" />
                  تحديد الموقع على الخريطة
                </label>
                {formData.latitude && formData.longitude && (
                  <a
                    href={`https://www.google.com/maps?q=${formData.latitude},${formData.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    <FaGlobeAmericas className="w-4 h-4" />
                    فتح في Google Maps
                  </a>
                )}
              </div>
              
              <MapPicker
                latitude={formData.latitude && !isNaN(parseFloat(formData.latitude)) ? parseFloat(formData.latitude) : 30.0444}
                longitude={formData.longitude && !isNaN(parseFloat(formData.longitude)) ? parseFloat(formData.longitude) : 31.2357}
                triggerAddressFetch={triggerAddressFetch}
                onLocationChange={(lat, lng, addressDetails) => {
                  console.log('🗺️ Map location changed:', { lat, lng, addressDetails });
                  
                  // Update coordinates
                  handleAddressChange({
                    target: { name: 'latitude', value: lat }
                  });
                  handleAddressChange({
                    target: { name: 'longitude', value: lng }
                  });
                  
                  // Auto-fill address fields if available
                  if (addressDetails) {
                    if (addressDetails.governorate) {
                      handleAddressChange({
                        target: { name: 'governorate', value: addressDetails.governorate }
                      });
                    }
                    if (addressDetails.city) {
                      handleAddressChange({
                        target: { name: 'city', value: addressDetails.city }
                      });
                    }
                    if (addressDetails.street) {
                      handleAddressChange({
                        target: { name: 'street', value: addressDetails.street }
                      });
                    }
                  }
                  
                  // No need to save to sessionStorage - auto-save will handle it
                }}
                disabled={false}
              />
            </div>
          </div>
        </div>

        {/* Clinic Images */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <FaCamera className="w-5 h-5 text-purple-600" />
            <h4 className="text-lg font-semibold text-slate-800">صور العيادة</h4>
            <span className="text-xs text-slate-500">(حد أقصى 6 صور)</span>
          </div>
          
          <div className="mb-6">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleClinicImageChange}
              className="hidden"
              id="clinicImages"
              disabled={localImages.length >= 6}
            />
            <label
              htmlFor="clinicImages"
              className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-200 ${
                localImages.length >= 6
                  ? 'border-slate-300 bg-slate-100 cursor-not-allowed'
                  : 'border-purple-300 bg-purple-50 hover:bg-purple-100'
              }`}
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <FaCamera className={`w-8 h-8 mb-2 ${localImages.length >= 6 ? 'text-slate-400' : 'text-purple-500'}`} />
                <p className={`text-sm ${localImages.length >= 6 ? 'text-slate-400' : 'text-purple-600'}`}>
                  {localImages.length >= 6 ? 'تم الوصول للحد الأقصى' : 'اضغط لرفع صور العيادة'}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {localImages.length}/6 صور
                </p>
              </div>
            </label>
          </div>

          {/* Display Images */}
          {localImages && localImages.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {localImages.map((image, index) => (
                <div key={index} className="relative group">
                  <div className="aspect-square rounded-lg overflow-hidden bg-slate-100">
                    <img
                      src={image.preview || image.url}
                      alt={`صورة العيادة ${index + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeClinicImage(index)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors duration-200"
                  >
                    <FaTrash className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FaCamera className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">لم يتم رفع صور للعيادة بعد</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default ClinicInfoSection;
