// src/hooks/useTranslation.js
import { useState, useEffect } from 'react';
import { t, getCurrentLocale, setCurrentLocale } from '@/config/i18n';

/**
 * Custom hook for translations
 * @returns {Object} Translation functions and current locale
 */
export const useTranslation = () => {
  const [locale, setLocale] = useState(getCurrentLocale());

  /**
   * Change current locale
   * @param {string} newLocale - New locale code
   */
  const changeLocale = (newLocale) => {
    setCurrentLocale(newLocale);
    setLocale(newLocale);
    // Force re-render
    window.location.reload();
  };

  /**
   * Translate a key
   * @param {string} key - Translation key
   * @param {Object} params - Parameters to replace
   * @returns {string} Translated text
   */
  const translate = (key, params = {}) => {
    return t(key, locale, params);
  };

  return {
    t: translate,
    locale,
    changeLocale,
    isRTL: locale === 'ar',
  };
};
