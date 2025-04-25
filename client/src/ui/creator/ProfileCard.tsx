// src/components/creator/ProfileCard.jsx
import React from 'react';

const ProfileCard:React.FC = ({ creator }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
      <img 
        src={creator.profilePicture || '/default-avatar.png'} 
        alt={`${creator.name}'s profile`} 
        className="w-24 h-24 rounded-full object-cover mb-4"
      />
      <h2 className="text-2xl font-bold text-gray-800">{creator.name}</h2>
      <p className="text-gray-600 text-center my-3">{creator.bio}</p>
      <p className="text-teal-600 font-medium text-center my-2">{creator.goalMessage}</p>
      
      <button 
        className="bg-teal-600 text-white py-2 px-6 rounded-full mt-4 hover:bg-teal-700"
      >
        Buy a Tea
      </button>

      <div className="flex mt-4 space-x-3">
        {creator.socialLinks?.map((link, index) => (
          <a 
            key={index} 
            href={link.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-teal-600"
          >
            {/* Social icon would go here */}
            {link.platform}
          </a>
        ))}
      </div>
    </div>
  );
};

export default ProfileCard;