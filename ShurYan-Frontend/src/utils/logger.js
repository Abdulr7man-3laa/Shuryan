const isDev = import.meta.env.DEV;
const isDebugEnabled = import.meta.env.VITE_DEBUG === 'true';

export const logger = {
  info: (...args) => {
    if (isDev) {
      console.log('', ...args);
    }
  },

  success: (...args) => {
    if (isDev) {
      console.log('', ...args);
    }
  },

  error: (...args) => {
    if (isDev) {
      console.error('', ...args);
    }
  },

  warn: (...args) => {
    if (isDev) {
      console.warn('', ...args);
    }
  },

  debug: (...args) => {
    if (isDev && isDebugEnabled) {
      console.debug('', ...args);
    }
  },

  api: (method, url, data) => {
    if (isDev) {
      console.log(`🌐 API ${method}:`, url, data || '');
    }
  },

  apiResponse: (method, url, status, data) => {
    if (isDev) {
      const icon = status >= 200 && status < 300 ? '✅' : '❌';
      console.log(`${icon} API ${method} ${status}:`, url, data || '');
    }
  },
};

export default logger;
