// src/components/ui/Select.jsx
import React, { forwardRef } from 'react';

const Select = forwardRef(
  (
    {
      label,
      options = [],
      placeholder = 'اختر...',
      error,
      className = '',
      ...props
    },
    ref
  ) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-semibold text-gray-700">
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={`
            w-full px-4 py-3 bg-gray-50 border-2 rounded-xl 
            transition-all duration-200 focus:outline-none focus:bg-white
            ${
              error
                ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                : 'border-gray-200 focus:border-teal-600 focus:ring-2 focus:ring-teal-100'
            }
            ${className}
          `}
          {...props}
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;