import React from 'react';
import PropTypes from 'prop-types';
import { FaUserMd, FaEnvelope, FaPhone } from 'react-icons/fa';
import { Combobox, ComboboxLabel, ComboboxOption, Field } from '@/components/common/Combobox';
import CircularProfileImage from '@/components/common/CircularProfileImage';
import { GENDER_OPTIONS } from '@/utils/constants';

const PersonalInfoSection = ({ 
  formData,
  profileImagePreview,
  handleChange,
  autoSaveStatus
}) => {

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Section Header */}
      <div className="bg-gradient-to-br from-teal-500 to-teal-600 px-6 py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
              <FaUserMd className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">المعلومات الشخصية</h3>
              <p className="text-white/80 text-sm">
                البيانات الأساسية والشخصية للطبيب
              </p>
            </div>
          </div>
          
          {/* Auto-save Status Indicator */}
          {autoSaveStatus && (
            <div className={`px-4 py-2 rounded-full backdrop-blur-md border transition-all duration-300 ${
              autoSaveStatus === 'saving'
                ? 'bg-blue-500/20 border-blue-300/40 text-white'
                : autoSaveStatus === 'saved'
                ? 'bg-emerald-500/20 border-emerald-300/40 text-white'
                : 'bg-red-500/20 border-red-300/40 text-white'
            }`}>
              <span className="text-sm font-bold flex items-center gap-2">
                {autoSaveStatus === 'saving' && (
                  <>
                    <span className="animate-spin">⚙️</span>
                    <span>جاري الحفظ...</span>
                  </>
                )}
                {autoSaveStatus === 'saved' && (
                  <>
                    <span>تم الحفظ</span>
                  </>
                )}
                {autoSaveStatus === 'error' && (
                  <>
                    <span>⚠️</span>
                    <span>فشل الحفظ</span>
                  </>
                )}
              </span>
            </div>
          )}
        </div>
      </div>
      
      <div className="p-8">
        <div className="space-y-8">
          {/* Profile Picture Section */}
          <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-6 border border-slate-200">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h4 className="text-lg font-bold text-slate-800">الصورة الشخصية</h4>
                <span className="text-xs text-slate-500 bg-slate-200 px-2 py-1 rounded-full">اختيارية</span>
              </div>
              
              <div className="relative inline-block">
                <CircularProfileImage 
                  name="profilePicture"
                  onImageChange={handleChange}
                  initialImage={profileImagePreview}
                  initialFileName={formData.profilePicture?.name}
                  disabled={false}
                />
              </div>
              
              <p className="text-sm text-slate-600 mt-3 max-w-md mx-auto">
                صورة شخصية واضحة تساعد المرضى في التعرف عليك. يُفضل أن تكون صورة مهنية.
              </p>
            </div>
          </div>
        
          {/* Name Fields */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* First Name - Arabic RTL */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-bold text-slate-800">
                <div className="w-6 h-6 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <FaUserMd className="w-3 h-3 text-emerald-600" />
                </div>
                <span>الاسم الأول</span>
                <span className="text-red-500 text-base">*</span>
              </label>
              
              <div className="relative">
                <input
                  type="text"
                  name="firstName"
                  dir="rtl"
                  disabled={false}
                  className={`w-full px-4 py-4 border rounded-2xl text-right font-medium transition-all duration-200 border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white hover:border-emerald-300 ${formData.firstName ? 'text-slate-900' : 'text-slate-500'}`}
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="الاسم الأول كما هو مكتوب في البطاقة الشخصية أو جواز السفر"
                  required
                />
              </div>
            </div>
            
            {/* Last Name - Arabic RTL */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-bold text-slate-800">
                <div className="w-6 h-6 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <FaUserMd className="w-3 h-3 text-emerald-600" />
                </div>
                <span>الاسم الأخير</span>
                <span className="text-red-500 text-base">*</span>
              </label>
              
              <div className="relative">
                <input
                  type="text"
                  name="lastName"
                  dir="rtl"
                  disabled={false}
                  className={`w-full px-4 py-4 border rounded-2xl text-right font-medium transition-all duration-200 border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white hover:border-emerald-300 ${formData.lastName ? 'text-slate-900' : 'text-slate-500'}`}
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="اسم العائلة كما هو مكتوب في الوثائق الرسمية"
                  required
                />
              </div>
            </div>
          </div>
        
          {/* Contact Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Email - English LTR */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-bold text-slate-800">
                <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FaEnvelope className="w-3 h-3 text-blue-600" />
                </div>
                <span>البريد الإلكتروني</span>
                <span className="text-red-500 text-base">*</span>
              </label>
              
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  dir="ltr"
                  disabled={false}
                  className={`w-full rtl-placeholder px-4 py-4 border rounded-2xl text-left font-medium transition-all duration-200 border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white hover:border-emerald-300 ${formData.email ? 'text-slate-900' : 'text-slate-500'}`}
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="البريد الإلكتروني للتواصل وتسجيل الدخول"
                  required
                />
              </div>
            </div>
            
            {/* Phone Number - Numbers LTR */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-bold text-slate-800">
                <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center">
                  <FaPhone className="w-3 h-3 text-green-600" />
                </div>
                <span>رقم الهاتف</span>
                <span className="text-red-500 text-base">*</span>
              </label>
              
              <div className="relative">
                <input
                  type="tel"
                  name="phone"
                  dir="ltr"
                  disabled={false}
                  className={`w-full px-4 rtl-placeholder py-4 border rounded-2xl text-left font-medium transition-all duration-200 border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white hover:border-emerald-300 ${formData.phone ? 'text-slate-900' : 'text-slate-500'}`}
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="رقم الهاتف للتواصل مع المرضى"
                  required
                />
              </div>
            </div>
          </div>
        
          {/* Additional Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gender */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-bold text-slate-800">
                <div className="w-6 h-6 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <svg className="w-3 h-3 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <span>الجنس</span>
                <span className="text-xs text-slate-500 bg-slate-200 px-2 py-1 rounded-full">اختياري</span>
              </label>
              
              <div className="relative">
                <div className="">
                  <Field>
                    <Combobox 
                      name="gender" 
                      options={GENDER_OPTIONS} 
                      displayValue={(option) => option?.name || ''} 
                      value={GENDER_OPTIONS.find(opt => opt.name === formData.gender) || null}
                      onChange={handleChange}
                      disabled={false}
                    >
                      {(option) => (
                        <ComboboxOption value={option}>
                          <ComboboxLabel>{option.name}</ComboboxLabel>
                        </ComboboxOption>
                      )}
                    </Combobox>
                  </Field>
                </div>
              </div>
            </div>

            {/* Date of Birth */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-bold text-slate-800">
                <div className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg className="w-3 h-3 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <span>تاريخ الميلاد</span>
                <span className="text-xs text-slate-500 bg-slate-200 px-2 py-1 rounded-full">اختياري</span>
              </label>
              
              <div className="relative">
                <input
                  type="date"
                  name="dateOfBirth"
                  dir="ltr"
                  disabled={false}
                  className={`w-full px-4 py-4 border rounded-2xl font-medium transition-all duration-200 border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white hover:border-emerald-300 ${formData.dateOfBirth ? 'text-slate-900' : 'text-slate-500'}`}
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        
          {/* Professional Bio */}
          <div className="space-y-4">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-800">
              <div className="w-6 h-6 bg-teal-100 rounded-lg flex items-center justify-center">
                <svg className="w-3 h-3 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <span>نبذة تعريفية مهنية</span>
              <span className="text-xs text-slate-500 bg-slate-200 px-2 py-1 rounded-full">اختيارية</span>
            </label>
            
            <div className="relative">
              <textarea
                name="bio"
                rows="5"
                dir="rtl"
                disabled={false}
                className={`w-full px-4 py-4 border rounded-2xl text-right font-medium transition-all duration-200 resize-none border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white hover:border-emerald-300 ${formData.bio ? 'text-slate-900' : 'text-slate-500'}`}
                value={formData.bio}
                onChange={handleChange}
                placeholder="نبذة مختصرة عن خبراتك المهنية وتخصصك الطبي - ستظهر للمرضى عند البحث عن طبيب"
                maxLength="500"
              ></textarea>
              
              {/* Character Counter */}
              <div className="absolute bottom-3 left-3 text-xs text-slate-400">
                {formData.bio?.length || 0}/500
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// PropTypes for type checking
PersonalInfoSection.propTypes = {
  formData: PropTypes.object.isRequired,
  profileImagePreview: PropTypes.string,
  handleChange: PropTypes.func.isRequired,
  autoSaveStatus: PropTypes.string,
};

export default PersonalInfoSection;
