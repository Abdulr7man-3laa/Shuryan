import { useState, useRef, useEffect } from 'react';
import { FaBell, FaCheckCircle, FaTrash, FaTimes, FaCircle, FaEnvelope, FaEnvelopeOpen } from 'react-icons/fa';
import useNotificationsStore from '@/stores/notificationsStore';
import notificationsService from '@/api/services/notifications.service';
import { getRelativeTime } from '@/utils/dateFormatter';

/**
 * Notification Center - الجرس
 * يعرض قائمة الإشعارات مع counter للغير مقروءة
 */
const NotificationCenter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
    showNotificationModal,
    loadAllNotifications,
  } = useNotificationsStore();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Fetch all notifications when dropdown opens
  const fetchAllNotifications = async () => {
    if (loading) return;
    
    setLoading(true);
    try {
      const paginatedData = await notificationsService.getAllNotifications(1, 20);
      loadAllNotifications(paginatedData);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle bell icon click
  const handleBellClick = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      // Fetch notifications when opening
      fetchAllNotifications();
    }
  };

  const handleNotificationClick = async (notification) => {
    // Mark as read
    if (!notification.isRead && notification.data?.notificationId) {
      try {
        await notificationsService.markAsRead(notification.data.notificationId);
        markAsRead(notification.data.notificationId);
      } catch (error) {
        console.error('Failed to mark as read:', error);
      }
    }

    // Show modal if AppointmentCompleted
    if (
      notification.data?.type === 'AppointmentCompleted' || 
      notification.data?.type === 6 || 
      notification.data?.type === '6'
    ) {
      showNotificationModal(notification);
      setIsOpen(false);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationsService.markAllAsRead();
      markAllAsRead();
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const handleDelete = async (e, notificationId) => {
    e.stopPropagation();
    try {
      await notificationsService.deleteNotification(notificationId);
      removeNotification(notificationId);
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Icon */}
      <button
        onClick={handleBellClick}
        className="relative p-2 text-slate-600 hover:text-teal-600 transition-colors"
      >
        <FaBell className="w-6 h-6" />
        
        {/* Unread Badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute left-0 mt-2 w-96 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-fadeIn">
          {/* Header */}
          <div className="bg-gradient-to-r from-teal-500 to-emerald-500 p-4 text-white">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg">الإشعارات</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white transition-colors"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>
            
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="inline-flex items-center gap-2 px-3 py-1.5 mt-3 bg-white/20 hover:bg-white/30 text-white text-sm font-medium rounded-lg transition-all duration-200 hover:scale-105"
              >
                <FaCheckCircle className="w-3 h-3" />
                تحديد الكل كمقروء ({unreadCount})
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center text-slate-500">
                <div className="animate-spin w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full mx-auto mb-3"></div>
                <p className="font-semibold">جاري التحميل...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center text-slate-500">
                <FaBell className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                <p className="font-semibold">لا توجد إشعارات</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {notifications.map((notification, index) => (
                  <div
                    key={notification.data?.notificationId || index}
                    onClick={() => handleNotificationClick(notification)}
                    className={`group p-4 transition-all duration-200 cursor-pointer border-r-4 ${
                      !notification.isRead 
                        ? 'bg-gradient-to-r from-teal-50/80 to-emerald-50/40 hover:from-teal-50 hover:to-emerald-50 border-r-teal-400' 
                        : 'bg-white hover:bg-slate-50 border-r-transparent'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Icon */}
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                        !notification.isRead 
                          ? 'bg-gradient-to-br from-teal-100 to-emerald-100 border-2 border-teal-200' 
                          : 'bg-slate-100 border-2 border-slate-200'
                      }`}>
                        {!notification.isRead ? (
                          <FaEnvelope className="w-4 h-4 text-teal-600" />
                        ) : (
                          <FaEnvelopeOpen className="w-4 h-4 text-slate-500" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className={`font-semibold text-sm ${
                            !notification.isRead ? 'text-slate-900' : 'text-slate-700'
                          }`}>
                            {notification.title}
                          </h4>
                          
                          {/* Delete Button */}
                          <button
                            onClick={(e) => handleDelete(e, notification.data?.notificationId)}
                            className="p-1.5 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all duration-200 opacity-0 group-hover:opacity-100"
                          >
                            <FaTrash className="w-3 h-3" />
                          </button>
                        </div>

                        <p className="text-sm text-slate-600 mt-1 line-clamp-2">
                          {notification.message}
                        </p>

                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs text-slate-500">
                            {notification.timestamp
                              ? getRelativeTime(notification.timestamp)
                              : '-'}
                          </span>
                          
                          {!notification.isRead && (
                            <div className="flex items-center gap-1">
                              <FaCircle className="w-2 h-2 text-teal-500 animate-pulse" />
                              <span className="text-xs font-semibold text-teal-600">جديد</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;
