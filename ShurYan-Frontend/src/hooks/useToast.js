// src/hooks/useToast.js
import { create } from 'zustand';

/**
 * Toast Store
 * Manages toast notifications state
 */
export const useToastStore = create((set) => ({
  toasts: [],

  /**
   * Add a new toast
   * @param {Object} toast
   * @param {string} toast.message - Toast message
   * @param {string} toast.type - Toast type: 'success' | 'error' | 'warning' | 'info'
   * @param {number} toast.duration - Auto-dismiss duration in ms (default: 5000)
   */
  addToast: (toast) => {
    const id = Date.now() + Math.random();
    set((state) => ({
      toasts: [
        ...state.toasts,
        {
          id,
          type: 'info',
          duration: 5000,
          ...toast,
        },
      ],
    }));
    return id;
  },

  /**
   * Remove a toast by ID
   * @param {number} id - Toast ID
   */
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    }));
  },

  /**
   * Clear all toasts
   */
  clearToasts: () => {
    set({ toasts: [] });
  },
}));

/**
 * Custom hook for toast notifications
 * @returns {Object} Toast functions
 */
export const useToast = () => {
  const { addToast, removeToast, clearToasts } = useToastStore();

  return {
    /**
     * Show success toast
     * @param {string} message
     * @param {number} duration
     */
    success: (message, duration) => addToast({ message, type: 'success', duration }),

    /**
     * Show error toast
     * @param {string} message
     * @param {number} duration
     */
    error: (message, duration) => addToast({ message, type: 'error', duration }),

    /**
     * Show warning toast
     * @param {string} message
     * @param {number} duration
     */
    warning: (message, duration) => addToast({ message, type: 'warning', duration }),

    /**
     * Show info toast
     * @param {string} message
     * @param {number} duration
     */
    info: (message, duration) => addToast({ message, type: 'info', duration }),

    /**
     * Remove specific toast
     * @param {number} id
     */
    remove: removeToast,

    /**
     * Clear all toasts
     */
    clear: clearToasts,
  };
};
