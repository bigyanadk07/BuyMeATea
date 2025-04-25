import React from 'react';
import { Link } from 'react-router-dom';
import { Twitter, Instagram, Youtube } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="py-8 px-4 md:px-8 lg:px-16 xl:px-24 brother-font">
      <div className="container mx-auto">
        {/* Desktop Footer - Horizontal layout */}
        <div className="hidden md:flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Buy me a tea
          </div>
          <div className="flex gap-5">
            <Link to="/about" className="hover:text-gray-600 transition-colors">About</Link>
            <Link to="/helpcenter" className="hover:text-gray-600 transition-colors">Help Center</Link>
            <Link to="/resources" className="hover:text-gray-600 transition-colors">Resources</Link>
          </div>
          <div className="flex gap-5">
            <Twitter className="hover:text-gray-600 transition-colors cursor-pointer" size={20} />
            <Instagram className="hover:text-gray-600 transition-colors cursor-pointer" size={20} />
            <Youtube className="hover:text-gray-600 transition-colors cursor-pointer" size={20} />
          </div>
        </div>

        {/* Mobile Footer - Stacked layout */}
        <div className="md:hidden flex flex-col space-y-6">
          {/* Links */}
          <div className="flex justify-center gap-4 text-sm">
            <Link to="/about" className="hover:text-gray-600 transition-colors">About</Link>
            <Link to="/helpcenter" className="hover:text-gray-600 transition-colors">Help Center</Link>
            <Link to="/resources" className="hover:text-gray-600 transition-colors">Resources</Link>
          </div>
          
          {/* Social Icons */}
          <div className="flex justify-center gap-6">
            <Twitter className="hover:text-gray-600 transition-colors cursor-pointer" size={18} />
            <Instagram className="hover:text-gray-600 transition-colors cursor-pointer" size={18} />
            <Youtube className="hover:text-gray-600 transition-colors cursor-pointer" size={18} />
          </div>
          
          {/* Copyright/Brand */}
          <div className="text-sm text-gray-500 text-center mt-4">
            Buy me a tea
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;