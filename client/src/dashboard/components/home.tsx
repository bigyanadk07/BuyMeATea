import React, { useEffect, useState } from 'react';
import { FiShare2, FiDollarSign, FiShoppingBag, FiLoader} from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';
import {ShareBox} from 'akar-icons'

const Home:React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    profilePic: ""
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
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
        
        setUserData({
          name: data.name || "",
          email: data.email || "",
          profilePic: data.profilePic || ""
        });
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError(error instanceof Error ? error.message : 'An error occurred');
        setIsLoading(false);
      }
    };
  
    fetchUserProfile();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center">
        <FiLoader className="animate-spin text-xl text-yellow-500" />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-sm">{error}</div>;
  }
  // Sample data for the chart
  const earningsData = [
    { day: 'Mon', amount: 0 },
    { day: 'Tue', amount: 0 },
    { day: 'Wed', amount: 0 },
    { day: 'Thu', amount: 0 },
    { day: 'Fri', amount: 0 },
    { day: 'Sat', amount: 0 },
    { day: 'Sun', amount: 0 },
  ];

  return (
    <div className="flex justify-center bg-gray-50 min-h-screen">
        
      <div className="w-full max-w-4xl p-4 space-y-6 my-6">
        {/* Top Card */}
                {/* Header */}
                <h1 className="text-xl font-semibold mb-4">Home</h1>
        <div className="bg-white rounded-xl shadow-md p-6 flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img
                src={userData.profilePic}
                alt="Profile"
                className="w-16 h-16 rounded-full object-cover  "
              />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Hi, {userData.name}</h2>
              <div className="flex items-center text-gray-500 text-sm">
              <span>buymecoffee.com/{userData.email.split('@')[0]}</span>

              </div>
            </div>
          </div>
          <div className="flex gap-3 mt-4 md:mt-0">
            <button className="flex items-center bg-black text-white px-4 py-2 hover:bg-gray-800 transition-colors rounded-3xl cursor-pointer">
              <ShareBox className='h-4' />
              <span className='text-sm font-semibold'>Share Page</span>
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-6 transition-shadow">
            <div className="flex items-center justify-between">
              <h3 className="text-gray-500 text-sm font-medium">Total Earnings</h3>
              <div className="bg-blue-100 p-2 rounded-lg">
                <FiDollarSign className="text-blue-500" />
              </div>
            </div>
            <p className="text-3xl font-bold mt-2">$0.00</p>
            <p className="text-xs text-gray-500 mt-1">+0% from last month</p>
          </div>
          

        </div>

        {/* Earnings Section */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">Earnings Overview</h3>
            <select className="border rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
              <option>This year</option>
            </select>
          </div>
          
          {/* Simple Chart */}
          <div className="h-48 flex items-end space-x-2">
            {earningsData.map((item, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center">
                <div className="w-full bg-gray-100 rounded-t-lg" style={{ height: `${Math.max(5, item.amount)}px` }}></div>
                <span className="text-xs mt-2 text-gray-500">{item.day}</span>
              </div>
            ))}
          </div>
          
          <div className="flex flex-wrap gap-6 mt-6">
            <div className="flex items-center">
              <span className="w-3 h-3 bg-yellow-400 rounded-full mr-2"></span>
              <span className="text-sm">$0 Supporters</span>
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 bg-pink-400 rounded-full mr-2"></span>
              <span className="text-sm">$0 Memberships</span>
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 bg-cyan-400 rounded-full mr-2"></span>
              <span className="text-sm">$0 Shop</span>
            </div>
          </div>
        </div>

        {/* Supporter Section */}
        <div className="bg-white rounded-xl shadow-md p-8 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-4 border border-gray-200">
            <FaHeart className="text-3xl text-gray-300" />
          </div>
          <h4 className="font-semibold text-xl mb-2">You don't have any supporters yet</h4>
          <p className="text-sm text-gray-500 max-w-md mb-6">
            Share your page with your audience to get started. The more you promote your page, the more likely you are to get supporters.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg flex items-center gap-2 transition-colors">
              <FiShare2 /> Share your page
            </button>
            <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-5 py-2 rounded-lg flex items-center gap-2 transition-colors">
              <FiShoppingBag /> Set up your shop
            </button>
          </div>
        </div>
        
        {/* Quick Tips */}
        <div className="bg-blue-50 rounded-xl shadow-sm p-6 border border-blue-100">
          <h3 className="font-semibold text-lg mb-3 text-blue-800">Tips to get your first supporter</h3>
          <ul className="space-y-2">
            <li className="flex items-start">
              <div className="bg-blue-100 rounded-full p-1 mr-3 mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-sm text-gray-700">Share your page on social media platforms</span>
            </li>
            <li className="flex items-start">
              <div className="bg-blue-100 rounded-full p-1 mr-3 mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-sm text-gray-700">Mention your 'Buy Me a Tea' link in your content</span>
            </li>
            <li className="flex items-start">
              <div className="bg-blue-100 rounded-full p-1 mr-3 mt-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-sm text-gray-700">Create exclusive content for supporters</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Home;