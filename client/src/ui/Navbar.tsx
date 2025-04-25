import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from "/images/buymeatea-logo.png";
import { Search, LogOut, LayoutDashboard, Bell, Settings } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [profilePic, setProfilePic] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();

  useEffect(() => {
    // Close dropdowns when location changes (navigating)
    setIsMenuOpen(false);
    setIsProfileDropdownOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const fetchData = async () => {
      // Check if token exists first
      const token = localStorage.getItem('token');
      if (!token) {
        setIsLoading(false);
        setIsLoggedIn(false);
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/api/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
  
        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }
  
        const data = await response.json();
        setUserName(data.name);
        setProfilePic(data.profilePic);
        setIsLoading(false);
        setIsLoggedIn(true);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setIsLoading(false);
        setIsLoggedIn(false);
      }
    };
  
    fetchData();
  }, []);

  const user = {
    name: userName || "Guest User",
    profilePicture: profilePic || "/api/placeholder/40/40" // Fallback to placeholder
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    // Close profile dropdown when opening menu
    if (!isMenuOpen) setIsProfileDropdownOpen(false);
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
    // Close menu when opening profile dropdown on mobile
    if (!isProfileDropdownOpen && isMenuOpen) setIsMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUserName('');
    setProfilePic('');
    setIsProfileDropdownOpen(false);
    // Optional: redirect to home or login page
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle search functionality
    console.log("Searching for:", searchQuery);
    // Redirect to search results page or show search results
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.profile-menu') && isProfileDropdownOpen) {
        setIsProfileDropdownOpen(false);
      }
      if (!target.closest('.mobile-menu') && !target.closest('.menu-button') && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileDropdownOpen, isMenuOpen]);

  // Handle window resizing
  useEffect(() => {
    const handleResize = () => {
      // Close menus if window resized to desktop view
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <nav className="tracking-widest brother-font relative bg-white shadow-sm">
      {/* Desktop Navigation - Rearranged with 3 sections and responsive sizing */}
      <div className="hidden md:flex justify-between items-center py-2 px-4 lg:px-6 max-w-7xl mx-auto">
        {/* Left section - FAQ and Resources */}
        <div className="flex-1 flex items-center gap-2 lg:gap-6">
          <div className="flex gap-3 lg:gap-5 text-xs lg:text-sm">
            <Link 
              to="/faq" 
              className="tracking-normal relative group px-2 lg:px-4 py-1 hover:text-blue-600 transition-colors duration-200"
            >
              FAQ
              <span className="absolute left-0 bottom-0 w-0 h-0.5"></span>
            </Link>
            <Link 
              to="/resources" 
              className="tracking-normal relative group px-2 lg:px-4 py-1 hover:text-blue-600 transition-colors duration-200"
            >
              Resources
              <span className="absolute left-0 bottom-0 w-0 h-0.5"></span>
            </Link>
            <Link 
              to="/creators" 
              className="tracking-normal relative group px-2 lg:px-4 py-1 hover:text-blue-600 transition-colors duration-200"
            >
              Explore
              <span className="absolute left-0 bottom-0 w-0 h-0.5"></span>
            </Link>
          </div>
        </div>
        
        {/* Center section - Logo & Brand */}
        <div className="flex-1 flex justify-center">
          <Link to="/" className="flex items-center">
            <img src={Logo} alt="Buy me a tea logo" className="w-12 h-12 lg:w-16 lg:h-16 rotate-14" />
            <span className="nature-font text-base lg:text-lg font-medium">Buy me a tea</span>
          </Link>
        </div>

        {/* Right section - Search and Profile */}
        <div className="flex-1 flex items-center justify-end gap-2 lg:gap-5">
          
          {isLoading ? (
            // Loading State
            <div className="animate-pulse flex items-center gap-2">
              <div className="h-8 w-16 lg:w-20 bg-gray-200 rounded-full"></div>
              <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
            </div>
          ) : isLoggedIn ? (
            /* Logged-in User Interface */
            <div className="flex items-center gap-2 lg:gap-4 profile-menu">
              {/* Notification Bell */}
              <button className="relative p-1.5 rounded-full hover:bg-gray-100 transition-colors">
                <Bell className="w-4 h-4 lg:w-5 lg:h-5 text-gray-600" />
                <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>
              
              {/* Profile Button & Minimal Dropdown */}
              <div className="relative">
                <button 
                  onClick={toggleProfileDropdown}
                  className="flex items-center gap-2 cursor-pointer hover:opacity-90 transition-opacity"
                  aria-expanded={isProfileDropdownOpen}
                  aria-haspopup="true"
                >
                  <img 
                    src={user.profilePicture} 
                    alt="Profile" 
                    className="w-7 h-7 lg:w-8 lg:h-8 rounded-full object-cover border border-gray-200 shadow-sm transition-transform hover:scale-105"
                  />
                </button>
                
                {/* Minimal Dropdown */}
                {isProfileDropdownOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-md z-50 overflow-hidden border border-gray-100 text-sm tracking-tight"
                  >
                    <div className="py-1 text-sm">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="font-medium text-gray-800">{user.name}</p>
                      </div>
                      
                      <Link 
                        to="/dashboard" 
                        className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        <LayoutDashboard className="w-4 h-4 mr-3 text-gray-500" />
                        <span>Dashboard</span>
                      </Link>

                      <Link 
                        to="/dashboard/settings" 
                        className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setIsProfileDropdownOpen(false)}
                      >
                        <Settings className="w-4 h-4 mr-3 text-gray-500" />
                        <span>Settings</span>
                      </Link>

                      <div className="border-t border-gray-100 my-1"></div>

                      <button 
                        className="flex items-center w-full text-left px-4 py-2 text-red-600 hover:bg-gray-50 transition-colors"
                        onClick={handleLogout}
                      >
                        <LogOut className="w-4 h-4 mr-3" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Login/Signup Links for Logged Out Users */
            <div className="flex gap-2 lg:gap-3 text-xs lg:text-sm">
              <Link 
                to="/signin" 
                className="tracking-normal px-3 lg:px-5 py-1.5 rounded-full border border-gray-300 hover:bg-gray-50 transition-all duration-300"
              >
                Sign In
              </Link>
              <Link 
                to="/signup" 
                className="tracking-normal px-3 lg:px-5 py-1.5 rounded-full bg-[#ffdd00] hover:bg-[#FFD100] transition-all duration-300 hidden lg:inline-block"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Navigation - without border */}
      <div className="md:hidden flex justify-between items-center p-3">
        {/* Left - Menu Button */}
        <button 
          onClick={toggleMenu} 
          className="menu-button p-1.5 focus:outline-none"
          aria-label="Toggle menu"
        >
          <div className={`w-6 h-0.5 bg-black mb-1.5 transition-all ${isMenuOpen ? "transform rotate-45 translate-y-2" : ""}`}></div>
          <div className={`w-6 h-0.5 bg-black mb-1.5 transition-all ${isMenuOpen ? "opacity-0" : "opacity-100"}`}></div>
          <div className={`w-6 h-0.5 bg-black transition-all ${isMenuOpen ? "transform -rotate-45 -translate-y-2" : ""}`}></div>
        </button>
        
        {/* Center - Logo */}
        <div className="flex gap-2 items-center">
          <img src={Logo} alt="Buy me a tea logo" className="w-8 h-auto sm:w-10" />
          <Link to="/" className="nature-font text-xs sm:text-sm">Buy me a tea</Link>
        </div>
        
        {/* Right - User Profile or Login Button */}
        {isLoggedIn ? (
          <button 
            onClick={toggleProfileDropdown}
            className="profile-menu"
          >
            <img 
              src={user.profilePicture} 
              alt="Profile" 
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border border-gray-100 shadow-sm" 
            />
          </button>
        ) : (
          <Link 
            to="/signin" 
            className="tracking-normal px-3 lg:px-5 py-1.5 rounded-full border border-gray-300 hover:bg-gray-50 transition-all duration-300"
          >
            Sign In
          </Link>
        )}
      </div>

      {/* Mobile Menu - with overlay and improved positioning */}
      {isMenuOpen && (
        <div className="mobile-menu md:hidden fixed inset-0 bg-black bg-opacity-20 z-40" style={{ top: '53px' }}>
          <div className="absolute top-0 left-0 right-0 bg-white shadow-lg z-50 max-h-[calc(100vh-53px)] overflow-y-auto transition-all duration-300 ease-in-out">
            {/* Search Bar for Mobile */}
            <div className="p-4 border-b border-gray-100">
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  placeholder="Search creators..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm bg-gray-100 rounded-full focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button type="submit" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  <Search className="w-4 h-4" />
                </button>
              </form>
            </div>
            
            {/* Navigation Links */}
            <div className="p-4">
              <div className="flex flex-col divide-y divide-gray-100">
                <Link 
                  to="/explore" 
                  className="flex items-center py-3 hover:text-blue-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="font-medium">Explore</span>
                </Link>
                
                <Link 
                  to="/faq" 
                  className="flex items-center py-3 hover:text-blue-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="font-medium">FAQ</span>
                </Link>
                
                <Link 
                  to="/resources" 
                  className="flex items-center py-3 hover:text-blue-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="font-medium">Resources</span>
                </Link>
              </div>
              
              {isLoggedIn && (
                /* Profile Options for Logged In Users */
                <div className="mt-2 pt-2 border-t border-gray-200">
                  <div className="flex items-center py-3 mb-2">
                    <img 
                      src={user.profilePicture} 
                      alt="Profile" 
                      className="w-10 h-10 rounded-full mr-3 object-cover border border-gray-200" 
                    />
                    <div>
                      <span className="font-medium">{user.name}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col divide-y divide-gray-100">
                    <Link 
                      to="/dashboard" 
                      className="flex items-center py-3 hover:text-blue-600"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <LayoutDashboard className="w-4 h-4 mr-3 text-gray-600" />
                      <span className="font-medium">Dashboard</span>
                    </Link>
                    
                    <Link 
                      to="/settings" 
                      className="flex items-center py-3 hover:text-blue-600"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Settings className="w-4 h-4 mr-3 text-gray-600" />
                      <span className="font-medium">Settings</span>
                    </Link>
                    
                    <button 
                      className="flex items-center w-full text-left py-3 text-red-600"
                      onClick={handleLogout}
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      <span className="font-medium">Logout</span>
                    </button>
                  </div>
                </div>
              )}
              
              {!isLoggedIn && (
                /* Login/Signup for Logged Out Users */
                <div className="flex flex-col gap-3 mt-4 pt-2 border-t border-gray-200">
                  <Link 
                    to="/signin" 
                    className="w-full py-2 text-center rounded-full border border-gray-300 hover:bg-gray-50 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link 
                    to="/signup" 
                    className="w-full py-2 text-center bg-[#ffdd00] hover:bg-[#FFD100] rounded-full"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Mobile Profile Dropdown - with improved overlay */}
      {isProfileDropdownOpen && (
        <div className="md:hidden fixed inset-0 bg-black bg-opacity-10 z-40" style={{ top: '53px' }} onClick={() => setIsProfileDropdownOpen(false)}>
          <div 
            className="absolute top-0 right-4 w-48 bg-white rounded-lg shadow-md z-50 overflow-hidden border border-gray-100"
            onClick={(e) => e.stopPropagation()} 
          >
            <div className="py-1 text-sm">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="font-medium text-gray-800">{user.name}</p>
              </div>
              <Link 
                to="/dashboard" 
                className="flex items-center px-4 py-2 hover:bg-gray-50"
                onClick={() => setIsProfileDropdownOpen(false)}
              >
                <LayoutDashboard className="w-4 h-4 mr-3 text-gray-500" />
                <span>Dashboard</span>
              </Link>
              <Link 
                to="/settings" 
                className="flex items-center px-4 py-2 hover:bg-gray-50"
                onClick={() => setIsProfileDropdownOpen(false)}
              >
                <Settings className="w-4 h-4 mr-3 text-gray-500" />
                <span>Settings</span>
              </Link>
              <div className="border-t border-gray-100 my-1"></div>
              <button 
                className="flex items-center w-full text-left px-4 py-2 text-red-600 hover:bg-gray-50"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-3" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;