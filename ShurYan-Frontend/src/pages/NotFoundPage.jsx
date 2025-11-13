import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaSearch } from 'react-icons/fa';
import Button from '@/components/ui/Button';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-50 px-4">
      <div className="max-w-md w-full text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="text-9xl font-bold text-gray-200">404</div>
          <div className="w-32 h-32 mx-auto -mt-16 bg-gradient-to-br from-teal-400 to-emerald-400 rounded-full flex items-center justify-center shadow-xl">
            <FaSearch className="text-white text-5xl" />
          </div>
        </div>

        {/* Content */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          الصفحة غير موجودة
        </h1>
        <p className="text-gray-600 mb-8 text-lg">
          عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/dashboard">
            <Button variant="primary" className="w-full sm:w-auto">
              <FaHome className="ml-2" />
              العودة للرئيسية
            </Button>
          </Link>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-semibold transition-colors"
          >
            العودة للخلف
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
