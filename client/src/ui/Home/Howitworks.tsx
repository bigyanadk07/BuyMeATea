import React from 'react';
import { Link } from 'react-router-dom';

const HowItWorks: React.FC = () => {
  return (
    <section className="bg-white py-16 px-4 sm:px-8 md:px-12 rounded-3xl max-w-6xl mx-auto mt-12">
      <h1 className="text-center text-sm font-bold uppercase text-[#907ad6]">How It Works</h1>
      
      <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-center text-gray-800">
        Start getting support <br className="hidden sm:inline" />
        in three simple steps.
      </h2>
      
      <p className="text-center max-w-3xl mx-auto pb-12 text-base sm:text-lg">
        <span className="nature-font">Buy me a tea</span> makes receiving support for your work incredibly simple. Here's how to get started.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 max-w-5xl mx-auto">
        {/* Step 1 */}
        <div className="flex flex-col items-center text-center p-6">
          <div className="w-20 h-20 bg-[#f0ebff] rounded-full flex items-center justify-center mb-6">
            <span className="text-4xl">☕</span>
          </div>
          <h3 className="text-xl font-bold mb-3 text-gray-800">Create your page</h3>
          <p className="text-gray-600">
            Sign up and personalize your page in minutes. Add your bio, photo, and custom message.
          </p>
        </div>

        {/* Step 2 */}
        <div className="flex flex-col items-center text-center p-6">
          <div className="w-20 h-20 bg-[#f0ebff] rounded-full flex items-center justify-center mb-6">
            <span className="text-4xl">🧡</span>
          </div>
          <h3 className="text-xl font-bold mb-3 text-gray-800">Share with your supporters</h3>
          <p className="text-gray-600">
            Post your unique link on social media, your website, or in your content description.
          </p>
        </div>

        {/* Step 3 */}
        <div className="flex flex-col items-center text-center p-6">
          <div className="w-20 h-20 bg-[#f0ebff] rounded-full flex items-center justify-center mb-6">
            <span className="text-4xl">💸</span>
          </div>
          <h3 className="text-xl font-bold mb-3 text-gray-800">Get tips for your creative work</h3>
          <p className="text-gray-600">
            Receive support directly to your account, along with encouraging messages from your fans.
          </p>
        </div>
      </div>

        <Link to="/signup">
        <div className="mt-16 text-center">
        <button className="bg-[#907ad6] hover:bg-[#7c67c0] text-white font-medium py-3 px-8 rounded-full transition duration-300 cursor-pointer">
          Create Your Page
        </button>
      </div></Link>
    </section>
  );
};

export default HowItWorks;