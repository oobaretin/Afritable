'use client';

import { Restaurant } from '@/types/restaurant';
import { StarIcon, MapPinIcon, ClockIcon } from '@heroicons/react/24/solid';
import { getPriceRangeSymbol, calculateDistance } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface RestaurantCardProps {
  restaurant: Restaurant;
  showDistance?: boolean;
  userLocation?: { lat: number; lng: number };
}

export function RestaurantCard({ 
  restaurant, 
  showDistance = false, 
  userLocation 
}: RestaurantCardProps) {
  const router = useRouter();

  const handleBookNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/restaurants/${restaurant.id}/book`);
  };

  const handleCardClick = () => {
    router.push(`/restaurants/${restaurant.id}`);
  };

  const primaryPhoto = restaurant.photos?.find(photo => photo.isPrimary) || restaurant.photos?.[0];
  const distance = showDistance && userLocation 
    ? calculateDistance(userLocation.lat, userLocation.lng, restaurant.latitude, restaurant.longitude)
    : null;

  return (
    <div 
      className="card-hover cursor-pointer group"
      onClick={handleCardClick}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden rounded-t-lg">
        {primaryPhoto ? (
          <Image
            src={primaryPhoto.url}
            alt={restaurant.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400 text-sm">No image available</span>
          </div>
        )}
        
        {/* Rating Badge */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1">
          <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
          <span className="text-sm font-semibold text-gray-900">
            {restaurant.rating.toFixed(1)}
          </span>
        </div>

        {/* Price Range Badge */}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1">
          <span className="text-sm font-semibold text-gray-900">
            {getPriceRangeSymbol(restaurant.priceRange)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="mb-3">
          <h3 className="text-xl font-semibold text-gray-900 mb-1 group-hover:text-primary-600 transition-colors">
            {restaurant.name}
          </h3>
          
          <div className="flex items-center text-gray-600 text-sm mb-2">
            <MapPinIcon className="h-4 w-4 mr-1" />
            <span>{restaurant.city}, {restaurant.state}</span>
            {distance && (
              <span className="ml-2 text-gray-500">• {distance} mi</span>
            )}
          </div>

          <div className="flex items-center text-gray-600 text-sm">
            <ClockIcon className="h-4 w-4 mr-1" />
            <span>{restaurant.reviewCount} reviews</span>
          </div>
        </div>

        {/* Cuisine Tags */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {restaurant.cuisine.slice(0, 2).map((cuisine) => (
              <span
                key={cuisine}
                className="inline-block bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded-full"
              >
                {cuisine}
              </span>
            ))}
            {restaurant.cuisine.length > 2 && (
              <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                +{restaurant.cuisine.length - 2} more
              </span>
            )}
          </div>
        </div>

        {/* Features */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2 text-xs text-gray-500">
            {restaurant.hasDelivery && (
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded">Delivery</span>
            )}
            {restaurant.hasTakeout && (
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">Takeout</span>
            )}
            {restaurant.hasOutdoorSeating && (
              <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Outdoor</span>
            )}
            {restaurant.isWheelchairAccessible && (
              <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">Accessible</span>
            )}
          </div>
        </div>

        {/* Action Button */}
        <Button
          onClick={handleBookNow}
          className="w-full bg-primary-600 hover:bg-primary-700"
          disabled={!restaurant.acceptsReservations}
        >
          {restaurant.acceptsReservations ? 'Book Now' : 'View Details'}
        </Button>
      </div>
    </div>
  );
}
