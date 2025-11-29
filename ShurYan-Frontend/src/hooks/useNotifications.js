import { useEffect } from 'react';
import useAuth from '@/features/auth/hooks/useAuth';
import useNotificationsStore from '@/stores/notificationsStore';
import signalRService from '@/services/signalr.service';
import notificationsService from '@/api/services/notifications.service';

/**
 * Custom Hook لإدارة الإشعارات
 * - الاتصال بـ SignalR عند تسجيل الدخول
 * - جلب الإشعارات الغير مقروءة
 * - الاستماع للإشعارات الجديدة
 */
const useNotifications = () => {
  const { user, accessToken } = useAuth();
  const {
    addNotification,
    loadUnreadNotifications,
    setConnectionStatus,
    cleanupShownNotifications,
    reset,
  } = useNotificationsStore();

  useEffect(() => {
    // Only initialize for patients with access token
    if (!user || user.role !== 'patient' || !accessToken) {
      return;
    }
    let isSubscribed = true;

    const initializeNotifications = async () => {
      try {
        // Cleanup old shown notifications on startup
        cleanupShownNotifications();
        
        // Setup listener before connecting
        signalRService.on('ReceiveNotification', (notification) => {
          if (!isSubscribed) return;
          addNotification(notification);
        });

        // Connect to SignalR
        await signalRService.connect(accessToken);
        setConnectionStatus(true);

        // Load unread notifications
        const unreadNotifications = await notificationsService.getUnreadNotifications();
        
        if (isSubscribed) {
          loadUnreadNotifications(unreadNotifications);
        }
      } catch (error) {
        console.error('[Notifications] Initialization failed:', error.message);
        setConnectionStatus(false);
      }
    };

    initializeNotifications();

    // Cleanup
    return () => {
      isSubscribed = false;
      signalRService.off('ReceiveNotification');
      signalRService.disconnect();
      setConnectionStatus(false);
    };
  }, [user, accessToken, cleanupShownNotifications, addNotification, loadUnreadNotifications, setConnectionStatus]);

  // Reset on logout
  useEffect(() => {
    if (!user) {
      reset();
    }
  }, [user, reset]);

  return {
    isConnected: useNotificationsStore((state) => state.isConnected),
  };
};

export default useNotifications;
