import { useState, useEffect, useRef } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaCamera, FaCheckCircle, FaExclamationCircle, FaSpinner } from 'react-icons/fa';
import useLaboratoryProfile from '../../hooks/useLaboratoryProfile';

/**
 * BasicInfoSection Component
 * Displays and manages laboratory basic information with auto-save
 */
const BasicInfoSection = () => {
  const {
    basicInfo,
    loading,
    error,
    success,
    updateBasicInfo,
    updateProfileImage,
  } = useLaboratoryProfile({ autoFetch: false });

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
  });

  // Profile image state
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  // Auto-save state
  const [autoSaveStatus, setAutoSaveStatus] = useState(''); // '', 'pending', 'saving', 'saved', 'error'
  const hasChangesRef = useRef(false);
  const lastSavedDataRef = useRef(null);
  const autoSaveTimeoutRef = useRef(null);

  // Initialize form data
  useEffect(() => {
    if (basicInfo) {
      const initialData = {
        name: basicInfo.name || '',
        phoneNumber: basicInfo.phoneNumber || '',
      };
      setFormData(initialData);
      lastSavedDataRef.current = JSON.stringify(initialData);
      setProfileImagePreview(basicInfo.profileImageUrl);
    }
  }, [basicInfo]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    hasChangesRef.current = true;
    setAutoSaveStatus('pending');
  };

  // Handle image selection
  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('يرجى اختيار صورة صحيحة');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('حجم الصورة يجب أن يكون أقل من 5 ميجابايت');
      return;
    }

    setProfileImageFile(file);
    setProfileImagePreview(URL.createObjectURL(file));
    hasChangesRef.current = true;
    setAutoSaveStatus('pending');
  };

  // Auto-save function
  const performAutoSave = async () => {
    const currentData = JSON.stringify(formData);
    const hasInfoChanges = currentData !== lastSavedDataRef.current;

    if (!hasInfoChanges && !profileImageFile) {
      setAutoSaveStatus('');
      return;
    }

    setAutoSaveStatus('saving');

    try {
      const promises = [];

      // Update basic info if changed
      if (hasInfoChanges) {
        promises.push(updateBasicInfo(formData));
      }

      // Upload image if selected
      if (profileImageFile) {
        promises.push(updateProfileImage(profileImageFile));
      }

      const results = await Promise.allSettled(promises);
      const allSuccess = results.every((r) => r.status === 'fulfilled' && r.value?.success);

      if (allSuccess) {
        lastSavedDataRef.current = currentData;
        setProfileImageFile(null);
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
      }, 3000); // 3 seconds delay
    }

    return () => clearTimeout(autoSaveTimeoutRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData, profileImageFile]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (profileImagePreview && profileImagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(profileImagePreview);
      }
    };
  }, [profileImagePreview]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-500 to-emerald-500 px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <FaUser className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white">المعلومات الأساسية</h2>
              <p className="text-teal-50 text-sm mt-1">معلومات المختبر الأساسية</p>
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Image */}
          <div className="lg:col-span-1">
            <div className="flex flex-col items-center">
              <div className="relative group">
                <div className="w-48 h-48 rounded-2xl overflow-hidden border-4 border-teal-100 shadow-lg">
                  {profileImagePreview ? (
                    <img
                      src={profileImagePreview}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-teal-50 to-emerald-50 flex items-center justify-center">
                      <FaUser className="w-20 h-20 text-teal-300" />
                    </div>
                  )}
                </div>

                {/* Upload overlay */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={loading.profileImage}
                  className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 disabled:cursor-not-allowed"
                >
                  {loading.profileImage ? (
                    <FaSpinner className="w-8 h-8 text-white animate-spin" />
                  ) : (
                    <div className="text-center">
                      <FaCamera className="w-8 h-8 text-white mx-auto mb-2" />
                      <span className="text-white text-sm font-semibold">تغيير الصورة</span>
                    </div>
                  )}
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
              </div>

              {error.profileImage && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600 text-center">{error.profileImage}</p>
                </div>
              )}
            </div>
          </div>

          {/* Form Fields */}
          <div className="lg:col-span-2 space-y-6">
            {/* Name & Phone Number - Same Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  اسم المختبر <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FaUser className="absolute right-4 top-1/2 -translate-y-1/2 text-teal-500 w-5 h-5" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="أدخل اسم المختبر"
                    className="w-full pr-12 pl-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  رقم الهاتف <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FaPhone className="absolute right-4 top-1/2 -translate-y-1/2 text-teal-500 w-5 h-5" />
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="01xxxxxxxxx"
                    className="w-full pr-12 pl-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Email (Read-only) */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                البريد الإلكتروني
              </label>
              <div className="relative">
                <FaEnvelope className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="email"
                  value={basicInfo?.email || ''}
                  disabled
                  className="w-full pr-12 pl-4 py-3 border border-slate-200 rounded-xl bg-slate-50 text-slate-500 cursor-not-allowed"
                />
              </div>
            </div>

            {/* Error Messages */}
            {error.basicInfo && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-sm text-red-600">{error.basicInfo}</p>
              </div>
            )}

            {/* Success Messages */}
            {success.basicInfo && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                <p className="text-sm text-green-600 flex items-center gap-2">
                  <FaCheckCircle />
                  {success.basicInfo}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicInfoSection;
