import dotenv from 'dotenv';
import { apiIntegrations } from '../src/services/apiIntegrations';
import { logger } from '../src/utils/logger';

// Load environment variables
dotenv.config();

async function testApiKeys() {
  logger.info('Testing API keys...');

  const testLocation = '29.7604,-95.3698'; // Houston coordinates
  const testRadius = 1000; // 1km radius
  const testCuisine = 'Ethiopian restaurant';

  // Test Google Places API
  if (process.env.GOOGLE_PLACES_API_KEY) {
    logger.info('Testing Google Places API...');
    try {
      const result = await apiIntegrations.searchGooglePlaces(
        testCuisine,
        testLocation,
        testRadius
      );
      
      if (result.success) {
        logger.info(`✅ Google Places API working! Found ${result.data?.length || 0} restaurants`);
      } else {
        logger.error('❌ Google Places API failed:', result.error);
      }
    } catch (error) {
      logger.error('❌ Google Places API error:', error);
    }
  } else {
    logger.warn('⚠️  GOOGLE_PLACES_API_KEY not set');
  }

  // Test Yelp API
  if (process.env.YELP_API_KEY) {
    logger.info('Testing Yelp API...');
    try {
      const result = await apiIntegrations.searchYelpBusinesses(
        testCuisine,
        'Houston'
      );
      
      if (result.success) {
        logger.info(`✅ Yelp API working! Found ${result.data?.length || 0} restaurants`);
      } else {
        logger.error('❌ Yelp API failed:', result.error);
      }
    } catch (error) {
      logger.error('❌ Yelp API error:', error);
    }
  } else {
    logger.warn('⚠️  YELP_API_KEY not set');
  }

  // Test Foursquare API
  if (process.env.FOURSQUARE_API_KEY) {
    logger.info('Testing Foursquare API...');
    try {
      const result = await apiIntegrations.searchFoursquarePlaces(
        testCuisine,
        testLocation,
        testRadius
      );
      
      if (result.success) {
        logger.info(`✅ Foursquare API working! Found ${result.data?.length || 0} restaurants`);
      } else {
        logger.error('❌ Foursquare API failed:', result.error);
      }
    } catch (error) {
      logger.error('❌ Foursquare API error:', error);
    }
  } else {
    logger.warn('⚠️  FOURSQUARE_API_KEY not set');
  }

  logger.info('API key testing completed');
}

// Run the test
testApiKeys().catch(console.error);
