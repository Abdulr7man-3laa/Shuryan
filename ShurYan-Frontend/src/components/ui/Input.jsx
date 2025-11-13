// src/components/ui/Input.jsx
import React, { forwardRef } from 'react';

const Input = forwardRef(
  (
    {
      label,
      error,
      className = '',
      rightIcon,
      leftIcon,
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
        <div className="relative">
          {rightIcon && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              {rightIcon}
            </div>
          )}
          <input
            ref={ref}
            className={`
              w-full px-4 py-3 bg-gray-50 border-2 rounded-xl 
              transition-all duration-200 focus:outline-none focus:bg-white
              ${
                error
                  ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100'
                  : 'border-gray-200 focus:border-teal-600 focus:ring-2 focus:ring-teal-100'
              }
              ${rightIcon ? 'pr-12' : ''}
              ${leftIcon ? 'pl-12' : ''}
              ${className}
            `}
            {...props}
          />
          {leftIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              {leftIcon}
            </div>
          )}
        </div>
        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;