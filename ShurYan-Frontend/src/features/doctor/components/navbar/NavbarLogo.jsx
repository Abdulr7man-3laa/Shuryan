import React from 'react';
import { Link } from 'react-router-dom';
import ArLogoWord from '@/assets/ArLogoWord.png';

/**
 * Navbar Logo Component - Doctor
 * @component
 */
const NavbarLogo = () => {
  return (
    <Link to="/doctor/dashboard" className="flex items-center group">
      {/* Arabic Logo Text - Full Height */}
      <div className="hidden sm:block h-16 py-2">
        <img 
          src={ArLogoWord} 
          alt="شُريان - منصة الرعاية الصحية الذكية" 
          className="h-full w-auto object-contain transition-all duration-300 group-hover:scale-105"
          style={{ minWidth: '140px' }}
        />
      </div>
    </Link>
  );
};

export default NavbarLogo;
