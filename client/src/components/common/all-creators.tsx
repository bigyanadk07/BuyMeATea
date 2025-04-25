import React, { useEffect, useState } from 'react';
import { Search, ArrowRight, Instagram, Twitter, Youtube } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Define a type for creator objects
interface Creator {
  _id: string;
  name: string;
  username?: string;
  profilePic: string;
  bio?: string;
  category?: string;
  followers?: number;
  social?: {
    instagram?: string;
    twitter?: string;
    youtube?: string;
  };
}

const AllCreators: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [creators, setCreators] = useState<Creator[]>([]);
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/profile/all', {
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        if (!response.ok) {
          throw new Error('Failed to fetch profiles');
        }
  
        const data = await response.json();
        
        // Set creators as the array received from the API
        setCreators(data);
        
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
  
    fetchData();
  }, []);

  // Filter creators based on search term
  const filteredCreators = creators.filter(creator => 
    creator.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle navigation to creator profile
  const handleViewCreator = (creator: Creator) => {
    // Use username if available, otherwise fall back to _id
    const creatorIdentifier = creator.username || creator._id;
    
    // Navigate to the creator page and pass the creator data as state
    navigate(`/creator/${creatorIdentifier}`, { 
      state: { 
        creatorData: {
          ...creator,
          // Ensure we have a username property for the API calls
          username: creator.username || creator._id
        } 
      } 
    });
  };

  useEffect(() => {
    // Scroll to the top when the component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-white min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Social Proof */}
        <div className="flex justify-center mb-6">
          <div className="bg-gray-100 rounded-full px-6 py-2 text-sm font-medium text-gray-700">
            Discover amazing creators all over Nepal
          </div>
        </div>
        
        {/* Header */}
        <div className="flex flex-col items-center gap-4 mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-center leading-tight">
            Our Creator <br/> Community
          </h1>
          <p className="text-xl text-center text-gray-600 max-w-2xl">
            Connect with talented creators who are sharing their passion and building their audience
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row justify-center gap-4 mb-12">
          <div className="relative flex-grow max-w-lg">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-4 border border-gray-200 rounded-full bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent"
              placeholder="Search creators..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Creators Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCreators.map((creator) => (
            <div key={creator._id} className="bg-white rounded-3xl shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-gray-100">
              <div className="p-6">
                <div className="flex items-center space-x-4">
                  <img
                    src={creator.profilePic || '/default-profile.png'}
                    alt={creator.name}
                    className="h-16 w-16 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{creator.name}</h3>
                    <p className="text-sm text-gray-500">{creator.category || 'Creator'}</p>
                  </div>
                </div>
                
                <div className="mt-4 flex justify-between items-center">
                  <div className="text-sm font-medium text-gray-600">
                    {creator.followers || 0} followers
                  </div>
                  <div className="flex space-x-2">
                    {creator.social?.instagram && (
                      <a href={creator.social.instagram} target="_blank" rel="noopener noreferrer">
                        <Instagram className="h-5 w-5 text-gray-600 hover:text-pink-500 cursor-pointer" />
                      </a>
                    )}
                    {creator.social?.twitter && (
                      <a href={creator.social.twitter} target="_blank" rel="noopener noreferrer">
                        <Twitter className="h-5 w-5 text-gray-600 hover:text-blue-500 cursor-pointer" />
                      </a>
                    )}
                    {creator.social?.youtube && (
                      <a href={creator.social.youtube} target="_blank" rel="noopener noreferrer">
                        <Youtube className="h-5 w-5 text-gray-600 hover:text-red-500 cursor-pointer" />
                      </a>
                    )}
                  </div>
                </div>
                
                <button
                  onClick={() => handleViewCreator(creator)}
                  className="mt-4 w-full py-3 px-4 bg-[#907ad6] hover:bg-purple-500 text-white font-bold rounded-full transition-colors flex items-center justify-center text-sm font-normal cursor-pointer"
                >
                  View Creator <ArrowRight className="h-4 w-4 ml-2" />
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {filteredCreators.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No creators found matching your search criteria.</p>
          </div>
        )}
        
        {/* Quick Stats */}
        <div className="flex justify-center mt-16 mb-8">
          <div className="bg-gray-100 rounded-full px-6 py-2 text-sm font-medium text-gray-700">
            Join over 10,000+ creators already on our platform
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllCreators;