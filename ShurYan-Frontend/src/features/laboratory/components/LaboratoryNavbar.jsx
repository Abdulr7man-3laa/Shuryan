import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { useAuthStore } from '@/features/auth/store/authStore';
import { LABORATORY_NAV_ITEMS } from '../constants/navigation';
import CircleLogo from '@/assets/CircleLogoPNG.png';
import ArLogoWord from '@/assets/ArLogoWord.png';

/**
 * Laboratory Dashboard Navbar Component
 * Clean Architecture - Modular & Maintainable
 * @component
 */
const LaboratoryNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  
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

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white/98 backdrop-blur-lg shadow-sm sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link to="/laboratory/dashboard" className="flex items-center group">
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
          </div>

          {/* Desktop Navigation - Centered */}
          <div className="hidden lg:flex items-center gap-4">
            {LABORATORY_NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              
              return (
                <Link
                  key={item.id}
                  to={item.href}
                  className={`
                    relative flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 border
                    ${active
                      ? 'text-white shadow-lg transform scale-105 border-[#00b19f]/40'
                      : 'text-gray-700 hover:bg-[#00b19f]/5 hover:text-[#00b19f] hover:scale-105 border-transparent hover:border-[#00b19f]/20'
                    }
                  `}
                  style={active ? {
                    background: 'linear-gradient(to right, #00b19f, #00c4b0)'
                  } : {}}
                >
                  <Icon className={`w-4.5 h-4.5 flex-shrink-0 ${active ? 'text-white' : 'text-[#00b19f]'}`} />
                  <span className="whitespace-nowrap">{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-reverse space-x-4">
            {/* Profile Dropdown */}
            <div ref={profileRef} className="relative">
              <button
                onClick={toggleProfile}
                className="flex items-center space-x-reverse space-x-3 p-2 rounded-xl hover:bg-slate-50 transition-all duration-200 group"
              >
                <div className="relative w-11 h-11 rounded-full flex items-center justify-center text-white font-bold shadow-md group-hover:shadow-lg transition-all duration-200 group-hover:scale-105" style={{
                  background: 'linear-gradient(to bottom right, #00b19f, #00d4be)'
                }}>
                  {user?.fullName?.charAt(0) || 'م'}
                  <div className="absolute inset-0 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                </div>
                <div className="hidden md:block text-right">
                  <p className="text-sm font-bold text-slate-800 transition-colors duration-200" style={{
                    color: isProfileOpen ? '#00b19f' : undefined
                  }} onMouseEnter={(e) => e.currentTarget.style.color = '#00b19f'} onMouseLeave={(e) => !isProfileOpen && (e.currentTarget.style.color = '')}>{user?.fullName || ''}</p>
                </div>
              </button>

              {/* Dropdown Menu */}
              {isProfileOpen && (
                <div className="absolute left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50">
                  <Link
                    to="/laboratory/profile"
                    onClick={closeProfile}
                    className="flex items-center space-x-reverse space-x-3 px-4 py-3 hover:bg-slate-50 transition-colors"
                  >
                    <FaUser style={{ color: '#00b19f' }} />
                    <span className="text-sm font-medium text-slate-700">الملف الشخصي</span>
                  </Link>
                  <hr className="my-2 border-slate-100" />
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-reverse space-x-3 px-4 py-3 hover:bg-red-50 transition-colors text-red-600"
                  >
                    <FaSignOutAlt />
                    <span className="text-sm font-medium">تسجيل الخروج</span>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors"
            >
              {isMobileMenuOpen ? (
                <FaTimes className="text-xl text-slate-600" />
              ) : (
                <FaBars className="text-xl text-slate-600" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-slate-100">
            <div className="space-y-2">
              {LABORATORY_NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                
                return (
                  <Link
                    key={item.id}
                    to={item.href}
                    onClick={closeMobileMenu}
                    className={`
                      relative flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 border
                      ${active
                        ? 'text-white shadow-lg transform scale-105 border-[#00b19f]/40'
                        : 'text-gray-700 hover:bg-[#00b19f]/5 hover:text-[#00b19f] hover:scale-105 border-transparent hover:border-[#00b19f]/20'
                      }
                    `}
                    style={active ? {
                      background: 'linear-gradient(to right, #00b19f, #00c4b0)'
                    } : {}}
                  >
                    <Icon className={`w-4.5 h-4.5 flex-shrink-0 ${active ? 'text-white' : 'text-[#00b19f]'}`} />
                    <span className="whitespace-nowrap">{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default LaboratoryNavbar;
