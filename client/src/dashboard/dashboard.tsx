import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import SideNav from './components/sidenav';
import Payouts from './components/payouts';
import Support from './components/support';
import Editprofile from './components/editprofile';
import Activity from './components/activity';
import Home from './components/home'
import Settings from './components/settings'
import Shop from './components/shop';
import Supporters from './components/supporters';

const Dashboard: React.FC = () => {

  
  useEffect(()=>{
    document.title = "Buy Me a Tea | Dashboard"
  })

  const [userName, setUserName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get active tab from URL path
  const getActiveTabFromPath = () => {
    const path = location.pathname.split('/').pop() || '';
    return path === 'dashboard' ? 'home' : path;
  };
  
  const activeTab = getActiveTabFromPath();
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/profile', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
  
        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }
  
        const data = await response.json(); 
        setUserName(data.name);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setIsLoading(false);
      }
    };
  
    fetchData();
  }, []);
  
  const handlePageChange = (page: string) => {
    navigate(page === 'home' ? '/dashboard' : `/dashboard/${page}`);
  };
  
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/signin';
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#907ad6]"></div>
      </div>
    );
  }
  
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Side Navigation */}
      <SideNav 
        userName={userName}
        activePage={activeTab}
        onPageChange={handlePageChange}
        onLogout={handleLogout}
      />
      
      {/* Main Content */}
      <div className="md:ml-64 w-full p-4 md:p-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/payouts" element={
            <div>
              <Payouts />
            </div>
          } />
          <Route path="/shop" element={
            <div>
              <Shop />
            </div>
          } />
          <Route path="/supporters" element={
            <div>
              <Supporters />
            </div>
          } />
          <Route path="/settings" element={
            <div>
              <Settings />
            </div>
          } />
          <Route path="/support" element={
            <div>
              <Support />
            </div>
          } />
          <Route path="/editprofile" element={
            <div>
              <Editprofile />
            </div>
          } />
          <Route path="/activity" element={
            <div>
              <Activity />
            </div>
          } />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;