import React from 'react';
import { FaUpload, FaFileImage, FaTimes } from 'react-icons/fa';
import { 
  DOCUMENT_STATUS, 
  DOCUMENT_STATUS_LABELS, 
  DOCUMENT_STATUS_COLORS 
} from '@/features/verifier/constants/verifierConstants';

/**
 * DocumentUpload Component
 * Component for uploading single document with preview
 * 
 * @param {string} name - Field name
 * @param {string} label - Display label
 * @param {boolean} required - Is field required
 * @param {string} preview - Preview URL
 * @param {boolean} disabled - Is upload disabled
 * @param {function} handleChange - Parent change handler
 * @param {string} status - Document status (not_submitted, pending, approved, rejected, clarification_needed)
 */
const DocumentUpload = ({ 
  name, 
  label, 
  required = false, 
  preview, 
  disabled = false,
  handleChange,
  status = null
}) => {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && handleChange) {
      const syntheticEvent = {
        target: {
          name: name,
          files: [file],
          type: 'file'
        }
      };
      handleChange(syntheticEvent);
    }
    e.target.value = '';
  };

  const handleRemove = () => {
    if (handleChange) {
      const syntheticEvent = {
        target: {
          name: name,
          value: null,
          type: 'text'
        }
      };
      handleChange(syntheticEvent);
      
      const previewFieldName = name.replace('Photo', 'Preview');
      const previewEvent = {
        target: {
          name: previewFieldName,
          value: null,
          type: 'text'
        }
      };
      handleChange(previewEvent);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm font-bold text-slate-800">
          <div className="w-6 h-6 bg-red-100 rounded-lg flex items-center justify-center">
            <FaFileImage className="w-3 h-3 text-red-600" />
          </div>
          <span>{label}</span>
          {required && <span className="text-red-500 text-base">*</span>}
        </label>
        
        {/* Status Badge - Teal Glass Style */}
        {status && (
          <span className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold backdrop-blur-md border border-teal-400/40 shadow-md whitespace-nowrap bg-gradient-to-r from-teal-500/25 via-cyan-500/25 to-emerald-500/25 text-teal-700">
            <span className="tracking-wide">{DOCUMENT_STATUS_LABELS[status]}</span>
          </span>
        )}
      </div>
      
      {!preview ? (
        <div className="relative">
          <input
            type="file"
            name={name}
            className="hidden"
            onChange={handleFileChange}
            accept="image/*,.pdf"
            disabled={disabled}
            id={`document-upload-${name}`}
          />
          <label
            htmlFor={`document-upload-${name}`}
            className={`w-full h-32 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all duration-200 ${
              disabled 
                ? 'border-slate-200 bg-slate-50 cursor-not-allowed opacity-60' 
                : 'border-slate-300 hover:border-emerald-400 bg-white hover:bg-emerald-50 cursor-pointer'
            }`}
          >
            <FaUpload className={`w-6 h-6 mb-2 ${disabled ? 'text-slate-400' : 'text-slate-500'}`} />
            <p className={`text-sm ${disabled ? 'text-slate-400' : 'text-slate-600'}`}>
              {disabled ? 'فعّل وضع التعديل لرفع الملف' : 'انقر لرفع الملف'}
            </p>
          </label>
        </div>
      ) : (
        <div className="relative group">
          <div className="w-full h-32 rounded-2xl overflow-hidden border border-slate-200">
            <img 
              src={preview} 
              alt={`معاينة ${label}`}
              className="w-full h-full object-cover"
            />
          </div>
          {!disabled && (
            <button
              type="button"
              onClick={handleRemove}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
            >
              <FaTimes className="w-3 h-3" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default DocumentUpload;
