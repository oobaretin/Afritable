import dotenv from 'dotenv';
import { prisma } from '../db';
import { logger } from '../utils/logger';
import { apiIntegrations } from '../services/apiIntegrations';
import { metroAreas, MetroArea, Region } from '../data/metroAreas';

// Load environment variables
dotenv.config();

interface CollectionStats {
  metroArea: string;
  totalCollected: number;
  uniqueRestaurants: number;
  withPhotos: number;
  errors: string[];
}

export class MetroDataCollectionScript {
  private stats: CollectionStats[] = [];
  private allRestaurants: any[] = [];

  async run(): Promise<void> {
    try {
      logger.info('Starting comprehensive metro area data collection');

      // Collect from all metro areas
      for (const metroArea of metroAreas) {
        await this.collectMetroAreaData(metroArea);
        
        // Add delay between metro areas to respect API rate limits
        await this.delay(5000);
      }

      // Process and deduplicate all collected restaurants
      await this.processAndStoreRestaurants();

      // Generate final report
      this.generateCollectionReport();

      logger.info('Metro area data collection completed successfully');

    } catch (error) {
      logger.error('Error in metro area data collection:', error);
      throw error;
    }
  }

  private async collectMetroAreaData(metroArea: MetroArea): Promise<void> {
    try {
      logger.info(`Collecting data for ${metroArea.displayName}`);

      const metroStats: CollectionStats = {
        metroArea: metroArea.displayName,
        totalCollected: 0,
        uniqueRestaurants: 0,
        withPhotos: 0,
        errors: []
      };

      // Collect from each region in the metro area
      for (const region of metroArea.regions) {
        try {
          const regionRestaurants = await this.collectRegionData(region, metroArea);
          metroStats.totalCollected += regionRestaurants.length;
          this.allRestaurants.push(...regionRestaurants);
          
          // Add delay between regions
          await this.delay(2000);
        } catch (error) {
          const errorMsg = `Error collecting from ${region.name}: ${error instanceof Error ? error.message : String(error)}`;
          logger.error(errorMsg);
          metroStats.errors.push(errorMsg);
        }
      }

      this.stats.push(metroStats);
      logger.info(`Completed ${metroArea.displayName}: ${metroStats.totalCollected} restaurants collected`);

    } catch (error) {
      logger.error(`Error collecting data for ${metroArea.displayName}:`, error);
      throw error;
    }
  }

  private async collectRegionData(region: Region, metroArea: MetroArea): Promise<any[]> {
    const restaurants: any[] = [];
    const location = `${region.coordinates.latitude},${region.coordinates.longitude}`;
    const radius = Math.min(region.radius * 1609, 50000); // Convert miles to meters, max 50km

    // African cuisine search terms
    const searchTerms = [
      'African restaurant',
      'Ethiopian restaurant',
      'Nigerian restaurant',
      'Moroccan restaurant',
      'Egyptian restaurant',
      'Kenyan restaurant',
      'Ghanaian restaurant',
      'Senegalese restaurant',
      'Somali restaurant',
      'Sudanese restaurant',
      'West African restaurant',
      'East African restaurant',
      'North African restaurant',
      'Caribbean restaurant',
      'Jamaican restaurant',
      'Haitian restaurant',
      'Trinidadian restaurant'
    ];

    for (const searchTerm of searchTerms) {
      try {
        logger.info(`Searching for "${searchTerm}" in ${region.name}`);

        // Google Places search
        const googleResults = await apiIntegrations.searchGooglePlaces(
          searchTerm,
          location,
          radius
        );

        if (googleResults.success && googleResults.data) {
          restaurants.push(...googleResults.data.map((restaurant: any) => ({
            ...restaurant,
            metroArea: metroArea.id,
            region: region.id,
            source: 'google'
          })));
        }

        // Yelp search
        const yelpResults = await apiIntegrations.searchYelpBusinesses(
          searchTerm,
          location,
          radius
        );

        if (yelpResults.success && yelpResults.data) {
          restaurants.push(...yelpResults.data.map((restaurant: any) => ({
            ...restaurant,
            metroArea: metroArea.id,
            region: region.id,
            source: 'yelp'
          })));
        }

        // Foursquare search
        const foursquareResults = await apiIntegrations.searchFoursquarePlaces(
          searchTerm,
          location,
          radius
        );

        if (foursquareResults.success && foursquareResults.data) {
          restaurants.push(...foursquareResults.data.map((restaurant: any) => ({
            ...restaurant,
            metroArea: metroArea.id,
            region: region.id,
            source: 'foursquare'
          })));
        }

        // Add delay between search terms
        await this.delay(1000);

      } catch (error) {
        logger.error(`Error searching for "${searchTerm}" in ${region.name}:`, error);
      }
    }

    return restaurants;
  }

