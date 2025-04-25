import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft } from 'lucide-react';

const ForgotPassword = () => {

  
  useEffect(()=>{
    document.title = "Forgot Password"
  })

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Make API call to your backend forgot password endpoint
      const response = await axios.post('http://localhost:5000/api/auth/forgot-password', {
        email
      });

      if (response.data.success) {
        setSuccess('Password reset instructions have been sent to your email');
        // Optionally clear the email field
        setEmail('');
      } else {
        setError(response.data.message || 'Failed to process request');
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || 
        'Unable to process your request. Please try again later.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-white relative">
      {/* Back button - arrow inside circle */}
      <button
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition duration-300 cursor-pointer"
        aria-label="Go back to home"
      >
        <ArrowLeft size={20} />
      </button>
      <div className="w-full max-w-sm p-6 text-center">
        <h1 className="text-2xl font-semibold mb-6 tracking-wider">Reset Password</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-left text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 text-left text-sm">
            {success}
          </div>
        )}

        <p className="text-gray-600 mb-6 text-sm text-left">
          Enter your email address below and we'll send you instructions to reset your password.
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 mb-4 rounded-xl bg-gray-200 focus:outline-none focus:ring focus:ring-[#907ad6] placeholder:text-sm"
            required
          />
          
          <button 
            type="submit"
            disabled={loading}
            className="w-full py-3 text-white bg-[#907ad6] text-sm hover:bg-[#7b68b5] rounded-md font-semibold transition duration-300 cursor-pointer mb-4 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <div className="mt-6">
          <a 
            href="/signin" 
            className="text-sm text-[#907ad6] hover:underline"
            onClick={(e) => {
              e.preventDefault();
              navigate('/signin');
            }}
          >
            Back to Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;