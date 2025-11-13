import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { PATIENT_NAV_ITEMS } from '../../constants/navigation';

/**
 * Mobile Menu Component - Patient
 * @component
 */
const MobileMenu = ({ isOpen, onToggle, onClose }) => {
  const location = useLocation();

  const handleLinkClick = () => {
    onClose();
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={onToggle}
        className="lg:hidden p-3 text-gray-600 hover:text-teal-600 hover:bg-teal-50 rounded-xl transition-all duration-200 transform hover:scale-110 border border-transparent hover:border-teal-200"
      >
        {isOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
      </button>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="lg:hidden absolute top-20 left-0 right-0 border-t border-gray-200/50 bg-white/98 backdrop-blur-lg animate-fade-in shadow-lg">
          <div className="px-4 py-4 space-y-2">
            {PATIENT_NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.id}
                  to={item.path}
                  onClick={handleLinkClick}
                  className={`
                    flex items-center space-x-reverse space-x-4 px-5 py-4 rounded-xl text-base font-medium transition-all duration-200
                    ${
                      isActive
                        ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg'
                        : 'text-gray-700 hover:bg-teal-50 hover:text-teal-600'
                    }
                  `}
                >
                  <Icon className={`w-6 h-6 ${isActive ? 'text-white' : 'text-teal-500'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
};

export default MobileMenu;
