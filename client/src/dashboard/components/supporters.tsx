import React from "react";
import { FiHeart, FiCalendar, FiClock, FiShare2, FiAlertCircle } from "react-icons/fi";
import { ShareBox } from "akar-icons";

const Supporters: React.FC = () => {
  return (
    <div className="flex justify-center bg-gray-50 min-h-screen">
      <div className="w-full max-w-4xl p-4 space-y-6 my-6">
        {/* Header */}
        <h1 className="text-xl font-semibold mb-4">Supporters</h1>
        
        {/* Tabs */}
        <div className="flex space-x-4 border-b border-gray-200 mb-6">
          <button className="pb-2 border-b-2 border-black text-black font-medium">
            One-time
          </button>
          <button className="pb-2 text-gray-500 hover:text-black transition">
            Settings
          </button>
        </div>

        {/* Share Card */}
        <div className="bg-white rounded-xl shadow-md p-6 space-y-4 border-l-4 border-blue-400">
          <div className="flex items-start space-x-4">
            <div className="bg-blue-100 rounded-lg p-3">
              <FiShare2 className="text-xl text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">
                Share your page to get supporters
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Share your page with your audience to start receiving support. The more you share, the more visibility you'll gain.
                Check our tips to maximize your supporter engagement{" "}
                <a href="#" className="text-blue-600 hover:underline">
                  here
                </a>.
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
          <button className="flex items-center bg-black text-white px-4 py-2 hover:bg-gray-800 transition-colors rounded-3xl cursor-pointer">
              <ShareBox className='h-4' />
              <span className='text-sm font-semibold'>Share Page</span>
            </button>
            <span className="text-xs text-gray-600 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Increase your reach
            </span>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Total Supporters */}
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <h3 className="text-gray-500 text-sm font-medium">TOTAL SUPPORTERS</h3>
              <div className="bg-red-100 p-2 rounded-lg">
                <FiHeart className="text-red-500" />
              </div>
            </div>
            <p className="text-3xl font-bold mt-2">0</p>
            <p className="text-xs text-gray-500 mt-1">Supporters count</p>
          </div>
          
          {/* Last 30 Days */}
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <h3 className="text-gray-500 text-sm font-medium">LAST 30 DAYS</h3>
              <div className="bg-yellow-100 p-2 rounded-lg">
                <FiCalendar className="text-yellow-500" />
              </div>
            </div>
            <p className="text-3xl font-bold mt-2">$0.00</p>
            <p className="text-xs text-gray-500 mt-1">Recent support amount</p>
          </div>
          
          {/* All-time */}
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <h3 className="text-gray-500 text-sm font-medium">ALL-TIME</h3>
              <div className="bg-green-100 p-2 rounded-lg">
                <FiClock className="text-green-500" />
              </div>
            </div>
            <p className="text-3xl font-bold mt-2">$0.00</p>
            <p className="text-xs text-gray-500 mt-1">Total support received</p>
          </div>
        </div>

        {/* Supporters History */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Support history</h3>
          <div className="text-sm text-gray-400 grid grid-cols-3 gap-4 mb-2 font-medium">
            <span>DATE</span>
            <span>NAME</span>
            <span>AMOUNT</span>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-100 my-3"></div>

          {/* Empty Message */}
          <div className="flex items-center bg-gray-50 rounded-lg p-4 mt-4 shadow-sm border border-gray-100">
            <div className="bg-blue-100 p-2 rounded-full mr-3">
              <FiAlertCircle className="text-blue-500" />
            </div>
            <p className="text-sm">You haven't received any supporters so far.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Supporters;