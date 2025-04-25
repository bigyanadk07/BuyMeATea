import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Instagram, Youtube, Globe, ShoppingBag, Twitter, Facebook } from 'lucide-react';

// Define types for our data
interface Creator {
  name: string;
  email: string;
  profilePicture?: string;
  profilePic?: string; // Alternative prop name from AllCreators
  bio: string;
  location?: string;
  links?: {
    instagram?: string;
    youtube?: string;
    portfolio?: string;
    twitter?: string;
    [key: string]: string | undefined;
  };
  social?: { // Alternative social structure from AllCreators
    instagram?: string;
    youtube?: string;
    twitter?: string;
    facebook?: string;
    [key: string]: string | undefined;
  };
  totalTeas: number;
  category?: string;
  followers?: number;
  username?: string;
}

interface Donation {
  supporterName: string;
  message: string;
  amount: number;
  teaCount: number;
  createdAt: string;
}

interface FormData {
  name: string;
  message: string;
  amount: number;
  teaCount: number;
}

interface LocationState {
  creatorData?: Creator;
}

interface PaymentData {
  amount: number;
  totalAmount: number;
  productId: string;
  merchantId: string;
  successUrl: string;
  failureUrl: string;
  serviceCharge: number;
  taxAmount: number;
  deliveryCharge: number;
}