  private async processAndStoreRestaurants(): Promise<void> {
    logger.info(`Processing ${this.allRestaurants.length} collected restaurants`);

    // Deduplicate restaurants based on name and address
    const uniqueRestaurants = this.deduplicateRestaurants(this.allRestaurants);
    logger.info(`Found ${uniqueRestaurants.length} unique restaurants after deduplication`);

    // Store restaurants in database
    let storedCount = 0;
    for (const restaurant of uniqueRestaurants) {
      try {
        await this.storeRestaurant(restaurant);
        storedCount++;
      } catch (error) {
        logger.error(`Error storing restaurant ${restaurant.name}:`, error);
      }
    }

    logger.info(`Successfully stored ${storedCount} restaurants`);
  }

  private deduplicateRestaurants(restaurants: any[]): any[] {
    const seen = new Set<string>();
    const unique: any[] = [];

    for (const restaurant of restaurants) {
      // Create a key based on name and address
      const key = `${restaurant.name.toLowerCase().trim()}_${restaurant.address.toLowerCase().trim()}`;
      
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(restaurant);
      }
    }

    return unique;
  }

  private async storeRestaurant(restaurantData: any): Promise<void> {
    try {
      // Check if restaurant already exists
      const existing = await prisma.restaurant.findFirst({
        where: {
          name: restaurantData.name,
          address: restaurantData.address
        }
      });

      if (existing) {
        // Update existing restaurant with additional data
        await prisma.restaurant.update({
          where: { id: existing.id },
          data: {
            googlePlaceId: restaurantData.googlePlaceId || existing.googlePlaceId,
            yelpBusinessId: restaurantData.yelpBusinessId || existing.yelpBusinessId,
            foursquareId: restaurantData.foursquareId || existing.foursquareId,
            phone: restaurantData.phone || existing.phone,
            website: restaurantData.website || existing.website,
            rating: restaurantData.rating || existing.rating,
            reviewCount: restaurantData.reviewCount || existing.reviewCount,
            lastUpdated: new Date()
          }
        });
      } else {
        // Create new restaurant
        await prisma.restaurant.create({
          data: {
            name: restaurantData.name,
            description: restaurantData.description || '',
            cuisine: restaurantData.cuisine || 'African',
            address: restaurantData.address,
            city: restaurantData.city,
            state: restaurantData.state,
            zipCode: restaurantData.zipCode || '',
            country: restaurantData.country || 'US',
            latitude: restaurantData.latitude,
            longitude: restaurantData.longitude,
            phone: restaurantData.phone,
            website: restaurantData.website,
            email: restaurantData.email,
            priceRange: restaurantData.priceRange || 'MODERATE',
            rating: restaurantData.rating || 0,
            reviewCount: restaurantData.reviewCount || 0,
            googlePlaceId: restaurantData.googlePlaceId,
            yelpBusinessId: restaurantData.yelpBusinessId,
            foursquareId: restaurantData.foursquareId,
            dataSource: restaurantData.source?.toUpperCase() || 'MANUAL',
            isActive: true,
            isVerified: false
          }
        });
      }
    } catch (error) {
      logger.error(`Error storing restaurant ${restaurantData.name}:`, error);
      throw error;
    }
  }

  private generateCollectionReport(): void {
    const totalCollected = this.stats.reduce((sum, stat) => sum + stat.totalCollected, 0);
    const totalUnique = this.allRestaurants.length;
    const totalWithPhotos = this.stats.reduce((sum, stat) => sum + stat.withPhotos, 0);

    const report = {
      timestamp: new Date(),
      summary: {
        totalMetroAreas: this.stats.length,
        totalCollected,
        totalUnique,
        totalWithPhotos,
        averagePerMetro: Math.round(totalCollected / this.stats.length)
      },
      metroAreaStats: this.stats,
      recommendations: this.generateRecommendations()
    };

    logger.info('Collection Report:', report);
  }

  private generateRecommendations(): string[] {
    const recommendations: string[] = [];

    const lowCollectionMetros = this.stats.filter(stat => stat.totalCollected < 50);
    if (lowCollectionMetros.length > 0) {
      recommendations.push(`Consider additional searches for: ${lowCollectionMetros.map(s => s.metroArea).join(', ')}`);
    }

    const errorCount = this.stats.reduce((sum, stat) => sum + stat.errors.length, 0);
    if (errorCount > 0) {
      recommendations.push(`Review ${errorCount} collection errors and retry failed searches`);
    }

    if (this.allRestaurants.length < 1000) {
      recommendations.push('Consider expanding search terms or adding more metro areas');
    }

    return recommendations;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// CLI interface
async function main() {
  try {
    const collectionScript = new MetroDataCollectionScript();
    await collectionScript.run();
    process.exit(0);
  } catch (error) {
    logger.error('Metro data collection failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}
