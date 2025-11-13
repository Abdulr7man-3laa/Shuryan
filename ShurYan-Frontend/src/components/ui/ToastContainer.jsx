// src/components/ui/ToastContainer.jsx
import React from 'react';
import { useToastStore } from '@/hooks/useToast';
import Toast from './Toast';

/**
 * Toast Container Component
 * Displays all active toasts
 */
const ToastContainer = () => {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed top-4 left-4 z-50 space-y-3 pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={() => removeToast(toast.id)}
          />
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
