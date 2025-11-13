import React from 'react';
import { ThemeProvider } from '@/contexts/ThemeContext';
import MUIThemeProvider from './MUIThemeProvider';

/**
 * This component wraps all global providers to keep App.jsx clean and maintainable.
 * 
 * Current providers:
 * - MUIThemeProvider: Material-UI theme with RTL support and Shuryan colors
 * - ThemeProvider: Custom theme context for non-MUI components
 * 
 * Future providers to add as needed:
 * - QueryClientProvider (React Query/TanStack Query)
 * - I18nProvider (Internationalization)
 * - AnalyticsProvider
 * - FeatureFlagProvider
 */
export const AppProvider = ({ children }) => {
  return (
    <MUIThemeProvider>
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </MUIThemeProvider>
  );
};

export default AppProvider;
