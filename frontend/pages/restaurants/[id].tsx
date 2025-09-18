import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Header from '../../components/Layout/Header';
import Footer from '../../components/Layout/Footer';
import BackButton from '../../components/ui/BackButton';
import Image from 'next/image';

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
  mainImage?: string;
  images: string[];
  priceRange: string;
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
    }
  }, [id]);

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

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement booking logic
    alert('Booking functionality coming soon!');
    setShowBookingModal(false);
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
                      {restaurant.images && restaurant.images.length > 0 ? (
                        restaurant.images.slice(0, 4).map((image, index) => (
                          <div key={index} className="relative h-48 rounded-lg overflow-hidden">
                            <Image
                              src={image}
                              alt={`${restaurant.name} - Photo ${index + 1}`}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ))
                      ) : (
                        <div className="col-span-2 h-64 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center">
                          <span className="text-white text-4xl font-bold">
                            {restaurant.name.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">About</h2>
                    <p className="text-gray-600 leading-relaxed">
                      {restaurant.description}
                    </p>
                  </div>

                  {/* Reviews */}
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Reviews</h2>
                    <div className="bg-white rounded-lg p-6 border border-gray-200">
                      <div className="text-center">
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
                    </div>
                  </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Contact Info */}
                  <div className="card">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Contact Information</h3>
                    <div className="space-y-3">
                      {restaurant.phone && (
                        <div className="flex items-center space-x-3">
                          <span className="text-gray-500">📞</span>
                          <a href={`tel:${restaurant.phone}`} className="text-orange-600 hover:text-orange-700">
                            {restaurant.phone}
                          </a>
                        </div>
                      )}
                      {restaurant.website && (
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
                      )}
                      {restaurant.email && (
                        <div className="flex items-center space-x-3">
                          <span className="text-gray-500">✉️</span>
                          <a href={`mailto:${restaurant.email}`} className="text-orange-600 hover:text-orange-700">
                            {restaurant.email}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Hours */}
                  <div className="card">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Hours</h3>
                    <div className="space-y-2">
                      {getOperatingHours().map((day, index) => (
                        <div key={index} className="flex justify-between">
                          <span className="text-gray-600">{day.name}</span>
                          <span className="text-gray-900">
                            {day.open} - {day.close}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="card">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                      <button className="w-full btn-primary">
                        Make Reservation
                      </button>
                      <button className="w-full btn-secondary">
                        Add to Favorites
                      </button>
                      <button className="w-full btn-secondary">
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
                  <select
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="input-field"
                    required
                  >
                    <option value="">Select time</option>
                    <option value="17:00">5:00 PM</option>
                    <option value="17:30">5:30 PM</option>
                    <option value="18:00">6:00 PM</option>
                    <option value="18:30">6:30 PM</option>
                    <option value="19:00">7:00 PM</option>
                    <option value="19:30">7:30 PM</option>
                    <option value="20:00">8:00 PM</option>
                    <option value="20:30">8:30 PM</option>
                    <option value="21:00">9:00 PM</option>
                  </select>
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
                  >
                    Book Table
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
