import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { DOCTOR_NAV_ITEMS } from '../../constants/navigation';

/**
 * Navbar Navigation Links Component
 * @component
 */
const NavbarLinks = () => {
  const location = useLocation();

  return (
    <div className="hidden lg:flex items-center gap-4">
      {DOCTOR_NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.href;

        return (
          <Link
            key={item.id}
            to={item.href}
            className={`
              relative flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 border
              ${
                isActive
                  ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg transform scale-105 border-teal-400'
                  : 'text-gray-700 hover:bg-teal-50 hover:text-teal-600 hover:scale-105 border-transparent hover:border-teal-200'
              }
            `}
          >
            <Icon className={`w-4.5 h-4.5 flex-shrink-0 ${isActive ? 'text-white' : 'text-teal-500'}`} />
            <span className="whitespace-nowrap">{item.name}</span>
          </Link>
        );
      })}
    </div>
  );
};

export default NavbarLinks;
