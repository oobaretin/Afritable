import React, { useState, useEffect } from 'react';
import Link from 'next/link';
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
  priceRange: string;
  photos?: Array<{
    id: string;
    url: string;
    isPrimary: boolean;
  }>;
}

const FeaturedRestaurants: React.FC = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);

  // Static data as fallback
  const staticRestaurants: Restaurant[] = [
    {
      id: '1',
      name: 'Marrakech Moroccan Restaurant',
      description: 'Experience the flavors of Morocco with tagines, couscous, and mint tea.',
      cuisine: 'Moroccan,North African',
      city: 'Houston',
      state: 'TX',
      rating: 4.7,
      reviewCount: 203,
      priceRange: 'EXPENSIVE',
      photos: [{
        id: '1',
        url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400',
        isPrimary: true
      }]
    },
    {
      id: '2',
      name: 'Addis Ababa Restaurant',
      description: 'Authentic Ethiopian cuisine with traditional injera and flavorful stews.',
      cuisine: 'Ethiopian,African',
      city: 'Houston',
      state: 'TX',
      rating: 4.5,
      reviewCount: 127,
      priceRange: 'MODERATE',
      photos: [{
        id: '2',
        url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400',
        isPrimary: true
      }]
    },
    {
      id: '3',
      name: 'Nigerian Kitchen',
      description: 'Traditional Nigerian dishes including jollof rice, egusi soup, and suya.',
      cuisine: 'Nigerian,West African',
      city: 'Houston',
      state: 'TX',
      rating: 4.3,
      reviewCount: 89,
      priceRange: 'MODERATE',
      photos: [{
        id: '3',
        url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400',
        isPrimary: true
      }]
    }
  ];

  useEffect(() => {
    const fetchRestaurants = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:3001/api/restaurants?limit=6');
        const data = await response.json();
        if (data.success && data.data.length > 0) {
          setRestaurants(data.data);
        } else {
          // Fallback to static data if API fails
          setRestaurants(staticRestaurants);
        }
      } catch (error) {
        console.error('Error fetching restaurants:', error);
        // Fallback to static data if API fails
        setRestaurants(staticRestaurants);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

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

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured African Restaurants
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover the best African cuisine in your area
            </p>
          </div>
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
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Featured African Restaurants
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover the best African cuisine in your area
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {restaurants && restaurants.length > 0 ? restaurants.map((restaurant) => (
            <Link key={restaurant.id} href={`/restaurants/${restaurant.id}`}>
              <div className="card hover:shadow-lg transition-shadow duration-300 cursor-pointer group">
                <div className="relative h-48 mb-4 overflow-hidden rounded-lg">
                  {restaurant.photos && restaurant.photos.length > 0 ? (
                    <Image
                      src={restaurant.photos[0].url}
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

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-yellow-500 text-sm">
                        {getStarRating(restaurant.rating)}
                      </span>
                      <span className="text-sm text-gray-600">
                        {restaurant.rating.toFixed(1)} ({restaurant.reviewCount} reviews)
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {restaurant.city}, {restaurant.state}
                    </span>
                  </div>

                  <button className="w-full btn-primary mt-4">
                    View Details
                  </button>
                </div>
              </div>
            </Link>
          )) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg">No restaurants found</p>
            </div>
          )}
        </div>

        <div className="text-center mt-12">
          <Link href="/restaurants">
            <button className="btn-secondary">
              View All Restaurants
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedRestaurants;
