import { useState, useCallback } from 'react';

/**
 * Custom hook for clinic form management (Simplified - No Validation)
 * 
 * Features:
 * - Form state management
 * - Basic change handling
 * - Form values management
 * 
 * @param {Object} initialValues - Initial form values
 * @returns {Object} Form state and handlers
 */
export const useClinicForm = (initialValues = {}) => {
  const [values, setValues] = useState(initialValues);

  // Handle field change
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  // Set form values (for initialization)
  const setFormValues = useCallback((newValues) => {
    console.log('🔧 useClinicForm: setFormValues called with:', newValues);
    setValues(newValues);
    console.log('🔧 useClinicForm: setValues called!');
  }, []);

  // Reset form
  const resetForm = useCallback(() => {
    setValues(initialValues);
  }, [initialValues]);

  return {
    values,
    handleChange,
    setFormValues,
    resetForm,
  };
};
