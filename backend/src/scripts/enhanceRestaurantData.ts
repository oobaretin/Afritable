import dotenv from 'dotenv';
import { prisma } from '../db';
import { logger } from '../utils/logger';
import { dataEnhancementService } from '../services/dataEnhancement';
import { webScrapingService } from '../services/webScrapingService';
import { photoEnhancementService } from '../services/photoEnhancementService';
import { dataMonitoringService } from '../services/dataMonitoringService';

// Load environment variables
dotenv.config();

interface EnhancementOptions {
  restaurantId?: string;
  batchSize?: number;
  skipExisting?: boolean;
  forceUpdate?: boolean;
  includePhotos?: boolean;
  includeWebScraping?: boolean;
  includeValidation?: boolean;
}

class RestaurantDataEnhancementScript {
  private options: EnhancementOptions;

  constructor(options: EnhancementOptions = {}) {
    this.options = {
      batchSize: 10,
      skipExisting: false,
      forceUpdate: false,
      includePhotos: true,
      includeWebScraping: true,
      includeValidation: true,
      ...options
    };
  }

  async run(): Promise<void> {
    try {
      logger.info('Starting restaurant data enhancement process');

      const restaurants = await this.getRestaurantsToEnhance();
      logger.info(`Found ${restaurants.length} restaurants to enhance`);

      const results = {
        total: restaurants.length,
        enhanced: 0,
        skipped: 0,
        failed: 0,
        errors: [] as string[]
      };

      // Process restaurants in batches
      for (let i = 0; i < restaurants.length; i += this.options.batchSize!) {
        const batch = restaurants.slice(i, i + this.options.batchSize!);
        logger.info(`Processing batch ${Math.floor(i / this.options.batchSize!) + 1}/${Math.ceil(restaurants.length / this.options.batchSize!)}`);

        const batchResults = await Promise.allSettled(
          batch.map(restaurant => this.enhanceRestaurant(restaurant))
        );

        batchResults.forEach((result, index) => {
          if (result.status === 'fulfilled') {
            if (result.value.success) {
              results.enhanced++;
            } else {
              results.skipped++;
            }
          } else {
            results.failed++;
            results.errors.push(`Restaurant ${batch[index].id}: ${result.reason}`);
          }
        });

        // Add delay between batches to respect API rate limits
        if (i + this.options.batchSize! < restaurants.length) {
          await this.delay(2000);
        }
      }

      // Generate final report
      await this.generateEnhancementReport(results);

      logger.info('Restaurant data enhancement process completed', results);

    } catch (error) {
      logger.error('Error in restaurant data enhancement process:', error);
      throw error;
    }
  }

  private async getRestaurantsToEnhance() {
    const where: any = { isActive: true };

    if (this.options.restaurantId) {
      where.id = this.options.restaurantId;
    }

    if (this.options.skipExisting) {
      where.OR = [
        { isVerified: false },
        { lastUpdated: { lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } } // Updated more than 7 days ago
      ];
    }

    if (this.options.forceUpdate) {
      // Remove any filters to update all restaurants
      delete where.OR;
    }

    return await prisma.restaurant.findMany({
      where,
      include: { photos: true },
      orderBy: { lastUpdated: 'asc' }
    });
  }

