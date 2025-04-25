import React, { useState } from 'react';
import { ArrowRight, Mail, CheckCircle, AlertCircle } from 'lucide-react';

const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setStatus('loading');
      
      const response = await fetch('http://localhost:5000/api/subscribers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to subscribe');
      }
      
      setStatus('success');
      setMessage(data.message || 'Thanks for subscribing to our newsletter!');
      setEmail('');
      
    } catch (error) {
      setStatus('error');
      setMessage(error instanceof Error ? error.message : 'Something went wrong. Please try again.');
    }
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4">
      <h1 className="text-center text-sm font-bold uppercase text-[#907ad6]">Newsletter</h1>
        {/* Newsletter Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Stay in the loop</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Get the latest updates, creator stories, and exclusive opportunities delivered straight to your inbox.
          </p>
        </div>

        {/* Subscription Form */}
        <div className="max-w-md mx-auto">
          <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent">
              <div className="pl-4">
                <Mail className="text-gray-400" size={20} />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="w-full py-3 px-4 focus:outline-none"
                disabled={status === 'loading'}
              />
            </div>
            
            <button 
              type="submit" 
              disabled={status === 'loading'}
              className={`flex items-center justify-center py-3 px-6 rounded-lg font-medium transition-colors ${
                status === 'loading' 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-black text-white hover:bg-gray-800'
              }`}
            >
              {status === 'loading' ? 'Subscribing...' : 'Subscribe to newsletter'}
              <ArrowRight className="ml-2" size={18} />
            </button>
          </form>
          
          {status === 'success' && (
            <div className="flex items-center mt-4 p-3 bg-green-50 text-green-700 rounded-lg">
              <CheckCircle size={20} className="mr-2" />
              <p>{message}</p>
            </div>
          )}
          
          {status === 'error' && (
            <div className="flex items-center mt-4 p-3 bg-red-50 text-red-700 rounded-lg">
              <AlertCircle size={20} className="mr-2" />
              <p>{message}</p>
            </div>
          )}
          
          <p className="text-gray-500 text-sm mt-3 text-center">
            No spam. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;