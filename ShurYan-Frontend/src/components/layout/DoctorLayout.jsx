// src/components/layout/DoctorLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import DoctorNavbar from '@/features/doctor/components/DoctorNavbar';

/**
 * Doctor Layout Component
 * Includes DoctorNavbar for all doctor pages
 * @component
 */
const DoctorLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Doctor Navbar - Sticky at top */}
      <DoctorNavbar />
      
      {/* Main Content */}
      <main className="min-h-[calc(100vh-5rem)]">
        <Outlet />
      </main>
    </div>
  );
};

export default DoctorLayout;
