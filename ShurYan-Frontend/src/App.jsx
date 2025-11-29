import React, { useEffect, useState } from 'react';
import Router from './Router';
import { AppProvider } from '@/providers/AppProvider';
import { ErrorBoundary, AppLoader } from '@/components/common';
import { ToastContainer } from '@/components/ui';
import TokenRefreshProvider from '@/components/TokenRefreshProvider';
import NotificationsProvider from '@/components/notifications/NotificationsProvider';
import AppointmentCompletedModal from '@/components/notifications/AppointmentCompletedModal';
import useNotificationsStore from '@/stores/notificationsStore';
import '@/styles/index.css';

function App() {
  const [isInitializing, setIsInitializing] = useState(true);
  
  // Get notification modal state
  const { showModal, currentNotification, hideNotificationModal } = useNotificationsStore();

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
          <NotificationsProvider>
            <Router />
            <ToastContainer />
            
            {/* Appointment Completed Modal */}
            {showModal && currentNotification && (
              <AppointmentCompletedModal
                notification={currentNotification}
                onClose={hideNotificationModal}
                onRate={(appointmentDetails) => {
                  console.log('Navigate to rating page:', appointmentDetails);
                  // TODO: Navigate to rating page
                  hideNotificationModal();
                }}
              />
            )}
          </NotificationsProvider>
        </AppProvider>
      </TokenRefreshProvider>
    </ErrorBoundary>
  );
}

export default App;