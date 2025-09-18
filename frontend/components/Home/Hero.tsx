import React, { useState } from 'react';
import { useRouter } from 'next/router';
import MetroSearch from '../search/MetroSearch';

const Hero: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [selectedMetro, setSelectedMetro] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() || location.trim() || selectedMetro || selectedRegion) {
      const params = new URLSearchParams();
      if (searchQuery.trim()) params.append('search', searchQuery.trim());
      if (location.trim()) params.append('location', location.trim());
      if (selectedMetro) params.append('metroArea', selectedMetro);
      if (selectedRegion) params.append('region', selectedRegion);
      router.push(`/restaurants?${params.toString()}`);
    }
  };

  const handleMetroChange = (metroAreaId: string | null) => {
    setSelectedMetro(metroAreaId || '');
  };

  const handleRegionChange = (regionId: string | null) => {
    setSelectedRegion(regionId || '');
  };

  return (
    <section className="hero-gradient text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Discover Amazing
            <span className="block text-yellow-300">African Cuisine</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-orange-100 max-w-3xl mx-auto">
            From Ethiopian injera to Nigerian jollof rice, find and book reservations 
            at the best African restaurants in your city.
          </p>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="max-w-6xl mx-auto">
            <div className="bg-white rounded-2xl p-6 shadow-2xl">
              {/* Basic Search Row */}
              <div className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="What are you craving? (e.g., Ethiopian, Nigerian, Moroccan)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-6 py-4 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none text-lg"
                  />
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Where? (City, State, or ZIP)"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-6 py-4 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none text-lg"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-8 py-4 rounded-xl transition-colors duration-200 text-lg whitespace-nowrap"
                >
                  Find Restaurants
                </button>
              </div>

              {/* Metro/Region Search */}
              <div className="border-t border-gray-200 pt-4">
                <MetroSearch
                  onMetroChange={handleMetroChange}
                  onRegionChange={handleRegionChange}
                  selectedMetro={selectedMetro}
                  selectedRegion={selectedRegion}
                />
              </div>
            </div>
          </form>

          {/* Popular Searches */}
          <div className="mt-8">
            <p className="text-orange-200 mb-4">Popular searches:</p>
            <div className="flex flex-wrap justify-center gap-3">
              {['Ethiopian', 'Nigerian', 'Moroccan', 'West African', 'Somali', 'Sudanese'].map((cuisine) => (
                <button
                  key={cuisine}
                  onClick={() => {
                    setSearchQuery(cuisine);
                    router.push(`/restaurants?search=${cuisine}`);
                  }}
                  className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 backdrop-blur-sm"
                >
                  {cuisine}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
