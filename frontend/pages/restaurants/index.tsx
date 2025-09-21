import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Header from '../../components/Layout/Header';
import Footer from '../../components/Layout/Footer';
import BackButton from '../../components/ui/BackButton';
import MetroSearch from '../../components/search/MetroSearch';
import MapView from '../../components/Map/MapView';
import Image from 'next/image';

interface Photo {
  id: string;
  url: string;
  caption?: string;
  isPrimary: boolean;
}

interface Restaurant {
  id: string;
  name: string; 
  description: string;
  cuisine: string;
  city: string;
  state: string;
  rating: number;
  reviewCount: number;
  photos?: Photo[];
  priceRange: string;
  address: string;
  phone?: string;
  website?: string;
  latitude?: number;
  longitude?: number;
  acceptsReservations?: boolean;
  hasDelivery?: boolean;
  hasTakeout?: boolean;
  hasOutdoorSeating?: boolean;
  hasWifi?: boolean;
  hasParking?: boolean;
  isWheelchairAccessible?: boolean;
}

const RestaurantsPage: React.FC = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [groupedRestaurants, setGroupedRestaurants] = useState<{ [key: string]: Restaurant[] }>({});
  const [countries, setCountries] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedMetro, setSelectedMetro] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedPriceRange, setSelectedPriceRange] = useState('');
  const [selectedMinRating, setSelectedMinRating] = useState('');
  const [activeSearchTab, setActiveSearchTab] = useState('location');
  const [cuisines, setCuisines] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRestaurants, setTotalRestaurants] = useState(0);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Get query parameters from URL and update state
    const { search, cuisine, city, metroArea, region, priceRange, minRating } = router.query;
    
    // Only update state if router is ready and has query parameters
    if (router.isReady) {
      if (search) setSearchQuery(search as string);
      if (cuisine) setSelectedCuisine(cuisine as string);
      if (city) setSelectedLocation(city as string);
      if (metroArea) setSelectedMetro(metroArea as string);
      if (region) setSelectedRegion(region as string);
      if (priceRange) setSelectedPriceRange(priceRange as string);
      if (minRating) setSelectedMinRating(minRating as string);
    }
  }, [router.isReady, router.query]);

  const fetchRestaurants = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (selectedCuisine) params.append('cuisine', selectedCuisine);
      if (selectedLocation) params.append('city', selectedLocation);
      if (selectedMetro) params.append('metroArea', selectedMetro);
      if (selectedRegion) params.append('region', selectedRegion);
      if (selectedPriceRange) params.append('priceRange', selectedPriceRange);
      if (selectedMinRating) params.append('minRating', selectedMinRating);
      
      // Use pagination with 20 restaurants per page
      params.append('page', currentPage.toString());
      params.append('limit', '20');
      
      const response = await fetch(`http://localhost:3001/api/restaurants?${params.toString()}`);
      const data = await response.json();
      if (data.success) {
        setRestaurants(data.data.restaurants);
        setTotalRestaurants(data.data.total);
        setTotalPages(data.data.totalPages);
      } else {
        console.error('API Error:', data.error);
      }
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedCuisine, selectedLocation, selectedMetro, selectedRegion, selectedPriceRange, selectedMinRating, currentPage]);

  const fetchCuisines = useCallback(async () => {
    try {
          const response = await fetch('http://localhost:3001/api/restaurants/cuisines/list');
      const data = await response.json();
      if (data.success) {
        setCuisines(data.data);
      }
    } catch (error) {
      console.error('Error fetching cuisines:', error);
    }
  }, []);

  useEffect(() => {
    // Only fetch when router is ready to avoid race conditions
    if (router.isReady) {
      fetchRestaurants();
      fetchCuisines();
    }
  }, [router.isReady, fetchRestaurants, fetchCuisines]);

  // Debounced search effect
  useEffect(() => {
    if (router.isReady && searchQuery) {
      const timeoutId = setTimeout(() => {
        setCurrentPage(1);
        fetchRestaurants();
      }, 500); // 500ms delay
      
      return () => clearTimeout(timeoutId);
    }
  }, [searchQuery, fetchRestaurants]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.append('search', searchQuery);
    if (selectedCuisine) params.append('cuisine', selectedCuisine);
    if (selectedLocation) params.append('city', selectedLocation);
    if (selectedMetro) params.append('metroArea', selectedMetro);
    if (selectedRegion) params.append('region', selectedRegion);
    if (selectedPriceRange) params.append('priceRange', selectedPriceRange);
    if (selectedMinRating) params.append('minRating', selectedMinRating);
    
    router.push(`/restaurants?${params.toString()}`);
  };

  const handleMetroChange = (metroAreaId: string | null) => {
    setSelectedMetro(metroAreaId || '');
    setSelectedRegion(''); // Reset region when metro changes
    setCurrentPage(1); // Reset to first page
  };

  const handleRegionChange = (regionId: string | null) => {
    setSelectedRegion(regionId || '');
    setCurrentPage(1); // Reset to first page
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getCountryName = (countryCode: string) => {
    const countryNames: { [key: string]: string } = {
      'US': 'United States',
      'NG': 'Nigeria',
      'KE': 'Kenya',
      'ET': 'Ethiopia',
      'GH': 'Ghana',
      'ZA': 'South Africa',
      'EG': 'Egypt',
      'MA': 'Morocco',
      'TN': 'Tunisia',
      'DZ': 'Algeria',
      'LY': 'Libya',
      'SD': 'Sudan',
      'SS': 'South Sudan',
      'TD': 'Chad',
      'NE': 'Niger',
      'ML': 'Mali',
      'BF': 'Burkina Faso',
      'CI': 'Ivory Coast',
      'GN': 'Guinea',
      'SL': 'Sierra Leone',
      'LR': 'Liberia',
      'SN': 'Senegal',
      'GM': 'Gambia',
      'GW': 'Guinea-Bissau',
      'CV': 'Cape Verde',
      'MR': 'Mauritania',
      'SO': 'Somalia',
      'DJ': 'Djibouti',
      'ER': 'Eritrea',
      'UG': 'Uganda',
      'TZ': 'Tanzania',
      'RW': 'Rwanda',
      'BI': 'Burundi',
      'CD': 'Democratic Republic of Congo',
      'CF': 'Central African Republic',
      'CM': 'Cameroon',
      'GQ': 'Equatorial Guinea',
      'GA': 'Gabon',
      'CG': 'Republic of Congo',
      'AO': 'Angola',
      'ZM': 'Zambia',
      'ZW': 'Zimbabwe',
      'BW': 'Botswana',
      'NA': 'Namibia',
      'SZ': 'Eswatini',
      'LS': 'Lesotho',
      'MG': 'Madagascar',
      'MU': 'Mauritius',
      'SC': 'Seychelles',
      'KM': 'Comoros',
      'YT': 'Mayotte',
      'RE': 'Réunion',
      'CA': 'Canada',
      'GB': 'United Kingdom',
      'FR': 'France',
      'DE': 'Germany',
      'IT': 'Italy',
      'ES': 'Spain',
      'NL': 'Netherlands',
      'BE': 'Belgium',
      'CH': 'Switzerland',
      'AT': 'Austria',
      'SE': 'Sweden',
      'NO': 'Norway',
      'DK': 'Denmark',
      'FI': 'Finland',
      'IE': 'Ireland',
      'PT': 'Portugal',
      'GR': 'Greece',
      'PL': 'Poland',
      'CZ': 'Czech Republic',
      'HU': 'Hungary',
      'RO': 'Romania',
      'BG': 'Bulgaria',
      'HR': 'Croatia',
      'SI': 'Slovenia',
      'SK': 'Slovakia',
      'LT': 'Lithuania',
      'LV': 'Latvia',
      'EE': 'Estonia',
      'AU': 'Australia',
      'NZ': 'New Zealand',
      'BR': 'Brazil',
      'AR': 'Argentina',
      'MX': 'Mexico',
      'IN': 'India',
      'CN': 'China',
      'JP': 'Japan',
      'KR': 'South Korea',
      'TH': 'Thailand',
      'VN': 'Vietnam',
      'PH': 'Philippines',
      'ID': 'Indonesia',
      'MY': 'Malaysia',
      'SG': 'Singapore',
      'AE': 'United Arab Emirates',
      'SA': 'Saudi Arabia',
      'IL': 'Israel',
      'TR': 'Turkey',
      'RU': 'Russia',
      'UA': 'Ukraine',
      'Unknown': 'Unknown'
    };
    return countryNames[countryCode] || countryCode;
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

      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
        <Header />
        
        <main>
          {/* Back Button */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <BackButton href="/" className="mb-4">
              Back to Home
            </BackButton>
          </div>

          {/* Hero Section */}
          <section className="relative py-16 overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-gradient-to-r from-orange-100/20 to-amber-100/20"></div>
            <div className="absolute inset-0 opacity-40" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f97316' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}></div>
            
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                {/* Icon */}
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full mb-8 shadow-lg">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                
                <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 bg-clip-text text-transparent mb-6">
                  Discover African Restaurants
                </h1>
                <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  From spicy jollof rice to aromatic berbere, find authentic flavors from across Africa and the Caribbean
                </p>
                
                {/* Stats */}
                <div className="flex justify-center items-center space-x-8 mt-8">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600">{totalRestaurants.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Restaurants</div>
                  </div>
                  <div className="w-px h-12 bg-gray-300"></div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-amber-600">50+</div>
                    <div className="text-sm text-gray-600">Cities</div>
                  </div>
                  <div className="w-px h-12 bg-gray-300"></div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600">15+</div>
                    <div className="text-sm text-gray-600">Cuisines</div>
                  </div>
                </div>
              </div>

            </div>
          </section>

          {/* Search Section */}
          <section id="search-section" className="py-12 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-3">
                  Find Your Perfect African Restaurant
                </h2>
                <p className="text-gray-600 text-lg">
                  Search by location, cuisine, or use our advanced filters
                </p>
              </div>
              
              {/* Search Tabs */}
              <div className="flex justify-center mb-8">
                <div className="bg-white rounded-full p-1 shadow-lg">
                  <button 
                    onClick={() => setActiveSearchTab('location')}
                    className={`px-6 py-2 rounded-full font-semibold transition-all duration-200 ${
                      activeSearchTab === 'location'
                        ? 'bg-orange-600 text-white shadow-sm'
                        : 'text-gray-600 hover:text-orange-600'
                    }`}
                  >
                    By Location
                  </button>
                  <button 
                    onClick={() => setActiveSearchTab('cuisine')}
                    className={`px-6 py-2 rounded-full font-semibold transition-all duration-200 ${
                      activeSearchTab === 'cuisine'
                        ? 'bg-orange-600 text-white shadow-sm'
                        : 'text-gray-600 hover:text-orange-600'
                    }`}
                  >
                    By Cuisine
                  </button>
                  <button 
                    onClick={() => setActiveSearchTab('advanced')}
                    className={`px-6 py-2 rounded-full font-semibold transition-all duration-200 ${
                      activeSearchTab === 'advanced'
                        ? 'bg-orange-600 text-white shadow-sm'
                        : 'text-gray-600 hover:text-orange-600'
                    }`}
                  >
                    Advanced
                  </button>
                </div>
              </div>
              
              {/* Search Content Based on Active Tab */}
              <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
                {activeSearchTab === 'location' && (
                  <MetroSearch
                    onMetroChange={handleMetroChange}
                    onRegionChange={handleRegionChange}
                    selectedMetro={selectedMetro}
                    selectedRegion={selectedRegion}
                  />
                )}
                
                {activeSearchTab === 'cuisine' && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Search by Restaurant Name or Cuisine
                      </label>
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="e.g., Ethiopian, Jollof, Suya..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Popular African Cuisines
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {['Ethiopian', 'Nigerian', 'Ghanaian', 'Kenyan', 'Somali', 'Caribbean', 'Senegalese', 'Moroccan', 'Haitian', 'South African'].map((cuisine) => (
                          <button
                            key={cuisine}
                            onClick={() => {
                              setSelectedCuisine(cuisine);
                              setSearchQuery(cuisine);
                            }}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                              selectedCuisine === cuisine
                                ? 'bg-orange-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-orange-100 hover:text-orange-600'
                            }`}
                          >
                            {cuisine}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                
                {activeSearchTab === 'advanced' && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Search by Restaurant Name
                      </label>
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Enter restaurant name..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      />
                    </div>
                    
                    <MetroSearch
                      onMetroChange={handleMetroChange}
                      onRegionChange={handleRegionChange}
                      selectedMetro={selectedMetro}
                      selectedRegion={selectedRegion}
                    />
                  </div>
                )}
                
                {/* Advanced Filters */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  {/* Cuisine Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cuisine Type
                    </label>
                    <select
                      value={selectedCuisine}
                      onChange={(e) => setSelectedCuisine(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    >
                      <option value="">All Cuisines</option>
                      {cuisines.map((cuisine) => (
                        <option key={cuisine} value={cuisine}>
                          {cuisine}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Price Range Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price Range
                    </label>
                    <select
                      value={selectedPriceRange}
                      onChange={(e) => setSelectedPriceRange(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    >
                      <option value="">Any Price</option>
                      <option value="INEXPENSIVE">$ - Inexpensive</option>
                      <option value="MODERATE">$$ - Moderate</option>
                      <option value="EXPENSIVE">$$$ - Expensive</option>
                      <option value="VERY_EXPENSIVE">$$$$ - Very Expensive</option>
                    </select>
                  </div>
                  
                  {/* Rating Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Minimum Rating
                    </label>
                    <select
                      value={selectedMinRating}
                      onChange={(e) => setSelectedMinRating(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    >
                      <option value="">Any Rating</option>
                      <option value="4.5">4.5+ Stars</option>
                      <option value="4.0">4.0+ Stars</option>
                      <option value="3.5">3.5+ Stars</option>
                      <option value="3.0">3.0+ Stars</option>
                    </select>
                  </div>
                </div>
                
                {/* Search Buttons */}
                <div className="mt-8 text-center space-x-4">
                  <button
                    onClick={() => {
                      setCurrentPage(1);
                      const params = new URLSearchParams();
                      if (searchQuery) params.append('search', searchQuery);
                      if (selectedMetro) params.append('metroArea', selectedMetro);
                      if (selectedRegion) params.append('region', selectedRegion);
                      if (selectedCuisine) params.append('cuisine', selectedCuisine);
                      if (selectedPriceRange) params.append('priceRange', selectedPriceRange);
                      if (selectedMinRating) params.append('minRating', selectedMinRating);
                      router.push(`/restaurants?${params.toString()}`);
                    }}
                    className="bg-gradient-to-r from-orange-600 to-amber-600 text-white px-12 py-4 rounded-xl font-semibold text-lg hover:from-orange-700 hover:to-amber-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    🔍 Find Restaurants
                  </button>
                  
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCuisine('');
                      setSelectedLocation('');
                      setSelectedMetro('');
                      setSelectedRegion('');
                      setSelectedPriceRange('');
                      setSelectedMinRating('');
                      setCurrentPage(1);
                      router.push('/restaurants');
                    }}
                    className="bg-gray-100 text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-200 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    🗑️ Clear Filters
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Results Section */}
          <section className="py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900">
                  {loading ? 'Searching...' : `${totalRestaurants} Restaurants Found`}
                </h2>
                
                <div className="flex items-center space-x-4">
                  {/* View Toggle */}
                  <div className="flex bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode('list')}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                        viewMode === 'list'
                          ? 'bg-white text-orange-600 shadow-sm'
                          : 'text-gray-600 hover:text-orange-600'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                        </svg>
                        <span>List</span>
                      </div>
                    </button>
                    <button
                      onClick={() => setViewMode('map')}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                        viewMode === 'map'
                          ? 'bg-white text-orange-600 shadow-sm'
                          : 'text-gray-600 hover:text-orange-600'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>Map</span>
                      </div>
                    </button>
                  </div>
                  
                  {/* Add Restaurant Button */}
                  <button
                    onClick={() => router.push('/add-restaurant')}
                    className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                  >
                    + Add Restaurant
                  </button>
                  
                  {/* Pagination Info */}
                  {totalPages > 1 && (
                    <div className="text-gray-600">
                      Page {currentPage} of {totalPages}
                    </div>
                  )}
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
                viewMode === 'map' ? (
                  <MapView
                    restaurants={restaurants}
                    selectedRestaurant={selectedRestaurant}
                    onRestaurantSelect={setSelectedRestaurant}
                    className="mb-8"
                  />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {restaurants.map((restaurant) => (
                    <div key={restaurant.id} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer group overflow-hidden border border-gray-100">
                      <div className="relative h-56 overflow-hidden">
                        {restaurant.photos && restaurant.photos.length > 0 ? (
                          <Image
                            src={restaurant.photos[0].url}
                            alt={restaurant.name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-orange-400 via-amber-500 to-orange-600 flex flex-col items-center justify-center">
                            <span className="text-white text-4xl font-bold mb-2">
                              {restaurant.name.charAt(0)}
                            </span>
                            <span className="text-white/90 text-sm text-center px-4">
                              Photo coming soon
                            </span>
                          </div>
                        )}
                        
                        {/* Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                        
                        {/* Price Badge */}
                        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm">
                          <span className="text-sm font-bold text-gray-900">
                            {getPriceRange(restaurant.priceRange)}
                          </span>
                        </div>
                        
                        {/* Rating Badge */}
                        <div className="absolute top-4 left-4 bg-orange-500/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm">
                          <div className="flex items-center space-x-1">
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span className="text-white text-sm font-semibold">
                              {restaurant.rating?.toFixed(1) || 'N/A'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="p-6">
                        <div className="mb-4">
                          <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors duration-200 mb-2">
                            {restaurant.name}
                          </h3>
                          <div className="flex items-center space-x-2">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                              {restaurant.cuisine}
                            </span>
                            <span className="text-gray-500 text-sm">
                              {restaurant.city}, {restaurant.state}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <p className="text-gray-600 text-sm line-clamp-2">
                            {restaurant.description || 'Authentic African cuisine experience'}
                          </p>
                          
                          {/* Contact Information */}
                          <div className="space-y-2">
                            {restaurant.phone ? (
                              <div className="flex items-center text-sm text-gray-700">
                                <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                <span className="font-medium">{restaurant.phone}</span>
                              </div>
                            ) : (
                              <div className="flex items-center text-sm text-gray-500">
                                <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                <span>Phone not available - Visit in person</span>
                              </div>
                            )}
                            
                            <div className="flex items-center text-sm text-gray-600">
                              <svg className="w-4 h-4 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              <span className="truncate">{restaurant.address}</span>
                            </div>
                            
                            {restaurant.website && (
                              <div className="flex items-center text-sm text-gray-600">
                                <svg className="w-4 h-4 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                                <a href={restaurant.website} target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:text-orange-700 underline">
                                  Visit Website
                                </a>
                              </div>
                            )}
                          </div>
                        </div>

                          {/* Restaurant Features */}
                          <div className="flex flex-wrap gap-1 mt-2">
                            {restaurant.acceptsReservations && (
                              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                                Reservations
                              </span>
                            )}
                            {restaurant.hasDelivery && (
                              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                Delivery
                              </span>
                            )}
                            {restaurant.hasTakeout && (
                              <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                                Takeout
                              </span>
                            )}
                            {restaurant.hasOutdoorSeating && (
                              <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                                Outdoor
                              </span>
                            )}
                          </div>

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
                          className="w-full bg-gradient-to-r from-orange-600 to-amber-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-orange-700 hover:to-amber-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 mt-4"
                        >
                          <div className="flex items-center justify-center space-x-2">
                            <span>View Details</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </div>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                )
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

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center space-x-4 mt-12">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    Previous
                  </button>
                  
                  <div className="flex space-x-2">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                            currentPage === pageNum
                              ? 'bg-orange-600 text-white'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    Next
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
