import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

/**
 * Notifications Store
 * إدارة الإشعارات الواردة من SignalR
 */
const useNotificationsStore = create(
  devtools(
    persist(
      (set, get) => ({
        // State
        notifications: [], // قائمة الإشعارات
        unreadCount: 0, // عدد الإشعارات الغير مقروءة
        showModal: false, // عرض الـ Modal
        currentNotification: null, // الإشعار الحالي المعروض في الـ Modal
        isConnected: false, // حالة الاتصال بـ SignalR

        // Actions

        /**
         * إضافة إشعار جديد
         */
        addNotification: (notification) => {
          set((state) => ({
            notifications: [notification, ...state.notifications],
            unreadCount: state.unreadCount + 1,
          }));

          // Show modal automatically for AppointmentCompleted type
          if (
            notification.data?.type === 'AppointmentCompleted' || 
            notification.data?.type === 6 || 
            notification.data?.type === '6'
          ) {
            get().showNotificationModal(notification);
          }
        },

        /**
         * عرض الـ Modal للإشعار
         */
        showNotificationModal: (notification) => {
          // Check if this notification was already shown
          const shownNotifications = JSON.parse(localStorage.getItem('shownNotifications') || '[]');
          const notificationId = notification.data?.notificationId || notification.id;
          
          if (shownNotifications.includes(notificationId)) {
            return; // Already shown, skip
          }
          
          // Mark as shown in localStorage
          shownNotifications.push(notificationId);
          localStorage.setItem('shownNotifications', JSON.stringify(shownNotifications));
          
          set({
            showModal: true,
            currentNotification: notification,
          });
        },

        /**
         * إخفاء الـ Modal
         */
        hideNotificationModal: () => {
          set({
            showModal: false,
            currentNotification: null,
          });
        },

        /**
         * تحديد إشعار كمقروء
         */
        markAsRead: (notificationId) => {
          set((state) => ({
            notifications: state.notifications.map((n) =>
              n.data?.notificationId === notificationId
                ? { ...n, isRead: true }
                : n
            ),
            unreadCount: Math.max(0, state.unreadCount - 1),
          }));
        },

        /**
         * تحديد جميع الإشعارات كمقروءة
         */
        markAllAsRead: () => {
          set((state) => ({
            notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
            unreadCount: 0,
          }));
        },

        /**
         * حذف إشعار
         */
        removeNotification: (notificationId) => {
          set((state) => {
            const notification = state.notifications.find(
              (n) => n.data?.notificationId === notificationId
            );
            const wasUnread = notification && !notification.isRead;

            return {
              notifications: state.notifications.filter(
                (n) => n.data?.notificationId !== notificationId
              ),
              unreadCount: wasUnread
                ? Math.max(0, state.unreadCount - 1)
                : state.unreadCount,
            };
          });
        },

        /**
         * مسح جميع الإشعارات
         */
        clearAll: () => {
          set({
            notifications: [],
            unreadCount: 0,
          });
        },

        /**
         * تحميل الإشعارات الغير مقروءة من الـ API
         */
        loadUnreadNotifications: (notifications) => {
          if (!notifications || notifications.length === 0) {
            return;
          }
          
          const mapped = notifications.map((n) => ({
            title: n.title,
            message: n.message,
            timestamp: n.createdAt,
            isRead: n.isRead,
            data: {
              notificationId: n.id,
              type: n.type,
              priority: n.priority,
              relatedEntityId: n.relatedEntityId,
              relatedEntityType: n.relatedEntityType,
            },
          }));
          
          set({
            notifications: mapped,
            unreadCount: notifications.filter((n) => !n.isRead).length,
          });

          // Auto-show modal for unread AppointmentCompleted notifications
          const unreadSessionNotification = mapped.find(
            (n) => !n.isRead && (
              n.data?.type === 'AppointmentCompleted' || 
              n.data?.type === 6 || 
              n.data?.type === '6'
            )
          );
          
          if (unreadSessionNotification) {
            get().showNotificationModal(unreadSessionNotification);
          }
        },

        /**
         * تحميل جميع الإشعارات مع pagination من الـ API
         */
        loadAllNotifications: (paginatedData) => {
          if (!paginatedData || !paginatedData.data || paginatedData.data.length === 0) {
            set({
              notifications: [],
              unreadCount: 0,
            });
            return;
          }
          
          const mapped = paginatedData.data.map((n) => ({
            title: n.title,
            message: n.message,
            timestamp: n.createdAt,
            isRead: n.isRead,
            readAt: n.readAt,
            data: {
              notificationId: n.id,
              type: n.type,
              priority: n.priority,
              relatedEntityId: n.relatedEntityId,
              relatedEntityType: n.relatedEntityType,
              createdBy: n.createdBy,
              updatedAt: n.updatedAt,
              deliveryMethod: n.deliveryMethod,
              isSent: n.isSent,
              sentAt: n.sentAt,
            },
          }));
          
          set({
            notifications: mapped,
            unreadCount: paginatedData.data.filter((n) => !n.isRead).length,
          });
        },

        /**
         * تحديث حالة الاتصال
         */
        setConnectionStatus: (isConnected) => {
          set({ isConnected });
        },

        /**
         * تنظيف الإشعارات المعروضة القديمة (أكثر من 30 يوم)
         */
        cleanupShownNotifications: () => {
          try {
            JSON.parse(localStorage.getItem('shownNotifications') || '[]');
            // Keep only recent notifications (you can add date-based cleanup here if needed)
            // For now, we keep all to ensure no duplicates
          } catch {
            // If localStorage is corrupted, reset it
            localStorage.removeItem('shownNotifications');
          }
        },

        /**
         * إعادة تعيين الـ Store
         */
        reset: () => {
          set({
            notifications: [],
            unreadCount: 0,
            showModal: false,
            currentNotification: null,
            isConnected: false,
          });
        },
      }),
      {
        name: 'notifications-storage',
        partialize: (state) => ({
          notifications: state.notifications,
          unreadCount: state.unreadCount,
        }),
      }
    ),
    { name: 'NotificationsStore' }
  )
);

export default useNotificationsStore;
