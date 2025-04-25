import React from 'react';

const TopCreators: React.FC = () => {
  return (
    <section className="bg-white py-16 px-4 sm:px-8 md:px-12 rounded-3xl max-w-6xl mx-auto mt-12">
      <h1 className="text-center text-sm font-bold uppercase text-[#907ad6]">Support</h1>
      
      <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-center text-gray-800">
        Give your audience <br className="hidden sm:inline" />
        an easy way to say thanks.
      </h2>
      
      <p className="text-center max-w-3xl mx-auto py-8 text-base sm:text-lg">
        <span className="nature-font">Buy me a tea</span> makes supporting fun and easy. In just a couple of taps, your fans can make the payment (buy you a tea) and leave a message.
      </p>
    </section>
  );
};

export default TopCreators;