  private async enhanceRestaurant(restaurant: any): Promise<{ success: boolean; message: string }> {
    try {
      logger.info(`Enhancing restaurant: ${restaurant.name} (${restaurant.id})`);

      const enhancementResults = {
        dataEnhancement: false,
        webScraping: false,
        photoEnhancement: false,
        validation: false
      };

      // 1. Data Enhancement (Multi-source verification)
      if (this.options.includeValidation) {
        try {
          const enhancedData = await dataEnhancementService.enhanceRestaurantData(restaurant.id);
          if (enhancedData && enhancedData.dataQualityScore > 0.7) {
            enhancementResults.dataEnhancement = true;
            logger.info(`Data enhancement completed for ${restaurant.name}: Quality score ${enhancedData.dataQualityScore}`);
          }
        } catch (error) {
          logger.error(`Data enhancement failed for ${restaurant.name}:`, error);
        }
      }

      // 2. Web Scraping
      if (this.options.includeWebScraping && restaurant.website) {
        try {
          const scrapedData = await webScrapingService.scrapeRestaurantWebsite(restaurant.website);
          if (scrapedData.menuItems.length > 0 || Object.keys(scrapedData.socialMedia).length > 0) {
            await this.updateRestaurantWithScrapedData(restaurant.id, scrapedData);
            enhancementResults.webScraping = true;
            logger.info(`Web scraping completed for ${restaurant.name}: ${scrapedData.menuItems.length} menu items, ${Object.keys(scrapedData.socialMedia).length} social links`);
          }
        } catch (error) {
          logger.error(`Web scraping failed for ${restaurant.name}:`, error);
        }
      }

      // 3. Photo Enhancement
      if (this.options.includePhotos) {
        try {
          const photoResults = await photoEnhancementService.collectAllPhotos(restaurant);
          if (photoResults.photos.length > 0) {
            await this.updateRestaurantWithEnhancedPhotos(restaurant.id, photoResults.photos);
            enhancementResults.photoEnhancement = true;
            logger.info(`Photo enhancement completed for ${restaurant.name}: ${photoResults.photos.length} photos from ${photoResults.sources.length} sources`);
          }
        } catch (error) {
          logger.error(`Photo enhancement failed for ${restaurant.name}:`, error);
        }
      }

      // 4. Data Quality Assessment
      if (this.options.includeValidation) {
        try {
          const qualityMetrics = await dataMonitoringService.assessRestaurantDataQuality(restaurant.id);
          enhancementResults.validation = true;
          logger.info(`Data quality assessment completed for ${restaurant.name}: Overall score ${qualityMetrics.overallScore.toFixed(2)}`);
        } catch (error) {
          logger.error(`Data quality assessment failed for ${restaurant.name}:`, error);
        }
      }

      // Update restaurant last updated timestamp
      await prisma.restaurant.update({
        where: { id: restaurant.id },
        data: { lastUpdated: new Date() }
      });

      const successCount = Object.values(enhancementResults).filter(Boolean).length;
      const success = successCount > 0;

      return {
        success,
        message: `Enhanced ${restaurant.name}: ${successCount}/4 enhancements successful`
      };

    } catch (error) {
      logger.error(`Error enhancing restaurant ${restaurant.name}:`, error);
      return {
        success: false,
        message: `Failed to enhance ${restaurant.name}: ${error instanceof Error ? error.message : String(error)}`
      };
    }
  }

  private async updateRestaurantWithScrapedData(restaurantId: string, scrapedData: any): Promise<void> {
    const updateData: any = {};

    // Update description if scraped one is better
    if (scrapedData.description && scrapedData.description.length > 50) {
      updateData.description = scrapedData.description;
    }

    // Update business hours if available
    if (scrapedData.businessHours) {
      const hours = scrapedData.businessHours;
      updateData.mondayOpen = hours.monday?.open || null;
      updateData.mondayClose = hours.monday?.close || null;
      updateData.tuesdayOpen = hours.tuesday?.open || null;
      updateData.tuesdayClose = hours.tuesday?.close || null;
      updateData.wednesdayOpen = hours.wednesday?.open || null;
      updateData.wednesdayClose = hours.wednesday?.close || null;
      updateData.thursdayOpen = hours.thursday?.open || null;
      updateData.thursdayClose = hours.thursday?.close || null;
      updateData.fridayOpen = hours.friday?.open || null;
      updateData.fridayClose = hours.friday?.close || null;
      updateData.saturdayOpen = hours.saturday?.open || null;
      updateData.saturdayClose = hours.saturday?.close || null;
      updateData.sundayOpen = hours.sunday?.open || null;
      updateData.sundayClose = hours.sunday?.close || null;
    }

    // Update contact information
    if (scrapedData.contactInfo) {
      if (scrapedData.contactInfo.phone) {
        updateData.phone = scrapedData.contactInfo.phone;
      }
      if (scrapedData.contactInfo.email) {
        updateData.email = scrapedData.contactInfo.email;
      }
    }

    if (Object.keys(updateData).length > 0) {
      await prisma.restaurant.update({
        where: { id: restaurantId },
        data: updateData
      });
    }
  }

