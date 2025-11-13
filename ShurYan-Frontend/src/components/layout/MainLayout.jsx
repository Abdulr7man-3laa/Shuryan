// src/components/layout/MainLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import ScrollToTop from '@/components/common/ScrollToTop';

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <ScrollToTop />
      {/* Header/Navbar can go here */}
      <main>
        <Outlet />
      </main>
      {/* Footer can go here */}
    </div>
  );
};

export default MainLayout;