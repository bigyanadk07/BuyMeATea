import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaGoogle, FaFacebookF, FaApple } from 'react-icons/fa';
import axios from 'axios';
import { ArrowLeft } from 'lucide-react';

const SignUp = () => {

  
  useEffect(()=>{
    document.title = "Sign Up"
  })

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { name, email, password, confirmPassword } = formData;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate passwords match
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    // Validate password length
    if (password.length < 6) {
      return setError('Password must be at least 6 characters');
    }

    setLoading(true);

    try {
      // Make API call to your backend register endpoint
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        name,
        email,
        password
      });

      if (response.data.success) {
        // Store the token in localStorage
        localStorage.setItem('token', response.data.token);
        
        // Redirect to dashboard or confirmation page
        navigate('/dashboard');
      } else {
        setError(response.data.message || 'Registration failed');
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || 
        'Unable to create account. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-white relative ">
            <button
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition duration-300 cursor-pointer"
        aria-label="Go back to home"
      >
        <ArrowLeft size={20} />
      </button>
      <div className="w-full max-w-sm p-6 text-center">
        <h1 className="text-2xl font-semibold mb-6">Create your account</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-left text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={name}
            onChange={handleChange}
            className="w-full px-4 py-2 mb-4 rounded-xl bg-gray-200 focus:outline-none focus:ring focus:ring-[#907ad6] placeholder:text-sm"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={handleChange}
            className="w-full px-4 py-2 mb-4 rounded-xl bg-gray-200 focus:outline-none focus:ring focus:ring-[#907ad6] placeholder:text-sm"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={handleChange}
            className="w-full px-4 py-2 mb-4 rounded-xl bg-gray-200 focus:outline-none focus:ring focus:ring-[#907ad6] placeholder:text-sm"
            required
            minLength={6}
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={handleChange}
            className="w-full px-4 py-2 mb-4 rounded-xl bg-gray-200 focus:outline-none focus:ring focus:ring-[#907ad6] placeholder:text-sm"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 my-2 text-white bg-[#907ad6] text-sm hover:bg-[#7b68b5] rounded-md font-semibold transition duration-300 cursor-pointer mb-4 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-2 mb-4">
          <span className="text-sm text-gray-600">
            Already have an account? <a href="/signin" className="text-[#907ad6] hover:underline">Sign in</a>
          </span>
        </div>

        <div className="flex items-center my-4">
          <hr className="flex-grow border-t border-gray-300" />
          <span className="mx-3 text-gray-500 text-sm">or sign up with</span>
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

export default SignUp;