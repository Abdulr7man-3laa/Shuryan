import React from 'react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const AppLoader = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-teal-50 via-white to-emerald-50">
      <div className="text-center">
        <div className="mb-8">
          <div className="w-20 h-20 bg-teal-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-teal-600 mb-2">شُريان</h1>
          <p className="text-gray-600">منصة الرعاية الصحية الذكية</p>
        </div>

        <LoadingSpinner size="lg" />

        <p className="mt-4 text-gray-500 text-sm">جاري التحميل...</p>
      </div>
    </div>
  );
};

export default AppLoader;
