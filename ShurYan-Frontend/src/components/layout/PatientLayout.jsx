// src/components/layout/PatientLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import PatientNavbar from '@/features/patient/components/PatientNavbar';

/**
 * Patient Layout Component
 * Includes PatientNavbar for all patient pages
 * @component
 */
const PatientLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Patient Navbar - Sticky at top */}
      <PatientNavbar />
      
      {/* Main Content */}
      <main className="min-h-[calc(100vh-5rem)]">
        <Outlet />
      </main>
    </div>
  );
};

export default PatientLayout;
