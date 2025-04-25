import React from 'react';
import { ShoppingBag, Video, Ticket, Package, Key, FilePlus, AlertCircle, PlusCircle } from 'lucide-react';

const listings = [
  { label: 'Start from scratch', icon: <FilePlus size={20} />, color: 'bg-gray-50 border-dashed border-gray-300 hover:border-gray-400' },
  { label: 'Digital product', icon: <ShoppingBag size={20} />, color: 'bg-green-100' },
  { label: 'Instagram close friends', icon: <Key size={20} />, color: 'bg-yellow-100' },
  { label: '1-on-1 Zoom call', icon: <Video size={20} />, color: 'bg-purple-100' },
  { label: 'Ticket for an event', icon: <Ticket size={20} />, color: 'bg-blue-100' },
  { label: 'Physical good', icon: <Package size={20} />, color: 'bg-pink-100' },
];

const Shop: React.FC = () => {
  return (
    <div className="flex justify-center bg-gray-50 min-h-screen">
      <div className="w-full max-w-4xl p-4 space-y-6 my-6">
        {/* Header */}
        <h1 className="text-xl font-semibold mb-4">Shop</h1>

        {/* Setup Card */}
        <div className="bg-white rounded-xl shadow-md p-6 space-y-4 border-l-4 border-blue-400">
          <div className="flex items-start space-x-4">
            <div className="bg-blue-100 rounded-lg p-3">
              <ShoppingBag className="text-xl text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">
                Create your first listing to start selling
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Shop is a simple and effective way to offer something to your audience. It could be anything from digital downloads to physical products.
                See some examples{" "}
                <a href="#" className="text-blue-600 hover:underline">
                  here
                </a>.
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button className="flex items-center gap-1 bg-black text-white px-4 py-2 hover:bg-gray-800 transition-colors rounded-3xl cursor-pointer">
              <PlusCircle size={16} className='h-4' />
              <span className='text-sm font-semibold'>Add Listing</span>
            </button>
            <span className="text-xs text-gray-600 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Takes less than 5 mins
            </span>
          </div>
        </div>

        {/* Listing Templates */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Choose a template</h3>
          <p className="text-sm text-gray-600 mb-6">Pick a template or start from scratch to create your listing</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {listings.map((item, index) => (
              <button
                key={index}
                className={`flex items-center gap-3 rounded-lg p-4 border transition-all hover:shadow-md ${item.color}`}
              >
                <div className="p-2 rounded-lg bg-white bg-opacity-60">
                  {item.icon}
                </div>
                <span className="text-sm font-medium text-gray-700">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Products */}
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <h3 className="text-gray-500 text-sm font-medium">PRODUCTS</h3>
              <div className="bg-green-100 p-2 rounded-lg">
                <ShoppingBag className="text-green-500" />
              </div>
            </div>
            <p className="text-3xl font-bold mt-2">0</p>
            <p className="text-xs text-gray-500 mt-1">Active listings</p>
          </div>
          
          {/* Sales */}
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <h3 className="text-gray-500 text-sm font-medium">TOTAL SALES</h3>
              <div className="bg-blue-100 p-2 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold mt-2">$0.00</p>
            <p className="text-xs text-gray-500 mt-1">No sales yet</p>
          </div>
        </div>

        {/* Sales History */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Sales history</h3>
          <div className="text-sm text-gray-400 grid grid-cols-4 gap-4 mb-2 font-medium">
            <span>DATE</span>
            <span>PRODUCT</span>
            <span>CUSTOMER</span>
            <span>AMOUNT</span>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-100 my-3"></div>

          {/* Empty Message */}
          <div className="flex items-center bg-gray-50 rounded-lg p-4 mt-4 shadow-sm border border-gray-100">
            <div className="bg-blue-100 p-2 rounded-full mr-3">
              <AlertCircle className="text-blue-500" />
            </div>
            <p className="text-sm">You haven't made any sales yet.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;