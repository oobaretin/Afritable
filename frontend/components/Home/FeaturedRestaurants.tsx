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

  // Static data as fallback - Top performing African restaurants
  const staticRestaurants: Restaurant[] = [
    {
      id: 'cmfotdsf5002f8x2w2x3vk1b6',
      name: 'Hastes African market',
      description: 'Experience authentic African cuisine with traditional dishes and warm hospitality in Houston.',
      cuisine: 'African',
      city: 'Houston',
      state: 'TX',
      rating: 5.0,
      reviewCount: 7,
      priceRange: 'EXPENSIVE',
      photos: [{
        id: 'cmfslgo69002jbaiqie4t6al2',
        url: 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=AciIO2fVx7IEALNJKqQWxA1WNS5T3JDoKlzDk-cA48iLZUKZ-OluAtW8K5S846g36yDyQHKpVqu5VPri_SpfD3ayYj5dkahlQpklXyzim6qPzxLCNfI59AJsN32rGHR-zaenh8MyWsL8NfZ0z4ePwqJy0UMh8Iw_Yqbq9_KWc9mrD9XYRp-p-6e5VGkg3Gk45Y5o3Vp6iynFXDhyNgOKBB2NgBFX-BviRneI88d_DW1lfoFEv9RtO1bR5lSi4qz73jp6Wxp1Zi-ZUKDUr-edICV6qYveJg9X5fYnB9B0W6ThtrhZGw&key=AIzaSyBgxe92qPzMXUl0vefNRILvbQZxOV-FgOU',
        isPrimary: true
      }]
    },
    {
      id: 'cmfotdsih003u8x2wn9ph5tcg',
      name: 'Linking Park',
      description: 'Authentic African cuisine featuring traditional dishes and warm hospitality in Houston.',
      cuisine: 'African',
      city: 'Houston',
      state: 'TX',
      rating: 5.0,
      reviewCount: 16,
      priceRange: 'MODERATE',
      photos: [{
        id: 'cmfslh7go0053baiqfjanjf3g',
        url: 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=AciIO2f40AoTWZVmkd2NBklkVbUYgpb7YlyeikOccliCdRz4kANe6Gl41CxxsQMFllDZo6faSBWsCwgq7cRZD9hJoPZLBd-3HT5TYUJlqshbeC0v_BaQO-GmUS1G1RlNp1SY3cT_wg083S-3cPmUXj0rqQDZTBuQcMfRDFdyiH1p510-x1Mtnj5bc1MjUgmKeAI4FY3dwSLvJTKwkA0IEQ8w37HGrtoNcrVHWQ7SXh-Sr4QQpNbeNefkkvCnNlOnS1CTWUHrGoqUOLcbuNc-nHoLYKX0R9KRDO4ugEGzkyYOyJ5DpQ&key=AIzaSyBgxe92qPzMXUl0vefNRILvbQZxOV-FgOU',
        isPrimary: true
      }]
    },
    {
      id: 'cmfotdsjg00498x2wrbx3qtw0',
      name: 'The Motherland restaurant & Grill',
      description: 'Traditional African dishes with authentic flavors and warm hospitality in Houston.',
      cuisine: 'African',
      city: 'Houston',
      state: 'TX',
      rating: 5.0,
      reviewCount: 2,
      priceRange: 'MODERATE',
      photos: [{
        id: 'cmfslhe3i005xbaiqepnq707o',
        url: 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=AciIO2eM0qqTur1L4P5Bj-U9fB9W1-0u2ZWQkMNxj2hQWM2meb0b0Fdkd7FdIjKxpzaWpsLAqGqM4tAz2AAJaQc7JxoQPHRAY4qimdATN9Zn1PiDp3Nwhf5zGm0VQFIXemLe-2xJX634zU95MA2xovf2R0BQcqSXloF19muwBRydOnpf_mcBjwT32m0GXkVefdJaNetcmSyDYWmxbcDc0y5x7rNYb6Zn3CzAdqBzODzrwgkNpd_DRhoTz5BpPhmTFnF8xiby-Q5HdZ498jfwIGavGistTHX9R1RxHjk2t9kRvQkzdA&key=AIzaSyBgxe92qPzMXUl0vefNRILvbQZxOV-FgOU',
        isPrimary: true
      }]
    }
  ];

  useEffect(() => {
    const fetchFeaturedRestaurants = async () => {
      setLoading(true);
      try {
        // Fetch top-rated restaurants with good review counts
        const response = await fetch('http://localhost:3001/api/restaurants?limit=20&minRating=4.0');
        const data = await response.json();
        
        if (data.success && data.data && data.data.length > 0) {
          // Sort by rating and review count to get the best performers
          const sortedRestaurants = data.data
            .filter((restaurant: Restaurant) => restaurant.rating >= 4.0 && restaurant.reviewCount >= 1)
            .sort((a: Restaurant, b: Restaurant) => {
              // Sort by rating first, then by review count
              if (b.rating !== a.rating) {
                return b.rating - a.rating;
              }
              return b.reviewCount - a.reviewCount;
            })
            .slice(0, 3); // Take top 3 performers
          
          setRestaurants(sortedRestaurants);
        } else {
          // Fallback to static data if API fails
          setRestaurants(staticRestaurants);
        }
      } catch (error) {
        console.error('Error fetching featured restaurants:', error);
        // Fallback to static data if API fails
        setRestaurants(staticRestaurants);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedRestaurants();
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[...Array(3)].map((_, i) => (
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
            Top-Rated African Restaurants
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover our highest-rated African restaurants based on customer reviews and ratings
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
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
                  <div className="absolute top-3 left-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-3 py-1 rounded-full">
                    <span className="text-xs font-bold">
                      ⭐ FEATURED
                    </span>
                  </div>
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
