import axios from 'axios';
import { logger } from '../utils/logger';
import { prisma } from '../db';

interface ApiResponse {
  success: boolean;
  data?: any;
  error?: string;
}

interface RestaurantData {
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  latitude: number;
  longitude: number;
  phone?: string;
  website?: string;
  rating?: number;
  reviewCount?: number;
  priceRange?: string;
  cuisine?: string;
  photos?: string[];
  placeId?: string;
  businessId?: string;
  foursquareId?: string;
}

class ApiIntegrations {
  private googleApiKey: string;
  private yelpApiKey: string;
  private foursquareApiKey: string;

  constructor() {
    this.googleApiKey = process.env.GOOGLE_PLACES_API_KEY || '';
    this.yelpApiKey = process.env.YELP_API_KEY || '';
    this.foursquareApiKey = process.env.FOURSQUARE_API_KEY || '';
  }

  // Track API usage
  private async trackApiUsage(apiName: string, endpoint: string): Promise<void> {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      await prisma.apiUsage.upsert({
        where: {
          apiName_endpoint_date: {
            apiName,
            endpoint,
            date: today,
          },
        },
        update: {
          requests: {
            increment: 1,
          },
        },
        create: {
          apiName,
          endpoint,
          requests: 1,
          date: today,
        },
      });
    } catch (error) {
      logger.error('Error tracking API usage:', error);
    }
  }

  // Check if API has reached daily limit
  private async checkApiLimit(apiName: string, endpoint: string): Promise<boolean> {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const usage = await prisma.apiUsage.findUnique({
        where: {
          apiName_endpoint_date: {
            apiName,
            endpoint,
            date: today,
          },
        },
      });

      const limits = {
        google: parseInt(process.env.GOOGLE_PLACES_DAILY_LIMIT || '1000'),
        yelp: parseInt(process.env.YELP_DAILY_LIMIT || '5000'),
        foursquare: parseInt(process.env.FOURSQUARE_DAILY_LIMIT || '1000'),
      };

      const currentUsage = usage?.requests || 0;
      const limit = limits[apiName as keyof typeof limits] || 1000;

      return currentUsage < limit;
    } catch (error) {
      logger.error('Error checking API limit:', error);
      return true; // Allow request if we can't check
    }
  }

  // Google Places API integration
  async searchGooglePlaces(query: string, location: string, radius: number = 50000): Promise<ApiResponse> {
    try {
      if (!this.googleApiKey) {
        return { success: false, error: 'Google Places API key not configured' };
      }

      const canMakeRequest = await this.checkApiLimit('google', 'text-search');
      if (!canMakeRequest) {
        return { success: false, error: 'Google Places API daily limit reached' };
      }

      const response = await axios.get('https://maps.googleapis.com/maps/api/place/textsearch/json', {
        params: {
          query,
          location,
          radius,
          key: this.googleApiKey,
          type: 'restaurant',
        },
      });

      await this.trackApiUsage('google', 'text-search');

      if (response.data.status === 'OK') {
        const restaurants = response.data.results.map((place: any) => ({
          name: place.name,
          address: place.formatted_address,
          city: this.extractCityFromAddress(place.formatted_address),
          state: this.extractStateFromAddress(place.formatted_address),
          zipCode: this.extractZipFromAddress(place.formatted_address),
          latitude: place.geometry.location.lat,
          longitude: place.geometry.location.lng,
          phone: place.formatted_phone_number,
          website: place.website,
          rating: place.rating,
          reviewCount: place.user_ratings_total,
          priceRange: this.mapGooglePriceLevel(place.price_level),
          placeId: place.place_id,
          photos: place.photos?.map((photo: any) => 
            `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=${this.googleApiKey}`
          ) || [],
          cuisine: 'African',
        }));

        return { success: true, data: restaurants };
      } else {
        return { success: false, error: response.data.error_message || 'Google Places API error' };
      }
    } catch (error) {
      logger.error('Google Places API error:', error);
      return { success: false, error: 'Failed to fetch data from Google Places' };
    }
  }

  // Yelp Fusion API integration
  async searchYelpBusinesses(term: string, location: string, limit: number = 50): Promise<ApiResponse> {
    try {
      if (!this.yelpApiKey) {
        return { success: false, error: 'Yelp API key not configured' };
      }

      const canMakeRequest = await this.checkApiLimit('yelp', 'business-search');
      if (!canMakeRequest) {
        return { success: false, error: 'Yelp API daily limit reached' };
      }

      const response = await axios.get('https://api.yelp.com/v3/businesses/search', {
        headers: {
          Authorization: `Bearer ${this.yelpApiKey}`,
        },
        params: {
          term,
          location,
          limit,
          categories: 'restaurants',
        },
      });

      await this.trackApiUsage('yelp', 'business-search');

      const restaurants = response.data.businesses.map((business: any) => ({
        name: business.name,
        address: business.location.address1,
        city: business.location.city,
        state: business.location.state,
        zipCode: business.location.zip_code,
        latitude: business.coordinates.latitude,
        longitude: business.coordinates.longitude,
        phone: business.display_phone,
        website: business.url,
        rating: business.rating,
        reviewCount: business.review_count,
        priceRange: business.price || 'MODERATE',
        businessId: business.id,
        photos: business.image_url ? [business.image_url] : [],
        cuisine: business.categories?.map((cat: any) => cat.title).join(',') || 'African',
      }));

      return { success: true, data: restaurants };
    } catch (error) {
      logger.error('Yelp API error:', error);
      return { success: false, error: 'Failed to fetch data from Yelp' };
    }
  }

  // Foursquare Places API integration
  async searchFoursquarePlaces(query: string, location: string, radius: number = 50000): Promise<ApiResponse> {
    try {
      if (!this.foursquareApiKey) {
        return { success: false, error: 'Foursquare API key not configured' };
      }

      const canMakeRequest = await this.checkApiLimit('foursquare', 'places-search');
      if (!canMakeRequest) {
        return { success: false, error: 'Foursquare API daily limit reached' };
      }

      const response = await axios.get('https://api.foursquare.com/v3/places/search', {
        headers: {
          Authorization: this.foursquareApiKey,
        },
        params: {
          query,
          ll: location,
          radius,
          categories: '13000', // Food category
          limit: 50,
        },
      });

      await this.trackApiUsage('foursquare', 'places-search');

      const restaurants = response.data.results.map((place: any) => ({
        name: place.name,
        address: place.location.address,
        city: place.location.locality,
        state: place.location.region,
        zipCode: place.location.postcode,
        latitude: place.geocodes.main.latitude,
        longitude: place.geocodes.main.longitude,
        phone: place.tel,
        website: place.website,
        rating: place.rating,
        reviewCount: place.stats?.total_ratings || 0,
        foursquareId: place.fsq_id,
        photos: place.photos?.map((photo: any) => 
          `${photo.prefix}400x400${photo.suffix}`
        ) || [],
        cuisine: place.categories?.map((cat: any) => cat.name).join(',') || 'African',
      }));

      return { success: true, data: restaurants };
    } catch (error) {
      logger.error('Foursquare API error:', error);
      return { success: false, error: 'Failed to fetch data from Foursquare' };
    }
  }

  // Helper methods
  private extractCityFromAddress(address: string): string {
    const parts = address.split(',');
    return parts[1]?.trim() || '';
  }

  private extractStateFromAddress(address: string): string {
    const parts = address.split(',');
    const stateZip = parts[2]?.trim() || '';
    return stateZip.split(' ')[0] || '';
  }

  private extractZipFromAddress(address: string): string {
    const parts = address.split(',');
    const stateZip = parts[2]?.trim() || '';
    const zipMatch = stateZip.match(/\d{5}(-\d{4})?/);
    return zipMatch ? zipMatch[0] : '';
  }

  private mapGooglePriceLevel(priceLevel: number): string {
    const mapping = {
      0: 'BUDGET',
      1: 'MODERATE',
      2: 'EXPENSIVE',
      3: 'VERY_EXPENSIVE',
      4: 'VERY_EXPENSIVE',
    };
    return mapping[priceLevel as keyof typeof mapping] || 'MODERATE';
  }

  // Get restaurant details from Google Places
  async getGooglePlaceDetails(placeId: string): Promise<ApiResponse> {
    try {
      if (!this.googleApiKey) {
        return { success: false, error: 'Google Places API key not configured' };
      }

      const canMakeRequest = await this.checkApiLimit('google', 'place-details');
      if (!canMakeRequest) {
        return { success: false, error: 'Google Places API daily limit reached' };
      }

      const response = await axios.get('https://maps.googleapis.com/maps/api/place/details/json', {
        params: {
          place_id: placeId,
          fields: 'name,formatted_address,formatted_phone_number,website,opening_hours,photos,reviews,rating,user_ratings_total,price_level',
          key: this.googleApiKey,
        },
      });

      await this.trackApiUsage('google', 'place-details');

      if (response.data.status === 'OK') {
        return { success: true, data: response.data.result };
      } else {
        return { success: false, error: response.data.error_message || 'Google Places API error' };
      }
    } catch (error) {
      logger.error('Google Places details API error:', error);
      return { success: false, error: 'Failed to fetch place details from Google Places' };
    }
  }
}

export const apiIntegrations = new ApiIntegrations();
export type { RestaurantData };
