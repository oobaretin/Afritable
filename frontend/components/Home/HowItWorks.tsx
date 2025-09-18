import React from 'react';

const HowItWorks: React.FC = () => {
  const steps = [
    {
      number: '01',
      title: 'Search & Discover',
      description: 'Find African restaurants in your area by cuisine, location, or specific dishes you\'re craving.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
    },
    {
      number: '02',
      title: 'Browse & Compare',
      description: 'View restaurant details, photos, reviews, and menu items to find the perfect spot for your meal.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
    },
    {
      number: '03',
      title: 'Book Your Table',
      description: 'Make a reservation in just a few clicks. Choose your date, time, and party size.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      number: '04',
      title: 'Enjoy Your Meal',
      description: 'Arrive at your reservation time and enjoy authentic African cuisine in a welcoming atmosphere.',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How Afritable Works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Getting your table at the best African restaurants is simple and fast
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={step.number} className="text-center group">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto group-hover:bg-orange-200 transition-colors duration-300">
                  <div className="text-orange-600">
                    {step.icon}
                  </div>
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {step.number}
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {step.title}
              </h3>
              
              <p className="text-gray-600 leading-relaxed">
                {step.description}
              </p>

              {/* Connector line for desktop */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-full w-full h-0.5 bg-gray-200 transform translate-x-4">
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-orange-600 rounded-full"></div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              Ready to discover amazing African cuisine?
            </h3>
            <p className="text-orange-100 mb-6 max-w-2xl mx-auto">
              Join thousands of food lovers who have found their new favorite restaurants through Afritable.
            </p>
            <button className="bg-white text-orange-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition-colors duration-200">
              Start Exploring
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
