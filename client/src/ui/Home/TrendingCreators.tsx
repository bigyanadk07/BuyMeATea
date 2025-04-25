import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const TopSupportersTrending: React.FC = () => {
  const [activeTab, setActiveTab] = useState('topCreators');
  
  // Dummy data for demonstration
  const topCreators = [
    { id: 1, name: 'Sarah Chen', handle: '@sarahcreates', image: '/api/placeholder/80/80', teasReceived: 287, category: 'Artist' },
    { id: 2, name: 'Raj Patel', handle: '@rajcodes', image: '/api/placeholder/80/80', teasReceived: 243, category: 'Developer' },
    { id: 3, name: 'Maya Johnson', handle: '@mayawrites', image: '/api/placeholder/80/80', teasReceived: 219, category: 'Writer' },
    { id: 4, name: 'Kevin Lee', handle: '@kevinmusic', image: '/api/placeholder/80/80', teasReceived: 196, category: 'Musician' },
    { id: 5, name: 'Aisha Khan', handle: '@designaisha', image: '/api/placeholder/80/80', teasReceived: 185, category: 'Designer' },
    { id: 6, name: 'Leo Martinez', handle: '@leoteaches', image: '/api/placeholder/80/80', teasReceived: 172, category: 'Educator' },
  ];
  
  const trendingPages = [
    { id: 1, name: 'David Wong', handle: '@davidphoto', image: '/api/placeholder/80/80', growthPercent: 120, category: 'Photographer' },
    { id: 2, name: 'Elena Smith', handle: '@elenacooks', image: '/api/placeholder/80/80', growthPercent: 95, category: 'Chef' },
    { id: 3, name: 'Tomas Rivera', handle: '@tomasart', image: '/api/placeholder/80/80', growthPercent: 87, category: 'Artist' },
    { id: 4, name: 'Naomi Park', handle: '@naomigames', image: '/api/placeholder/80/80', growthPercent: 82, category: 'Gamer' },
    { id: 5, name: 'Jordan Taylor', handle: '@jordanfitness', image: '/api/placeholder/80/80', growthPercent: 74, category: 'Fitness' },
    { id: 6, name: 'Priya Sharma', handle: '@priyacraft', image: '/api/placeholder/80/80', growthPercent: 68, category: 'Crafter' },
  ];
  
  const popularCategories = [
    { id: 1, name: 'Artists', supporters: 3482, icon: '🎨' },
    { id: 2, name: 'Writers', supporters: 2951, icon: '✍️' },
    { id: 3, name: 'Musicians', supporters: 2748, icon: '🎵' },
    { id: 4, name: 'Developers', supporters: 2583, icon: '💻' },
    { id: 5, name: 'Content Creators', supporters: 2347, icon: '📱' },
    { id: 6, name: 'Educators', supporters: 2104, icon: '📚' },
  ];
  
  return (
    <section className="bg-white py-16 px-4 sm:px-8 md:px-12 rounded-3xl max-w-6xl mx-auto mt-12">
      <h1 className="text-center text-sm font-bold uppercase text-[#907ad6]">Community</h1>
      
      <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-center text-gray-800">
        Discover creators <br className="hidden sm:inline" />
        making waves.
      </h2>
      
      <p className="text-center max-w-3xl mx-auto pb-12 text-base sm:text-lg">
        See who's receiving the most support on <span className="nature-font">Buy me a tea</span> and find new creators to follow.
      </p>
      
      {/* Tabs */}
      <div className="flex justify-center mb-10">
        <div className="inline-flex rounded-lg bg-gray-100 p-1">
          <button 
            onClick={() => setActiveTab('topCreators')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${activeTab === 'topCreators' ? 'bg-[#907ad6] text-white' : 'text-gray-600'}`}
          >
            Top Creators
          </button>
          <button 
            onClick={() => setActiveTab('trendingPages')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${activeTab === 'trendingPages' ? 'bg-[#907ad6] text-white' : 'text-gray-600'}`}
          >
            Trending This Week
          </button>
          <button 
            onClick={() => setActiveTab('popularCategories')}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${activeTab === 'popularCategories' ? 'bg-[#907ad6] text-white' : 'text-gray-600'}`}
          >
            Popular Categories
          </button>
        </div>
      </div>
      
      {/* Top Creators Content */}
      {activeTab === 'topCreators' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {topCreators.map(creator => (
            <div key={creator.id} className="bg-gray-50 rounded-xl p-6 flex items-center hover:shadow-md transition-shadow duration-300">
              <img 
                src={creator.image} 
                alt={creator.name} 
                className="w-16 h-16 rounded-full object-cover mr-4"
              />
              <div>
                <h3 className="font-bold text-gray-900">{creator.name}</h3>
                <p className="text-gray-500 text-sm">{creator.handle}</p>
                <div className="mt-2 flex items-center">
                  <span className="text-sm mr-1">☕</span>
                  <span className="text-sm font-medium text-gray-700">{creator.teasReceived} teas</span>
                  <span className="mx-2 text-gray-300">|</span>
                  <span className="text-xs text-gray-500">{creator.category}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Trending Pages Content */}
      {activeTab === 'trendingPages' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {trendingPages.map(page => (
            <div key={page.id} className="bg-gray-50 rounded-xl p-6 flex items-center hover:shadow-md transition-shadow duration-300">
              <img 
                src={page.image} 
                alt={page.name} 
                className="w-16 h-16 rounded-full object-cover mr-4"
              />
              <div>
                <h3 className="font-bold text-gray-900">{page.name}</h3>
                <p className="text-gray-500 text-sm">{page.handle}</p>
                <div className="mt-2 flex items-center">
                  <span className="text-sm mr-1">📈</span>
                  <span className="text-sm font-medium text-green-600">+{page.growthPercent}% this week</span>
                  <span className="mx-2 text-gray-300">|</span>
                  <span className="text-xs text-gray-500">{page.category}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Popular Categories Content */}
      {activeTab === 'popularCategories' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularCategories.map(category => (
            <div key={category.id} className="bg-gray-50 rounded-xl p-6 hover:shadow-md transition-shadow duration-300">
              <div className="flex items-center mb-4">
                <span className="text-3xl mr-3">{category.icon}</span>
                <h3 className="font-bold text-xl text-gray-900">{category.name}</h3>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-sm">{category.supporters.toLocaleString()} supporters</span>
                <button className="text-[#907ad6] hover:text-[#7c67c0] text-sm font-medium">
                  Explore →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Link to="/creators">
      <div className="mt-12 text-center">
        <button className="bg-[#907ad6] hover:bg-[#7c67c0] text-white font-medium py-3 px-8 rounded-full transition duration-300 cursor-pointer">
          See All Creators
        </button>
      </div>
      </Link>
    </section>
  );
};

export default TopSupportersTrending;