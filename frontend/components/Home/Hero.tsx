import React from 'react';

const Hero: React.FC = () => {

  return (
    <section className="hero-gradient text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Discover Amazing
            <span className="block text-yellow-300">African Cuisine</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-orange-100 max-w-3xl mx-auto">
            From Ethiopian injera to Nigerian jollof rice, discover and book reservations 
            at the best African restaurants worldwide. Experience authentic African cuisine 
            across the globe.
          </p>

        </div>
      </div>
    </section>
  );
};

export default Hero;
