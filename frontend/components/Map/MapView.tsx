import React, { useState, useEffect } from 'react';
import InteractiveMap from './InteractiveMap';
import { Restaurant } from '../../types/restaurant';

interface MapViewProps {
  restaurants: Restaurant[];
  selectedRestaurant?: Restaurant | null;
  onRestaurantSelect?: (restaurant: Restaurant) => void;
  className?: string;
}

const MapView: React.FC<MapViewProps> = ({
  restaurants,
  selectedRestaurant,
  onRestaurantSelect,
  className = ''
}) => {
  const [mapCenter, setMapCenter] = useState({ lat: 39.8283, lng: -98.5795 });
  const [mapZoom, setMapZoom] = useState(4);

  // Calculate center based on restaurants
  useEffect(() => {
    if (restaurants.length > 0) {
      const validRestaurants = restaurants.filter(r => r.latitude && r.longitude);
      
      if (validRestaurants.length > 0) {
        const avgLat = validRestaurants.reduce((sum, r) => sum + (r.latitude || 0), 0) / validRestaurants.length;
        const avgLng = validRestaurants.reduce((sum, r) => sum + (r.longitude || 0), 0) / validRestaurants.length;
        
        setMapCenter({ lat: avgLat, lng: avgLng });
        setMapZoom(validRestaurants.length > 50 ? 4 : validRestaurants.length > 20 ? 6 : 8);
      }
    }
  }, [restaurants]);

  const handleRestaurantSelect = (restaurant: Restaurant) => {
    if (onRestaurantSelect) {
      onRestaurantSelect(restaurant);
    }
  };

  return (
    <div className={`bg-white rounded-2xl shadow-lg overflow-hidden ${className}`}>
      {/* Map Header */}
      <div className="bg-gradient-to-r from-orange-600 to-amber-600 text-white p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Restaurant Map</h2>
            <p className="text-orange-100 text-sm">
              {restaurants.length} African restaurants across the US
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{restaurants.length}</div>
            <div className="text-orange-100 text-xs">Locations</div>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="p-4">
        <InteractiveMap
          restaurants={restaurants}
          selectedRestaurant={selectedRestaurant}
          onRestaurantSelect={handleRestaurantSelect}
          center={mapCenter}
          zoom={mapZoom}
          className="h-96"
        />
      </div>

      {/* Map Legend */}
      <div className="px-4 pb-4">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
              <span>African Restaurants</span>
            </div>
          </div>
          <div className="text-xs">
            Click markers for details
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapView;
