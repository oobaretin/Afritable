import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Header from '../../components/Layout/Header';
import Footer from '../../components/Layout/Footer';
import BackButton from '../../components/ui/BackButton';
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
  address: string;
  phone?: string;
  website?: string;
  email?: string;
  rating: number;
  reviewCount: number;
  photos?: Photo[];
  priceRange: string;
  acceptsReservations?: boolean;
  hasDelivery?: boolean;
  hasTakeout?: boolean;
  hasOutdoorSeating?: boolean;
  hasWifi?: boolean;
  hasParking?: boolean;
  isWheelchairAccessible?: boolean;
  mondayOpen?: string;
  mondayClose?: string;
  tuesdayOpen?: string;
  tuesdayClose?: string;
  wednesdayOpen?: string;
  wednesdayClose?: string;
  thursdayOpen?: string;
  thursdayClose?: string;
  fridayOpen?: string;
  fridayClose?: string;
  saturdayOpen?: string;
  saturdayClose?: string;
  sundayOpen?: string;
  sundayClose?: string;
}

const RestaurantDetailPage: React.FC = () => {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [partySize, setPartySize] = useState(2);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      fetchRestaurant();
      fetchSimilarRestaurants(id as string);
    }
  }, [id]);

  // Fetch availability when date or party size changes
  useEffect(() => {
    if (selectedDate && partySize) {
      fetchAvailability(selectedDate, partySize);
    }
  }, [selectedDate, partySize]);

  const fetchRestaurant = async () => {
    try {
      setLoading(true);
          const response = await fetch(`http://localhost:3001/api/restaurants/${id}`);
      const data = await response.json();
      if (data.success) {
        setRestaurant(data.data);
      } else {
        router.push('/404');
      }
    } catch (error) {
      console.error('Error fetching restaurant:', error);
      router.push('/404');
    } finally {
      setLoading(false);
    }
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

  const getPopularDishes = (cuisine: string) => {
    const dishes: { [key: string]: Array<{ name: string; price: string }> } = {
      'Ethiopian': [
        { name: 'Injera with Doro Wat', price: '$18' },
        { name: 'Tibs (Beef)', price: '$16' },
        { name: 'Kitfo (Raw Beef)', price: '$20' },
        { name: 'Shiro (Chickpea Stew)', price: '$14' },
        { name: 'Vegetarian Combo', price: '$22' }
      ],
      'Nigerian': [
        { name: 'Jollof Rice', price: '$12' },
        { name: 'Pounded Yam & Egusi', price: '$16' },
        { name: 'Pepper Soup', price: '$14' },
        { name: 'Suya (Grilled Beef)', price: '$18' },
        { name: 'Fried Plantains', price: '$8' }
      ],
      'Moroccan': [
        { name: 'Tagine (Lamb)', price: '$24' },
        { name: 'Couscous Royale', price: '$20' },
        { name: 'Harira Soup', price: '$12' },
        { name: 'Pastilla (Chicken)', price: '$18' },
        { name: 'Mint Tea', price: '$6' }
      ],
      'West African': [
        { name: 'Banku & Tilapia', price: '$16' },
        { name: 'Fufu & Light Soup', price: '$14' },
        { name: 'Red Red (Beans)', price: '$10' },
        { name: 'Kelewele (Spiced Plantains)', price: '$8' },
        { name: 'Palm Nut Soup', price: '$15' }
      ],
      'East African': [
        { name: 'Ugali & Sukuma Wiki', price: '$12' },
        { name: 'Nyama Choma (Grilled Meat)', price: '$20' },
        { name: 'Pilau Rice', price: '$14' },
        { name: 'Mandazi (Sweet Bread)', price: '$6' },
        { name: 'Chai Tea', price: '$4' }
      ],
      'Somali': [
        { name: 'Bariis (Spiced Rice)', price: '$16' },
        { name: 'Hilib Ari (Goat Meat)', price: '$18' },
        { name: 'Canjeero (Flatbread)', price: '$8' },
        { name: 'Sambusa', price: '$6' },
        { name: 'Shaah (Tea)', price: '$4' }
      ],
      'Sudanese': [
        { name: 'Ful Medames', price: '$12' },
        { name: 'Kisra (Sorghum Bread)', price: '$8' },
        { name: 'Mulukhiyah', price: '$14' },
        { name: 'Aseeda (Porridge)', price: '$10' },
        { name: 'Hibiscus Tea', price: '$5' }
      ],
      'African': [
        { name: 'Signature African Dish', price: '$15' },
        { name: 'Traditional Stew', price: '$14' },
        { name: 'Spiced Rice', price: '$12' },
        { name: 'Grilled Meat', price: '$18' },
        { name: 'Traditional Bread', price: '$8' }
      ]
    };
    return dishes[cuisine] || dishes['African'] || [];
  };

  const getCuisineSpecialties = (cuisine: string) => {
    const specialties: { [key: string]: string[] } = {
      'Ethiopian': ['Traditional Coffee Ceremony', 'Spiced Butter', 'Berbere Spice', 'Teff Grain'],
      'Nigerian': ['Palm Oil Dishes', 'Pepper Spices', 'Traditional Stews', 'Local Vegetables'],
      'Moroccan': ['Preserved Lemons', 'Ras el Hanout', 'Argan Oil', 'Traditional Tagines'],
      'West African': ['Palm Nut Oil', 'Groundnut Soup', 'Traditional Fermentation', 'Local Spices'],
      'East African': ['Coconut Milk', 'Cardamom Spice', 'Traditional Grilling', 'Local Herbs'],
      'Somali': ['Camel Milk', 'Traditional Spices', 'Banana Leaves', 'Local Grains'],
      'Sudanese': ['Sesame Oil', 'Traditional Breads', 'Local Legumes', 'Hibiscus Drinks'],
      'African': ['Authentic Flavors', 'Traditional Cooking', 'Local Ingredients', 'Cultural Heritage']
    };
    return specialties[cuisine] || specialties['African'] || [];
  };

  const [similarRestaurants, setSimilarRestaurants] = useState<any[]>([]);
  const [loadingSimilar, setLoadingSimilar] = useState(false);

  const fetchSimilarRestaurants = async (restaurantId: string) => {
    try {
      setLoadingSimilar(true);
      const response = await fetch(`http://localhost:3001/api/restaurants/${restaurantId}/similar?limit=3`);
      const data = await response.json();
      if (data.success) {
        setSimilarRestaurants(data.data);
      }
    } catch (error) {
      console.error('Error fetching similar restaurants:', error);
    } finally {
      setLoadingSimilar(false);
    }
  };

  const getMustTryDish = (cuisine: string) => {
    const mustTryDishes: { [key: string]: string } = {
      'Ethiopian': 'Doro Wat (Spiced Chicken Stew)',
      'Nigerian': 'Jollof Rice with Grilled Fish',
      'Moroccan': 'Lamb Tagine with Preserved Lemons',
      'West African': 'Banku with Grilled Tilapia',
      'East African': 'Nyama Choma (Grilled Meat)',
      'Somali': 'Bariis with Goat Meat',
      'Sudanese': 'Ful Medames with Fresh Bread'
    };
    return mustTryDishes[cuisine] || 'Signature Dish';
  };

  const getOperatingHours = () => {
    if (!restaurant) return [];
    
    const days = [
      { name: 'Monday', open: restaurant.mondayOpen, close: restaurant.mondayClose },
      { name: 'Tuesday', open: restaurant.tuesdayOpen, close: restaurant.tuesdayClose },
      { name: 'Wednesday', open: restaurant.wednesdayOpen, close: restaurant.wednesdayClose },
      { name: 'Thursday', open: restaurant.thursdayOpen, close: restaurant.thursdayClose },
      { name: 'Friday', open: restaurant.fridayOpen, close: restaurant.fridayClose },
      { name: 'Saturday', open: restaurant.saturdayOpen, close: restaurant.saturdayClose },
      { name: 'Sunday', open: restaurant.sundayOpen, close: restaurant.sundayClose },
    ];

    return days.filter(day => day.open && day.close);
  };

  const [availableTimes, setAvailableTimes] = useState<string[]>([]);
  const [loadingAvailability, setLoadingAvailability] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);

  const fetchAvailability = async (date: string, partySize: number) => {
    if (!date || !restaurant) return;
    
    setLoadingAvailability(true);
    try {
      const response = await fetch(
        `http://localhost:3001/api/restaurants/${restaurant.id}/availability?date=${date}&partySize=${partySize}`
      );
      const data = await response.json();
      
      if (data.success) {
        const times = data.data.map((slot: any) => slot.timeSlot);
        setAvailableTimes(times);
      } else {
        setAvailableTimes([]);
      }
    } catch (error) {
      console.error('Error fetching availability:', error);
      setAvailableTimes([]);
    } finally {
      setLoadingAvailability(false);
    }
  };

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to make a reservation');
      router.push('/auth/login');
      return;
    }
    
    if (!selectedDate || !selectedTime || !restaurant) {
      alert('Please select a date and time');
      return;
    }
    
    setBookingLoading(true);
    
    try {
      const response = await fetch('http://localhost:3001/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          restaurantId: restaurant.id,
          date: selectedDate,
          timeSlot: selectedTime,
          partySize: partySize,
          specialRequests: '',
          notes: '',
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert(`Reservation confirmed! You'll receive a confirmation email shortly.`);
        setShowBookingModal(false);
        setSelectedDate('');
        setSelectedTime('');
        setPartySize(2);
        setAvailableTimes([]);
      } else {
        alert(data.message || 'Failed to create reservation. Please try again.');
      }
    } catch (error) {
      console.error('Error creating reservation:', error);
      alert('Failed to create reservation. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="h-64 bg-gray-200 rounded-lg mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
              <div className="space-y-4">
                <div className="h-32 bg-gray-200 rounded"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Restaurant not found</h1>
          <button onClick={() => router.push('/restaurants')} className="btn-primary">
            Back to Restaurants
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{restaurant.name} - Afritable</title>
        <meta name="description" content={restaurant.description} />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <main>
          {/* Back Button */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <BackButton href="/restaurants" className="mb-4">
              Back to Restaurants
            </BackButton>
          </div>

          {/* Hero Section */}
          <section className="bg-white py-8 border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div className="flex-1">
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                    {restaurant.name}
                  </h1>
                  <p className="text-orange-600 font-medium text-lg mb-4">
                    {restaurant.cuisine}
                  </p>
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-yellow-500">
                        {getStarRating(restaurant.rating)}
                      </span>
                      <span className="text-gray-600">
                        {restaurant.rating.toFixed(1)} ({restaurant.reviewCount} reviews)
                      </span>
                    </div>
                    <span className="text-gray-500">•</span>
                    <span className="text-gray-600">{getPriceRange(restaurant.priceRange)}</span>
                  </div>
                  <p className="text-gray-600">
                    📍 {restaurant.address}, {restaurant.city}, {restaurant.state}
                  </p>
                </div>
                <div className="mt-6 lg:mt-0 lg:ml-8">
                  <button
                    onClick={() => setShowBookingModal(true)}
                    className="btn-primary text-lg px-8 py-4"
                  >
                    Make Reservation
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Main Content */}
          <section className="py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                  {/* Images */}
                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-gray-900">Photos</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {restaurant.photos && restaurant.photos.length > 0 ? (
                        restaurant.photos.slice(0, 4).map((photo, index) => (
                          <div key={photo.id} className="relative h-48 rounded-lg overflow-hidden">
                            <Image
                              src={photo.url}
                              alt={photo.caption || `${restaurant.name} - Photo ${index + 1}`}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ))
                      ) : (
                        <div className="col-span-2 h-64 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center">
                          <div className="text-center">
                            <span className="text-white text-4xl font-bold block mb-2">
                              {restaurant.name.charAt(0)}
                            </span>
                            <p className="text-white text-sm">No photos available</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">About</h2>
                    <p className="text-gray-600 leading-relaxed">
                      {restaurant.description || `Welcome to ${restaurant.name}, a delightful ${restaurant.cuisine} restaurant located in ${restaurant.city}, ${restaurant.state}. We offer authentic African cuisine with a warm and welcoming atmosphere. Our restaurant is committed to providing exceptional dining experiences with traditional flavors and modern presentation.`}
                    </p>
                    
                    {/* Restaurant Features */}
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Restaurant Features</h3>
                      <div className="grid grid-cols-2 gap-3">
                        {restaurant.acceptsReservations && (
                          <div className="flex items-center space-x-2">
                            <span className="text-green-500">✓</span>
                            <span className="text-gray-600">Accepts Reservations</span>
                          </div>
                        )}
                        {restaurant.hasDelivery && (
                          <div className="flex items-center space-x-2">
                            <span className="text-green-500">✓</span>
                            <span className="text-gray-600">Delivery Available</span>
                          </div>
                        )}
                        {restaurant.hasTakeout && (
                          <div className="flex items-center space-x-2">
                            <span className="text-green-500">✓</span>
                            <span className="text-gray-600">Takeout Available</span>
                          </div>
                        )}
                        {restaurant.hasOutdoorSeating && (
                          <div className="flex items-center space-x-2">
                            <span className="text-green-500">✓</span>
                            <span className="text-gray-600">Outdoor Seating</span>
                          </div>
                        )}
                        {restaurant.hasWifi && (
                          <div className="flex items-center space-x-2">
                            <span className="text-green-500">✓</span>
                            <span className="text-gray-600">Free WiFi</span>
                          </div>
                        )}
                        {restaurant.hasParking && (
                          <div className="flex items-center space-x-2">
                            <span className="text-green-500">✓</span>
                            <span className="text-gray-600">Parking Available</span>
                          </div>
                        )}
                        {restaurant.isWheelchairAccessible && (
                          <div className="flex items-center space-x-2">
                            <span className="text-green-500">✓</span>
                            <span className="text-gray-600">Wheelchair Accessible</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Menu Section */}
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Menu Highlights</h2>
                    <div className="bg-white rounded-lg p-6 border border-gray-200">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-3">Popular Dishes</h3>
                          <div className="space-y-2">
                            {getPopularDishes(restaurant.cuisine).map((dish, index) => (
                              <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                                <span className="text-gray-700">{dish.name}</span>
                                <span className="text-orange-600 font-medium">{dish.price}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-3">Cuisine Specialties</h3>
                          <div className="space-y-2">
                            {getCuisineSpecialties(restaurant.cuisine).map((specialty, index) => (
                              <div key={index} className="flex items-center space-x-2 py-2">
                                <span className="text-orange-500">🍽️</span>
                                <span className="text-gray-700">{specialty}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 p-4 bg-orange-50 rounded-lg">
                        <p className="text-sm text-orange-800">
                          <strong>Note:</strong> Menu items and prices may vary. Please contact the restaurant for the most current menu and pricing information.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Reviews */}
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Reviews & Ratings</h2>
                    <div className="bg-white rounded-lg p-6 border border-gray-200">
                      <div className="text-center mb-6">
                        <div className="text-4xl font-bold text-gray-900 mb-2">
                          {restaurant.rating.toFixed(1)}
                        </div>
                        <div className="text-yellow-500 text-2xl mb-2">
                          {getStarRating(restaurant.rating)}
                        </div>
                        <p className="text-gray-600">
                          Based on {restaurant.reviewCount} reviews
                        </p>
                      </div>
                      
                      {/* Rating Breakdown */}
                      <div className="space-y-2">
                        {[5, 4, 3, 2, 1].map((star) => (
                          <div key={star} className="flex items-center space-x-3">
                            <span className="text-sm text-gray-600 w-8">{star}★</span>
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-yellow-500 h-2 rounded-full" 
                                style={{ width: `${(star === 5 ? 0.8 : star === 4 ? 0.15 : star === 3 ? 0.03 : star === 2 ? 0.01 : 0.01) * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-sm text-gray-500 w-8">
                              {Math.round((star === 5 ? 0.8 : star === 4 ? 0.15 : star === 3 ? 0.03 : star === 2 ? 0.01 : 0.01) * restaurant.reviewCount)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                      {/* Similar Restaurants */}
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Similar Restaurants</h2>
                        {loadingSimilar ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {[...Array(3)].map((_, index) => (
                              <div key={index} className="bg-white rounded-lg p-4 border border-gray-200 animate-pulse">
                                <div className="flex items-center space-x-3">
                                  <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                                  <div className="flex-1">
                                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                                    <div className="h-3 bg-gray-200 rounded w-2/3 mb-1"></div>
                                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : similarRestaurants.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {similarRestaurants.map((similarRestaurant) => (
                              <div 
                                key={similarRestaurant.id} 
                                className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow duration-200 cursor-pointer"
                                onClick={() => router.push(`/restaurants/${similarRestaurant.id}`)}
                              >
                                <div className="flex items-center space-x-3">
                                  <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center overflow-hidden">
                                    {similarRestaurant.photos && similarRestaurant.photos.length > 0 ? (
                                      <img 
                                        src={similarRestaurant.photos[0].url} 
                                        alt={similarRestaurant.name}
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      <span className="text-white font-bold text-lg">
                                        {similarRestaurant.name.charAt(0)}
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex-1">
                                    <h4 className="font-semibold text-gray-900 text-sm hover:text-orange-600 transition-colors">
                                      {similarRestaurant.name}
                                    </h4>
                                    <p className="text-gray-600 text-xs">{similarRestaurant.cuisine}</p>
                                    <p className="text-gray-500 text-xs">{similarRestaurant.city}, {similarRestaurant.state}</p>
                                    <div className="flex items-center space-x-1 mt-1">
                                      <span className="text-yellow-500 text-xs">
                                        {getStarRating(similarRestaurant.rating)}
                                      </span>
                                      <span className="text-gray-500 text-xs">
                                        {similarRestaurant.rating.toFixed(1)} ({similarRestaurant.reviewCount})
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <div className="text-4xl mb-4">🍽️</div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Similar Restaurants Found</h3>
                            <p className="text-gray-600 mb-4">
                              We couldn't find similar restaurants in your area.
                            </p>
                            <button
                              onClick={() => router.push('/restaurants')}
                              className="btn-primary"
                            >
                              Browse All Restaurants
                            </button>
                          </div>
                        )}
                      </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Contact Info */}
                  <div className="card">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Contact Information</h3>
                    <div className="space-y-4">
                      {/* Phone Number - Most Important */}
                      {restaurant.phone ? (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <div className="flex items-center space-x-3">
                            <span className="text-green-600 text-xl">📞</span>
                            <div>
                              <p className="text-sm font-medium text-green-800">Call for Reservations</p>
                              <a href={`tel:${restaurant.phone}`} className="text-lg font-bold text-green-700 hover:text-green-800">
                                {restaurant.phone}
                              </a>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center space-x-3">
                            <span className="text-gray-500 text-xl">📞</span>
                            <div>
                              <p className="text-sm font-medium text-gray-600">Phone Number</p>
                              <p className="text-gray-500">Not available - Please check website</p>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Address */}
                      <div className="flex items-start space-x-3">
                        <span className="text-gray-500 mt-1">📍</span>
                        <div>
                          <p className="text-gray-600 text-sm">
                            {restaurant.address}
                          </p>
                          <p className="text-gray-600 text-sm">
                            {restaurant.city}, {restaurant.state}
                          </p>
                        </div>
                      </div>
                      
                      {restaurant.website ? (
                        <div className="flex items-center space-x-3">
                          <span className="text-gray-500">🌐</span>
                          <a 
                            href={restaurant.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-orange-600 hover:text-orange-700"
                          >
                            Visit Website
                          </a>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-3">
                          <span className="text-gray-500">🌐</span>
                          <span className="text-gray-400">Website not available</span>
                        </div>
                      )}
                      
                      {restaurant.email ? (
                        <div className="flex items-center space-x-3">
                          <span className="text-gray-500">✉️</span>
                          <a href={`mailto:${restaurant.email}`} className="text-orange-600 hover:text-orange-700">
                            {restaurant.email}
                          </a>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-3">
                          <span className="text-gray-500">✉️</span>
                          <span className="text-gray-400">Email not available</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Hours */}
                  <div className="card">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Hours of Operation</h3>
                    <div className="space-y-2">
                      {getOperatingHours().length > 0 ? (
                        <>
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                            <div className="flex items-center space-x-2">
                              <span className="text-blue-600">🕒</span>
                              <span className="text-sm font-medium text-blue-800">Current Hours</span>
                            </div>
                          </div>
                          {getOperatingHours().map((day, index) => (
                            <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                              <span className="text-gray-700 font-medium">{day.name}</span>
                              <span className="text-gray-900 font-semibold">
                                {day.open} - {day.close}
                              </span>
                            </div>
                          ))}
                        </>
                      ) : (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                          <div className="flex items-center justify-center space-x-2 mb-2">
                            <span className="text-yellow-600">⚠️</span>
                            <span className="text-yellow-800 font-medium">Hours Not Available</span>
                          </div>
                          <p className="text-sm text-yellow-700 mb-2">
                            Please call the restaurant for current hours
                          </p>
                          {restaurant.phone && (
                            <a 
                              href={`tel:${restaurant.phone}`}
                              className="inline-flex items-center space-x-1 text-yellow-800 hover:text-yellow-900 font-medium"
                            >
                              <span>📞</span>
                              <span>Call {restaurant.phone}</span>
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Location & Directions */}
                  <div className="card">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Location & Directions</h3>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <span className="text-gray-500 mt-1">📍</span>
                        <div>
                          <p className="text-gray-600 text-sm">
                            {restaurant.address}
                          </p>
                          <p className="text-gray-600 text-sm">
                            {restaurant.city}, {restaurant.state}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => {
                            const address = encodeURIComponent(`${restaurant.address}, ${restaurant.city}, ${restaurant.state}`);
                            window.open(`https://www.google.com/maps/search/?api=1&query=${address}`, '_blank');
                          }}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 px-3 rounded-lg transition-colors duration-200"
                        >
                          📍 Get Directions
                        </button>
                        <button 
                          onClick={() => {
                            const address = encodeURIComponent(`${restaurant.address}, ${restaurant.city}, ${restaurant.state}`);
                            window.open(`https://www.google.com/maps/dir/?api=1&destination=${address}`, '_blank');
                          }}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm py-2 px-3 rounded-lg transition-colors duration-200"
                        >
                          🚗 Navigate
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Tips & Recommendations */}
                  <div className="card">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Tips & Recommendations</h3>
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <span className="text-orange-500 mt-1">💡</span>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Best Time to Visit</p>
                          <p className="text-xs text-gray-600">Weekday evenings are usually less crowded</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <span className="text-orange-500 mt-1">🍽️</span>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Must-Try Dish</p>
                          <p className="text-xs text-gray-600">{getMustTryDish(restaurant.cuisine)}</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <span className="text-orange-500 mt-1">👥</span>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Group Size</p>
                          <p className="text-xs text-gray-600">Perfect for groups of 2-6 people</p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <span className="text-orange-500 mt-1">⏰</span>
                        <div>
                          <p className="text-sm font-medium text-gray-900">Dining Time</p>
                          <p className="text-xs text-gray-600">Allow 1.5-2 hours for full experience</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="card">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                      <button 
                        onClick={() => setShowBookingModal(true)}
                        className="w-full btn-primary"
                      >
                        Make Reservation
                      </button>
                      <button 
                        onClick={() => {
                          // Add to favorites functionality
                          const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
                          if (!favorites.includes(restaurant.id)) {
                            favorites.push(restaurant.id);
                            localStorage.setItem('favorites', JSON.stringify(favorites));
                            alert('Added to favorites!');
                          } else {
                            alert('Already in favorites!');
                          }
                        }}
                        className="w-full btn-secondary"
                      >
                        Add to Favorites
                      </button>
                      <button 
                        onClick={() => {
                          // Share restaurant functionality
                          if (navigator.share) {
                            navigator.share({
                              title: restaurant.name,
                              text: `Check out ${restaurant.name} - ${restaurant.cuisine} restaurant in ${restaurant.city}`,
                              url: window.location.href,
                            });
                          } else {
                            // Fallback: copy to clipboard
                            navigator.clipboard.writeText(window.location.href);
                            alert('Restaurant link copied to clipboard!');
                          }
                        }}
                        className="w-full btn-secondary"
                      >
                        Share Restaurant
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
        
        <Footer />

        {/* Booking Modal */}
        {showBookingModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Make a Reservation</h2>
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleBooking} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time
                  </label>
                  {loadingAvailability ? (
                    <div className="input-field flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500"></div>
                      <span className="ml-2 text-gray-500">Loading available times...</span>
                    </div>
                  ) : (
                    <select
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      className="input-field"
                      required
                      disabled={!selectedDate || availableTimes.length === 0}
                    >
                      <option value="">
                        {!selectedDate 
                          ? "Select a date first" 
                          : availableTimes.length === 0 
                            ? "No available times" 
                            : "Select time"
                        }
                      </option>
                      {availableTimes.map((time) => (
                        <option key={time} value={time}>
                          {new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true
                          })}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Party Size
                  </label>
                  <select
                    value={partySize}
                    onChange={(e) => setPartySize(Number(e.target.value))}
                    className="input-field"
                    required
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((size) => (
                      <option key={size} value={size}>
                        {size} {size === 1 ? 'Guest' : 'Guests'}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowBookingModal(false)}
                    className="flex-1 btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 btn-primary"
                    disabled={bookingLoading || !selectedDate || !selectedTime}
                  >
                    {bookingLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Booking...
                      </div>
                    ) : (
                      'Book Table'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default RestaurantDetailPage;
