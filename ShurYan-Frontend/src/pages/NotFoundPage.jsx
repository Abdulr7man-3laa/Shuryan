import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaSearch } from 'react-icons/fa';
import Button from '@/components/ui/Button';
import CircleLogo from '@/assets/CircleLogoPNG.png';
import ArLogoWord from '@/assets/ArLogoWord.png';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-cyan-50/30 to-blue-50/30 px-4">
      {/* Brand Logo at Top */}
      <div className="mb-12 flex flex-col items-center gap-4">
        <div className="h-70">
          <img 
            src={ArLogoWord} 
            alt="شُريان - منصة الرعاية الصحية الذكية" 
            className="h-full w-auto object-contain"
          />
        </div>
      </div>

      <div className="max-w-md w-full text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="text-9xl font-bold bg-gradient-to-br from-teal-200 to-emerald-200 bg-clip-text text-transparent">404</div>
          <div className="w-32 h-32 mx-auto -mt-16 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-full flex items-center justify-center shadow-2xl">
            <FaSearch className="text-white text-5xl" />
          </div>
        </div>

        {/* Content */}
        <h1 className="text-3xl font-bold text-slate-800 mb-4">
          الصفحة غير موجودة
        </h1>
        <p className="text-slate-600 mb-8 text-lg">
          عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/login">
            <Button variant="primary" className="w-full sm:w-auto">
              <FaHome className="ml-2" />
              العودة للرئيسية
            </Button>
          </Link>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl font-semibold transition-colors shadow-sm"
          >
            العودة للخلف
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
