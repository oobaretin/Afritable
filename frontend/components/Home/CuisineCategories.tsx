import React from 'react';
import Link from 'next/link';

const CuisineCategories: React.FC = () => {
  const cuisines = [
    {
      name: 'Ethiopian',
      description: 'Injera, Doro Wat, Tibs',
      image: '🇪🇹',
      color: 'from-red-500 to-red-700',
    },
    {
      name: 'Nigerian',
      description: 'Jollof Rice, Egusi, Pounded Yam',
      image: '🇳🇬',
      color: 'from-green-500 to-green-700',
    },
    {
      name: 'Moroccan',
      description: 'Tagine, Couscous, Pastilla',
      image: '🇲🇦',
      color: 'from-red-600 to-red-800',
    },
    {
      name: 'West African',
      description: 'Fufu, Banku, Groundnut Soup',
      image: '🌍',
      color: 'from-yellow-500 to-orange-600',
    },
    {
      name: 'Somali',
      description: 'Canjeero, Hilib Ari, Bariis',
      image: '🇸🇴',
      color: 'from-blue-500 to-blue-700',
    },
    {
      name: 'Sudanese',
      description: 'Ful Medames, Kisra, Asida',
      image: '🇸🇩',
      color: 'from-green-600 to-green-800',
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Explore African Cuisines
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            From the spicy flavors of West Africa to the aromatic dishes of North Africa, 
            discover the rich diversity of African cuisine.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cuisines.map((cuisine) => (
            <Link key={cuisine.name} href={`/restaurants?cuisine=${cuisine.name}`}>
              <div className="group cursor-pointer">
                <div className={`bg-gradient-to-br ${cuisine.color} rounded-2xl p-8 text-white transform group-hover:scale-105 transition-transform duration-300 shadow-lg`}>
                  <div className="text-center">
                    <div className="text-6xl mb-4">{cuisine.image}</div>
                    <h3 className="text-2xl font-bold mb-2">{cuisine.name}</h3>
                    <p className="text-white/90 mb-4">{cuisine.description}</p>
                    <div className="inline-flex items-center text-white/80 group-hover:text-white transition-colors duration-200">
                      <span className="mr-2">Explore</span>
                      <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="bg-white rounded-2xl p-8 shadow-lg max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Can't find what you're looking for?
            </h3>
            <p className="text-gray-600 mb-6">
              We're constantly adding new restaurants and cuisines. 
              Let us know what you'd like to see!
            </p>
            <button className="btn-primary">
              Suggest a Restaurant
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CuisineCategories;
