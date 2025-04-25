import React, { useEffect, useState } from "react";
import { FiUser, FiMail, FiLock, FiCamera, FiSave, FiLoader, FiCheck, FiEdit3, FiLink } from "react-icons/fi";
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";
import axios from "axios";

const EditProfile: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [bioSuccess, setBioSuccess] = useState(false);
  const [socialSuccess, setSocialSuccess] = useState(false);
  const [error, setError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [bioError, setBioError] = useState("");
  const [socialError, setSocialError] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    profilePic: "",
    bio: ""
  });

  const [socialLinks, setSocialLinks] = useState({
    facebook: "",
    twitter: "",
    instagram: "",
    youtube: ""
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      console.log(selectedFile)
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
      
      uploadProfilePicture(file);
    }
  };
  
  const uploadProfilePicture = async (file: File) => {
    setIsUploading(true);
    setUploadError("");
    
    const formData = new FormData();
    formData.append('profilePic', file);

    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    };

    try {
      const response = await axios.post('http://localhost:5000/api/profile/upload-profile-pic', formData, config);
      if (response.data.user) {
        setUserData(prevData => ({
          ...prevData,
          profilePic: response.data.user.profilePic
        }));
      }
      setIsUploading(false);
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error uploading profile pic:', error);
      setUploadError(error instanceof Error ? error.message : 'Failed to upload profile picture');
      setIsUploading(false);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserData({
      ...userData,
      bio: e.target.value
    });
  };

  const handleSocialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSocialLinks({
      ...socialLinks,
      [e.target.name]: e.target.value
    });
  };

  useEffect(() => {
    const fetchData = async () => {
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
        console.log(data);
        
        setUserData({
          name: data.name || "",
          email: data.email || "",
          profilePic: data.profilePic || "",
          bio: data.bio || ""
        });

        // Set social links if they exist in the response
        if (data.socialLinks) {
          setSocialLinks({
            facebook: data.socialLinks.facebook || "",
            twitter: data.socialLinks.twitter || "",
            instagram: data.socialLinks.instagram || "",
            youtube: data.socialLinks.youtube || ""
          });
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setIsLoading(false);
      }
    };
  
    fetchData();
  }, []);

  // Handle profile update submission
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSaveSuccess(false);
    
    try {
      // Updated endpoint to match backend
      const response = await fetch('http://localhost:5000/api/profile/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          name: userData.name
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }
      
      setUserData({
        ...userData,
        name: data.user.name
      });
      
      setSaveSuccess(true);
      
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
      
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    }
  };

  // Handle bio update submission
  const handleBioSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBioError("");
    setBioSuccess(false);
    
    try {
      // Using the correct endpoint for bio updates
      const response = await fetch('http://localhost:5000/api/profile/update-bio', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          bio: userData.bio
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update bio');
      }
      
      // Update the user data with the returned bio
      setUserData({
        ...userData,
        bio: data.user.bio || ""
      });
      
      setBioSuccess(true);
      
      setTimeout(() => {
        setBioSuccess(false);
      }, 3000);
      
    } catch (error) {
      console.error('Error updating bio:', error);
      setBioError(error instanceof Error ? error.message : 'An error occurred');
    }
  };

 // Handle social links update submission
const handleSocialSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setSocialError("");
  setSocialSuccess(false);
  
  try {
    const response = await axios.put('http://localhost:5000/api/profile/update-social', {
      social: socialLinks  // Changed from socialLinks to social
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      }
    });

    const data = response.data;
    
    // Update social links with the returned data if needed
    if (data.user && data.user.social) {
      setSocialLinks({
        facebook: data.user.social.facebook || "",
        twitter: data.user.social.twitter || "",
        instagram: data.user.social.instagram || "",
        youtube: data.user.social.youtube || ""
      });
    }
    
    setSocialSuccess(true);
    
    setTimeout(() => {
      setSocialSuccess(false);
    }, 3000);
    
  } catch (error) {
    console.error('Error updating social links:', error);
    setSocialError(error instanceof Error ? error.message : 'An error occurred');
  }
};

  // Handle password update submission
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess(false);
    
    // Validate passwords
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("New passwords don't match");
      return;
    }
    
    // Updated validation to match backend requirements (6+ characters)
    if (passwordData.newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return;
    }
    
    try {
      const response = await fetch('http://localhost:5000/api/profile/change-password', { // Updated to correct endpoint
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update password');
      }
      
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
      
      setPasswordSuccess(true);
      
      setTimeout(() => {
        setPasswordSuccess(false);
      }, 3000);
      
    } catch (error) {
      setPasswordError(error instanceof Error ? error.message : 'An error occurred');
    }
  };

  // Loading state UI
  if (isLoading) {
    return (
      <div className="flex justify-center items-center bg-gray-50 min-h-screen">
        <div className="bg-white p-8 rounded-xl shadow-md flex flex-col items-center">
          <FiLoader className="animate-spin text-3xl text-yellow-500 mb-4" />
          <p className="text-gray-700">Loading profile information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center bg-gray-50 min-h-screen">
      <div className="w-full max-w-4xl p-4 space-y-6 my-6">
        {/* Header */}
        <h1 className="text-xl font-semibold mb-4">Edit Profile</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Panel - Profile Picture */}
          <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center">
            <div className="relative mb-6">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-100 shadow-md">
                <img
                  src={selectedImage || userData.profilePic || "https://via.placeholder.com/150"}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <label htmlFor="profile-upload" className="absolute bottom-0 right-0 bg-yellow-400 hover:bg-yellow-500 p-2 rounded-full cursor-pointer shadow-md transition-colors">
                {isUploading ? (
                  <FiLoader className="text-white animate-spin" />
                ) : (
                  <FiCamera className="text-white" />
                )}
                <input 
                  type="file" 
                  id="profile-upload" 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={isUploading}
                />
              </label>
            </div>
            <p className="text-sm text-gray-600 text-center">
              Click the camera icon to upload a new profile picture
            </p>
            {uploadError && (
              <div className="mt-2 bg-red-50 border border-red-200 text-red-800 px-3 py-2 rounded-lg text-xs">
                {uploadError}
              </div>
            )}
            {userData && (
              <div className="mt-4 text-center">
                <p className="font-semibold text-lg">{userData.name}</p>
                <p className="text-gray-500 text-sm">{userData.email}</p>
                {userData.bio && (
                  <p className="text-gray-600 text-sm mt-2">{userData.bio.length > 50 ? `${userData.bio.substring(0, 50)}...` : userData.bio}</p>
                )}
              </div>
            )}
          </div>

          {/* Right Panel - Profile Information Forms */}
          <div className="md:col-span-2 space-y-6">
            {/* Personal Information Card */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <FiUser className="text-blue-600" />
                </div>
                <h2 className="text-lg font-semibold">Personal Information</h2>
              </div>

              <form className="space-y-4" onSubmit={handleProfileSubmit}>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Display Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={userData.name}
                    onChange={(e) => setUserData({...userData, name: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <div className="flex">
                    <div className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-700">
                      {userData.email}
                    </div>
                    <div className="ml-2 bg-gray-100 p-2 rounded-lg flex items-center">
                      <FiMail className="text-gray-500" />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Email address cannot be changed</p>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
                    {error}
                  </div>
                )}
                
                {saveSuccess && (
                  <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg flex items-center">
                    <FiCheck className="mr-2" /> Profile updated successfully!
                  </div>
                )}

                <button 
                  type="submit"
                  className="mt-2 flex items-center bg-black text-white px-5 py-2.5 hover:bg-gray-800 transition-colors rounded-3xl cursor-pointer gap-2"
                >
                  <FiSave className="h-4 w-4" />
                  <span className="text-sm font-semibold">Save Changes</span>
                </button>
              </form>
            </div>

            {/* Bio Card */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-green-100 p-3 rounded-lg">
                  <FiEdit3 className="text-green-600" />
                </div>
                <h2 className="text-lg font-semibold">About Me</h2>
              </div>

              <form className="space-y-4" onSubmit={handleBioSubmit}>
                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    value={userData.bio}
                    onChange={handleBioChange}
                    placeholder="Tell others about yourself..."
                    rows={4}
                    maxLength={250}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Share a bit about yourself ({userData.bio ? userData.bio.length : 0}/250 characters)
                  </p>
                </div>

                {bioError && (
                  <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
                    {bioError}
                  </div>
                )}
                
                {bioSuccess && (
                  <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg flex items-center">
                    <FiCheck className="mr-2" /> Bio updated successfully!
                  </div>
                )}

                <button 
                  type="submit"
                  className="mt-2 flex items-center bg-black text-white px-5 py-2.5 hover:bg-gray-800 transition-colors rounded-3xl cursor-pointer gap-2"
                >
                  <FiSave className="h-4 w-4" />
                  <span className="text-sm font-semibold">Save Bio</span>
                </button>
              </form>
            </div>

            {/* Social Media Links Card */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <FiLink className="text-purple-600" />
                </div>
                <h2 className="text-lg font-semibold">Social Media Links</h2>
              </div>

              <form className="space-y-4" onSubmit={handleSocialSubmit}>
                <div>
                  <label htmlFor="facebook" className="block text-sm font-medium text-gray-700 mb-1">
                    <div className="flex items-center">
                      <FaFacebook className="text-blue-600 mr-2" />
                      Facebook
                    </div>
                  </label>
                  <input
                    type="url"
                    id="facebook"
                    name="facebook"
                    value={socialLinks.facebook}
                    onChange={handleSocialChange}
                    placeholder="https://facebook.com/yourusername"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="twitter" className="block text-sm font-medium text-gray-700 mb-1">
                    <div className="flex items-center">
                      <FaTwitter className="text-blue-400 mr-2" />
                      Twitter
                    </div>
                  </label>
                  <input
                    type="url"
                    id="twitter"
                    name="twitter"
                    value={socialLinks.twitter}
                    onChange={handleSocialChange}
                    placeholder="https://twitter.com/yourusername"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="instagram" className="block text-sm font-medium text-gray-700 mb-1">
                    <div className="flex items-center">
                      <FaInstagram className="text-pink-600 mr-2" />
                      Instagram
                    </div>
                  </label>
                  <input
                    type="url"
                    id="instagram"
                    name="instagram"
                    value={socialLinks.instagram}
                    onChange={handleSocialChange}
                    placeholder="https://instagram.com/yourusername"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="youtube" className="block text-sm font-medium text-gray-700 mb-1">
                    <div className="flex items-center">
                      <FaYoutube className="text-red-600 mr-2" />
                      YouTube
                    </div>
                  </label>
                  <input
                    type="url"
                    id="youtube"
                    name="youtube"
                    value={socialLinks.youtube}
                    onChange={handleSocialChange}
                    placeholder="https://youtube.com/channel/yourid"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-colors"
                  />
                </div>

                {socialError && (
                  <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
                    {socialError}
                  </div>
                )}
                
                {socialSuccess && (
                  <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg flex items-center">
                    <FiCheck className="mr-2" /> Social links updated successfully!
                  </div>
                )}

                <button 
                  type="submit"
                  className="mt-2 flex items-center bg-black text-white px-5 py-2.5 hover:bg-gray-800 transition-colors rounded-3xl cursor-pointer gap-2"
                >
                  <FiSave className="h-4 w-4" />
                  <span className="text-sm font-semibold">Save Social Links</span>
                </button>
              </form>
            </div>

            {/* Security Card */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-yellow-100 p-3 rounded-lg">
                  <FiLock className="text-yellow-600" />
                </div>
                <h2 className="text-lg font-semibold">Security</h2>
              </div>

              <form className="space-y-4" onSubmit={handlePasswordSubmit}>
                <div>
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    placeholder="••••••••"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    placeholder="••••••••"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    placeholder="••••••••"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition-colors"
                  />
                </div>

                {passwordError && (
                  <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
                    {passwordError}
                  </div>
                )}
                
                {passwordSuccess && (
                  <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg flex items-center">
                    <FiCheck className="mr-2" /> Password updated successfully!
                  </div>
                )}

                <button 
                  type="submit"
                  className="mt-2 flex items-center bg-black text-white px-5 py-2.5 hover:bg-gray-800 transition-colors rounded-3xl cursor-pointer gap-2"
                >
                  <FiLock className="h-4 w-4" />
                  <span className="text-sm font-semibold">Update Password</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;