import { apiIntegrations, RestaurantData } from './apiIntegrations';
import { prisma } from '../index';
import { logger } from '../utils/logger';

interface MetroArea {
  name: string;
  center: string; // lat,lng
  radius: number;
  zipCodes: string[];
}

class RestaurantDataCollection {
  private metroAreas: MetroArea[] = [
    {
      name: 'Houston',
      center: '29.7604,-95.3698',
      radius: 35000,
      zipCodes: ['77001', '77002', '77003', '77004', '77005', '77006', '77007', '77008', '77009', '77010']
    },
    {
      name: 'NYC',
      center: '40.7128,-74.0060',
      radius: 25000,
      zipCodes: ['10001', '10002', '10003', '10004', '10005', '10006', '10007', '10008', '10009', '10010']
    },
    {
      name: 'DC',
      center: '38.9072,-77.0369',
      radius: 30000,
      zipCodes: ['20001', '20002', '20003', '20004', '20005', '20006', '20007', '20008', '20009', '20010']
    },
    {
      name: 'Atlanta',
      center: '33.7490,-84.3880',
      radius: 28000,
      zipCodes: ['30301', '30302', '30303', '30304', '30305', '30306', '30307', '30308', '30309', '30310']
    },
    {
      name: 'LA',
      center: '34.0522,-118.2437',
      radius: 40000,
      zipCodes: ['90001', '90002', '90003', '90004', '90005', '90006', '90007', '90008', '90009', '90010']
    }
  ];

  private africanCuisineTerms = [
    'Ethiopian restaurant',
    'Nigerian restaurant',
    'Moroccan restaurant',
    'West African restaurant',
    'East African restaurant',
    'Somali restaurant',
    'Sudanese restaurant',
    'African restaurant',
    'Ghanaian restaurant',
    'Senegalese restaurant',
    'Kenyan restaurant',
    'Tanzanian restaurant',
    'Ugandan restaurant',
    'Rwandan restaurant',
    'Cameroonian restaurant',
    'Ivorian restaurant',
    'Malian restaurant',
    'Burkina Faso restaurant',
    'Niger restaurant',
    'Chadian restaurant',
    'Central African restaurant',
    'Congolese restaurant',
    'Angolan restaurant',
    'Zambian restaurant',
    'Zimbabwean restaurant',
    'Botswana restaurant',
    'Namibian restaurant',
    'South African restaurant',
    'Lesotho restaurant',
    'Swaziland restaurant',
    'Malawian restaurant',
    'Mozambican restaurant',
    'Madagascar restaurant',
    'Mauritius restaurant',
    'Seychelles restaurant',
    'Comoros restaurant',
    'Djibouti restaurant',
    'Eritrean restaurant',
    'Libyan restaurant',
    'Tunisian restaurant',
    'Algerian restaurant',
    'Egyptian restaurant'
  ];

  async collectRestaurantData(): Promise<void> {
    logger.info('Starting restaurant data collection...');

    for (const metro of this.metroAreas) {
      logger.info(`Collecting data for ${metro.name} metro area...`);
      
      try {
        await this.collectForMetro(metro);
        // Add delay between metros to respect rate limits
        await this.delay(5000);
      } catch (error) {
        logger.error(`Error collecting data for ${metro.name}:`, error);
      }
    }

    logger.info('Restaurant data collection completed');
  }

  private async collectForMetro(metro: MetroArea): Promise<void> {
    const allRestaurants: RestaurantData[] = [];

    // Collect from Google Places
    for (const cuisine of this.africanCuisineTerms) {
      try {
        const result = await apiIntegrations.searchGooglePlaces(
          cuisine,
          metro.center,
          metro.radius
        );

        if (result.success && result.data) {
          allRestaurants.push(...result.data);
        }

        // Add delay between requests
        await this.delay(1000);
      } catch (error) {
        logger.error(`Error searching Google Places for ${cuisine} in ${metro.name}:`, error);
      }
    }

    // Collect from Yelp
    for (const cuisine of this.africanCuisineTerms) {
      try {
        const result = await apiIntegrations.searchYelpBusinesses(
          cuisine,
          metro.name
        );

        if (result.success && result.data) {
          allRestaurants.push(...result.data);
        }

        // Add delay between requests
        await this.delay(1000);
      } catch (error) {
        logger.error(`Error searching Yelp for ${cuisine} in ${metro.name}:`, error);
      }
    }

    // Collect from Foursquare
    for (const cuisine of this.africanCuisineTerms) {
      try {
        const result = await apiIntegrations.searchFoursquarePlaces(
          cuisine,
          metro.center,
          metro.radius
        );

        if (result.success && result.data) {
          allRestaurants.push(...result.data);
        }

        // Add delay between requests
        await this.delay(1000);
      } catch (error) {
        logger.error(`Error searching Foursquare for ${cuisine} in ${metro.name}:`, error);
      }
    }

    // Process and save restaurants
    await this.processAndSaveRestaurants(allRestaurants, metro.name);
  }