const CreatorPage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const locationState = location.state as LocationState;
  
  const [creator, setCreator] = useState<Creator | null>(null);
  const [donations, setDonations] = useState<Donation[]>([]); // Initialize as empty array
  const [formData, setFormData] = useState<FormData>({
    name: '',
    message: '',
    amount: 100,
    teaCount: 1,
  });
  const [customAmount, setCustomAmount] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    // If we have creator data from navigation state, use it immediately
    if (locationState?.creatorData) {
      // Normalize the data structure (handle differences between API formats)
      const normalizedCreator: Creator = {
        name: locationState.creatorData.name,
        email: locationState.creatorData.email || username || '',
        profilePicture: locationState.creatorData.profilePicture || locationState.creatorData.profilePic,
        bio: locationState.creatorData.bio || '',
        location: locationState.creatorData.location,
        username: username,
        // Merge links and social fields
        links: {
          ...(locationState.creatorData.links || {}),
          ...(locationState.creatorData.social ? {
            instagram: locationState.creatorData.social.instagram,
            youtube: locationState.creatorData.social.youtube,
            twitter: locationState.creatorData.social.twitter,
            facebook: locationState.creatorData.social.facebook
          } : {})
        },
        totalTeas: 0, // Will be updated from API
        category: locationState.creatorData.category,
        followers: locationState.creatorData.followers
      };
      
      setCreator(normalizedCreator);
      
      // Still fetch from API to get the latest data (teas count etc)
      fetchCreatorData();
    } else {
      // If no data in navigation state, just fetch from API
      fetchCreatorData();
    }
    
    // Fetch recent donations
    fetchDonations();
  }, [username, locationState]);

  
  useEffect(() => {
    document.title = "Buy Me a Tea | Creators";
  }, []);

  const fetchCreatorData = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`/api/creator/${username}`);
      setCreator(prevCreator => {
        // If we already have some data from navigation state, merge with API data
        if (prevCreator) {
          return {
            ...prevCreator,
            ...res.data,
            // Preserve profilePicture from navigation state if API doesn't provide one
            profilePicture: res.data.profilePicture || prevCreator.profilePicture,
            // Merge links objects
            links: {
              ...(prevCreator.links || {}),
              ...(res.data.links || {})
            }
          };
        }
        // Otherwise just use API data
        return res.data;
      });
    } catch (err) {
      console.error("Error fetching creator data:", err);
      // If API fetch fails but we have navigation state data, keep using that
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDonations = async () => {
    try {
      const res = await axios.get(`/api/donations/${username}`);
      // Ensure donations is always an array
      const donationsData = Array.isArray(res.data) ? res.data : [];
      setDonations(donationsData);
    } catch (err) {
      console.error("Error fetching donations:", err);
      setDonations([]); // Set to empty array on error
    }
  };

  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Call the backend API to initiate payment
      const response = await axios.post('/api/donate/initiate', {
        amount: formData.amount,
        creatorUsername: username,
        supporterName: formData.name || 'Anonymous',
        message: formData.message || '',
        teaCount: formData.teaCount
      });

      const paymentData: PaymentData = response.data;

      // Create an eSewa form and submit it programmatically
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = 'https://uat.esewa.com.np/epay/main'; // Use production URL in production
      form.style.display = 'none';

      // Add the required fields
      const params = {
        amt: paymentData.amount.toString(),
        psc: paymentData.serviceCharge.toString(),
        pdc: paymentData.deliveryCharge.toString(),
        txAmt: paymentData.taxAmount.toString(),
        tAmt: paymentData.totalAmount.toString(),
        pid: paymentData.productId,
        scd: paymentData.merchantId,
        su: paymentData.successUrl,
        fu: paymentData.failureUrl
      };

      // Create input fields and append to form
      Object.entries(params).forEach(([key, value]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = value;
        form.appendChild(input);
      });

      // Append the form to the body and submit it
      document.body.appendChild(form);
      form.submit();
    } catch (err) {
      console.error('Payment initiation error:', err);
      setIsProcessing(false);
      // Show error message to user
      alert('Failed to initiate payment. Please try again.');
    }
  };

  const setTeaAmount = (count: number) => {
    setCustomAmount(false);
    setFormData({
      ...formData,
      teaCount: count,
      amount: count * 100 // Assuming 1 tea costs NPR 100
    });
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    setFormData({
      ...formData,
      amount: value,
      teaCount: Math.ceil(value / 100) // Calculate tea count based on amount
    });
  };

  const formatTimeAgo = (dateString: string): string => {
    const now = new Date();
    const past = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };

  // Helper function to get creator's first name safely
  const getCreatorFirstName = (): string => {
    if (!creator || !creator.name) return "this creator";
    return creator.name.split(' ')[0] || creator.name;
  };

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
    </div>
  );

  if (!creator) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold mb-4">Creator Not Found</h2>
        <p className="text-gray-600">The creator you're looking for doesn't exist or has been removed.</p>
      </div>
    </div>
  );
  
  return (
    <div className="flex justify-center bg-gray-50 min-h-screen w-full">
      <div className="w-full max-w-6xl p-4 my-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column - Creator Info and Supporters */}
          <div className="md:col-span-2 space-y-6">
            {/* Creator Info Section */}
            <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
              <div className="text-center">
                <img 
                  src={creator.profilePicture || creator.profilePic || "/default-avatar.png"} 
                  alt={creator.name} 
                  className="w-32 h-32 rounded-full mx-auto border-4 border-yellow-400 shadow-lg object-cover"
                />
                <h1 className="text-xl font-semibold mt-4">{creator.name}</h1>
                
                <p className="mt-4 text-gray-700 max-w-md mx-auto">{creator.bio}</p>
                {/* Social Media Links */}
                {(creator.links || creator.social) && (
                  <div className="flex justify-center gap-4 mt-4">
                    {(creator.links?.instagram || creator.social?.instagram) && (
                      <a href={creator.links?.instagram || creator.social?.instagram} target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:text-pink-800">
                        <Instagram size={20} />
                      </a>
                    )}
                    {(creator.links?.youtube || creator.social?.youtube) && (
                      <a href={creator.links?.youtube || creator.social?.youtube} target="_blank" rel="noopener noreferrer" className="text-red-600 hover:text-red-800">
                        <Youtube size={20} />
                      </a>
                    )}
                    {creator.links?.portfolio && (
                      <a href={creator.links.portfolio} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                        <Globe size={20} />
                      </a>
                    )}
                    {(creator.links?.twitter || creator.social?.twitter) && (
                      <a href={creator.links?.twitter || creator.social?.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-600">
                        <Twitter size={20} />
                      </a>
                    )}

                    {(creator.links?.facebook || creator.social?.facebook) && (
                      <a href={creator.links?.facebook || creator.social?.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-600">
                        <Facebook size={20} />
                      </a>
                    )}
                  </div>
                )}
                
                {/* Tea Count Banner */}
                <div className="flex items-center justify-center mt-6 bg-yellow-100 text-yellow-800 py-2 px-4 rounded-full inline-flex">
                  <span className="text-xl mr-2">🎉</span>
                  <span className="text-sm font-medium">{creator.totalTeas || 0} Teas received so far!</span>
                </div>
              </div>
            </div>
            
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Total Teas */}
              <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <h3 className="text-gray-500 text-sm font-medium">TOTAL TEAS</h3>
                  <div className="bg-yellow-100 p-2 rounded-lg">
                    <span className="text-xl">🍵</span>
                  </div>
                </div>
                <p className="text-3xl font-bold mt-2">{creator.totalTeas || 0}</p>
                <p className="text-xs text-gray-500 mt-1">Teas received</p>
              </div>
              
              {/* Total Support */}
              <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <h3 className="text-gray-500 text-sm font-medium">TOTAL SUPPORT</h3>
                  <div className="bg-green-100 p-2 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                </div>
                <p className="text-3xl font-bold mt-2">NPR {(creator.totalTeas || 0) * 100}</p>
                <p className="text-xs text-gray-500 mt-1">Total amount received</p>
              </div>
            </div>
            
            {/* Recent Supporters Section */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">💬 Recent Supporters</h3>
              
              {/* Column Headers */}
              <div className="text-sm text-gray-400 grid grid-cols-4 gap-4 mb-2 font-medium">
                <span>SUPPORTER</span>
                <span>MESSAGE</span>
                <span>DATE</span>
                <span>AMOUNT</span>
              </div>
              
              {/* Divider */}
              <div className="border-t border-gray-100 my-3"></div>
              
              {!donations || !Array.isArray(donations) || donations.length === 0 ? (
                <div className="flex items-center bg-gray-50 rounded-lg p-4 mt-4 shadow-sm border border-gray-100">
                  <div className="bg-blue-100 p-2 rounded-full mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-sm">Be the first to support {creator.name || "this creator"}!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {donations.map((donation, idx) => (
                    <div key={idx} className="bg-white p-4 rounded shadow-sm border border-gray-100">
                      <div className="grid grid-cols-4 gap-4">
                        <div className="text-sm font-medium">{donation.supporterName || "Anonymous"}</div>
                        <div className="text-sm text-gray-600">{donation.message || "-"}</div>
                        <div className="text-sm text-gray-500">{formatTimeAgo(donation.createdAt)}</div>
                        <div className="text-sm font-medium">
                          🍵 {donation.teaCount || 1} Tea{(donation.teaCount || 1) !== 1 ? 's' : ''} <span className="text-gray-500">(NPR {donation.amount || 0})</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Right Column - Buy Me a Tea Section */}
          <div className="md:col-span-1">
            <div className="sticky top-6">
              <div className="bg-white rounded-xl shadow-md p-6 space-y-4 border-l-4 border-yellow-400">
                <div className="flex items-start space-x-4">
                  <div className="bg-yellow-100 rounded-lg p-3">
                    <ShoppingBag size={20} className="text-yellow-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold">
                      🍵 Buy {getCreatorFirstName()} a Tea
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      Support {getCreatorFirstName()} by buying them a tea. Every cup helps them continue creating amazing content.
                    </p>
                  </div>
                </div>
                
                <form onSubmit={handleDonate} className="space-y-4">
                  {/* Preset Tea Buttons */}
                  <div className="flex flex-wrap gap-3 justify-center mt-4">
                    <button 
                      type="button"
                      onClick={() => setTeaAmount(1)}
                      className={`px-4 py-2 rounded-full text-sm ${formData.teaCount === 1 && !customAmount ? 'bg-yellow-500 text-white' : 'bg-white border border-yellow-500 text-yellow-700'}`}
                    >
                      Buy 1 Tea - NPR 100
                    </button>
                    <button 
                      type="button"
                      onClick={() => setTeaAmount(3)}
                      className={`px-4 py-2 rounded-full text-sm ${formData.teaCount === 3 && !customAmount ? 'bg-yellow-500 text-white' : 'bg-white border border-yellow-500 text-yellow-700'}`}
                    >
                      Buy 3 Teas - NPR 300
                    </button>
                    <button 
                      type="button"
                      onClick={() => setTeaAmount(5)}
                      className={`px-4 py-2 rounded-full text-sm ${formData.teaCount === 5 && !customAmount ? 'bg-yellow-500 text-white' : 'bg-white border border-yellow-500 text-yellow-700'}`}
                    >
                      Buy 5 Teas - NPR 500
                    </button>
                    <button 
                      type="button"
                      onClick={() => setCustomAmount(true)}
                      className={`px-4 py-2 rounded-full text-sm ${customAmount ? 'bg-yellow-500 text-white' : 'bg-white border border-yellow-500 text-yellow-700'}`}
                    >
                      Custom Amount
                    </button>
                  </div>
                  
                  {/* Custom Amount Field */}
                  {customAmount && (
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-medium mb-1">Enter amount (NPR):</label>
                      <input
                        type="number"
                        min="50"
                        value={formData.amount}
                        onChange={handleAmountChange}
                        className="w-full p-2 border border-gray-300 rounded"
                        placeholder="Enter amount"
                      />
                      <p className="text-xs text-gray-500 mt-1">Approx. {formData.teaCount} tea(s)</p>
                    </div>
                  )}
                  
                  {/* Name & Message Fields */}
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">Your Name (optional):</label>
                    <input
                      type="text"
                      placeholder="Anonymous"
                      className="w-full p-2 border border-gray-300 rounded"
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-1">Message (optional):</label>
                    <textarea
                      placeholder="Say something nice..."
                      rows={3}
                      className="w-full p-2 border border-gray-300 rounded"
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />
                  </div>
                  
                  {/* Payment Method - Only eSewa now */}
                  <div className="flex items-center bg-gray-50 p-3 rounded-lg">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="esewa"
                      checked={true}
                      readOnly
                      className="mr-2"
                    />
                    <span className="text-sm font-medium">Pay with eSewa</span>
                    <img src="/esewa-logo.png" alt="eSewa" className="h-6 ml-auto" />
                  </div>
                  
                  {/* Submit Button */}
                  <button 
                    type="submit" 
                    disabled={isProcessing}
                    className="w-full bg-black text-white py-3 px-4 rounded-3xl font-semibold text-sm transition duration-200 hover:bg-gray-800 disabled:bg-gray-400"
                  >
                    {isProcessing ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                        Processing...
                      </div>
                    ) : (
                      `Buy ${formData.teaCount} Tea${formData.teaCount !== 1 ? 's' : ''} - NPR ${formData.amount}`
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatorPage;