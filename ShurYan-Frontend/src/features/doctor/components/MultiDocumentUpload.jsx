import React from 'react';
import { FaUpload, FaFileImage, FaTimes, FaCheck } from 'react-icons/fa';

/**
 * MultiDocumentUpload Component
 * Component for uploading multiple documents with preview
 * 
 * @param {string} name - Field name
 * @param {string} label - Display label
 * @param {number} maxFiles - Maximum number of files allowed
 * @param {Array} files - Array of uploaded files with preview
 * @param {boolean} disabled - Is upload disabled
 * @param {function} handleChange - Parent change handler
 * @param {function} onRemove - Remove file handler
 */
const MultiDocumentUpload = ({ 
  name, 
  label, 
  maxFiles = 3, 
  files = [], 
  disabled = false,
  handleChange,
  onRemove = null
}) => {
  const handleMultiFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length > 0 && handleChange) {
      const remainingSlots = maxFiles - files.length;
      const filesToAdd = selectedFiles.slice(0, remainingSlots);
      
      if (filesToAdd.length > 0) {
        const syntheticEvent = {
          target: {
            name: name,
            files: filesToAdd,
            type: 'file',
            multiple: true
          }
        };
        handleChange(syntheticEvent);
      }
    }
    e.target.value = '';
  };

  const handleRemoveFile = (indexToRemove) => {
    if (onRemove) {
      onRemove(indexToRemove);
    }
  };

  return (
    <div className="space-y-4">
      <label className="flex items-center gap-2 text-sm font-bold text-slate-800">
        <div className="w-6 h-6 bg-amber-100 rounded-lg flex items-center justify-center">
          <FaFileImage className="w-3 h-3 text-amber-600" />
        </div>
        <span>{label}</span>
        <span className="text-xs text-slate-500 bg-slate-200 px-2 py-1 rounded-full">
          حد أقصى {maxFiles} ملفات
        </span>
      </label>
      
      {files.length < maxFiles && (
        <div className="relative">
          <input
            type="file"
            name={name}
            className="hidden"
            onChange={handleMultiFileChange}
            accept="image/*,.pdf"
            multiple
            disabled={disabled}
            id={`multi-file-${name}`}
          />
          <label
            htmlFor={`multi-file-${name}`}
            className={`w-full h-24 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all duration-200 ${
              disabled 
                ? 'border-slate-200 bg-slate-50 cursor-not-allowed opacity-60' 
                : 'border-amber-300 hover:border-amber-400 bg-amber-50 hover:bg-amber-100 cursor-pointer'
            }`}
          >
            <FaUpload className={`w-5 h-5 mb-1 ${disabled ? 'text-slate-400' : 'text-amber-600'}`} />
            <p className={`text-xs ${disabled ? 'text-slate-400' : 'text-amber-700'}`}>
              {disabled ? 'فعّل وضع التعديل' : `إضافة ملفات (${files.length}/${maxFiles})`}
            </p>
          </label>
        </div>
      )}
      
      {files.length >= maxFiles && !disabled && (
        <div className="w-full h-16 border-2 border-dashed border-green-300 bg-green-50 rounded-2xl flex flex-col items-center justify-center">
          <FaCheck className="w-4 h-4 mb-1 text-green-600" />
          <p className="text-xs text-green-700">
            تم الوصول للحد الأقصى ({maxFiles}/{maxFiles})
          </p>
        </div>
      )}
      
      {files.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {files.map((file, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square rounded-xl overflow-hidden border border-slate-200">
                <img 
                  src={file.preview} 
                  alt={`${label} ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              {!disabled && (
                <button
                  type="button"
                  onClick={() => handleRemoveFile(index)}
                  className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
                >
                  <FaTimes className="w-2 h-2" />
                </button>
              )}
              <p className="text-xs text-slate-500 mt-1 truncate">{file.name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiDocumentUpload;
