import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaBars, FaTimes, FaSignOutAlt, FaUserMd, FaPills, FaFlask, FaHome, FaChartBar } from 'react-icons/fa';
import { useAuth } from '@/features/auth';
import { APPLICATION_TYPE, TYPE_LABELS, TYPE_ICONS, VERIFIER_NAV_ITEMS } from '../constants/verifierConstants';
import CircleLogo from '@/assets/CircleLogoPNG.png';
import ArLogoWord from '@/assets/ArLogoWord.png';

// Icon mapping for tabs
const TAB_ICON_MAP = {
  FaUserMd,
  FaPills,
  FaFlask,
};

// Icon mapping for navigation
const NAV_ICON_MAP = {
  FaHome,
  FaChartBar,
};

/**
 * Verifier Navbar Component
 * 
 * Top navigation bar for verifier dashboard with tabs
 * Matches patient/doctor navbar design
 */
const VerifierNavbar = ({ activeTab, onTabChange }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const tabs = [
    {
      type: APPLICATION_TYPE.DOCTOR,
      label: TYPE_LABELS[APPLICATION_TYPE.DOCTOR],
      icon: TYPE_ICONS[APPLICATION_TYPE.DOCTOR],
    },
    {
      type: APPLICATION_TYPE.PHARMACY,
      label: TYPE_LABELS[APPLICATION_TYPE.PHARMACY],
      icon: TYPE_ICONS[APPLICATION_TYPE.PHARMACY],
    },
    {
      type: APPLICATION_TYPE.LABORATORY,
      label: TYPE_LABELS[APPLICATION_TYPE.LABORATORY],
      icon: TYPE_ICONS[APPLICATION_TYPE.LABORATORY],
    },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);

  return (
    <nav className="bg-white/98 backdrop-blur-lg shadow-sm sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-20">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link to="/verifier/statistics" className="flex items-center group">
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

          {/* Centered Desktop Navigation */}
          <div className="flex-1 flex justify-center">
            <div className="hidden lg:flex items-center gap-3">
              {/* Navigation Links */}
              {VERIFIER_NAV_ITEMS.map((item) => {
                const isActive = location.pathname === item.path;
                const NavIcon = NAV_ICON_MAP[item.icon];
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`
                      flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 border
                      ${
                        isActive
                          ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg transform scale-105 border-teal-400'
                          : 'text-gray-700 hover:bg-teal-50 hover:text-teal-600 hover:scale-105 border-transparent hover:border-teal-200'
                      }
                    `}
                  >
                    {NavIcon && (
                      <NavIcon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-white' : 'text-teal-500'}`} />
                    )}
                    <span className="whitespace-nowrap">{item.label}</span>
                  </Link>
                );
              })}
              
              {/* Tabs - Navigate to separate pages */}
              <Link
                to="/verifier/doctors"
                className={`
                  flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 border
                  ${
                    location.pathname === '/verifier/doctors'
                      ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg transform scale-105 border-teal-400'
                      : 'text-gray-700 hover:bg-teal-50 hover:text-teal-600 hover:scale-105 border-transparent hover:border-teal-200'
                  }
                `}
              >
                <FaUserMd className={`w-4 h-4 flex-shrink-0 ${location.pathname === '/verifier/doctors' ? 'text-white' : 'text-teal-500'}`} />
                <span className="whitespace-nowrap">الأطباء</span>
              </Link>
              
              <Link
                to="/verifier/pharmacies"
                className={`
                  flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 border
                  ${
                    location.pathname === '/verifier/pharmacies'
                      ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg transform scale-105 border-teal-400'
                      : 'text-gray-700 hover:bg-teal-50 hover:text-teal-600 hover:scale-105 border-transparent hover:border-teal-200'
                  }
                `}
              >
                <FaPills className={`w-4 h-4 flex-shrink-0 ${location.pathname === '/verifier/pharmacies' ? 'text-white' : 'text-teal-500'}`} />
                <span className="whitespace-nowrap">الصيدليات</span>
              </Link>
              
              <Link
                to="/verifier/laboratories"
                className={`
                  flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 border
                  ${
                    location.pathname === '/verifier/laboratories'
                      ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg transform scale-105 border-teal-400'
                      : 'text-gray-700 hover:bg-teal-50 hover:text-teal-600 hover:scale-105 border-transparent hover:border-teal-200'
                  }
                `}
              >
                <FaFlask className={`w-4 h-4 flex-shrink-0 ${location.pathname === '/verifier/laboratories' ? 'text-white' : 'text-teal-500'}`} />
                <span className="whitespace-nowrap">المعامل</span>
              </Link>
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-reverse space-x-4">
            {/* Direct Logout Button */}
            <button
              onClick={handleLogout}
              className="hidden md:flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition-all duration-200 font-semibold border border-red-200 hover:border-red-300"
            >
              <FaSignOutAlt className="w-4 h-4" />
              <span className="text-sm">تسجيل الخروج</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-2.5 rounded-xl hover:bg-gray-100 transition-all duration-200"
              aria-label="القائمة"
            >
              {isMobileMenuOpen ? (
                <FaTimes className="w-6 h-6 text-gray-700" />
              ) : (
                <FaBars className="w-6 h-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-100 bg-white">
            <div className="py-4 space-y-2">
              {/* Mobile Navigation - All items */}
              <div className="px-4">
                <p className="text-xs font-bold text-gray-500 mb-3">القوائم</p>
                <div className="space-y-2">
                  {/* Navigation Links */}
                  {VERIFIER_NAV_ITEMS.map((item) => {
                    const isActive = location.pathname === item.path;
                    const NavIcon = NAV_ICON_MAP[item.icon];
                    
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`
                          w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200
                          ${
                            isActive
                              ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-md'
                              : 'text-gray-700 hover:bg-teal-50 hover:text-teal-600'
                          }
                        `}
                      >
                        {NavIcon && (
                          <NavIcon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-teal-500'}`} />
                        )}
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                  
                  {/* Tabs - Navigate to separate pages */}
                  <Link
                    to="/verifier/doctors"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`
                      w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200
                      ${
                        location.pathname === '/verifier/doctors'
                          ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-md'
                          : 'text-gray-700 hover:bg-teal-50 hover:text-teal-600'
                      }
                    `}
                  >
                    <FaUserMd className={`w-5 h-5 flex-shrink-0 ${location.pathname === '/verifier/doctors' ? 'text-white' : 'text-teal-500'}`} />
                    <span>الأطباء</span>
                  </Link>
                  
                  <Link
                    to="/verifier/pharmacies"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`
                      w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200
                      ${
                        location.pathname === '/verifier/pharmacies'
                          ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-md'
                          : 'text-gray-700 hover:bg-teal-50 hover:text-teal-600'
                      }
                    `}
                  >
                    <FaPills className={`w-5 h-5 flex-shrink-0 ${location.pathname === '/verifier/pharmacies' ? 'text-white' : 'text-teal-500'}`} />
                    <span>الصيدليات</span>
                  </Link>
                  
                  <Link
                    to="/verifier/laboratories"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`
                      w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200
                      ${
                        location.pathname === '/verifier/laboratories'
                          ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-md'
                          : 'text-gray-700 hover:bg-teal-50 hover:text-teal-600'
                      }
                    `}
                  >
                    <FaFlask className={`w-5 h-5 flex-shrink-0 ${location.pathname === '/verifier/laboratories' ? 'text-white' : 'text-teal-500'}`} />
                    <span>المعامل</span>
                  </Link>
                </div>
              </div>
              
              {/* Mobile Logout */}
              <div className="px-4 pt-4 border-t border-gray-100">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition-all duration-200 font-semibold border border-red-200"
                >
                  <FaSignOutAlt className="w-4 h-4" />
                  <span>تسجيل الخروج</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default VerifierNavbar;