  private async processAndSaveRestaurants(restaurants: RestaurantData[], metroName: string): Promise<void> {
    const processedRestaurants = this.deduplicateRestaurants(restaurants);
    
    logger.info(`Processing ${processedRestaurants.length} unique restaurants for ${metroName}`);

    for (const restaurant of processedRestaurants) {
      try {
        await this.saveRestaurant(restaurant);
      } catch (error) {
        logger.error(`Error saving restaurant ${restaurant.name}:`, error);
      }
    }
  }

  private deduplicateRestaurants(restaurants: RestaurantData[]): RestaurantData[] {
    const seen = new Set<string>();
    const unique: RestaurantData[] = [];

    for (const restaurant of restaurants) {
      // Create a unique key based on name and location
      const key = `${restaurant.name.toLowerCase()}-${restaurant.latitude}-${restaurant.longitude}`;
      
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(restaurant);
      }
    }

    return unique;
  }

  private async saveRestaurant(restaurantData: RestaurantData): Promise<void> {
    try {
      // Check if restaurant already exists
      const existing = await prisma.restaurant.findFirst({
        where: {
          OR: [
            { googlePlaceId: restaurantData.placeId },
            { yelpBusinessId: restaurantData.businessId },
            { foursquareId: restaurantData.foursquareId },
            {
              AND: [
                { name: restaurantData.name },
                { latitude: restaurantData.latitude },
                { longitude: restaurantData.longitude }
              ]
            }
          ]
        }
      });

      if (existing) {
        // Update existing restaurant
        await prisma.restaurant.update({
          where: { id: existing.id },
          data: {
            rating: restaurantData.rating || existing.rating,
            reviewCount: restaurantData.reviewCount || existing.reviewCount,
            phone: restaurantData.phone || existing.phone,
            website: restaurantData.website || existing.website,
            lastUpdated: new Date(),
          }
        });
        return;
      }

      // Create new restaurant
      const restaurant = await prisma.restaurant.create({
        data: {
          name: restaurantData.name,
          address: restaurantData.address,
          city: restaurantData.city,
          state: restaurantData.state,
          zipCode: restaurantData.zipCode,
          latitude: restaurantData.latitude,
          longitude: restaurantData.longitude,
          phone: restaurantData.phone,
          website: restaurantData.website,
          rating: restaurantData.rating || 0,
          reviewCount: restaurantData.reviewCount || 0,
          priceRange: this.mapPriceRange(restaurantData.priceRange),
          googlePlaceId: restaurantData.placeId,
          yelpBusinessId: restaurantData.businessId,
          foursquareId: restaurantData.foursquareId,
          dataSource: this.determineDataSource(restaurantData),
          cuisine: restaurantData.cuisine || ['African'],
        }
      });

      // Save photos if available
      if (restaurantData.photos && restaurantData.photos.length > 0) {
        for (const [index, photoUrl] of restaurantData.photos.entries()) {
          await prisma.photo.create({
            data: {
              restaurantId: restaurant.id,
              url: photoUrl,
              isPrimary: index === 0,
            }
          });
        }
      }

      logger.info(`Saved restaurant: ${restaurant.name}`);
    } catch (error) {
      logger.error(`Error saving restaurant ${restaurantData.name}:`, error);
      throw error;
    }
  }

  private mapPriceRange(priceRange?: string): string {
    if (!priceRange) return 'MODERATE';
    
    const mapping: { [key: string]: string } = {
      '$': 'BUDGET',
      '$$': 'MODERATE',
      '$$$': 'EXPENSIVE',
      '$$$$': 'VERY_EXPENSIVE',
      'BUDGET': 'BUDGET',
      'MODERATE': 'MODERATE',
      'EXPENSIVE': 'EXPENSIVE',
      'VERY_EXPENSIVE': 'VERY_EXPENSIVE',
    };

    return mapping[priceRange] || 'MODERATE';
  }

  private determineDataSource(restaurantData: RestaurantData): string {
    if (restaurantData.placeId) return 'GOOGLE_PLACES';
    if (restaurantData.businessId) return 'YELP';
    if (restaurantData.foursquareId) return 'FOURSQUARE';
    return 'MANUAL';
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const restaurantDataCollection = new RestaurantDataCollection();
