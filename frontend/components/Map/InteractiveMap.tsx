import React, { useEffect, useRef, useState } from 'react';
import { Restaurant } from '../../types/restaurant';

interface InteractiveMapProps {
  restaurants: Restaurant[];
  selectedRestaurant?: Restaurant | null;
  onRestaurantSelect?: (restaurant: Restaurant) => void;
  center?: { lat: number; lng: number };
  zoom?: number;
  className?: string;
}

declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({
  restaurants,
  selectedRestaurant,
  onRestaurantSelect,
  center = { lat: 39.8283, lng: -98.5795 }, // Center of US
  zoom = 4,
  className = ''
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load Google Maps API
  useEffect(() => {
    const loadGoogleMaps = () => {
      if (window.google) {
        setIsLoaded(true);
        return;
      }

      // Check if API key is available
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
      if (!apiKey || apiKey === 'your-google-maps-api-key') {
        setError('Google Maps API key not configured');
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => setIsLoaded(true);
      script.onerror = () => setError('Failed to load Google Maps');
      document.head.appendChild(script);
    };

    loadGoogleMaps();
  }, []);

  // Initialize map
  useEffect(() => {
    if (!isLoaded || !mapRef.current || mapInstanceRef.current) return;

    try {
      mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
        center,
        zoom,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ],
        mapTypeControl: true,
        streetViewControl: false,
        fullscreenControl: true,
        zoomControl: true
      });

      // Add markers for restaurants
      addRestaurantMarkers();
    } catch (err) {
      setError('Failed to initialize map');
      console.error('Map initialization error:', err);
    }
  }, [isLoaded, center, zoom]);

  // Update markers when restaurants change
  useEffect(() => {
    if (mapInstanceRef.current && restaurants.length > 0) {
      clearMarkers();
      addRestaurantMarkers();
    }
  }, [restaurants]);

  // Update selected restaurant marker
  useEffect(() => {
    if (selectedRestaurant && mapInstanceRef.current) {
      const restaurant = restaurants.find(r => r.id === selectedRestaurant.id);
      if (restaurant) {
        mapInstanceRef.current.setCenter({
          lat: restaurant.latitude || center.lat,
          lng: restaurant.longitude || center.lng
        });
        mapInstanceRef.current.setZoom(15);
      }
    }
  }, [selectedRestaurant]);

  const clearMarkers = () => {
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];
  };

  const addRestaurantMarkers = () => {
    if (!mapInstanceRef.current || !restaurants.length) return;

    restaurants.forEach((restaurant) => {
      if (!restaurant.latitude || !restaurant.longitude) return;

      const marker = new window.google.maps.Marker({
        position: {
          lat: restaurant.latitude,
          lng: restaurant.longitude
        },
        map: mapInstanceRef.current,
        title: restaurant.name,
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="12" fill="#f97316" stroke="#fff" stroke-width="2"/>
              <path d="M12 10h8v2h-8v-2zm0 4h8v2h-8v-2zm0 4h6v2h-6v-2z" fill="#fff"/>
            </svg>
          `),
          scaledSize: new window.google.maps.Size(32, 32),
          anchor: new window.google.maps.Point(16, 16)
        }
      });

      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="padding: 8px; max-width: 250px;">
            <h3 style="margin: 0 0 8px 0; color: #f97316; font-size: 16px;">${restaurant.name}</h3>
            <p style="margin: 0 0 4px 0; color: #666; font-size: 12px;">${restaurant.cuisine}</p>
            <p style="margin: 0 0 4px 0; color: #333; font-size: 12px;">${restaurant.address}</p>
            ${restaurant.phone ? `<p style="margin: 0 0 4px 0; color: #333; font-size: 12px;">📞 ${restaurant.phone}</p>` : ''}
            <div style="margin-top: 8px;">
              <span style="background: #f97316; color: white; padding: 2px 6px; border-radius: 4px; font-size: 10px;">
                ⭐ ${restaurant.rating?.toFixed(1) || 'N/A'}
              </span>
            </div>
          </div>
        `
      });

      marker.addListener('click', () => {
        infoWindow.open(mapInstanceRef.current, marker);
        if (onRestaurantSelect) {
          onRestaurantSelect(restaurant);
        }
      });

      markersRef.current.push(marker);
    });
  };

  if (error) {
    return (
      <div className={`bg-gray-100 rounded-lg p-8 text-center ${className}`}>
        <div className="text-gray-500 mb-4">
          <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Map Unavailable</h3>
        <p className="text-gray-500">{error}</p>
      </div>
    );
  }

  // Show error state if Google Maps failed to load
  if (error) {
    return (
      <div className={`w-full h-full flex items-center justify-center bg-gray-100 rounded-lg ${className}`}>
        <div className="text-center p-8">
          <div className="text-4xl mb-4">🗺️</div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Map Unavailable</h3>
          <p className="text-gray-500 text-sm mb-4">
            {error === 'Google Maps API key not configured' 
              ? 'Google Maps API key not configured. Please contact support.'
              : 'Unable to load map. Please try again later.'
            }
          </p>
          <div className="text-xs text-gray-400">
            Showing {restaurants.length} restaurants in list view
          </div>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className={`bg-gray-100 rounded-lg p-8 text-center ${className}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading map...</p>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <div 
        ref={mapRef} 
        className="w-full h-full rounded-lg shadow-lg"
        style={{ minHeight: '400px' }}
      />
      
      {/* Map Controls */}
      <div className="absolute top-4 right-4 bg-white rounded-lg shadow-md p-2">
        <div className="text-xs text-gray-600 mb-1">Restaurants</div>
        <div className="text-sm font-semibold text-orange-600">{restaurants.length}</div>
      </div>
    </div>
  );
};

export default InteractiveMap;
