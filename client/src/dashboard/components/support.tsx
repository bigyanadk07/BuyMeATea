import React, { useState } from 'react';
import { HelpCircle, FileText, MessageCircle, Search, ExternalLink, ChevronRight, Mail } from 'lucide-react';
import { Headphone } from 'akar-icons';

interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="border-b border-gray-200 py-4">
      <button 
        className="w-full flex items-center justify-between text-left font-medium text-gray-800 hover:text-gray-600"
        onClick={() => setIsOpen(!isOpen)}
      >
        {question}
        <ChevronRight className={`transition-transform ${isOpen ? 'transform rotate-90' : ''}`} size={18} />
      </button>
      {isOpen && (
        <div className="mt-2 text-sm text-gray-600">
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
};

const SupportPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const faqItems = [
    {
      question: "How do I set up my Buy Me a Tea account?",
      answer: "Setting up your account is easy! After signing up, complete your profile by adding a photo, bio, and setting up your payout information. You can then customize your page and start receiving support."
    },
    {
      question: "When will I receive my payouts?",
      answer: "Payouts are processed on a weekly basis. Once your balance reaches the minimum threshold of $10, your earnings will be transferred to your connected bank account or payment method within 3-5 business days."
    },
    {
      question: "Can I customize the price of my tea?",
      answer: "Yes! You can set custom amounts for your supporters to contribute. Go to your dashboard, click on 'Settings', and then 'Price Settings' to adjust the default and custom tea prices."
    },
    {
      question: "How do I share my Buy Me a Tea page?",
      answer: "You can share your page by copying your unique link (buymeatea.com/yourusername) and posting it on your social media, website, or sharing it directly with your audience. We also provide social sharing buttons on your dashboard."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept most major credit cards (Visa, Mastercard, American Express), as well as PayPal, Apple Pay, and Google Pay. Payment methods may vary by region."
    }
  ];

  return (
    <div className="flex justify-center bg-gray-50 min-h-screen">
      <div className="w-full max-w-4xl p-4 space-y-6 my-6">
        {/* Header */}
        <h1 className="text-xl font-semibold mb-4">Support</h1>

        {/* Help Card */}
        <div className="bg-white rounded-xl shadow-md p-6 space-y-4 border-l-4 border-teal-400">
          <div className="flex items-start space-x-4">
            <div className="bg-teal-100 rounded-lg p-3">
              <HelpCircle className="text-xl text-teal-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">
                How can we help you today?
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Find answers to common questions or contact our support team for assistance.
                We're here to help you make the most of your Buy Me a Tea page.
              </p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="Search for help topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Help Categories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-800">Documentation</h3>
              <div className="bg-blue-100 p-2 rounded-lg">
                <FileText className="text-blue-500" size={18} />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Browse our comprehensive guides and tutorials.
            </p>
            <a href="#" className="text-sm text-teal-600 hover:text-teal-800 flex items-center">
              View documentation <ExternalLink size={14} className="ml-1" />
            </a>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-800">Community</h3>
              <div className="bg-purple-100 p-2 rounded-lg">
                <MessageCircle className="text-purple-500" size={18} />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Join our community forum to connect with other creators.
            </p>
            <a href="#" className="text-sm text-teal-600 hover:text-teal-800 flex items-center">
              Visit community <ExternalLink size={14} className="ml-1" />
            </a>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-gray-800">Contact Us</h3>
              <div className="bg-green-100 p-2 rounded-lg">
                <Mail className="text-green-500" size={18} />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Get in touch with our support team directly.
            </p>
            <a href="#" className="text-sm text-teal-600 hover:text-teal-800 flex items-center">
              Send message <ExternalLink size={14} className="ml-1" />
            </a>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Frequently Asked Questions</h3>
          <div className="divide-y divide-gray-100">
            {faqItems.map((item, index) => (
              <FAQItem key={index} question={item.question} answer={item.answer} />
            ))}
          </div>
        </div>

        {/* Contact Card */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h3 className="text-lg font-semibold">Still need help?</h3>
              <p className="text-sm text-gray-600 mt-1">
                Our support team is available Monday-Friday, 9am-5pm PT.
              </p>
            </div>
            <button className="flex items-center bg-black text-white px-4 py-2 hover:bg-gray-800 transition-colors rounded-3xl cursor-pointer">
              <Headphone className='h-4' />
              <span className='text-sm font-semibold'>Contact Support</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;