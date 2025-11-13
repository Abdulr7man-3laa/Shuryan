import React from 'react';
import { Link } from 'react-router-dom';
import { FaStethoscope } from 'react-icons/fa';

/**
 * Navbar Logo Component - Patient
 * @component
 */
const NavbarLogo = () => {
  return (
    <Link to="/patient/search" className="flex items-center space-x-reverse space-x-3 group">
      <div className="w-12 h-12 bg-gradient-to-br from-teal-500 via-teal-600 to-teal-700 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105 ring-2 ring-teal-100">
        <FaStethoscope className="w-6 h-6 text-white drop-shadow-sm" />
      </div>
      <div className="hidden sm:block text-right">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-teal-600 via-teal-500 to-emerald-500 bg-clip-text text-transparent drop-shadow-sm">
          شُريان
        </h1>
        <p className="text-xs text-gray-600 -mt-1 font-semibold tracking-wide">
          منصة طبية متكاملة
        </p>
      </div>
    </Link>
  );
};

export default NavbarLogo;
