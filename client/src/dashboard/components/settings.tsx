import React, { useEffect, useState } from 'react';
import { Switch } from '@headlessui/react';
import { Settings, DollarSign, AlertCircle, X } from 'lucide-react';

// Add Modal component for delete confirmation
const DeleteAccountModal = ({ 
  isOpen, 
  onClose, 
  onConfirm 
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!password) {
      setError('Password is required');
      return;
    }

    setIsDeleting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/auth/delete-account', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ password })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete account');
      }

      // Clear token and user data from storage
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
      
      // Handle successful deletion
      onConfirm();
      
      // Redirect to home page or login page
      window.location.href = '/signup';
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
      setIsDeleting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-red-600">Delete Account</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="mb-6">
          <p className="text-gray-700 mb-4">
            This action <span className="font-bold">cannot be undone</span>. This will permanently delete your account and remove all your data from our servers.
          </p>
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
            <p className="text-red-700 text-sm">
              Please enter your password to confirm account deletion.
            </p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full p-2 border rounded-md"
              autoFocus
            />
            {error && (
              <p className="text-red-500 text-sm mt-1">{error}</p>
            )}
          </div>
          
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              disabled={isDeleting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-red-300"
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete my account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const SettingSwitch = ({
  label,
  description,
  enabled,
  setEnabled,
}: {
  label: string;
  description?: string;
  enabled: boolean;
  setEnabled: (value: boolean) => void;
}) => (
  <div className="flex items-center justify-between py-4 border-b">
    <div>
      <p className="font-medium text-gray-800">{label}</p>
      {description && <p className="text-sm text-gray-500">{description}</p>}
    </div>
    <Switch
      checked={enabled}
      onChange={setEnabled}
      className={`${enabled ? 'bg-black' : 'bg-gray-200'}
        relative inline-flex h-[24px] w-[44px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out`}
    >
      <span
        aria-hidden="true"
        className={`${enabled ? 'translate-x-5' : 'translate-x-0'}
          pointer-events-none inline-block h-[20px] w-[20px] transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
      />
    </Switch>
  </div>
);

const SettingsPage: React.FC = () => {
  const [localizedPricing, setLocalizedPricing] = useState(true);
  const [coverCreditFee, setCoverCreditFee] = useState(true);
  const [isNSFW, setIsNSFW] = useState(false);
  const [currency, setCurrency] = useState('USD');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  
  const [userData, setUserData] = useState({
    email: "",
  });

  const [copied, setCopied] = useState(false);
  const pageLink = `buymeatea.com/${userData.email.split('@')[0]}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(pageLink);
    setCopied(true);

    // Hide the message after 2 seconds
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDeleteClick = () => {
    setDeleteModalOpen(true);
  };

  const handleDeleteSuccess = () => {
    setDeleteSuccess(true);
    setDeleteModalOpen(false);
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
        setUserData({
          email: data.email || "",
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
  
    fetchData();
  }, []);

  return (
    <div className="flex justify-center bg-gray-50 min-h-screen">
      <div className="w-full max-w-4xl p-4 space-y-6 my-6">
        {/* Header */}
        <h1 className="text-xl font-semibold mb-4">Settings</h1>

        {/* Setup Card */}
        <div className="bg-white rounded-xl shadow-md p-6 space-y-4 border-l-4 border-purple-400">
          <div className="flex items-start space-x-4">
            <div className="bg-purple-100 rounded-lg p-3">
              <Settings className="text-xl text-purple-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">
                Configure your page settings
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                These settings affect how your page appears to visitors and how payments are processed.
                Make sure to save your changes when you're done.
              </p>
            </div>
          </div>
        </div>

        {/* Success Alert for Delete */}
        {deleteSuccess && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-md mb-4">
            <p className="text-green-700">Your account has been successfully deleted.</p>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-md p-6">
          {/* Currency Dropdown */}
          <div className="mb-4 border-b pb-4">
            <div className="flex items-center justify-between mb-2">
              <p className="font-medium text-gray-800">Payment currency</p>
              <div className="bg-green-100 p-2 rounded-lg">
                <DollarSign className="text-green-500" size={18} />
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-2">
              Your supporters will pay in this currency.
            </p>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full p-2 border rounded-md bg-white"
            >
              <option value="NPR">Nepalese Rupees</option>
            </select>
          </div>

          {/* Toggles */}
          <SettingSwitch
            label="Localized pricing"
            description="Enable localized pricing so your supporters can pay in their local currency."
            enabled={localizedPricing}
            setEnabled={setLocalizedPricing}
          />

          <SettingSwitch
            label="Cover credit card fee"
            description="If turned off, your fans will incur the credit card fee associated with their payment."
            enabled={coverCreditFee}
            setEnabled={setCoverCreditFee}
          />

          <SettingSwitch
            label="Mark as NSFW (mandatory for 18+ content)"
            description="Indicate that your page is not suitable for children. Regardless, pornography is not allowed on the platform."
            enabled={isNSFW}
            setEnabled={setIsNSFW}
          />

          {/* Page link */}
          <div className="py-4 border-b">
            <div className="flex items-center justify-between mb-2">
              <p className="font-medium text-gray-800">My page link</p>
            </div>
            <div className="flex flex-col gap-2 mt-2 relative">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={pageLink}
                  readOnly
                  className="w-full border rounded-md p-2 bg-gray-50"
                />
                <button
                  onClick={handleCopy}
                  className="bg-black hover:bg-gray-800 text-white text-sm px-4 py-2 rounded-lg transition"
                >
                  Copy
                </button>
              </div>

              {/* Copied Animation */}
              <div
                className={`absolute right-2 -bottom-6 text-sm text-green-600 font-medium transition-opacity duration-500 ${
                  copied ? 'opacity-100' : 'opacity-0'
                }`}
              >
                Copied!
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="mt-6 p-4 bg-red-50 rounded-lg border border-red-100">
            <div className="flex items-start space-x-3">
              <div className="p-1">
                <AlertCircle className="text-red-500" size={20} />
              </div>
              <div>
                <h3 className="font-medium text-red-800">Danger Zone</h3>
                <p className="text-sm text-red-600 mb-4">These actions cannot be undone.</p>
                <button 
                  onClick={handleDeleteClick}
                  className="bg-white text-red-500 border border-red-300 hover:bg-red-50 font-medium px-4 py-2 rounded-lg text-sm transition"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-6 mt-4">
            <button className="w-full bg-black hover:bg-gray-800 text-white font-semibold py-2 px-4 rounded-lg transition">
              Save changes
            </button>
          </div>
        </div>
      </div>

      {/* Delete Account Modal */}
      <DeleteAccountModal 
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteSuccess}
      />
    </div>
  );
};

export default SettingsPage;