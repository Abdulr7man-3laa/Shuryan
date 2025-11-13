// src/components/common/CircularProfileImage.jsx
import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { FaUserMd } from 'react-icons/fa';

const CircularProfileImage = ({
  name,
  onImageChange,
  initialImage = null,
  initialFileName = null,
  disabled = false,
  size = 'large', // 'small', 'medium', 'large'
}) => {
  const fileInputRef = useRef(null);
  const [preview, setPreview] = useState(initialImage);
  const [fileName, setFileName] = useState(initialFileName);

  const sizeClasses = {
    small: 'w-20 h-20',
    medium: 'w-32 h-32',
    large: 'w-40 h-40',
  };

  const handleImageClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('الرجاء اختيار صورة فقط');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('حجم الصورة يجب أن يكون أقل من 5 ميجابايت');
        return;
      }

      setFileName(file.name);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);

      // Call parent onChange
      if (onImageChange) {
        onImageChange(e);
      }
    }
  };

  return (
    <div className="relative inline-block">
      {/* Image Container */}
      <div
        className={`${sizeClasses[size]} rounded-full overflow-hidden border-4 border-white shadow-2xl cursor-pointer ${
          disabled ? 'opacity-60 cursor-not-allowed' : ''
        }`}
        onClick={handleImageClick}
      >
        {preview ? (
          <img
            src={preview}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center">
            <FaUserMd className="w-1/2 h-1/2 text-white opacity-80" />
          </div>
        )}
      </div>


      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        name={name}
        accept="image/*"
        onChange={handleFileChange}
        disabled={disabled}
        className="hidden"
      />

      {/* File Name Display */}
      {fileName && (
        <p className="text-xs text-slate-600 mt-2 text-center max-w-[200px] truncate">
          {fileName}
        </p>
      )}
    </div>
  );
};

CircularProfileImage.propTypes = {
  name: PropTypes.string.isRequired,
  onImageChange: PropTypes.func.isRequired,
  initialImage: PropTypes.string,
  initialFileName: PropTypes.string,
  disabled: PropTypes.bool,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
};

export default CircularProfileImage;
