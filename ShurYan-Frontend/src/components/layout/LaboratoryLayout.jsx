import React from 'react';
import { Outlet } from 'react-router-dom';
import { LaboratoryNavbar } from '@/features/laboratory';
import DashboardFooter from '@/features/doctor/components/DashboardFooter';

/**
 * Laboratory Layout Component
 * Provides consistent layout structure for laboratory dashboard pages
 * @component
 */
const LaboratoryLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Laboratory Navbar - Sticky at top */}
      <LaboratoryNavbar />
      
      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <DashboardFooter />
    </div>
  );
};

export default LaboratoryLayout;
