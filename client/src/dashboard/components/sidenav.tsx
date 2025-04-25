import React, { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { Home, Coin ,ShoppingBag,Gear, Headphone, SignOut, Heart, PeopleGroup, ArrowCycle } from 'akar-icons';
import { Link } from 'react-router-dom';
import Logo from "/images/buymeatea-logo.png";

interface SideNavProps {
  userName: string;
  activePage: string;
  onPageChange: (page: string) => void;
  onLogout: () => void;
}

const SideNav: React.FC<SideNavProps> = ({ 
  userName, 
  activePage, 
  onPageChange, 
  onLogout 
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleMobileSidebar = () => {
    setMobileOpen(!mobileOpen);
  };

  // Handle navigation item click
  const handleNavClick = (page: string) => {
    onPageChange(page);
    if (window.innerWidth < 768) {
      setMobileOpen(false);
    }
  };

  // Navigation items configuration with categories
  const navCategories = [
    {
      category: "General",
      items: [
        { id: 'home', label: 'Home', icon: <Home size={16} /> },
      ]
    },
    {
      category: "Monetize",
      items: [
        { id: 'shop', label: 'Shop', icon: <ShoppingBag size={16} /> },
        { id: 'supporters', label: 'Supporters', icon: <Heart size={16} /> },

      ]
    },
    {
      category: "Settings",
      items: [
        { id: 'activity', label: 'Activity', icon: <ArrowCycle size={16} />},
        { id: 'payouts', label: 'Payouts', icon: <Coin size={16} /> },
        { id: 'editprofile', label: 'Profile', icon: <PeopleGroup size={16} /> },
        { id: 'settings', label: 'Settings', icon: <Gear size={16} /> },
        { id: 'support', label: 'Support', icon: <Headphone size={16} /> },
      ]
    }
  ];

  // Render navigation item
  const NavItem = ({ id, label, icon }: { id: string, label: string, icon: React.ReactNode }) => (
    <li>
      <button
        onClick={() => handleNavClick(id)}
        className={`block w-full rounded-lg px-4 py-2 text-xs transition-colors duration-200 ${
          activePage === id
            ? 'bg-gray-100 text-gray-700'
            : 'text-black hover:bg-gray-100 hover:text-gray-700'
        }`}
      >
        <span className="flex items-center">
          <span className={`${activePage === id ? 'text-black' : 'text-black font-normal'} mr-3`}>{icon}</span>
          {label}
        </span>
      </button>
    </li>
  );

  // Desktop sidebar classes
  const sidebarClasses = `
    fixed top-0 left-0 h-full bg-white border-r border-gray-100 z-20 transition-all duration-300 ease-in-out
    w-64 hidden md:block
  `;

  // Mobile sidebar classes
  const mobileSidebarClasses = `
    fixed top-0 left-0 h-full bg-white border-r border-gray-100 z-30 transition-all duration-300 ease-in-out w-64 transform
    ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
    md:hidden
  `;

  // Mobile overlay
  const overlayClasses = `
    fixed inset-0 bg-black bg-opacity-30 z-20 transition-opacity duration-300
    ${mobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
    md:hidden
  `;

  const renderNavigation = () => (
    <div className="flex flex-col h-full">
      {/* Logo and Header */}
      <div className="py-6 px-4 flex items-center">
        <div className="flex items-center justify-center">
        <Link to="/" className="flex items-center">
            <img src={Logo} alt="Buy me a tea logo" className="w-16 h-16 rotate-14" />
            <span className="nature-font text-lg font-medium">Buy me a tea</span>
          </Link>
        </div>
      </div>

      {/* Navigation Categories */}
      <nav className="flex-1 px-4 py-4 overflow-y-auto">
        <ul className="flex flex-col space-y-6">
          {navCategories.map((category, index) => (
            <li key={index}>
              <strong className="block text-xs font-normal text-gray-600 uppercase">
                {category.category}
              </strong>
              <ul className="mt-2 space-y-1">
                {category.items.map((item) => (
                  <NavItem 
                    key={item.id} 
                    id={item.id} 
                    label={item.label} 
                    icon={item.icon} 
                  />
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </nav>

      {/* User Info & Logout */}
      <div className="p-4 mt-auto border-t border-gray-100">
        <div className="mb-4 px-2 py-2 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-500 mb-1">Logged in as</p>
          <p className="text-xs font-semibold text-gray-700 truncate">{userName}</p>
        </div>
        
        <form action="#">
          <button
            onClick={(e) => {
              e.preventDefault();
              onLogout();
            }}
            className="block w-full rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          >
            <span className="flex items-center text-xs font-normal">
              <SignOut className="mr-2" size={16} />
              Logout
            </span>
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={toggleMobileSidebar}
        className="md:hidden fixed top-4 left-4 z-30 p-2 rounded-full bg-white shadow-sm text-gray-500"
      >
        {mobileOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
      </button>

      {/* Desktop Sidebar */}
      <div className={sidebarClasses}>
        {renderNavigation()}
      </div>

      {/* Mobile Sidebar */}
      <div className={mobileSidebarClasses}>
        {renderNavigation()}
      </div>

      {/* Mobile Overlay */}
      <div 
        className={overlayClasses}
        onClick={toggleMobileSidebar}
      ></div>
    </>
  );
};

export default SideNav;