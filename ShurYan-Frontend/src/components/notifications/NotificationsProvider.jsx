import React from 'react';
import useNotifications from '@/hooks/useNotifications';

/**
 * Notifications Provider
 * Initializes notifications system for authenticated patients
 */
const NotificationsProvider = ({ children }) => {
  // Initialize notifications (hook handles all logic internally)
  useNotifications();
  
  return <>{children}</>;
};

export default NotificationsProvider;
