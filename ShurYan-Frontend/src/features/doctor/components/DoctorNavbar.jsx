import React, { useState, useEffect, useRef } from 'react';
import {
  NavbarLogo,
  NavbarLinks,
  ProfileDropdown,
  MobileMenu,
} from './navbar';

/**
 * Doctor Dashboard Navbar Component
 * Clean Architecture - Modular & Maintainable
 * @component
 * @param {boolean} saving - Show saving indicator
 */
const DoctorNavbar = ({ saving = false }) => {
  // Dropdown states
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Refs for click outside detection
  const profileRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handlers
  const toggleProfile = () => setIsProfileOpen((prev) => !prev);
  const closeProfile = () => setIsProfileOpen(false);
  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <nav className="bg-white/98 backdrop-blur-lg shadow-sm sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-20">
          {/* Logo Section */}
          <div className="flex items-center space-x-reverse space-x-4">
            <NavbarLogo />
          </div>

          {/* Centered Desktop Navigation */}
          <div className="flex-1 flex justify-center">
            <NavbarLinks />
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-reverse space-x-4">
            {/* Profile Menu */}
            <div ref={profileRef}>
              <ProfileDropdown
                isOpen={isProfileOpen}
                onToggle={toggleProfile}
                onClose={closeProfile}
              />
            </div>

            {/* Mobile Menu Button */}
            <MobileMenu
              isOpen={isMobileMenuOpen}
              onToggle={toggleMobileMenu}
              onClose={closeMobileMenu}
            />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default DoctorNavbar;
