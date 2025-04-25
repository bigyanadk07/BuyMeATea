import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaGoogle, FaFacebookF, FaApple } from 'react-icons/fa';
import { ArrowLeft } from 'lucide-react';
import axios from 'axios';

const SignIn = () => {

  
  useEffect(()=>{
    document.title = "Sign In"
  })

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Make API call to your backend login endpoint
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password
      });

      if (response.data.success) {
        // Store the token in localStorage
        localStorage.setItem('token', response.data.token);

        
        // Redirect to dashboard or home page
        navigate('/dashboard');
      } else {
        setError(response.data.message || 'Login failed');
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || 
        'Unable to login. Please check your credentials.'
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
        <h1 className="text-2xl font-semibold mb-6 tracking-tighter">Welcome back</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-left text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 mb-4 rounded-xl bg-gray-200 focus:outline-none focus:ring focus:ring-[#907ad6] placeholder:text-sm"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 mb-4 bg-gray-200 rounded-xl focus:outline-none focus:ring focus:ring-[#907ad6] placeholder:text-sm"
            required
          />
          
          <div className="text-right mb-4">
            <a href="/forgot-password" className="text-sm text-[#907ad6] hover:underline">
              Forgot password?
            </a>
          </div>
          
          <button 
            type="submit"
            disabled={loading}
            className="w-full py-3 text-white bg-[#907ad6] text-sm hover:bg-[#7b68b5] rounded-md font-semibold transition duration-300 cursor-pointer mb-4 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-4 mb-6">
          <span className="text-sm text-gray-600">
            Don't have an account? <a href="/signup" className="text-[#907ad6] hover:underline">Sign up</a>
          </span>
        </div>

        <div className="flex items-center my-4">
          <hr className="flex-grow border-t border-gray-300" />
          <span className="mx-3 text-gray-500 text-sm">or login with</span>
          <hr className="flex-grow border-t border-gray-300" />
        </div>

        <div className="space-y-3">
          <SocialButton icon={<FaGoogle />} text="Continue with Google" />
          <SocialButton icon={<FaFacebookF />} text="Continue with Facebook" />
          <SocialButton icon={<FaApple />} text="Continue with Apple" />
        </div>
      </div>
    </div>
  );
};

function SocialButton({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <button 
      type="button"
      className="flex items-center justify-center w-full py-2 border rounded-md hover:bg-[#907ad6] hover:text-white transition duration-300 cursor-pointer"
    >
      <span className="mr-3">{icon}</span>
      <span className="text-sm">{text}</span>
    </button>
  );
}

export default SignIn;