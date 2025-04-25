import { ArrowRight } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'
import Logo from '/images/buymeatea-logo2.png'

const HeroSection: React.FC = () => {
  
  return (
    <div>
      {/* Social Proof */}
      <div className="flex justify-center mb-2">
        <div className="bg-gray-100 rounded-full px-6 py-2 text-sm font-medium text-gray-700">
          Trusted by over 1,000,000 creators all over Nepal
        </div>
      </div>
      
      {/* Hero Section */}
      <div className="flex flex-col items-center gap-6 mb-12">
        <div className="relative">
          <h1 className="text-5xl md:text-7xl font-extrabold text-center leading-tight">
            Fund your <br/> creative work
          </h1>
          {/* Positioned logo - hidden on small screens */}
          <div className="absolute top-0 left-0 transform -translate-x-16 -translate-y-6 -rotate-2 hidden md:block md:left-10 md:-translate-x-36 md:-translate-y-16">
            <img 
              src={Logo}
              alt="Company Logo" 
              className="h-36 md:h-54"
            />
          </div>
        </div>
        <p className="text-xl text-center text-gray-600 max-w-2xl mt-4">
          Accept support, start a membership, and set up your shop — all in one place. It's easier than you think.
        </p>
        
        {/* CTA */}
        <div className="flex flex-col items-center gap-4 mt-4">
          <Link to="/signup">
            <button className="bg-[#907ad6] text-white hover:bg-yellow-400 transition duration-300 px-8 py-4 md:px-10 md:py-5 rounded-full font-bold text-lg flex items-center gap-2 cursor-pointer">
              Start my page <ArrowRight className="h-5 w-5" />
            </button>
          </Link>
          <p className="text-sm text-gray-500">Free to start • Set up in less than a minute • No technical skills needed</p>
        </div>
      </div>
    </div>
  )
}

export default HeroSection