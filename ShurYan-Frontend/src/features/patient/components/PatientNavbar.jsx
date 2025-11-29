import React, { useState, useEffect, useRef } from 'react';
import {
  NavbarLogo,
  NavbarLinks,
  ProfileDropdown,
  MobileMenu,
} from './navbar';
import ChatBot from './ChatBot';
import NotificationCenter from '@/components/notifications/NotificationCenter';

/**
 * Patient Dashboard Navbar Component
 * Clean Architecture - Modular & Maintainable
 * @component
 */
const PatientNavbar = () => {
  // Dropdown states
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isChatBotOpen, setIsChatBotOpen] = useState(false);

  // Refs for click outside detection
  const profileRef = useRef(null);
  const chatBotRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (chatBotRef.current && !chatBotRef.current.contains(event.target)) {
        setIsChatBotOpen(false);
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
  const toggleChatBot = () => setIsChatBotOpen((prev) => !prev);
  const closeChatBot = () => setIsChatBotOpen(false);

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
            {/* Notification Bell */}
            <NotificationCenter />

            {/* Profile Menu */}
            <div ref={profileRef}>
              <ProfileDropdown
                isOpen={isProfileOpen}
                onToggle={toggleProfile}
                onClose={closeProfile}
              />
            </div>

            {/* ChatBot Dropdown */}
            <div ref={chatBotRef} className="relative">
              <button
                onClick={toggleChatBot}
                className="relative p-2.5 rounded-xl bg-gradient-to-br from-[#00d5be] to-[#00bfaa] hover:shadow-lg transition-all duration-200 group"
                aria-label="فتح المساعد الذكي"
              >
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
                {/* Pulse indicator */}
                <span className="absolute -top-1 -left-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
              </button>

              {/* ChatBot Dropdown - Opens to the right */}
              {isChatBotOpen && (
                <div className="fixed sm:absolute right-2 sm:right-0 mt-3 w-[calc(100vw-1rem)] sm:w-[420px] max-w-[420px] z-50">
                  <ChatBot onClose={closeChatBot} isDropdown={true} />
                </div>
              )}
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

export default PatientNavbar;
