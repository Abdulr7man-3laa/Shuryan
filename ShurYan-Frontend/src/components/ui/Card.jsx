// src/components/ui/Card.jsx
import React from 'react';

const Card = ({ children, className = '', hover = false, ...props }) => {
  return (
    <div
      className={`
        bg-white rounded-2xl shadow-md overflow-hidden
        transition-all duration-200
        ${hover ? 'hover:shadow-lg hover:-translate-y-1' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;