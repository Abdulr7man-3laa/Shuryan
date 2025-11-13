import React from 'react';
import { FaUser } from 'react-icons/fa';

/**
 * Pharmacy Profile Page
 * @component
 */
const ProfilePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header - Centered */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-black mb-3 leading-tight" style={{ 
            background: 'linear-gradient(to right, #00b19f, #00d4be)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            الملف الشخصي
          </h1>
          <p className="text-slate-500 text-lg font-medium">
            إدارة معلومات الصيدلية
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
          {/* Placeholder */}
          <div className="text-center py-16">
            <div className="w-24 h-24 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm" style={{
              background: 'linear-gradient(to bottom right, rgba(0, 177, 159, 0.1), rgba(0, 212, 190, 0.1))'
            }}>
              <FaUser className="text-4xl" style={{ color: '#00b19f' }} />
            </div>
            <h3 className="text-xl font-bold text-slate-700 mb-3">الملف الشخصي</h3>
            <p className="text-slate-500 text-base">سيتم إضافة معلومات الصيدلية هنا</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
