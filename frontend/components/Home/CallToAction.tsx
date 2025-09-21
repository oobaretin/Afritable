import React from 'react';
import { useRouter } from 'next/router';

const CallToAction: React.FC = () => {
  const router = useRouter();

  return (
    <section className="py-16 bg-gradient-to-r from-orange-50 to-amber-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Ready to Explore African Cuisine?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Browse our curated collection of authentic African restaurants with advanced search and filtering options
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push('/restaurants')}
              className="bg-gradient-to-r from-orange-600 to-amber-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-orange-700 hover:to-amber-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              🔍 Start Searching
            </button>
            
            <button
              onClick={() => router.push('/add-restaurant')}
              className="bg-white text-orange-600 border-2 border-orange-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-orange-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              ➕ Suggest a Restaurant
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
