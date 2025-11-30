import React from 'react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ArLogoWord from '@/assets/ArLogoWord.png';

const AppLoader = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-teal-50 via-white to-emerald-50">
      <div className="text-center">
        <div className="mb-8">
          {/* Text Logo */}
          <div className="h-12 mb-2 flex items-center justify-center">
            <img 
              src={ArLogoWord} 
              alt="شُريان - منصة الرعاية الصحية الذكية" 
              className="h-full w-auto object-contain"
            />
          </div>
          
          <p className="text-gray-600">منصة الرعاية الصحية الذكية</p>
        </div>

        <LoadingSpinner size="lg" />

        <p className="mt-4 text-gray-500 text-sm">جاري التحميل...</p>
      </div>
    </div>
  );
};

export default AppLoader;
