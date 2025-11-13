import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UserIcon,
  ArrowRightOnRectangleIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '@features/auth';
import { useAuthStore } from '@/features/auth/store/authStore';

/**
 * Profile Dropdown Component - Patient
 * @component
 */
const ProfileDropdown = ({ isOpen, onToggle, onClose }) => {
  const { logout, forceLogout } = useAuth();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      onClose();
      await logout();
      setTimeout(() => navigate('/login'), 100);
    } catch (error) {
      console.error('Logout error:', error);
      forceLogout();
    }
  };

  const handleNavigate = (path) => {
    onClose();
    navigate(path);
  };

  return (
    <div className="relative">
      {/* Profile Button */}
      <button
        onClick={onToggle}
        className={`
          transition-all duration-200 transform hover:scale-105
          ${
            isOpen
              ? 'ring-2 ring-teal-300 rounded-full'
              : 'hover:ring-2 hover:ring-teal-200 rounded-full'
          }
        `}
      >
        {/* Profile Image */}
        {user?.profileImageUrl ? (
          <img
            src={user.profileImageUrl}
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover shadow-lg"
          />
        ) : (
          <div className="w-10 h-10 bg-gradient-to-br from-teal-500 via-teal-600 to-teal-700 rounded-full flex items-center justify-center shadow-lg">
            <UserIcon className="w-5 h-5 text-white drop-shadow-sm" />
          </div>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-1/2 -translate-x-1/2 mt-3 w-60 bg-white rounded-2xl shadow-lg ring-1 ring-teal-100/50 overflow-hidden z-50 animate-fade-in">
          <div className="py-2">
            {/* Profile Link */}
            <button
              onClick={() => handleNavigate('/patient/profile')}
              className="w-full flex items-center justify-start space-x-reverse space-x-3 px-6 py-3 text-gray-700 hover:bg-teal-50 hover:text-teal-600 transition-colors duration-200"
            >
              <UserIcon className="w-5 h-5" />
              <span>الملف الشخصي</span>
            </button>

            {/* Settings Link */}
            <button
              onClick={() => handleNavigate('/patient/settings')}
              className="w-full flex items-center justify-start space-x-reverse space-x-3 px-6 py-3 text-gray-700 hover:bg-teal-50 hover:text-teal-600 transition-colors duration-200"
            >
              <Cog6ToothIcon className="w-5 h-5" />
              <span>الإعدادات</span>
            </button>

            <hr className="my-2 border-gray-100" />

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-start space-x-reverse space-x-3 px-6 py-3 text-red-600 hover:bg-red-50 transition-colors duration-200"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5" />
              <span>تسجيل الخروج</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
