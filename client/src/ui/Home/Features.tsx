import React from 'react';

const Features: React.FC = () => {
  return (
    <section className="bg-white py-16 px-4 sm:px-8 md:px-12 rounded-3xl max-w-6xl mx-auto mt-12">
      <h1 className="text-center text-sm font-bold uppercase text-[#907ad6]">Features</h1>
      
      <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-center text-gray-800">
        Everything you need <br className="hidden sm:inline" />
        to receive support.
      </h2>
      
      <p className="text-center max-w-3xl mx-auto pb-12 text-base sm:text-lg">
        <span className="nature-font">Buy me a tea</span> provides all the tools you need to start receiving support from your audience with minimal hassle.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12 max-w-5xl mx-auto">
        {/* Feature 1 */}
        <div className="flex items-start">
          <div className="flex-shrink-0 mr-6">
            <div className="w-16 h-16 bg-[#f0ebff] rounded-full flex items-center justify-center">
              <span className="text-2xl">📊</span>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2 text-gray-800">Easy to use Dashboard</h3>
            <p className="text-gray-600">
              Track your supporters, monitor your earnings, and manage your profile all in one intuitive interface. No technical knowledge required.
            </p>
          </div>
        </div>

        {/* Feature 2 */}
        <div className="flex items-start">
          <div className="flex-shrink-0 mr-6">
            <div className="w-16 h-16 bg-[#f0ebff] rounded-full flex items-center justify-center">
              <span className="text-2xl">💳</span>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2 text-gray-800">Simple payments</h3>
            <p className="text-gray-600">
              Seamless integration with eSewa and Khalti payment systems makes it easy for your supporters to contribute in just a few clicks.
            </p>
          </div>
        </div>

        {/* Feature 3 */}
        <div className="flex items-start">
          <div className="flex-shrink-0 mr-6">
            <div className="w-16 h-16 bg-[#f0ebff] rounded-full flex items-center justify-center">
              <span className="text-2xl">✨</span>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2 text-gray-800">Zero platform registration charge</h3>
            <p className="text-gray-600">
              Create your account and set up your page absolutely free. No upfront costs or hidden fees to get started.
            </p>
          </div>
        </div>

        {/* Feature 4 */}
        <div className="flex items-start">
          <div className="flex-shrink-0 mr-6">
            <div className="w-16 h-16 bg-[#f0ebff] rounded-full flex items-center justify-center">
              <span className="text-2xl">🕶️</span>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2 text-gray-800">Anonymous donations option</h3>
            <p className="text-gray-600">
              Supporters can choose to remain anonymous if they prefer, giving everyone the comfort to contribute on their own terms.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-16 text-center">
        <a href="#" className="text-[#907ad6] hover:text-[#7c67c0] font-medium underline text-lg transition duration-300">
          Learn more about our features
        </a>
      </div>
    </section>
  );
};

export default Features;