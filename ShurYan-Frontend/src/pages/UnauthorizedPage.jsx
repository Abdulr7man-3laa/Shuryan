import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaLock, FaHome, FaSignInAlt } from 'react-icons/fa';
import Button from '@/components/ui/Button';
import { useAuthStore } from '@/features/auth/store/authStore';

const UnauthorizedPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-orange-50 px-4">
      <div className="max-w-md w-full text-center">
        {/* Lock Illustration */}
        <div className="mb-8">
          <div className="w-32 h-32 mx-auto bg-red-100 rounded-full flex items-center justify-center shadow-xl">
            <FaLock className="text-red-600 text-5xl" />
          </div>
        </div>

        {/* Content */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">403</h1>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          غير مصرح لك بالوصول
        </h2>
        <p className="text-gray-600 mb-8 text-lg">
          عذراً، ليس لديك الصلاحيات اللازمة للوصول إلى هذه الصفحة
        </p>

        {/* Actions */}
        <div className="flex flex-col gap-4">
          <Link to="/dashboard" className="w-full">
            <Button variant="primary" fullWidth>
              <FaHome className="ml-2" />
              العودة للرئيسية
            </Button>
          </Link>

          {isAuthenticated ? (
            <Button variant="outline" fullWidth onClick={handleLogout}>
              <FaSignInAlt className="ml-2" />
              تسجيل الخروج وتسجيل الدخول بحساب آخر
            </Button>
          ) : (
            <Link to="/login" className="w-full">
              <Button variant="outline" fullWidth>
                <FaSignInAlt className="ml-2" />
                تسجيل الدخول
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
