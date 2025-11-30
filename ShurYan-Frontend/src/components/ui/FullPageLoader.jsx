import React from 'react';
import CircleLogo from '@/assets/CircleLogoPNG.png';
import ArLogoWord from '@/assets/ArLogoWord.png';

/**
 * Full Page Loader Component with Brand Identity
 * Used for initial app loading, route changes, and async operations
 * @component
 */
const FullPageLoader = ({ message = 'جاري التحميل...' }) => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-50 via-cyan-50/30 to-blue-50/30 flex items-center justify-center z-[9999]">
      <div className="flex flex-col items-center gap-8">
        {/* Logo Animation */}
        <div className="relative">
          {/* Animated Circle Background */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-cyan-100 to-blue-100 animate-pulse"></div>
          </div>
          
          {/* Logo Icon */}
          <div className="relative w-32 h-32 flex items-center justify-center animate-bounce">
            <img 
              src={CircleLogo} 
              alt="شُريان" 
              className="w-24 h-24 object-contain drop-shadow-2xl"
            />
          </div>
        </div>

        {/* Brand Name */}
        <div className="flex flex-col items-center gap-3">
          <div className="h-12">
            <img 
              src={ArLogoWord} 
              alt="شُريان - منصة الرعاية الصحية الذكية" 
              className="h-full w-auto object-contain opacity-90"
            />
          </div>
          
          {/* Loading Message */}
          <div className="flex items-center gap-3">
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
            <p className="text-slate-600 text-sm font-medium">{message}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FullPageLoader;
