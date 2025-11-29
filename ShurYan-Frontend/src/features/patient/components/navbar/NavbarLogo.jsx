import React from 'react';
import { Link } from 'react-router-dom';
import logo1 from '@/assets/logo.png';

/**
 * Navbar Logo Component - Patient
 * @component
 */
const NavbarLogo = () => {
  return (
    <Link to="/patient/search" className="flex items-center space-x-reverse space-x-3 group">
      {/* Logo Image */}
      <div className="w-14 h-14 flex items-center justify-center transition-all duration-300 group-hover:scale-105">
        <img 
          src={logo1} 
          alt="شُريان" 
          className="w-full h-full object-contain drop-shadow-lg"
        />
      </div>
      <div className="hidden sm:block text-right">
        {/* <h1 className="text-2xl font-bold bg-gradient-to-r from-teal-600 via-teal-500 to-emerald-500 bg-clip-text text-transparent drop-shadow-sm">
          شُريان
        </h1>
        <p className="text-xs text-gray-600 -mt-1 font-semibold tracking-wide">
          منصة طبية متكاملة
        </p> */}
      </div>
    </Link>
  );
};

export default NavbarLogo;
