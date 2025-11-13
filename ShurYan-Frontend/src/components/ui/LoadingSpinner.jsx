import React from 'react';
import { FaSpinner } from 'react-icons/fa';

const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'text-xl',
    md: 'text-3xl',
    lg: 'text-5xl',
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <FaSpinner className={`animate-spin text-teal-600 ${sizes[size]}`} />
    </div>
  );
};

export default LoadingSpinner;