// src/components/common/Combobox.jsx
import React, { useState } from 'react';
import PropTypes from 'prop-types';

/**
 * Field wrapper component
 */
export const Field = ({ children, className = '' }) => {
  return <div className={`relative ${className}`}>{children}</div>;
};

Field.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

/**
 * ComboboxLabel component for option labels
 */
export const ComboboxLabel = ({ children }) => {
  return <span>{children}</span>;
};

ComboboxLabel.propTypes = {
  children: PropTypes.node.isRequired,
};

/**
 * ComboboxOption component for individual options
 */
export const ComboboxOption = ({ value, children }) => {
  return <div data-value={value}>{children}</div>;
};

ComboboxOption.propTypes = {
  value: PropTypes.any.isRequired,
  children: PropTypes.node.isRequired,
};

/**
 * Combobox component - Simple select dropdown
 */
export const Combobox = ({
  name,
  options = [],
  displayValue,
  value,
  defaultValue,
  onChange,
  disabled = false,
  placeholder = 'اختر...',
  children,
}) => {
  // Use controlled value if provided, otherwise use internal state
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue);
  const selectedValue = isControlled ? value : internalValue;

  const handleChange = (e) => {
    const selectedOption = options.find(
      (opt) => displayValue(opt) === e.target.value
    );
    
    // Update internal state if uncontrolled
    if (!isControlled) {
      setInternalValue(selectedOption);
    }
    
    // Call parent onChange with synthetic event
    if (onChange) {
      onChange({
        target: {
          name,
          value: selectedOption,
        },
      });
    }
  };

  return (
    <select
      name={name}
      value={selectedValue ? displayValue(selectedValue) : ''}
      onChange={handleChange}
      disabled={disabled}
      className={`w-full px-4 py-4 border rounded-2xl text-right font-medium transition-all duration-200 ${
        disabled
          ? 'border-slate-200 bg-slate-50 text-slate-700 cursor-not-allowed'
          : 'border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white hover:border-emerald-300'
      } ${selectedValue ? 'text-slate-900' : 'text-slate-500'}`}
    >
      <option value="" disabled>
        {placeholder}
      </option>
      {options.map((option, index) => (
        <option key={index} value={displayValue(option)}>
          {displayValue(option)}
        </option>
      ))}
    </select>
  );
};

Combobox.propTypes = {
  name: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  displayValue: PropTypes.func.isRequired,
  value: PropTypes.any,
  defaultValue: PropTypes.any,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  placeholder: PropTypes.string,
  children: PropTypes.func,
};
