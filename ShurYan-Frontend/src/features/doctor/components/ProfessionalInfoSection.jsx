import React, { useMemo } from 'react';
import { FaFileImage, FaBriefcaseMedical, FaPaperPlane, FaStethoscope } from 'react-icons/fa';
import { Field, Combobox, ComboboxOption, ComboboxLabel } from '@/components/common/Combobox';
import DocumentUpload from './DocumentUpload';
import MultiDocumentUpload from './MultiDocumentUpload';

const ProfessionalInfoSection = ({ 
  formData, 
  handleChange, 
  specialtyOptions = [],
  removeAwardsImage,
  removeResearchPapersImage,
  documentStatuses = {},
  onSubmitForReview,
  autoSaveStatus
}) => {

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      
      {/* Section Header */}
      <div className="bg-gradient-to-br from-teal-500 to-teal-600 px-6 py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
              <FaBriefcaseMedical className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">المعلومات المهنية</h3>
              <p className="text-white/80 text-sm">التخصص والخبرة والمستندات المهنية</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
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
            
            {/* Submit for Review Button */}
            {onSubmitForReview && (
              <button
                onClick={onSubmitForReview}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-600 hover:to-teal-600 shadow-md hover:shadow-lg"
              >
                <FaPaperPlane className="w-4 h-4" />
                <span>إرسال للمراجعة</span>
              </button>
            )}
          </div>
        </div>
      </div>
      
      <div className="p-8">
        <div className="space-y-8">
        
        {/* Basic Information */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h4 className="text-lg font-bold text-slate-800">المعلومات الأساسية</h4>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Specialty */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-bold text-slate-800">
                <div className="w-6 h-6 bg-teal-100 rounded-lg flex items-center justify-center">
                  <FaStethoscope className="w-3 h-3 text-teal-600" />
                </div>
                <span>التخصص الطبي</span>
                <span className="text-red-500 text-base">*</span>
              </label>
              
              <div className="relative">
                <div>
                  <Field>
                    <Combobox 
                      name="specialty" 
                      options={specialtyOptions} 
                      displayValue={(option) => option?.name || ''} 
                      value={specialtyOptions.find(opt => opt.name === formData.specialty) || null}
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
        
            {/* Experience Years */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-bold text-slate-800">
                <div className="w-6 h-6 bg-orange-100 rounded-lg flex items-center justify-center">
                  <svg className="w-3 h-3 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span>سنوات الخبرة</span>
                <span className="text-red-500 text-base">*</span>
              </label>
              
              <div className="relative">
                <input
                  type="number"
                  name="experience"
                  min="0"
                  max="50"
                  disabled={false}
                  className={`w-full px-4 py-4 border rounded-2xl font-medium transition-all duration-200 border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white hover:border-emerald-300 ${formData.experience ? 'text-slate-900' : 'text-slate-500'}`}
                  value={formData.experience}
                  onChange={handleChange}
                  placeholder="عدد سنوات الخبرة في مجال الطب (مثال: 5)"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Required Documents */}
        <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-6 border border-red-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
              <FaFileImage className="w-4 h-4 text-red-600" />
            </div>
            <h4 className="text-lg font-bold text-slate-800">المستندات المطلوبة</h4>
            <span className="text-red-500 text-base">*</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {useMemo(() => (
              <DocumentUpload
                key="nationalIdPhoto"
                name="nationalIdPhoto"
                label="البطاقة الشخصية"
                required={true}
                preview={formData.nationalIdPreview}
                disabled={false}
                handleChange={handleChange}
                status={documentStatuses.nationalId}
              />
            ), [formData.nationalIdPreview, handleChange, documentStatuses.nationalId])}
            
            {useMemo(() => (
              <DocumentUpload
                key="medicalLicensePhoto"
                name="medicalLicensePhoto"
                label="رخصة مزاولة المهنة"
                required={true}
                preview={formData.medicalLicensePreview}
                disabled={false}
                handleChange={handleChange}
                status={documentStatuses.medicalLicense}
              />
            ), [formData.medicalLicensePreview, handleChange, documentStatuses.medicalLicense])}
            
            {useMemo(() => (
              <DocumentUpload
                key="syndicateMembershipPhoto"
                name="syndicateMembershipPhoto"
                label="عضوية النقابة"
                required={true}
                preview={formData.syndicateMembershipPreview}
                disabled={false}
                handleChange={handleChange}
                status={documentStatuses.syndicateMembership}
              />
            ), [formData.syndicateMembershipPreview, handleChange, documentStatuses.syndicateMembership])}
            
            {useMemo(() => (
              <DocumentUpload
                key="graduationCertificatePhoto"
                name="graduationCertificatePhoto"
                label="شهادة التخرج"
                required={true}
                preview={formData.graduationCertificatePreview}
                disabled={false}
                handleChange={handleChange}
                status={documentStatuses.graduationCertificate}
              />
            ), [formData.graduationCertificatePreview, handleChange, documentStatuses.graduationCertificate])}
            
            {useMemo(() => (
              <DocumentUpload
                key="specializationCertificatePhoto"
                name="specializationCertificatePhoto"
                label="شهادة التخصص"
                required={false}
                preview={formData.specializationCertificatePreview}
                disabled={false}
                handleChange={handleChange}
                status={documentStatuses.specializationCertificate}
              />
            ), [formData.specializationCertificatePreview, handleChange, documentStatuses.specializationCertificate])}
          </div>
        </div>
        
        {/* Additional Documents */}
        <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-6 border border-amber-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
              <FaFileImage className="w-4 h-4 text-amber-600" />
            </div>
            <h4 className="text-lg font-bold text-slate-800">معلومات إضافية</h4>
            <span className="text-xs text-slate-500 bg-slate-200 px-2 py-1 rounded-full">اختياري</span>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <MultiDocumentUpload
              name="awardsImages"
              label="الجوائز والشهادات"
              maxFiles={3}
              files={formData.awardsImages || []}
              disabled={false}
              handleChange={handleChange}
              onRemove={removeAwardsImage}
            />
            
            <MultiDocumentUpload
              name="researchPapersImages"
              label="الأوراق البحثية"
              maxFiles={3}
              files={formData.researchPapersImages || []}
              disabled={false}
              handleChange={handleChange}
              onRemove={removeResearchPapersImage}
            />
          </div>
        </div>
        
        </div>
      </div>
    </div>
  );
};

export default ProfessionalInfoSection;
