// src/components/layout/PharmacyLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import PharmacyNavbar from '@/features/pharmacy/components/PharmacyNavbar';
import DashboardFooter from '@/features/doctor/components/DashboardFooter';

/**
 * Pharmacy Layout Component
 * Includes PharmacyNavbar and Footer for all pharmacy pages
 * @component
 */
const PharmacyLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Pharmacy Navbar - Sticky at top */}
      <PharmacyNavbar />
      
      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <DashboardFooter />
    </div>
  );
};

export default PharmacyLayout;
