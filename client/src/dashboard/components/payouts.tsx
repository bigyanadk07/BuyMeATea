import React from "react";
import { FiDollarSign, FiCreditCard, FiAlertCircle } from "react-icons/fi";
import { Coin } from "akar-icons";

const Payout: React.FC = () => {
  return (
    <div className="flex justify-center bg-gray-50 min-h-screen">
      <div className="w-full max-w-4xl p-4 space-y-6 my-6">
        {/* Header */}
        <h1 className="text-xl font-semibold mb-4">Payouts</h1>

        {/* Setup Card */}
        <div className="bg-white rounded-xl shadow-md p-6 space-y-4 border-l-4 border-yellow-400">
          <div className="flex items-start space-x-4">
            <div className="bg-yellow-100 rounded-lg p-3">
              <FiCreditCard className="text-xl text-yellow-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">
                Enter your payout info to start accepting payments
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                To enable payouts, you'll need to provide your bank details to our payment partner.
                Rest assured, your information is secure and will not be stored on our servers.
                Check if your country is supported for payouts{" "}
                <a href="#" className="text-blue-600 hover:underline">
                  here
                </a>.
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
          <button className="flex items-center bg-black text-white px-4 py-2 hover:bg-gray-800 transition-colors rounded-3xl cursor-pointer">
              <Coin className='h-4' />
              <span className='text-sm font-semibold'>Set up payouts</span>
            </button>
            <span className="text-xs text-gray-600 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Takes less than 3 mins
            </span>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Outstanding Balance */}
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <h3 className="text-gray-500 text-sm font-medium">OUTSTANDING BALANCE</h3>
              <div className="bg-blue-100 p-2 rounded-lg">
                <FiDollarSign className="text-blue-500" />
              </div>
            </div>
            <p className="text-3xl font-bold mt-2">$0.00</p>
            <p className="text-xs text-gray-500 mt-1">Available for withdrawal</p>
            <button
              disabled
              className="mt-4 bg-gray-200 text-gray-500 px-5 py-2 rounded-lg cursor-not-allowed text-sm flex items-center gap-2 w-fit"
            >
              <FiCreditCard /> Withdraw
            </button>
          </div>
          
          {/* Monthly Overview */}
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <h3 className="text-gray-500 text-sm font-medium">THIS MONTH</h3>
              <div className="bg-green-100 p-2 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold mt-2">$0.00</p>
            <p className="text-xs text-gray-500 mt-1">No income yet this month</p>
            <div className="flex space-x-4 mt-4 text-sm text-gray-500">
              <span className="flex items-center">
                <span className="w-3 h-3 bg-yellow-300 rounded-full mr-1" />
                $0 Supporters
              </span>
              <span className="flex items-center">
                <span className="w-3 h-3 bg-pink-300 rounded-full mr-1" />
                $0 Membership
              </span>
            </div>
          </div>
        </div>

        {/* Payout History */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Payout history</h3>
          <div className="text-sm text-gray-400 grid grid-cols-3 gap-4 mb-2 font-medium">
            <span>DATE</span>
            <span>AMOUNT</span>
            <span>STATUS</span>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-100 my-3"></div>

          {/* Empty Message */}
          <div className="flex items-center bg-gray-50 rounded-lg p-4 mt-4 shadow-sm border border-gray-100">
            <div className="bg-blue-100 p-2 rounded-full mr-3">
              <FiAlertCircle className="text-blue-500" />
            </div>
            <p className="text-sm">You haven't received any payouts so far.</p>
          </div>
        </div>
    
      </div>
    </div>
  );
};

export default Payout;