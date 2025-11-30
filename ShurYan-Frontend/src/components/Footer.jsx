import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="w-full bg-gray-900 text-white">
      <div className="container mx-auto px-6 py-8">
        {/* Main Footer Content */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-6 md:space-y-0 text-center md:text-right">
          {/* Brand Info */}
          <div className="flex items-center space-x-3 space-x-reverse">
            <svg className="h-8 w-8 text-teal-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
            <h1 className="text-2xl font-bold tracking-wide text-white">شريان</h1>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            <a href="#" className="text-gray-300 hover:text-teal-400 transition-colors">الرئيسية</a>
            <a href="#doctors" className="text-gray-300 hover:text-teal-400 transition-colors">خدماتنا</a>
            <a href="#" className="text-gray-300 hover:text-teal-400 transition-colors">تواصل معنا</a>
            <a href="#" className="text-gray-300 hover:text-teal-400 transition-colors">سياسة الخصوصية</a>
          </nav>

          {/* Social Media */}
          <div className="flex space-x-4 space-x-reverse">
            <a href="#" className="text-gray-300 hover:text-teal-400 transition-colors">
              <FaFacebook className="w-6 h-6" />
            </a>
            <a href="#" className="text-gray-300 hover:text-teal-400 transition-colors">
              <FaTwitter className="w-6 h-6" />
            </a>
            <a href="#" className="text-gray-300 hover:text-teal-400 transition-colors">
              <FaInstagram className="w-6 h-6" />
            </a>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-gray-700 text-center">
          <p className="text-white">&copy; 2025 <span className="font-bold">شريان</span>. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
