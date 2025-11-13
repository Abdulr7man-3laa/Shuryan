import React, { useEffect, useState } from 'react';
import Router from './Router';
import { AppProvider } from '@/providers/AppProvider';
import { ErrorBoundary, AppLoader } from '@/components/common';
import { ToastContainer } from '@/components/ui';
import TokenRefreshProvider from '@/components/TokenRefreshProvider';
import '@/styles/index.css';

function App() {
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log('Shuryan App Initialized');
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error('App initialization error:', error);
      } finally {
        setIsInitializing(false);
      }
    };

    initializeApp();
  }, []);

  if (isInitializing) return <AppLoader />;

  return (
    <ErrorBoundary>
      <TokenRefreshProvider 
        debug={import.meta.env.DEV}
        bufferMinutes={5}
      >
        <AppProvider>
          <Router />
          <ToastContainer />
        </AppProvider>
      </TokenRefreshProvider>
    </ErrorBoundary>
  );
}

export default App;