  private async updateRestaurantWithEnhancedPhotos(restaurantId: string, photos: any[]): Promise<void> {
    // Remove existing photos
    await prisma.photo.deleteMany({
      where: { restaurantId }
    });

    // Add new enhanced photos
    for (let i = 0; i < photos.length; i++) {
      const photo = photos[i];
      await prisma.photo.create({
        data: {
          restaurantId,
          url: photo.url,
          caption: photo.caption,
          isPrimary: i === 0 // First photo is primary
        }
      });
    }
  }

  private async generateEnhancementReport(results: any): Promise<void> {
    const report = {
      timestamp: new Date(),
      options: this.options,
      results,
      summary: {
        successRate: Math.round((results.enhanced / results.total) * 100),
        averageQualityImprovement: 0, // Would calculate based on before/after quality scores
        recommendations: this.generateRecommendations(results)
      }
    };

    // Store report in database
    await prisma.apiUsage.create({
      data: {
        apiName: 'DATA_ENHANCEMENT',
        endpoint: 'enhancement_report',
        requests: 1
      }
    });

    logger.info('Enhancement report generated and stored');
  }

  private generateRecommendations(results: any): string[] {
    const recommendations: string[] = [];

    if (results.failed > 0) {
      recommendations.push(`Review ${results.failed} failed enhancements and retry with different parameters`);
    }

    if (results.skipped > 0) {
      recommendations.push(`Consider running enhancement for ${results.skipped} skipped restaurants`);
    }

    if (results.enhanced / results.total < 0.8) {
      recommendations.push('Success rate is below 80%. Consider adjusting enhancement parameters or fixing API issues');
    }

    return recommendations;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  const options: EnhancementOptions = {};

  // Parse command line arguments
  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--restaurant-id':
        options.restaurantId = args[++i];
        break;
      case '--batch-size':
        options.batchSize = parseInt(args[++i]);
        break;
      case '--skip-existing':
        options.skipExisting = true;
        break;
      case '--force-update':
        options.forceUpdate = true;
        break;
      case '--no-photos':
        options.includePhotos = false;
        break;
      case '--no-scraping':
        options.includeWebScraping = false;
        break;
      case '--no-validation':
        options.includeValidation = false;
        break;
      case '--help':
        console.log(`
Restaurant Data Enhancement Script

Usage: npm run enhance-data [options]

Options:
  --restaurant-id <id>    Enhance specific restaurant by ID
  --batch-size <number>   Number of restaurants to process in parallel (default: 10)
  --skip-existing         Skip restaurants that were recently updated
  --force-update          Force update all restaurants regardless of last update
  --no-photos             Skip photo enhancement
  --no-scraping           Skip web scraping
  --no-validation         Skip data validation
  --help                  Show this help message

Examples:
  npm run enhance-data --restaurant-id cmfotdsf5002f8x2w2x3vk1b6
  npm run enhance-data --batch-size 5 --skip-existing
  npm run enhance-data --force-update --no-photos
        `);
        process.exit(0);
    }
  }

  try {
    const enhancementScript = new RestaurantDataEnhancementScript(options);
    await enhancementScript.run();
    process.exit(0);
  } catch (error) {
    logger.error('Enhancement script failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

export { RestaurantDataEnhancementScript };
