import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Header from '../../components/Layout/Header';
import Footer from '../../components/Layout/Footer';
import BackButton from '../../components/ui/BackButton';
import MetroSearch from '../../components/search/MetroSearch';
import Image from 'next/image';

interface Restaurant {
  id: string;
  name: string;
  description: string;
  cuisine: string;
  city: string;
  state: string;
  rating: number;
  reviewCount: number;
  mainImage?: string;
  priceRange: string;
  address: string;
}

const RestaurantsPage: React.FC = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedMetro, setSelectedMetro] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [cuisines, setCuisines] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    // Get query parameters from URL
    const { search, cuisine, location, metroArea, region } = router.query;
    if (search) setSearchQuery(search as string);
    if (cuisine) setSelectedCuisine(cuisine as string);
    if (location) setSelectedLocation(location as string);
    if (metroArea) setSelectedMetro(metroArea as string);
    if (region) setSelectedRegion(region as string);
  }, [router.query]);

  useEffect(() => {
    fetchRestaurants();
    fetchCuisines();
  }, [searchQuery, selectedCuisine, selectedLocation, selectedMetro, selectedRegion]);

  const fetchRestaurants = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (selectedCuisine) params.append('cuisine', selectedCuisine);
      if (selectedLocation) params.append('city', selectedLocation);
      if (selectedMetro) params.append('metroArea', selectedMetro);
      if (selectedRegion) params.append('region', selectedRegion);
      
      const response = await fetch(`http://localhost:3001/api/restaurants?${params.toString()}`);
      const data = await response.json();
      if (data.success) {
        setRestaurants(data.data);
      }
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCuisines = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/restaurants/cuisines/list');
      const data = await response.json();
      if (data.success) {
        setCuisines(data.data);
      }
    } catch (error) {
      console.error('Error fetching cuisines:', error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.append('search', searchQuery);
    if (selectedCuisine) params.append('cuisine', selectedCuisine);
    if (selectedLocation) params.append('location', selectedLocation);
    if (selectedMetro) params.append('metroArea', selectedMetro);
    if (selectedRegion) params.append('region', selectedRegion);
    
    router.push(`/restaurants?${params.toString()}`);
  };

  const handleMetroChange = (metroAreaId: string | null) => {
    setSelectedMetro(metroAreaId || '');
  };

  const handleRegionChange = (regionId: string | null) => {
    setSelectedRegion(regionId || '');
  };

  const getPriceRange = (priceRange: string) => {
    switch (priceRange) {
      case 'BUDGET': return '$$';
      case 'MODERATE': return '$$$';
      case 'EXPENSIVE': return '$$$$';
      default: return '$$$';
    }
  };

  const getStarRating = (rating: number) => {
    return '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
  };

  return (
    <>
      <Head>
        <title>African Restaurants - Afritable</title>
        <meta name="description" content="Find the best African restaurants in your area. Browse by cuisine, location, and more." />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <main>
          {/* Back Button */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <BackButton href="/" className="mb-4">
              Back to Home
            </BackButton>
          </div>

          {/* Hero Section */}
          <section className="bg-white py-12 border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-8">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                  Discover African Restaurants
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Find the perfect African restaurant for your next meal
                </p>
              </div>

              {/* Search Form */}
              <form onSubmit={handleSearch} className="max-w-6xl mx-auto">
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
                  {/* Basic Search Row */}
                  <div className="flex flex-col md:flex-row gap-4 mb-4">
                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder="Search restaurants or dishes..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-4 py-3 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none"
                      />
                    </div>
                    <div className="flex-1">
                      <select
                        value={selectedCuisine}
                        onChange={(e) => setSelectedCuisine(e.target.value)}
                        className="w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none bg-white"
                      >
                        <option value="">All Cuisines</option>
                        {cuisines.map((cuisine) => (
                          <option key={cuisine} value={cuisine}>
                            {cuisine}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder="City or ZIP code"
                        value={selectedLocation}
                        onChange={(e) => setSelectedLocation(e.target.value)}
                        className="w-full px-4 py-3 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none"
                      />
                    </div>
                    <button
                      type="submit"
                      className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors duration-200 whitespace-nowrap"
                    >
                      Search
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
            </div>
          </section>

          {/* Results Section */}
          <section className="py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900">
                  {loading ? 'Searching...' : `${restaurants?.length || 0} Restaurants Found`}
                </h2>
                
                {/* Sort Options */}
                <div className="flex items-center space-x-4">
                  <span className="text-gray-600">Sort by:</span>
                  <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500">
                    <option value="rating">Rating</option>
                    <option value="name">Name</option>
                    <option value="distance">Distance</option>
                  </select>
                </div>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="card animate-pulse">
                      <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : restaurants && restaurants.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {restaurants.map((restaurant) => (
                    <div key={restaurant.id} className="card hover:shadow-lg transition-shadow duration-300 cursor-pointer group">
                      <div className="relative h-48 mb-4 overflow-hidden rounded-lg">
                        {restaurant.mainImage ? (
                          <Image
                            src={restaurant.mainImage}
                            alt={restaurant.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center">
                            <span className="text-white text-2xl font-bold">
                              {restaurant.name.charAt(0)}
                            </span>
                          </div>
                        )}
                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                          <span className="text-sm font-semibold text-gray-900">
                            {getPriceRange(restaurant.priceRange)}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors duration-200">
                            {restaurant.name}
                          </h3>
                          <p className="text-orange-600 font-medium">
                            {restaurant.cuisine}
                          </p>
                        </div>

                        <p className="text-gray-600 text-sm line-clamp-2">
                          {restaurant.description}
                        </p>

                        <p className="text-gray-500 text-sm">
                          📍 {restaurant.address}, {restaurant.city}, {restaurant.state}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="text-yellow-500 text-sm">
                              {getStarRating(restaurant.rating)}
                            </span>
                            <span className="text-sm text-gray-600">
                              {restaurant.rating.toFixed(1)} ({restaurant.reviewCount} reviews)
                            </span>
                          </div>
                        </div>

                        <button 
                          onClick={() => router.push(`/restaurants/${restaurant.id}`)}
                          className="w-full btn-primary mt-4"
                        >
                          View Details & Book
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🍽️</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    No restaurants found
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Try adjusting your search criteria or browse all restaurants.
                  </p>
                  <button 
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCuisine('');
                      setSelectedLocation('');
                      setSelectedMetro('');
                      setSelectedRegion('');
                      router.push('/restaurants');
                    }}
                    className="btn-primary"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          </section>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default RestaurantsPage;
